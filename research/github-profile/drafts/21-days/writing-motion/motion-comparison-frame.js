(() => {
 const ready=writingScene.readyPromise.then(()=>{
  document.querySelector('main').style.display='none';document.body.append(writingScene.canvas);document.body.style.margin='0';document.body.style.overflow='hidden';
  const resize=()=>{const s=innerWidth/330,c=writingScene.canvas;c.style.position='absolute';c.style.width=(1316*s)+'px';c.style.height=(1195*s)+'px';c.style.left=(-350*s)+'px';c.style.top=(-750*s)+'px';c.style.borderRadius='0';};
  resize();addEventListener('resize',resize);parent.postMessage({type:'motion-ready'},'*');
 });
 addEventListener('message',async e=>{
  if(e.source!==parent)return;
  if(e.data?.type==='motion-init'){await ready;parent.postMessage({type:'motion-ready'},'*');}
  if(e.data?.type==='motion-time'&&Number.isFinite(e.data.time)){await ready;sketchMotion.render(e.data.time);}
 });
})();
