'use strict';
window.createWritingShot=function(canvas,assetBase){
 const width=534,height=485,duration=3.2,sourceWidth=1316,sourceHeight=1195;
 canvas.width=width;canvas.height=height;
 const ctx=canvas.getContext('2d'),image=new Image(),codeImage=new Image();let loaded=false,pixels,frame,foregroundMask,background;
 const roi={x:300,y:630,width:800,height:330},patch=document.createElement('canvas');
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
  return{x:668-u,y:859-v};
 }
 function pose(t){
  let previous={x:668,y:859},end=0;
  for(const stroke of strokes){
   if(t<stroke.start){const p=smooth((t-end)/(stroke.start-end)),next=inkPoint(stroke,0);return{tip:{x:previous.x+(next.x-previous.x)*p,y:previous.y+(next.y-previous.y)*p},lift:4*Math.sin(p*Math.PI),angle:0};}
   if(t<=stroke.end)return{tip:inkPoint(stroke,smooth((t-stroke.start)/(stroke.end-stroke.start))),lift:0,angle:0};
   previous=inkPoint(stroke,1);end=stroke.end;
  }
  return{tip:previous,lift:5*smooth((t-end)/.33),angle:0};
 }
 function rootWeight(x){const p=Math.max(0,Math.min(1,(x-440)/70));return{a:p*p*(3-2*p),derivative:p>0&&p<1?6*p*(1-p)/70:0};}
 function renderMotion(t){
  const {tip,lift}=pose(t),dx=tip.x-627,dy=tip.y-lift-859;
  const out=frame.data,src=pixels.data,w=roi.width;out.set(background);
  // Invert a monotonic forearm deformation. The paw and pencil stay rigid;
  // only the orange fur between the stationary root and wrist compresses.
  for(let x=0;x<430;x++){
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
  ctx.strokeStyle='#896444';ctx.lineWidth=2.5;ctx.lineCap='round';ctx.lineJoin='round';
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
  const script=document.createElement('script');script.src=assetBase+'region-data.js?revision=22';script.onload=resolve;script.onerror=()=>reject(Error('Writing source samples failed to load'));document.head.appendChild(script);
 });
 const ready=Promise.all([imageReady,codeReady,regionReady]).then(()=>{
   // Embedded original samples also work when this preview is opened as file://;
   // reading image pixels from a local-file canvas would be origin-restricted.
   const raw=atob(window.writingRegionRGBA);pixels=pc.createImageData(roi.width,roi.height);for(let i=0;i<raw.length;i++)pixels.data[i]=raw.charCodeAt(i);frame=pc.createImageData(roi.width,roi.height);
   const clean=atob(window.writingCleanRGBA);
   const pawPath=new Path2D('M491 774 C492 755 519 748 545 749 C573 747 596 758 604 780 C611 793 602 803 596 807 C604 819 591 831 579 833 C557 843 530 838 510 829 C491 820 481 799 491 774 Z M510 705 Q517 692 530 699 L568 750 L545 756 Z M594 803 L618 837 L628 860 L610 850 L581 828 Z');
   const cuffPath=new Path2D('M469 773 C481 760 491 760 503 766 L514 822 C503 834 484 831 471 822 Z');
   const oldPaw=new Path2D('M392 760 C410 730 470 728 508 750 C530 764 540 786 525 807 C532 828 508 840 480 832 C456 820 430 827 410 818 C389 806 384 780 392 760 Z');
   const oldPencil=new Path2D('M402 666 C408 650 429 646 444 662 L494 736 L475 756 Z M517 785 L556 835 L563 848 L544 847 L518 826 Z');
   // Only page INTERIORS are cleaned; the original cheek/page boundaries stay.
   const pages=new Path2D('M581 810 L650 795 L715 795 L736 802 L850 869 L663 900 L640 876 L627 847 Z M780 810 L930 808 L1048 841 L885 866 Z');
   function mask(path,expand,blur){const c=document.createElement('canvas');c.width=roi.width;c.height=roi.height;const m=c.getContext('2d');m.translate(-roi.x,-roi.y);m.filter='blur('+blur+'px)';m.fillStyle='white';m.strokeStyle='white';m.lineJoin='round';m.fill(path);if(expand){m.lineWidth=expand;m.stroke(path);}return m.getImageData(0,0,roi.width,roi.height).data;}
   const paw=mask(pawPath,2,.55),cuff=mask(cuffPath,0,4),erasePaw=mask(oldPaw,10,3),erasePencil=mask(oldPencil,12,2),paper=mask(pages,0,1.8);
   const cleanup=mask(new Path2D('M405 635 C385 635 375 655 375 675 L375 795 Q375 835 415 835 L520 835 Q560 835 560 795 L560 675 Q560 635 520 635 Z'),0,15);
   const base=atob(window.writingBaseRGBA),paperPixels=atob(window.writingPaperRGBA);
   foregroundMask=new Float32Array(roi.width*roi.height);background=new Uint8ClampedArray(raw.length);
   for(let n=0;n<foregroundMask.length;n++){
    const j=n*4;foregroundMask[n]=Math.max(paw[j+3],cuff[j+3])/255;
    const x=n%roi.width+roi.x,y=Math.floor(n/roi.width)+roi.y;
    const protectPaw=(x>=805&&x<=935&&y<824)||(x>=770&&x<805&&y<821);
    const erase=Math.max(erasePaw[j+3],erasePencil[j+3],cleanup[j+3]*smooth((y-645)/22)*smooth((840-y)/30))/255;
    const pageAlpha=(protectPaw?0:paper[j+3])/255;
    for(let c=0;c<3;c++){const old=base.charCodeAt(j+c)*(1-erase)+clean.charCodeAt(j+c)*erase;background[j+c]=old*(1-pageAlpha)+paperPixels.charCodeAt(j+c)*pageAlpha;}
    background[j+3]=255;
   }
   loaded=true;
 });
 image.src=assetBase+'scene-v1.png';
 codeImage.src=assetBase+'notebook-declaration-v22.svg';
 return{draw,ready,duration,get loaded(){return loaded;}};
};
