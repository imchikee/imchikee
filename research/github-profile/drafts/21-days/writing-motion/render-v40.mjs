// Reuses the local Chromium/CDP capture approach from drafts/slow-build/render.mjs.
import './build-region.mjs';
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


try{
 const {targetId}=await send('Target.createTarget',{url:'about:blank'});({sessionId:session}=await send('Target.attachToTarget',{targetId,flatten:true}));await send('Page.enable',{},session);await navigate(path.join(root,'index.html'),1140,'light',1000,100);
 await evaluate(`shot.ready.then(()=>{playing=false;loaded=true;document.getElementById('stage').style='width:534px;height:485px';return true;})`);
 const area=await evaluate(`(()=>{const r=document.getElementById('stage').getBoundingClientRect();return{x:r.x,y:r.y,width:r.width,height:r.height}})()`);
 if(process.argv.includes('--preview')){
  await evaluate('shot.draw(3.1)');await screenshot(path.join(root,'quick-frame.png'),area);
  await evaluate(`(()=>{const c=document.getElementById('stage');c.width=1316;c.height=1195;c.style='width:1316px;height:1195px;border-radius:0';c.getContext('2d').setTransform(1316/534,0,0,1195/485,0,0);shot.draw(3.1);return true;})()`);
  const native=await evaluate(`(()=>{const r=document.getElementById('stage').getBoundingClientRect();return{x:r.x,y:r.y,width:r.width,height:r.height}})()`);await screenshot(path.join(root,'native-preview.png'),native);
  if(process.argv.includes('--layers')){
   await evaluate(`(()=>{const c=document.getElementById('stage'),x=c.getContext('2d');x.setTransform(1,0,0,1,0,0);x.clearRect(0,0,c.width,c.height);x.drawImage(shot.layers.background,0,0);return true})()`);await screenshot(path.join(root,'base-preview.png'),native);
   for(const name of ['hand','arm']){await evaluate(`(()=>{const c=document.getElementById('stage'),x=c.getContext('2d');x.setTransform(1,0,0,1,0,0);x.fillStyle='#444';x.fillRect(0,0,c.width,c.height);x.drawImage(shot.layers.${name},395,770);return true})()`);await screenshot(path.join(root,name+'-layer-preview.png'),{x:native.x+395,y:native.y+770,width:260,height:240});}
  }
  console.log('Updated quick visual preview.');
 }else{
 const dir=await mkdtemp(path.join(tmpdir(),'writing-frames-'));const list=[];
 try{for(let i=0;i<96;i++){await evaluate(`shot.draw(${i/30})`);const file=path.join(dir,String(i).padStart(3,'0')+'.png');await screenshot(file,area);list.push("file '"+file+"'",'duration '+(1/30));const key={0:'start.png',30:'lift.png',66:'writing.png',90:'finish.png'}[i];if(key)await screenshot(path.join(root,key),area);}
 const manifest=path.join(dir,'frames.txt');await writeFile(manifest,list.join('\n')+'\n');await new Promise((resolve,reject)=>{const p=spawn('ffmpeg',['-v','error','-y','-f','concat','-safe','0','-i',manifest,'-filter_complex','fps=30,split[a][b];[a]palettegen=max_colors=256:stats_mode=diff[p];[b][p]paletteuse=dither=bayer:bayer_scale=4','-loop','0',path.join(root,'motion.gif')],{stdio:['ignore','ignore','pipe']});let err='';p.stderr.on('data',d=>err+=d);p.on('close',code=>code===0?resolve():reject(Error(err)));});
 }finally{await rm(dir,{recursive:true,force:true});}
 // Inspect the moving wrist at source resolution, rather than only the small preview.
 await evaluate(`(()=>{const c=document.getElementById('stage');c.width=1316;c.height=1195;c.style='width:1316px;height:1195px;border-radius:0';c.getContext('2d').setTransform(1316/534,0,0,1195/485,0,0);return true;})()`);
 const detail=await evaluate(`(()=>{const r=document.getElementById('stage').getBoundingClientRect();return{x:r.x+300,y:r.y+750,width:470,height:300}})()`);
 for(const [name,time] of [['start',0],['lift',1],['writing',2.2],['finish',2.8]]){await evaluate(`shot.draw(${time})`);await screenshot(path.join(root,'hand-'+name+'.png'),detail);}
 const nativeArea=await evaluate(`(()=>{const r=document.getElementById('stage').getBoundingClientRect();return{x:r.x,y:r.y,width:r.width,height:r.height}})()`);
 await evaluate('shot.draw(3.1)');await screenshot(path.join(root,'native-finish.png'),nativeArea);
 await evaluate('shot.draw(2.2)');
 const bodyDetail=await evaluate(`(()=>{const r=document.getElementById('stage').getBoundingClientRect();return{x:r.x+180,y:r.y+300,width:850,height:650}})()`);
 await screenshot(path.join(root,'body-detail.png'),bodyDetail);
 // Review each writing phase with the entire face and both paws at native size.
 const faceArea=await evaluate(`(()=>{const r=document.getElementById('stage').getBoundingClientRect();return{x:r.x+270,y:r.y+570,width:780,height:470}})()`);
 const review=await mkdtemp(path.join(tmpdir(),'writing-face-review-'));
 try{
  const times=[0,.3,.5,.7,.91,1.11,1.3,1.52,1.78,1.9,1.97,2.1,2.17,2.3,2.62,3.1];
  for(let n=0;n<times.length;n++){await evaluate(`shot.draw(${times[n]})`);await screenshot(path.join(review,String(n).padStart(2,'0')+'.png'),faceArea);}
  for(let page=0;page<2;page++){
   const manifest=path.join(review,'page-'+page+'.txt');
   await writeFile(manifest,Array.from({length:8},(_,n)=>"file '"+path.join(review,String(page*8+n).padStart(2,'0')+'.png')+"'").join('\n')+'\n');
   await new Promise((resolve,reject)=>{const p=spawn('ffmpeg',['-v','error','-y','-f','concat','-safe','0','-i',manifest,'-vf','tile=2x4','-frames:v','1',path.join(root,'face-phases-current-'+(page+1)+'.png')],{stdio:['ignore','ignore','pipe']});let err='';p.stderr.on('data',d=>err+=d);p.on('close',code=>code===0?resolve():reject(Error(err)));});
  }
 }finally{await rm(review,{recursive:true,force:true});}
 await import('./inspect-frames.mjs');
 console.log('Exported chapter 2: 96 frames / 3.2 seconds.');
 }
}finally{try{await send('Browser.close')}catch{browser.kill()}await new Promise(resolve=>browser.exitCode===null?browser.once('exit',resolve):resolve());await rm(profile,{recursive:true,force:true});}
