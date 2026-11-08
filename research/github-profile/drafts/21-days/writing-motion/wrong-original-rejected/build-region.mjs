import {spawn} from 'node:child_process';
import {writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=path.dirname(fileURLToPath(import.meta.url));
async function samples(name){
 const chunks=[];await new Promise((resolve,reject)=>{
  const p=spawn('ffmpeg',['-v','error','-i',path.join(root,name),'-vf','crop=800:330:300:630','-pix_fmt','rgba','-f','rawvideo','pipe:1']);let error='';
  p.stdout.on('data',b=>chunks.push(b));p.stderr.on('data',b=>error+=b);p.on('error',reject);p.on('close',code=>code===0?resolve():reject(Error(error)));
 });const bytes=Buffer.concat(chunks);if(bytes.length!==800*330*4)throw Error('Unexpected writing layer dimensions');return JSON.stringify(bytes.toString('base64'));
}
const original=await samples('local-paw-edit-v22.png'),clean=await samples('clean-hand-v1.png'),paper=await samples('local-clean-edit-v22.png'),base=await samples('scene-v1.png');
await writeFile(path.join(root,'region-data.js'),'// RGBA hand and clean background samples, 800x330+300+630.\nwindow.writingRegionRGBA='+original+';\nwindow.writingCleanRGBA='+clean+';\nwindow.writingPaperRGBA='+paper+';\nwindow.writingBaseRGBA='+base+';\n');
console.log('Built original hand and fixed clean background samples.');
