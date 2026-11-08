import './compose-expression.mjs';
import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=path.dirname(fileURLToPath(import.meta.url));
async function ff(args,input){const chunks=[];await new Promise((resolve,reject)=>{const c=spawn('ffmpeg',['-v','error',...args]);let err='';c.stdout.on('data',d=>chunks.push(d));c.stderr.on('data',d=>err+=d);c.on('close',k=>k?reject(Error(err)):resolve());c.stdin.end(input);});return Buffer.concat(chunks);}
const base=await ff(['-i',path.join(root,'scene-v38-current.png'),'-pix_fmt','rgba','-f','rawvideo','pipe:1']);
const patch=await ff(['-i',path.join(root,'short-foreleg-edit-v43.png'),'-vf','scale=400:300','-pix_fmt','rgba','-f','rawvideo','pipe:1']);
const smooth=t=>{t=Math.min(1,Math.max(0,t));return t*t*(3-2*t);};
function lineDistance(x,y,ax,ay,bx,by){const t=Math.min(1,Math.max(0,((x-ax)*(bx-ax)+(y-ay)*(by-ay))/((bx-ax)**2+(by-ay)**2)));return Math.hypot(x-ax-(bx-ax)*t,y-ay-(by-ay)*t);}
for(let y=780;y<951;y++)for(let x=300;x<610;x++){
 const a=Math.max(smooth(Math.min((x-300)/20,(610-x)/10,(y-816)/16,(946-y)/10)),smooth((19-lineDistance(x,y,530,806,586,933))/6));
 if(!a)continue;const i=(y*1316+x)*4,j=((y-730)*400+x-280)*4;
 for(let c=0;c<3;c++)base[i+c]=Math.round(base[i+c]*(1-a)+patch[j+c]*a);
}
await ff(['-y','-f','rawvideo','-pix_fmt','rgba','-s','1316x1195','-i','pipe:0','-frames:v','1',path.join(root,'scene-v43-current.png')],base);
console.log('Composited only the short foreleg and pencil crop; face and room stay on v38.');
