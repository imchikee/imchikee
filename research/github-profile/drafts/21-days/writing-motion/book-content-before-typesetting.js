// Lay out each printed page once, then project that whole page onto the paper.
window.paintBookContent=(ctx,matrix)=>{
 const ink='#715944';
 function project(source,q){
  const [a,b,c,d]=q,dx1=b[0]-c[0],dx2=d[0]-c[0],dy1=b[1]-c[1],dy2=d[1]-c[1];
  const sx=a[0]-b[0]+c[0]-d[0],sy=a[1]-b[1]+c[1]-d[1],den=dx1*dy2-dx2*dy1;
  const g=(sx*dy2-dx2*sy)/den,h=(dx1*sy-sx*dy1)/den;
  const at=(u,v)=>[(a[0]+(b[0]-a[0]+g*b[0])*u+(d[0]-a[0]+h*d[0])*v)/(1+g*u+h*v),(a[1]+(b[1]-a[1]+g*b[1])*u+(d[1]-a[1]+h*d[1])*v)/(1+g*u+h*v)];
  function triangle(s,t){
   const [a,b,c]=s,[p,q,r]=t,det=(b[0]-a[0])*(c[1]-a[1])-(c[0]-a[0])*(b[1]-a[1]);
   const A=((q[0]-p[0])*(c[1]-a[1])-(r[0]-p[0])*(b[1]-a[1]))/det,B=((q[1]-p[1])*(c[1]-a[1])-(r[1]-p[1])*(b[1]-a[1]))/det;
   const C=((r[0]-p[0])*(b[0]-a[0])-(q[0]-p[0])*(c[0]-a[0]))/det,D=((r[1]-p[1])*(b[0]-a[0])-(q[1]-p[1])*(c[0]-a[0]))/det;
   const center=[(p[0]+q[0]+r[0])/3,(p[1]+q[1]+r[1])/3];const edge=[p,q,r].map(v=>{const d=Math.hypot(v[0]-center[0],v[1]-center[1]);return v.map((n,i)=>n+(n-center[i])*.7/d)});
   ctx.save();ctx.beginPath();ctx.moveTo(...edge[0]);ctx.lineTo(...edge[1]);ctx.lineTo(...edge[2]);ctx.closePath();ctx.clip();ctx.transform(A,B,C,D,p[0]-A*a[0]-C*a[1],p[1]-B*a[0]-D*a[1]);ctx.drawImage(source,0,0);ctx.restore();
  }
  for(let y=0;y<12;y++)for(let x=0;x<12;x++){
   const uv=[[x/12,y/12],[(x+1)/12,y/12],[(x+1)/12,(y+1)/12],[x/12,(y+1)/12]],s=uv.map(([u,v])=>[u*source.width,v*source.height]),t=uv.map(p=>at(...p));
   for(const ids of [[0,1,2],[0,2,3]])triangle(ids.map(i=>s[i]),ids.map(i=>t[i]));
  }
 }
 function page(q,title,subtitle,lines,number){
  const c=document.createElement('canvas');c.width=480;c.height=360;const p=c.getContext('2d');p.fillStyle=ink;p.strokeStyle=ink;
  p.font='18px Georgia';p.fillText('C++  /  THE BASICS',38,37);p.lineWidth=1;p.beginPath();p.moveTo(38,50);p.lineTo(442,50);p.stroke();
  p.font='bold 28px Georgia';p.fillText(title,38,91);p.font='19px Georgia';p.fillText(subtitle,38,123);
  p.font='20px monospace';lines.forEach((s,i)=>p.fillText(s,46,163+i*26));p.font='16px Georgia';p.fillText(String(number),230,337);
  // Rotate the entire printed layout toward the hamster before projection.
  project(c,[q[2],q[3],q[0],q[1]]);
 }
 page([[79,927],[273,973],[181,1100],[19,1047]],'Variables','Values have a type.', ['int count = 0;','double x = 1.5;','bool ok = true;','char c = \'A\';'],12);
 page([[298,963],[533,1008],[471,1128],[204,1093]],'Loops','Repeat a statement.', ['int sum = 0;','for (int i = 0;','     i < 3; i++) {','  sum += i;','}'],13);
 page([[801,1015],[1016,982],[1146,1097],[855,1144]],'Conditions','Choose what runs next.', ['int n = 2;','if (n > 0) {','  n--;','}'],20);
 // The opposite page keeps the same baseline direction and typographic hierarchy.
 page([[1065,988],[1240,952],[1303,1039],[1174,1086]],'Trace','Follow the value of n.', ['n = 2','n > 0  -> true','n--','n = 1'],21);
 ctx.save();ctx.setTransform(matrix);ctx.transform(paperX[0],paperX[1],paperY[0],paperY[1],startTip[0],startTip[1]);
 ctx.fillStyle='#594736';ctx.font='16px monospace';
 for(const [s,x,y] of [['int i = 0;',-18,-30],['while (i < 3) {',-18,-10],[';',43,10],['}',-18,30]])ctx.fillText(s,x,y);
 ctx.restore();
 ctx.save();ctx.transform(-.82,.045,-.85,-.52,920,896);ctx.fillStyle=ink;ctx.font='16px monospace';
 ['Increment','i++ adds one','0 -> 1 -> 2 -> 3'].forEach((s,i)=>ctx.fillText(s,0,i*22));ctx.restore();
};
