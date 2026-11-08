import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=path.dirname(fileURLToPath(import.meta.url));
async function ffmpeg(args,input){const chunks=[];await new Promise((resolve,reject)=>{const p=spawn('ffmpeg',['-v','error',...args]);let error='';p.stdout.on('data',b=>chunks.push(b));p.stderr.on('data',b=>error+=b);p.on('error',reject);p.on('close',c=>c===0?resolve():reject(Error(error)));p.stdin.end(input);});return Buffer.concat(chunks);}
const base=await ffmpeg(['-i',path.join(root,'scene-v25-master.png'),'-pix_fmt','rgba','-f','rawvideo','pipe:1']);
const original=await ffmpeg(['-i',path.join(root,'cheek-volume-input-v25.png'),'-vf','gblur=sigma=14','-pix_fmt','rgba','-f','rawvideo','pipe:1']);
const edited=await ffmpeg(['-i',path.join(root,'cheek-light-edit-v25.png'),'-vf','scale=760:575,gblur=sigma=14','-pix_fmt','rgba','-f','rawvideo','pipe:1']);
const smooth=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);};
const ellipse=(x,y,cx,cy,rx,ry)=>smooth((1-Math.hypot((x-cx)/rx,(y-cy)/ry))/.28);
function penDistance(x,y){const dx=55,dy=118,t=Math.max(0,Math.min(1,((x-529)*dx+(y-797)*dy)/(dx*dx+dy*dy)));return Math.hypot(x-529-t*dx,y-797-t*dy);}
for(let y=0;y<575;y++)for(let x=0;x<760;x++){
 const px=x+240,py=y+300;
 // Only a smooth light/color field is transferred. Source fur, whiskers,
 // facial details and ALL silhouette/lower-contour pixels remain untouched.
 const alpha=.85*Math.max(ellipse(px,py,450,742,145,72),ellipse(px,py,850,760,108,65))*smooth((penDistance(px,py)-20)/10);
 if(!alpha)continue;const a=(py*1316+px)*4,b=(y*760+x)*4;
 for(let c=0;c<3;c++){const delta=Math.max(-20,Math.min(20,edited[b+c]-original[b+c]));base[a+c]=Math.round(Math.max(0,Math.min(255,base[a+c]+delta*alpha)));}
}
await ffmpeg(['-y','-f','rawvideo','-pix_fmt','rgba','-s','1316x1195','-i','pipe:0','-frames:v','1',path.join(root,'scene-v25-current.png')],base);
console.log('Applied restrained cheek-interior lighting; the original outline, features and room are preserved.');
