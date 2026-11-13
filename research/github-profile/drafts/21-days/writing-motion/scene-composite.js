// Finished scene uses the established writing geometry and clock.
(() => {
 const output=document.createElement('canvas');output.id='scene';
 output.setAttribute('aria-label','第二幕：台灯下写下 i++');
 canvas.after(output);canvas.style.display='none';
 const paint=output.getContext('2d'),art=img('scene-soft-master.png'),clean=img('scene-soft-clean.png'),pages=img('book-pages-blank.png'),head=img('head-down-static-v23.png');
 // Register pencil tip, eraser and grip to the new full-scene painting.
 const matrix=new DOMMatrix([108/176,-2.5/53,0,39/53,612-679*108/176,898+679*2.5/53-1006*39/53]);
 const inverse=matrix.inverse(),foreground=make(),matte=make(),moving=make(),sweep=make();
 let base,ready=false;
 function draw(t){
  if(!ready)return;
  paint.clearRect(0,0,output.width,output.height);paint.drawImage(base,0,0);
  paint.save();paint.setTransform(matrix);
  paint.strokeStyle='#493b30';paint.lineWidth=2.4;paint.lineCap='round';
  for(const s of strokes){if(t<=s.start)break;const u=smooth((t-s.start)/(s.end-s.start));paint.beginPath();paint.moveTo(...onPaper(s.a));for(let j=1;j<=12;j++)paint.lineTo(...onPaper(lerp(s.a,s.b,u*j/12)));paint.stroke();}
  const state=pose(t);warp(moving,foreground,points[0],state.to);paint.drawImage(moving,0,0);paint.restore();
 }
 const readyPromise=Promise.all([art.decode(),clean.decode(),pages.decode(),head.decode()]).then(()=>{
  output.width=art.naturalWidth;output.height=art.naturalHeight;
  // Trace this scene's actual limb instead of moving cream chest from the draft mask.
  const arm=new Path2D('M 372 867 Q 365 829 391 797 Q 425 795 462 811 Q 506 823 538 840 Q 551 832 567 841 Q 585 845 590 858 Q 595 867 582 870 Q 583 883 566 886 Q 545 888 531 878 Q 487 879 451 875 Q 405 873 372 867 Z');
  const pencil=new Path2D('M 495 779 Q 499 772 506 776 L 524 792 L 594 873 L 613 900 L 588 881 L 500 791 Q 491 785 495 779 Z');
  const m=matte.getContext('2d');m.setTransform(inverse);m.filter='blur(1px)';m.fill(arm);m.filter='blur(.45px)';m.fill(pencil);m.filter='none';m.resetTransform();
  const f=foreground.getContext('2d');f.drawImage(matte,0,0);f.globalCompositeOperation='source-in';f.setTransform(inverse);f.drawImage(art,0,0);f.resetTransform();f.globalCompositeOperation='source-over';
  const s=sweep.getContext('2d');s.drawImage(matte,0,0);
  for(let j=0;j<=20;j++){warp(moving,matte,points[0],pose(duration*j/20).to);s.drawImage(moving,0,0);}
  // Clear the fine painted wood/graphite edge beyond the registered old pencil.
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
  const h=headLayer.getContext('2d');h.filter='blur(5px)';
  h.fill(new Path2D('M 340 570 Q 330 390 570 302 L 812 302 Q 1000 367 990 590 L 970 789 Q 929 839 852 814 Q 787 791 738 833 Q 683 866 601 837 L 565 812 L 513 779 L 480 750 L 453 769 L 475 799 Q 401 805 350 777 Z'));
  h.filter='none';h.globalCompositeOperation='source-in';h.drawImage(head,0,0);b.drawImage(headLayer,0,0);
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
   if(changed){if(x<350||x>665||y<740||y>960)outside++;else movingPixels++;}
  }
  draw(time);return {changedOutsideWritingArea:outside,movingPixels};
 }
 window.writingScene={draw,validate,readyPromise,canvas:output,get ready(){return ready}};
})();
