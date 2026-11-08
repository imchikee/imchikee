import {spawn} from 'node:child_process';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.dirname(fileURLToPath(import.meta.url)),width=1316,height=1195;
async function ffmpeg(args,input){
 const chunks=[];await new Promise((resolve,reject)=>{
  const child=spawn('ffmpeg',['-v','error',...args]);let error='';
  child.stdout.on('data',chunk=>chunks.push(chunk));child.stderr.on('data',chunk=>error+=chunk);
  child.on('error',reject);child.on('close',code=>code===0?resolve():reject(Error(error)));
  if(input)child.stdin.end(input);else child.stdin.end();
 });return Buffer.concat(chunks);
}
const rgba=name=>ffmpeg(['-i',path.join(root,name),'-pix_fmt','rgba','-f','rawvideo','pipe:1']);
const [original,edit]=await Promise.all([rgba('scene-v10-settled.png'),rgba('side-clean-v1.png')]);
if(original.length!==width*height*4||edit.length!==original.length)throw Error('Side edit dimensions differ from the original');
const result=Buffer.from(original),smooth=t=>t*t*(3-2*t);
// Only this small fixed region receives imagegen's repair. The moving hand,
// face, rest of the body, paper and room retain the original samples outside it.
for(let y=710;y<860;y++)for(let x=280;x<440;x++){
 const alpha=smooth(Math.max(0,Math.min(1,(x-280)/16,(440-x)/16,(y-710)/16,(860-y)/16)));
 const n=(y*width+x)*4;
 for(let c=0;c<3;c++)result[n+c]=Math.round(original[n+c]*(1-alpha)+edit[n+c]*alpha);
}
await ffmpeg(['-y','-f','rawvideo','-pix_fmt','rgba','-s',width+'x'+height,'-i','pipe:0','-frames:v','1','-c:v','png',path.join(root,'scene-v11-clean-side.png')],result);
console.log('Composed local side repair; original pixels retained outside x280–439 / y710–859.');
