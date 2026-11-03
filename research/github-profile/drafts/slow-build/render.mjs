// Offline local Chromium capture. Uses Node built-ins and CDP pipes, no server.
import { spawn } from 'node:child_process';
import { mkdtemp, readFile, writeFile, rm, mkdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const profile = await mkdtemp(path.join(tmpdir(), 'profile-slow-build-chrome-'));
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

const art=path.join(root,'assets/scene');
async function loadSvg(file,width,height,theme='light') {
  await send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:false},session);
  await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-color-scheme',value:theme}]},session);
  const color=theme==='dark'?{r:13,g:17,b:23,a:1}:{r:255,g:255,b:255,a:1};
  await send('Emulation.setDefaultBackgroundColorOverride',{color},session);
  const nav=await send('Page.navigate',{url:pathToFileURL(file).href},session);
  if(nav.errorText)throw new Error(nav.errorText);
  let ready=false;
  for(let i=0;i<100;i++) {
    ready=await evaluate(`document.readyState==='complete'&&typeof document.documentElement.pauseAnimations==='function'`);
    if(ready)break;
    await new Promise(r=>setTimeout(r,50));
  }
  if(!ready)throw new Error('SVG did not load: '+file);
  await evaluate(`document.fonts.ready.then(()=>{for(const svg of document.querySelectorAll('svg'))svg.pauseAnimations();return true})`);
}
async function seek(time) {
  await evaluate(`(()=>{for(const svg of document.querySelectorAll('svg')){svg.pauseAnimations();svg.setCurrentTime(${time})}return new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(()=>r(true))))})()`);
}
async function pngAt(file,time,width,height) {
  await seek(time);
  await screenshot(file,{x:0,y:0,width,height});
}
function runFfmpeg(args) {
  return new Promise((resolve,reject)=>{const p=spawn('ffmpeg',args,{stdio:['ignore','ignore','pipe']});let err='';p.stderr.on('data',d=>err=(err+d).slice(-4000));p.on('error',reject);p.on('close',code=>code===0?resolve():reject(new Error(err)))});
}
try {
  const {targetId}=await send('Target.createTarget',{url:'about:blank'});
  ({sessionId:session}=await send('Target.attachToTarget',{targetId,flatten:true}));
  await send('Page.enable',{},session);
  await send('Network.enable',{},session);
  await send('Network.setBlockedURLs',{urls:['http://*','https://*']},session);
  const phases=[['spring',.7],['summer',4.1],['autumn',7.3],['winter',10.7]];
  if(process.argv.includes('--profile')) {
    const profile=path.join(root,'profile'),assets=path.join(profile,'assets');
    for(const [name,width,height,theme] of [
      ['hero-light',1200,470,'light'],['hero-dark',1200,470,'dark'],
      ['hero-mobile-light',520,600,'light'],['hero-mobile-dark',520,600,'dark']
    ]) {
      await loadSvg(path.join(assets,name+'.svg'),width,height,theme);
      await pngAt(path.join(assets,name+'-still.png'),10.7,width,height);
    }
    for(const theme of ['light','dark'])for(const width of [1440,390]) {
      await navigate(path.join(profile,'preview-'+theme+'.html'),width,theme,1000,200);
      const measure='(()=>{const rect=e=>{const r=e.getBoundingClientRect();return {x:r.x+scrollX,y:r.y+scrollY,width:r.width,height:r.height}};return {page:{x:0,y:0,width:innerWidth,height:document.documentElement.scrollHeight},hero:rect(document.querySelector(".profile-hero")),readme:rect(document.querySelector("main")),overflow:document.documentElement.scrollWidth>innerWidth,broken:[...document.images].filter(i=>!i.complete||!i.naturalWidth).map(i=>i.src),source:[...document.querySelectorAll(".profile-hero>svg")].find(s=>getComputedStyle(s).display!=="none")?.dataset.source||document.querySelector("article picture img").currentSrc}})()';
      let layout=await evaluate(measure);
      if(layout.overflow||layout.broken.length)throw new Error('Profile layout failure: '+JSON.stringify(layout));
      const expected='hero'+(width<600?'-mobile':'')+'-'+theme;
      if(!layout.source.endsWith(expected+'.svg'))throw new Error('Wrong theme/width source: '+layout.source);
      if(theme==='light'&&width===1440) {
        const a=await send('Page.captureScreenshot',{format:'png',clip:{...layout.hero,scale:1}},session);
        await new Promise(r=>setTimeout(r,1200));
        const b=await send('Page.captureScreenshot',{format:'png',clip:{...layout.hero,scale:1}},session);
        if(a.data===b.data)throw new Error('Embedded header animation did not advance.');
        if(!await evaluate('(()=>{document.querySelector("summary").click();const v=document.querySelector("details").open;document.querySelector("summary").click();return v})()'))throw new Error('Footer note did not expand');
      }
      await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-color-scheme',value:theme},{name:'prefers-reduced-motion',value:'reduce'}]},session);
      await evaluate('new Promise(ok=>requestAnimationFrame(()=>requestAnimationFrame(ok))).then(()=>Promise.all([...document.images].map(i=>i.decode()))).then(()=>true)');
      layout=await evaluate(measure);
      if(!layout.source.endsWith(expected+'-still.png'))throw new Error('Static cover was not selected.');
      if(width===1440) {
        await screenshot(path.join(profile,'full-'+theme+'.png'),layout.page);
        await screenshot(path.join(profile,'readme-'+theme+'.png'),layout.readme);
      } else await screenshot(path.join(profile,'mobile-'+theme+'.png'),layout.page);
      // Restore normal motion before the next viewport/theme.
      await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-color-scheme',value:theme},{name:'prefers-reduced-motion',value:'no-preference'}]},session);
      console.log('Profile '+theme+'/'+width+': images, motion source and layout checked.');
    }
  } else if(process.argv.includes('--inspect')) {
    await loadSvg(path.join(art,'scene.svg'),960,600);
    for(const [name,time] of phases) {
      await pngAt(path.join(art,'phase-'+name+'.png'),time,960,600);
      console.log(name+' @ '+time+'s');
    }
  } else if(process.argv.includes('--check')) {
    await navigate(path.join(root,'index.html'),1080,'light',900,100);
    for(const [time,pose,percent] of [[.7,0,1],[4.1,1,1],[7.3,2,1],[10.7,3,2]]) {
      const state=await evaluate('(async()=>{const s=document.querySelector("svg"),r=document.getElementById("time");r.value='+time+';r.dispatchEvent(new Event("input"));await new Promise(ok=>requestAnimationFrame(()=>requestAnimationFrame(ok)));return {paused:s.animationsPaused(),time:s.getCurrentTime(),pose:Number(getComputedStyle(document.getElementById("pose-'+pose+'")).opacity),percent:Number(getComputedStyle(document.getElementById("percent-'+percent+'")).opacity)}})()');
      if(!state.paused||Math.abs(state.time-time)>.1||state.pose<.99||state.percent<.99)throw new Error('Timeline mismatch '+JSON.stringify(state));
    }
    const play=await evaluate('(async()=>{const s=document.querySelector("svg");document.getElementById("replay").click();const a=s.getCurrentTime();await new Promise(r=>setTimeout(r,180));const b=s.getCurrentTime();document.getElementById("pause").click();return {moving:b>a,paused:s.animationsPaused()}})()');
    if(!play.moving||!play.paused)throw new Error('Playback controls failed');
    for(const [width,theme] of [[1080,'light'],[390,'dark']]) {
      await navigate(path.join(root,'index.html'),width,theme,950,100);
      await evaluate('(async()=>{const r=document.getElementById("time");r.value=10.7;r.dispatchEvent(new Event("input"));await new Promise(ok=>requestAnimationFrame(()=>requestAnimationFrame(ok)));return true})()');
      const box=await evaluate('({width:innerWidth,height:document.documentElement.scrollHeight,overflow:document.documentElement.scrollWidth>innerWidth})');
      if(box.overflow)throw new Error('Horizontal overflow at '+width);
      await screenshot(path.join(root,theme==='light'?'preview-desktop.png':'preview-mobile.png'),{x:0,y:0,width:box.width,height:box.height});
    }
    await loadSvg(path.join(art,'scene.svg'),960,600);
    for(const [name,time] of phases)await pngAt(path.join(art,'phase-'+name+'.png'),time,960,600);
    console.log('Four phases, progress text, pause/replay/seek and desktop/mobile layout passed.');
  } else {
    const frames=await mkdtemp(path.join(tmpdir(),'slow-build-frames-'));
    try {
      await loadSvg(path.join(art,'scene.svg'),960,600);
      const times=Array.from({length:144},(_,i)=>i/12),manifest=[];
      for(let i=0;i<times.length;i++) {
        const frame=path.join(frames,'frame-'+String(i).padStart(3,'0')+'.png');
        await pngAt(frame,times[i],960,600);
        manifest.push("file '"+frame+"'","option framerate 100","duration "+((times[i+1]??12)-times[i]).toFixed(6));
        if(i%36===0)console.log('Rendered '+(i+1)+'/'+times.length);
      }
      const last=path.join(frames,'frame-143.png');
      manifest.push("file '"+last+"'","option framerate 100");
      const list=path.join(frames,'frames.txt');
      await writeFile(list,manifest.join('\n')+'\n');
      await runFfmpeg(['-v','warning','-y','-f','concat','-safe','0','-i',list,'-filter_complex','fps=12,scale=720:450:flags=lanczos,split[a][b];[a]palettegen=max_colors=160:reserve_transparent=0:stats_mode=diff[p];[b][p]paletteuse=dither=bayer:bayer_scale=4:diff_mode=rectangle','-fps_mode','vfr','-loop','0',path.join(art,'scene.gif')]);
      await pngAt(path.join(art,'poster.png'),10.7,960,600);
      console.log('Encoded 12-second GIF and winter poster.');
    } finally {await rm(frames,{recursive:true,force:true})}
  }

} finally {
  const closed=browser.exitCode===null?new Promise(resolve=>browser.once('exit',resolve)):Promise.resolve();
  try{await send('Browser.close')}catch{browser.kill()}
  await closed;
  await rm(profile,{recursive:true,force:true,maxRetries:3,retryDelay:100});
}
