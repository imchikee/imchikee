'use strict';
window.createWritingShot=function(canvas,assetBase){
 const width=534,height=485,duration=3.2,sourceWidth=1316,sourceHeight=1195;
 canvas.width=width;canvas.height=height;
 const ctx=canvas.getContext('2d'),image=new Image(),codeImage=new Image();let loaded=false,pixels,frame,weights,active;
 const roi={x:330,y:700,width:380,height:266},patch=document.createElement('canvas');
 patch.width=roi.width;patch.height=roi.height;const pc=patch.getContext('2d');
 const smooth=x=>{x=Math.max(0,Math.min(1,x));return x*x*(3-2*x);};
 // Author coordinates for all eight pen strokes in ++i;.
 const strokes=[
  {start:.30,end:.50,points:[[0,5],[8,5]]},
  {start:.58,end:.78,points:[[4,1],[4,9]]},
  {start:.91,end:1.11,points:[[12,5],[20,5]]},
  {start:1.19,end:1.39,points:[[16,1],[16,9]]},
  {start:1.52,end:1.78,points:[[26,3],[26,11]]},
  {start:1.90,end:1.97,points:[[26,0],[26,.25]]},
  {start:2.10,end:2.17,points:[[34,3],[34,3.25]]},
  {start:2.30,end:2.62,points:[[34,10],[35,12],[32,14]]}
 ];
 function inkPoint(stroke,p){
  const a=stroke.points,q=1-p;
  const u=a.length===2?a[0][0]*q+a[1][0]*p:q*q*a[0][0]+2*q*p*a[1][0]+p*p*a[2][0];
  const v=a.length===2?a[0][1]*q+a[1][1]*p:q*q*a[0][1]+2*q*p*a[1][1]+p*p*a[2][1];
  return{x:566-u*1.25,y:894-v*1.25};
 }
 function pose(t){
  let previous={x:566,y:894},end=0;
  for(const stroke of strokes){
   if(t<stroke.start){const p=smooth((t-end)/(stroke.start-end)),next=inkPoint(stroke,0);return{tip:{x:previous.x+(next.x-previous.x)*p,y:previous.y+(next.y-previous.y)*p},lift:4*Math.sin(p*Math.PI),angle:0};}
   if(t<=stroke.end)return{tip:inkPoint(stroke,smooth((t-stroke.start)/(stroke.end-stroke.start))),lift:0,angle:0};
   previous=inkPoint(stroke,1);end=stroke.end;
  }
  return{tip:previous,lift:5*smooth((t-end)/.33),angle:0};
 }
 function segmentDistance(x,y,ax,ay,bx,by){const dx=bx-ax,dy=by-ay,p=Math.max(0,Math.min(1,((x-ax)*dx+(y-ay)*dy)/(dx*dx+dy*dy)));return Math.hypot(x-ax-p*dx,y-ay-p*dy);}
 function renderMotion(t){
  const {tip,lift,angle}=pose(t),dx=tip.x-566,dy=tip.y-lift-894,c=Math.cos(angle),s=Math.sin(angle);
  const data=frame.data,src=pixels.data,w=roi.width;data.set(src);
  // Inverse sample one continuous original. No cut-out paw edge, replacement
  // wrist, generated paper patch or foreground mesh is composited into it.
  for(const n of active){
   const x=n%w,y=Math.floor(n/w),px=x+roi.x,py=y+roi.y,a=weights[n];
   const vx=px-566-dx,vy=py-894-dy;
   const sx=x+a*(566+c*vx+s*vy-px),sy=y+a*(894-s*vx+c*vy-py);
   const ix=Math.floor(sx),iy=Math.floor(sy),fx=sx-ix,fy=sy-iy;
   const k=(iy*w+ix)*4,k2=k+w*4,out=n*4;
   for(let channel=0;channel<3;channel++)data[out+channel]=(src[k+channel]*(1-fx)+src[k+4+channel]*fx)*(1-fy)+(src[k2+channel]*(1-fx)+src[k2+4+channel]*fx)*fy;
  }
  pc.putImageData(frame,0,0);
 }
 function draw(t){if(!loaded)return;t=Math.max(0,Math.min(duration,t));renderMotion(t);
  ctx.clearRect(0,0,width,height);ctx.drawImage(image,0,0,width,height);
  ctx.save();ctx.scale(width/sourceWidth,height/sourceHeight);ctx.drawImage(patch,roi.x,roi.y);
  ctx.drawImage(codeImage,0,0);
  // Each contact stroke appears at the nib; pen-up travel leaves no connecting line.
  ctx.strokeStyle='#896444';ctx.lineWidth=2.7;ctx.lineCap='round';ctx.lineJoin='round';
  for(const stroke of strokes){
   if(t<=stroke.start)break;
   const p=smooth((t-stroke.start)/(stroke.end-stroke.start));
   ctx.beginPath();for(let n=0;n<=24;n++){const a=inkPoint(stroke,p*n/24);ctx[n?'lineTo':'moveTo'](a.x,a.y);}ctx.stroke();
  }
  ctx.restore();
 }
 const imageReady=new Promise((resolve,reject)=>{image.onerror=()=>reject(Error('Writing scene failed to load'));image.onload=resolve;});
 const codeReady=new Promise((resolve,reject)=>{codeImage.onerror=()=>reject(Error('Notebook ink failed to load'));codeImage.onload=resolve;});
 const regionReady=new Promise((resolve,reject)=>{
  const script=document.createElement('script');script.src=assetBase+'region-data.js';script.onload=resolve;script.onerror=()=>reject(Error('Writing source samples failed to load'));document.head.appendChild(script);
 });
 const ready=Promise.all([imageReady,codeReady,regionReady]).then(()=>{
   // Embedded original samples also work when this preview is opened as file://;
   // reading image pixels from a local-file canvas would be origin-restricted.
   const raw=atob(window.writingRegionRGBA);pixels=pc.createImageData(roi.width,roi.height);for(let i=0;i<raw.length;i++)pixels.data[i]=raw.charCodeAt(i);frame=pc.createImageData(roi.width,roi.height);
   weights=new Float32Array(roi.width*roi.height);active=[];
   for(let y=0;y<roi.height;y++)for(let x=0;x<roi.width;x++){
    const px=x+roi.x,py=y+roi.y;
    // Pencil and paw share a rigid transform. The fur behind the wrist
    // absorbs the small movement; the body's outer silhouette stays fixed.
    const pencil=segmentDistance(px,py,477,748,566,894),paw=Math.hypot((px-501)/58,(py-834)/60);
    const pen=1-smooth((pencil-58)/50);
    const fur=(1-smooth((paw-1)/.5))*(1-smooth((py-860)/50));
    let a=Math.max(pen,fur);
    a*=smooth((px-340)/90);
    // A broad falloff beneath the wrist avoids folding its fur/paper boundary.
    // The small, blank tip corridor is separate from the fixed code rows.
    a*=1-smooth((py-895)/14);
    a*=smooth((py-700)/14);
    a*=smooth(x/8)*smooth((roi.width-1-x)/8)*smooth(y/8)*smooth((roi.height-1-y)/8);
    const n=y*roi.width+x;if(a>.0001){weights[n]=a;active.push(n);}
   }
   loaded=true;
 });
 image.src=assetBase+'scene-v16-writing-line.png';
 codeImage.src=assetBase+'notebook-declaration.svg';
 return{draw,ready,duration,get loaded(){return loaded;}};
};
