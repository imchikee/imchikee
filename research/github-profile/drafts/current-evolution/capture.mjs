// Offline local Chromium capture. Uses Node built-ins and CDP pipes, no server.
import { spawn } from 'node:child_process';
import { mkdtemp, readFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const profile = await mkdtemp(path.join(tmpdir(), 'profile-evolution-chrome-'));
const browser = spawn(process.env.PROFILE_CHROME || '/opt/google/chrome/chrome', [
  '--headless', '--disable-gpu', '--no-first-run', '--no-default-browser-check',
  '--disable-background-networking', '--disable-component-update', '--disable-sync',
  '--disable-extensions', '--metrics-recording-only', '--disable-crash-reporter',
  '--host-resolver-rules=MAP * ~NOTFOUND', '--remote-debugging-pipe',
  `--user-data-dir=${profile}`, 'about:blank',
], { stdio: ['ignore', 'ignore', 'pipe', 'pipe', 'pipe'] });

let stderr = '', buffer = '', sequence = 0;
browser.stderr.on('data', chunk => { stderr = (stderr + chunk).slice(-6000); });
const pending = new Map();
// Pipe errors can precede the process exit when the OS denies browser startup.
for (const pipe of [browser.stdio[3], browser.stdio[4]]) pipe.on('error', () => {});
browser.stdio[4].on('data', chunk => {
  buffer += chunk.toString();
  let index;
  while ((index = buffer.indexOf('\0')) >= 0) {
    const part = buffer.slice(0, index);
    buffer = buffer.slice(index + 1);
    if (!part) continue;
    const message = JSON.parse(part);
    const request = pending.get(message.id);
    if (request) {
      clearTimeout(request.timer);
      pending.delete(message.id);
      if (message.error) request.reject(new Error(JSON.stringify(message.error)));
      else request.resolve(message.result);
    }
  }
});
browser.on('exit', code => {
  for (const { reject, timer } of pending.values()) {
    clearTimeout(timer);
    reject(new Error(`Browser exited ${code}: ${stderr}`));
  }
  pending.clear();
});

function send(method, params = {}, sessionId) {
  return new Promise((resolve, reject) => {
    const id = ++sequence;
    const timer = setTimeout(() => {
      pending.delete(id);
      reject(new Error(`CDP timeout: ${method}; ${stderr}`));
    }, 20000);
    pending.set(id, { resolve, reject, timer });
    browser.stdio[3].write(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }) + '\0');
  });
}

let session;
async function evaluate(expression) {
  const result = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true }, session);
  if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails));
  return result.result.value;
}

async function navigate(file, width, theme, height = 1000, settleMs = 2800) {
  await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: false }, session);
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: theme }] }, session);
  const response = await send('Page.navigate', { url: pathToFileURL(file).href }, session);
  if (response.errorText) throw new Error(response.errorText);
  for (let i = 0; i < 50; i++) {
    if (await evaluate(`document.readyState === 'complete' && document.querySelector('main, header') !== null`)) break;
    await new Promise(resolve => setTimeout(resolve, 50));
  }
  await evaluate(`(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));return true})()`);
  await new Promise(resolve => setTimeout(resolve, settleMs));
}

async function screenshot(file, clip) {
  const result = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true, clip: { ...clip, scale: 1 } }, session);
  await writeFile(file, Buffer.from(result.data, 'base64'));
}

const geometry = `(()=>{
  const rect=e=>{const r=e.getBoundingClientRect();return {x:r.x+scrollX,y:r.y+scrollY,width:r.width,height:r.height}};
  const article=document.querySelector('article'), headings=[...article.querySelectorAll('h2')], cards=article.querySelector('img[src$="engineering.svg"]').closest('p');
  return {page:{x:0,y:0,width:innerWidth,height:document.documentElement.scrollHeight},readme:rect(document.querySelector('main')),middle:{x:rect(article).x,y:rect(headings[0]).y,width:rect(article).width,height:rect(cards).y+rect(cards).height-rect(headings[0]).y+18},overflow:document.documentElement.scrollWidth>innerWidth,broken:[...document.images].filter(i=>!i.complete||!i.naturalWidth).map(i=>i.getAttribute('src')),cards:[...cards.querySelectorAll('img')].map(rect),hero:article.querySelector('img').currentSrc,snake:article.querySelector('picture:last-child img').currentSrc};
})()`;

const boardsOnly = process.argv.includes('--boards-only');
const report = boardsOnly ? JSON.parse(await readFile(path.join(root, 'checks.json'), 'utf8')).filter(x => !x.comparisonControls) : [];
try {
  const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
  ({ sessionId: session } = await send('Target.attachToTarget', { targetId, flatten: true }));
  await send('Page.enable', {}, session);
  // Reject remote requests as an extra offline guard, including subresources.
  await send('Network.enable', {}, session);
  await send('Network.setBlockedURLs', { urls: ['http://*', 'https://*'] }, session);

  if (!boardsOnly) {
  for (const [name, folder] of [['baseline', path.join(root, 'baseline')], ['proposal', root]]) {
    for (const theme of ['light', 'dark']) {
      await navigate(path.join(folder, `preview-${theme}.html`), 1440, theme);
      const desktop = await evaluate(geometry);
      report.push({ name, theme, viewport: 1440, ...desktop });
      if (desktop.overflow || desktop.broken.length) throw new Error(`Desktop image/overflow failure: ${JSON.stringify(desktop)}`);
      for (const [kind, clip] of [['full', desktop.page], ['readme', desktop.readme], ['middle', desktop.middle]]) {
        await screenshot(path.join(folder, `${kind}-${theme}.png`), clip);
      }
      await navigate(path.join(folder, `preview-${theme}.html`), 430, theme);
      const mobile = await evaluate(geometry);
      report.push({ name, theme, viewport: 430, ...mobile });
      if (mobile.overflow || mobile.broken.length) throw new Error(`Mobile image/overflow failure: ${JSON.stringify(mobile)}`);
      if (name === 'proposal' && mobile.cards[1].y <= mobile.cards[0].y + 10) throw new Error('Mobile cards did not stack.');
      if (name === 'proposal' && !mobile.hero.includes('header-mobile.svg')) throw new Error('Mobile banner not selected.');
      if (theme === 'dark' && !mobile.snake.includes('contributions-dark.svg')) throw new Error('Dark snake not selected.');
      await screenshot(path.join(folder, `mobile-${theme}.png`), mobile.page);
      console.log(`${name} ${theme}: desktop and mobile captured; images and width checked.`);
    }
  }

  // Check intermediate widths, where two fixed-width inline images can wrap.
  for (const width of [375, 768, 1024, 1280]) {
    await navigate(path.join(root, 'preview-light.html'), width, 'light');
    const result = await evaluate(geometry);
    if (result.overflow || result.broken.length) throw new Error(`Width ${width} failure: ${JSON.stringify(result)}`);
    report.push({ name: 'proposal', theme: 'light', viewport: width, ...result });
  }

  // Measure SVG text using the same browser/font renderer as the preview.
  // These checks detect clipped text; they do not replace visual inspection.
  for (const name of ['header.svg', 'header-mobile.svg', 'engineering.svg', 'workbench.svg']) {
    const raw = await readFile(path.join(root, 'assets', name), 'utf8');
    const result = await evaluate(`(()=>{
      const host=document.createElement('div');host.style.cssText='position:absolute;left:0;top:0;visibility:hidden';host.innerHTML=${JSON.stringify(raw)};document.body.append(host);
      const svg=host.querySelector('svg'),box=svg.getBoundingClientRect();
      const clipped=[...svg.querySelectorAll('text')].flatMap(t=>{const r=t.getBoundingClientRect();return r.left<box.left-1||r.right>box.right+1||r.top<box.top-1||r.bottom>box.bottom+1?[{text:t.textContent,x:r.x-box.x,right:r.right-box.x}]:[]});host.remove();return clipped;
    })()`);
    if (result.length) throw new Error(`${name}: clipped text ${JSON.stringify(result)}`);
    report.push({ svg: name, clippedText: result });
  }

  // Save comparable evidence that the banner really changes over time.
  await navigate(path.join(root, 'preview-light.html'), 1440, 'light', 1000, 150);
  const heroRect = await evaluate(`(()=>{const r=document.querySelector('article img').getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height}})()`);
  await screenshot(path.join(root, 'animation-frame-1.png'), heroRect);
  await new Promise(resolve => setTimeout(resolve, 1800));
  await screenshot(path.join(root, 'animation-frame-2.png'), heroRect);
  const a = await readFile(path.join(root, 'animation-frame-1.png'));
  const b = await readFile(path.join(root, 'animation-frame-2.png'));
  if (a.equals(b)) throw new Error('Banner animation frames were identical.');
  report.push({ animationFramesDiffer: true, separationMs: 1800, comparisonSettleMs: 2800 });
  }

  // Check comparison controls and save two useful boards.
  await navigate(path.join(root, 'index.html'), 2100, 'light', 1400);
  const controls = await evaluate(`(()=>{document.querySelector('[data-theme="dark"]').click();document.querySelector('[data-view="middle"]').click();return {theme:document.body.classList.contains('dark'),old:document.getElementById('old').getAttribute('src'),fresh:document.getElementById('new').getAttribute('src')}})()`);
  if (!controls.theme || !controls.old.includes('middle-dark') || !controls.fresh.includes('middle-dark')) throw new Error('Comparison controls failed.');
  report.push({ comparisonControls: controls });
  await evaluate(`document.querySelector('[data-theme="light"]').click();document.querySelector('[data-view="readme"]').click()`);
  await evaluate(`Promise.all([...document.images].map(i=>i.decode())).then(()=>true)`);
  let clip = await evaluate(`({x:0,y:0,width:innerWidth,height:document.querySelector('footer').getBoundingClientRect().bottom})`);
  await screenshot(path.join(root, 'comparison-light.png'), clip);
  await evaluate(`document.querySelector('[data-view="middle"]').click()`);
  await evaluate(`Promise.all([...document.images].map(i=>i.decode())).then(()=>true)`);
  clip = await evaluate(`({x:0,y:0,width:innerWidth,height:document.querySelector('footer').getBoundingClientRect().bottom})`);
  await screenshot(path.join(root, 'comparison-middle.png'), clip);
  await writeFile(path.join(root, 'checks.json'), JSON.stringify(report, null, 2) + '\n');
  console.log(boardsOnly ? 'Comparison boards refreshed and controls checked.' : 'Intermediate widths, SVG text, banner animation and comparison controls checked.');
} finally {
  try { await send('Browser.close'); } catch { /* process may close before replying */ }
  browser.kill();
  await rm(profile, { recursive: true, force: true });
}
