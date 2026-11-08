// Reuses the local Chromium/CDP capture approach from drafts/slow-build/render.mjs.
import { spawn } from 'node:child_process';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const profile = await mkdtemp(path.join(tmpdir(), 'profile-21-days-chrome-'));
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


try {
  const {targetId}=await send('Target.createTarget',{url:'about:blank'});
  ({sessionId:session}=await send('Target.attachToTarget',{targetId,flatten:true}));
  await send('Page.enable',{},session);
  await send('Network.enable',{},session);
  await send('Network.setBlockedURLs',{urls:['http://*','https://*']},session);
  await navigate(path.join(root,'index.html'),1440,'light',1000,100);
  const loaded=await evaluate(`Promise.all([...new Set([...document.querySelectorAll('#story-art image')].map(i=>i.href.baseVal))].map(src=>new Promise(resolve=>{const i=new Image();i.onload=()=>resolve(true);i.onerror=()=>resolve(false);i.src=src}))).then(results=>results.every(Boolean))`);
  if(!loaded)throw new Error('Storyboard PNG did not load');
  await evaluate('Promise.all([reading.ready,writing.ready]).then(()=>true)');
  for(const [i,time] of [1.6,5,8.5,12.5,16.7,21.1,26.1,30.6,38.7].entries()){
    const state=await evaluate(`(()=>{const r=document.getElementById('story-seek');r.value=${time};r.dispatchEvent(new Event('input'));return {index:current(),paused:!playing,box:document.getElementById('story-art').getAttribute('viewBox')}})()`);
    if(state.index!==i||!state.paused)throw new Error('Panel/seek mismatch '+JSON.stringify(state));
    const box=await evaluate(`(()=>{const r=(((current()===0&&readingReady)||(current()===1&&writingReady))?readingCanvas:art).getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height}})()`);
    await screenshot('/tmp/21-days-illustrated-'+(i+1)+'.png',box);
  }
  const transition=await evaluate(`(()=>{const s=document.getElementById('story-seek');const go=t=>{s.value=t;s.dispatchEvent(new Event('input'));};go(1.1);const motion=readingReady&&!readingCanvas.hidden&&art.hidden;go(3.25);const chapter2=current()===1&&writingReady&&!readingCanvas.hidden&&art.hidden;go(1.1);return {motion,chapter2,back:current()===0&&!readingCanvas.hidden&&!playing}})()`);
  if(Object.values(transition).some(v=>!v))throw new Error('Chapter transition '+JSON.stringify(transition));
  const readingBox=await evaluate(`(()=>{const r=readingCanvas.getBoundingClientRect();return{x:r.x,y:r.y,width:r.width,height:r.height}})()`);
  const readingFrame=async t=>{await evaluate(`(()=>{const s=document.getElementById('story-seek');s.value=${t};s.dispatchEvent(new Event('input'));return true})()`);return(await send('Page.captureScreenshot',{format:'png',clip:{...readingBox,scale:1}},session)).data;};
  const writeA=await readingFrame(3.65),writeB=await readingFrame(5.4);if(writeA===writeB)throw new Error('Second chapter did not visibly animate');const frameA=await readingFrame(.6),frameB=await readingFrame(1.1);
  if(frameA===frameB)throw new Error('First chapter did not visibly animate');
  await new Promise(r=>setTimeout(r,100));
  const pausedFrame=(await send('Page.captureScreenshot',{format:'png',clip:{...readingBox,scale:1}},session)).data;
  if(pausedFrame!==frameB)throw new Error('Global pause did not freeze first-chapter pixels');
  const controls=await evaluate(`(async()=>{document.getElementById('story-replay').click();await new Promise(r=>setTimeout(r,180));const moving=elapsed>0;document.getElementById('story-play').click();const a=elapsed;await new Promise(r=>setTimeout(r,100));const paused=elapsed===a;elapsed=duration-.04;playing=true;last=null;await new Promise(r=>setTimeout(r,130));return {moving,paused,ended:!playing&&elapsed===duration}})()`);
  if(Object.values(controls).some(v=>!v))throw new Error('Playback mismatch '+JSON.stringify(controls));
  for(const theme of ['light','dark'])for(const width of [1440,390]){
    await navigate(path.join(root,'preview-'+theme+'.html'),width,theme,1000,100);
    await evaluate(`(()=>{const r=document.getElementById('story-seek');r.value=1.6;r.dispatchEvent(new Event('input'));return true})()`);
    const layout=await evaluate(`(()=>{const rect=e=>{const r=e.getBoundingClientRect();return {x:r.x+scrollX,y:r.y+scrollY,width:r.width,height:r.height}};return {page:{x:0,y:0,width:innerWidth,height:document.documentElement.scrollHeight},readme:rect(document.querySelector('main')),overflow:document.documentElement.scrollWidth>innerWidth,broken:[...document.images].filter(i=>!i.complete||!i.naturalWidth).map(i=>i.src)}})()`);
    if(layout.overflow||layout.broken.length)throw new Error('Layout/image failure '+JSON.stringify(layout));
    if(width===1440){
      await screenshot(path.join(root,'full-'+theme+'.png'),layout.page);
      await screenshot(path.join(root,'readme-'+theme+'.png'),layout.readme);
    }else await screenshot(path.join(root,'mobile-'+theme+'.png'),layout.page);
    console.log(theme+'/'+width+': artwork, shared assets and layout passed.');
  }
  await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]},session);
  const reduced=await evaluate(`new Promise(resolve=>setTimeout(()=>resolve(!playing&&matchMedia('(prefers-reduced-motion: reduce)').matches),100))`);
  if(!reduced)throw new Error('Reduced-motion preference did not pause playback');
  console.log('PASS: two-scene motion/pixel pause, nine chapters, play/replay/seek, ending stop and reduced motion.');
  await navigate(path.join(root,'writing-motion/index.html'),1140,'light',1000,100);
  await evaluate('shot.ready.then(()=>{elapsed=3.1;playing=false;draw();return true})');
  const writingPreview=await evaluate(`(()=>{const samples=[];for(let i=0;i<30;i++){const start=performance.now();shot.draw(i/10);samples.push(performance.now()-start);}elapsed=3.1;draw();return{ready:shot.loaded,script:[...document.scripts].some(s=>s.src.endsWith('shot.js?revision=51')),drawMs:samples.reduce((a,b)=>a+b,0)/samples.length,page:{x:0,y:0,width:innerWidth,height:document.documentElement.scrollHeight}}})()`);
  if(!writingPreview.ready||!writingPreview.script)throw Error('Current writing preview did not load');
  await screenshot(path.join(root,'writing-motion/preview.png'),writingPreview.page);
  console.log('PASS: Current writing preview loads and seeks; average draw '+writingPreview.drawMs.toFixed(1)+' ms.');
} finally {
  const closed=browser.exitCode===null&&browser.signalCode===null?new Promise(resolve=>browser.once('exit',resolve)):Promise.resolve();
  if(browser.exitCode===null&&browser.signalCode===null){try{await send('Browser.close')}catch{browser.kill()}}
  await closed;
  await rm(profile,{recursive:true,force:true,maxRetries:3,retryDelay:100});
}
