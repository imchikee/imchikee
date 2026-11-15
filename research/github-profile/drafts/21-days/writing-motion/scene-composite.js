// Finished scene uses the established writing geometry and clock.
(() => {
 const output=document.createElement('canvas');output.id='scene';
 output.setAttribute('aria-label','第二幕：台灯下写下 i++');
 canvas.after(output);canvas.style.display='none';
 const paint=output.getContext('2d'),art=img('scene-soft-master.png'),clean=img('scene-soft-clean.png'),pages=img('book-pages-blank.png'),head=img('head-down-static-v23.png'),headChest=img('head-chest-clean-v26.png'),armArt=img('forearm-source-no-pencil.png');
 // Register pencil tip, eraser and grip to the new full-scene painting.
 const matrix=new DOMMatrix([108/176,-2.5/53,0,39/53,612-679*108/176,898+679*2.5/53-1006*39/53]);
 const inverse=matrix.inverse(),foreground=make(),matte=make(),moving=make(),sweep=make();
 let base,shoulderCover,ready=false;
 const shoulder={x:391,y:834},grip={x:566,y:858},tip0={x:612,y:898};
 const armLength=Math.hypot(grip.x-shoulder.x,grip.y-shoulder.y),penLength=Math.hypot(tip0.x-grip.x,tip0.y-grip.y);
 const penLayer=make();
 function rotation(from,to,pivot,destination=pivot){
  const angle=Math.atan2(to.y-destination.y,to.x-destination.x)-Math.atan2(from.y-pivot.y,from.x-pivot.x),c=Math.cos(angle),s=Math.sin(angle);
  return new DOMMatrix([c,s,-s,c,destination.x-c*pivot.x+s*pivot.y,destination.y-s*pivot.x-c*pivot.y]);
 }
 // Fixed shoulder + fixed forearm and grip-to-tip lengths. The wrist bends
 // to reach the existing ink path; neither the shoulder nor arm texture slides.
 function limbPose(t){
  const target=matrix.transformPoint({x:pose(t).tip[0],y:pose(t).tip[1]});
  const dx=target.x-shoulder.x,dy=target.y-shoulder.y,d=Math.hypot(dx,dy);
  const a=(armLength**2-penLength**2+d*d)/(2*d),h=Math.sqrt(Math.max(0,armLength**2-a*a));
  const wrist={x:shoulder.x+dx/d*a+dy/d*h,y:shoulder.y+dy/d*a-dx/d*h};
  return {arm:rotation(grip,wrist,shoulder),pen:rotation(tip0,target,grip,wrist),wrist,target};
 }
 function transformLayer(out,source,transform){
  const x=out.getContext('2d');x.resetTransform();x.clearRect(0,0,W,H);
  x.setTransform(inverse.multiply(transform).multiply(matrix));x.drawImage(source,0,0);x.resetTransform();
 }
 function draw(t){
  if(!ready)return;
  paint.clearRect(0,0,output.width,output.height);paint.drawImage(base,0,0);
  paint.save();paint.setTransform(matrix);
  paint.strokeStyle='#493b30';paint.lineWidth=2.4;paint.lineCap='round';
  for(const s of strokes){if(t<=s.start)break;const u=smooth((t-s.start)/(s.end-s.start));paint.beginPath();paint.moveTo(...onPaper(s.a));for(let j=1;j<=12;j++)paint.lineTo(...onPaper(lerp(s.a,s.b,u*j/12)));paint.stroke();}
  const motion=limbPose(t);
  transformLayer(moving,penLayer,motion.pen);paint.drawImage(moving,0,0);
  transformLayer(moving,foreground,motion.arm);paint.drawImage(moving,0,0);paint.restore();
  paint.drawImage(shoulderCover,0,0);
 }
 const readyPromise=Promise.all([art.decode(),clean.decode(),pages.decode(),head.decode(),headChest.decode(),armArt.decode()]).then(()=>{
  output.width=art.naturalWidth;output.height=art.naturalHeight;
  // Trace this scene's actual limb instead of moving cream chest from the draft mask.
  const arm=new Path2D('M 372 867 Q 365 829 391 797 Q 425 795 462 811 Q 506 823 538 840 Q 551 832 567 841 Q 585 845 590 858 Q 595 867 582 870 Q 583 883 566 886 Q 545 888 531 878 Q 487 879 451 875 Q 405 873 372 867 Z');
  const pencil=new Path2D('M 495 779 Q 499 772 506 776 L 524 792 L 594 873 L 613 900 L 588 881 L 500 791 Q 491 785 495 779 Z');
  const m=matte.getContext('2d');m.setTransform(inverse);m.filter='blur(1px)';m.fill(arm);
  // Preserve the full forearm volume. Only ease the short shoulder junction;
  // eroding the whole upper contour made the exposed arm look long and thin.
  m.globalCompositeOperation='destination-out';m.filter='blur(1px)';m.lineWidth=2;
  m.stroke(new Path2D('M 391 797 Q 406 796 421 799'));
  m.globalCompositeOperation='source-over';m.filter='none';m.resetTransform();
  const f=foreground.getContext('2d');f.drawImage(matte,0,0);f.globalCompositeOperation='source-in';f.setTransform(inverse);f.drawImage(armArt,0,0);f.resetTransform();f.globalCompositeOperation='source-over';
  // Separate the exposed pencil from the paw so the wrist may change angle.
  const penMask=make(),pm=penMask.getContext('2d');pm.setTransform(inverse);pm.filter='blur(.45px)';pm.fill(pencil);pm.filter='none';
  pm.globalCompositeOperation='destination-out';pm.beginPath();pm.ellipse(564,858,27,23,0,0,Math.PI*2);pm.fill();pm.resetTransform();
  const pl=penLayer.getContext('2d');pl.drawImage(penMask,0,0);pl.globalCompositeOperation='source-in';pl.setTransform(inverse);pl.drawImage(art,0,0);pl.resetTransform();pl.globalCompositeOperation='source-over';pl.setTransform(inverse);
  // Continue the original painted barrel through the formerly hidden grip.
  const barrel=document.createElement('canvas');barrel.width=24;barrel.height=16;
  const bx=barrel.getContext('2d'),axis=Math.atan2(119,112);bx.translate(0,8);bx.rotate(-axis);bx.translate(-527,-808);bx.drawImage(art,0,0);
  pl.save();pl.translate(530,811);pl.rotate(axis);pl.drawImage(barrel,0,2,24,12,0,-6,88,12);pl.restore();pl.resetTransform();pl.globalCompositeOperation='source-over';
  const s=sweep.getContext('2d');s.drawImage(matte,0,0);s.drawImage(penMask,0,0);
  for(let j=0;j<=20;j++){const motion=limbPose(duration*j/20);transformLayer(moving,matte,motion.arm);s.drawImage(moving,0,0);transformLayer(moving,penMask,motion.pen);s.drawImage(moving,0,0);}
  s.setTransform(inverse);s.lineWidth=5;s.lineJoin='round';s.stroke(pencil);s.resetTransform();
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
   const m=limbPose(duration*j/200),a=m.arm.transformPoint(shoulder),b=m.arm.transformPoint(grip),tip=m.pen.transformPoint(tip0);
   limbLengthError=Math.max(limbLengthError,Math.abs(Math.hypot(b.x-a.x,b.y-a.y)-armLength));
   shoulderDrift=Math.max(shoulderDrift,Math.hypot(a.x-shoulder.x,a.y-shoulder.y));
   tipTrackingError=Math.max(tipTrackingError,Math.hypot(tip.x-m.target.x,tip.y-m.target.y));
  }
  draw(time);return {changedOutsideWritingArea:outside,movingPixels,limbLengthError,shoulderDrift,tipTrackingError};
 }
 window.writingScene={draw,validate,readyPromise,canvas:output,get ready(){return ready}};
})();
