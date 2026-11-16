// Finished scene uses the established writing geometry and clock.
(() => {
 const output=document.createElement('canvas');output.id='scene';
 output.setAttribute('aria-label','第二幕：台灯下写下 i++');
 canvas.after(output);canvas.style.display='none';
 const paint=output.getContext('2d'),art=img('scene-soft-master.png'),clean=img('scene-soft-clean.png'),pages=img('book-pages-blank.png'),head=img('head-down-static-v23.png'),headChest=img('head-chest-clean-v26.png'),armArt=img('forelimb-static-v33.png');
 // Register pencil tip, eraser and grip to the new full-scene painting.
 const matrix=new DOMMatrix([108/176,-2.5/53,0,39/53,612-679*108/176,898+679*2.5/53-1006*39/53]);
 const inverse=matrix.inverse(),sweep=make();
 let base,shoulderCover,ready=false;
 const tip0={x:612,y:898},root={x:400,y:850},wrist={x:515,y:858};
 let armWorld,gripWorld;
 function curve(dx,dy,h){
  const points=[];let length=0;
  for(let i=0;i<=80;i++){
   const u=i/80,p={x:root.x+(wrist.x+dx-root.x)*u,y:root.y+(wrist.y+dy-root.y)*u+h*Math.sin(Math.PI*u)**2};
   if(i)length+=Math.hypot(p.x-points[i-1].x,p.y-points[i-1].y);
   points.push(p);
  }
  return {points,length};
 }
 const rest=curve(0,0,-18);
 function limbPose(t){
  const target=matrix.transformPoint({x:pose(t).tip[0],y:pose(t).tip[1]});
  const dx=target.x-tip0.x,dy=target.y-tip0.y;
  let low=0,high=80;
  for(let i=0;i<24;i++){const mid=(low+high)/2;if(curve(dx,dy,-mid).length>rest.length)high=mid;else low=mid;}
  return {target,dx,dy,curve:curve(dx,dy,-(low+high)/2)};
 }
 // Sample both curves by distance, so fur travels along a bending forelimb
 // rather than shortening with its screen-space shoulder-to-wrist distance.
 function atDistance(c,f){
  let left=c.length*f;
  for(let i=1;i<c.points.length;i++){
   const a=c.points[i-1],b=c.points[i],d=Math.hypot(b.x-a.x,b.y-a.y);
   if(left<=d||i===c.points.length-1){const u=left/d;return {x:a.x+(b.x-a.x)*u,y:a.y+(b.y-a.y)*u};}left-=d;
  }
 }
 function drawLimb(m){
  paint.drawImage(armWorld,0,0,root.x,output.height,0,0,root.x,output.height);
  for(let j=0;j<80;j++){
   const a=atDistance(rest,j/80),b=atDistance(rest,(j+1)/80),c=atDistance(m.curve,j/80),d=atDistance(m.curve,(j+1)/80);
   paint.save();paint.beginPath();paint.rect(c.x,700,d.x-c.x+.3,260);paint.clip();
   const sx=(d.x-c.x)/(b.x-a.x),shear=((d.y-c.y)-(b.y-a.y))/(b.x-a.x);
   paint.setTransform(sx,shear,0,1,c.x-sx*a.x,c.y-a.y-shear*a.x);paint.drawImage(armWorld,0,0);paint.restore();
  }
  paint.drawImage(gripWorld,m.dx,m.dy);
 }
 function draw(t){
  if(!ready)return;
  paint.clearRect(0,0,output.width,output.height);paint.drawImage(base,0,0);
  paint.save();paint.setTransform(matrix);
  paint.strokeStyle='#493b30';paint.lineWidth=2.4;paint.lineCap='round';
  for(const s of strokes){if(t<=s.start)break;const u=smooth((t-s.start)/(s.end-s.start));paint.beginPath();paint.moveTo(...onPaper(s.a));for(let j=1;j<=12;j++)paint.lineTo(...onPaper(lerp(s.a,s.b,u*j/12)));paint.stroke();}
  paint.restore();
  drawLimb(limbPose(t));
  paint.drawImage(shoulderCover,0,0);
 }
 const readyPromise=Promise.all([art.decode(),clean.decode(),pages.decode(),head.decode(),headChest.decode(),armArt.decode()]).then(()=>{
  output.width=art.naturalWidth;output.height=art.naturalHeight;
  // Painted v33 forelimb; keep the paw and pencil together as one rigid grip.
  const world=()=>{const c=document.createElement('canvas');c.width=output.width;c.height=output.height;return c;};
  const armPath=new Path2D('M 373 813 Q 393 794 420 810 Q 472 823 525 838 Q 553 827 576 843 Q 596 855 582 876 Q 563 905 531 894 Q 444 899 392 877 Q 375 858 373 813 Z');
  const pencil=new Path2D('M 497 777 Q 504 772 511 781 L 593 870 L 614 900 L 602 895 L 500 793 Q 492 786 497 777 Z');
  const source=world(),scx=source.getContext('2d');scx.drawImage(armArt,5,4);
  armWorld=world();const aw=armWorld.getContext('2d');aw.save();aw.beginPath();aw.rect(0,0,wrist.x,output.height);aw.clip();aw.filter='blur(.7px)';aw.fill(armPath);aw.filter='none';aw.globalCompositeOperation='source-in';aw.drawImage(source,0,0);aw.restore();
  gripWorld=world();const gw=gripWorld.getContext('2d');gw.save();gw.beginPath();gw.rect(wrist.x-1,0,output.width-wrist.x+1,output.height);gw.clip();gw.fill(armPath);gw.restore();gw.fill(pencil);gw.globalCompositeOperation='source-in';gw.drawImage(source,0,0);gw.globalCompositeOperation='source-over';
  const ss=sweep.getContext('2d');ss.setTransform(inverse);ss.fill(armPath);ss.fill(pencil);ss.resetTransform();
  base=document.createElement('canvas');base.width=output.width;base.height=output.height;
  const b=base.getContext('2d');b.drawImage(art,0,0);
  const patch=document.createElement('canvas');patch.width=output.width;patch.height=output.height;
  // A pencil-shaped repair exposes a pale diagonal seam in the chest as the
  // pencil moves away. Use one stationary, continuous chest plate instead.
  const p=patch.getContext('2d');
  p.filter='blur(18px)';
  p.fill(new Path2D('M 380 780 Q 490 755 580 770 Q 650 781 712 794 L 713 856 Q 665 888 602 905 L 560 923 L 373 885 Z'));
  p.filter='none';p.setTransform(matrix);p.drawImage(sweep,0,0);p.resetTransform();
  p.globalCompositeOperation='source-in';p.drawImage(clean,0,0);b.drawImage(patch,0,0);
  // Keep the approved head as a whole, including cap, ears and cheek silhouette.
  const headLayer=document.createElement('canvas');headLayer.width=output.width;headLayer.height=output.height;
  // Use one opaque chest painting, not overlapping old/new fur under a broad
  // feather. The edit removes the source arm and pencil from the approved head.
  const headSource=document.createElement('canvas');headSource.width=output.width;headSource.height=output.height;
  const hs=headSource.getContext('2d');hs.drawImage(head,0,0);
  const chestLayer=document.createElement('canvas');chestLayer.width=output.width;chestLayer.height=output.height;
  const hc=chestLayer.getContext('2d');hc.filter='blur(4px)';
  // Keep the repaired cheek/chest continuous: the old diagonal from the
  // pencil to the chin crossed two different fur directions. Follow the
  // whisker/blush edge and the existing mouth contour instead.
  hc.fill(new Path2D('M 345 744 Q 430 752 515 749 Q 580 740 619 750 Q 631 756 631 773 Q 638 805 658 817 Q 689 831 713 812 Q 733 800 743 785 L 761 807 L 741 864 L 725 886 L 350 902 Z'));
  hc.filter='none';hc.globalCompositeOperation='source-in';hc.drawImage(headChest,0,0,output.width,output.height);hs.drawImage(chestLayer,0,0);
  const h=headLayer.getContext('2d');h.filter='blur(5px)';
  h.fill(new Path2D('M 340 570 Q 330 390 570 302 L 812 302 Q 1000 367 990 590 L 970 789 Q 929 839 852 814 Q 787 791 738 833 L 735 865 Q 650 879 580 877 L 389 879 Q 358 849 350 777 Z'));
  h.filter='none';h.globalCompositeOperation='source-in';h.drawImage(headSource,0,0);b.drawImage(headLayer,0,0);
  // A stationary fur overlap covers only the fixed shoulder pivot.
  shoulderCover=document.createElement('canvas');shoulderCover.width=output.width;shoulderCover.height=output.height;
  const sc=shoulderCover.getContext('2d');sc.filter='blur(5px)';
  sc.fill(new Path2D('M 325 765 L 395 770 Q 414 792 410 817 Q 401 844 385 874 L 325 881 Z'));
  sc.filter='none';sc.globalCompositeOperation='source-in';sc.drawImage(base,0,0);
  // Only replace page interiors; character, repaired belly and room stay intact.
  b.save();b.beginPath();
  for(const poly of [
   [[401,879],[698,865],[780,930],[504,956]],
   [[712,865],[881,854],[973,909],[790,932]],
   [[76,922],[212,931],[283,968],[181,1114],[17,1052],[18,989]],
   [[287,971],[356,949],[542,1006],[477,1137],[188,1111]],
   [[791,1017],[924,974],[1018,979],[1159,1103],[855,1154]],
   [[1047,987],[1102,944],[1190,943],[1315,989],[1315,1052],[1163,1103]]
  ]){b.moveTo(...poly[0]);poly.slice(1).forEach(p=>b.lineTo(...p));b.closePath();}
  b.clip();b.drawImage(pages,0,0);b.restore();
  window.paintBookContent(b,matrix);
  ready=true;draw(time);
 });
 function validate(){
  draw(0);const before=paint.getImageData(0,0,output.width,output.height).data.slice();
  draw(duration);const after=paint.getImageData(0,0,output.width,output.height).data;
  let outside=0,movingPixels=0;
  for(let y=0;y<output.height;y++)for(let x=0;x<output.width;x++){
   const p=(y*output.width+x)*4,changed=before[p]!==after[p]||before[p+1]!==after[p+1]||before[p+2]!==after[p+2];
   if(changed){if(x<330||x>665||y<710||y>960)outside++;else movingPixels++;}
  }
  let limbLengthError=0,shoulderDrift=0,tipTrackingError=0;
  for(let j=0;j<=200;j++){
   const m=limbPose(duration*j/200);
   limbLengthError=Math.max(limbLengthError,Math.abs(m.curve.length-rest.length));
   shoulderDrift=Math.max(shoulderDrift,Math.hypot(m.curve.points[0].x-root.x,m.curve.points[0].y-root.y));
   tipTrackingError=Math.max(tipTrackingError,Math.hypot(tip0.x+m.dx-m.target.x,tip0.y+m.dy-m.target.y));
  }
  draw(time);return {changedOutsideWritingArea:outside,movingPixels,limbLengthError,shoulderDrift,tipTrackingError};
 }
 window.writingScene={draw,validate,readyPromise,canvas:output,get ready(){return ready}};
})();
