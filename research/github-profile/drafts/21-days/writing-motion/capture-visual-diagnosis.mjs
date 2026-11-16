// Reuses the local Chromium/CDP capture approach from drafts/slow-build/render.mjs.

import { spawn } from 'node:child_process';
import { mkdtemp, writeFile, rm, mkdir, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const destination=path.join(root,'visual-diagnosis-2026-11-16');
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
 const {targetId}=await send('Target.createTarget',{url:'about:blank'});({sessionId:session}=await send('Target.attachToTarget',{targetId,flatten:true}));
 await send('Page.enable',{},session);await navigate(path.join(root,'motion-comparison.html'),1400,'light',900,100);
 await evaluate('motionCompare.readyPromise');
 const scan=await evaluate(`(()=>{const w=document.getElementById('new').contentWindow;let best={time:0,dx:0};const samples=[];for(let j=0;j<=4899;j++){const t=Math.min(4.89875,j*.001),p=w.eval('pose('+t+')'),x=(p.tip[0]-679)*108/176;samples.push({time:t,dx:x,tip:p.tip,contact:p.contact});if(x<best.dx)best={time:t,dx:x,tip:p.tip,contact:p.contact};}return {best,samples};})()`);
 await writeFile(path.join(destination,'pose-scan.json'),JSON.stringify(scan,null,2));
 const times=[0,1,2,2.95,3.8,4.89875,scan.best.time].filter((v,i,a)=>a.indexOf(v)===i),records=[];
 for(const t of times){
  const proof=await evaluate(`(async()=>{motionCompare.draw(${t});const ws=['old','new'].map(id=>document.getElementById(id).contentWindow);for(let i=0;i<60;i++){await new Promise(requestAnimationFrame);if(ws.every(w=>Math.abs(w.eval('time')-${t})<1e-8)){await Promise.all(ws.map(w=>new Promise(r=>w.requestAnimationFrame(()=>w.requestAnimationFrame(r)))));return ws.map(w=>({time:w.eval('time'),width:w.writingScene.canvas.width,height:w.writingScene.canvas.height}));}}throw Error('Time synchronization failed');})()`);
  const tag=t.toFixed(5).replace('.','-'),files={time:t,proof};
  for(const local of [false,true]){
   const png=await evaluate(`(()=>{const sources=['old','new'].map(id=>document.getElementById(id).contentWindow.writingScene.canvas);const c=document.createElement('canvas'),x=c.getContext('2d');c.width=${local?1340:2656};c.height=${local?490:1245};x.fillStyle='#181d21';x.fillRect(0,0,c.width,c.height);sources.forEach((s,i)=>{x.fillStyle='#eee8dc';x.font='20px sans-serif';x.fillText((i?'RIGHT candidate':'LEFT original')+' — ${t.toFixed(5)} s',i*${local?680:1336}+8,28);${local?'x.drawImage(s,350,750,330,220,i*680,50,660,440);':'x.drawImage(s,i*1336,50);'}});return c.toDataURL().split(',')[1];})()`);
   const name=tag+(local?'-detail-200.png':'-full.png');await writeFile(path.join(destination,name),Buffer.from(png,'base64'));files[local?'detail':'full']=name;
  }
  await screenshot(path.join(destination,tag+'-page.png'),{x:0,y:0,width:1400,height:900});records.push(files);
 }
 await writeFile(path.join(destination,'captures.json'),JSON.stringify(records,null,2));
 const html=`<!doctype html><meta charset="utf-8"><title>写字前肢视觉诊断</title><style>body{background:#181d21;color:#eee8dc;font:16px/1.6 system-ui;margin:24px}a{color:#b6d8cb}img{max-width:100%;display:block}section{margin:40px 0}summary{cursor:pointer}nav a{margin-right:16px}</style><h1>写字前肢 · 同时刻对比图集</h1><p>左：现有原版；右：取消额外上拱候选。完整场景 PNG 保留原始像素；局部从原场景 (350,750,330,220) 裁切后放大至 660×440（200%）。点击图片查看原尺寸。每次通过 motionCompare.draw(t) 设置并确认两个子页面 time 相等，再等待两帧渲染。</p><p>pose 扫描发现候选水平位移最小值在 ${scan.best.time.toFixed(5)} s，dx=${scan.best.dx.toFixed(3)} px。它只用于选择额外检查时间，不作为视觉合格依据。</p><p><a href="REPORT.md">视觉诊断报告</a> · <a href="captures.json">时间同步记录</a></p><nav>${records.map(r=>`<a href="#t${r.time}">${r.time.toFixed(5)} s</a>`).join('')}</nav>${records.map(r=>`<section id="t${r.time}"><h2>${r.time.toFixed(5)} s</h2><h3>前肢局部 200%</h3><a href="${r.detail}"><img src="${r.detail}"></a><details open><summary>两版完整场景</summary><a href="${r.full}"><img src="${r.full}"></a></details><a href="${r.time.toFixed(5).replace('.','-')}-page.png">原对比页面截图</a></section>`).join('')}`;
 await writeFile(path.join(destination,'index.html'),html);console.log(JSON.stringify({best:scan.best,captures:records.length,destination}));
} finally {browser.kill();await new Promise(r=>browser.once('exit',r));await rm(profile,{recursive:true,force:true,maxRetries:3,retryDelay:100});}
