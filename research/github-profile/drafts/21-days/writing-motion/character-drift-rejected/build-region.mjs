import {spawn} from 'node:child_process';
import {writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=path.dirname(fileURLToPath(import.meta.url));
async function samples(name){
 const chunks=[];await new Promise((resolve,reject)=>{
  const p=spawn('ffmpeg',['-v','error','-i',path.join(root,name),'-vf','crop=550:266:270:700','-pix_fmt','rgba','-f','rawvideo','pipe:1']);let error='';
  p.stdout.on('data',b=>chunks.push(b));p.stderr.on('data',b=>error+=b);p.on('error',reject);p.on('close',code=>code===0?resolve():reject(Error(error)));
 });const bytes=Buffer.concat(chunks);if(bytes.length!==550*266*4)throw Error('Unexpected writing layer dimensions');return JSON.stringify(bytes.toString('base64'));
}
const original=await samples('scene-v21-compact.png'),clean=await samples('writing-background-v21.png');
await writeFile(path.join(root,'region-data.js'),'// RGBA hand and clean background samples, 550x266+270+700.\nwindow.writingRegionRGBA='+original+';\nwindow.writingCleanRGBA='+clean+';\n');
console.log('Built original hand and fixed clean background samples.');
