// v67: continuous shoulder-to-paw sampling, fixed proximal shoulder, cheek occlusion.
const canvas=document.querySelector('#motion'),ctx=canvas.getContext('2d');
const source=new Image();source.src='foreleg-v66.png';
const master=new Image();master.src='pose-study-v60.png';
const W=1360,H=1156,root={x:470,y:917},tip={x:708,y:1005},duration=6.5;
canvas.width=W;canvas.height=H;
let ready=false,playing=false,time=0,last=0;
const smooth=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t)};
// Glyph coordinates face the hamster; both axes follow the notebook plane.
const page=(x,y)=>({x:tip.x-.65*x-.28*y,y:tip.y+.091*x-.72*y});
const glyphs=[[[0,0],[0,10]],[[0,-4],[.15,-4]],[[10,4],[20,4]],[[15,-1],[15,9]],[[26,4],[36,4]],[[31,-1],[31,9]],[[44,0],[44.15,0]],[[44,6],[44,9],[46,12]]];
const strokeDurations=[.45,.1,.38,.42,.36,.42,.1,.36],gaps=[.25,.4,.25,.4,.25,.42,.3,0];
let cursor=.45;
const strokes=glyphs.map((points,i)=>{const start=cursor,end=start+strokeDurations[i];cursor=end+gaps[i];return {points:points.map(p=>page(...p)),start,end}});
function along(points,u){const q=Math.min(points.length-1,u*(points.length-1)),i=Math.min(points.length-2,Math.floor(q)),f=q-i;return {x:points[i].x+(points[i+1].x-points[i].x)*f,y:points[i].y+(points[i+1].y-points[i].y)*f};}
function target(t){
 let previous=tip,ended=0;
 for(const stroke of strokes){
  if(t<stroke.start){const u=smooth((t-ended)/(stroke.start-ended)),p=stroke.points[0];return {x:previous.x+(p.x-previous.x)*u,y:previous.y+(p.y-previous.y)*u-5*Math.sin(Math.PI*u)};}
  if(t<=stroke.end)return along(stroke.points,smooth((t-stroke.start)/(stroke.end-stroke.start)));
  previous=stroke.points.at(-1);ended=stroke.end;
 }
 return {x:previous.x,y:previous.y-5*smooth((t-ended)/.4)};
}
function angle(t){const p=target(t);return {dx:p.x-tip.x,dy:p.y-tip.y};}
// Tilt the intact grip and pencil toward a supported pencil-writing posture.
const pencilTilt=-.32;
function pencilPoint(x,y,a){const c=Math.cos(pencilTilt),s=Math.sin(pencilTilt);return {x:tip.x+(x-tip.x)*c-(y-tip.y)*s+a.dx,y:tip.y+(x-tip.x)*s+(y-tip.y)*c+a.dy};}
function rotate(x,y,a){
 const w=smooth((x-470)/100),p=pencilPoint(x,y,a);
 return {x:x+(p.x-x)*w,y:y+(p.y-y)*w};
}
function skin(x,y,a){
 // The exposed shaft is rigid even where its x coordinate is left of the wrist.
 if(y<890 && x>540)return pencilPoint(x,y,a);
 return rotate(x,y,a);
}
const plate=new Image();plate.src='sketch-cleanplate.png';
const chest=new Image();chest.src='chin-chest-v66.png';
const limb=new Path2D('M 335 849 Q 415 843 474 869 Q 541 886 594 905 Q 611 895 643 893 Q 666 893 679 907 Q 690 919 677 926 Q 684 938 674 943 Q 671 960 649 966 Q 622 975 597 968 Q 541 978 491 954 Q 427 954 328 954 Q 329 890 335 849 Z M 562 746 Q 560 735 578 733 Q 593 731 600 747 L 674 912 L 690 958 L 711 1009 L 690 986 L 665 940 L 565 760 Z');
const make=()=>{const c=document.createElement('canvas');c.width=W;c.height=H;return c};
const layer=make(),background=make(),cheek=make();
function prepare(){
 const l=layer.getContext('2d');
 // A subpixel soft contour retains the painted edge instead of a hard vector cut.
 l.filter='blur(0.8px)';l.fill(limb);l.filter='none';
 l.globalCompositeOperation='source-in';l.drawImage(source,0,0);
 l.globalCompositeOperation='source-over';

 const mask=make(),m=mask.getContext('2d');m.filter='blur(5px)';m.fill(new Path2D('M 323 850 L 542 701 L 637 701 L 753 891 L 765 1035 L 550 1020 L 322 987 Z'));m.filter='none';m.globalCompositeOperation='source-in';m.drawImage(plate,0,0);
 const b=background.getContext('2d');b.drawImage(master,0,0);b.drawImage(mask,0,0);
 // Continuous chest patch spans both sides of the former plate seam.
 const cm=make(),cc=cm.getContext('2d');cc.filter='blur(10px)';cc.fill(new Path2D('M 344 826 Q 503 805 685 822 Q 810 840 873 822 L 889 928 Q 836 974 691 983 Q 490 990 333 954 Z'));cc.filter='none';cc.globalCompositeOperation='source-in';cc.drawImage(chest,0,0);b.drawImage(cm,0,0);
 // Use the actual fixed shoulder tissue behind the moving distal forearm.
 const shoulder=make(),sc=shoulder.getContext('2d');sc.filter='blur(3px)';sc.fill(new Path2D('M 333 856 Q 400 846 468 876 L 478 941 Q 402 956 330 954 Z'));sc.filter='none';sc.globalCompositeOperation='source-in';sc.drawImage(source,0,0);b.drawImage(shoulder,0,0);
 // The cheek sits in front of the upper shoulder, not a faded joint.
 const oc=cheek.getContext('2d');oc.filter='blur(1.5px)';oc.fill(new Path2D('M 311 801 Q 405 815 495 832 L 525 869 Q 434 873 375 863 Q 337 852 311 833 Z'));oc.filter='none';oc.globalCompositeOperation='source-in';oc.drawImage(background,0,0);
}
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
 ctx.closePath();ctx.clip();ctx.transform(a,b,c,e,u.x-a*p.x-c*p.y,u.y-b*p.x-e*p.y);ctx.drawImage(layer,0,0);ctx.restore();
}
const cells=[];
for(let y=710;y<1020;y+=14)for(let x=320;x<770;x+=14){const a={x,y},b={x:x+14,y},c={x:x+14,y:y+14},d={x,y:y+14};cells.push([a,b,c],[a,c,d]);}
function render(t){
 time=Math.max(0,Math.min(duration,t));if(!ready)return;
 ctx.clearRect(0,0,W,H);ctx.drawImage(background,0,0);
 // Mesh is applied only to the transparent forelimb; the paper and face are fixed.
 const a=angle(time);
 
 // Local contact on the paper: close, soft shadow, not a halo around the cutout.
 const lift=Math.max(0,-a.dy-2),shadowAlpha=.17-Math.min(.055,lift*.006);
 ctx.save();ctx.filter='blur(4px)';ctx.fillStyle=`rgba(99,56,24,${shadowAlpha})`;
 ctx.beginPath();ctx.ellipse(568+a.dx*.72,969,79,6,0,0,Math.PI*2);ctx.fill();
 ctx.filter='blur(1.5px)';ctx.fillStyle='rgba(98,52,24,.13)';
 ctx.beginPath();ctx.ellipse(620+a.dx,969,25,2.5,0,0,Math.PI*2);ctx.fill();ctx.restore();
 ctx.strokeStyle='#61452f';ctx.lineWidth=2.4;ctx.lineCap='round';ctx.lineJoin='round';
 for(const stroke of strokes){
  if(time<=stroke.start)break;
  const u=smooth(Math.min(1,(time-stroke.start)/(stroke.end-stroke.start)));
  ctx.beginPath();ctx.moveTo(stroke.points[0].x,stroke.points[0].y);
  for(let f=.02;f<u;f+=.02){const p=along(stroke.points,f);ctx.lineTo(p.x,p.y)}
  const p=along(stroke.points,u);ctx.lineTo(p.x,p.y);ctx.stroke();
 }
 for(const cell of cells)tri(cell,cell.map(p=>skin(p.x,p.y,a)));
 ctx.drawImage(cheek,0,0);
 document.querySelector('#seek').value=time;document.querySelector('#time').textContent=time.toFixed(2)+' s';
}
function loop(now){if(playing){render(time+(now-last)/1000);if(time>=duration){playing=false;document.querySelector('#play').textContent='播放'}}last=now;requestAnimationFrame(loop)}
Promise.all([source.decode(),plate.decode(),master.decode(),chest.decode()]).then(()=>{prepare();ready=true;render(0);requestAnimationFrame(loop)});
document.querySelector('#play').onclick=()=>{if(time>=duration)render(0);playing=!playing;document.querySelector('#play').textContent=playing?'暂停':'播放'};
document.querySelector('#replay').onclick=()=>{render(0);playing=true;document.querySelector('#play').textContent='暂停'};
document.querySelector('#seek').oninput=e=>{playing=false;document.querySelector('#play').textContent='播放';render(+e.target.value)};
window.sketchMotion={render,get ready(){return ready},duration,root,tip,angle,rotate,pencilPoint,target,strokes};
