"""One error, many notes: a continuous local SVG scene with original cutout art."""

from functools import lru_cache
from pathlib import Path

from PIL import Image

ASSETS=Path(__file__).resolve().parent/'assets/scene'
DURATION=7.2
SANS='Arial,DejaVu Sans,sans-serif'


@lru_cache(maxsize=None)
def symbol(filename,ident,crop=False,asset_prefix=''):
    with Image.open(ASSETS/filename) as image:
        w,h=image.size
        # Inspect alpha for SVG placement only; original PNGs remain untouched.
        bounds=image.getchannel('A').point(lambda a:255 if a>32 else 0).getbbox() if crop else (0,0,w,h)
    x,y,r,b=bounds
    return f'<symbol id="{ident}" viewBox="{x} {y} {r-x} {b-y}"><image width="{w}" height="{h}" href="{asset_prefix}{filename}"/></symbol>'


def animate(attribute,frames,kind=None,**attrs):
    times=';'.join(f'{t/DURATION:.6f}' for t,v in frames)
    values=';'.join(str(v) for t,v in frames)
    extra=' '.join(f'{key}="{value}"' for key,value in attrs.items())
    if kind:
        return f'<animateTransform attributeName="transform" type="{kind}" values="{values}" keyTimes="{times}" dur="{DURATION}s" repeatCount="indefinite" {extra}/>'
    return f'<animate attributeName="{attribute}" values="{values}" keyTimes="{times}" dur="{DURATION}s" repeatCount="indefinite" {extra}/>'


def scene(asset_prefix=''):
    flow='M160 258C160 303 256 284 234 326S282 369 320 348Q355 326 380 362T445 402'
    return f'''
<defs>
{symbol('hamster-ready.png','ready',asset_prefix=asset_prefix)}
{symbol('hamster-tired.png','tired',asset_prefix=asset_prefix)}
{symbol('paper-pile.png','paper',True,asset_prefix)}
<clipPath id="stage"><rect width="720" height="480"/></clipPath>
<clipPath id="stream-reveal"><rect x="100" y="252" width="420" height="205">
{animate('height',[(0,0),(.74,0),(.94,35),(1.65,35),(2.18,105),(2.72,205),(7.2,205)])}
</rect></clipPath>
<filter id="ink" x="-3%" y="-3%" width="106%" height="106%"><feTurbulence type="fractalNoise" baseFrequency=".055" numOctaves="2" seed="9" result="grain"/><feDisplacementMap in="SourceGraphic" in2="grain" scale="1.3" xChannelSelector="R" yChannelSelector="G"/></filter>
</defs>
<g id="one-error-stage" clip-path="url(#stage)">
<g>
{animate('opacity',[(0,1),(6.15,1),(6.5,0),(6.8,0),(7.08,1),(7.2,1)])}
<ellipse cx="404" cy="454" rx="275" ry="9" fill="#738a83" opacity=".12"/>
<g id="computer" filter="url(#ink)">
<path d="M38 91Q38 82 49 82H296Q307 82 307 94L300 277Q299 289 287 289H50Q38 289 38 277Z" fill="#23484c" stroke="#634d40" stroke-width="5"/>
<rect x="53" y="103" width="237" height="151" rx="2" fill="#fff8e9" stroke="#8b9c96" stroke-width="2"/>
<path d="M54 138H289" stroke="#bcc8bc" stroke-width="2"/>
<text x="68" y="128" fill="#36645d" font-family="{SANS}" font-size="22" font-weight="700">C++</text>
<g opacity="0">
{animate('opacity',[(0,1),(.58,1),(.7,0),(6.8,0),(7.0,1),(7.2,1)])}
<path d="M72 162H219M72 178H179M72 194H207" stroke="#8ba594" stroke-width="6" stroke-linecap="round"/>
<rect x="91" y="213" width="152" height="25" rx="5" fill="#d9e6d5"/>
<text x="167" y="231" text-anchor="middle" font-family="{SANS}" fill="#315c51" font-size="17">Compile</text>
</g>
<g id="error-count" opacity="1">
{animate('opacity',[(0,0),(.65,0),(.72,1),(6.5,1),(6.8,0),(7.2,0)])}
<text x="171" y="207" text-anchor="middle" fill="#c9503e" font-family="{SANS}" font-size="43" font-weight="700">1 error</text>
</g>
<path d="M137 289L130 320H209L199 289M113 324H230" fill="#315459" stroke="#634d40" stroke-width="4" stroke-linejoin="round"/>
<path d="M58 337H282L294 359H46Z" fill="#d7dfd4" stroke="#78675a" stroke-width="3"/>
<path d="M69 345H271M80 351H280" stroke="#9dac9e" stroke-width="3" stroke-dasharray="13 6"/>
<path d="M116 259H205" stroke="#192c30" stroke-width="8" stroke-linecap="round"/>
</g>
<g id="small-book" transform="translate(328 360) rotate(-9)">
<path d="M3 8H95V82H3Z" fill="#eadfc5" stroke="#8a705b" stroke-width="2"/>
<path d="M0 0H96V73H0Z" fill="#31716c" stroke="#6d5543" stroke-width="3"/>
<path d="M9 0V73" stroke="#ceb170" stroke-width="2"/>
<text x="53" y="32" text-anchor="middle" font-family="{SANS}" font-size="21" font-weight="700" fill="#fff4d9">C++</text>
<text x="53" y="53" text-anchor="middle" font-family="{SANS}" font-size="12" font-weight="700" fill="#fff4d9">BASICS</text>
</g>
<g id="hamster-ready" opacity="0">
{animate('opacity',[(0,1),(2.9,1),(2.901,0),(6.55,0),(6.8,1),(7.2,1)])}
<g>{animate('transform',[(0,'0 0'),(.3,'0 -3'),(.65,'0 0'),(1.1,'0 -2'),(1.6,'0 0'),(2.6,'0 0'),(2.95,'0 5'),(7.2,'0 0')],kind='translate')}
<use href="#ready" x="414" y="186" width="272" height="272"/>
</g></g>
<g id="hamster-tired" opacity="1">
{animate('opacity',[(0,0),(2.72,0),(2.9,1),(6.4,1),(6.6,0),(7.2,0)])}
<g transform="translate(0 -55)">
{animate('transform',[(0,'0 0'),(2.85,'0 0'),(3.12,'0 -43'),(3.4,'0 -55'),(7.2,'0 -55')],kind='translate')}
<use href="#tired" x="414" y="186" width="272" height="272"/>
</g></g>
<g id="small-reassurance" opacity="0">
{animate('opacity',[(0,0),(.89,0),(1.0,1),(1.65,1),(2.05,0),(7.2,0)])}
<path d="M431 74H640Q656 74 656 91V126Q656 143 639 143H516L488 170L492 143H431Q414 143 414 126V92Q414 74 431 74Z" fill="#fff6e7" stroke="#96765c" stroke-width="3"/>
<text x="535" y="119" text-anchor="middle" fill="#5e493b" font-family="{SANS}" font-size="29" font-weight="700">Just one.</text>
</g>
<g clip-path="url(#stream-reveal)">
<g id="paper-stream" opacity="1">
{animate('opacity',[(0,0),(.74,0),(.84,1),(3.6,1),(3.85,0),(7.2,0)])}
<path d="{flow}" fill="none" stroke="#987759" stroke-width="56"/>
<path d="{flow}" fill="none" stroke="#fff5e3" stroke-width="50"/>
<path d="{flow}" fill="none" stroke="#dd897c" stroke-width="28" stroke-dasharray="3 10" opacity=".78">
<animate attributeName="stroke-dashoffset" from="0" to="-130" dur=".55s" repeatCount="indefinite"/>
</path>
</g></g>
<g id="paper-heap" transform="translate(410 454)"><g>
{animate('transform',[(0,'0 0'),(1.65,'0 0'),(1.9,'.17 .10'),(2.2,'.36 .30'),(2.55,'.68 .56'),(2.88,'.9 .85'),(3.15,'1.03 1.02'),(3.42,'1 1'),(7.2,'1 1')],kind='scale')}
<use href="#paper" x="-300" y="-251" width="600" height="251"/>
</g></g>
</g></g>'''


def standalone(asset_prefix=''):
    return f'<svg xmlns="http://www.w3.org/2000/svg" width="720" height="480" viewBox="0 0 720 480"><title>Just one C++ error</title><style>svg{{background:white}}@media(prefers-color-scheme:dark){{svg{{background:#0d1117}}}}</style>{scene(asset_prefix)}</svg>'


def preview_page():
    return f'''<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>只有一个错误 · 动画预览</title><style>
*{{box-sizing:border-box}}body{{margin:0;background:#f5f7f6;color:#1f3935;font:15px/1.6 system-ui,sans-serif}}main{{max-width:940px;margin:30px auto;padding:24px;background:white;border:1px solid #dbe5e0;border-radius:10px}}h1{{font-size:23px;margin:0 0 8px}}p{{margin:0 0 12px}}svg{{display:block;width:100%;max-width:720px;height:auto;margin:auto}}.controls{{display:flex;gap:12px;align-items:center;flex-wrap:wrap;margin:20px 0 10px}}button{{font:inherit;border:1px solid #97afa3;border-radius:5px;background:white;padding:6px 14px;color:#204d40;cursor:pointer}}input{{flex:1;min-width:120px}}a{{color:#267866;margin-right:18px}}#phase{{min-width:140px}}@media(prefers-color-scheme:dark){{body{{background:#0d1117;color:#e6edf3}}main{{background:#0d1117;border-color:#30363d}}button{{background:#142326;color:#dceee5}}a{{color:#8dcfba}}}}@media(max-width:600px){{main{{margin:12px;padding:15px}}}}
</style></head><body><main><h1>只有一个错误</h1><p>先放心，再被同一个错误的诊断说明淹没。可以暂停、重播或拖动进度。</p>{standalone('assets/scene/')}<div class="controls"><button id="replay">重播</button><button id="pause">暂停</button><input id="time" type="range" min="0" max="7.19" step=".01" aria-label="动画进度"><span id="phase"></span></div><p><a href="index.html">放回完整主页</a><a href="assets/scene/scene-light.gif">打开GIF</a><a href="../../cpp-humor/storyboards/one-error.png">三格分镜</a></p></main><script>
const svg=document.querySelector('svg'),slider=document.getElementById('time'),label=document.getElementById('phase'),pause=document.getElementById('pause');document.getElementById('replay').onclick=()=>{{svg.setCurrentTime(0);svg.unpauseAnimations();pause.textContent='暂停'}};pause.onclick=()=>{{if(svg.animationsPaused()){{svg.unpauseAnimations();pause.textContent='暂停'}}else{{svg.pauseAnimations();pause.textContent='播放'}}}};slider.oninput=()=>{{svg.pauseAnimations();svg.setCurrentTime(Number(slider.value));pause.textContent='播放'}};function update(){{const t=svg.getCurrentTime()%7.2;slider.value=t;label.textContent=t<.7?'准备编译':t<1.65?'只有一个，放心':t<3.1?'诊断说明不断涌出':t<6.15?'仍然只有一个错误':'循环衔接';requestAnimationFrame(update)}}update();
</script></body></html>'''
