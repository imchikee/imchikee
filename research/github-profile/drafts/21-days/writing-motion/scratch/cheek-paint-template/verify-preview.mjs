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
 const result=await evaluate(`(async()=>{
  const p=cheekPreview,checks={};const assert=(ok,message)=>{if(!ok)throw Error(message);};
  // Synthetic pixel is an in-memory registration probe only, not artwork.
  const empty=await p.loadPNG('scratch/cheek-paint-template/foreground-cheek-template.png','blank-template');assert(empty.painted===0,'Template must be entirely transparent');assert(document.getElementById('gate').disabled,'Empty layer must not unlock acceptance');checks.emptyTemplate=empty;
  const fixture=document.createElement('canvas');fixture.width=1316;fixture.height=1195;fixture.getContext('2d').fillStyle='#fd00fd';fixture.getContext('2d').fillRect(420,815,1,1);await p.loadPNG(fixture.toDataURL(),'in-memory test pixel, not artwork');assert(p.painted===1,'Load RGBA');const sameLayer=p.foreground;
  assert(document.getElementById('at2581').disabled,'Later times must wait for manual gate');document.getElementById('gate').checked=true;document.getElementById('gate').dispatchEvent(new Event('change'));
  checks.times=[];for(const [id,t] of [['at0',0],['at2581',2.581],['at38',3.8]]){document.getElementById(id).click();assert(p.time===t,'Time button failed');assert(p.foreground===sameLayer,'Layer must stay identical');const c=document.getElementById('candidate').getContext('2d').getImageData(420,815,1,1).data;assert(c[0]===253&&c[1]===0&&c[2]===253,'Fixed pixel registration failed');checks.times.push(t);}checks.sameLayerAtAllTimes=true;checks.registrationPixel=[420,815];
  document.getElementById('at0').click();document.getElementById('playback').click();await new Promise(r=>setTimeout(r,160));p.stop();assert(p.time>0,'Playback did not advance');checks.playbackAdvances=true;
  const bad=document.createElement('canvas');bad.width=10;bad.height=10;let rejected=false;try{await p.loadPNG(bad.toDataURL(),'wrong-size');}catch(e){rejected=true;}assert(rejected,'Wrong dimensions accepted');assert(!document.getElementById('gate').checked,'New load must reset manual gate');checks.rejectWrongSize=true;
  fixture.getContext('2d').fillRect(0,0,1316,1195);rejected=false;try{await p.loadPNG(fixture.toDataURL(),'opaque');}catch(e){rejected=true;}assert(rejected,'Opaque flattened reference accepted');checks.rejectFlattenedOpaque=true;
  document.getElementById('reset').click();assert(p.painted===0&&p.time===0,'Reset did not restore empty workflow');checks.reset=true;
  // Compare t=0 registration reference against the original current 70% renderer.
  const ref=new Image();ref.src='scratch/cheek-paint-template/reference-0.png';await ref.decode();const c=document.createElement('canvas');c.width=1316;c.height=1195;const x=c.getContext('2d');x.drawImage(ref,0,0);const expected=x.getImageData(0,0,1316,1195).data;shoulderStudy.renderBaseline(0);const actual=shoulderStudy.paint.getImageData(0,0,1316,1195).data;let differences=0;for(let i=0;i<expected.length;i++)if(expected[i]!==actual[i])differences++;assert(differences===0,'Reference differs from 70% t=0');checks.referenceChannelDifferences=differences;
  return checks;
 })()`);
 await writeFile(path.join(destination,'verification.json'),JSON.stringify(result,null,2));console.log(JSON.stringify(result));
} finally {browser.kill();await new Promise(r=>browser.once('exit',r));await rm(profile,{recursive:true,force:true,maxRetries:3,retryDelay:100});}
