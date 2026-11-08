
'use strict';
window.createWritingShot=function(canvas,assetBase){
 const width=534,height=485,duration=3.2;canvas.width=width;canvas.height=height;
 const ctx=canvas.getContext('2d'),image=new Image(),clean=new Image();let loaded=false,background,hand,armLayer;
 const shape=new Path2D();
 // One rigid silhouette for the gripped pencil and paw; no paper vertices.
 shape.moveTo(482,713);shape.quadraticCurveTo(481,700,495,701);shape.quadraticCurveTo(501,701,508,712);shape.lineTo(548,768);shape.lineTo(525,786);shape.closePath();
 shape.moveTo(483,785);shape.bezierCurveTo(490,766,521,758,544,768);shape.bezierCurveTo(565,772,573,788,565,800);shape.quadraticCurveTo(576,810,562,821);shape.quadraticCurveTo(573,835,551,845);shape.bezierCurveTo(528,852,498,842,482,830);shape.closePath();
 shape.moveTo(562,804);shape.lineTo(602,864);shape.lineTo(575,850);shape.lineTo(550,825);shape.closePath();
 const surface=()=>{const c=document.createElement('canvas');c.width=1316;c.height=1195;return c;};
 const smooth=x=>{x=Math.max(0,Math.min(1,x));return x*x*(3-2*x);};
 const strokes=[{start:.35,end:.88},{start:1.1,end:1.63},{start:1.85,end:2.38}];
 // The inset stays on the central notebook, beyond the diagonal book's edge.
 const inkPoint=(i,p)=>({x:624+i*9+p*7,y:857-i*.5-p*.4+Math.sin(p*Math.PI*6)*1.8*Math.sin(p*Math.PI)});
 function penState(t){
  for(let i=0;i<strokes.length;i++){
   const {start,end}=strokes[i];
   if(t<start){
    if(i===0)return{tip:inkPoint(0,0),lift:5*(1-smooth((t-.15)/.2)),angle:0};
    const q=(t-strokes[i-1].end)/(start-strokes[i-1].end),a=inkPoint(i-1,1),b=inkPoint(i,0),p=smooth(q);
    return{tip:{x:a.x+(b.x-a.x)*p,y:a.y+(b.y-a.y)*p},lift:10*Math.sin(q*Math.PI),angle:-.035*Math.sin(q*Math.PI)};
   }
   if(t<=end){const p=smooth((t-start)/(end-start));return{tip:inkPoint(i,p),lift:0,angle:.032*Math.sin(p*Math.PI*4)*Math.sin(p*Math.PI)};}
  }
  const p=smooth((t-2.43)/.3);return{tip:inkPoint(2,1),lift:11*p,angle:-.035*p};
 }
 function draw(t){if(!loaded)return;t=Math.max(0,Math.min(duration,t));const {tip,lift,angle}=penState(t);
 ctx.clearRect(0,0,width,height);ctx.drawImage(background,0,0,width,height);ctx.save();ctx.scale(width/1316,height/1195);
 // The paper and all its printed lines stay in the fixed background.
 ctx.strokeStyle='#785032';ctx.lineWidth=1.5;ctx.lineCap='round';
 for(let i=0;i<strokes.length;i++){
  const {start,end}=strokes[i],p=smooth((t-start)/(end-start));if(p<=0)continue;
  ctx.beginPath();for(let n=0;n<=Math.floor(p*48);n++){const a=inkPoint(i,n/48);ctx[n?'lineTo':'moveTo'](a.x,a.y);}const last=inkPoint(i,p);ctx.lineTo(last.x,last.y);ctx.stroke();
 }
 // Pen tip and last ink point share a contact; the pencil never stretches.
 const tx=tip.x,ty=tip.y-lift;
 // The newly bent forearm stays attached at its root; its wrist follows the grip.
 const wx=tx+Math.cos(angle)*(-102)-Math.sin(angle)*(-57)-498;
 const wy=ty+Math.sin(angle)*(-102)+Math.cos(angle)*(-57)-805;
 ctx.save();ctx.transform(1+wx/158,wy/158,0,1,-340*wx/158,-340*wy/158);ctx.drawImage(armLayer,0,0);ctx.restore();
 ctx.translate(tx,ty);ctx.rotate(angle);ctx.translate(-600,-862);ctx.drawImage(hand,0,0);ctx.restore();
 }
 const decode=im=>new Promise((resolve,reject)=>{im.onload=resolve;im.onerror=()=>reject(Error('Writing layer failed to load'));});
 const ready=Promise.all([decode(image),decode(clean)]).then(()=>{
  // One complete clean plate avoids a mismatched patch seam under the cheek.
  background=surface();background.getContext('2d').drawImage(clean,0,0,1316,1195);
  hand=surface();const h=hand.getContext('2d');
  // Include the orange forearm, with a soft root overlapping the fixed body.
  const arm=new Path2D();arm.moveTo(333,775);arm.bezierCurveTo(330,744,365,726,403,738);arm.bezierCurveTo(440,747,468,765,503,780);arm.lineTo(500,836);arm.bezierCurveTo(452,843,369,829,345,805);arm.closePath();
  armLayer=surface();const a=armLayer.getContext('2d');a.drawImage(image,0,0,1316,1195);
  const armMask=surface(),m=armMask.getContext('2d');m.filter='blur(5px)';m.fillStyle='#fff';m.fill(arm);a.globalCompositeOperation='destination-in';a.drawImage(armMask,0,0);
  h.save();h.clip(shape);h.drawImage(image,0,0,1316,1195);h.restore();loaded=true;
 });
 image.src=assetBase+'scene-v3-center.png';clean.src=assetBase+'clean-hand-v2-center.png';
 return{draw,ready,duration,get loaded(){return loaded;}};
};
