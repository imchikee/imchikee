/* A short acting study: six sequential drawings, a stationary set and book.
 * No frame blending: intermediate drawings carry the eyelid/head changes. */
const canvas=document.getElementById('stage'),ctx=canvas.getContext('2d');
const atlas=new Image(),base=document.createElement('canvas'),layer=document.createElement('canvas'),mask=document.createElement('canvas');
for(const c of [base,layer,mask]){c.width=534;c.height=482;}
const b=base.getContext('2d'),l=layer.getContext('2d'),m=mask.getContext('2d');
const crops=[[2,0,534,482],[540,0,534,482],[1076,0,534,482],[2,486,534,489],[540,486,534,489],[1076,486,534,489]];
// Use most of the shot for the acting beat; the blink itself stays brief.
// Dip .20–1.05; blink/read 1.05–1.80; return 1.80–2.80.
// These are still six drawings: retiming does not fix missing in-betweens.
const beats=[[0,0],[0.20,1],[0.55,2],[1.05,3],[1.15,2],[1.25,1],[1.80,4],[2.35,5],[2.80,0]];
const duration=3.2,seek=document.getElementById('seek'),play=document.getElementById('play');
let elapsed=0,playing=!matchMedia('(prefers-reduced-motion: reduce)').matches,last=null,ready=false;
function tile(target,index){target.drawImage(atlas,...crops[index],0,0,534,482);}
function at(t){let frame=0;for(const [start,index] of beats)if(t>=start)frame=index;return frame;}
function draw(t){
 if(!ready)return;
 elapsed=Math.max(0,Math.min(duration,t));const frame=at(elapsed);
 ctx.clearRect(0,0,534,482);ctx.drawImage(base,0,0);
 if(frame){
  l.clearRect(0,0,534,482);tile(l,frame);l.globalCompositeOperation='destination-in';l.drawImage(mask,0,0);l.globalCompositeOperation='source-over';
  ctx.save();
  // The original book/hands remain in front of the moving face.
  ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(534,0);ctx.lineTo(534,263);ctx.lineTo(447,263);ctx.lineTo(447,275);ctx.lineTo(431,268);ctx.lineTo(342,289);ctx.lineTo(326,303);ctx.lineTo(300,291);ctx.lineTo(255,283);ctx.lineTo(211,283);ctx.lineTo(203,302);ctx.lineTo(188,310);ctx.lineTo(0,310);ctx.closePath();ctx.clip();ctx.drawImage(layer,0,0);ctx.restore();
 }
 seek.value=elapsed;document.getElementById('time').value=elapsed.toFixed(1)+' s';play.textContent=playing?'暂停':'播放';
}
atlas.onload=()=>{
 tile(b,0);
 // Feather only the boundary of the head drawing. The set outside stays exact.
 m.filter='blur(3px)';m.fillStyle='#fff';m.beginPath();m.ellipse(252,227,166,128,0,0,Math.PI*2);m.fill();
 ready=true;draw(elapsed);
};
atlas.onerror=()=>{playing=false;document.getElementById('error').textContent='动作素材加载失败。';};
atlas.src='frames-v1.png';
play.onclick=()=>{if(elapsed>=duration)elapsed=0;playing=!playing;last=null;draw(elapsed);};
document.getElementById('replay').onclick=()=>{elapsed=0;playing=true;last=null;draw(0);};
seek.oninput=()=>{playing=false;last=null;draw(Number(seek.value));};
function tick(now){if(playing&&ready){if(last!==null)elapsed+=(now-last)/1000;if(elapsed>=duration){elapsed=duration;playing=false;}draw(elapsed);}last=now;requestAnimationFrame(tick);}requestAnimationFrame(tick);
window.readingMotion={draw,get ready(){return ready},get playing(){return playing},duration};
