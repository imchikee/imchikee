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


const frameDir=await mkdtemp(path.join(tmpdir(),'wrist-preview-'));
async function encode(name){const child=spawn('/usr/bin/ffmpeg',['-y','-loglevel','error','-framerate','30','-i',path.join(frameDir,'frame-%03d.jpg'),'-frames:v','147','-vf','scale=988:898','-c:v','libx264','-crf','18','-pix_fmt','yuv420p','-movflags','+faststart',path.join(destination,name+'.mp4')],{stdio:['ignore','ignore','pipe']});let error='';child.stderr.on('data',b=>error+=b);await new Promise((resolve,reject)=>child.on('exit',code=>code?reject(Error(error)):resolve()));}
try {
 const {targetId}=await send('Target.createTarget',{url:'about:blank'});({sessionId:session}=await send('Target.attachToTarget',{targetId,flatten:true}));await send('Page.enable',{},session);
 const all=[];
 for(const mode of ['baseline','candidate']){
  await send('Page.navigate',{url:pathToFileURL(path.join(destination,'frame.html')).href+'?mode='+mode},session);
  for(let j=0;j<100;j++){if(await evaluate("document.readyState==='complete' && !!window.writingScene"))break;await new Promise(r=>setTimeout(r,30));}await evaluate('writingScene.readyPromise');
  const stats=await evaluate(`(()=>{const scene=writingScene;let dxMin=0,dxMax=0,dyMin=0,dyMax=0,contactError=0,minScale=1,maxShear=0,proximalMotion=0;for(let j=0;j<=4899;j++){const t=Math.min(duration,j*.001),m=scene.limbPose(t);dxMin=Math.min(dxMin,m.dx);dxMax=Math.max(dxMax,m.dx);dyMin=Math.min(dyMin,m.dy);dyMax=Math.max(dyMax,m.dy);minScale=Math.min(minScale,scene.candidate?1:1+1.5*m.dx/115);maxShear=Math.max(maxShear,Math.abs(1.5*m.dy/(scene.candidate?65:115)));const f=scene.mapped(450,850,m);proximalMotion=Math.max(proximalMotion,Math.hypot(f.x-450,f.y-850));const p=pen(t);if(t<liftStart&&p.contact){const ink=scene.inkTransform.transformPoint({x:onPaper(p.glyph)[0],y:onPaper(p.glyph)[1]});contactError=Math.max(contactError,Math.hypot(ink.x-m.target.x,ink.y-m.target.y));}}return {candidate:scene.candidate,duration,amplitude:scene.amplitude,dxMin,dxMax,dyMin,dyMax,minHorizontalScale:minScale,maxVerticalShear:maxShear,maxMapped450Displacement:proximalMotion,maxContactError:contactError,penRotationDegrees:0,gripTransform:'same rigid translation as baseline',transition:scene.candidate?[450,515]:[400,515]};})()`);all.push(stats);
  await evaluate(`window.recorded={};`);
  for(const t of [0,1,2,2.581,2.95,3.8,4.89875]){
   const png=await evaluate(`(()=>{writingScene.draw(${t});const c=document.createElement('canvas');c.width=1316;c.height=1195;c.getContext('2d').drawImage(writingScene.canvas,0,0);recorded[${t}]=c;return c.toDataURL().split(',')[1]})()`);
   if([0,2.581,3.8,4.89875].includes(t))await writeFile(path.join(destination,mode+'-'+t+'.png'),Buffer.from(png,'base64'));
  }
  const review=await evaluate(`(()=>{const c=document.createElement('canvas');c.width=1980;c.height=1080;const x=c.getContext('2d');x.fillStyle='#181d21';x.fillRect(0,0,c.width,c.height);[0,1,2,2.581,2.95,3.8].forEach((t,i)=>{const a=i%3*660,b=Math.floor(i/3)*540;x.fillStyle='#eee8dc';x.font='20px sans-serif';x.fillText('${mode} - '+t+' s',a+8,b+28);x.drawImage(recorded[t],320,730,330,250,a,b+40,660,500);});return c.toDataURL().split(',')[1]})()`);await writeFile(path.join(destination,mode+'-playback-review.png'),Buffer.from(review,'base64'));
  for(let j=0;j<147;j++){
   const jpg=await evaluate(`(()=>{writingScene.draw(${j/30});return writingScene.canvas.toDataURL('image/jpeg',.94).split(',')[1]})()`);await writeFile(path.join(frameDir,'frame-'+String(j).padStart(3,'0')+'.jpg'),Buffer.from(jpg,'base64'));
  }
  await encode(mode);console.log('Encoded',mode);
 }
 await writeFile(path.join(destination,'metrics.json'),JSON.stringify(all,null,2));
} finally {browser.kill();await new Promise(r=>browser.once('exit',r));await rm(profile,{recursive:true,force:true,maxRetries:3,retryDelay:100});await rm(frameDir,{recursive:true,force:true});}
