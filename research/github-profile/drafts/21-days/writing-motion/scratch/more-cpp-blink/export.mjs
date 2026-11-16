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


const frames=await mkdtemp(path.join(tmpdir(),'cpp-blink-frames-'));
try {
 const {targetId}=await send('Target.createTarget',{url:'about:blank'});({sessionId:session}=await send('Target.attachToTarget',{targetId,flatten:true}));await send('Page.enable',{},session);await navigate(path.join(destination,'material.html'),1000,'light',800,100);await evaluate('materialReady');const material=await evaluate("preparedMaterial.toDataURL().split(',')[1]");await writeFile(path.join(destination,'eyes-closed-matched.png'),Buffer.from(material,'base64'));await writeFile(path.join(destination,'material-offsets.json'),JSON.stringify(await evaluate('materialOffsets'),null,2));await navigate(path.join(destination,'index.html'),1200,'light',1100,100);await evaluate('moreCpp.readyPromise');
 for(const [name,t] of [['start',0],['middle',1.6],['end',3.2]]){const png=await evaluate(`(()=>{moreCpp.draw(${t});return moreCpp.canvas.toDataURL().split(',')[1]})()`);await writeFile(path.join(destination,name+'.png'),Buffer.from(png,'base64'));}
 const summary=await evaluate(`(()=>{const full=document.createElement('canvas');full.width=1602;full.height=525;const f=full.getContext('2d');f.fillStyle='#181d21';f.fillRect(0,0,1602,525);const eyes=document.createElement('canvas');eyes.width=1600;eyes.height=600;const e=eyes.getContext('2d');e.fillStyle='#181d21';e.fillRect(0,0,1600,600);[0,1.5,1.5333333,1.5666667,1.6,1.6333333,1.7,1.7666667].forEach((t,i)=>{moreCpp.draw(t);const x=i%4*400,y=Math.floor(i/4)*300;e.fillStyle='#eee8dc';e.font='18px sans-serif';e.fillText(t.toFixed(3)+' s',x+8,y+26);e.drawImage(moreCpp.canvas,535,630,300,150,x,y+40,400,200);});[0,1.6,3.2].forEach((t,i)=>{moreCpp.draw(t);f.fillStyle='#eee8dc';f.font='18px sans-serif';f.fillText(t.toFixed(1)+' s - normal 534px viewing width',i*534+8,28);f.drawImage(moreCpp.canvas,i*534,40,534,485);});window.reviews={'normal-size-review.png':full,'blink-detail-review.png':eyes};return Object.keys(reviews);})()`);
 for(const name of summary){const png=await evaluate('reviews['+JSON.stringify(name)+"].toDataURL().split(',')[1]");await writeFile(path.join(destination,name),Buffer.from(png,'base64'));}
 for(let j=0;j<96;j++){const jpg=await evaluate(`(()=>{moreCpp.draw(${j/30});return moreCpp.canvas.toDataURL('image/jpeg',.96).split(',')[1]})()`);await writeFile(path.join(frames,'frame-'+String(j).padStart(3,'0')+'.jpg'),Buffer.from(jpg,'base64'));}
 const ff=spawn('/usr/bin/ffmpeg',['-y','-v','error','-framerate','30','-i',path.join(frames,'frame-%03d.jpg'),'-frames:v','96','-vf','pad=1316:1196:0:0:color=white','-c:v','libx264','-crf','17','-pix_fmt','yuv420p','-movflags','+faststart',path.join(destination,'preview.mp4')],{stdio:['ignore','ignore','pipe']});let error='';ff.stderr.on('data',b=>error+=b);await new Promise((resolve,reject)=>ff.on('exit',code=>code?reject(Error(error)):resolve()));console.log('Exported one 3.2-second candidate');
} finally {browser.kill();await new Promise(r=>browser.once('exit',r));await rm(profile,{recursive:true,force:true,maxRetries:3,retryDelay:100});await rm(frames,{recursive:true,force:true});}
