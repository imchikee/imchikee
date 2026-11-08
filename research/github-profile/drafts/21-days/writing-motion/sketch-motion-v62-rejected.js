// v60 pose with v61 local foreleg: fixed root, gentle elbow follow, wrist-led paw/pencil motion.
const canvas=document.querySelector('#motion'),ctx=canvas.getContext('2d');
const source=new Image();source.src='foreleg-v61.png';
const master=new Image();master.src='pose-study-v60.png';
const W=1360,H=1156,root={x:365,y:902},tip={x:734,y:1002},duration=6.5;
canvas.width=W;canvas.height=H;
let ready=false,playing=false,time=0,last=0;
const smooth=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t)};
// Glyph coordinates face the hamster; both axes follow the notebook plane.
const page=(x,y)=>({x:tip.x-.65*x-.28*y,y:tip.y+.091*x-.72*y});
const glyphs=[[[0,0],[0,10]],[[0,-4],[.15,-4]],[[10,4],[20,4]],[[15,-1],[15,9]],[[26,4],[36,4]],[[31,-1],[31,9]],[[44,0],[44.15,0]],[[44,6],[44,9],[46,12]]];
const strokes=glyphs.map((points,i)=>({points:points.map(p=>page(...p)),start:.5+i*.65,end:.5+i*.65+.42}));
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
const wrist={x:640,y:905};
const length1=Math.hypot(wrist.x-root.x,wrist.y-root.y),length2=Math.hypot(tip.x-wrist.x,tip.y-wrist.y);
const rest1=Math.atan2(wrist.y-root.y,wrist.x-root.x),rest2=Math.atan2(tip.y-wrist.y,tip.x-wrist.x)-rest1;
function angle(t){
 const p=target(t),x=p.x-root.x,y=p.y-root.y;
 const b=Math.acos(Math.max(-1,Math.min(1,(x*x+y*y-length1*length1-length2*length2)/(2*length1*length2))));
 const a=Math.atan2(y,x)-Math.atan2(length2*Math.sin(b),length1+length2*Math.cos(b));
 return {arm:a-rest1,wrist:b-rest2};
}
function around(x,y,a,p){const c=Math.cos(a),s=Math.sin(a);return {x:p.x+(x-p.x)*c-(y-p.y)*s,y:p.y+(x-p.x)*s+(y-p.y)*c};}
function rotate(x,y,a){
 // The pencil and entire pink paw share one rigid transform; only the furry wrist blends.
 const w=Math.max(smooth((x-380)/185),smooth((850-y)/30)),p=around(x,y,a.wrist,wrist);
 return around(x+(p.x-x)*w,y+(p.y-y)*w,a.arm,root);
}
const plate=new Image();plate.src='sketch-cleanplate.png';
const limb=new Path2D('M 357 866 Q 420 879 482 883 Q 549 863 617 847 L 560 767 Q 548 746 568 734 Q 591 721 605 742 Q 609 752 605 762 L 648 847 Q 714 850 715 897 L 711 918 L 732 978 L 738 1005 L 718 983 L 699 945 Q 680 979 632 979 Q 590 981 560 959 Q 486 995 412 974 Q 348 956 357 866 Z');
const make=()=>{const c=document.createElement('canvas');c.width=W;c.height=H;return c};
const layer=make(),background=make();
function prepare(){
 const l=layer.getContext('2d');l.save();l.clip(limb);l.drawImage(source,0,0);l.restore();
 const mask=make(),m=mask.getContext('2d');m.filter='blur(5px)';m.fill(limb);m.lineWidth=78;m.stroke(limb);m.filter='none';m.globalCompositeOperation='source-in';m.drawImage(plate,0,0);
 const b=background.getContext('2d');b.drawImage(master,0,0);b.drawImage(mask,0,0);
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
 
 ctx.strokeStyle='#61452f';ctx.lineWidth=2.4;ctx.lineCap='round';ctx.lineJoin='round';
 for(const stroke of strokes){
  if(time<=stroke.start)break;
  const u=smooth(Math.min(1,(time-stroke.start)/(stroke.end-stroke.start)));
  ctx.beginPath();ctx.moveTo(stroke.points[0].x,stroke.points[0].y);
  for(let f=.02;f<u;f+=.02){const p=along(stroke.points,f);ctx.lineTo(p.x,p.y)}
  const p=along(stroke.points,u);ctx.lineTo(p.x,p.y);ctx.stroke();
 }
 for(const cell of cells)tri(cell,cell.map(p=>rotate(p.x,p.y,a)));
 document.querySelector('#seek').value=time;document.querySelector('#time').textContent=time.toFixed(2)+' s';
}
function loop(now){if(playing){render(time+(now-last)/1000);if(time>=duration){playing=false;document.querySelector('#play').textContent='播放'}}last=now;requestAnimationFrame(loop)}
Promise.all([source.decode(),plate.decode(),master.decode()]).then(()=>{prepare();ready=true;render(0);requestAnimationFrame(loop)});
document.querySelector('#play').onclick=()=>{if(time>=duration)render(0);playing=!playing;document.querySelector('#play').textContent=playing?'暂停':'播放'};
document.querySelector('#replay').onclick=()=>{render(0);playing=true;document.querySelector('#play').textContent='暂停'};
document.querySelector('#seek').oninput=e=>{playing=false;document.querySelector('#play').textContent='播放';render(+e.target.value)};
window.sketchMotion={render,get ready(){return ready},duration,root,tip,angle,rotate,target,strokes};
