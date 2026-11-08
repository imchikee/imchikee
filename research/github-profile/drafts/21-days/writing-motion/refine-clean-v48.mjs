import {spawn} from 'node:child_process';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.dirname(fileURLToPath(import.meta.url));
async function ff(args,input){const chunks=[];await new Promise((resolve,reject)=>{const p=spawn('ffmpeg',['-v','error',...args]);let err='';p.stdout.on('data',d=>chunks.push(d));p.stderr.on('data',d=>err+=d);p.on('close',k=>k?reject(Error(err)):resolve());p.stdin.end(input);});return Buffer.concat(chunks);}
const clean=await ff(['-i',path.join(root,'clean-patch-v48.png'),'-pix_fmt','rgba','-f','rawvideo','pipe:1']);
const face=await ff(['-i',path.join(root,'clean-patch-v42.png'),'-pix_fmt','rgba','-f','rawvideo','pipe:1']);
const smooth=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);};
// Restore the already clean cheek fur in the small area where the generator added a dark spot.
for(let y=833;y<850;y++)for(let x=558;x<575;x++){
 const a=smooth((8-Math.hypot(x-566,y-841))/3),i=((y-770)*340+x-315)*4;
 for(let c=0;c<3;c++)clean[i+c]=Math.round(clean[i+c]*(1-a)+face[i+c]*a);
}
await ff(['-y','-f','rawvideo','-pix_fmt','rgba','-s','340x240','-i','pipe:0','-frames:v','1',path.join(root,'clean-patch-v48.png')],clean);
