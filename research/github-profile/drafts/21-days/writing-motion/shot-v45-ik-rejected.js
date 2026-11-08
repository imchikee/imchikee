'use strict';
window.createWritingShot=function(canvas,assetBase){
 const width=534,height=485,duration=3.2,sw=1316,sh=1195;
 canvas.width=width;canvas.height=height;const ctx=canvas.getContext('2d');
 const image=new Image(),clean=new Image(),roi={x:315,y:770,width:340,height:240};
 let loaded=false,background,arm,hand,limb,staticInk;
 const smooth=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);};
 // Author's top-left is the camera's near/right corner: the text faces the hamster.
 function plane(q,W=240,H=140){
  const [p0,p1,p2,p3]=q,dx1=p1.x-p2.x,dx2=p3.x-p2.x,dy1=p1.y-p2.y,dy2=p3.y-p2.y;
  const sx=p0.x-p1.x+p2.x-p3.x,sy=p0.y-p1.y+p2.y-p3.y,den=dx1*dy2-dx2*dy1;
  const g=(sx*dy2-dx2*sy)/den,h=(dx1*sy-sx*dy1)/den;
  const a=p1.x-p0.x+g*p1.x,b=p3.x-p0.x+h*p3.x,c=p0.x;
  const d=p1.y-p0.y+g*p1.y,e=p3.y-p0.y+h*p3.y,f=p0.y;
  return{q,W,H,map(u,v){u/=W;v/=H;const z=1+g*u+h*v;return{x:(a*u+b*v+c)/z,y:(d*u+e*v+f)/z};},inverse(x,y){
   const aa=a-x*g,bb=b-x*h,dd=d-y*g,ee=e-y*h,z=aa*ee-bb*dd;
   return{u:W*((x-c)*ee-bb*(y-f))/z,v:H*(aa*(y-f)-(x-c)*dd)/z};
  }};
 }
 const left=plane([{x:759,y:1000},{x:467,y:1017},{x:428,y:900},{x:682,y:877}]);
 const right=plane([{x:1016,y:969},{x:772,y:999},{x:698,y:878},{x:918,y:875}]);
 const origin={x:586,y:933},W0={x:487,y:889},size=.9;
 const start=left.inverse(origin.x,origin.y);start.v-=5*size;
 const strokes=[
  {start:.30,end:.50,points:[[0,5],[8,5]]},{start:.58,end:.78,points:[[4,1],[4,9]]},
  {start:.91,end:1.11,points:[[12,5],[20,5]]},{start:1.19,end:1.39,points:[[16,1],[16,9]]},
  {start:1.52,end:1.78,points:[[26,3],[26,11]]},{start:1.90,end:1.97,points:[[26,0],[26,.25]]},
  {start:2.10,end:2.17,points:[[34,3],[34,3.25]]},{start:2.30,end:2.62,points:[[34,10],[35,12],[32,14]]}
 ];
 function inkPoint(stroke,p){const a=stroke.points,q=1-p;
  const u=a.length===2?a[0][0]*q+a[1][0]*p:q*q*a[0][0]+2*q*p*a[1][0]+p*p*a[2][0];
  const v=a.length===2?a[0][1]*q+a[1][1]*p:q*q*a[0][1]+2*q*p*a[1][1]+p*p*a[2][1];
  return left.map(start.u+u*size,start.v+v*size);
 }
 function pen(t){let previous=origin,end=0;
  for(const s of strokes){
   if(t<s.start){const p=smooth((t-end)/(s.start-end)),next=inkPoint(s,0);return{tip:{x:previous.x+(next.x-previous.x)*p,y:previous.y+(next.y-previous.y)*p},lift:4*Math.sin(p*Math.PI)};}
   if(t<=s.end){const p=smooth((t-s.start)/(s.end-s.start));return{tip:inkPoint(s,p),lift:0,bend:.012*Math.sin(p*Math.PI*2)};}
   previous=inkPoint(s,1);end=s.end;
  }
  return{tip:previous,lift:5*smooth((t-end)/.33)};
 }
 // The forearm stays supported while the paw slides along the page.
 function joints(state){
  const {tip,lift}=state,dx=origin.x-W0.x,dy=origin.y-W0.y;
  const contactAngle=.0007*(origin.x-tip.x)+(state.bend||0),c=Math.cos(contactAngle),s=Math.sin(contactAngle);
  const W={x:tip.x-c*dx+s*dy,y:tip.y-s*dx-c*dy};
  return{W,b:contactAngle-lift/Math.hypot(dx,dy),contactAngle};
 }
 function surface(w=sw,h=sh){const c=document.createElement('canvas');c.width=w;c.height=h;return c;}
 const pawShape='M482 875 C489 857 507 853 523 857 C548 857 565 870 566 886 C573 895 565 904 559 904 C560 915 551 921 540 920 C529 931 508 926 494 918 C478 915 472 901 475 889 C475 882 478 877 482 875 Z';
 const thumbShape='M557 857 C567 850 578 862 577 872 Q580 880 571 886 L561 871 Z';
 const penTop='M522 813 C517 805 520 800 529 798 C536 796 540 801 542 808 L569 878 L580 912 L588 934 L581 930 L569 912 L558 882 L531 822 Z';
 const penShadow='M517 791 C535 784 552 802 560 817 L590 876 L559 881 L527 828 Z';
 const penTip='M562 897 L579 917 L588 934 L582 932 L569 917 L556 902 Z';
 const cheekRepair='M502 796 Q528 780 550 798 Q576 814 608 815 L614 857 Q600 878 558 878 Q524 861 510 832 Z';
 const forearmShape='M338 817 C365 815 394 827 423 834 C449 840 473 847 492 864 L491 910 C462 921 419 910 375 900 C352 895 329 884 319 874 L321 847 Z';
 const forearmErase='M390 835 C422 827 451 838 475 850 L507 873 L503 925 C458 932 421 918 392 903 Z';
 function mask(paths,expand,blur){const c=surface(roi.width,roi.height),m=c.getContext('2d');m.translate(-roi.x,-roi.y);m.fillStyle='white';m.strokeStyle='white';m.lineJoin='round';m.filter='blur('+blur+'px)';
  for(const data of paths){const path=new Path2D(data);m.fill(path);if(expand){m.lineWidth=expand;m.stroke(path);}}return c;
 }
 function cutout(paths,expand,blur){const c=surface(roi.width,roi.height),cctx=c.getContext('2d');cctx.drawImage(image,-roi.x,-roi.y);cctx.globalCompositeOperation='destination-in';cctx.drawImage(mask(paths,expand,blur),0,0);return c;}
 function projectedInk(){const path=new Path2D(),svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.style.cssText='position:absolute;width:0;height:0;overflow:hidden';document.body.append(svg);
  const sample=document.createElementNS(svg.namespaceURI,'path');svg.append(sample);
  function add(d,p,u,v,scale=1){for(const sub of d.match(/M[^M]+/g)||[]){sample.setAttribute('d',sub);const length=sample.getTotalLength(),N=Math.max(2,Math.ceil(length*3));for(let n=0;n<=N;n++){const q=sample.getPointAtLength(length*n/N),a=p.map(u+q.x*scale,v+q.y*scale);path[n?'lineTo':'moveTo'](a.x,a.y);}}}
  const glyphs=[['M2 5L2 14 M2 0L2 .4',0],['M1 14L1 5L1 8C2 3 8 3 8 8L8 14',7],['M4 1L4 11Q4 15 8 13 M1 6L8 6',20],['M2 5L2 14 M2 0L2 .4',36],['M0 7L8 7 M0 11L8 11',46],['M5 1C-1 0 -1 15 5 15S11 0 5 1',60],['M3 6L3 6.4 M3 12Q4 14 1 16',74]];
  for(const [d,x] of glyphs)add(d,left,start.u+x*size,start.v-28,size);
  add('M14 2C-2 -5 -2 23 14 18 M24 4L24 16 M18 10L30 10 M40 4L40 16 M34 10L46 10',right,35,17,.9);
  for(const [row,end]of [[46,115],[66,102],[86,94]])add('M0 0H8V8H0Z M16 2L'+end+' 2 M16 7L70 7',right,35,row,.9);
  svg.remove();return path;
 }
 function rigid(layer,from,to,angle){ctx.save();ctx.translate(to.x,to.y);ctx.rotate(angle);ctx.translate(-from.x,-from.y);ctx.drawImage(layer,roi.x,roi.y);ctx.restore();}
 // Two short bones bend at the elbow; the fur, wrist and paw share one continuous skin.
 const root={x:350,y:841},elbow={x:412,y:882};
 const upperLength=Math.hypot(elbow.x-root.x,elbow.y-root.y),lowerLength=Math.hypot(W0.x-elbow.x,W0.y-elbow.y);
 const angle=(a,b)=>Math.atan2(b.y-a.y,b.x-a.x);
 function moved(p,from,to,a){const c=Math.cos(a),s=Math.sin(a),x=p.x-from.x,y=p.y-from.y;return{x:to.x+c*x-s*y,y:to.y+s*x+c*y};}
 const mix=(a,b,t)=>({x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t});
 function drawLimb(j){
  const dx=j.W.x-root.x,dy=j.W.y-root.y,d=Math.min(upperLength+lowerLength-.001,Math.hypot(dx,dy));
  const theta=Math.atan2(dy,dx),bend=Math.acos(Math.max(-1,Math.min(1,(upperLength**2+d*d-lowerLength**2)/(2*upperLength*d))));
  const e={x:root.x+upperLength*Math.cos(theta+bend),y:root.y+upperLength*Math.sin(theta+bend)};
  const ua=angle(root,e)-angle(root,elbow),la=angle(e,j.W)-angle(elbow,W0);
  const map=p=>{const u=moved(p,root,root,ua),l=moved(p,elbow,e,la),h=moved(p,W0,j.W,j.b);const skin=mix(mix(u,l,smooth((p.x-398)/28)),h,smooth((p.x-466)/22));return mix(p,skin,Math.max(smooth((p.x-445)/43),smooth((p.x-350)/55)*smooth((p.y-827)/28)));};
  function triangle(a,b,c,A,B,C){
   const det=(b.x-a.x)*(c.y-a.y)-(c.x-a.x)*(b.y-a.y);
   const xx=((B.x-A.x)*(c.y-a.y)-(C.x-A.x)*(b.y-a.y))/det,xy=((C.x-A.x)*(b.x-a.x)-(B.x-A.x)*(c.x-a.x))/det;
   const yx=((B.y-A.y)*(c.y-a.y)-(C.y-A.y)*(b.y-a.y))/det,yy=((C.y-A.y)*(b.x-a.x)-(B.y-A.y)*(c.x-a.x))/det;
   // Expand each clip edge by one source pixel so canvas clip antialiasing cannot expose a grid.
   const tri=[A,B,C],sign=Math.sign((B.x-A.x)*(C.y-A.y)-(B.y-A.y)*(C.x-A.x));
   const normals=tri.map((p,i)=>{const q=tri[(i+1)%3],dx=q.x-p.x,dy=q.y-p.y,len=Math.hypot(dx,dy);return{x:sign*dy/len,y:-sign*dx/len};});
   ctx.save();ctx.beginPath();
   for(const [i,p]of tri.entries()){const n=normals[(i+2)%3],m=normals[i],scale=1/(1+n.x*m.x+n.y*m.y);ctx[i?'lineTo':'moveTo'](p.x+(n.x+m.x)*scale,p.y+(n.y+m.y)*scale);}ctx.closePath();ctx.clip();
   ctx.transform(xx,yx,xy,yy,A.x-xx*a.x-xy*a.y,A.y-yx*a.x-yy*a.y);ctx.drawImage(limb,roi.x,roi.y);ctx.restore();
  }
  const xs=[315,335,350,365,380,395,407,419,433,445,457,466,472,478,484,488,510,540,590,655],ys=[770,815,827,841,855,875,895,915,940,1010];
  for(let x=0;x<xs.length-1;x++)for(let y=0;y<ys.length-1;y++){
   const a={x:xs[x],y:ys[y]},b={x:xs[x+1],y:ys[y]},c={x:xs[x],y:ys[y+1]},d={x:xs[x+1],y:ys[y+1]};
   const A=map(a),B=map(b),C=map(c),D=map(d);triangle(a,b,c,A,B,C);triangle(b,d,c,B,D,C);
  }
 }
 function draw(t){if(!loaded)return;t=Math.max(0,Math.min(duration,t));const state=pen(t),j=joints(state);
  ctx.clearRect(0,0,width,height);ctx.save();ctx.scale(width/sw,height/sh);ctx.drawImage(background,0,0);
  ctx.strokeStyle='#896444';ctx.lineWidth=2;ctx.lineCap='round';ctx.lineJoin='round';ctx.stroke(staticInk);
  for(const s of strokes){if(t<=s.start)break;const p=smooth((t-s.start)/(s.end-s.start));ctx.beginPath();for(let n=0;n<=24;n++){const q=inkPoint(s,p*n/24);ctx[n?'lineTo':'moveTo'](q.x,q.y);}ctx.stroke();}
  // A restrained contact shadow anchors the supported paw to the page.
  ctx.save();ctx.beginPath();for(let n=0;n<left.q.length;n++){const p=left.q[n];ctx[n?'lineTo':'moveTo'](p.x,p.y);}ctx.closePath();ctx.clip();
  const contactAngle=j.contactAngle;
  const foot={x:j.W.x+Math.cos(contactAngle)*39-Math.sin(contactAngle)*35,y:j.W.y+Math.sin(contactAngle)*39+Math.cos(contactAngle)*35};
  ctx.filter='blur(3px)';ctx.fillStyle='rgba(100,58,26,.13)';ctx.beginPath();ctx.ellipse(foot.x,foot.y,29,4,-.06,0,Math.PI*2);ctx.fill();ctx.restore();
  drawLimb(j);ctx.restore();
 }
 const decode=im=>new Promise((resolve,reject)=>{im.onload=resolve;im.onerror=()=>reject(Error('Writing scene layer failed to load'));});
 const ready=Promise.all([decode(image),decode(clean)]).then(()=>{
  background=surface();const b=background.getContext('2d');b.drawImage(image,0,0);
  const patch=surface(roi.width,roi.height),p=patch.getContext('2d');p.drawImage(clean,0,0,340,240);p.globalCompositeOperation='destination-in';p.drawImage(mask([pawShape,thumbShape,penTop,penTip,penShadow,cheekRepair,forearmErase],16,8),0,0);
  const edgeFade=p.createLinearGradient(600-roi.x,0,620-roi.x,0);
  edgeFade.addColorStop(0,'rgba(255,255,255,1)');edgeFade.addColorStop(1,'rgba(255,255,255,0)');
  p.fillStyle=edgeFade;p.fillRect(0,0,roi.width,roi.height);
  const rootFade=p.createLinearGradient(380-roi.x,0,420-roi.x,0);
  rootFade.addColorStop(0,'rgba(255,255,255,0)');rootFade.addColorStop(1,'rgba(255,255,255,1)');
  p.fillStyle=rootFade;p.fillRect(0,0,roi.width,roi.height);
  b.drawImage(patch,roi.x,roi.y);
  arm=cutout([forearmShape],0,5);hand=cutout([pawShape,penTop,penTip],1,.6);
  limb=cutout([forearmShape,pawShape],1,1.5);const skin=limb.getContext('2d');skin.globalCompositeOperation='source-over';skin.drawImage(cutout([penTop],.4,.35),0,0);
  staticInk=projectedInk();loaded=true;
 });
 image.src=assetBase+'scene-v38-current.png';clean.src=assetBase+'clean-patch-v42.png';
 return{draw,ready,duration,get loaded(){return loaded;},get layers(){return{background,arm,hand};}};
};
