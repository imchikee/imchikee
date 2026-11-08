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


const original=await rgb('scene-v49-current.png','14:12:512:880');
if(!original.equals(await rgb('hand-start.png','14:12:212:130')))throw Error('Initial paw center differs from the new writing pose');
console.log('PASS: initial paw center retains source pixels.');
const shoulder=await rgb('hand-start.png','16:12:122:57');
for(const name of ['hand-start.png','hand-lift.png','hand-writing.png','hand-finish.png'])if(!shoulder.equals(await rgb(name,'16:12:122:57')))throw Error('Body-side shoulder anchor drifted in '+name);
console.log('PASS: body-side shoulder anchor stays on the original torso in key frames.');
// Stop the lamp sample at x=300: x=301..309, y=574..584 belongs to the old hamster silhouette.
for(const [label,crop] of [['head/cap/ears','620:300:340:310'],['fixed facial features','200:180:620:640'],['left desk lamp','260:240:70:290'],['lamp right rim','25:60:330:475'],['lamp lower rim','230:55:70:530'],['right C++ mug','250:170:1050:580'],['foreground reference book','220:160:100:950'],['notebook spiral','140:130:660:875'],['resting paw','80:35:795:856']]){
 const master=['head/cap/ears','fixed facial features','resting paw'].includes(label)?'scene-v49-current.png':'scene-v38-current.png';
 const baseline=await rgb(master,crop);
 if(!baseline.equals(await rgb('native-finish.png',crop)))throw Error(label+' differs from the master image outside the hand repair');
 console.log('PASS: '+label+' retains the master image pixels.');
}
for(const [label,crop] of [['existing declaration','110:20:200:200'],['notebook page edge','80:25:200:255'],['spiral','60:100:365:130']]){
 const baseline=await rgb('hand-start.png',crop);
 for(const name of ['hand-lift.png','hand-writing.png','hand-finish.png'])if(!baseline.equals(await rgb(name,crop)))throw Error(label+' moved in '+name);
 console.log('PASS: '+label+' stays fixed in key frames.');
}
await ffmpeg(['-y','-i',path.join(root,'motion.gif'),'-vf',"select='not(mod(n,8))',scale=400:363,tile=3x4",'-frames:v','1',path.join(root,'whole-animation.png')]);
await ffmpeg(['-y','-i',path.join(root,'native-finish.png'),'-vf','crop=650:190:405:850,hflip,vflip,scale=975:285','-frames:v','1',path.join(root,'writer-view.png')]);
await ffmpeg(['-y','-i',path.join(root,'hand-start.png'),'-i',path.join(root,'hand-finish.png'),'-filter_complex','hstack=inputs=2','-frames:v','1',path.join(root,'ink-comparison.png')]);
await ffmpeg(['-y','-i',path.join(root,'../reading-motion/lighting/down-v2.png'),'-i',path.join(root,'native-finish.png'),'-filter_complex','[0:v]scale=534:485[a];[1:v]scale=534:485[b];[a][b]hstack=inputs=2','-frames:v','1',path.join(root,'character-comparison.png')]);
