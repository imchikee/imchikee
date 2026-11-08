import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=path.dirname(fileURLToPath(import.meta.url));
async function ffmpeg(args,input){const chunks=[];await new Promise((resolve,reject)=>{const p=spawn('ffmpeg',['-v','error',...args]);let error='';p.stdout.on('data',b=>chunks.push(b));p.stderr.on('data',b=>error+=b);p.on('error',reject);p.on('close',c=>c===0?resolve():reject(Error(error)));p.stdin.end(input);});return Buffer.concat(chunks);}
const base=await ffmpeg(['-i',path.join(root,'scene-v34-current.png'),'-pix_fmt','rgba','-f','rawvideo','pipe:1']);
const edit=await ffmpeg(['-i',path.join(root,'eye-edit-v35.png'),'-pix_fmt','rgba','-f','rawvideo','pipe:1']);
const smooth=x=>{x=Math.max(0,Math.min(1,x));return x*x*(3-2*x);};
for(let y=650;y<800;y++)for(let x=475;x<800;x++){
 const alpha=Math.max(smooth((1-Math.hypot((x-548)/70,(y-717)/62))/.16),smooth((1-Math.hypot((x-727)/67,(y-742)/52))/.16));
 if(!alpha)continue;const i=(y*1316+x)*4,j=i;
 for(let c=0;c<3;c++)base[i+c]=Math.round(base[i+c]*(1-alpha)+edit[j+c]*alpha);
}
await ffmpeg(['-y','-f','rawvideo','-pix_fmt','rgba','-s','1316x1195','-i','pipe:0','-frames:v','1',path.join(root,'scene-v35-current.png')],base);
console.log('Composed only the two eyes; downward head pose, mouth, hands and room retain source pixels.');
