'use strict';
window.createWritingShot=function(canvas,assetBase){
 const width=534,height=485,duration=3.2,sw=1316,sh=1195;
 canvas.width=width;canvas.height=height;const ctx=canvas.getContext('2d');
 const image=new Image(),clean=new Image(),roi={x:315,y:770,width:340,height:240};
 let loaded=false,background,arm,hand,upperArm,distalArm,elbowJoint,shoulderCover,staticInk;
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
 // Split the writing motion between bending the elbow and rotating the wrist.
 function joints(state){
  const target={x:state.tip.x,y:state.tip.y-state.lift},dx=target.x-shoulder.x,dy=target.y-shoulder.y,d=Math.hypot(dx,dy);
  const theta=Math.atan2(dy,dx),reach=Math.hypot(origin.x-elbow0.x,origin.y-elbow0.y);
  const bend=Math.acos(Math.max(-1,Math.min(1,(upperLength**2+d*d-reach*reach)/(2*upperLength*d))));
  const E={x:shoulder.x+upperLength*Math.cos(theta+bend),y:shoulder.y+upperLength*Math.sin(theta+bend)};
  const b=Math.atan2(target.y-E.y,target.x-E.x)-Math.atan2(origin.y-elbow0.y,origin.x-elbow0.x),c=Math.cos(b),s=Math.sin(b);
  const dxW=W0.x-elbow0.x,dyW=W0.y-elbow0.y;
  return{E,W:{x:E.x+c*dxW-s*dyW,y:E.y+s*dxW+c*dyW},b,contactAngle:b};
 }
 function surface(w=sw,h=sh){const c=document.createElement('canvas');c.width=w;c.height=h;return c;}
 const pawShape='M482 875 C489 857 507 853 523 857 C548 857 565 870 566 886 C573 895 565 904 559 904 C560 915 551 921 540 920 C529 931 508 926 494 918 C478 915 472 901 475 889 C475 882 478 877 482 875 Z';
 const thumbShape='M557 857 C567 850 578 862 577 872 Q580 880 571 886 L561 871 Z';
 const penTop='M522 813 C517 805 520 800 529 798 C536 796 540 801 542 808 L569 878 L580 912 L588 934 L581 930 L569 912 L558 882 L531 822 Z';
 const penShadow='M517 791 C535 784 552 802 560 817 L590 876 L559 881 L527 828 Z';
 const penTip='M562 897 L579 917 L588 934 L582 932 L569 917 L556 902 Z';
 const cheekRepair='M502 796 Q528 780 550 798 Q576 814 608 815 L614 857 Q600 878 558 878 Q524 861 510 832 Z';
 const forearmErase='M309 838 C350 820 412 824 466 843 L507 873 L503 925 C458 932 380 916 318 899 Z';
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
 // Keep both arm segments at their original lengths; only their joint angles change.
 const shoulder={x:400,y:850},elbow0={x:412,y:882};
 const upperLength=Math.hypot(elbow0.x-shoulder.x,elbow0.y-shoulder.y);
 const angle=(a,b)=>Math.atan2(b.y-a.y,b.x-a.x);
 function drawLimb(j){
  const upperAngle=angle(shoulder,j.E)-angle(shoulder,elbow0);
  // The proximal upper limb is tucked behind the torso; only the elbow overlap is exposed.
  rigid(elbowJoint,elbow0,j.E,(upperAngle+j.b)/2);
  rigid(distalArm,elbow0,j.E,j.b);
  // The clean torso now supplies the join; restoring the old shoulder crop would restore its arm remnant.
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
  const rootFade=p.createLinearGradient(315-roi.x,0,340-roi.x,0);
  rootFade.addColorStop(0,'rgba(255,255,255,0)');rootFade.addColorStop(1,'rgba(255,255,255,1)');
  p.fillStyle=rootFade;p.fillRect(0,0,roi.width,roi.height);
  b.drawImage(patch,roi.x,roi.y);
  const upperShape='M378 838 Q399 825 417 841 Q428 856 434 877 Q436 899 417 905 Q395 907 385 889 Q375 862 378 838 Z';
  const lowerShape='M398 852 Q438 839 476 860 L486 878 L475 904 Q437 911 401 897 Z';
  const cuffShape='M500 887 A22 21 0 1 1 456 887 A22 21 0 1 1 500 887 Z';
  upperArm=cutout([upperShape],0,3);
  elbowJoint=cutout(['M432 882 A20 20 0 1 1 392 882 A20 20 0 1 1 432 882 Z'],0,3);
  hand=cutout([cuffShape],0,3);const h=hand.getContext('2d');h.globalCompositeOperation='source-over';h.drawImage(cutout([pawShape],1,.6),0,0);h.drawImage(cutout([penTop],.4,.35),0,0);
  distalArm=cutout([lowerShape],0,3);const d=distalArm.getContext('2d');d.globalCompositeOperation='source-over';d.drawImage(hand,0,0);
  shoulderCover=cutout(['M315 790 H365 V815 Q355 830 355 850 V875 H315 Z'],0,3);
  arm=upperArm;
  staticInk=projectedInk();loaded=true;
 });
 image.src=assetBase+'scene-v38-current.png';clean.src=assetBase+'clean-patch-v47.png';
 return{draw,ready,duration,get loaded(){return loaded;},get layers(){return{background,arm,hand};}};
};
