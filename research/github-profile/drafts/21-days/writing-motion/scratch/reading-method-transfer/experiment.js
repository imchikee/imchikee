// One t=0 transfer only. Reuse reading contour-data.js's 50px boundary band,
// blur(2px), rounded joins/caps, and blur(3px) inset frame; no new art or motion.
window.transferReady=(async()=>{
 await writingScene.readyPromise;
 const s=shoulderStudy,make=(w,h)=>{const c=document.createElement('canvas');c.width=w;c.height=h;return c;};
 const snap=c=>{const out=make(c.width,c.height);out.getContext('2d').drawImage(c,0,0);return out;};
 const crop=c=>{const out=make(660,500);out.getContext('2d').drawImage(c,320,730,330,250,0,0,660,500);return out;};
 const load=async src=>{const im=new Image();im.src=src;await im.decode();return im;};
 const readingRoot='../reading-motion/';
 const readingDown=await load(readingRoot+'redrawn/down-key-soft-v1.png');
 const readingHead=await load(readingRoot+'redrawn/contour-head-down-v1.png');
 const readingPatch=await load(readingRoot+'redrawn/contour-patch-down-v2.png');
 s.renderBaseline(0);const baseline=snap(writingScene.canvas);
 const origin=[330,700],points=[[80,107],[110,115],[145,124],[180,133]];
 const patch=make(270,240),p=patch.getContext('2d');p.drawImage(s.base,330,700,270,240,0,0,270,240);
 const band=make(270,240),b=band.getContext('2d');b.filter='blur(2px)';b.strokeStyle='#fff';b.lineWidth=50;b.lineJoin=b.lineCap='round';b.beginPath();points.forEach(([x,y],i)=>b[i?'lineTo':'moveTo'](x,y));b.stroke();
 const frame=make(270,240),f=frame.getContext('2d');f.filter='blur(3px)';f.fillStyle='#fff';f.fillRect(6,6,258,228);b.globalCompositeOperation='destination-in';b.drawImage(frame,0,0);
 p.globalCompositeOperation='destination-in';p.drawImage(band,0,0);
 // Protect the existing rigid grip and pencil. This is an exclusion of the
 // existing layer, analogous to reading's book/cap/whisker exclusions, not matting.
 p.globalCompositeOperation='destination-out';p.drawImage(s.gripWorld,-origin[0],-origin[1]);p.globalCompositeOperation='source-over';
 // Reading motion.js restores original-art stationary foreground over motion.
 // Here the only registered clean source available is the second-scene base.
 s.renderBaseline(0,false);s.paint.drawImage(patch,...origin);s.paint.drawImage(s.shoulderCover,0,0);
 const candidate=snap(writingScene.canvas);window.outputs={'baseline-0.png':baseline,'candidate-0.png':candidate};
 const comparison=make(1320,540),q=comparison.getContext('2d');q.fillStyle='#181d21';q.fillRect(0,0,1320,540);q.font='20px sans-serif';q.fillStyle='#eee8dc';q.fillText('70% baseline - t=0',8,28);q.fillText('One reading-method transfer - t=0',668,28);q.drawImage(crop(baseline),0,40);q.drawImage(crop(candidate),660,40);outputs['comparison-0.png']=comparison;
 // Opaque explanatory grid; not a reusable fur/alpha asset.
 const analysis=make(1980,1100),a=analysis.getContext('2d');a.fillStyle='#181d21';a.fillRect(0,0,1980,1100);const title=(text,x,y)=>{a.font='19px sans-serif';a.fillStyle='#eee8dc';a.fillText(text,x+8,y+28);};
 title('READING: authored contour patch (200,490,270,240)',0,0);a.drawImage(readingPatch,0,40,660,440);
 title('READING: head patch is a painted crop, not RGBA fur',660,0);a.drawImage(readingHead,660,40,660,440);
 title('READING: fixed book/paws occlude the moving head',1320,0);a.drawImage(readingDown,440,630,600,390,1320,40,660,440);
 title('WRITING: registered clean base, no cheek/arm boundary',0,550);a.drawImage(crop(s.base),0,590);
 title('WRITING: v33 has fur/arm overlap baked together',660,550);a.drawImage(crop(s.layers['08 raw v33 registered']),660,590);
 title('TRANSFER: fixed original pixels selected by same band',1320,550);a.drawImage(crop(baseline),1320,590);a.save();a.translate(1320,590);a.scale(2,2);a.translate(-320,-730);a.strokeStyle='#00d8e8';a.lineWidth=1;a.strokeRect(330,700,270,240);a.strokeStyle='#ffe03e';a.lineWidth=2;a.beginPath();points.forEach(([x,y],i)=>a[i?'lineTo':'moveTo'](x+330,y+700));a.stroke();a.restore();
 a.fillStyle='#eee8dc';a.font='18px sans-serif';a.fillText('Same composition operations; missing equivalent authored cheek/arm pixels. No reading art pasted into writing.',16,520);outputs['transfer-analysis.png']=analysis;
 const before=baseline.getContext('2d').getImageData(0,0,1316,1195).data,after=candidate.getContext('2d').getImageData(0,0,1316,1195).data;let changed=0,outside=0,gripChanged=0;const grip=s.gripWorld.getContext('2d').getImageData(0,0,1316,1195).data;for(let y=0;y<1195;y++)for(let x=0;x<1316;x++){const i=(y*1316+x)*4;if(before[i]!==after[i]||before[i+1]!==after[i+1]||before[i+2]!==after[i+2]){changed++;if(x<330||x>=600||y<700||y>=940)outside++;if(grip[i+3]===255)gripChanged++;}}
 window.transferChecks={amplitude:writingScene.amplitude,timesTested:[0],attempts:1,source:'current writing base; no reading pixels pasted',band:{crop:[330,700,270,240],points,width:50,blur:2,insetFrame:[6,6,258,228],frameBlur:3},unchangedMotion:true,changedPixels:changed,changedOutsideCrop:outside,changedOpaqueGripPixels:gripChanged};return true;
})();
