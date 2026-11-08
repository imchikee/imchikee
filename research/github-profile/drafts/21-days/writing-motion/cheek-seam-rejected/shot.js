'use strict';
window.createWritingShot=function(canvas,assetBase){
 const width=534,height=485,duration=3.2,sourceWidth=1316,sourceHeight=1195;
 canvas.width=width;canvas.height=height;
 const ctx=canvas.getContext('2d'),image=new Image(),codeImage=new Image();let loaded=false,pixels,frame,foregroundMask,background;
 const roi={x:270,y:700,width:440,height:266},patch=document.createElement('canvas');
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
 function rootWeight(x){const p=Math.max(0,Math.min(1,(x-300)/145));return{a:p*p*(3-2*p),derivative:p>0&&p<1?6*p*(1-p)/145:0};}
 function renderMotion(t){
  const {tip,lift}=pose(t),dx=tip.x-566,dy=tip.y-lift-894;
  const out=frame.data,src=pixels.data,w=roi.width;out.set(background);
  // Invert a monotonic forearm deformation. The paw and pencil stay rigid;
  // only the orange fur between the stationary root and wrist compresses.
  for(let x=0;x<w;x++){
   const px=x+roi.x;let sx=px;
   for(let n=0;n<5;n++){const q=rootWeight(sx);sx-=(sx+q.a*dx-px)/(1+q.derivative*dx);}
   const amount=rootWeight(sx).a,ix=Math.floor(sx-roi.x),fx=sx-roi.x-ix;
   if(ix<0||ix>=w-1)continue;
   for(let y=0;y<roi.height;y++){
    const sy=y-amount*dy,iy=Math.floor(sy),fy=sy-iy;if(iy<0||iy>=roi.height-1)continue;
    const corners=[iy*w+ix,iy*w+ix+1,(iy+1)*w+ix,(iy+1)*w+ix+1],factors=[(1-fx)*(1-fy),fx*(1-fy),(1-fx)*fy,fx*fy];
    let alpha=0,r=0,g=0,b=0;
    for(let n=0;n<4;n++){const k=corners[n],a=foregroundMask[k]*factors[n],j=k*4;alpha+=a;r+=src[j]*a;g+=src[j+1]*a;b+=src[j+2]*a;}
    if(alpha<.0001)continue;const j=(y*w+x)*4;
    out[j]=out[j]*(1-alpha)+r;out[j+1]=out[j+1]*(1-alpha)+g;out[j+2]=out[j+2]*(1-alpha)+b;
   }
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
   const clean=atob(window.writingCleanRGBA);
   const pawPath=new Path2D('M447 813 C458 803 483 803 504 809 C524 808 544 821 546 831 C554 838 554 846 547 851 C548 861 541 868 530 870 C526 881 511 887 496 886 C480 891 455 879 447 871 C441 857 438 835 447 813 Z M465 752 C456 740 466 733 476 736 C482 735 487 741 490 748 L567 894 L553 885 Z');
   const armPath=new Path2D('M286 812 C330 796 385 789 424 797 C444 800 453 807 462 809 L460 866 C449 884 412 902 384 902 C354 907 319 899 291 887 Z');
   function mask(path,expand,blur){const c=document.createElement('canvas');c.width=roi.width;c.height=roi.height;const m=c.getContext('2d');m.translate(-roi.x,-roi.y);m.filter='blur('+blur+'px)';m.fillStyle='white';m.strokeStyle='white';m.lineJoin='round';m.fill(path);if(expand){m.lineWidth=expand;m.stroke(path);}return m.getImageData(0,0,roi.width,roi.height).data;}
   const paw=mask(pawPath,2,.6),arm=mask(armPath,0,8),pawBg=mask(pawPath,18,5),armBg=mask(armPath,10,10);
   foregroundMask=new Float32Array(roi.width*roi.height);background=new Uint8ClampedArray(raw.length);
   for(let n=0;n<foregroundMask.length;n++){const j=n*4,a=Math.max(pawBg[j+3],armBg[j+3])/255;foregroundMask[n]=Math.max(paw[j+3],arm[j+3])/255;for(let c=0;c<3;c++)background[j+c]=pixels.data[j+c]*(1-a)+clean.charCodeAt(j+c)*a;background[j+3]=255;}
   loaded=true;
 });
 image.src=assetBase+'scene-v16-writing-line.png';
 codeImage.src=assetBase+'notebook-declaration.svg';
 return{draw,ready,duration,get loaded(){return loaded;}};
};
