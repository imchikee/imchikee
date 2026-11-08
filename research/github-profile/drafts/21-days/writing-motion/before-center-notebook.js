
'use strict';
window.createWritingShot=function(canvas,assetBase){
 const width=534,height=485,duration=3.2;canvas.width=width;canvas.height=height;
 const ctx=canvas.getContext('2d'),image=new Image(),clean=new Image();let loaded=false,background,hand,armLayer;
 const shape=new Path2D();
 // One rigid silhouette for the gripped pencil and paw; no paper vertices.
 shape.moveTo(411,670);shape.quadraticCurveTo(420,656,433,662);shape.lineTo(484,736);shape.lineTo(462,749);shape.closePath();
 shape.moveTo(400,762);shape.bezierCurveTo(418,740,455,731,483,739);shape.bezierCurveTo(509,744,529,756,532,776);shape.quadraticCurveTo(535,789,520,798);shape.quadraticCurveTo(532,808,519,819);shape.quadraticCurveTo(515,832,489,825);shape.bezierCurveTo(465,817,447,815,428,820);shape.bezierCurveTo(409,814,400,797,400,762);shape.closePath();
 shape.moveTo(517,788);shape.lineTo(556,840);shape.quadraticCurveTo(559,847,549,842);shape.lineTo(517,824);shape.closePath();
 const surface=()=>{const c=document.createElement('canvas');c.width=1316;c.height=1195;return c;};
 const smooth=x=>{x=Math.max(0,Math.min(1,x));return x*x*(3-2*x);};
 const strokes=[{start:.35,end:.88},{start:1.1,end:1.63},{start:1.85,end:2.38}];
 const inkPoint=(i,p)=>({x:556+i*9+p*7,y:844+i*.6+p*.5+Math.sin(p*Math.PI*6)*1.8*Math.sin(p*Math.PI)});
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
 // Keep the forearm root at x=300 fixed; only its wrist end follows the paw.
 const wx=tx+Math.cos(angle)*(-126)-Math.sin(angle)*(-64)-430;
 const wy=ty+Math.sin(angle)*(-126)+Math.cos(angle)*(-64)-780;
 ctx.save();ctx.transform(1+wx/130,wy/130,0,1,-300*wx/130,-300*wy/130);ctx.drawImage(armLayer,0,0);ctx.restore();
 ctx.translate(tx,ty);ctx.rotate(angle);ctx.translate(-556,-844);ctx.drawImage(hand,0,0);ctx.restore();
 }
 const decode=im=>new Promise((resolve,reject)=>{im.onload=resolve;im.onerror=()=>reject(Error('Writing layer failed to load'));});
 const ready=Promise.all([decode(image),decode(clean)]).then(()=>{
  // One complete clean plate avoids a mismatched patch seam under the cheek.
  background=surface();background.getContext('2d').drawImage(clean,0,0,1316,1195);
  hand=surface();const h=hand.getContext('2d');
  // Include the orange forearm, with a soft root overlapping the fixed body.
  const arm=new Path2D();arm.moveTo(300,803);arm.bezierCurveTo(322,776,357,750,398,744);arm.lineTo(443,742);arm.lineTo(440,806);arm.quadraticCurveTo(383,819,306,813);arm.closePath();
  armLayer=surface();const a=armLayer.getContext('2d');a.drawImage(image,0,0,1316,1195);
  const armMask=surface(),m=armMask.getContext('2d');m.filter='blur(5px)';m.fillStyle='#fff';m.fill(arm);a.globalCompositeOperation='destination-in';a.drawImage(armMask,0,0);
  h.save();h.clip(shape);h.drawImage(image,0,0,1316,1195);h.restore();loaded=true;
 });
 image.src=assetBase+'scene-v2.png';clean.src=assetBase+'clean-hand-v1.png';
 return{draw,ready,duration,get loaded(){return loaded;}};
};
