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
const original=await rgb('scene-v20-lifted.png','35:25:475:855');
if(!original.equals(await rgb('hand-start.png','35:25:115:145')))throw Error('Initial hand detail differs from the original scene');
console.log('PASS: initial paw center exactly matches the original scene.');
for(const [label,crop] of [['left page','80:20:65:230'],['existing declaration','150:28:100:212'],['fixed cheek','60:80:200:40'],['upper notebook edge','60:45:230:135'],['notebook binding','60:60:315:180']]){
 const baseline=await rgb('hand-start.png',crop);
 for(const name of ['hand-lift.png','hand-writing.png','hand-finish.png'])if(!baseline.equals(await rgb(name,crop)))throw Error(label+' moved in '+name);
 console.log('PASS: '+label+' pixels remain identical in all four key frames.');
}
await ffmpeg(['-y','-i',path.join(root,'motion.gif'),'-vf',"select='not(mod(n,8))',crop=162:106:146:288,scale=324:212:flags=neighbor,tile=3x4",'-frames:v','1',path.join(root,'sequence.png')]);
await ffmpeg(['-y','-i',path.join(root,'../reading-motion/lighting/down-v2.png'),'-i',path.join(root,'native-finish.png'),'-filter_complex','[0:v]scale=534:485[a];[1:v]scale=534:485[b];[a][b]hstack=inputs=2','-frames:v','1',path.join(root,'character-comparison.png')]);
await ffmpeg(['-y','-i',path.join(root,'native-finish.png'),'-vf','crop=600:160:420:860,hflip,vflip,scale=900:240','-frames:v','1',path.join(root,'writer-view.png')]);
await ffmpeg(['-y','-i',path.join(root,'hand-start.png'),'-i',path.join(root,'hand-finish.png'),'-filter_complex','hstack=inputs=2','-frames:v','1',path.join(root,'ink-comparison.png')]);

await ffmpeg(['-y','-i',path.join(root,'motion.gif'),'-vf',"select='not(mod(n,8))',scale=400:363,tile=3x4",'-frames:v','1',path.join(root,'whole-animation-v20.png')]);
await ffmpeg(['-y','-i',path.join(root,'face-on-table-rejected/native-finish.png'),'-i',path.join(root,'native-finish.png'),'-filter_complex','[0:v]crop=620:190:350:735[a];[1:v]crop=620:190:350:735[b];[a][b]vstack=inputs=2','-frames:v','1',path.join(root,'face-junction-v20.png')]);
for(let page=0;page<4;page++)await ffmpeg(['-y','-i',path.join(root,'motion.gif'),'-vf',`select='between(n,${page*24},${page*24+23})',crop=252:130:142:250,scale=378:195,tile=3x8`,'-frames:v','1',path.join(root,'all-frames-v20-'+(page+1)+'.png')]);

await ffmpeg(['-y','-i',path.join(root,'finish-v19.png'),'-i',path.join(root,'finish.png'),'-filter_complex','hstack=inputs=2','-frames:v','1',path.join(root,'pose-comparison-v20.png')]);
await ffmpeg(['-y','-i',path.join(root,'motion-v19.gif'),'-i',path.join(root,'motion.gif'),'-filter_complex','[0:v]fps=30,setsar=1[a];[1:v]fps=30,setsar=1[b];[a][b]hstack=shortest=1,split[c][d];[c]palettegen=stats_mode=diff[p];[d][p]paletteuse=dither=bayer:bayer_scale=4','-loop','0',path.join(root,'pose-comparison-v20.gif')]);
