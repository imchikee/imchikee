import {spawn} from 'node:child_process';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.dirname(fileURLToPath(import.meta.url));
async function ff(args,input){const chunks=[];await new Promise((resolve,reject)=>{const p=spawn('ffmpeg',['-v','error',...args]);let err='';p.stdout.on('data',d=>chunks.push(d));p.stderr.on('data',d=>err+=d);p.on('close',k=>k?reject(Error(err)):resolve());p.stdin.end(input);});return Buffer.concat(chunks);}
const base=await ff(['-i',path.join(root,'clean-patch-v42.png'),'-pix_fmt','rgba','-f','rawvideo','pipe:1']);
const curve=await ff(['-i',path.join(root,'clean-foreleg-edit-v43.png'),'-vf','scale=400:300,crop=340:240:35:40','-pix_fmt','rgba','-f','rawvideo','pipe:1']);
const torso=await ff(['-i',path.join(root,'clean-roll-edit-v47-check.png'),'-vf','scale=340:240','-pix_fmt','rgba','-f','rawvideo','pipe:1']);
const smooth=t=>{t=Math.min(1,Math.max(0,t));return t*t*(3-2*t);};
// Use only the curved underside of the existing generated clean plate; preserve paper and body-side anchor.
for(let y=815;y<885;y++)for(let x=350;x<580;x++){
 const a=smooth(Math.min((x-350)/20,(580-x)/20,(y-815)/12,(885-y)/10));
 const i=((y-770)*340+x-315)*4;
 for(let c=0;c<3;c++)base[i+c]=Math.round(base[i+c]*(1-a)+curve[i+c]*a);
}
// The new generation's torso fur is usable here; its long lower column is excluded.
// This joins the cheek-side torso without reintroducing the old forearm carried by the shoulder cover.
for(let y=820;y<885;y++)for(let x=340;x<395;x++){
 const a=smooth((1-Math.hypot((x-362)/30,(y-845)/35))/.25)*smooth((y-820)/8)*smooth((885-y)/8);
 const i=((y-770)*340+x-315)*4,j=((y-770)*340+x-20-315)*4;
 if(j<0||!a)continue;
 for(let c=0;c<3;c++)base[i+c]=Math.round(base[i+c]*(1-a)+torso[j+c]*a);
}
await ff(['-y','-f','rawvideo','-pix_fmt','rgba','-s','340x240','-i','pipe:0','-frames:v','1',path.join(root,'clean-patch-v47.png')],base);
console.log('Replaced the under-cheek ledge with a curved contour; notebook geometry stays on clean42.');
