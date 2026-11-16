(()=>{const scene=new Image(),closed=new Image();scene.src='scene.png';closed.src='eyes-closed-raw.png';let closedMaterial;const colourOffsets=[];const eyes=[{x:70,y:74,rx:44,ry:41},{x:226,y:97,rx:40,ry:34}];
function prepareMaterial(){
 const c=document.createElement('canvas');c.width=300;c.height=150;const x=c.getContext('2d');x.drawImage(closed,0,0,300,150);const pixels=x.getImageData(0,0,300,150);
 const reference=document.createElement('canvas');reference.width=300;reference.height=150;const r=reference.getContext('2d');r.drawImage(scene,535,630,300,150,0,0,300,150);const original=r.getImageData(0,0,300,150).data;
 // One deterministic per-eye RGB offset from the surrounding fur ring. This
 // does not smooth, warp, replace or animate the original scene texture.
 for(const e of eyes){const sums=[0,0,0];let count=0;for(let y=0;y<150;y++)for(let a=0;a<300;a++){const u=((a-e.x)/e.rx)**2+((y-e.y)/e.ry)**2;if(u>1.15&&u<1.65){const i=(y*300+a)*4;for(let k=0;k<3;k++)sums[k]+=original[i+k]-pixels.data[i+k];count++;}}const offset=sums.map(v=>v/count);colourOffsets.push(offset);for(let y=0;y<150;y++)for(let a=0;a<300;a++)if(Math.abs(a-e.x)<e.rx*1.1&&Math.abs(y-e.y)<e.ry*1.1){const i=(y*300+a)*4;for(let k=0;k<3;k++)pixels.data[i+k]=Math.max(0,Math.min(255,pixels.data[i+k]+offset[k]));}}
 x.putImageData(pixels,0,0);closedMaterial=c;
}
window.materialReady=Promise.all([scene.decode(),closed.decode()]).then(()=>{prepareMaterial();window.preparedMaterial=closedMaterial;window.materialOffsets=colourOffsets;return true;});})();
