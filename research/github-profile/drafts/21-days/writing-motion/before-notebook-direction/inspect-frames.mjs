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
const original=await rgb('scene-v12-character.png','400:260:360:710');
if(!original.equals(await rgb('hand-start.png')))throw Error('Initial hand detail differs from the original scene');
console.log('PASS: initial hand detail exactly matches the original scene.');
for(const [label,crop] of [['left page','80:30:65:210'],['code rows','160:40:120:200'],['notebook binding','60:60:315:180']]){
 const baseline=await rgb('hand-start.png',crop);
 for(const name of ['hand-lift.png','hand-writing.png','hand-finish.png'])if(!baseline.equals(await rgb(name,crop)))throw Error(label+' moved in '+name);
 console.log('PASS: '+label+' pixels remain identical in all four key frames.');
}
await ffmpeg(['-y','-i',path.join(root,'motion.gif'),'-vf',"select='not(mod(n,8))',crop=162:106:146:288,scale=324:212:flags=neighbor,tile=3x4",'-frames:v','1',path.join(root,'sequence.png')]);
await ffmpeg(['-y','-i',path.join(root,'../reading-motion/lighting/down-v2.png'),'-i',path.join(root,'scene-v12-character.png'),'-filter_complex','[0:v]scale=534:485[a];[1:v]scale=534:485[b];[a][b]hstack=inputs=2','-frames:v','1',path.join(root,'character-comparison.png')]);
