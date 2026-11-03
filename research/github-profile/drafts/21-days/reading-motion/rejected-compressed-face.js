/* Animate the approved drawing continuously: one dip, one hold, one return.
 * The six generated poses remain a rejected experiment and are not played. */
const canvas=document.getElementById('stage'),ctx=canvas.getContext('2d');
const source=new Image(),base=document.createElement('canvas');
const width=534,height=485;canvas.width=base.width=width;canvas.height=base.height=height;
const b=base.getContext('2d');
const duration=3.2,seek=document.getElementById('seek'),play=document.getElementById('play');
let elapsed=0,playing=!matchMedia('(prefers-reduced-motion: reduce)').matches,last=null,ready=false;
const smooth=t=>{t=Math.max(0,Math.min(1,t));return t*t*t*(t*(t*6-15)+10);};
function dip(t){
 if(t<=0.2)return 0;
 if(t<1.05)return smooth((t-0.2)/0.85);
 if(t<=1.7)return 1;
 if(t<2.8)return 1-smooth((t-1.7)/1.1);
 return 0;
}
// Highest edge of the stationary book, measured on the approved scene.
const edge=[[0,289],[199,289],[248,292],[281,305],[316,287],[394,271],[425,280],[534,280]];
function bookY(x){for(let i=1;i<edge.length;i++)if(x<=edge[i][0]){const a=edge[i-1],z=edge[i];return a[1]+(z[1]-a[1])*(x-a[0])/(z[0]-a[0]);}return 280;}
// A fixed rectangular mesh has zero displacement at its perimeter. The
// contour and painted interior deform together without a detached head cutout.
const xs=Array.from({length:43},(_,i)=>42+i*10),ys=Array.from({length:32},(_,i)=>68+i*10);
const vertices=ys.map(y=>xs.map(x=>{
 const radius=Math.hypot((x-250)/155,(y-224)/111);
 const weight=smooth((y-106)/16)*(1-smooth((radius-.82)/.45))*(1-smooth((y-(bookY(x)-24))/19));
 return {x,y,dx:(250-x)*.008*weight,dy:(10+Math.max(0,y-140)*.025)*weight};
}));
const triangles=[];
for(let j=0;j<ys.length-1;j++)for(let i=0;i<xs.length-1;i++){
 const a=vertices[j][i],c=vertices[j+1][i+1];
 triangles.push([a,vertices[j][i+1],c],[a,c,vertices[j+1][i]]);
}
function triangle(points,amount){
 const [a,b,c]=points,[p,q,r]=points.map(v=>({x:v.x+v.dx*amount,y:v.y+v.dy*amount}));
 const det=(b.x-a.x)*(c.y-a.y)-(c.x-a.x)*(b.y-a.y);
 const xx=((q.x-p.x)*(c.y-a.y)-(r.x-p.x)*(b.y-a.y))/det;
 const xy=((q.y-p.y)*(c.y-a.y)-(r.y-p.y)*(b.y-a.y))/det;
 const yx=((r.x-p.x)*(b.x-a.x)-(q.x-p.x)*(c.x-a.x))/det;
 const yy=((r.y-p.y)*(b.x-a.x)-(q.y-p.y)*(c.x-a.x))/det;
 ctx.save();
 // Overlap subpixel edges to avoid antialiased gaps between mesh triangles.
 const cx=(p.x+q.x+r.x)/3,cy=(p.y+q.y+r.y)/3;
 ctx.beginPath();[p,q,r].forEach((v,i)=>{const dx=v.x-cx,dy=v.y-cy,s=1+.35/Math.hypot(dx,dy);ctx[i?'lineTo':'moveTo'](cx+dx*s,cy+dy*s);});ctx.closePath();ctx.clip();
 ctx.setTransform(xx,xy,yx,yy,p.x-xx*a.x-yx*a.y,p.y-xy*a.x-yy*a.y);
 ctx.drawImage(base,0,0);ctx.restore();
}
function draw(t){
 if(!ready)return;
 elapsed=Math.max(0,Math.min(duration,t));const amount=dip(elapsed);
 ctx.clearRect(0,0,width,height);ctx.drawImage(base,0,0);
 if(amount>0){
  ctx.save();ctx.beginPath();ctx.rect(0,112,width,height-112);ctx.clip();
  for(const tri of triangles)if(tri.some(v=>v.dy>0))triangle(tri,amount);
  ctx.restore();
 }
 // Restore the book and foreground from the unchanged original drawing.
 ctx.save();ctx.beginPath();edge.forEach(([x,y],i)=>ctx[i?'lineTo':'moveTo'](x,y));ctx.lineTo(width,height);ctx.lineTo(0,height);ctx.closePath();ctx.clip();ctx.drawImage(base,0,0);ctx.restore();
 seek.value=elapsed;document.getElementById('time').value=elapsed.toFixed(1)+' s';play.textContent=playing?'暂停':'播放';
}
source.onload=()=>{b.drawImage(source,0,0,width,height);ready=true;draw(elapsed);};
source.onerror=()=>{playing=false;document.getElementById('error').textContent='原稿加载失败。';};
source.src='../model/reading-soft-v1.png';
play.onclick=()=>{if(elapsed>=duration)elapsed=0;playing=!playing;last=null;draw(elapsed);};
document.getElementById('replay').onclick=()=>{elapsed=0;playing=true;last=null;draw(0);};
seek.oninput=()=>{playing=false;last=null;draw(Number(seek.value));};
function tick(now){if(playing&&ready){if(last!==null)elapsed+=(now-last)/1000;if(elapsed>=duration){elapsed=duration;playing=false;}draw(elapsed);}last=now;requestAnimationFrame(tick);}requestAnimationFrame(tick);
window.readingMotion={draw,dip,get ready(){return ready},get playing(){return playing},duration};
