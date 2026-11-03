'use strict';

const stages = [
  {title:'入门',short:'入门',day:'DAYS 1–10',action:'The basics.',from:1,to:10,duration:3.2,caption:'先照着入门书，学完最初十天。'},
  {title:'第21天还在学',short:'继续学',day:'DAYS 11–21',action:'More C++.',from:11,to:21,duration:3.2,caption:'21天到了，书越看越多。'},
  {title:'开始做项目',short:'做项目',day:'DAYS 22–697',action:'Build things.',from:22,to:697,duration:3.9,caption:'动手编程、做项目，从自己的错误中学习。'},
  {title:'与其他程序员共同工作',short:'一起学',day:'DAYS 698–3648',action:'Learn together.',from:698,to:3648,duration:4.2,caption:'与其他程序员协作，继续实践和学习。一晃已经十年。'},
  {title:'开始研究理论物理',short:'学物理',day:'DAYS 3649–7781',action:'Study physics.',from:3649,to:7781,duration:4.5,caption:'接下来……研究高等理论物理，弄明白时间旅行。'},
  {title:'然后研究生物学',short:'学生物',day:'DAYS 7782–14611',action:'Study biology.',from:7782,to:14611,duration:4.5,caption:'再研究生物化学、分子生物学与遗传学。仓鼠也老了。'},
  {title:'返老还童',short:'变年轻',day:'DAY 14611',action:'Reverse aging.',from:14611,to:14611,duration:4.6,caption:'用生物学成果制出药剂，先把自己变回年轻时的样子。'},
  {title:'回到第21天',short:'穿越',day:'DAY 14611 → DAY 21',action:'Go back.',from:14611,to:21,duration:5,caption:'再用物理学成果造时间机器，带着多年经验回到第21天。'},
  {title:'替换年轻的自己',short:'第21天',day:'DAY 21',action:'Replace your younger self.',from:21,to:21,duration:6.8,caption:'替换当年的自己。这样，“21天学会C++”就实现了。'},
];
const starts=[];
let duration=0;
stages.forEach(stage=>{starts.push(duration);duration+=stage.duration;});
const $=id=>document.getElementById(id);
const clamp=x=>Math.max(0,Math.min(1,x));
const smooth=x=>{x=clamp(x);return x*x*(3-2*x);};
const mix=(a,b,x)=>a+(b-a)*x;
const visible=(id,on)=>$(id).setAttribute('visibility',on?'visible':'hidden');
const opacity=(id,value)=>$(id).setAttribute('opacity',clamp(value));
const transform=(id,value)=>$(id).setAttribute('transform',value);
const ns='http://www.w3.org/2000/svg';
for(const [id,x,base,count] of [['books-left',230,475,10],['books-right',705,475,11]]){
  for(let i=0;i<count;i++){
    const book=document.createElementNS(ns,'use');
    book.setAttribute('href','#book');book.setAttribute('x',x+(i%3-1)*5);
    book.setAttribute('y',base-i*25-29);book.setAttribute('width','130');book.setAttribute('height','33');
    $(id).append(book);
  }
}
let elapsed=0,playing=false,last=null,shown=-1;
const seek=$('seek');seek.max=duration;
const chapterButtons=stages.map((stage,i)=>{
  const button=document.createElement('button');button.type='button';button.textContent=stage.short;
  button.setAttribute('aria-label',`第${i+1}段：${stage.title}`);
  button.addEventListener('click',()=>jump(i));$('chapters').append(button);return button;
});
function current(){let i=0;while(i<8&&elapsed>=starts[i+1])i++;return i;}
function stack(id,count){
  [...$(id).children].forEach((book,i)=>{
    const grow=smooth((count-i)*1.7);
    book.setAttribute('opacity',grow);
    book.setAttribute('transform',`translate(0 ${18*(1-grow)})`);
  });
}
function render(){
  const i=current(),stage=stages[i],t=elapsed-starts[i],p=clamp(t/stage.duration);
  if(shown!==i){
    shown=i;$('day-label').textContent=stage.day;$('action-label').textContent=stage.action;
    $('heading').lastElementChild.textContent=`${String(i+1).padStart(2,'0')} / 09`;
    $('chapter-title').textContent=stage.title;$('chapter-count').textContent=`${i+1} / 9`;
    $('caption').textContent=stage.caption;$('scene-title').textContent=stage.title;
    chapterButtons.forEach((button,j)=>j===i?button.setAttribute('aria-current','step'):button.removeAttribute('aria-current'));
  }
  seek.value=elapsed;$('position').textContent=`${elapsed.toFixed(1)} / ${duration.toFixed(1)}s`;
  $('play').textContent=playing?'暂停':elapsed>=duration?'重播':'播放';
  const bob=Math.sin(t*3.7)*1.7;
  let x=337,y=215+bob,scale=1,rotation=Math.sin(t*2.8)*.65;
  let age=i<3?0:i===3?.15*p:i===4?mix(.2,.65,p):1;
  if(i===6)age=1-smooth((t-1.8)/1.3);
  if(i>=7)age=0;
  let old=age;
  visible('title-book',i<=1||i===8);
  visible('reading',i<=1||i===4||i===5||i===8);
  visible('computer',i===2||i===3);
  visible('notes',i===2||i===3);
  visible('colleague-left',i===3);visible('colleague-right',i===3);
  visible('physics-board',i===4||i===7);
  visible('bio-board',i===5||i===6);
  visible('lab',i===5||i===6);
  visible('portal-group',i===7||(i===8&&t<2.1));
  visible('traveler',i===8);visible('knife',false);visible('impact',false);visible('ending',false);
  visible('potion',i===6);visible('youth-glow',i===6);
  opacity('flash',0);opacity('portal-group',1);opacity('actor',1);opacity('traveler',1);
  transform('traveler','translate(92 215)');transform('knife','translate(0 0)');
  transform('portal-group',i===8?'translate(-628 0)':'translate(0 0)');
  let left=0,right=0;
  if(i===0)left=.5+p*.7;
  if(i===1){left=2+p*2;right=p*2;}
  if(i===2){left=3+p*2;right=2+p*2;x=312;}
  if(i===3){left=2;right=1.5;}
  if(i===4){left=4+p*3;right=4+p*3;}
  if(i===5){left=6+p*3;right=7+p*3;}
  if(i===6){left=9;right=10;}
  if(i===7){left=7;right=0;}
  stack('books-left',left);stack('books-right',right);
  transform('page',`translate(487 466) scale(${Math.cos(t*3.5)*.45+.55} 1) translate(-487 -466)`);
  transform('colleague-left',`translate(59 ${289+Math.sin(t*3)*2}) rotate(${Math.sin(t*2)*2} 107 210)`);
  transform('colleague-right',`translate(683 ${290+Math.sin(t*3+2)*2}) rotate(${Math.sin(t*2+2)*2} 107 210)`);
  transform('discussion',`translate(0 ${Math.sin(t*3)*3})`);
  $('code').setAttribute('opacity',.7+.3*Math.abs(Math.sin(t*4)));
  $('cursor').setAttribute('opacity',Math.sin(t*10)>0?1:0);
  transform('dna-one',`translate(${Math.sin(t*2)*1.5} 0)`);
  if(i===6){
    const lift=smooth((t-.35)/1.2),lower=smooth((t-2.8)/1);
    transform('potion',`translate(${mix(513,501,lift)+lower*20} ${mix(410,330,lift)+lower*75}) rotate(${-39*lift+lower*39} 30 50) scale(.66)`);
    const glow=smooth((t-1.6)/.55)*(1-smooth((t-3.2)/.8));
    opacity('youth-glow',glow);transform('sparkles',`translate(0 ${-14*smooth((t-1.7)/1.9)})`);
    y-=Math.sin(clamp((t-2.4)/.85)*Math.PI)*13;
    rotation=mix(3,0,smooth((t-1.8)/1.3));
  }
  if(i===7){
    const enter=smooth((t-1.15)/2.1),vanish=smooth((t-3.1)/.55);
    x=mix(337,658,enter);y=mix(215,300,enter)+bob;scale=mix(1,.65,enter);
    opacity('actor',1-vanish);
    transform('dial',`translate(765 370) rotate(${-t*t*160})`);
    opacity('portal-rings',.55+.4*Math.sin(t*10));
    transform('portal-rings',`translate(765 360) scale(${.9+.1*Math.sin(t*6)}) translate(-765 -360)`);
    opacity('flash',smooth((t-3.45)/.3)*(1-smooth((t-4.05)/.8))*.95);
  }
  if(i===8){
    const approach=smooth((t-.2)/1.25),jab=smooth((t-1.8)/.25),withdraw=smooth((t-2.65)/.4);
    const fall=smooth((t-2.25)/.75),replace=smooth((t-3.55)/1.2);
    const fx=mix(20,137,approach)+mix(0,200,replace),fy=215+Math.sin(t*5)*1.2;
    transform('traveler',`translate(${fx} ${fy})`);
    opacity('portal-group',1-smooth((t-.7)/1.1));
    x=337+fall*35;y=215+fall*255;rotation=fall*44;
    old=0;opacity('actor',1-smooth((t-2.65)/.4));
    if(t>=1.2&&t<3.05){
      visible('knife',true);transform('knife',`translate(${fx+205+jab*32-withdraw*36} 392) rotate(-6)`);
      opacity('knife',1-smooth((t-2.65)/.4));
    }
    if(t>=2.02&&t<2.5){visible('impact',true);transform('impact',`translate(447 392) scale(${.6+.4*Math.sin((t-2.02)/.48*Math.PI)})`);}
    visible('ending',t>=5.05);opacity('ending',smooth((t-5.05)/.65));
  }
  opacity('old',old);
  transform('actor',`translate(${x} ${y}) scale(${scale}) rotate(${rotation} 150 280)`);
  let day=Math.round(mix(stage.from,stage.to,p));
  if(i===7)day=Math.round(mix(stage.from,stage.to,smooth((t-.8)/3.5)));
  $('calendar-day').textContent=day;
  $('calendar-day').setAttribute('font-size',day>9999?23:29);
}
function jump(i){elapsed=starts[Math.max(0,Math.min(8,i))];last=null;render();}
$('play').addEventListener('click',()=>{if(elapsed>=duration)elapsed=0;playing=!playing;last=null;render();});
$('restart').addEventListener('click',()=>{elapsed=0;playing=true;last=null;render();});
$('back').addEventListener('click',()=>jump(current()-1));
$('next').addEventListener('click',()=>jump(current()+1));
seek.addEventListener('input',()=>{elapsed=Number(seek.value);playing=false;last=null;render();});
document.addEventListener('visibilitychange',()=>{last=null;});
document.addEventListener('keydown',event=>{
  if(event.target.matches('input,button,a'))return;
  if(event.code==='Space'){event.preventDefault();$('play').click();}
  if(event.code==='ArrowLeft'){event.preventDefault();jump(current()-1);}
  if(event.code==='ArrowRight'){event.preventDefault();jump(current()+1);}
});
const initial=Number(location.hash.slice(1));
if(Number.isInteger(initial)&&initial>=1&&initial<=9)jump(initial-1);
render();
requestAnimationFrame(function tick(now){
  if(playing&&!document.hidden){
    if(last!==null)elapsed=Math.min(duration,elapsed+(now-last)/1000);
    if(elapsed>=duration)playing=false;
    render();
  }
  last=now;requestAnimationFrame(tick);
});
