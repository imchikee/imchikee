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
 const {targetId}=await send('Target.createTarget',{url:'about:blank'});({sessionId:session}=await send('Target.attachToTarget',{targetId,flatten:true}));await send('Page.enable',{},session);await navigate(path.join(destination,'index.html'),1400,'light',1000,100);await evaluate('templateReady');
 const names=await evaluate(`(()=>{window.outputs={};const make=(w=1316,h=1195)=>{const c=document.createElement('canvas');c.width=w;c.height=h;return c;};
 shoulderStudy.renderBaseline(0);const ref=make();ref.getContext('2d').drawImage(writingScene.canvas,0,0);outputs['reference-0.png']=ref;outputs['foreground-cheek-template.png']=make();
 const guides=make(),g=guides.getContext('2d');g.strokeStyle='#00cddd';g.lineWidth=2;g.setLineDash([5,3]);g.strokeRect(375,775,155,80);g.setLineDash([]);g.strokeStyle='#ffe03e';g.lineWidth=2;g.beginPath();g.moveTo(410,807);g.lineTo(420,810);g.quadraticCurveTo(472,823,525,838);g.stroke();g.strokeStyle='#ff6482';g.setLineDash([3,3]);g.strokeRect(489,775,41,49);g.setLineDash([]);outputs['guides-overlay.png']=guides;
 const marked=make();const m=marked.getContext('2d');m.drawImage(ref,0,0);m.drawImage(guides,0,0);m.fillStyle='#181d21';m.fillRect(260,698,530,48);m.fillStyle='#eee8dc';m.font='15px sans-serif';m.fillText('CYAN: paint ROI (375,775)-(530,855)',270,718);m.fillStyle='#ffe03e';m.fillText('YELLOW: existing diagonal cut seam (guide only)',270,738);m.strokeStyle='#ffe03e';m.beginPath();m.moveTo(530,738);m.lineTo(480,825);m.stroke();outputs['reference-marked.png']=marked;
 const guide=make(1000,850),q=guide.getContext('2d');q.fillStyle='#181d21';q.fillRect(0,0,1000,850);q.drawImage(ref,350,745,250,180,0,70,1000,720);q.drawImage(guides,350,745,250,180,0,70,1000,720);q.fillStyle='#eee8dc';q.font='20px sans-serif';q.fillText('Paint guide only - never copy these annotations into the RGBA layer',12,30);q.font='18px sans-serif';q.fillText('Full scene origin (0,0); crop shown at 400%; fixed ROI 155 x 80 px',12,56);
 const label=(text,x,y)=>{q.font='18px sans-serif';const w=q.measureText(text).width;q.fillStyle='#181d21';q.fillRect(x-4,y-21,w+8,27);q.fillStyle='#eee8dc';q.fillText(text,x,y);};
 label('A: new face fur joins current cheek colour / direction',110,120);label('B: fine partial-alpha tips overlap moving arm',50,460);label('RED: keep pencil corridor transparent',460,555);label('C: arm / paw / pencil / page stay transparent',30,745);q.strokeStyle='#eee8dc';q.lineWidth=2;for(const [x,y,a,b] of [[700,530,650,235],[270,130,350,250],[300,435,420,360],[350,720,480,620]]){q.beginPath();q.moveTo(x,y);q.lineTo(a,b);q.stroke();}q.fillStyle='#eee8dc';q.font='17px sans-serif';q.fillText('Outside cyan ROI / pencil corridor: alpha = 0. Yellow is evidence, not a hair outline.',14,820);outputs['painting-guide.png']=guide;
 const thumb=make(256,232);thumb.getContext('2d').drawImage(ref,0,0,256,232);outputs['thumbnail.png']=thumb;
 return Object.keys(outputs);})()`);
 for(const name of names){const data=await evaluate('outputs['+JSON.stringify(name)+"].toDataURL().split(',')[1]");await writeFile(path.join(destination,name),Buffer.from(data,'base64'));}
 const screenshotResult=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:true},session);await writeFile(path.join(destination,'preview-empty.png'),Buffer.from(screenshotResult.data,'base64'));
 console.log('Exported reference and blank painting assets');
} finally {browser.kill();await new Promise(r=>browser.once('exit',r));await rm(profile,{recursive:true,force:true,maxRetries:3,retryDelay:100});}
