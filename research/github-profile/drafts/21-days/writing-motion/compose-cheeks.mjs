import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=path.dirname(fileURLToPath(import.meta.url));
async function ffmpeg(args,input){const chunks=[];await new Promise((resolve,reject)=>{const p=spawn('ffmpeg',['-v','error',...args]);let error='';p.stdout.on('data',b=>chunks.push(b));p.stderr.on('data',b=>error+=b);p.on('error',reject);p.on('close',c=>c===0?resolve():reject(Error(error)));p.stdin.end(input);});return Buffer.concat(chunks);}
const base=await ffmpeg(['-i',path.join(root,'scene-v25-master.png'),'-pix_fmt','rgba','-f','rawvideo','pipe:1']);
const edit=await ffmpeg(['-i',path.join(root,'cheek-volume-edit-v25.png'),'-vf','scale=760:575','-pix_fmt','rgba','-f','rawvideo','pipe:1']);
const smooth=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);};
const ellipse=(x,y,cx,cy,rx,ry,edge=.18)=>smooth((1-Math.hypot((x-cx)/rx,(y-cy)/ry))/edge);
function penDistance(x,y){const ax=529,ay=797,dx=55,dy=118,t=Math.max(0,Math.min(1,((x-ax)*dx+(y-ay)*dy)/(dx*dx+dy*dy)));return Math.hypot(x-ax-t*dx,y-ay-t*dy);}
for(let y=0;y<575;y++)for(let x=0;x<760;x++){
 const px=x+240,py=y+300;
 const cheek=Math.max(ellipse(px,py,455,752,180,100),ellipse(px,py,850,772,138,94),ellipse(px,py,698,818,160,48));
 const protect=Math.max(ellipse(px,py,602,675,57,54),ellipse(px,py,779,689,53,51),ellipse(px,py,698,738,64,48),ellipse(px,py,525,875,60,40),ellipse(px,py,824,857,60,43),smooth((29-penDistance(px,py))/12));
 const alpha=cheek*(1-protect);if(!alpha)continue;const a=(py*1316+px)*4,b=(y*760+x)*4;
 for(let c=0;c<3;c++)base[a+c]=Math.round(base[a+c]*(1-alpha)+edit[b+c]*alpha);
}
await ffmpeg(['-y','-f','rawvideo','-pix_fmt','rgba','-s','1316x1195','-i','pipe:0','-frames:v','1',path.join(root,'scene-v25-cheek-volume.png')],base);
console.log('Composed cheek volume; eyes, muzzle, paws, pencil and room retain the current master.');
