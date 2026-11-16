// A single 3.2-second study beat. No writing, camera, lighting or limb motion.
(()=>{
const canvas=document.getElementById('stage'),ctx=canvas.getContext('2d');
const scene=new Image(),closed=new Image();scene.src='scene-final.png';closed.src='eyes-closed-matched.png';
const duration=3.2,seek=document.getElementById('seek'),play=document.getElementById('play');
let ready=false,playing=false,elapsed=0,last=null,closedMaterial;
const smooth=v=>{v=Math.max(0,Math.min(1,v));return v*v*(3-2*v);};
function closure(t){if(t<1.47||t>=1.77)return 0;if(t<1.57)return smooth((t-1.47)/.10);if(t<=1.61)return 1;return 1-smooth((t-1.61)/.16);}
// Eye coordinates are local to the 300x150 reference crop at scene (535,630).
// The eye image itself is never scaled/squashed during blinking; only the
// aperture through which the original stationary eyeball is visible changes.
const eyes=[{x:70,y:74,rx:44,ry:41,angle:.13,drop:12},{x:226,y:97,rx:40,ry:34,angle:-.40,drop:10}];
// Match the opening to the actually painted closed lash, rather than an
// unrelated translated ellipse. The original eyeball texture stays stationary.
const lashLines=[[[26,65],[36,69],[42,76],[48,78],[54,82],[60,85],[66,87],[72,87],[78,87],[84,87],[90,87],[96,88],[104,84],[114,74]],[[186,94],[194,92],[200,103],[206,102],[212,104],[218,105],[224,107],[230,106],[236,107],[242,105],[248,103],[254,99],[260,95],[266,90]]];
function lashY(line,x){let j=1;while(j<line.length-1&&x>line[j][0])j++;const [a,b]=[line[j-1],line[j]],u=Math.max(0,Math.min(1,(x-a[0])/(b[0]-a[0])));return a[1]+(b[1]-a[1])*u;}
function aperture(path,e,line,amount){const c=Math.cos(e.angle),s=Math.sin(e.angle),A=s*s/e.rx**2+c*c/e.ry**2,extent=Math.sqrt(e.rx**2*c*c+e.ry**2*s*s),top=[],bottom=[];for(let j=0;j<=160;j++){const X=e.x-extent+2*extent*j/160,dx=X-e.x,B=2*dx*c*s*(1/e.rx**2-1/e.ry**2),C=dx*dx*(c*c/e.rx**2+s*s/e.ry**2)-1,disc=Math.max(0,B*B-4*A*C);const y1=e.y+(-B-Math.sqrt(disc))/(2*A),y2=e.y+(-B+Math.sqrt(disc))/(2*A),closed=lashY(line,X);top.push([X,y1*(1-amount)+closed*amount]);bottom.push([X,y2*(1-amount)+closed*amount]);}top.concat(bottom.reverse()).forEach(([x,y],i)=>path[i?'lineTo':'moveTo'](x,y));path.closePath();}

function draw(t){if(!ready)return;elapsed=Math.max(0,Math.min(duration,t));ctx.clearRect(0,0,1316,1195);ctx.drawImage(scene,0,0);const amount=closure(elapsed);if(amount>0){ctx.save();ctx.translate(535,630);for(const [i,e] of eyes.entries()){const path=new Path2D();path.ellipse(e.x,e.y,e.rx,e.ry,e.angle,0,Math.PI*2);path.closePath();if(amount<.999999)aperture(path,e,lashLines[i],amount);ctx.save();ctx.clip(path,'evenodd');ctx.drawImage(closedMaterial,0,0);ctx.restore();}ctx.restore();}
seek.value=elapsed;document.getElementById('time').textContent=elapsed.toFixed(2)+' s';play.textContent=playing?'暂停':elapsed>=duration?'重播':'播放';}
function setPlaying(value){if(value&&elapsed>=duration)elapsed=0;playing=value;last=null;draw(elapsed);}
function tick(now){if(playing&&ready){if(last!==null)elapsed=Math.min(duration,elapsed+(now-last)/1000);if(elapsed>=duration)playing=false;draw(elapsed);}last=now;requestAnimationFrame(tick);}
play.onclick=()=>setPlaying(!playing);document.getElementById('replay').onclick=()=>{elapsed=0;setPlaying(true);};seek.oninput=()=>{playing=false;last=null;draw(Number(seek.value));};document.addEventListener('visibilitychange',()=>{last=null;});
const readyPromise=Promise.all([scene.decode(),closed.decode()]).then(()=>{if(scene.naturalWidth!==1316||scene.naturalHeight!==1195)throw Error('Reference registration mismatch');if(Math.abs(closed.naturalWidth/closed.naturalHeight-2)>0.01)throw Error('Eyelid crop aspect mismatch');closedMaterial=closed;ready=true;draw(0);requestAnimationFrame(tick);}).catch(e=>{document.getElementById('error').textContent='素材加载失败：'+e.message;throw e;});
window.moreCpp={draw,closure,setPlaying,readyPromise,canvas,duration,get time(){return elapsed},get playing(){return playing},eyeRegions:eyes};
})();
