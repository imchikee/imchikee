// Reuses the local Chromium/CDP capture approach from drafts/slow-build/render.mjs.

import { spawn } from 'node:child_process';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
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
 const {targetId}=await send('Target.createTarget',{url:'about:blank'});({sessionId:session}=await send('Target.attachToTarget',{targetId,flatten:true}));await send('Page.enable',{},session);await navigate(path.join(root,pageFile),1140,'light',950,100);
 if(!await evaluate('sketchMotion.ready'))throw Error('Image not ready');
 const metrics=await evaluate(`(()=>{const s=sketchMotion;if(s.validate)return s.validate();let drift=0,grip=0,tracking=0;for(let t=0;t<=6.5;t+=.02){const a=s.angle(t),r=s.rotate(s.root.x,s.root.y,a),p=s.pencilPoint(s.tip.x,s.tip.y,a),q=s.pencilPoint(640,930,a);tracking=Math.max(tracking,Math.hypot(p.x-s.target(t).x,p.y-s.target(t).y));drift=Math.max(drift,Math.hypot(r.x-s.root.x,r.y-s.root.y));grip=Math.max(grip,Math.abs(Math.hypot(p.x-q.x,p.y-q.y)-Math.hypot(s.tip.x-640,s.tip.y-930)))}return {rootDrift:drift,pawToTipLengthError:grip,tipTrackingError:tracking}})()`);console.log(metrics);if(metrics.foldedTriangles>0 || metrics.changedFacePixels>0)throw Error('Painted pose registration failed');
 const phases=await evaluate("sketchMotion.reviewTimes || [['start',0],['middle',2.3],['end',5.47],['return',6.5],['lift',3.65],['late',4.65]]");
 for(const [name,t] of phases){
  await evaluate(`sketchMotion.render(${t})`);
  const png=await evaluate(`document.querySelector('#motion').toDataURL('image/png').split(',')[1]`);await writeFile(path.join(output,'sketch-motion-'+name+'.png'),Buffer.from(png,'base64'));
 }
 await evaluate('sketchMotion.render(sketchMotion.duration)');
 const writing=await evaluate(`(()=>{const out=document.createElement('canvas');out.width=600;out.height=300;const x=out.getContext('2d');x.translate(600,300);x.rotate(Math.PI);x.drawImage(document.querySelector('#motion'),610,975,120,60,0,0,600,300);return out.toDataURL().split(',')[1]})()`);
 await writeFile(path.join(output,'handwriting-review.png'),Buffer.from(writing,'base64'));
 const armReview=await evaluate(`(()=>{const out=document.createElement('canvas');out.width=1800;out.height=870;const x=out.getContext('2d');x.fillStyle='#181d21';x.fillRect(0,0,1800,870);const tile=(source,n,label)=>{const px=n%3*600,py=Math.floor(n/3)*290;x.drawImage(source,310,845,380,160,px,py,570,240);x.fillStyle='#eee8dc';x.font='19px sans-serif';x.fillText(label,px+8,py+268);};images.forEach((im,i)=>tile(im,i,'Source '+['start','end','lift'][i]));[0,3.54,4.67,5,5.2,5.5].forEach((t,i)=>{sketchMotion.render(t);tile(document.querySelector('#motion'),i+3,t.toFixed(2)+' s');});return out.toDataURL().split(',')[1]})()`);
 await writeFile(path.join(output,'forearm-contour-review.png'),Buffer.from(armReview,'base64'));
 const gapReview=await evaluate(`(()=>{const out=document.createElement('canvas');out.width=1800;out.height=1050;const x=out.getContext('2d');x.fillStyle='#181d21';x.fillRect(0,0,1800,1050);const tile=(source,n,label,grid=false)=>{const px=n%3*600,py=Math.floor(n/3)*350;x.drawImage(source,380,825,220,115,px,py,594,310.5);if(grid){x.save();x.translate(px,py);x.strokeStyle='rgba(80,100,120,.3)';x.fillStyle='#174260';x.font='13px sans-serif';for(let q=400;q<=580;q+=20){const u=(q-380)*2.7;x.beginPath();x.moveTo(u,0);x.lineTo(u,310);x.stroke();x.fillText(q,u+2,14);}for(let q=840;q<=920;q+=20){const v=(q-825)*2.7;x.beginPath();x.moveTo(0,v);x.lineTo(594,v);x.stroke();x.fillText(q,2,v-3);}x.restore();}x.fillStyle='#eee8dc';x.font='18px sans-serif';x.fillText(label,px+8,py+336);};images.forEach((im,i)=>tile(im,i,'Source '+['start','end','lift'][i],true));[0,2.22,3.54,4.67,5.2,5.5].forEach((t,i)=>{sketchMotion.render(t);tile(document.querySelector('#motion'),i+3,t.toFixed(2)+' s');});return out.toDataURL().split(',')[1]})()`);
 await writeFile(path.join(output,'pencil-gap-review.png'),Buffer.from(gapReview,'base64'));
 await evaluate('sketchMotion.render(0)');
 await screenshot(path.join(output,'preview.png'),{x:0,y:0,width:1140,height:950});
 const controls=await evaluate(`(()=>{document.querySelector('#replay').click();return document.querySelector('#play').textContent})()`);if(controls!=='暂停')throw Error('Replay control failed');
 const playback=await evaluate(`(async()=>{const out=document.createElement('canvas');out.width=1500;out.height=735;const x=out.getContext('2d');document.querySelector('#replay').click();for(let i=0;i<14;i++){if(i)await new Promise(r=>setTimeout(r,sketchMotion.duration*1000/13));x.drawImage(document.querySelector('#motion'),300,700,500,350,(i%5)*300,Math.floor(i/5)*245,300,210);x.fillStyle='#fff';x.font='16px sans-serif';x.fillText(document.querySelector('#time').textContent,(i%5)*300+8,Math.floor(i/5)*245+230);}return {png:out.toDataURL().split(',')[1],time:document.querySelector('#time').textContent}})()`);
 await writeFile(path.join(output,'sketch-playback-review.png'),Buffer.from(playback.png,'base64'));console.log('Real-time playback sampled through',playback.time);
 console.log('Captured six phases; replay control passed.');
} finally {browser.kill();await new Promise(r=>browser.once('exit',r));await rm(profile,{recursive:true,force:true,maxRetries:3,retryDelay:100});}
