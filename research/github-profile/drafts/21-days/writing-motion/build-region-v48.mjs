import './compose-anatomy-v48.mjs';
import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=path.dirname(fileURLToPath(import.meta.url));
await new Promise((resolve,reject)=>{const p=spawn('ffmpeg',['-v','error','-y','-i',path.join(root,'clean-anatomy-edit-v48.png'),'-vf','scale=340:240','-frames:v','1',path.join(root,'clean-patch-v48.png')]);p.on('error',reject);p.on('close',c=>c===0?resolve():reject(Error('Clean patch resize failed')));});
console.log('Prepared the local hand repair; the complete room remains the master image.');

await import('./refine-clean-v48.mjs');
