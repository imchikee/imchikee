// v60 pose motion study: one anchored rotation, no limb scaling or cutout replacement.
const canvas=document.querySelector('#motion'),ctx=canvas.getContext('2d');
const source=new Image();source.src='pose-study-v60.png';
const W=1360,H=1156,root={x:365,y:902},tip={x:734,y:1002},duration=4;
canvas.width=W;canvas.height=H;
let ready=false,playing=false,time=0,last=0;
const smooth=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t)};
function weight(x,y){
 const dx=154,dy=260,t=Math.max(0,Math.min(1,((x-580)*dx+(y-738)*dy)/(dx*dx+dy*dy)));
 const d=Math.hypot(x-580-t*dx,y-738-t*dy);
 const pen=1-smooth((d-25)/30);
 const paw=1-smooth((Math.hypot((x-600)/115,(y-914)/62)-1)/.45);
 const arm=1-smooth((Math.hypot((x-445)/100,(y-917)/45)-1)/.4);
 return Math.max(pen,paw,arm)*smooth((x-365)/80);
}
function angle(t){
 if(t<.5)return 0;
 if(t<2.7)return -.045*smooth((t-.5)/2.2);
 if(t<3.1)return -.045;
 return -.045*(1-smooth((t-3.1)/.9));
}
function rotate(x,y,a){const c=Math.cos(a),s=Math.sin(a);return {x:root.x+(x-root.x)*c-(y-root.y)*s,y:root.y+(x-root.x)*s+(y-root.y)*c};}
function point(x,y,a){const p=rotate(x,y,a),w=weight(x,y);return {x:x+(p.x-x)*w,y:y+(p.y-y)*w};}
function tri(s,d){
 const [p,q,r]=s,[u,v,w]=d;
 const det=(q.x-p.x)*(r.y-p.y)-(r.x-p.x)*(q.y-p.y);
 const a=((v.x-u.x)*(r.y-p.y)-(w.x-u.x)*(q.y-p.y))/det;
 const c=((w.x-u.x)*(q.x-p.x)-(v.x-u.x)*(r.x-p.x))/det;
 const b=((v.y-u.y)*(r.y-p.y)-(w.y-u.y)*(q.y-p.y))/det;
 const e=((w.y-u.y)*(q.x-p.x)-(v.y-u.y)*(r.x-p.x))/det;
 ctx.save();ctx.beginPath();
 const center={x:(u.x+v.x+w.x)/3,y:(u.y+v.y+w.y)/3};
 for(let i=0;i<3;i++){const z=d[i],length=Math.hypot(z.x-center.x,z.y-center.y),k=(length+.65)/length;const x=center.x+(z.x-center.x)*k,y=center.y+(z.y-center.y)*k;i?ctx.lineTo(x,y):ctx.moveTo(x,y)}
 ctx.closePath();ctx.clip();ctx.transform(a,b,c,e,u.x-a*p.x-c*p.y,u.y-b*p.x-e*p.y);ctx.drawImage(source,0,0);ctx.restore();
}
const cells=[];
for(let y=690;y<1060;y+=14)for(let x=300;x<810;x+=14){const a={x,y},b={x:x+14,y},c={x:x+14,y:y+14},d={x,y:y+14};if([a,b,c,d].some(p=>weight(p.x,p.y)>0))cells.push([a,b,c],[a,c,d]);}
function render(t){
 time=Math.max(0,Math.min(duration,t));if(!ready)return;
 ctx.clearRect(0,0,W,H);ctx.drawImage(source,0,0);
 // Redraw the entire deforming region with a continuous mesh, including its fixed border.
 const a=angle(time);
 for(const s of cells)tri(s,s.map(p=>point(p.x,p.y,a)));
 const stop=Math.min(time,2.7);
 if(stop>.5){ctx.beginPath();for(let t=.5;t<=stop+.008;t+=.008){const p=rotate(tip.x,tip.y,angle(Math.min(t,stop)));t===.5?ctx.moveTo(p.x,p.y):ctx.lineTo(p.x,p.y)}ctx.strokeStyle='#70523c';ctx.lineWidth=2;ctx.lineCap='round';ctx.stroke();}
 document.querySelector('#seek').value=time;document.querySelector('#time').textContent=time.toFixed(2)+' s';
}
function loop(now){if(playing){render(time+(now-last)/1000);if(time>=duration){playing=false;document.querySelector('#play').textContent='播放'}}last=now;requestAnimationFrame(loop)}
source.onload=()=>{ready=true;render(0);requestAnimationFrame(loop)};
document.querySelector('#play').onclick=()=>{if(time>=duration)render(0);playing=!playing;document.querySelector('#play').textContent=playing?'暂停':'播放'};
document.querySelector('#replay').onclick=()=>{render(0);playing=true;document.querySelector('#play').textContent='暂停'};
document.querySelector('#seek').oninput=e=>{playing=false;document.querySelector('#play').textContent='播放';render(+e.target.value)};
window.sketchMotion={render,get ready(){return ready},duration,root,tip,angle,rotate,weight};
