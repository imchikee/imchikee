// Reuses the local Chromium/CDP capture approach from drafts/slow-build/render.mjs.

import { spawn } from 'node:child_process';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
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
 const {targetId}=await send('Target.createTarget',{url:'about:blank'});({sessionId:session}=await send('Target.attachToTarget',{targetId,flatten:true}));await send('Page.enable',{},session);await navigate(path.join(root,'index.html'),1140,'light',950,100);
 if(!await evaluate('sketchMotion.ready'))throw Error('Image not ready');
 const metrics=await evaluate(`(()=>{const s=sketchMotion;let drift=0,grip=0,tracking=0;for(let t=0;t<=6.5;t+=.02){const a=s.angle(t),r=s.rotate(s.root.x,s.root.y,a),p=s.pencilPoint(s.tip.x,s.tip.y,a),q=s.rotate(690,925,a);tracking=Math.max(tracking,Math.hypot(p.x-s.target(t).x,p.y-s.target(t).y));drift=Math.max(drift,Math.hypot(r.x-s.root.x,r.y-s.root.y));grip=Math.max(grip,Math.abs(Math.hypot(p.x-q.x,p.y-q.y)-Math.hypot(s.tip.x-690,s.tip.y-925)))}return {rootDrift:drift,pawToTipLengthError:grip,tipTrackingError:tracking}})()`);console.log(metrics);
 for(const [name,t] of [['start',0],['middle',2.3],['end',5.47],['return',6.5],['lift',3.65],['late',4.65]]){
  await evaluate(`sketchMotion.render(${t})`);
  const png=await evaluate(`document.querySelector('#motion').toDataURL('image/png').split(',')[1]`);await writeFile(path.join(root,'sketch-motion-'+name+'.png'),Buffer.from(png,'base64'));
 }
 await screenshot(path.join(root,'preview.png'),{x:0,y:0,width:1140,height:950});
 const controls=await evaluate(`(()=>{document.querySelector('#replay').click();return document.querySelector('#play').textContent})()`);if(controls!=='暂停')throw Error('Replay control failed');
 const playback=await evaluate(`(async()=>{const out=document.createElement('canvas');out.width=1500;out.height=735;const x=out.getContext('2d');document.querySelector('#replay').click();for(let i=0;i<14;i++){if(i)await new Promise(r=>setTimeout(r,500));x.drawImage(document.querySelector('#motion'),300,700,500,350,(i%5)*300,Math.floor(i/5)*245,300,210);x.fillStyle='#fff';x.font='16px sans-serif';x.fillText(document.querySelector('#time').textContent,(i%5)*300+8,Math.floor(i/5)*245+230);}return {png:out.toDataURL().split(',')[1],time:document.querySelector('#time').textContent}})()`);
 await writeFile(path.join(root,'sketch-playback-review.png'),Buffer.from(playback.png,'base64'));console.log('Real-time playback sampled through',playback.time);
 console.log('Captured six phases; replay control passed.');
} finally {browser.kill();await new Promise(r=>browser.once('exit',r));await rm(profile,{recursive:true,force:true,maxRetries:3,retryDelay:100});}
