import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=path.dirname(fileURLToPath(import.meta.url));
async function ffmpeg(args,input){const chunks=[];await new Promise((resolve,reject)=>{const p=spawn('ffmpeg',['-v','error',...args]);let error='';p.stdout.on('data',b=>chunks.push(b));p.stderr.on('data',b=>error+=b);p.on('error',reject);p.on('close',c=>c===0?resolve():reject(Error(error)));p.stdin.end(input);});return Buffer.concat(chunks);}
const base=await ffmpeg(['-i',path.join(root,'scene-v37-current.png'),'-pix_fmt','rgba','-f','rawvideo','pipe:1']);
const head=await ffmpeg(['-i',path.join(root,'head-edit-v37.png'),'-pix_fmt','rgba','-f','rawvideo','pipe:1']);
const eye=await ffmpeg(['-i',path.join(root,'eye-edit-v38.png'),'-vf','scale=160:150','-pix_fmt','rgba','-f','rawvideo','pipe:1']);
const smooth=x=>{x=Math.max(0,Math.min(1,x));return x*x*(3-2*x);};
// Replace both old and new edge positions, with the transition away from the fur boundary.
const edge=[[535,390],[580,335],[620,302],[660,279],[700,270],[740,283],[780,315],[815,365],[840,425]];
for(let y=535;y<850;y++){
 let k=0;while(k<edge.length-2&&y>edge[k+1][0])k++;
 const [ay,ax]=edge[k],[by,bx]=edge[k+1],t=Math.max(0,Math.min(1,(y-ay)/(by-ay))),cx=ax+(bx-ax)*t;
 for(let x=205;x<490;x++){
  const a=smooth((65-Math.abs(x-cx))/18)*smooth((y-535)/15)*smooth((850-y)/15);if(!a)continue;
  const i=(y*1316+x)*4;for(let c=0;c<3;c++)base[i+c]=Math.round(base[i+c]*(1-a)+head[i+c]*a);
 }
}
for(let y=605;y<755;y++)for(let x=475;x<635;x++){
 const a=smooth((1-Math.hypot((x-548)/57,(y-684)/53))/.18);if(!a)continue;
 const i=(y*1316+x)*4,j=((y-605)*160+x-475)*4;
 for(let c=0;c<3;c++)base[i+c]=Math.round(base[i+c]*(1-a)+eye[j+c]*a);
}
await ffmpeg(['-y','-f','rawvideo','-pix_fmt','rgba','-s','1316x1195','-i','pipe:0','-frames:v','1',path.join(root,'scene-v38-current.png')],base);
console.log('Refined only the left eye edge and replaced the doubled cheek rim from the same pose source.');
