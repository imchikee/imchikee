// Lay out each printed page once, then project that whole page onto the paper.
window.paintBookContent=(ctx,matrix)=>{
 const ink='#715944';
 function project(source,q){
  const [a,b,c,d]=q,dx1=b[0]-c[0],dx2=d[0]-c[0],dy1=b[1]-c[1],dy2=d[1]-c[1];
  const sx=a[0]-b[0]+c[0]-d[0],sy=a[1]-b[1]+c[1]-d[1],den=dx1*dy2-dx2*dy1;
  const g=(sx*dy2-dx2*sy)/den,h=(dx1*sy-sx*dy1)/den;
  // Rasterize the inverse perspective once. This avoids thin letter strokes
  // being broken by hundreds of independently clipped canvas triangles.
  const H=[b[0]-a[0]+g*b[0],d[0]-a[0]+h*d[0],a[0],b[1]-a[1]+g*b[1],d[1]-a[1]+h*d[1],a[1],g,h,1];
  const [A,B,C,D,E,F,G,I,J]=H;
  const inv=[E*J-F*I,C*I-B*J,B*F-C*E,F*G-D*J,A*J-C*G,C*D-A*F,D*I-E*G,B*G-A*I,A*E-B*D];
  const left=Math.max(0,Math.floor(Math.min(...q.map(p=>p[0])))),top=Math.max(0,Math.floor(Math.min(...q.map(p=>p[1]))));
  const width=Math.ceil(Math.max(...q.map(p=>p[0])))-left+1,height=Math.ceil(Math.max(...q.map(p=>p[1])))-top+1;
  const out=document.createElement('canvas');out.width=width;out.height=height;
  const o=out.getContext('2d'),pixels=o.createImageData(width,height),src=source.getContext('2d').getImageData(0,0,source.width,source.height).data;
  for(let y=0;y<height;y++)for(let x=0;x<width;x++){
   let alpha=0;
   for(const oy of [.25,.75])for(const ox of [.25,.75]){
    const X=left+x+ox,Y=top+y+oy,z=inv[6]*X+inv[7]*Y+inv[8];
    const u=(inv[0]*X+inv[1]*Y+inv[2])/z,v=(inv[3]*X+inv[4]*Y+inv[5])/z;
    if(u<0||u>=1||v<0||v>=1)continue;
    const sx=u*(source.width-1),sy=v*(source.height-1),ix=Math.floor(sx),iy=Math.floor(sy),fx=sx-ix,fy=sy-iy;
    for(let dy=0;dy<2;dy++)for(let dx=0;dx<2;dx++)alpha+=src[((iy+dy)*source.width+ix+dx)*4+3]*(dx?fx:1-fx)*(dy?fy:1-fy)/4;
   }
   const i=(y*width+x)*4;pixels.data.set([94,71,49,alpha],i);
  }
  o.putImageData(pixels,0,0);ctx.save();ctx.globalCompositeOperation='multiply';ctx.drawImage(out,left,top);ctx.restore();
 }

 function page(q,title,subtitle,lines,number){
  const c=document.createElement('canvas');c.width=480;c.height=520;const p=c.getContext('2d');p.fillStyle=ink;p.strokeStyle=ink;
  p.font='20px Georgia';p.fillText('C++  /  THE BASICS',38,36);
  p.lineWidth=1.3;p.beginPath();p.moveTo(38,50);p.lineTo(442,50);p.stroke();
  p.font='bold 32px Georgia';p.fillText(title,38,94);
  const prose={Variables:['A variable names a value in memory.','Its type determines which values it','can hold. Initialize it before use.'],Loops:['A loop repeats its body while the','condition is true. Each iteration','updates the counter and the sum.'],Conditions:['An if statement tests a condition.','The body runs only when that test','is true. Braces group statements.'],Trace:['Trace each statement in order.','The condition is true when n is 2.','The decrement then leaves n at 1.']}[title];
  p.font='22px Georgia';prose.forEach((line,i)=>p.fillText(line,38,132+i*27));
  p.font='bold 20px Georgia';p.fillText('Example',38,238);
  p.font='23px monospace';lines.forEach((line,i)=>p.fillText(line,48,274+i*29));
  p.lineWidth=1;p.beginPath();p.moveTo(38,445);p.lineTo(442,445);p.stroke();
  p.font='21px Georgia';p.fillText(subtitle,38,475);p.font='18px Georgia';p.fillText(String(number),230,505);
  project(c,[q[2],q[3],q[0],q[1]]);
 }
 page([[79,927],[273,973],[181,1100],[19,1047]],'Variables','Values have a type.', ['int count = 0;','double x = 1.5;','bool ok = true;','char c = \'A\';'],12);
 page([[298,963],[533,1008],[471,1128],[204,1093]],'Loops','Repeat a statement.', ['int sum = 0;','for (int i = 0;','     i < 3; i++) {','  sum += i;','}'],13);
 page([[801,1015],[1016,982],[1146,1097],[855,1144]],'Conditions','Choose what runs next.', ['int n = 2;','if (n > 0) {','  n--;','}'],20);
 // The opposite page keeps the same baseline direction and typographic hierarchy.
 page([[1065,988],[1240,952],[1303,1039],[1174,1086]],'Trace','Follow the value of n.', ['n = 2','n > 0  -> true','n--','n = 1'],21);
 // Handwritten notebook letters use the same rounded strokes as the live i++.
 const glyphs={
  i:'M0 0L0 10 M0 -4L.15 -4',n:'M0 10L0 0 M0 3Q6 -3 6 3L6 10',t:'M3 -4L3 8Q3 12 7 9 M0 0L7 0',
  w:'M0 0L2 10L5 3L8 10L10 0',h:'M0 -4L0 10 M0 3Q6 -3 6 3L6 10',l:'M1 -4L1 10',e:'M0 4L7 4Q7 -2 2 0Q-2 2 0 8Q2 12 7 9',
  '0':'M4 -3C-1 -3 -1 11 4 11C9 11 9 -3 4 -3Z','1':'M0 0L3 -3L3 10 M0 10L6 10',
  '2':'M0 0Q4 -6 8 0Q9 3 0 10L8 10','3':'M0 -2Q9 -5 7 2L3 4Q10 3 8 8Q6 13 0 9',
  '=':'M0 2L8 2 M0 7L8 7','<':'M8 -1L0 4L8 9','>':'M0 -1L8 4L0 9','-':'M0 4L8 4',
  '(':'M5 -4Q-2 3 5 12',')':'M0 -4Q7 3 0 12','{':'M6 -4Q1 -4 2 1L0 4L2 7Q1 12 6 12','}':'M0 -4Q5 -4 4 1L6 4L4 7Q5 12 0 12',
  ';':'M2 1L2 1.2 M2 8Q3 11 0 13',':':'M2 1L2 1.2 M2 8L2 8.2','+':'M0 4L10 4 M5 -1L5 9'
 };
 function write(text,x,y){
  for(const ch of text){ctx.save();ctx.translate(x,y);if(glyphs[ch])ctx.stroke(new Path2D(glyphs[ch]));ctx.restore();x+=ch==='i'||ch==='l'?6:ch==='w'?13:ch===' '?8:11;}
 }
 ctx.save();ctx.setTransform(matrix);ctx.transform(paperX[0],paperX[1],paperY[0],paperY[1],startTip[0],startTip[1]);
 ctx.strokeStyle='#493b30';ctx.lineWidth=2.4;ctx.lineCap='round';ctx.lineJoin='round';
 write('int i = 0;',-18,-40);write('while (i < 3) {',-18,-20);write(';',43,0);write('}',-18,20);ctx.restore();
 ctx.save();ctx.transform(-.82,.045,-.85,-.52,920,896);ctx.strokeStyle='#6c533d';ctx.lineWidth=1.6;ctx.lineCap='round';ctx.lineJoin='round';
 write('i = 0',10,0);write('i++',10,25);write('0 -> 1 -> 2 -> 3',10,50);ctx.restore();
};
