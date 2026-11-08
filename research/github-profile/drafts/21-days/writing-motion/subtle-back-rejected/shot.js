'use strict';
window.createWritingShot=function(canvas,assetBase){
 const width=534,height=485,duration=3.2,sourceWidth=1316,sourceHeight=1195;
 canvas.width=width;canvas.height=height;
 const ctx=canvas.getContext('2d'),image=new Image();let loaded=false,pixels,frame,weights,active;
 const roi={x:480,y:718,width:230,height:224},patch=document.createElement('canvas');
 patch.width=roi.width;patch.height=roi.height;const pc=patch.getContext('2d');
 const smooth=x=>{x=Math.max(0,Math.min(1,x));return x*x*(3-2*x);};
 const strokes=[{start:.35,end:.88},{start:1.1,end:1.63},{start:1.85,end:2.38}];
 // Start on the central notebook's left margin and write a small word inward.
 const inkPoint=(i,p)=>({x:615+i*2.3+p*1.4,y:870-i*.3-p*.2+Math.sin(p*Math.PI*4)*1.1*Math.sin(p*Math.PI)});
 function pose(t){
  for(let i=0;i<strokes.length;i++){
   const {start,end}=strokes[i];
   if(t<start){
    if(i===0)return{tip:inkPoint(0,0),lift:0,angle:0};
    const q=(t-strokes[i-1].end)/(start-strokes[i-1].end),p=smooth(q),a=inkPoint(i-1,1),b=inkPoint(i,0);
    return{tip:{x:a.x+(b.x-a.x)*p,y:a.y+(b.y-a.y)*p},lift:4*Math.sin(q*Math.PI),angle:-.012*Math.sin(q*Math.PI)};
   }
   if(t<=end){const p=smooth((t-start)/(end-start));return{tip:inkPoint(i,p),lift:0,angle:.014*Math.sin(p*Math.PI*4)*Math.sin(p*Math.PI)};}
  }
  const p=smooth((t-2.43)/.3);return{tip:inkPoint(2,1),lift:4*p,angle:-.014*p};
 }
 function segmentDistance(x,y,ax,ay,bx,by){const dx=bx-ax,dy=by-ay,p=Math.max(0,Math.min(1,((x-ax)*dx+(y-ay)*dy)/(dx*dx+dy*dy)));return Math.hypot(x-ax-p*dx,y-ay-p*dy);}
 function renderMotion(t){
  const {tip,lift,angle}=pose(t),dx=tip.x-615,dy=tip.y-lift-870,c=Math.cos(angle),s=Math.sin(angle);
  const data=frame.data,src=pixels.data,w=roi.width;data.set(src);
  // Inverse sample one continuous original. No cut-out paw edge, replacement
  // wrist, generated paper patch or foreground mesh is composited into it.
  for(const n of active){
   const x=n%w,y=Math.floor(n/w),px=x+roi.x,py=y+roi.y,a=weights[n];
   const vx=px-615-dx,vy=py-870-dy;
   const sx=x+a*(615+c*vx+s*vy-px),sy=y+a*(870-s*vx+c*vy-py);
   const ix=Math.floor(sx),iy=Math.floor(sy),fx=sx-ix,fy=sy-iy;
   const k=(iy*w+ix)*4,k2=k+w*4,out=n*4;
   for(let channel=0;channel<3;channel++)data[out+channel]=(src[k+channel]*(1-fx)+src[k+4+channel]*fx)*(1-fy)+(src[k2+channel]*(1-fx)+src[k2+4+channel]*fx)*fy;
  }
  pc.putImageData(frame,0,0);
 }
 function draw(t){if(!loaded)return;t=Math.max(0,Math.min(duration,t));renderMotion(t);
  ctx.clearRect(0,0,width,height);ctx.drawImage(image,0,0,width,height);
  ctx.save();ctx.scale(width/sourceWidth,height/sourceHeight);ctx.drawImage(patch,roi.x,roi.y);
  ctx.strokeStyle='#785032';ctx.lineWidth=1.25;ctx.lineCap='round';
  for(let i=0;i<strokes.length;i++){
   const {start,end}=strokes[i],p=smooth((t-start)/(end-start));if(p<=0)continue;
   ctx.beginPath();for(let n=0;n<=Math.floor(p*40);n++){const a=inkPoint(i,n/40);ctx[n?'lineTo':'moveTo'](a.x,a.y);}const a=inkPoint(i,p);ctx.lineTo(a.x,a.y);ctx.stroke();
  }
  ctx.restore();
 }
 const imageReady=new Promise((resolve,reject)=>{image.onerror=()=>reject(Error('Writing scene failed to load'));image.onload=resolve;});
 const regionReady=new Promise((resolve,reject)=>{
  const script=document.createElement('script');script.src=assetBase+'region-data.js';script.onload=resolve;script.onerror=()=>reject(Error('Writing source samples failed to load'));document.head.appendChild(script);
 });
 const ready=Promise.all([imageReady,regionReady]).then(()=>{
   // Embedded original samples also work when this preview is opened as file://;
   // reading image pixels from a local-file canvas would be origin-restricted.
   const raw=atob(window.writingRegionRGBA);pixels=pc.createImageData(roi.width,roi.height);for(let i=0;i<raw.length;i++)pixels.data[i]=raw.charCodeAt(i);frame=pc.createImageData(roi.width,roi.height);
   weights=new Float32Array(roi.width*roi.height);active=[];
   for(let y=0;y<roi.height;y++)for(let x=0;x<roi.width;x++){
    const px=x+roi.x,py=y+roi.y;
    // Pencil and paw share a rigid transform. The fur behind the wrist
    // absorbs the small movement; the body's outer silhouette stays fixed.
    const pencil=segmentDistance(px,py,538,754,615,870),paw=Math.hypot((px-568)/40,(py-826)/31);
    let a=Math.max(1-smooth((pencil-24)/10),1-smooth((paw-1)/.5));
    a*=smooth((px-490)/45);
    // Pin paper outside a narrow pencil-tip region and the actual paw.
    if(py>848){const onPaw=(1-smooth((paw-1.02)/.12))*(1-smooth((py-852)/4)),onPen=1-smooth((pencil-24)/6);a*=Math.max(onPaw,onPen);}
    // Keep the notebook rows to the right and the foreground page edge below
    // the tip completely fixed. The pencil's full silhouette stays inside.
    if(py>848)a*=1-smooth((px-638)/6);
    a*=1-smooth((py-875)/4);
    a*=smooth((py-733)/6);
    a*=smooth(x/8)*smooth((roi.width-1-x)/8)*smooth(y/8)*smooth((roi.height-1-y)/8);
    const n=y*roi.width+x;if(a>.0001){weights[n]=a;active.push(n);}
   }
   loaded=true;
 });
 image.src=assetBase+'scene-v8-trimmed-back.png';
 return{draw,ready,duration,get loaded(){return loaded;}};
};
