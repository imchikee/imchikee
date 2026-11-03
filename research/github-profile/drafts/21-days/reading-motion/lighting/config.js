// The approved relit paintings already contain their fur edges and room lighting.
// Old contour patches contain the old room colors and would create bright halos.
contourPatches.forEach((p,i)=>{p.base=['lighting/front-v1.png','lighting/mid-v1.png','lighting/down-v2.png'][i];});
const accentRoot=new URL('.',document.currentScript.src);
const accentClean=new Image(),accentOriginal=new Image();
accentClean.src=new URL('clean-accents-v1.png',accentRoot);accentOriginal.src=new URL('front-v1.png',accentRoot);
const accentRegions=[[[903,478],[957,478],[957,570],[903,578]],[[934,518],[1018,518],[1018,592],[934,592]],[[960,582],[1055,582],[1055,642],[960,642]]];
function accentLayer(image){
 const out=document.createElement('canvas');out.width=1316;out.height=1195;const c=out.getContext('2d');c.drawImage(image,0,0,1316,1195);
 const mask=document.createElement('canvas');mask.width=1316;mask.height=1195;const m=mask.getContext('2d');m.filter='blur(3px)';m.fillStyle='#fff';
 for(const poly of accentRegions){m.beginPath();poly.forEach(([x,y],i)=>m[i?'lineTo':'moveTo'](x,y));m.closePath();m.fill();}
 c.globalCompositeOperation='destination-in';c.drawImage(mask,0,0);return out;
}
let cleanAccentLayer,visibleAccentLayer;
window.readingAccent={
 ready:Promise.all([accentClean.decode(),accentOriginal.decode()]).then(()=>{cleanAccentLayer=accentLayer(accentClean);visibleAccentLayer=accentLayer(accentOriginal);}),
 opacity(t){const s=x=>{x=Math.max(0,Math.min(1,x));return x*x*(3-2*x);};return s((t-2.35)/.25)*(1-s((t-3)/.2));},
 draw(ctx,t,w,h){const a=this.opacity(t);if(!a)return;ctx.save();ctx.globalAlpha=a;ctx.drawImage(visibleAccentLayer,0,0,w,h);ctx.restore();}
};
composeContour=function(image){const out=document.createElement('canvas');out.width=1316;out.height=1195;const c=out.getContext('2d');c.drawImage(image,0,0,1316,1195);c.drawImage(cleanAccentLayer,0,0);return out;};
