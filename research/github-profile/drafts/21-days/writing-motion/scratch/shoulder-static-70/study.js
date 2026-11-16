window.studyReady=(async()=>{await writingScene.readyPromise;const s=shoulderStudy;window.outputs={};
const crop=(source)=>{const c=document.createElement('canvas');c.width=660;c.height=500;const x=c.getContext('2d');x.fillStyle='#535353';x.fillRect(0,0,660,500);x.drawImage(source,320,730,330,250,0,0,660,500);return c;};
for(const [name,c] of Object.entries(s.layers))outputs[name.replaceAll(' ','-')+'.png']=crop(c);
s.renderBaseline(0);outputs['baseline-0.png']=crop(writingScene.canvas);s.renderBaseline(0,false);outputs['without-cover-0.png']=crop(writingScene.canvas);
const names=Object.keys(outputs),grid=document.createElement('canvas');grid.width=1980;grid.height=Math.ceil(names.length/3)*540;const x=grid.getContext('2d');x.fillStyle='#181d21';x.fillRect(0,0,grid.width,grid.height);names.forEach((name,i)=>{let a=i%3*660,b=Math.floor(i/3)*540;x.fillStyle='#eee8dc';x.font='19px sans-serif';x.fillText(name,a+8,b+26);x.drawImage(outputs[name],a,b+40);});outputs['layer-breakdown.png']=grid;
return true;})();window.staticReady=(async()=>{await studyReady;const s=shoulderStudy;
// Single local material repair: registered v33 cheek/shoulder transition.
// No blur, colour correction, geometry or motion change.
const patch=document.createElement('canvas');patch.width=1316;patch.height=1195;const x=patch.getContext('2d');
x.beginPath();x.moveTo(379,795);x.lineTo(386,791);x.lineTo(393,795);x.lineTo(400,793);x.lineTo(410,798);x.lineTo(420,799);x.lineTo(430,803);x.lineTo(440,804);x.lineTo(450,808);x.lineTo(461,810);x.lineTo(472,813);x.lineTo(484,816);x.lineTo(496,821);x.lineTo(509,825);x.lineTo(513,839);x.lineTo(503,847);x.lineTo(480,846);x.lineTo(455,840);x.lineTo(432,836);x.lineTo(412,834);x.lineTo(397,844);x.lineTo(388,857);x.lineTo(381,849);x.lineTo(376,831);x.closePath();x.clip();x.drawImage(s.layers['08 raw v33 registered'],0,0);
s.patch=patch;
s.renderCandidate=t=>{s.renderBaseline(t);s.paint.drawImage(patch,0,0);};
const crop=c=>{const o=document.createElement('canvas');o.width=660;o.height=500;o.getContext('2d').drawImage(c,320,730,330,250,0,0,660,500);return o;};
s.renderCandidate(0);outputs['candidate-0.png']=crop(writingScene.canvas);outputs['repair-layer.png']=crop(patch);
const c=document.createElement('canvas');c.width=1320;c.height=540;const q=c.getContext('2d');q.fillStyle='#181d21';q.fillRect(0,0,1320,540);q.fillStyle='#eee8dc';q.font='20px sans-serif';q.fillText('70% baseline — t=0',8,28);q.fillText('Single local repair — t=0',668,28);q.drawImage(outputs['baseline-0.png'],0,40);q.drawImage(outputs['candidate-0.png'],660,40);outputs['comparison-0.png']=c;
return true;})();
window.finalReady=(async()=>{await staticReady;const s=shoulderStudy;
const crop=c=>{const o=document.createElement('canvas');o.width=660;o.height=500;o.getContext('2d').drawImage(c,320,730,330,250,0,0,660,500);return o;};
for(const t of [2.581,3.8]){s.renderBaseline(t);outputs['baseline-'+t+'.png']=crop(writingScene.canvas);}
s.renderBaseline(0);const before=s.paint.getImageData(0,0,1316,1195).data.slice();s.renderCandidate(0);const after=s.paint.getImageData(0,0,1316,1195).data;let changed=0,outside=0;for(let y=0;y<1195;y++)for(let x=0;x<1316;x++){const i=(y*1316+x)*4;if(before[i]!==after[i]||before[i+1]!==after[i+1]||before[i+2]!==after[i+2]){changed++;if(x<375||x>514||y<790||y>858)outside++;}}
window.checks={amplitude:writingScene.amplitude,times:[0,2.581,3.8],candidateTimes:[0],staticVisualGate:'FAILED: new dark root arc and stepped right cut',changedPixels:changed,changedOutsideLocalPatch:outside,patchBounds:[375,790,514,858],motion:'original limbPose, mapped and ink drawing unchanged',newBlurOrFeather:false};
s.renderCandidate(0);return true;})();
