import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=path.dirname(fileURLToPath(import.meta.url));
async function ffmpeg(args,input){const chunks=[];await new Promise((resolve,reject)=>{const p=spawn('ffmpeg',['-v','error',...args]);let error='';p.stdout.on('data',b=>chunks.push(b));p.stderr.on('data',b=>error+=b);p.on('error',reject);p.on('close',c=>c===0?resolve():reject(Error(error)));p.stdin.end(input);});return Buffer.concat(chunks);}
const base=await ffmpeg(['-i',path.join(root,'scene-v30-current.png'),'-pix_fmt','rgba','-f','rawvideo','pipe:1']);
const edit=await ffmpeg(['-i',path.join(root,'head-edit-v31.png'),'-pix_fmt','rgba','-f','rawvideo','pipe:1']);
const smooth=x=>{x=Math.max(0,Math.min(1,x));return x*x*(3-2*x);};
for(let y=280;y<890;y++)for(let x=225;x<1015;x++){
 const alpha=smooth((1-Math.hypot((x-620)/390,(y-590)/310))/.1)*(1-smooth((575-x)/12)*smooth((y-785)/12))*(1-smooth((x-765)/15)*smooth((y-822)/18));
 if(!alpha)continue;const i=(y*1316+x)*4;
 for(let c=0;c<3;c++)base[i+c]=Math.round(base[i+c]*(1-alpha)+edit[i+c]*alpha);
}
await ffmpeg(['-y','-f','rawvideo','-pix_fmt','rgba','-s','1316x1195','-i','pipe:0','-frames:v','1',path.join(root,'scene-v31-current.png')],base);
console.log('Composed the integrated facial expression, retaining original head silhouette, hand and room.');
