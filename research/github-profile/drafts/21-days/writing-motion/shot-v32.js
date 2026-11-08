'use strict';
window.createWritingShot=function(canvas,assetBase){
 const width=534,height=485,duration=3.2,sw=1316,sh=1195;
 canvas.width=width;canvas.height=height;const ctx=canvas.getContext('2d');
 const image=new Image(),clean=new Image(),roi={x:395,y:770,width:260,height:240};
 let loaded=false,background,arm,hand,staticInk;
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
 const origin={x:586,y:933},E0={x:457,y:900},W0={x:487,y:889},size=.9;
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
   if(t<=s.end)return{tip:inkPoint(s,smooth((t-s.start)/(s.end-s.start))),lift:0};
   previous=inkPoint(s,1);end=s.end;
  }
  return{tip:previous,lift:5*smooth((t-end)/.33)};
 }
 const L1=Math.hypot(W0.x-E0.x,W0.y-E0.y),L2=Math.hypot(origin.x-W0.x,origin.y-W0.y);
 const a0=Math.atan2(W0.y-E0.y,W0.x-E0.x),b0=Math.atan2(origin.y-W0.y,origin.x-W0.x);
 function joints(state){const {tip,lift}=state,T={x:tip.x,y:tip.y};
  // The tucked elbow glides a few pixels on the desk; the short wrist bends.
  // Both source pieces remain rigid instead of compressing the painted fur.
  const E={x:E0.x+.45*(tip.x-origin.x),y:E0.y+.2*(tip.y-origin.y)};
  const dx=T.x-E.x,dy=T.y-E.y,d=Math.hypot(dx,dy);
  if(d>=L1+L2||d<=Math.abs(L1-L2))throw Error('Writing tip is outside the paw reach');
  const along=(L1*L1-L2*L2+d*d)/(2*d),high=Math.sqrt(Math.max(0,L1*L1-along*along));
  const W={x:E.x+along*dx/d+high*dy/d,y:E.y+along*dy/d-high*dx/d};
  return{E,W,a:Math.atan2(W.y-E.y,W.x-E.x)-a0,b:Math.atan2(T.y-W.y,T.x-W.x)-b0-lift/Math.max(60,T.x-W.x)};
 }
 function surface(w=sw,h=sh){const c=document.createElement('canvas');c.width=w;c.height=h;return c;}
 const pawShape='M482 875 C489 857 507 853 523 857 C548 857 565 870 566 886 C573 895 565 904 559 904 C560 915 551 921 540 920 C529 931 508 926 494 918 C478 915 472 901 475 889 C475 882 478 877 482 875 Z';
 const thumbShape='M557 857 C567 850 578 862 577 872 Q580 880 571 886 L561 871 Z';
 const penTop='M521 811 C515 799 531 790 543 801 L571 875 L588 934 L581 931 L558 903 L529 833 Z';
 const penTip='M562 897 L579 917 L588 934 L582 932 L569 917 L556 902 Z';
 const armShape='M445 865 C463 857 477 858 491 866 L489 902 C474 912 457 909 445 901 Z';
 const forearmBase='M338 854 C371 835 416 839 458 853 L470 873 L468 894 C451 906 405 895 372 891 C349 887 337 875 338 854 Z';
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
 function draw(t){if(!loaded)return;t=Math.max(0,Math.min(duration,t));const state=pen(t),j=joints(state);
  ctx.clearRect(0,0,width,height);ctx.save();ctx.scale(width/sw,height/sh);ctx.drawImage(background,0,0);
  ctx.strokeStyle='#896444';ctx.lineWidth=2;ctx.lineCap='round';ctx.lineJoin='round';ctx.stroke(staticInk);
  for(const s of strokes){if(t<=s.start)break;const p=smooth((t-s.start)/(s.end-s.start));ctx.beginPath();for(let n=0;n<=24;n++){const q=inkPoint(s,p*n/24);ctx[n?'lineTo':'moveTo'](q.x,q.y);}ctx.stroke();}
  // A restrained contact shadow anchors the supported paw to the page.
  ctx.save();ctx.beginPath();for(let n=0;n<left.q.length;n++){const p=left.q[n];ctx[n?'lineTo':'moveTo'](p.x,p.y);}ctx.closePath();ctx.clip();
  const contactAngle=j.b+state.lift/Math.max(60,Math.hypot(origin.x-W0.x,origin.y-W0.y));
  const foot={x:j.W.x+Math.cos(contactAngle)*39-Math.sin(contactAngle)*35,y:j.W.y+Math.sin(contactAngle)*39+Math.cos(contactAngle)*35};
  ctx.filter='blur(3px)';ctx.fillStyle='rgba(100,58,26,.13)';ctx.beginPath();ctx.ellipse(foot.x,foot.y,29,4,-.06,0,Math.PI*2);ctx.fill();ctx.restore();
  rigid(arm,E0,j.E,j.a);rigid(hand,W0,j.W,j.b);ctx.restore();
 }
 const decode=im=>new Promise((resolve,reject)=>{im.onload=resolve;im.onerror=()=>reject(Error('Writing scene layer failed to load'));});
 const ready=Promise.all([decode(image),decode(clean)]).then(()=>{
  background=surface();const b=background.getContext('2d');b.drawImage(image,0,0);
  const patch=surface(roi.width,roi.height),p=patch.getContext('2d');p.drawImage(clean,0,0,roi.width,roi.height);p.globalCompositeOperation='destination-in';p.drawImage(mask([pawShape,thumbShape,penTop,penTip],16,5),0,0);
  b.drawImage(patch,roi.x,roi.y);
  b.drawImage(cutout([forearmBase],0,1.5),roi.x,roi.y);
  arm=cutout([armShape],0,3);hand=cutout([pawShape,thumbShape,penTop,penTip],2,.6);staticInk=projectedInk();loaded=true;
 });
 image.src=assetBase+'scene-v32-current.png';clean.src=assetBase+'clean-patch-v26.png';
 return{draw,ready,duration,get loaded(){return loaded;},get layers(){return{background,arm,hand};}};
};
