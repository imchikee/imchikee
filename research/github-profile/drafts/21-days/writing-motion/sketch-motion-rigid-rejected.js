// v60 pose motion study: one anchored rotation, no limb scaling or cutout replacement.
const canvas=document.querySelector('#motion'),ctx=canvas.getContext('2d');
const source=new Image();source.src='pose-study-v60.png';
const W=1360,H=1156,root={x:365,y:902},tip={x:734,y:1002},duration=4;
canvas.width=W;canvas.height=H;
let ready=false,playing=false,time=0,last=0;
const smooth=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t)};
function angle(t){
 if(t<.5)return 0;
 if(t<2.7)return -.045*smooth((t-.5)/2.2);
 if(t<3.1)return -.045;
 return -.045*(1-smooth((t-3.1)/.9));
}
function rotate(x,y,a){const c=Math.cos(a),s=Math.sin(a);return {x:root.x+(x-root.x)*c-(y-root.y)*s,y:root.y+(x-root.x)*s+(y-root.y)*c};}
const plate=new Image();plate.src='sketch-cleanplate.png';
const limb=new Path2D('M 338 862 Q 445 866 617 847 L 560 767 Q 548 746 568 734 Q 591 721 605 742 Q 609 752 605 762 L 648 847 Q 714 850 715 897 L 711 918 L 732 978 L 738 1005 L 718 983 L 699 945 Q 680 979 632 979 Q 590 981 560 967 Q 453 977 337 963 Q 323 922 338 862 Z');
const make=()=>{const c=document.createElement('canvas');c.width=W;c.height=H;return c};
const layer=make(),background=make();
function prepare(){
 const l=layer.getContext('2d');l.save();l.clip(limb);l.drawImage(source,0,0);l.restore();
 const mask=make(),m=mask.getContext('2d');m.filter='blur(5px)';m.fill(limb);m.lineWidth=32;m.stroke(limb);m.filter='none';m.globalCompositeOperation='source-in';m.drawImage(plate,0,0);
 const b=background.getContext('2d');b.drawImage(source,0,0);b.drawImage(mask,0,0);
}
function render(t){
 time=Math.max(0,Math.min(duration,t));if(!ready)return;
 ctx.clearRect(0,0,W,H);ctx.drawImage(background,0,0);
 // Whole forelimb, paw and pencil rotate together; the background stays fixed.
 const a=angle(time);
 
 const stop=Math.min(time,2.7);
 if(stop>.5){ctx.beginPath();for(let t=.5;t<=stop+.008;t+=.008){const p=rotate(tip.x,tip.y,angle(Math.min(t,stop)));t===.5?ctx.moveTo(p.x,p.y):ctx.lineTo(p.x,p.y)}ctx.strokeStyle='#70523c';ctx.lineWidth=2;ctx.lineCap='round';ctx.stroke();}
 ctx.save();ctx.translate(root.x,root.y);ctx.rotate(a);ctx.translate(-root.x,-root.y);ctx.drawImage(layer,0,0);ctx.restore();
 document.querySelector('#seek').value=time;document.querySelector('#time').textContent=time.toFixed(2)+' s';
}
function loop(now){if(playing){render(time+(now-last)/1000);if(time>=duration){playing=false;document.querySelector('#play').textContent='播放'}}last=now;requestAnimationFrame(loop)}
Promise.all([source.decode(),plate.decode()]).then(()=>{prepare();ready=true;render(0);requestAnimationFrame(loop)});
document.querySelector('#play').onclick=()=>{if(time>=duration)render(0);playing=!playing;document.querySelector('#play').textContent=playing?'暂停':'播放'};
document.querySelector('#replay').onclick=()=>{render(0);playing=true;document.querySelector('#play').textContent='暂停'};
document.querySelector('#seek').oninput=e=>{playing=false;document.querySelector('#play').textContent='播放';render(+e.target.value)};
window.sketchMotion={render,get ready(){return ready},duration,root,tip,angle,rotate};
