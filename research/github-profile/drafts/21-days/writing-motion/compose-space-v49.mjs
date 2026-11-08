import './compose-expression.mjs';
import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=path.dirname(fileURLToPath(import.meta.url));
async function ff(args,input){const chunks=[];await new Promise((resolve,reject)=>{const p=spawn('ffmpeg',['-v','error',...args]);let err='';p.stdout.on('data',d=>chunks.push(d));p.stderr.on('data',d=>err+=d);p.on('close',k=>k?reject(Error(err)):resolve());p.stdin.end(input);});return Buffer.concat(chunks);}
const base=await ff(['-i',path.join(root,'scene-v38-current.png'),'-pix_fmt','rgba','-f','rawvideo','pipe:1']);
const edit=await ff(['-i',path.join(root,'pose-space-edit-v49.png'),'-vf','scale=1316:1195','-pix_fmt','rgba','-f','rawvideo','pipe:1']);
const hull=[[640,294],[720,302],[790,330],[840,365],[880,363],[935,375],[972,414],[978,478],[963,530],[935,557],[961,604],[985,662],[996,720],[984,786],[962,835],[920,870],[890,920],[800,920],[700,915],[620,950],[470,950],[365,934],[285,925],[276,856],[251,790],[244,721],[258,655],[291,592],[328,549],[359,528],[346,498],[344,454],[351,410],[376,378],[413,365],[455,371],[488,348],[542,316],[600,299]];
function inside(x,y){let c=false;for(let i=0,j=hull.length-1;i<hull.length;j=i++){const a=hull[i],b=hull[j];if((a[1]>y)!=(b[1]>y)&&x<(b[0]-a[0])*(y-a[1])/(b[1]-a[1])+a[0])c=!c;}return c;}
function distance(x,y,a,b){const dx=b[0]-a[0],dy=b[1]-a[1],t=Math.max(0,Math.min(1,((x-a[0])*dx+(y-a[1])*dy)/(dx*dx+dy*dy)));return Math.hypot(x-a[0]-t*dx,y-a[1]-t*dy);}
const smooth=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);};
for(let y=294;y<950;y++)for(let x=244;x<997;x++){
 if(!inside(x,y))continue;let d=Infinity;for(let j=0;j<hull.length;j++)d=Math.min(d,distance(x,y,hull[j],hull[(j+1)%hull.length]));
 let a=smooth(d/10);
 // Preserve the lamp's right edge where the character envelope passes close to it.
 if(x<=355&&y>=475&&y<=535)a=0;
 // Keep the original notebook binding; the character edit must not redraw its rings.
 if(x>=650&&x<=800&&y>=875)a=0;
 const i=(y*1316+x)*4;for(let c=0;c<3;c++)base[i+c]=Math.round(base[i+c]*(1-a)+edit[i+c]*a);
}
await ff(['-y','-f','rawvideo','-pix_fmt','rgba','-s','1316x1195','-i','pipe:0','-frames:v','1',path.join(root,'scene-v49-current.png')],base);
console.log('Recomposed character proportions inside its envelope; title and separate scene remain original.');
