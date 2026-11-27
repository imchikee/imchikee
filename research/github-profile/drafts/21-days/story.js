'use strict';

// Chapters 1–3 have character motion; chapters 4–9 remain storyboard views.
const chapters = [
  {box:[14,93,396,327],title:'Days 1–10: The basics.',duration:3.2},
  {box:[430,93,392,327],title:'Days 11–21: More C++.',duration:3.2},
  {box:[842,93,396,327],title:'Days 22–697: Build things.',duration:3.9},
  {box:[21,446,384,350],title:'Days 698–3648: Learn together.',duration:4.2},
  {box:[17,2,934,841],aged:true,title:'Days 3649–7781: Study physics.',duration:4.5},
  {box:[965,3,893,839],aged:true,title:'Days 7782–14611: Study biology.',duration:4.5},
  {box:[20,827,386,372],title:'Day 14611: Reverse aging.',duration:4.6},
  {box:[435,827,382,372],title:'Day 14611 to day 21: Go back.',duration:5},
  {box:[846,827,386,372],title:'Day 21: Take your own place.',duration:6.8},
];
const starts=[];
let duration=0;
chapters.forEach(chapter=>{starts.push(duration);duration+=chapter.duration;});
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const art=document.getElementById('story-art');
const sheetArt=document.getElementById('story-sheet');
const agedArt=document.getElementById('story-aged');
const readingCanvas=document.getElementById('reading-stage');
const reading=createReadingShot(readingCanvas,'reading-motion/');
let readingReady=false,readingFailed=false;
const writing=createSecondActV3Shot(readingCanvas,'second-act-v3/');
let writingReady=false,writingFailed=false;
const building=createBuildingShot(readingCanvas,'building-motion/');
let buildingReady=false,buildingFailed=false;
const status=document.getElementById('story-status');
const play=document.getElementById('story-play');
const seek=document.getElementById('story-seek');
seek.max=duration;
let elapsed=0,playing=!reduced.matches,last=null,shown=-1;
function current(){let i=0;while(i<8&&elapsed>=starts[i+1])i++;return i;}
function render(){
  const i=current();
  if(i!==shown){
    const chapter=chapters[i];
    shown=i;art.setAttribute('viewBox',chapter.box.join(' '));
    sheetArt.setAttribute('display',chapter.aged?'none':'inline');
    agedArt.setAttribute('display',chapter.aged?'inline':'none');
    document.getElementById('story-title').textContent=chapter.title;
    document.getElementById('story-position').textContent=`${i+1} / 9`;
    readingCanvas.setAttribute('aria-label',i===1?'Hamster blinking while taking C++ notes':'Hamster reading C++');
  }
  const motion=(i===0&&readingReady)||(i===1&&writingReady)||(i===2&&buildingReady);
  readingCanvas.hidden=!motion;art.hidden=motion;
  if(motion)(i===0?reading:i===1?writing:building).draw(elapsed-starts[i]);
  status.textContent=i===0?(readingFailed?'第1幕：动作加载失败，显示分镜':readingReady?'第1幕：阅读动作 · 第4—9幕仍为分镜':'正在加载第1幕动作…'):i===1?(writingFailed?'第2幕：动作加载失败，显示分镜':writingReady?'第2幕：V3 眨眼 · 第4—9幕仍为分镜':'正在加载第2幕动作…'):i===2?(buildingFailed?'第3幕：动作加载失败，显示分镜':buildingReady?'第3幕：编码与轻触动作 · 第4—9幕仍为分镜':'正在加载第3幕动作…'):'第'+(i+1)+'幕：分镜占位 · 动作待制作';
  seek.value=elapsed;
  play.textContent=playing?'Pause':elapsed>=duration?'Replay':'Play';
}
play.addEventListener('click',()=>{if(elapsed>=duration)elapsed=0;playing=!playing;last=null;render();});
document.getElementById('story-replay').addEventListener('click',()=>{elapsed=0;playing=true;last=null;render();});
seek.addEventListener('input',()=>{elapsed=Number(seek.value);playing=false;last=null;render();});
document.addEventListener('visibilitychange',()=>{last=null;});
reduced.addEventListener('change',()=>{if(reduced.matches){playing=false;last=null;render();}});
reading.ready.then(()=>{readingReady=true;render();}).catch(()=>{readingFailed=true;render();});
writing.ready.then(()=>{writingReady=true;render();}).catch(()=>{writingFailed=true;render();});
building.ready.then(()=>{buildingReady=true;render();}).catch(()=>{buildingFailed=true;render();});
render();
requestAnimationFrame(function tick(now){
  if(playing&&!document.hidden&&!(current()===0&&!readingReady&&!readingFailed)&&!(current()===1&&!writingReady&&!writingFailed)&&!(current()===2&&!buildingReady&&!buildingFailed)){
    if(last!==null)elapsed=Math.min(duration,elapsed+(now-last)/1000);
    if(elapsed>=duration)playing=false;
    render();
  }
  last=now;requestAnimationFrame(tick);
});
