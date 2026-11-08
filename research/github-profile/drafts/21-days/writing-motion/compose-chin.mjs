import {spawn} from 'node:child_process';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.dirname(fileURLToPath(import.meta.url)),width=1316,height=1195;
async function ffmpeg(args,input){
 const chunks=[];await new Promise((resolve,reject)=>{
  const p=spawn('ffmpeg',['-v','error',...args]);let error='';
  p.stdout.on('data',b=>chunks.push(b));p.stderr.on('data',b=>error+=b);
  p.on('error',reject);p.on('close',code=>code===0?resolve():reject(Error(error)));p.stdin.end(input);
 });return Buffer.concat(chunks);
}
const read=name=>ffmpeg(['-i',path.join(root,name),'-pix_fmt','rgba','-f','rawvideo','pipe:1']);
const old=await read('clean-writing-background-v16.png'),edit=await read('chin-contour-edit-v18.png'),out=Buffer.from(old);
const smooth=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);};
for(let y=790;y<896;y++)for(let x=480;x<800;x++){
 // Only the shallow lower-cheek band is taken from the generated edit.
 // The first spiral ring and the resting paw remain outside the insert.
 if(y>=873&&x>=658&&x<736)continue;
 const a=smooth((x-480)/30)*(1-smooth((x-765)/35))*smooth((y-790)/45)*(1-smooth((y-878)/18));
 const j=(y*width+x)*4;for(let c=0;c<3;c++)out[j+c]=Math.round(old[j+c]*(1-a)+edit[j+c]*a);
}
await ffmpeg(['-y','-f','rawvideo','-pix_fmt','rgba','-s',width+'x'+height,'-i','pipe:0','-frames:v','1','-c:v','png',path.join(root,'clean-writing-background-v18.png')],out);
console.log('Composed the narrow rounded chin band; all other source pixels retained.');
