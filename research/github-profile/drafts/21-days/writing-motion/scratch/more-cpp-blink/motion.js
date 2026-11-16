// A single 3.2-second study beat. No writing, camera, lighting or limb motion.
(()=>{
const canvas=document.getElementById('stage'),ctx=canvas.getContext('2d');
const scene=new Image(),closed=new Image();scene.src='scene.png';closed.src='eyes-closed-matched.png';
const duration=3.2,seek=document.getElementById('seek'),play=document.getElementById('play');
let ready=false,playing=false,elapsed=0,last=null,closedMaterial;
const smooth=v=>{v=Math.max(0,Math.min(1,v));return v*v*(3-2*v);};
function closure(t){if(t<1.47||t>=1.77)return 0;if(t<1.57)return smooth((t-1.47)/.10);if(t<=1.61)return 1;return 1-smooth((t-1.61)/.16);}
// Eye coordinates are local to the 300x150 reference crop at scene (535,630).
// The eye image itself is never scaled/squashed during blinking; only the
// aperture through which the original stationary eyeball is visible changes.
const eyes=[{x:70,y:74,rx:44,ry:41,angle:.13,drop:12},{x:226,y:97,rx:40,ry:34,angle:-.40,drop:10}];
function ellipse(path,e,amount=0){path.ellipse(e.x,e.y+e.drop*amount,e.rx,e.ry*Math.max(.0001,1-amount),e.angle,0,Math.PI*2);}
function draw(t){if(!ready)return;elapsed=Math.max(0,Math.min(duration,t));ctx.clearRect(0,0,1316,1195);ctx.drawImage(scene,0,0);const amount=closure(elapsed);if(amount>0){ctx.save();ctx.translate(535,630);for(const e of eyes){const path=new Path2D();ellipse(path,e);ellipse(path,e,amount);ctx.save();ctx.clip(path,'evenodd');ctx.drawImage(closedMaterial,0,0);ctx.restore();}ctx.restore();}
seek.value=elapsed;document.getElementById('time').textContent=elapsed.toFixed(2)+' s';play.textContent=playing?'暂停':elapsed>=duration?'重播':'播放';}
function setPlaying(value){if(value&&elapsed>=duration)elapsed=0;playing=value;last=null;draw(elapsed);}
function tick(now){if(playing&&ready){if(last!==null)elapsed=Math.min(duration,elapsed+(now-last)/1000);if(elapsed>=duration)playing=false;draw(elapsed);}last=now;requestAnimationFrame(tick);}
play.onclick=()=>setPlaying(!playing);document.getElementById('replay').onclick=()=>{elapsed=0;setPlaying(true);};seek.oninput=()=>{playing=false;last=null;draw(Number(seek.value));};document.addEventListener('visibilitychange',()=>{last=null;});
const readyPromise=Promise.all([scene.decode(),closed.decode()]).then(()=>{if(scene.naturalWidth!==1316||scene.naturalHeight!==1195)throw Error('Reference registration mismatch');if(Math.abs(closed.naturalWidth/closed.naturalHeight-2)>0.01)throw Error('Eyelid crop aspect mismatch');closedMaterial=closed;ready=true;draw(0);requestAnimationFrame(tick);}).catch(e=>{document.getElementById('error').textContent='素材加载失败：'+e.message;throw e;});
window.moreCpp={draw,closure,setPlaying,readyPromise,canvas,duration,get time(){return elapsed},get playing(){return playing},eyeRegions:eyes};
})();
