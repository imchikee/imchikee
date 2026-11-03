// Offline local Chromium capture. Uses Node built-ins and CDP pipes, no server.
import { spawn } from 'node:child_process';
import { mkdtemp, readFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const profile = await mkdtemp(path.join(tmpdir(), 'profile-personal-chrome-'));
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

const describe=`(()=>{
  const rect=e=>{const r=e.getBoundingClientRect();return {x:r.x+scrollX,y:r.y+scrollY,width:r.width,height:r.height}};
  const article=document.querySelector('article');return {page:{x:0,y:0,width:innerWidth,height:document.documentElement.scrollHeight},readme:rect(document.querySelector('main')),hero:rect(article.querySelector('picture')),overflow:document.documentElement.scrollWidth>innerWidth,broken:[...document.images].filter(i=>!i.complete||!i.naturalWidth).map(i=>i.getAttribute('src')),sources:[...article.querySelectorAll('picture img')].map(i=>i.currentSrc)};
})()`;
try {
  const {targetId}=await send('Target.createTarget',{url:'about:blank'});
  ({sessionId:session}=await send('Target.attachToTarget',{targetId,flatten:true}));
  await send('Page.enable',{},session);
  await send('Network.enable',{},session);
  await send('Network.setBlockedURLs',{urls:['http://*','https://*']},session);
  for(const theme of ['light','dark']) {
    for(const width of [1440,430,375]) {
      await navigate(path.join(root,`preview-${theme}.html`),width,theme,1000,theme==='light'&&width===1440?600:3500);
      const layout=await evaluate(describe);
      if(layout.overflow||layout.broken.length)throw new Error(`${theme}/${width}: ${JSON.stringify(layout)}`);
      if(theme==='dark'&&!layout.sources.every(s=>/-dark(?:-still)?\.(?:svg|png|gif)$/.test(s)))throw new Error('Dark artwork not selected.');
      if(width<600&&!layout.sources.slice(0,3).every(s=>s.includes('mobile')))throw new Error('Mobile artwork not selected.');
      if(width===1440) {
        if(theme==='light') {
          const frame1=await send('Page.captureScreenshot',{format:'png',clip:{...layout.hero,scale:1}},session);
          await new Promise(r=>setTimeout(r,2700));
          const frame2=await send('Page.captureScreenshot',{format:'png',clip:{...layout.hero,scale:1}},session);
          if(frame1.data===frame2.data)throw new Error('Hero animation did not change.');
        }
        // Use the final-pose source for review screenshots; GIF clock phases
        // can differ between consecutive full-page and cropped captures.
        await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-color-scheme',value:theme},{name:'prefers-reduced-motion',value:'reduce'}]},session);
        await evaluate(`new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))).then(()=>Promise.all([...document.images].map(i=>i.decode().catch(()=>{})))).then(()=>true)`);
        await screenshot(path.join(root,`full-${theme}.png`),layout.page);
        await screenshot(path.join(root,`readme-${theme}.png`),layout.readme);
        await screenshot(path.join(root,`hero-${theme}.png`),layout.hero);
        if(theme==='light') {
          const opens=await evaluate(`(()=>{document.querySelector('summary').click();return document.querySelector('details').open})()`);
          if(!opens)throw new Error('Book note did not expand.');
        }
      } else if(width===430) {
        await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-color-scheme',value:theme},{name:'prefers-reduced-motion',value:'reduce'}]},session);
        await evaluate(`new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))).then(()=>Promise.all([...document.images].map(i=>i.decode().catch(()=>{})))).then(()=>true)`);
        await screenshot(path.join(root,`mobile-${theme}.png`),layout.page);
      }
      console.log(`${theme}/${width}: images, viewport and theme checked.`);
    }
  }
  // The README should select a static final pose for reduced-motion requests.
  for(const theme of ['light','dark']) {
    await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-color-scheme',value:theme},{name:'prefers-reduced-motion',value:'reduce'}]},session);
    await send('Page.reload',{},session);
    await new Promise(r=>setTimeout(r,500));
    const source=await evaluate(`document.querySelector('article picture img').currentSrc`);
    if(!source.endsWith(`hero-mobile-${theme}-still.png`))throw new Error('Reduced-motion source was not selected: '+source);
  }
  // Preview controls must manipulate the actual SVG timeline.
  await navigate(path.join(root,'animation.html'),900,'light',850,100);
  const controls=await evaluate(`(()=>{const svg=document.querySelector('svg'),slider=document.getElementById('time');slider.value=3.3;slider.dispatchEvent(new Event('input'));const paused=svg.animationsPaused(),time=svg.getCurrentTime();document.getElementById('replay').click();return {paused,time,replayed:!svg.animationsPaused()&&svg.getCurrentTime()<.2}})()`);
  if(!controls.paused||Math.abs(controls.time-3.3)>.1||!controls.replayed)throw new Error('Timeline preview controls failed.');
  for(const name of ['hero-light.svg','hero-mobile-light.svg','tools-light.svg','tools-mobile-light.svg','workbench-light.svg','workbench-mobile-light.svg']) {
    const raw=await readFile(path.join(root,'assets',name),'utf8');
    const clipped=await evaluate(`(()=>{const host=document.createElement('div');host.style.cssText='position:absolute;left:0;top:0;visibility:hidden';host.innerHTML=${JSON.stringify(raw)};document.body.append(host);const b=host.querySelector('svg').getBoundingClientRect();const bad=[...host.querySelectorAll('text')].filter(t=>{const r=t.getBoundingClientRect();return r.left<b.left-1||r.right>b.right+1||r.top<b.top-1||r.bottom>b.bottom+1}).map(t=>t.textContent);host.remove();return bad})()`);
    if(clipped.length)throw new Error(`${name}: clipped text ${JSON.stringify(clipped)}`);
  }
  console.log('Hero motion, native book note and SVG text boundaries checked.');
} finally {
  const closed=browser.exitCode===null?new Promise(resolve=>browser.once('exit',resolve)):Promise.resolve();
  try{await send('Browser.close')}catch{browser.kill()}
  await closed;
  await rm(profile,{recursive:true,force:true,maxRetries:3,retryDelay:100});
}
