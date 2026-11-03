"""Compose generated cutout layers into a timed book-drop scene."""

import base64
from functools import lru_cache
from pathlib import Path
import struct
import subprocess

ASSETS=Path(__file__).resolve().parent/'assets/book-drop'
DURATION=7.2


@lru_cache(maxsize=None)
def layer(name):
    """Read alpha bounds for placement; keep the original PNG unmodified."""
    path=ASSETS/name
    data=path.read_bytes()
    w,h=struct.unpack('>II',data[16:24])
    alpha=subprocess.run(['ffmpeg','-v','error','-i',str(path),'-vf','alphaextract',
                          '-f','rawvideo','-pix_fmt','gray','-'],
                         check=True,stdout=subprocess.PIPE).stdout
    left,top,right,bottom=w,h,0,0
    for y in range(h):
        occupied=[x for x,a in enumerate(alpha[y*w:(y+1)*w]) if a>32]
        if occupied:
            left=min(left,occupied[0]);right=max(right,occupied[-1]+1)
            top=min(top,y);bottom=y+1
    # Keep a few transparent pixels so antialiased contours aren't clipped.
    left=max(0,left-5);top=max(0,top-5)
    right=min(w,right+5);bottom=min(h,bottom+5)
    return w,h,(left,top,right-left,bottom-top),base64.b64encode(data).decode()


def symbol(name,ident):
    w,h,(x,y,bw,bh),data=layer(name)
    return f'''<symbol id="{ident}" viewBox="{x} {y} {bw} {bh}" overflow="visible"><image width="{w}" height="{h}" href="data:image/png;base64,{data}"/></symbol>'''


def animate(attribute,frames,kind=None):
    times=';'.join(f'{time/DURATION:.6f}' for time,value in frames)
    values=';'.join(str(value) for time,value in frames)
    if kind:
        return f'<animateTransform attributeName="transform" type="{kind}" values="{values}" keyTimes="{times}" dur="{DURATION}s" repeatCount="indefinite"/>'
    return f'<animate attributeName="{attribute}" values="{values}" keyTimes="{times}" dur="{DURATION}s" repeatCount="indefinite"/>'


def scene():
    book_w=610
    _,_,(_,_,bw,bh),_=layer('book.png')
    book_h=book_w*bh/bw
    book_final_y=400-book_h
    book_contact_y=212-book_h
    flat_w=500
    _,_,(_,_,fw,fh),_=layer('hamster-squashed.png')
    flat_h=flat_w*fh/fw
    flat_x,flat_y=170,450-flat_h
    thumb_x=flat_x+.865*flat_w
    thumb_y=flat_y
    thumb_w=flat_w*.135+12
    thumb_h=flat_h*.82
    face_x=flat_x+.63*flat_w
    face_y=flat_y+.49*flat_h
    flat_use=f'<use href="#squashed" x="{flat_x}" y="{flat_y}" width="{flat_w}" height="{flat_h}"/>'
    flat_opacity=animate('opacity',[(0,0),(2.02,0),(2.021,1),(6.20,1),(6.54,0),(7.2,0)])
    face_opacity=animate('opacity',[(0,0),(2.08,0),(2.32,1),(6.20,1),(6.54,0),(7.2,0)])
    thumb_opacity=animate('opacity',[(0,0),(2.43,0),(2.67,1),(6.20,1),(6.54,0),(7.2,0)])
    # Every layer has a useful static final pose if an SVG viewer ignores SMIL.
    return f'''
<defs>
{symbol('book.png','book')}
{symbol('hamster-upright.png','upright')}
{symbol('hamster-squashed.png','squashed')}
<clipPath id="stage"><rect width="720" height="480"/></clipPath>
<mask id="without-thumb" maskUnits="userSpaceOnUse" x="0" y="0" width="720" height="480"><rect width="720" height="480" fill="white"/><rect x="{thumb_x}" y="{thumb_y}" width="{thumb_w}" height="{thumb_h}" fill="black"/></mask>
<clipPath id="face"><ellipse cx="{face_x}" cy="{face_y}" rx="133" ry="{flat_h*.55}"/></clipPath>
<clipPath id="thumb"><rect x="{thumb_x}" y="{thumb_y}" width="{thumb_w}" height="{thumb_h}"/></clipPath>
</defs>
<g id="book-drop-stage" clip-path="url(#stage)">
<ellipse cx="420" cy="454" rx="240" ry="10" fill="#738a83" opacity=".13">
{animate('rx',[(0,95),(1.82,95),(1.98,240),(6.3,240),(6.65,95),(7.2,95)])}
</ellipse>
<g id="upright-pose" opacity="0">
{animate('opacity',[(0,1),(2.02,1),(2.021,0),(6.6,0),(6.9,1),(7.2,1)])}
<g transform="translate(420 450)"><g>
{animate('transform',[(0,'1 1'),(1.65,'1 1'),(1.82,'1 .98'),(1.96,'2.25 .30'),(2.08,'2.12 .34'),(6.5,'2.12 .34'),(6.6,'1 1'),(7.2,'1 1')],kind='scale')}
<use href="#upright" x="-100" y="-237" width="200" height="237"/>
</g></g></g>
<g id="flat-body" opacity="1" mask="url(#without-thumb)">{flat_opacity}{flat_use}</g>
<g id="falling-book" transform="translate(0 {book_final_y})">
{animate('transform',[(0,'0 -540'),(1.10,'0 -540'),(1.38,'0 -440'),(1.65,'0 -290'),(1.82,f'0 {book_contact_y}'),(1.96,f'0 {book_final_y}'),(2.04,f'0 {book_final_y-7}'),(2.14,f'0 {book_final_y}'),(6.5,f'0 {book_final_y}'),(6.68,'0 -540'),(7.2,'0 -540')],kind='translate')}
{animate('opacity',[(0,1),(6.16,1),(6.50,0),(7.2,0)])}
<use href="#book" x="80" y="0" width="{book_w}" height="{book_h}"/>
</g>
<g id="impact-lines" opacity="0" stroke="#d4a052" stroke-width="4" stroke-linecap="round" fill="none">
{animate('opacity',[(0,0),(1.90,0),(1.96,1),(2.13,.65),(2.30,0),(7.2,0)])}
<path d="M140 411l-19-15m18 39-27 2m569-25 19-17m-18 40 25 1"/>
</g>
<g id="face-peeking" opacity="1" mask="url(#without-thumb)">
{face_opacity}
<g>{animate('transform',[(0,'0 0'),(2.08,'0 11'),(2.32,'0 0'),(7.2,'0 0')],kind='translate')}
<g clip-path="url(#face)">{flat_use}</g></g>
</g>
<g id="thumb-reveal" opacity="1">
{thumb_opacity}
<g>{animate('transform',[(0,'0 0'),(2.43,'0 13'),(2.67,'0 -3'),(2.85,'0 0'),(7.2,'0 0')],kind='translate')}
<g clip-path="url(#thumb)">{flat_use}</g></g>
</g>
</g>'''


def standalone():
    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="720" height="480" viewBox="0 0 720 480" role="img" aria-labelledby="title desc"><title id="title">Still learning — the C++ book drop</title><desc id="desc">A surprised hamster looks up. A C++ book falls, squashes its body, and the hamster peeks out with a strained smile and gives a thumbs-up.</desc><style>svg{{background:#fff}}@media(prefers-color-scheme:dark){{svg{{background:#0d1117}}}}</style>{scene()}</svg>'''


def preview_page():
    return f'''<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>书落下 · 动画预览</title><style>
*{{box-sizing:border-box}}body{{margin:0;background:#f5f7f6;color:#1f3935;font:15px/1.6 system-ui,sans-serif}}main{{max-width:940px;margin:30px auto;padding:24px;background:white;border:1px solid #dbe5e0;border-radius:10px}}h1{{font-size:23px;margin:0 0 8px}}p{{margin:0 0 12px}}svg{{display:block;width:100%;max-width:720px;height:auto;margin:auto}}.controls{{display:flex;gap:12px;align-items:center;flex-wrap:wrap;margin:20px 0 10px}}button{{font:inherit;border:1px solid #97afa3;border-radius:5px;background:white;padding:6px 14px;color:#204d40;cursor:pointer}}input{{flex:1;min-width:120px}}a{{color:#267866;margin-right:18px}}#phase{{min-width:130px}}@media(prefers-color-scheme:dark){{body{{background:#0d1117;color:#e6edf3}}main{{background:#0d1117;border-color:#30363d}}button{{background:#142326;color:#dceee5}}a{{color:#8dcfba}}}}@media(max-width:600px){{main{{margin:12px;padding:15px}}}}
</style></head><body><main><h1>察觉 → 书落下 → 压扁 → 硬撑比赞</h1><p>重新设计了鼓腮、胡须、小鼻子、门牙和眉眼。这里可以暂停、重播或拖动进度，查看表情和动作。</p>{standalone()}<div class="controls"><button id="replay">重播</button><button id="pause">暂停</button><input id="time" type="range" min="0" max="7.19" step=".01" aria-label="动画进度"><span id="phase"></span></div><p><a href="index.html">回到完整主页</a><a href="assets/book-drop/scene-light.gif">打开 GIF</a><a href="assets/book-drop/poster.png">查看落地表情</a></p></main><script>
const svg=document.querySelector('svg'),slider=document.getElementById('time'),label=document.getElementById('phase'),pause=document.getElementById('pause');document.getElementById('replay').onclick=()=>{{svg.setCurrentTime(0);svg.unpauseAnimations();pause.textContent='暂停'}};pause.onclick=()=>{{if(svg.animationsPaused()){{svg.unpauseAnimations();pause.textContent='暂停'}}else{{svg.pauseAnimations();pause.textContent='播放'}}}};slider.oninput=()=>{{svg.pauseAnimations();svg.setCurrentTime(Number(slider.value));pause.textContent='播放'}};function update(){{const t=svg.getCurrentTime()%7.2;slider.value=t;label.textContent=t<1.1?'抬头察觉':t<1.82?'书落下':t<2.14?'压扁与回弹':t<2.43?'愣住、抬头':t<6.2?'硬撑比赞':'循环衔接';requestAnimationFrame(update)}}update();
</script></body></html>'''
