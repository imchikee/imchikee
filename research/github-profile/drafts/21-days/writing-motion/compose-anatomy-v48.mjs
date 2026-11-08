import './compose-expression.mjs';
import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=path.dirname(fileURLToPath(import.meta.url));
async function ff(args,input){const chunks=[];await new Promise((resolve,reject)=>{const p=spawn('ffmpeg',['-v','error',...args]);let err='';p.stdout.on('data',d=>chunks.push(d));p.stderr.on('data',d=>err+=d);p.on('close',k=>k?reject(Error(err)):resolve());p.stdin.end(input);});return Buffer.concat(chunks);}
const base=await ff(['-i',path.join(root,'scene-v38-current.png'),'-pix_fmt','rgba','-f','rawvideo','pipe:1']);
const edit=await ff(['-i',path.join(root,'anatomy-edit-v48.png'),'-vf','scale=1316:1195','-pix_fmt','rgba','-f','rawvideo','pipe:1']);
const cleanFace=await ff(['-i',path.join(root,'clean-patch-v42.png'),'-pix_fmt','rgba','-f','rawvideo','pipe:1']);
const smooth=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);};
function lineDistance(x,y,ax,ay,bx,by){const dx=bx-ax,dy=by-ay,t=Math.max(0,Math.min(1,((x-ax)*dx+(y-ay)*dy)/(dx*dx+dy*dy)));return Math.hypot(x-ax-t*dx,y-ay-t*dy);}
for(let y=775;y<950;y++)for(let x=290;x<610;x++){
 const torso=smooth(Math.min((x-290)/18,(565-x)/12,(y-785)/15,(950-y)/12));
 const paw=smooth(Math.min((x-480)/12,(610-x)/12,(y-840)/12,(950-y)/12));
 const pencil=smooth((18-lineDistance(x,y,530,807,583,928))/4);
 const a=Math.max(torso,paw,pencil);if(!a)continue;const i=(y*1316+x)*4;
 for(let c=0;c<3;c++)base[i+c]=Math.round(base[i+c]*(1-a)+edit[i+c]*a);
}
// The original source also contains pencil shadow here; use the already clean cheek texture.
for(let y=833;y<850;y++)for(let x=558;x<575;x++){
 const a=smooth((8-Math.hypot(x-566,y-841))/3),i=(y*1316+x)*4,j=((y-770)*340+x-315)*4;
 for(let c=0;c<3;c++)base[i+c]=Math.round(base[i+c]*(1-a)+cleanFace[j+c]*a);
}
await ff(['-y','-f','rawvideo','-pix_fmt','rgba','-s','1316x1195','-i','pipe:0','-frames:v','1',path.join(root,'scene-v48-current.png')],base);
console.log('Composited only the torso/foreleg anatomy, preserving facial features and room.');
