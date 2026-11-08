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
const original=await rgb('scene-v11-clean-side.png','340:240:460:700');
if(!original.equals(await rgb('hand-start.png')))throw Error('Initial hand detail differs from the original scene');
console.log('PASS: initial hand detail exactly matches the original scene.');
const previous=await rgb('scene-v10-settled.png'),current=await rgb('scene-v11-clean-side.png'),stride=1316*3;
for(let y=0;y<1195;y++){
 const row=y*stride;
 const ranges=y<710||y>=860?[[row,row+stride]]:[[row,row+280*3],[row+440*3,row+stride]];
 for(const [start,end] of ranges)if(!previous.subarray(start,end).equals(current.subarray(start,end)))throw Error('Pixels outside the local side repair changed');
}
console.log('PASS: all source pixels outside the small side repair are identical to v10.');
for(const [label,crop] of [['left page','60:25:20:190'],['central rows','70:55:250:140'],['edge below the tip','100:20:120:210']]){
 const baseline=await rgb('hand-start.png',crop);
 for(const name of ['hand-lift.png','hand-writing.png','hand-finish.png'])if(!baseline.equals(await rgb(name,crop)))throw Error(label+' moved in '+name);
 console.log('PASS: '+label+' pixels remain identical in all four key frames.');
}
await ffmpeg(['-y','-i',path.join(root,'motion.gif'),'-vf',"select='not(mod(n,8))',crop=138:98:187:284,scale=276:196:flags=neighbor,tile=3x4",'-frames:v','1',path.join(root,'sequence.png')]);
await ffmpeg(['-y','-i',path.join(root,'scene-v10-settled.png'),'-i',path.join(root,'scene-v11-clean-side.png'),'-filter_complex','[0:v]crop=240:190:260:700,scale=480:380[a];[1:v]crop=240:190:260:700,scale=480:380[b];[a][b]hstack=inputs=2','-frames:v','1',path.join(root,'side-comparison.png')]);
