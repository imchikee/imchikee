// Reuses the local Chromium/CDP capture approach from drafts/slow-build/render.mjs.

import { spawn } from 'node:child_process';
import { mkdtemp, writeFile, rm, mkdir, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const destination=path.dirname(fileURLToPath(import.meta.url));
await mkdir(destination,{recursive:true});
const output=process.argv.includes('--candidate')?path.join(root,'candidate-check'):root;
const pageFile=process.argv.includes('--candidate')?'candidate.html':'index.html';
const profile = await mkdtemp(path.join(tmpdir(), 'profile-21-days-chrome-'));
const browser = spawn(process.env.PROFILE_CHROME || '/opt/google/chrome/chrome', [
  '--headless', '--allow-file-access-from-files', '--disable-gpu', '--no-first-run', '--no-default-browser-check',
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

let session,candidateMode=false;
const candidateScript=process.argv.find(a=>a.startsWith('--shot='))?.slice(7);
async function evaluate(expression) {
  if(candidateMode)expression=expression.replace(/\bshot\b/g,'candidateShot');
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
 const {targetId}=await send('Target.createTarget',{url:'about:blank'});({sessionId:session}=await send('Target.attachToTarget',{targetId,flatten:true}));await send('Page.enable',{},session);await navigate(path.join(destination,'pair.html'),1200,'light',1000,100);
 const record=await evaluate(`(async()=>{const v=document.getElementById('pair');if(v.readyState<2)await new Promise(r=>v.addEventListener('loadeddata',r,{once:true}));v.muted=true;v.currentTime=0;await v.play();const times=[0,.65,1.3,2.7,3.166,3.2,3.9,4.50,4.533,4.567,4.60,4.633,4.667,4.70,4.733,4.76,5.1,6.3],shots=[],actual=[];let next=0;const began=performance.now();while(!v.ended){if(next<times.length&&v.currentTime>=times[next]){const c=document.createElement('canvas');c.width=534;c.height=486;c.getContext('2d').drawImage(v,0,0,534,486);shots.push(c);actual.push(v.currentTime);next++;}await new Promise(requestAnimationFrame);if(performance.now()-began>10000)throw Error('pair playback timeout');}const grid=document.createElement('canvas');grid.width=1602;grid.height=Math.ceil(shots.length/3)*526;const x=grid.getContext('2d');x.fillStyle='#181d21';x.fillRect(0,0,grid.width,grid.height);shots.forEach((c,i)=>{const a=i%3*534,b=Math.floor(i/3)*526;x.fillStyle='#eee8dc';x.font='18px sans-serif';x.fillText((actual[i]<3.2?'CH1 ':'CH2 ')+actual[i].toFixed(3)+' s',a+8,b+28);x.drawImage(c,a,b+40);});window.pairReview=grid;return {duration:v.duration,ended:v.ended,normalWidth:v.getBoundingClientRect().width,actualSampleTimes:actual};})()`);
 const png=await evaluate("pairReview.toDataURL().split(',')[1]");await writeFile(path.join(destination,'pair-normal-review.png'),Buffer.from(png,'base64'));await writeFile(path.join(destination,'pair-playback-check.json'),JSON.stringify(record,null,2));console.log(JSON.stringify(record));
 await navigate(path.join(destination,'index.html'),1200,'light',1100,100);await evaluate('moreCpp.readyPromise');const result=await evaluate(`(async()=>{const m=moreCpp,s=document.getElementById('seek');s.value=1.467;s.dispatchEvent(new Event('input'));if(Math.abs(m.time-1.467)>.00001||m.playing)throw Error('seek failed');document.getElementById('replay').click();await new Promise(r=>setTimeout(r,120));document.getElementById('play').click();const t=m.time;await new Promise(r=>setTimeout(r,120));if(m.time!==t||m.playing)throw Error('pause failed');return {seek:true,pause:true,replay:t>0};})()`);await writeFile(path.join(destination,'controls-check.json'),JSON.stringify(result,null,2));const solo=await evaluate(`(async()=>{moreCpp.draw(0);moreCpp.setPlaying(true);const begin=performance.now(),samples=[];while(moreCpp.playing){if(moreCpp.time>1.25&&moreCpp.time<1.62)samples.push(moreCpp.time);await new Promise(requestAnimationFrame);if(performance.now()-begin>5000)throw Error('solo timeout');}return {duration:moreCpp.duration,end:moreCpp.time,normalWidth:moreCpp.canvas.getBoundingClientRect().width,blinkSampleTimes:samples};})()`);await writeFile(path.join(destination,'solo-playback-check.json'),JSON.stringify(solo,null,2));
} finally {if(browser.exitCode===null&&browser.signalCode===null){browser.kill();await new Promise(r=>browser.once('exit',r));}await rm(profile,{recursive:true,force:true,maxRetries:3,retryDelay:100});}
