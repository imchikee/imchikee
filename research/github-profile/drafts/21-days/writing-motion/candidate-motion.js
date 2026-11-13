// Three painted poses registered like reading-motion; no single-arm translation.
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
const canvas=document.querySelector('#motion'),ctx=canvas.getContext('2d');
// Speed up the six writing strokes and their gaps; retain the lead-in and finish.
const writingSpeed=1.6;
const timing=t=>t<=.4?t:.4+(Math.min(t,4.67)-.4)/writingSpeed+Math.max(0,t-4.67);
const W=1360,H=1156,duration=timing(6.5),liftStart=timing(4.9);canvas.width=W;canvas.height=H;
const make=()=>{const c=document.createElement('canvas');c.width=W;c.height=H;return c;};
const img=src=>{const i=new Image();i.src=src;return i;};
const images=['writing-start-pose.png','writing-end-pose.png','writing-lift-pose.png'].map(img);
const master=img('pose-study-v60.png'),plate=img('sketch-cleanplate.png'),chest=img('chin-chest-v66.png');
const background=make(),layers=images.map(make),warped=[make(),make()],mix=make();
const fixed=[[300,780],[760,780],[760,1040],[300,1040],[325,880],[330,950],[380,875],[395,950]];
// Matched shoulder/forearm and finger landmarks, one column per independently painted pose.
const features=[
 [[482,893],[455,891],[455,888]],[[534,919],[504,920],[500,910]],
 [[529,966],[500,962],[500,953]],[[553,936],[525,935],[519,919]],
 [[575,922],[545,923],[541,906]],[[613,930],[579,931],[576,913]],
 [[638,946],[603,945],[599,928]],[[624,956],[590,956],[589,938]],
 [[627,970],[591,970],[589,950]],[[605,982],[571,981],[568,963]],
 [[573,976],[541,975],[540,959]],[[551,964],[523,962],[518,948]],
 [[591,950],[561,950],[556,934]],
];
const penEnds=[[[503,841],[679,1006]],[[470,843],[646,1008]],[[460,832],[643,981]]];
const contours=[
 // Follow the rounded fur edge, leaving the chest behind the pencil fixed.
 // Keep pencil edges separate from the slightly softer fur boundary.
 {
  arm:'M 324 953 Q 327 898 345 875 Q 420 874 470 879 Q 529 887 565 923 Q 579 916 604 924 Q 628 930 640 945 Q 643 957 628 960 Q 634 975 615 983 Q 590 990 567 979 Q 531 971 501 963 Q 414 956 324 953 Z',
  pencil:'M 489 838 Q 493 826 503 828 Q 516 833 528 846 L 656 974 L 681 1008 L 652 995 L 496 855 Q 484 848 489 838 Z'
 },
 {
  arm:'M 324 953 Q 327 898 345 875 Q 401 874 443 881 Q 498 889 532 925 Q 542 916 570 926 Q 596 929 606 944 Q 609 955 594 960 Q 600 974 581 982 Q 558 990 532 979 Q 498 969 471 962 Q 404 956 324 953 Z',
  pencil:'M 457 840 Q 461 828 471 830 Q 484 835 496 848 L 624 976 L 650 1012 L 620 997 L 464 857 Q 452 850 457 840 Z'
 },
 {
  arm:'M 324 953 Q 328 897 346 875 Q 399 874 440 879 Q 484 880 527 908 Q 535 901 560 906 Q 583 908 601 925 Q 607 936 590 942 Q 596 952 580 962 Q 560 971 537 963 Q 511 959 483 955 Q 408 955 324 953 Z',
  pencil:'M 447 829 Q 451 817 461 818 Q 475 825 486 837 L 618 953 L 647 985 L 619 972 L 454 848 Q 442 837 447 829 Z'
 }
].map(p=>({arm:new Path2D(p.arm),pencil:new Path2D(p.pencil)}));
const armMasks=contours.map(p=>{const c=make(),x=c.getContext('2d');x.filter='blur(2px)';x.fill(p.arm);return c;});
const armFractions=[0,.2,.4,.6,.8,.9,1],armRootX=390;
const wrists=[0,1,2].map(k=>[0,1].map(d=>(features[3][k][d]+features[11][k][d])/2));
// Bind matching points on the actual silhouettes, not just interior fur marks.
const armProfiles=armMasks.map((mask,k)=>armFractions.map(f=>{
 const px=Math.round(armRootX+(wrists[k][0]-armRootX)*f),cy=Math.round(912+(wrists[k][1]-912)*f)-820;
 const data=mask.getContext('2d').getImageData(px,820,1,190).data;let top=cy,bottom=cy;
 while(top>0&&data[(top-1)*4+3]>=128)top--;
 while(bottom<189&&data[(bottom+1)*4+3]>=128)bottom++;
 return {center:[px,820+(top+bottom+1)/2],halfWidth:(bottom-top+1)/2};
}));
const profileStart=fixed.length+features.length;
armFractions.forEach((f,j)=>{for(const side of [-1,1])features.push(armProfiles.map(p=>[p[j].center[0],p[j].center[1]+side*p[j].halfWidth]));});
const pencilStart=fixed.length+features.length;
// Parallel edges and centerline across the whole pencil, including its hidden grip section.
for(const u of [0,.12,.33,.55,.76,.88,1]){
 for(const side of (u===1?[0]:[-1,1]))features.push(penEnds.map(([a,b])=>{const dx=b[0]-a[0],dy=b[1]-a[1],n=Math.hypot(dx,dy),r=u===1?0:11;return [a[0]+dx*u-dy/n*r*side,a[1]+dy*u+dx/n*r*side]}));
}
const points=[0,1,2].map(k=>[...fixed,...features.map(f=>f[k])]);
const mesh=triangulate(points[1]);
function prepare(){
 const b=background.getContext('2d');b.drawImage(master,0,0);
 const m=make(),c=m.getContext('2d');c.filter='blur(5px)';c.fill(new Path2D('M 320 848 L 535 700 L 645 700 L 758 888 L 765 1030 L 540 1020 L 320 990 Z'));c.filter='none';c.globalCompositeOperation='source-in';c.drawImage(plate,0,0);b.drawImage(m,0,0);
 c.clearRect(0,0,W,H);c.globalCompositeOperation='source-over';c.filter='blur(10px)';c.fill(new Path2D('M 344 826 Q 503 805 685 822 Q 810 840 873 822 L 889 928 Q 836 974 691 983 Q 490 990 333 954 Z'));c.filter='none';c.globalCompositeOperation='source-in';c.drawImage(chest,0,0);b.drawImage(m,0,0);
 layers.forEach((l,i)=>{const x=l.getContext('2d');x.drawImage(armMasks[i],0,0);x.filter='blur(.65px)';x.fill(contours[i].pencil);x.filter='none';x.globalCompositeOperation='source-in';x.drawImage(images[i],0,0);x.globalCompositeOperation='source-over';});
}
function warp(out,source,from,to){
 const x=out.getContext('2d');x.clearRect(0,0,W,H);
 for(const ids of mesh){
  const [a,b,c]=ids.map(i=>from[i]),[p,q,r]=ids.map(i=>to[i]);
  const det=(b[0]-a[0])*(c[1]-a[1])-(c[0]-a[0])*(b[1]-a[1]);
  if(Math.abs(det)<1e-6)continue;
  const xx=((q[0]-p[0])*(c[1]-a[1])-(r[0]-p[0])*(b[1]-a[1]))/det;
  const xy=((q[1]-p[1])*(c[1]-a[1])-(r[1]-p[1])*(b[1]-a[1]))/det;
  const yx=((r[0]-p[0])*(b[0]-a[0])-(q[0]-p[0])*(c[0]-a[0]))/det;
  const yy=((r[1]-p[1])*(b[0]-a[0])-(q[1]-p[1])*(c[0]-a[0]))/det;
  x.save();x.beginPath();const cx=(p[0]+q[0]+r[0])/3,cy=(p[1]+q[1]+r[1])/3;
  [p,q,r].forEach(([px,py],i)=>{const dx=px-cx,dy=py-cy,k=1+.35/Math.hypot(dx,dy);x[i?'lineTo':'moveTo'](cx+dx*k,cy+dy*k)});x.closePath();x.clip();
  x.setTransform(xx,xy,yx,yy,p[0]-xx*a[0]-yx*a[1],p[1]-xy*a[0]-yy*a[1]);x.drawImage(source,0,0);x.restore();
 }
}
const smooth=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t)};
const clamp=t=>Math.max(0,Math.min(1,t));
const lerp=(a,b,u)=>a.map((v,j)=>v+(b[j]-v)*u);
// Coordinates face the hamster. Each stroke has its own contact interval;
// intervening moves lift the graphite and never draw a connecting line.
const strokes=[
 {name:'i stem',a:[0,0],b:[0,10],start:.4,end:.95},
 {name:'i dot',a:[0,-4],b:[.15,-4],start:1.2,end:1.34},
 {name:'first + crossbar',a:[10,4],b:[20,4],start:1.78,end:2.22},
 {name:'first + stem',a:[15,-1],b:[15,9],start:2.48,end:3},
 {name:'second + crossbar',a:[26,4],b:[36,4],start:3.45,end:3.89},
 {name:'second + stem',a:[31,-1],b:[31,9],start:4.15,end:4.67},
].map(s=>({...s,start:timing(s.start),end:timing(s.end)}));
const paperY=[-.9,-.65],startTip=penEnds[0][1],endTip=penEnds[1][1];
// Match the notebook baseline rather than the displacement between pose sources.
const paperX=[-1,-.02];
// Fixed notebook crown, anchored at the existing first pencil contact.
const paperCrown=x=>-18*Math.sin(Math.PI*(x-400)/380);
const onPaper=([x,y])=>{
 const p=startTip.map((v,j)=>v+x*paperX[j]+y*paperY[j]);
 p[1]+=paperCrown(p[0])-paperCrown(startTip[0]);return p;
};
function pen(t){
 if(t<strokes[0].start)return {glyph:strokes[0].a,lift:0,contact:false};
 for(let i=0;i<strokes.length;i++){
  const s=strokes[i];
  if(t<=s.end)return {glyph:lerp(s.a,s.b,smooth((t-s.start)/(s.end-s.start))),lift:0,contact:true};
  const next=strokes[i+1];
  if(next&&t<next.start){const u=clamp((t-s.end)/(next.start-s.end));return {glyph:lerp(s.b,next.a,smooth(u)),lift:6*Math.sin(Math.PI*u),contact:false};}
 }
 return {glyph:strokes.at(-1).b,lift:0,contact:false};
}
function stableGeometry(k,u,tip){
 const a=lerp(penEnds[k][0],penEnds[k+1][0],u),b=lerp(penEnds[k][1],penEnds[k+1][1],u);
 const angle=Math.atan2(b[1]-a[1],b[0]-a[0])-Math.atan2(startTip[1]-penEnds[0][0][1],startTip[0]-penEnds[0][0][0]);
 const rotate=(p,theta)=>[p[0]*Math.cos(theta)-p[1]*Math.sin(theta),p[0]*Math.sin(theta)+p[1]*Math.cos(theta)];
 const rigid=p=>rotate(p.map((v,j)=>v-startTip[j]),angle).map((v,j)=>v+tip[j]);
 // Move each forearm section towards the wrist while keeping its reference
 // diameter. The paw and pencil share one rigid transform, with no scaling.
 const sections=armProfiles[0].map((p,j)=>({center:lerp(p.center,rigid(p.center),armFractions[j]),normal:rotate([0,1],angle*armFractions[j]),halfWidth:p.halfWidth}));
 function forearmPoint(p){
  const f=clamp((p[0]-armRootX)/(wrists[0][0]-armRootX));let j=0;
  while(j<armFractions.length-2&&f>armFractions[j+1])j++;
  const v=(f-armFractions[j])/(armFractions[j+1]-armFractions[j]);
  const from=lerp(armProfiles[0][j].center,armProfiles[0][j+1].center,v),to=lerp(sections[j].center,sections[j+1].center,v);
  return rotate(p.map((q,d)=>q-from[d]),angle*f).map((q,d)=>q+to[d]);
 }
 return points[0].map((p,i)=>{
  if(i<fixed.length)return p;
  if(i<fixed.length+3)return forearmPoint(p);
  if(i<profileStart||i>=pencilStart)return rigid(p);
  const j=Math.floor((i-profileStart)/2),side=(i-profileStart)%2?1:-1,s=sections[j];
  return s.center.map((v,d)=>v+s.normal[d]*side*s.halfWidth);
 });
}
function pose(t){
 if(t>=liftStart){const u=smooth((t-liftStart)/.6),tip=lerp(endTip,penEnds[2][1],u);return {k:1,u,to:stableGeometry(1,u,tip),tip,contact:false};}
 const s=pen(t),u=clamp(s.glyph[0]/31),tip=onPaper(s.glyph);tip[1]-=s.lift;
 return {k:0,u,to:stableGeometry(0,u,tip),tip,contact:s.contact};
}
function drawInk(t){
 ctx.strokeStyle='#493b30';ctx.lineWidth=2.4;ctx.lineCap='round';ctx.lineJoin='round';
 for(const s of strokes){
  if(t<=s.start)break;
  const u=smooth((t-s.start)/(s.end-s.start));
  ctx.beginPath();ctx.moveTo(...onPaper(s.a));for(let j=1;j<=12;j++)ctx.lineTo(...onPaper(lerp(s.a,s.b,u*j/12)));ctx.stroke();
 }
}
let ready=false,playing=false,time=0,last=0;
function render(t){
 time=Math.max(0,Math.min(duration,t));if(!ready)return;
 const {k,u,to}=pose(time);
 ctx.clearRect(0,0,W,H);ctx.drawImage(background,0,0);
 drawInk(time);
 const exact=to.every((p,i)=>p.every((v,j)=>Math.abs(v-points[k+(u===1?1:0)][i][j])<1e-8));
 if((u===0||u===1)&&exact)ctx.drawImage(layers[k+(u===1?1:0)],0,0);
 else{
  warp(warped[0],layers[k],points[k],to);warp(warped[1],layers[k+1],points[k+1],to);
  const c=mix.getContext('2d');c.clearRect(0,0,W,H);c.globalCompositeOperation='source-over';c.globalAlpha=1-u;c.drawImage(warped[0],0,0);c.globalCompositeOperation='lighter';c.globalAlpha=u;c.drawImage(warped[1],0,0);c.globalAlpha=1;c.globalCompositeOperation='source-over';ctx.drawImage(mix,0,0);
 }
 document.querySelector('#seek').value=time;document.querySelector('#time').textContent=time.toFixed(2)+' s';
 if(window.writingScene)window.writingScene.draw(time);
}
function validate(){
 const area=(p,t)=>{const [a,b,c]=t.map(i=>p[i]);return (b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0])};let folded=0;
 let tracking=0;
 for(let j=0;j<=200;j++){const s=pose(duration*j/200);for(const tri of mesh)if(area(points[0],tri)*area(s.to,tri)<=0)folded++;tracking=Math.max(tracking,Math.hypot(...s.to.at(-1).map((v,i)=>v-s.tip[i])));}
 render(0);const before=ctx.getImageData(0,0,W,760).data.slice();render(timing(5.5));const after=ctx.getImageData(0,0,W,760).data;let changed=0;for(let i=0;i<before.length;i++)if(before[i]!==after[i])changed++;
 return {paintedPoses:3,writing:'i++',strokes:strokes.length,foldedTriangles:folded,tipTrackingError:tracking,changedFacePixels:changed};
}
function loop(now){if(playing){render(time+(now-last)/1000);if(time>=duration){playing=false;document.querySelector('#play').textContent='播放'}}last=now;requestAnimationFrame(loop)}
Promise.all([...images,master,plate,chest].map(i=>i.decode())).then(()=>{prepare();ready=true;document.querySelector('#seek').max=duration;render(0);requestAnimationFrame(loop)});
document.querySelector('#play').onclick=()=>{if(time>=duration)render(0);playing=!playing;document.querySelector('#play').textContent=playing?'暂停':'播放'};
document.querySelector('#replay').onclick=()=>{render(0);playing=true;document.querySelector('#play').textContent='暂停'};
document.querySelector('#seek').oninput=e=>{playing=false;document.querySelector('#play').textContent='播放';render(+e.target.value)};
window.sketchMotion={render,validate,pose,timing,get ready(){return ready},duration,reviewTimes:[['start',0],['middle',2.22],['end',4.67],['return',6.5],['lift',5.2],['late',5.5]].map(([name,t])=>[name,timing(t)])};
