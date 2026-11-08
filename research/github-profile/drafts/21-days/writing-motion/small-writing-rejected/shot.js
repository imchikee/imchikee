'use strict';
window.createWritingShot=function(canvas,assetBase){
 const width=534,height=485,duration=3.2,sourceWidth=1316,sourceHeight=1195;
 canvas.width=width;canvas.height=height;
 const ctx=canvas.getContext('2d'),image=new Image(),codeImage=new Image();let loaded=false,pixels,frame,weights,active;
 const roi={x:390,y:700,width:270,height:266},patch=document.createElement('canvas');
 patch.width=roi.width;patch.height=roi.height;const pc=patch.getContext('2d');
 const smooth=x=>{x=Math.max(0,Math.min(1,x));return x*x*(3-2*x);};
 const curves=[[[0,0],[5,0],[4,3],[4,5]],[[4,5],[4,7],[6,8],[8,9]],[[8,9],[6,10],[4,11],[4,13]],[[4,13],[4,16],[5,18],[0,18]]];
 const progress=t=>smooth((t-.35)/1.55);
 function inkPoint(p){
  const n=Math.min(3,Math.floor(p*4)),q=Math.min(1,p*4-n),a=1-q,c=curves[n];
  const u=a*a*a*c[0][0]+3*a*a*q*c[1][0]+3*a*q*q*c[2][0]+q*q*q*c[3][0];
  const v=a*a*a*c[0][1]+3*a*a*q*c[1][1]+3*a*q*q*c[2][1]+q*q*q*c[3][1];
  return{x:566-u,y:894-v*2/3};
 }
 function pose(t){const p=progress(t),lift=smooth((t-2.05)/.35);return{tip:inkPoint(p),lift:3*lift,angle:.008*Math.sin(p*Math.PI*2)-.009*lift};}
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
  // The nib follows the very same curve that is revealed as fresh ink.
  const p=progress(t);ctx.strokeStyle='#896444';ctx.lineWidth=2.2;ctx.lineCap='round';ctx.lineJoin='round';
  if(p>0){ctx.beginPath();for(let n=0;n<=Math.floor(p*160);n++){const a=inkPoint(n/160);ctx[n?'lineTo':'moveTo'](a.x,a.y);}const end=inkPoint(p);ctx.lineTo(end.x,end.y);ctx.stroke();}
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
    const pen=1-smooth((pencil-22)/12);
    const fur=(1-smooth((paw-1)/.5))*(1-smooth((py-860)/50));
    let a=Math.max(pen,fur);
    a*=smooth((px-395)/48);
    // A broad falloff beneath the wrist avoids folding its fur/paper boundary.
    // The small, blank tip corridor is separate from the fixed code rows.
    a*=1-smooth((py-892)/10);
    a*=smooth((py-700)/14);
    a*=smooth(x/8)*smooth((roi.width-1-x)/8)*smooth(y/8)*smooth((roi.height-1-y)/8);
    const n=y*roi.width+x;if(a>.0001){weights[n]=a;active.push(n);}
   }
   loaded=true;
 });
 image.src=assetBase+'scene-v15-code-layout.png';
 codeImage.src=assetBase+'notebook-code.svg';
 return{draw,ready,duration,get loaded(){return loaded;}};
};
