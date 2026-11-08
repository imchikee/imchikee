import {spawn} from 'node:child_process';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.dirname(fileURLToPath(import.meta.url)),width=1316,height=1195;
async function ffmpeg(args,input){const chunks=[];await new Promise((resolve,reject)=>{
 const p=spawn('ffmpeg',['-v','error',...args]);let error='';p.stdout.on('data',b=>chunks.push(b));p.stderr.on('data',b=>error+=b);
 p.on('error',reject);p.on('close',code=>code===0?resolve():reject(Error(error)));p.stdin.end(input);
});return Buffer.concat(chunks);}
const original=await ffmpeg(['-i',path.join(root,'scene-v12-character.png'),'-pix_fmt','rgba','-f','rawvideo','pipe:1']);
const result=Buffer.from(original);
// Separate existing brown handwriting from the pale page. Paper is filled
// from unmarked neighbours on the same ruled row; no page geometry is moved.
for(const r of [{x:470,y:892,w:212,h:94},{x:746,y:878,w:230,h:91}]){
 const mask=new Uint8Array(r.w*r.h),core=new Uint8Array(mask.length),bg=Buffer.alloc(mask.length*3),ink=new Float32Array(mask.length*4);
 for(let y=0;y<r.h;y++)for(let x=0;x<r.w;x++){
  const n=((r.y+y)*width+r.x+x)*4;
  // Exclude the spiral, page edge, and paw shadow from the right-page ink.
  const px=r.x+x,py=r.y+y;
  if(r.x===470&&px<580&&py<901)continue; // Keep the nib out of the ink layer.
  if(r.x===470&&!((px>=475&&px<650&&py<926)||(px>=510&&px<680&&py>=918&&py<963)||(px>=530&&px<565&&py>=960&&py<983)))continue;
  if(r.x===746&&!((px>=745&&px<820&&py>=880&&py<903)||(px>=770&&px<945&&py>=907&&py<969)))continue;
  if(original[n]<222&&original[n+1]<198&&original[n+2]<170)core[y*r.w+x]=1;
 }
 for(let y=0;y<r.h;y++)for(let x=0;x<r.w;x++)if(core[y*r.w+x]){
  for(let yy=Math.max(0,y-2);yy<=Math.min(r.h-1,y+2);yy++)for(let xx=Math.max(0,x-2);xx<=Math.min(r.w-1,x+2);xx++)mask[yy*r.w+xx]=1;
 }
 for(let y=0;y<r.h;y++)for(let x=0;x<r.w;x++){
  const j=y*r.w+x,n=((r.y+y)*width+r.x+x)*4;
  if(!mask[j]){for(let c=0;c<3;c++)bg[j*3+c]=original[n+c];continue;}
  let l=x-1,rr=x+1;while(l>=0&&mask[y*r.w+l])l--;while(rr<r.w&&mask[y*r.w+rr])rr++;
  const a=((r.y+y)*width+r.x+l)*4,b=((r.y+y)*width+r.x+rr)*4,t=(x-l)/(rr-l);
  for(let c=0;c<3;c++){const v=Math.round(original[a+c]*(1-t)+original[b+c]*t);bg[j*3+c]=v;result[n+c]=v;}
  const dark=[70,45,25];let alpha=0;
  for(let c=0;c<3;c++)alpha=Math.max(alpha,(bg[j*3+c]-original[n+c])/Math.max(1,bg[j*3+c]-dark[c]));
  alpha=Math.max(0,Math.min(1,alpha));ink[j*4+3]=alpha;
  if(alpha>.001)for(let c=0;c<3;c++)ink[j*4+c]=Math.max(0,Math.min(255,(original[n+c]-(1-alpha)*bg[j*3+c])/alpha));
 }
 // Exact 180-degree ink-layer rotation, not a mirror and not a page rotation.
 for(let y=0;y<r.h;y++)for(let x=0;x<r.w;x++){
  const j=((r.h-1-y)*r.w+r.w-1-x)*4,alpha=ink[j+3];if(alpha<=.001)continue;
  const n=((r.y+y)*width+r.x+x)*4;
  for(let c=0;c<3;c++)result[n+c]=Math.round(result[n+c]*(1-alpha)+ink[j+c]*alpha);
 }
}
await ffmpeg(['-y','-f','rawvideo','-pix_fmt','rgba','-s',width+'x'+height,'-i','pipe:0','-frames:v','1','-c:v','png',path.join(root,'scene-v13-writing-direction.png')],result);
console.log('Rotated the two notebook ink layers toward the hamster.');
