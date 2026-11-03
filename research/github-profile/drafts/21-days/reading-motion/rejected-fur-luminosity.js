/* The endpoints and halfway pose are paintings, including changing perspective.
 * Corresponding feature landmarks align the paintings during interpolation. */
const canvas=document.getElementById('stage'),ctx=canvas.getContext('2d');
const width=534,height=485;canvas.width=width;canvas.height=height;
function surface(){const c=document.createElement('canvas');c.width=width;c.height=height;return c;}
const layers=[surface(),surface()],mix=surface(),mask=surface();
const furMask=surface(),movingFurMask=surface(),reference=surface(),paintTone=surface();
let lockFur=!new URLSearchParams(location.search).has('old-texture');
if(!lockFur)document.querySelector('h1').textContent='阅读 · 修订前的纹理过渡';
const duration=3.2,seek=document.getElementById('seek'),play=document.getElementById('play');
let elapsed=0,playing=!matchMedia('(prefers-reduced-motion: reduce)').matches,last=null,ready=false;
const smooth=t=>{t=Math.max(0,Math.min(1,t));return t*t*t*(t*(t*6-15)+10);};
function dip(t){if(t<=.2)return 0;if(t<1.05)return smooth((t-.2)/.85);if(t<=1.7)return 1;if(t<2.8)return 1-smooth((t-1.7)/1.1);return 0;}
const scale=([x,y])=>[x*width/1316,y*height/1195];
const fixed=[[0,0],[1316,0],[1316,1195],[0,1195],[110,280],[450,280],[840,280],[1060,280],[1100,600],[1100,850],[150,850],[140,600],[200,1000],[1050,1000],[480,745],[548,715],[650,727],[778,768],[860,724],[1010,677],[1050,713],[470,950],[770,990],[990,955]];
// Original, half-pitch drawing, downward drawing. Coordinates use native art pixels.
const features=[
 [[611,318],[646,320],[669,327]],[[485,363],[499,364],[516,374]],[[607,344],[649,344],[677,350]],
 [[520,453],[548,474],[574,487]],[[788,460],[814,482],[836,514]],[[659,456],[686,488],[707,517]],
 [[428,450],[439,451],[453,456]],[[408,376],[417,376],[430,382]],[[337,453],[347,455],[363,463]],[[414,527],[430,526],[449,535]],
 [[802,448],[816,455],[849,477]],[[797,388],[808,393],[842,412]],[[853,459],[875,474],[900,488]],[[819,513],[843,528],[872,548]],
 [[620,511],[637,536],[655,562]],
 [[551,598.5],[563,628.5],[569,650]],[[584,562],[598.5,594],[605,620]],[[617,598.5],[634,628.5],[641,650]],[[584,635],[598.5,663],[605,680]],[[584,598.5],[598.5,628.5],[605,650]],
 [[732,595.5],[741,630.5],[747,657.5]],[[760,561],[769,599],[776,631]],[[788,595.5],[797,630.5],[805,657.5]],[[760,630],[769,662],[776,684]],[[760,595.5],[769,630.5],[776,657.5]],
 [[690,630],[697,665],[703,690]],[[633,652],[639,684],[647,708]],[[728,654],[734,685],[740,710]],[[678,678],[684,703],[694,724]],[[674,715],[675,729],[690,737]],
 [[247,648],[251,663],[260,676]],[[420,650],[429,671],[438,696]],[[922,665],[927,680],[933,690]],[[840,648],[845,669],[848,689]]
];
const points=[0,1,2].map(k=>[...fixed,...features.map(f=>f[k])].map(scale));
// Bowyer-Watson triangulation: a shared mesh makes matching eyes/nose/cap coincide.
function triangulate(input){
 const pts=[...input,[-2000,-1500],[2500,-1500],[250,3000]];let tris=[[input.length,input.length+1,input.length+2]];
 function inside(t,p){const [a,b,c]=t.map(i=>pts[i]);const d=2*(a[0]*(b[1]-c[1])+b[0]*(c[1]-a[1])+c[0]*(a[1]-b[1]));if(Math.abs(d)<1e-8)return false;const q=v=>v[0]*v[0]+v[1]*v[1];const x=(q(a)*(b[1]-c[1])+q(b)*(c[1]-a[1])+q(c)*(a[1]-b[1]))/d;const y=(q(a)*(c[0]-b[0])+q(b)*(a[0]-c[0])+q(c)*(b[0]-a[0]))/d;return (p[0]-x)**2+(p[1]-y)**2<=(a[0]-x)**2+(a[1]-y)**2+1e-6;}
 for(let i=0;i<input.length;i++){
  const bad=tris.filter(t=>inside(t,pts[i])),edges=new Map();
  for(const t of bad)for(let j=0;j<3;j++){const e=[t[j],t[(j+1)%3]],id=[...e].sort((a,b)=>a-b).join(',');if(edges.has(id))edges.delete(id);else edges.set(id,e);}
  tris=tris.filter(t=>!bad.includes(t));for(const e of edges.values())tris.push([...e,i]);
 }
 return tris.filter(t=>t.every(i=>i<input.length));
}
const mesh=triangulate(points[1]);
const keys=['../model/reading-soft-v1.png','redrawn/mid-key-soft-v1.png','redrawn/down-key-soft-v1.png'].map(src=>{const image=new Image();image.src=src;return image;});
function warp(target,image,from,to){
 target.clearRect(0,0,width,height);
 for(const ids of mesh){
  const [a,b,c]=ids.map(i=>from[i]),[p,q,r]=ids.map(i=>to[i]);
  const det=(b[0]-a[0])*(c[1]-a[1])-(c[0]-a[0])*(b[1]-a[1]);if(Math.abs(det)<1e-6)continue;
  const xx=((q[0]-p[0])*(c[1]-a[1])-(r[0]-p[0])*(b[1]-a[1]))/det;
  const xy=((q[1]-p[1])*(c[1]-a[1])-(r[1]-p[1])*(b[1]-a[1]))/det;
  const yx=((r[0]-p[0])*(b[0]-a[0])-(q[0]-p[0])*(c[0]-a[0]))/det;
  const yy=((r[1]-p[1])*(b[0]-a[0])-(q[1]-p[1])*(c[0]-a[0]))/det;
  target.save();const cx=(p[0]+q[0]+r[0])/3,cy=(p[1]+q[1]+r[1])/3;
  target.beginPath();[p,q,r].forEach((v,i)=>{const dx=v[0]-cx,dy=v[1]-cy,s=1+.3/Math.hypot(dx,dy);target[i?'lineTo':'moveTo'](cx+dx*s,cy+dy*s);});target.closePath();target.clip();
  target.setTransform(xx,xy,yx,yy,p[0]-xx*a[0]-yx*a[1],p[1]-xy*a[0]-yy*a[1]);target.drawImage(image,0,0,width,height);target.restore();
 }
}
function stabilizeFur(target){
 // Reuse the approved coat's light/detail pattern, following the painted head
 // landmarks. Color stays with the new pose; facial features and cap are excluded.
 // Native canvas compositing also works when the preview is opened as a file.
 warp(reference.getContext('2d'),keys[0],points[0],target);
 warp(movingFurMask.getContext('2d'),furMask,points[0],target);
 const f=paintTone.getContext('2d');f.clearRect(0,0,width,height);f.globalCompositeOperation='source-over';f.drawImage(mix,0,0);
 f.globalCompositeOperation='luminosity';f.drawImage(reference,0,0);
 f.globalCompositeOperation='destination-in';f.drawImage(movingFurMask,0,0);f.globalCompositeOperation='source-over';
 // Retain some newly painted shading, keeping the reference grain understated.
 const c=mix.getContext('2d');c.globalAlpha=.72;c.drawImage(paintTone,0,0);c.globalAlpha=1;
}
const foreground=[
 [[477,744],[500,723],[540,713],[630,720],[720,740],[773,768],[827,727],[1010,670],[1034,683],[1051,700],[1030,760],[994,920],[968,959],[770,991],[470,960],[487,841]],
 [[218,813],[336,842],[433,798],[464,773],[498,781],[531,804],[540,829],[525,864],[503,882],[493,928],[455,957],[335,952],[231,924]]
].map(poly=>poly.map(scale));
function draw(t){
 if(!ready)return;elapsed=Math.max(0,Math.min(duration,t));const amount=dip(elapsed);
 ctx.clearRect(0,0,width,height);ctx.drawImage(keys[0],0,0,width,height);
 if(amount>0){
  const k=amount<.5?0:1,u=amount<.5?amount*2:(amount-.5)*2;
  const target=points[k].map((p,i)=>p.map((v,j)=>v+(points[k+1][i][j]-v)*u));
  warp(layers[0].getContext('2d'),keys[k],points[k],target);warp(layers[1].getContext('2d'),keys[k+1],points[k+1],target);
  const c=mix.getContext('2d');c.clearRect(0,0,width,height);c.globalCompositeOperation='source-over';c.globalAlpha=1;c.drawImage(layers[0],0,0);c.globalAlpha=u;c.drawImage(layers[1],0,0);c.globalAlpha=1;
  if(lockFur)stabilizeFur(target);
  c.globalCompositeOperation='destination-in';c.drawImage(mask,0,0);c.globalCompositeOperation='source-over';ctx.drawImage(mix,0,0);
  // Stationary foreground overlaps the changing head, using the original art.
  ctx.save();ctx.beginPath();for(const poly of foreground){poly.forEach(([x,y],i)=>ctx[i?'lineTo':'moveTo'](x,y));ctx.closePath();}ctx.ellipse(989*width/1316,917*height/1195,54*width/1316,49*height/1195,0,0,Math.PI*2);ctx.clip();ctx.drawImage(keys[0],0,0,width,height);ctx.restore();
 }
 seek.value=elapsed;document.getElementById('time').value=elapsed.toFixed(1)+' s';play.textContent=playing?'暂停':'播放';
}
Promise.all(keys.map(i=>i.decode())).then(()=>{
 const f=furMask.getContext('2d');f.save();f.scale(width/1316,height/1195);f.fillStyle='#fff';f.beginPath();f.ellipse(590,568,361,224,0,0,Math.PI*2);f.fill();
 for(const [x,y,rx,ry] of [[427,448,90,90],[804,450,76,82]]){f.beginPath();f.ellipse(x,y,rx,ry,0,0,Math.PI*2);f.fill();}
 f.globalCompositeOperation='destination-out';
 for(const [x,y,rx,ry] of [[585,598,59,63],[760,596,54,61],[685,677,96,83],[420,650,139,49],[843,650,135,49],[426,450,64,66],[804,450,53,58]]){f.beginPath();f.ellipse(x,y,rx,ry,0,0,Math.PI*2);f.fill();}
 f.beginPath();[[460,292],[800,292],[833,468],[760,491],[500,477]].forEach(([x,y],i)=>f[i?'lineTo':'moveTo'](x,y));f.closePath();f.fill();f.restore();
 const softened=surface(),sf=softened.getContext('2d');sf.filter='blur(2px)';sf.drawImage(furMask,0,0);f.clearRect(0,0,width,height);f.drawImage(softened,0,0);
 const c=mask.getContext('2d');c.filter='blur(2px)';c.fillStyle='#fff';c.beginPath();[[190,780],[203,640],[292,540],[315,428],[355,365],[470,350],[530,310],[680,296],[790,355],[851,382],[905,440],[913,500],[894,552],[915,600],[950,664],[948,733],[859,781],[650,800],[400,801]].map(scale).forEach(([x,y],i)=>c[i?'lineTo':'moveTo'](x,y));c.closePath();c.fill();ready=true;draw(elapsed);
}).catch(()=>{playing=false;document.getElementById('error').textContent='姿态原画加载失败。';});
const compare=document.getElementById('fur-compare');
function labelComparison(){compare.textContent=lockFur?'对照上一轮':'返回本次修订';compare.setAttribute('aria-pressed',String(!lockFur));document.getElementById('motion-caption').textContent=lockFur?'本次毛纹修订':'上轮毛纹过渡';}
compare.onclick=()=>{lockFur=!lockFur;labelComparison();draw(elapsed);};labelComparison();
play.onclick=()=>{if(elapsed>=duration)elapsed=0;playing=!playing;last=null;draw(elapsed);};
document.getElementById('replay').onclick=()=>{elapsed=0;playing=true;last=null;draw(0);};seek.oninput=()=>{playing=false;last=null;draw(Number(seek.value));};
function tick(now){if(playing&&ready){if(last!==null)elapsed+=(now-last)/1000;if(elapsed>=duration){elapsed=duration;playing=false;}draw(elapsed);}last=now;requestAnimationFrame(tick);}requestAnimationFrame(tick);
window.readingMotion={draw,dip,get ready(){return ready},get playing(){return playing},duration};
