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


const frameDir=await mkdtemp(path.join(tmpdir(),'amplitude-frames-'));
async function encode(scale){
 const dest=path.join(destination,scale===.7?'preview-a-70.mp4':'preview-b-50.mp4');
 const child=spawn('/usr/bin/ffmpeg',['-y','-loglevel','error','-framerate','30','-i',path.join(frameDir,'frame-%03d.jpg'),'-t','4.89875','-vf','scale=988:898','-c:v','libx264','-crf','18','-pix_fmt','yuv420p','-movflags','+faststart',dest],{stdio:['ignore','ignore','pipe']});let error='';child.stderr.on('data',b=>error+=b);await new Promise((resolve,reject)=>child.on('exit',code=>code?reject(Error(error)):resolve()));
}
try {
 const {targetId}=await send('Target.createTarget',{url:'about:blank'});({sessionId:session}=await send('Target.attachToTarget',{targetId,flatten:true}));await send('Page.enable',{},session);
 const all=[];
 for(const scale of [1,.7,.5]){
  await send('Emulation.setDeviceMetricsOverride',{width:1400,height:1000,deviceScaleFactor:1,mobile:false},session);
  await send('Page.navigate',{url:pathToFileURL(path.join(destination,'preview.html')).href+'?scale='+scale},session);
  for(let j=0;j<100;j++){if(await evaluate("document.readyState==='complete' && !!window.writingScene"))break;await new Promise(r=>setTimeout(r,30));}
  await evaluate('writingScene.readyPromise');
  const metrics=await evaluate(`(()=>{let maxHorizontal=0,minScale=1,maxContactError=0;for(let j=0;j<=4899;j++){const t=Math.min(sketchMotion.duration,j*.001),m=writingScene.limbPose(t);maxHorizontal=Math.max(maxHorizontal,Math.abs(m.dx));minScale=Math.min(minScale,1+1.5*m.dx/115);const p=pen(t);if(t<liftStart&&p.contact){const ink=writingScene.inkTransform.transformPoint({x:onPaper(p.glyph)[0],y:onPaper(p.glyph)[1]});maxContactError=Math.max(maxContactError,Math.hypot(ink.x-m.target.x,ink.y-m.target.y));}}return {scale:writingScene.amplitude,duration:sketchMotion.duration,maxHorizontal,minScale,maxContactError,rigidGrip:'unchanged translation-only layer; no rotation or scaling'};})()`);
  all.push(metrics);console.log(metrics);
  for(const t of [2.581,3.8]){
   const png=await evaluate(`(async()=>{sketchMotion.render(${t});await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));return writingScene.canvas.toDataURL().split(',')[1]})()`);
   await writeFile(path.join(destination,'frame-'+scale+'-'+t+'.png'),Buffer.from(png,'base64'));
  }
  const handwriting=await evaluate(`(()=>{const ink=document.createElement('canvas');ink.width=1316;ink.height=1195;const x=ink.getContext('2d');x.setTransform(writingScene.inkTransform);x.strokeStyle='#493b30';x.lineWidth=2.4;x.lineCap='round';for(const s of strokes){x.beginPath();x.moveTo(...onPaper(s.a));for(let j=1;j<=12;j++)x.lineTo(...onPaper(lerp(s.a,s.b,j/12)));x.stroke();}const out=document.createElement('canvas');out.width=720;out.height=360;const q=out.getContext('2d');q.fillStyle='#f6dfbc';q.fillRect(0,0,720,360);q.translate(720,360);q.rotate(Math.PI);q.drawImage(ink,555,878,65,32.5,0,0,720,360);return out.toDataURL().split(',')[1]})()`);
  await writeFile(path.join(destination,'ink-'+scale+'.png'),Buffer.from(handwriting,'base64'));
  if(scale!==1){
   for(let j=0;j<148;j++){
    const png=await evaluate(`(()=>{sketchMotion.render(${4.89875*j/147});return writingScene.canvas.toDataURL('image/jpeg',.94).split(',')[1]})()`);
    await writeFile(path.join(frameDir,'frame-'+String(j).padStart(3,'0')+'.jpg'),Buffer.from(png,'base64'));
   }
   await encode(scale);console.log('Encoded preview',scale);
  }
 }
 await writeFile(path.join(destination,'metrics.json'),JSON.stringify(all,null,2));
} finally {browser.kill();await new Promise(r=>browser.once('exit',r));await rm(profile,{recursive:true,force:true,maxRetries:3,retryDelay:100});await rm(frameDir,{recursive:true,force:true});}
