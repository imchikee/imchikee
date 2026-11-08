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

const original=await rgb('local-paw-edit-v22.png','20:15:545:788');
if(!original.equals(await rgb('hand-start.png','20:15:226:78')))throw Error('Initial paw center differs from source');
console.log('PASS: initial paw center retains source pixels.');
for(const [label,crop] of [['original head/cap/ears','1316:640:0:0'],['original nose/mouth','125:100:620:630'],['original right cheek','140:150:800:575'],['original foreground book','200:100:200:850'],['original resting paw','95:70:826:748']]){
 const baseline=await rgb('scene-v1.png',crop);
 if(!baseline.equals(await rgb('native-finish.png',crop)))throw Error(label+' differs from original');
 console.log('PASS: '+label+' is identical to the ORIGINAL illustration.');
}
for(const [label,crop] of [['fixed cheek','90:20:260:0'],['paper edge','60:20:310:188'],['right book','70:20:305:152']]){
 const baseline=await rgb('hand-start.png',crop);
 for(const name of ['hand-lift.png','hand-writing.png','hand-finish.png'])if(!baseline.equals(await rgb(name,crop)))throw Error(label+' moved in '+name);
 console.log('PASS: '+label+' stays fixed in key frames.');
}
await ffmpeg(['-y','-i',path.join(root,'motion.gif'),'-vf',"select='not(mod(n,8))',scale=400:363,tile=3x4",'-frames:v','1',path.join(root,'whole-animation-v22.png')]);
await ffmpeg(['-y','-i',path.join(root,'native-finish.png'),'-vf','crop=600:170:500:780,hflip,vflip,scale=900:255','-frames:v','1',path.join(root,'writer-view.png')]);
await ffmpeg(['-y','-i',path.join(root,'hand-start.png'),'-i',path.join(root,'hand-finish.png'),'-filter_complex','hstack=inputs=2','-frames:v','1',path.join(root,'ink-comparison.png')]);
await ffmpeg(['-y','-i',path.join(root,'scene-v1.png'),'-i',path.join(root,'native-finish.png'),'-filter_complex','[0:v]scale=534:485[a];[1:v]scale=534:485[b];[a][b]hstack=inputs=2','-frames:v','1',path.join(root,'pose-comparison-v22.png')]);
