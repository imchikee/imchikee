'use strict';
window.createWritingShot=function(canvas,assetBase){
 const width=534,height=485,duration=3.2;canvas.width=width;canvas.height=height;const ctx=canvas.getContext('2d'),image=new Image();let loaded=false;
 const fixed=[[0,0],[1316,0],[1316,1195],[0,1195],[350,630],[480,630],[530,710],[575,770],[600,860],[540,885],[350,855],[325,780],[335,700],[550,650],[600,730],[650,850],[370,805]];
 const moving=[[423,675],[477,775],[556,844],[451,791]];
 const points=[...fixed,...moving].map(p=>p.map((v,k)=>v*(k?height/1195:width/1316)));
function triangulate(input){
 const pts=[...input,[-2000,-1500],[2500,-1500],[250,3000]];let tris=[[input.length,input.length+1,input.length+2]];
 function inside(t,p){const [a,b,c]=t.map(i=>pts[i]);const d=2*(a[0]*(b[1]-c[1])+b[0]*(c[1]-a[1])+c[0]*(a[1]-b[1]));if(Math.abs(d)<1e-8)return false;const q=v=>v[0]*v[0]+v[1]*v[1];const x=(q(a)*(b[1]-c[1])+q(b)*(c[1]-a[1])+q(c)*(a[1]-b[1]))/d;const y=(q(a)*(c[0]-b[0])+q(b)*(a[0]-c[0])+q(c)*(b[0]-a[0]))/d;return (p[0]-x)**2+(p[1]-y)**2<=(a[0]-x)**2+(a[1]-y)**2+1e-6;}
 for(let i=0;i<input.length;i++){
  const bad=tris.filter(t=>inside(t,pts[i])),edges=new Map();
  for(const t of bad)for(let j=0;j<3;j++){const e=[t[j],t[(j+1)%3]],id=[...e].sort((a,b)=>a-b).join(',');if(edges.has(id))edges.delete(id);else edges.set(id,e);}
  tris=tris.filter(t=>!bad.includes(t));for(const e of edges.values())tris.push([...e,i]);
 }
 return tris.filter(t=>t.every(i=>i<input.length));
}

 const mesh=triangulate(points);
 const smooth=x=>{x=Math.max(0,Math.min(1,x));return x*x*(3-2*x);};
 // Move the contact point off the page corner and onto the open writing area.
 const contact={x:516,y:862};
 const inkPoint=progress=>({x:contact.x+progress*6,y:contact.y+Math.sin(progress*Math.PI*4)*2.1});
 function gesture(t){let progress=0;for(const start of [.4,1.05,1.7])progress+=smooth((t-start)/.45);const tip=inkPoint(progress);return{progress,dx:tip.x-moving[2][0],dy:tip.y-moving[2][1]};}
 function draw(t){if(!loaded)return;t=Math.max(0,Math.min(duration,t));const g=gesture(t),factors=[.25,.65,1,.6];const target=points.map((p,i)=>i<fixed.length?p:[p[0]+g.dx*factors[i-fixed.length]*width/1316,p[1]+g.dy*factors[i-fixed.length]*height/1195]);
 ctx.clearRect(0,0,width,height);ctx.drawImage(image,0,0,width,height);
 // Warp only triangles affected by the wrist or pencil; the rest stays exact.
 for(const ids of mesh){if(ids.every(i=>i<fixed.length))continue;const [a,b,c]=ids.map(i=>points[i]),[p,q,r]=ids.map(i=>target[i]);const det=(b[0]-a[0])*(c[1]-a[1])-(c[0]-a[0])*(b[1]-a[1]);if(Math.abs(det)<1e-8)continue;
 const xx=((q[0]-p[0])*(c[1]-a[1])-(r[0]-p[0])*(b[1]-a[1]))/det,xy=((q[1]-p[1])*(c[1]-a[1])-(r[1]-p[1])*(b[1]-a[1]))/det,yx=((r[0]-p[0])*(b[0]-a[0])-(q[0]-p[0])*(c[0]-a[0]))/det,yy=((r[1]-p[1])*(b[0]-a[0])-(q[1]-p[1])*(c[0]-a[0]))/det;
 ctx.save();ctx.beginPath();const cx=(p[0]+q[0]+r[0])/3,cy=(p[1]+q[1]+r[1])/3;for(const [i,v]of [p,q,r].entries()){const dx=v[0]-cx,dy=v[1]-cy,k=1+.25/Math.hypot(dx,dy);ctx[i?'lineTo':'moveTo'](cx+dx*k,cy+dy*k);}ctx.closePath();ctx.clip();ctx.setTransform(xx,xy,yx,yy,p[0]-xx*a[0]-yx*a[1],p[1]-xy*a[0]-yy*a[1]);ctx.drawImage(image,0,0,width,height);ctx.restore();}
 // Short written marks accumulate immediately behind the pencil tip.
 ctx.save();ctx.scale(width/1316,height/1195);ctx.strokeStyle='#785032';ctx.lineWidth=1.5;ctx.lineCap='round';ctx.beginPath();for(let n=0;n<=Math.floor(g.progress*30);n++){const {x,y}=inkPoint(n/30);if(n===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}const tip=inkPoint(g.progress);if(g.progress>0)ctx.lineTo(tip.x,tip.y);ctx.stroke();ctx.restore();
 }
 const ready=new Promise((resolve,reject)=>{image.onload=()=>{loaded=true;resolve();};image.onerror=()=>reject(Error('Chapter 2 artwork failed to load'));image.src=assetBase+'scene-v2.png';});
 return{draw,ready,duration,get loaded(){return loaded;}};
};
