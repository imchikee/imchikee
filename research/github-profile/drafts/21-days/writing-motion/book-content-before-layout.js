// Accurate C++ examples projected onto the existing painted paper.
window.paintBookContent=(ctx,matrix)=>{
 const ink='#735a46';
 function page(q,lines){
  const at=(u,v)=>[0,1].map(k=>(1-v)*((1-u)*q[0][k]+u*q[1][k])+v*((1-u)*q[3][k]+u*q[2][k]));
  function label(text,u,v,size=17){
   const p=at(u,v),dx=at(u+.01,v),dy=at(u,v+.01);
   ctx.save();ctx.setTransform((dx[0]-p[0])/4,(dx[1]-p[1])/4,(dy[0]-p[0])/3,(dy[1]-p[1])/3,p[0],p[1]);
   ctx.font=`${size}px monospace`;ctx.fillStyle=ink;ctx.fillText(text,0,0);ctx.restore();
  }
  lines.forEach((s,i)=>label(s,.08,.18+i*.125,i===0?23:19));
  return {label,line(points){ctx.save();ctx.strokeStyle=ink;ctx.lineWidth=1.1;ctx.beginPath();points.forEach(([u,v],i)=>{const p=at(u,v);i?ctx.lineTo(...p):ctx.moveTo(...p)});ctx.stroke();ctx.restore();}};
 }
 // Reader-facing reference volumes, set within the curved page margins.
 page([[84,934],[259,974],[176,1092],[24,1042]],['C++ / TYPES','','int count = 0;','double x = 1.5;','bool ok = true;','char c = \'A\';']);
 page([[305,970],[521,1015],[463,1119],[211,1080]],['C++ / LOOPS','','int sum = 0;','for (int i = 0;','     i < 3; i++) {','  sum += i;','}']);
 page([[812,1020],[1006,986],[1132,1081],[860,1134]],['C++ / BRANCH','','int n = 2;','if (n > 0) {','  n--;','}']);
 const flow=page([[1068,976],[1306,1004],[1305,1045],[1176,1084]],['C++ / FLOW']);
 flow.line([[.25,.26],[.7,.26],[.7,.40],[.25,.40],[.25,.26]]);flow.label('n = 2',.34,.36,20);
 flow.line([[.47,.40],[.47,.46],[.76,.57],[.47,.68],[.18,.57],[.47,.46]]);flow.label('n > 0',.31,.60,20);
 flow.line([[.47,.68],[.47,.78],[.25,.78],[.7,.78],[.7,.94],[.25,.94],[.25,.78]]);flow.label('yes',.50,.75,16);flow.label('n--',.36,.90,20);
 // Notebook shares the exact writer-facing coordinate system with the six live strokes.
 ctx.save();ctx.setTransform(matrix);
 ctx.transform(paperX[0],paperX[1],paperY[0],paperY[1],startTip[0],startTip[1]);
 ctx.fillStyle='#594736';ctx.font='14px monospace';
 for(const [s,x,y] of [['int main() {',-18,-30],['int i = 0;',0,-14],[';',43,10],['return i;',0,30],['}',-18,38]])ctx.fillText(s,x,y);
 ctx.restore();
 // Right notebook page: brief explanation, also facing the hamster.
 ctx.save();ctx.transform(-.92,.02,-.42,-.52,914,898);ctx.fillStyle=ink;ctx.font='17px monospace';
 ['C++ / increment','i++ adds one','0 -> 1'].forEach((s,i)=>ctx.fillText(s,0,i*25));ctx.restore();
};
