import {spawn} from 'node:child_process';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.dirname(fileURLToPath(import.meta.url));
async function ffmpeg(args){
 const chunks=[];await new Promise((resolve,reject)=>{
  const child=spawn('ffmpeg',['-v','error',...args]);let error='';
  child.stdout.on('data',chunk=>chunks.push(chunk));child.stderr.on('data',chunk=>error+=chunk);
  child.on('error',reject);child.on('close',code=>code===0?resolve():reject(Error(error)));
 });return Buffer.concat(chunks);
}
const rgb=(name,crop)=>ffmpeg(['-i',path.join(root,name),...(crop?['-vf','crop='+crop]:[]),'-pix_fmt','rgb24','-f','rawvideo','pipe:1']);
const original=await rgb('scene-v16-writing-line.png','60:35:465:830');
if(!original.equals(await rgb('hand-start.png','60:35:105:120')))throw Error('Initial hand detail differs from the original scene');
console.log('PASS: initial paw center exactly matches the original scene.');
for(const [label,crop] of [['left page','80:20:65:230'],['code rows','160:40:120:200'],['fixed cheek','60:80:200:40'],['upper notebook edge','60:45:230:135'],['notebook binding','60:60:315:180']]){
 const baseline=await rgb('hand-start.png',crop);
 for(const name of ['hand-lift.png','hand-writing.png','hand-finish.png'])if(!baseline.equals(await rgb(name,crop)))throw Error(label+' moved in '+name);
 console.log('PASS: '+label+' pixels remain identical in all four key frames.');
}
await ffmpeg(['-y','-i',path.join(root,'motion.gif'),'-vf',"select='not(mod(n,8))',crop=162:106:146:288,scale=324:212:flags=neighbor,tile=3x4",'-frames:v','1',path.join(root,'sequence.png')]);
await ffmpeg(['-y','-i',path.join(root,'../reading-motion/lighting/down-v2.png'),'-i',path.join(root,'native-finish.png'),'-filter_complex','[0:v]scale=534:485[a];[1:v]scale=534:485[b];[a][b]hstack=inputs=2','-frames:v','1',path.join(root,'character-comparison.png')]);
await ffmpeg(['-y','-i',path.join(root,'native-finish.png'),'-vf','crop=600:160:420:860,hflip,vflip,scale=900:240','-frames:v','1',path.join(root,'writer-view.png')]);
await ffmpeg(['-y','-i',path.join(root,'hand-start.png'),'-i',path.join(root,'hand-finish.png'),'-filter_complex','hstack=inputs=2','-frames:v','1',path.join(root,'ink-comparison.png')]);

await ffmpeg(['-y','-i',path.join(root,'motion.gif'),'-vf',"select='not(mod(n,8))',scale=400:363,tile=3x4",'-frames:v','1',path.join(root,'whole-animation-v19.png')]);
await ffmpeg(['-y','-i',path.join(root,'chin-band-rejected/native-finish.png'),'-i',path.join(root,'native-finish.png'),'-filter_complex','[0:v]crop=620:190:350:735[a];[1:v]crop=620:190:350:735[b];[a][b]vstack=inputs=2','-frames:v','1',path.join(root,'face-junction-v19.png')]);
for(let page=0;page<4;page++)await ffmpeg(['-y','-i',path.join(root,'motion.gif'),'-vf',`select='between(n,${page*24},${page*24+23})',crop=252:78:142:298,scale=504:156,tile=3x8`,'-frames:v','1',path.join(root,'all-frames-v19-'+(page+1)+'.png')]);
