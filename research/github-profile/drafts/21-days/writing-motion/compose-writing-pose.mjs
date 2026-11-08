import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=path.dirname(fileURLToPath(import.meta.url));
async function ffmpeg(args,input){const chunks=[];await new Promise((resolve,reject)=>{
 const p=spawn('ffmpeg',['-v','error',...args]);let error='';p.stdout.on('data',b=>chunks.push(b));p.stderr.on('data',b=>error+=b);p.on('error',reject);p.on('close',code=>code===0?resolve():reject(Error(error)));p.stdin.end(input);
});return Buffer.concat(chunks);}
const image=await ffmpeg(['-i',path.join(root,'scene-v24-pose-eye-whites.png'),'-pix_fmt','rgba','-f','rawvideo','pipe:1']);
const eyes=await ffmpeg(['-i',path.join(root,'eye-edit-v24.png'),'-vf','scale=350:190','-pix_fmt','rgba','-f','rawvideo','pipe:1']);
const smooth=x=>{x=Math.max(0,Math.min(1,x));return x*x*(3-2*x);};
for(let y=0;y<190;y++)for(let x=0;x<350;x++){
 const left=Math.hypot((x-83)/49,(y-84)/48),right=Math.hypot((x-240)/53,(y-106)/50);
 const alpha=smooth((1-Math.min(left,right))/.22);if(!alpha)continue;
 const a=((y+630)*1316+x+510)*4,b=(y*350+x)*4;
 for(let c=0;c<3;c++)image[a+c]=Math.round(image[a+c]*(1-alpha)+eyes[b+c]*alpha);
}
await ffmpeg(['-y','-f','rawvideo','-pix_fmt','rgba','-s','1316x1195','-i','pipe:0','-frames:v','1',path.join(root,'scene-v24-writing-pose.png')],image);
console.log('Composed only the two corrected eyes; the writing posture and chapter-2 scene are unchanged.');
