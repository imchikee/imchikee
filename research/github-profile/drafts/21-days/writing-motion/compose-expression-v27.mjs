import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=path.dirname(fileURLToPath(import.meta.url));
async function ffmpeg(args,input){const chunks=[];await new Promise((resolve,reject)=>{const p=spawn('ffmpeg',['-v','error',...args]);let error='';p.stdout.on('data',b=>chunks.push(b));p.stderr.on('data',b=>error+=b);p.on('error',reject);p.on('close',c=>c===0?resolve():reject(Error(error)));p.stdin.end(input);});return Buffer.concat(chunks);}
const base=await ffmpeg(['-i',path.join(root,'scene-v26-master.png'),'-pix_fmt','rgba','-f','rawvideo','pipe:1']);
const edit=await ffmpeg(['-i',path.join(root,'expression-edit-v27.png'),'-vf','scale=340:205','-pix_fmt','rgba','-f','rawvideo','pipe:1']);
const smooth=x=>{x=Math.max(0,Math.min(1,x));return x*x*(3-2*x);};
function ellipse(x,y,cx,cy,rx,ry){return smooth((1-Math.hypot((x-cx)/rx,(y-cy)/ry))/.18);}
for(let y=0;y<205;y++)for(let x=0;x<340;x++){
 const alpha=Math.max(ellipse(x,y,93,73,61,57),ellipse(x,y,263,95,61,57),ellipse(x,y,179,145,73,47));
 if(!alpha)continue;const a=((y+610)*1316+x+480)*4,b=(y*340+x)*4;
 for(let c=0;c<3;c++)base[a+c]=Math.round(base[a+c]*(1-alpha)+edit[b+c]*alpha);
}
await ffmpeg(['-y','-f','rawvideo','-pix_fmt','rgba','-s','1316x1195','-i','pipe:0','-frames:v','1',path.join(root,'scene-v27-current.png')],base);
console.log('Composed only the gentler eyes and muzzle; cheek outline, paws and chapter-2 room stay from the pose master.');
