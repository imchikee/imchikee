import './compose-notebook.mjs';
import {spawn} from 'node:child_process';
import {writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=path.dirname(fileURLToPath(import.meta.url));
const chunks=[];
await new Promise((resolve,reject)=>{
 const child=spawn('ffmpeg',['-v','error','-i',path.join(root,'scene-v14-live-writing.png'),'-vf','crop=270:266:390:700','-pix_fmt','rgba','-f','rawvideo','pipe:1']);
 child.stdout.on('data',chunk=>chunks.push(chunk));let error='';child.stderr.on('data',chunk=>error+=chunk);
 child.on('error',reject);child.on('close',code=>code===0?resolve():reject(Error(error)));
});
const bytes=Buffer.concat(chunks);if(bytes.length!==270*266*4)throw Error('Unexpected source region dimensions');
await writeFile(path.join(root,'region-data.js'),'// Original RGBA samples: scene-v14-live-writing.png, crop 270x266+390+700.\nwindow.writingRegionRGBA='+JSON.stringify(bytes.toString('base64'))+';\n');
console.log('Built original writing region for local-file playback.');
