// Offline local Chromium capture. Uses Node built-ins and CDP pipes, no server.
import { spawn } from 'node:child_process';
import { mkdtemp, readFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const profile = await mkdtemp(path.join(tmpdir(), 'profile-research-chrome-'));
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

const describe = `(()=>{
  const rect=e=>{const r=e.getBoundingClientRect();return {x:r.x+scrollX,y:r.y+scrollY,width:r.width,height:r.height}};
  const article=document.querySelector('article'),first=article.querySelector('picture'),headings=[...article.querySelectorAll('h2')],tools=headings.find(e=>/things on the desk|familiar tools/.test(e.textContent));
  const main=document.querySelector('main'),r=rect(article),top=rect(first).y+rect(first).height+12;
  return {full:{x:0,y:0,width:innerWidth,height:document.documentElement.scrollHeight},readme:rect(main),middle:{x:r.x,y:top,width:r.width,height:rect(tools).y-top},hero:rect(first),overflow:document.documentElement.scrollWidth>innerWidth,codeOverflow:[...article.querySelectorAll('pre')].some(e=>e.scrollWidth>e.clientWidth+1),broken:[...document.images].filter(i=>!i.complete||!i.naturalWidth).map(i=>i.getAttribute('src')),sources:[...article.querySelectorAll('picture img')].map(i=>i.currentSrc)};
})()`;

try {
  const {targetId}=await send('Target.createTarget',{url:'about:blank'});
  ({sessionId:session}=await send('Target.attachToTarget',{targetId,flatten:true}));
  await send('Page.enable',{},session);
  await send('Network.enable',{},session);
  await send('Network.setBlockedURLs',{urls:['http://*','https://*']},session);
  const variants=process.argv.slice(2).length?process.argv.slice(2):['journal','source'];
  for(const name of variants) {
    for(const theme of ['light','dark']) {
      const folder=path.join(root,name);
      for(const width of [1440,430,375]) {
        await navigate(path.join(folder,`preview-${theme}.html`),width,theme,1000,1000);
        const layout=await evaluate(describe);
        if(layout.overflow||layout.codeOverflow||layout.broken.length)throw new Error(`${name}/${theme}/${width}: ${JSON.stringify(layout)}`);
        if(theme==='dark'&&!layout.sources.every(s=>s.includes('dark.svg')))throw new Error('Dark source selection failed: '+JSON.stringify(layout.sources));
        if(width<600&&!layout.sources[0].includes('mobile'))throw new Error('Mobile source selection failed.');
        if(width===1440) {
          for(const view of ['full','readme','middle'])await screenshot(path.join(folder,`${view}-${theme}.png`),layout[view]);
          if(theme==='light') {
            const frame1=await send('Page.captureScreenshot',{format:'png',clip:{...layout.hero,scale:1}},session);
            await new Promise(r=>setTimeout(r,1100));
            const frame2=await send('Page.captureScreenshot',{format:'png',clip:{...layout.hero,scale:1}},session);
            if(frame1.data===frame2.data)throw new Error(`${name}: animation frames identical.`);
          }
          if(name==='source'&&theme==='light') {
            const opened=await evaluate(`(()=>{document.querySelector('summary').click();return document.querySelector('details').open})()`);
            if(!opened)throw new Error('C++ note did not expand.');
          }
        } else if(width===430)await screenshot(path.join(folder,`mobile-${theme}.png`),layout.full);
        console.log(`${name}/${theme}/${width}: loaded; no page or code overflow.`);
      }
    }
  }
  // Browser text measurements for each distinct new SVG layout (colors share geometry).
  for(const [name,files] of [['journal',['folio-light.svg','folio-mobile-light.svg','theme-note-light.svg','theme-note-mobile-light.svg']],['source',['code-intro-light.svg','code-intro-mobile-light.svg','terminal-theme-light.svg','terminal-theme-mobile-light.svg']]]) {
    if(!variants.includes(name))continue;
    for(const file of files) {
      const raw=await readFile(path.join(root,name,'assets',file),'utf8');
      const clipped=await evaluate(`(()=>{const host=document.createElement('div');host.style.cssText='position:absolute;left:0;top:0;visibility:hidden';host.innerHTML=${JSON.stringify(raw)};document.body.append(host);const b=host.querySelector('svg').getBoundingClientRect();const bad=[...host.querySelectorAll('text')].filter(t=>{const r=t.getBoundingClientRect();return r.left<b.left-1||r.right>b.right+1||r.top<b.top-1||r.bottom>b.bottom+1}).map(t=>t.textContent);host.remove();return bad})()`);
      if(clipped.length)throw new Error(`${file}: clipped text ${JSON.stringify(clipped)}`);
    }
  }
  await navigate(path.join(root,'index.html'),2100,'light',1000,300);
  await evaluate(`Promise.all([...document.images].map(i=>i.decode())).then(()=>true)`);
  const boardRect=()=>evaluate(`({x:0,y:0,width:innerWidth,height:document.querySelector('footer').getBoundingClientRect().bottom})`);
  await screenshot(path.join(root,'comparison-light.png'),await boardRect());
  await evaluate(`document.querySelector('[data-view="middle"]').click()`);
  await evaluate(`Promise.all([...document.images].map(i=>i.decode())).then(()=>true)`);
  await screenshot(path.join(root,'comparison-middle.png'),await boardRect());
  await evaluate(`document.querySelector('[data-theme="dark"]').click();document.getElementById('left').value='baseline';document.getElementById('left').dispatchEvent(new Event('change'));`);
  await evaluate(`Promise.all([...document.images].map(i=>i.decode())).then(()=>true)`);
  const board=await evaluate(`({dark:document.body.classList.contains('dark'),left:document.getElementById('left-image').getAttribute('src'),right:document.getElementById('right-image').getAttribute('src')})`);
  if(!board.dark||!board.left.includes('baseline/middle-dark.png')||!board.right.includes('source/middle-dark.png'))throw new Error('Comparison controls failed.');
  console.log('Both animations, native details, SVG text and comparison controls checked.');
} finally {
  try{await send('Browser.close')}catch{}
  browser.kill();
  await rm(profile,{recursive:true,force:true});
}
