import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..')+'/';
async function pixels(file){const chunks=[];await new Promise((resolve,reject)=>{const p=spawn('ffmpeg',['-v','error','-i',root+file,'-pix_fmt','rgb24','-f','rawvideo','pipe:1']);p.stdout.on('data',b=>chunks.push(b));p.on('close',c=>c===0?resolve():reject(c));});return Buffer.concat(chunks);}
for(const file of ['reading-motion/lighting/down-v2.png','writing-motion/scene-v25-master.png']){
 const b=await pixels(file);const pix=(x,y)=>Array.from(b.subarray((y*1316+x)*3,(y*1316+x)*3+3));
 const comps=(box,test)=>{const [x0,y0,w,h]=box,seen=new Uint8Array(w*h),out=[];for(let y=0;y<h;y++)for(let x=0;x<w;x++){const z=y*w+x;if(seen[z]||!test(...pix(x+x0,y+y0)))continue;seen[z]=1;const q=[z],pts=[];for(let k=0;k<q.length;k++){const p=q[k],xx=p%w,yy=Math.floor(p/w);pts.push([xx+x0,yy+y0]);for(const [dx,dy]of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=xx+dx,ny=yy+dy,nz=ny*w+nx;if(nx>=0&&nx<w&&ny>=0&&ny<h&&!seen[nz]&&test(...pix(nx+x0,ny+y0))){seen[nz]=1;q.push(nz);}}}if(pts.length>30){const xs=pts.map(p=>p[0]),ys=pts.map(p=>p[1]);out.push({n:pts.length,box:[Math.min(...xs),Math.min(...ys),Math.max(...xs),Math.max(...ys)],center:[xs.reduce((a,b)=>a+b)/pts.length,ys.reduce((a,b)=>a+b)/pts.length]});}}return out.sort((a,b)=>b.n-a.n);};
 console.log(file);
 console.log('eyes',comps([540,580,290,170],(r,g,bb)=>r<100&&g<80&&bb<65).slice(0,4));
 console.log('nose',comps([660,640,90,145],(r,g,bb)=>r>190&&g<160&&bb<155&&r-g>70).slice(0,4));
 for(const y of [640,665,690,715,740])console.log('row',y,[225,240,255,270,285,300,315,900,915,930,945,960,975,990].map(x=>[x,pix(x,y)]));
}
