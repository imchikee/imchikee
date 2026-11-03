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
 await send('Page.enable',{},session);await send('Network.enable',{},session);await send('Network.setBlockedURLs',{urls:['http://*','https://*']},session);
 await navigate(path.join(root,'index.html'),1040,'light',900,100);
 await evaluate(`new Promise((resolve,reject)=>{const i=new Image();i.onload=resolve;i.onerror=reject;i.src='hamster-parts.png'}).then(()=>true)`);
 async function at(time){await evaluate(`(()=>{const s=document.getElementById('seek');s.value=${time};s.dispatchEvent(new Event('input'));return true})()`);}
 const box=await evaluate(`(()=>{const r=document.getElementById('stage').getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height}})()`);
 if(!process.argv.includes('--gif')){
  for(const [name,t] of [['ready',0],['drink',2.5],['young',4.8],['walk',6.8],['enter',8.6]]){await at(t);await screenshot(path.join(root,'phase-'+name+'.png'),box);}
  for(const width of [1040,390]){
   await navigate(path.join(root,'index.html'),width,'light',900,100);await at(2.5);
   if(await evaluate('document.documentElement.scrollWidth>innerWidth'))throw new Error('Horizontal overflow');
  }
  console.log('PNG loaded, five action phases and desktop/mobile layout checked.');
 }else{
  const frames=await mkdtemp(path.join(tmpdir(),'hamster-acting-'));const list=[];
  try{
   for(let i=0;i<132;i++){
    await at(i/12);const file=path.join(frames,'frame-'+String(i).padStart(3,'0')+'.png');
    const r=await send('Page.captureScreenshot',{format:'png',clip:{...box,scale:720/box.width}},session);await writeFile(file,Buffer.from(r.data,'base64'));
    list.push("file '"+file+"'",'option framerate 100','duration '+(1/12));
   }
   const file=path.join(frames,'frames.txt');await writeFile(file,list.join('\n')+'\n');
   await new Promise((resolve,reject)=>{const p=spawn('ffmpeg',['-v','error','-y','-f','concat','-safe','0','-i',file,'-filter_complex','fps=12,split[a][b];[a]palettegen=max_colors=160:stats_mode=diff:reserve_transparent=0[p];[b][p]paletteuse=dither=bayer:bayer_scale=4:diff_mode=rectangle','-fps_mode','vfr','-loop','0',path.join(root,'motion.gif')],{stdio:['ignore','ignore','pipe']});let err='';p.stderr.on('data',d=>err+=d);p.on('error',reject);p.on('close',code=>code===0?resolve():reject(new Error(err)));});
   console.log('Exported continuous 11-second motion GIF at 12 fps.');
  }finally{await rm(frames,{recursive:true,force:true});}
 }
}finally{
 const closed=browser.exitCode===null&&browser.signalCode===null?new Promise(resolve=>browser.once('exit',resolve)):Promise.resolve();
 if(browser.exitCode===null&&browser.signalCode===null){try{await send('Browser.close')}catch{browser.kill()}}
 await closed;await rm(profile,{recursive:true,force:true,maxRetries:3,retryDelay:100});
}
