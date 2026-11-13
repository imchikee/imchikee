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
const W=1360,H=1156,duration=3.2;canvas.width=W;canvas.height=H;
const make=()=>{const c=document.createElement('canvas');c.width=W;c.height=H;return c;};
const img=src=>{const i=new Image();i.src=src;return i;};
const images=['grip-pencil-candidate.png','writing-end-pose.png','writing-lift-pose.png'].map(img);
const master=img('pose-study-v60.png'),plate=img('sketch-cleanplate.png'),chest=img('chin-chest-v66.png');
const background=make(),layers=images.map(make),warped=[make(),make()],mix=make();
const fixed=[[300,780],[760,780],[760,1040],[300,1040],[325,880],[330,950],[380,875],[395,950],[440,899],[440,956]];
// Matched shoulder/forearm and finger landmarks, one column per independently painted pose.
const features=[
 [[480,895],[455,891],[455,888]],[[535,919],[504,920],[500,910]],
 [[535,962],[500,962],[500,953]],[[581,931],[525,935],[519,919]],
 [[603,921],[545,923],[541,906]],[[637,929],[579,931],[576,913]],
 [[660,944],[603,945],[599,928]],[[647,953],[590,956],[589,938]],
 [[650,966],[591,970],[589,950]],[[630,979],[571,981],[568,963]],
 [[598,976],[541,975],[540,959]],[[580,964],[523,962],[518,948]],
 [[620,951],[561,950],[556,934]],
];
const penEnds=[[[530,838],[708,1005]],[[470,843],[646,1008]],[[460,832],[643,981]]];
// Parallel edges and centerline across the whole pencil, including its hidden grip section.
for(const u of [0,.12,.33,.55,.76,.88,1]){
 for(const side of (u===1?[0]:[-1,1]))features.push(penEnds.map(([a,b])=>{const dx=b[0]-a[0],dy=b[1]-a[1],n=Math.hypot(dx,dy),r=u===1?0:11;return [a[0]+dx*u-dy/n*r*side,a[1]+dy*u+dx/n*r*side]}));
}
const points=[0,1,2].map(k=>[...fixed,...features.map(f=>f[k])]);
const mesh=triangulate(points[0]);
const contours=[
 'M 324 953 Q 326 901 345 873 Q 407 866 471 884 Q 527 908 581 931 Q 599 913 626 920 Q 652 925 662 940 Q 667 951 651 954 Q 659 967 644 973 Q 629 987 598 979 Q 561 978 535 964 Q 477 958 412 956 Z M 518 837 Q 519 827 530 826 Q 539 825 548 836 L 682 967 L 711 1009 L 676 991 L 523 851 Q 515 846 518 837 Z',
 'M 324 953 Q 327 898 345 875 Q 401 869 455 887 Q 502 906 525 935 Q 542 916 570 926 Q 596 929 606 944 Q 609 955 594 960 Q 600 974 581 982 Q 558 990 532 979 Q 498 969 471 962 Q 404 956 324 953 Z M 457 840 Q 461 828 471 830 Q 484 835 496 848 L 624 976 L 650 1012 L 620 997 L 464 857 Q 452 850 457 840 Z',
 'M 324 953 Q 328 897 346 875 Q 399 868 456 883 Q 494 893 520 918 Q 535 901 560 906 Q 583 908 601 925 Q 607 936 590 942 Q 596 952 580 962 Q 560 971 537 963 Q 511 959 483 955 Q 408 955 324 953 Z M 447 829 Q 451 817 461 818 Q 475 825 486 837 L 618 953 L 647 985 L 619 972 L 454 848 Q 442 837 447 829 Z'
].map(p=>new Path2D(p));
function prepare(){
 const b=background.getContext('2d');b.drawImage(master,0,0);
 const m=make(),c=m.getContext('2d');c.filter='blur(5px)';c.fill(new Path2D('M 320 848 L 535 700 L 645 700 L 758 888 L 765 1030 L 540 1020 L 320 990 Z'));c.filter='none';c.globalCompositeOperation='source-in';c.drawImage(plate,0,0);b.drawImage(m,0,0);
 c.clearRect(0,0,W,H);c.globalCompositeOperation='source-over';c.filter='blur(10px)';c.fill(new Path2D('M 344 826 Q 503 805 685 822 Q 810 840 873 822 L 889 928 Q 836 974 691 983 Q 490 990 333 954 Z'));c.filter='none';c.globalCompositeOperation='source-in';c.drawImage(chest,0,0);b.drawImage(m,0,0);
 layers.forEach((l,i)=>{const x=l.getContext('2d');x.filter='blur(.65px)';x.fill(contours[i]);x.filter='none';x.globalCompositeOperation='source-in';x.drawImage(images[i],0,0);x.globalCompositeOperation='source-over';});
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
function pose(t){if(t<1.7)return {k:0,u:smooth((t-.4)/1.3)};return {k:1,u:smooth((t-1.9)/.6)}}
let ready=false,playing=false,time=0,last=0;
function render(t){
 time=Math.max(0,Math.min(duration,t));if(!ready)return;
 const {k,u}=pose(time),to=points[k].map((p,i)=>p.map((v,j)=>v+(points[k+1][i][j]-v)*u));
 ctx.clearRect(0,0,W,H);ctx.drawImage(background,0,0);
 if(time>.4){const f=smooth((time-.4)/1.3),a=penEnds[0][1],b=penEnds[1][1];ctx.strokeStyle='#61452f';ctx.lineWidth=2.4;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(...a);ctx.lineTo(a[0]+(b[0]-a[0])*f,a[1]+(b[1]-a[1])*f);ctx.stroke();}
 if(u===0)ctx.drawImage(layers[k],0,0);
 else if(u===1)ctx.drawImage(layers[k+1],0,0);
 else{
  warp(warped[0],layers[k],points[k],to);warp(warped[1],layers[k+1],points[k+1],to);
  const c=mix.getContext('2d');c.clearRect(0,0,W,H);c.globalCompositeOperation='source-over';c.globalAlpha=1-u;c.drawImage(warped[0],0,0);c.globalCompositeOperation='lighter';c.globalAlpha=u;c.drawImage(warped[1],0,0);c.globalAlpha=1;c.globalCompositeOperation='source-over';ctx.drawImage(mix,0,0);
 }
 document.querySelector('#seek').value=time;document.querySelector('#time').textContent=time.toFixed(2)+' s';
}
function validate(){
 const area=(p,t)=>{const [a,b,c]=t.map(i=>p[i]);return (b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0])};let folded=0;
 for(let j=0;j<=100;j++){const {k,u}=pose(duration*j/100),p=points[k].map((v,i)=>v.map((x,h)=>x+(points[k+1][i][h]-x)*u));for(const tri of mesh)if(area(points[0],tri)*area(p,tri)<=0)folded++;}
 render(0);const before=ctx.getImageData(0,0,W,760).data.slice();render(2.2);const after=ctx.getImageData(0,0,W,760).data;let changed=0;for(let i=0;i<before.length;i++)if(before[i]!==after[i])changed++;
 return {paintedPoses:3,foldedTriangles:folded,changedFacePixels:changed};
}
function loop(now){if(playing){render(time+(now-last)/1000);if(time>=duration){playing=false;document.querySelector('#play').textContent='播放'}}last=now;requestAnimationFrame(loop)}
Promise.all([...images,master,plate,chest].map(i=>i.decode())).then(()=>{prepare();ready=true;document.querySelector('#seek').max=duration;render(0);requestAnimationFrame(loop)});
document.querySelector('#play').onclick=()=>{if(time>=duration)render(0);playing=!playing;document.querySelector('#play').textContent=playing?'暂停':'播放'};
document.querySelector('#replay').onclick=()=>{render(0);playing=true;document.querySelector('#play').textContent='暂停'};
document.querySelector('#seek').oninput=e=>{playing=false;document.querySelector('#play').textContent='播放';render(+e.target.value)};
window.sketchMotion={render,validate,pose,get ready(){return ready},duration,reviewTimes:[['start',0],['middle',1.05],['end',1.7],['return',3.2],['lift',2.2],['late',2.5]]};
