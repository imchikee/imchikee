"""One camera: a palm grows, seasons pass, C++ reaches two percent."""
from pathlib import Path
from functools import lru_cache
from PIL import Image

ROOT = Path(__file__).resolve().parent
ART = ROOT / "assets/scene"
DURATION = 12
W, H = 960, 600
FONT = "Arial,DejaVu Sans,sans-serif"


def anim(attr, frames, kind=None, reset=True, **extra):
    # Reset the scene while it is invisible, then fade into the same first pose.
    if reset:
        first, last = frames[0][1], frames[-1][1]
        frames = [(t,v) for t,v in frames if t < 11.7]
        frames += [(11.7,last),(11.8,first),(12,first)]
    values = ";".join(str(v) for t, v in frames)
    times = ";".join(f"{t / DURATION:.6f}" for t, v in frames)
    attrs = " ".join(f'{k}="{v}"' for k, v in extra.items())
    tag = "animateTransform" if kind else "animate"
    target = f'attributeName="transform" type="{kind}"' if kind else f'attributeName="{attr}"'
    return f'<{tag} {target} values="{values}" keyTimes="{times}" dur="{DURATION}s" repeatCount="indefinite" {attrs}/>'


@lru_cache(maxsize=None)
def atlas(filename, prefix, asset_prefix):
    """Read alpha bounds for placement; leave the generated source PNG intact."""
    p = ART / filename
    with Image.open(p) as im:
        w, h = im.size
        alpha = im.convert("RGBA").getchannel("A")
        if alpha.getextrema()[0] == 255:
            raise ValueError(f"{filename} needs the generated transparent background")
        alpha = alpha.point(lambda v: 255 if v > 32 else 0)
        parts = []
        # Follow the actual transparent gutters of the generated palm atlas.
        regions = [(0,0,w*.405,h*.57),(w*.405,0,w,h*.57),
                   (0,h*.57,w*.52,h),(w*.52,h*.57,w,h)] if prefix == "palm" else [
                   ((i%2)*(w//2),(i//2)*(h//2),(i%2+1)*(w//2),(i//2+1)*(h//2)) for i in range(4)]
        for i, region in enumerate(regions):
            x, y, right, bottom = [int(v) for v in region]
            cell = alpha.crop((x, y, right, bottom))
            box = cell.getbbox()
            if box is None:
                raise ValueError(f"{filename}: empty sprite {i}")
            l, t, r, b = box
            bw, bh = r-l, b-t
            info = dict(x=x+l, y=y+t, w=bw, h=bh)
            if prefix == "palm" and i == 0:
                # Align the leaf crown to the actual top of the curved trunk.
                for key, ya, yb in [("tip", t, t+max(4,bh//20)), ("base", b-max(4,bh//20), b)]:
                    data = cell.crop((l, ya, r, yb)).tobytes()
                    mass = sum(data)
                    info[key] = sum((j % bw)*v for j, v in enumerate(data))/mass/bw
            parts.append(info)
    defs = f'<image id="{prefix}-atlas" width="{w}" height="{h}" href="{asset_prefix}{filename}"/>'
    for i, part in enumerate(parts):
        defs += f'<symbol id="{prefix}-{i}" viewBox="{part["x"]} {part["y"]} {part["w"]} {part["h"]}" overflow="hidden"><use href="#{prefix}-atlas"/></symbol>'
    return defs, parts


def sprite(name, x, y, w, h):
    return f'<use href="#{name}" x="{x:.2f}" y="{y:.2f}" width="{w:.2f}" height="{h:.2f}" preserveAspectRatio="xMidYMax meet"/>'


def scene(transparent=False, asset_prefix=''):
    actors, actor_info = atlas("hamster-poses.png", "actor", asset_prefix)
    paper = "" if transparent else '<rect width="960" height="600" fill="#faf4e7"/>'
    edge_mask = ' mask="url(#room-feather)"' if transparent else ""
    palms, parts = atlas("palm-parts.png", "palm", asset_prefix)
    pot_w = 130
    pot_h = pot_w * parts[3]["h"] / parts[3]["w"]
    pot_x, pot_y = 86, 512-pot_h
    bx, by = pot_x+pot_w/2, pot_y+pot_h*.30
    th = 240
    tw = th*parts[0]["w"]/parts[0]["h"]
    dx = (parts[0]["tip"]-parts[0]["base"])*tw
    crown_w = 420
    crown_h = crown_w*parts[1]["h"]/parts[1]["w"]
    fruit_h = 110*parts[2]["h"]/parts[2]["w"]
    growth = [(0,0),(.9,0),(1.8,.12),(3.2,.4),(4.6,.68),(5.8,.94),(6.3,1),(12,1)]
    sx = lambda s: .35+.65*s
    trunk = [(t, f"{sx(s):.4f} {s:.4f}") for t, s in growth]
    tips = [(t, f"{bx+dx*sx(s):.3f} {by-th*s:.3f}") for t, s in growth]
    leaves = [(t, f"{s:.4f}") for t, s in growth]
    phase = [(0,0),(3.2,1),(6.4,2),(9.15,3),(12,3)]
    sky = [(0,"#b6dce8"),(1.5,"#f3bc91"),(2.1,"#374e75"),(2.8,"#b7dfed"),
           (4.9,"#c8e2e8"),(5.8,"#d39776"),(6.4,"#253557"),(8.3,"#283a59"),
           (9.0,"#bfd3e1"),(9.65,"#34415c"),(12,"#34415c")]
    night = [(0,0),(1.5,0),(2.1,.85),(2.8,0),(5.8,.1),(6.4,1),(8.4,1),(9,0),(9.65,1),(12,1)]
    winter = [(0,0),(8.6,0),(9.25,1),(12,1)]
    outdoors = ""
    for x, y, scale in [(622,173,.8),(867,161,1.05)]:
        outdoors += f'''<g transform="translate({x} {y}) scale({scale})">
<path d="M0 30V-20M0-7L-23-27M0 0L24-20M0-17L10-40" fill="none" stroke="#806f59" stroke-width="6" stroke-linecap="round"/>
<g>{anim("opacity",[(0,1),(8.1,1),(9.0,0),(12,0)])}
<path d="M-34-25Q-51-54-22-59Q-20-82 1-70Q23-79 32-55Q55-47 38-22Q18-1-8-12Q-28-6-34-25Z" fill="#7ba967">
{anim("fill",[(0,"#82ad70"),(3,"#5e9e67"),(5.7,"#c69856"),(7.2,"#bb713c"),(12,"#bb713c")])}</path></g>
<g fill="#f2f5ee" opacity="0">{anim("opacity",winter)}<path d="M-24-28Q-5-42 12-34L28-24L21-17L1-24L-21-18Z"/><path d="M-3-48Q8-55 15-45L20-37L8-38Z"/></g></g>'''
    flakes = ""
    for i in range(19):
        x = 581+(i*71)%330
        y = 38+(i*47)%158
        duration = 2.3+(i%5)*.43
        flakes += f'''<g>{f'<animateTransform attributeName="transform" type="translate" from="0 -190" to="{9+(i%4)*3} 190" dur="{duration}s" begin="-{i*.31}s" repeatCount="indefinite"/>'}
<path d="M{x-2} {y}H{x+2}M{x} {y-2}V{y+2}" stroke="#fff9ec" stroke-width="1.5" opacity=".85"/></g>'''
    character = ""
    for i in range(4):
        visibility = [(t,1 if n==i else 0) for t,n in phase]
        character += f'''<g id="pose-{i}" opacity="0">{anim("opacity",visibility,calcMode="discrete")}
<g><animateTransform attributeName="transform" type="translate" values="0 0;0 -1.8;0 0;0 .8;0 0" dur="3.7s" repeatCount="indefinite"/>
{sprite(f"actor-{i}",281,194,302,294)}</g></g>'''
    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}" role="img">
<title>A palm grows and seasons pass while C++ is still compiling</title>
<defs>{actors}{palms}
<clipPath id="room"><rect x="0" y="0" width="{W}" height="{H}" rx="12"/></clipPath>
<clipPath id="outside"><rect x="576" y="26" width="349" height="184" rx="2"/></clipPath>
<clipPath id="pot-front"><rect x="{pot_x}" y="{pot_y+pot_h*.18}" width="{pot_w}" height="{pot_h}"/></clipPath>
<linearGradient id="wood" x2="0" y2="1"><stop stop-color="#d8b785"/><stop offset="1" stop-color="#b58e62"/></linearGradient>
<radialGradient id="lamp-glow"><stop stop-color="#ffce72" stop-opacity=".42"/><stop offset="1" stop-color="#ffcf82" stop-opacity="0"/></radialGradient>
<filter id="ink" x="-3%" y="-3%" width="106%" height="106%"><feTurbulence type="fractalNoise" baseFrequency=".045" numOctaves="2" seed="8" result="noise"/><feDisplacementMap in="SourceGraphic" in2="noise" scale=".8"/></filter>
<linearGradient id="edge-fade" x2="0" y2="1"><stop offset="0" stop-color="white"/><stop offset=".88" stop-color="white"/><stop offset="1" stop-color="black"/></linearGradient>
<mask id="room-feather"><rect width="960" height="600" fill="url(#edge-fade)"/></mask>
</defs>
<g clip-path="url(#room)"{edge_mask}>
{paper}
<g id="world">{anim("opacity",[(0,1),(11.3,1),(11.65,0),(11.85,0),(12,1)],reset=False)}
<g clip-path="url(#outside)" filter="url(#ink)">
<rect x="570" y="20" width="362" height="202" fill="#b6dce8">{anim("fill",sky)}</rect>
<path d="M570 187Q658 145 730 181T940 173V215H570Z" fill="#91ab86">
{anim("fill",[(0,"#91ab86"),(3,"#8aa276"),(6,"#9a855f"),(9,"#d6e2df"),(12,"#d6e2df")])}</path>
<g>{anim("opacity",[(0,1),(1.7,0),(2.7,1),(5.7,0),(12,0)])}
<circle cx="642" cy="77" r="20" fill="#fff0b0"><animate attributeName="cx" values="620;875" dur="5.8s" repeatCount="indefinite"/></circle>
<path d="M670 93Q680 74 695 87Q708 75 717 91H734Q742 109 723 108H676Q662 108 670 93" fill="#f8f1de" opacity=".7"/></g>
<g opacity="0">{anim("opacity",night)}
<path d="M780 57a18 18 0 1 0 18 26a20 20 0 0 1-18-26" fill="#fff0bd"/>
<path d="M604 48h3m-1.5-1.5v3M853 62h3m-1.5-1.5v3M899 103h3m-1.5-1.5v3M731 38h3m-1.5-1.5v3" stroke="#fff3ce" stroke-width="2"/></g>
<path d="M698 180V141L730 119L766 143V181M775 185V156L802 136L834 158V185" fill="#b79c83" stroke="#806f63" stroke-width="2"/>
<path d="M692 144L730 115L771 145M770 158L802 133L840 159" fill="none" stroke="#8b756a" stroke-width="7" stroke-linejoin="round"/>
<path d="M716 149h12v19h-12Zm20 0h12v19h-12Zm54 11h12v17h-12Z" fill="#ead3a0">
{anim("fill",[(0,"#c7c9af"),(2,"#f9d388"),(2.8,"#c7c9af"),(6.3,"#f9d388"),(12,"#f9d388")])}</path>
{outdoors}<g opacity="0">{anim("opacity",winter)}
<path d="M692 140L730 112L771 141M771 155L802 131L840 156" fill="none" stroke="#f2f6ef" stroke-width="7"/>
{flakes}</g></g>
<rect x="608" y="269" width="286" height="171" fill="#fff8e8"/>
<image id="painted-fixtures" width="960" height="600" preserveAspectRatio="none" href="{asset_prefix}room-plate-v2.png"/>
<g id="desk-lamp-glow" opacity="0">{anim("opacity",night)}
<ellipse cx="98" cy="343" rx="19" ry="7" fill="#ffe2a0" opacity=".7"/>
<ellipse cx="180" cy="377" rx="165" ry="140" fill="url(#lamp-glow)"/></g>
{sprite("palm-3",pot_x,pot_y,pot_w,pot_h)}
<g id="palm-trunk" transform="translate({bx} {by})"><g>
{anim("transform",trunk,kind="scale")}
{sprite("palm-0",-parts[0]["base"]*tw,-th,tw,th)}
</g></g>
<g id="seedling" transform="translate({bx} {by})">
{anim("opacity",[(0,1),(2.25,1),(2.9,0),(12,0)])}
<g><animateTransform attributeName="transform" type="rotate" values="-2;2;-2" dur="2.8s" repeatCount="indefinite"/>
<path d="M0 0Q-3-24 0-42" fill="none" stroke="#75904b" stroke-width="6"/>
<path d="M0-27Q-30-25-27-44Q-6-51 0-27Z" fill="#65964a" stroke="#688347" stroke-width="2"/>
<path d="M0-32Q4-55 28-49Q32-31 0-32Z" fill="#87af56" stroke="#688347" stroke-width="2"/></g></g>
<g id="crown-position">{anim("transform",tips,kind="translate")}
<g id="crown-size">{anim("transform",leaves,kind="scale")}
<g><animateTransform attributeName="transform" type="rotate" values="-1.3;1.7;-1.3" dur="4.4s" repeatCount="indefinite"/>
    {sprite("palm-1",-crown_w*.438,-crown_h*.54,crown_w,crown_h)}
<g id="coconuts" opacity="0">{anim("opacity",[(0,0),(5.9,0),(6.4,1),(12,1)])}
{sprite("palm-2",-38,-5,110,fruit_h)}</g>
</g></g></g>
{character}
<g clip-path="url(#pot-front)">{sprite("palm-3",pot_x,pot_y,pot_w,pot_h)}</g>
<g opacity="0">{anim("opacity",[(0,0),(5.7,0),(6.5,.85),(12,.85)])}
<path d="M{pot_x+pot_w*.4} {pot_y+pot_h*.36}l-4 19l7 8l-6 15m30-36l-9 16l6 12l-5 17" fill="none" stroke="#806d53" stroke-width="2"/></g>
<g id="winter-steam" transform="translate(449 347)" opacity="0">
{anim("opacity",[(0,0),(9.15,0),(9.35,1),(12,1)])}
<g><animateTransform attributeName="transform" type="translate" values="0 0;3 -9;0 -18" dur="2.2s" repeatCount="indefinite"/>
<animate attributeName="opacity" values="0;.65;0" dur="2.2s" repeatCount="indefinite"/>
<path d="M-10 0C-24-13 5-15-8-30M6 3C-9-10 18-15 6-31M21 0C10-12 31-18 20-30" fill="none" stroke="#fff7df" stroke-width="4" stroke-linecap="round"/></g></g>
<g id="monitor">
<text x="632" y="309" font-family="{FONT}" font-size="37" font-weight="700" fill="#385e51">C++</text>
<text x="751" y="354" text-anchor="middle" font-family="{FONT}" font-size="29" fill="#4d5847">Compiling…</text>
<text id="percent-1" x="751" y="401" text-anchor="middle" font-family="{FONT}" font-size="39" font-weight="700" fill="#3d5848">
{anim("opacity",[(0,1),(10.1,0),(12,0)],calcMode="discrete")}1%</text>
<text id="percent-2" x="751" y="401" text-anchor="middle" font-family="{FONT}" font-size="39" font-weight="700" fill="#3d5848" opacity="0">
{anim("opacity",[(0,0),(10.1,1),(12,1)],calcMode="discrete")}2%</text>
<rect x="636" y="418" width="230" height="13" rx="3" fill="#dedfc9" stroke="#9c9e7d" stroke-width="1.5"/>
<rect x="637" y="419" width="3" height="11" rx="2" fill="#70a66c">{anim("width",[(0,3),(10.1,3),(10.45,6),(12,6)])}</rect>
</g></g></g></svg>'''


def preview(svg):
    page = '''<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>编译还没结束 · 动画预览</title><style>
*{box-sizing:border-box}body{margin:0;background:#f1f3ee;color:#314b40;font:15px/1.65 system-ui,sans-serif}main{max-width:1020px;margin:24px auto;padding:22px;background:#fff;border:1px solid #d5dfd5;border-radius:12px}h1{font-size:23px;margin:0 0 8px}p{margin:0 0 12px}svg{display:block;width:100%;height:auto;border-radius:9px}.controls{display:flex;flex-wrap:wrap;align-items:center;gap:12px;margin:18px 0 10px}button{font:inherit;color:inherit;padding:6px 14px;background:transparent;border:1px solid #9aafa0;border-radius:5px;cursor:pointer}input{flex:1;min-width:120px}#phase{min-width:155px}a{color:#3b7c61;margin-right:16px}@media(prefers-color-scheme:dark){body{background:#0d1117;color:#e2e9de}main{background:#141b1c;border-color:#344341}a{color:#9bc9ac}}@media(max-width:600px){main{margin:10px;padding:14px}.controls{gap:8px}#phase{width:100%}}
</style></head><body><main><h1>编译还没结束</h1><p>椰树长大，昼夜与四季交替，进度终于从 1% 到 2%。</p>{SCENE}
<div class="controls"><button id="replay">重播</button><button id="pause">暂停</button><input id="time" type="range" min="0" max="11.99" step=".01" aria-label="动画进度"><span id="phase"></span></div>
<p><a href="assets/scene/scene.gif">打开 GIF</a><a href="../../cpp-humor/storyboards/slow-build-seasons.png">四季分镜</a><a href="assets/scene/ART.md">素材与提示词</a></p></main><script>
const svg=document.querySelector("svg"),slider=document.getElementById("time"),label=document.getElementById("phase"),pause=document.getElementById("pause");
document.getElementById("replay").onclick=()=>{svg.setCurrentTime(0);svg.unpauseAnimations();pause.textContent="暂停"};
pause.onclick=()=>{if(svg.animationsPaused()){svg.unpauseAnimations();pause.textContent="暂停"}else{svg.pauseAnimations();pause.textContent="播放"}};
slider.oninput=()=>{svg.pauseAnimations();svg.setCurrentTime(Number(slider.value));pause.textContent="播放"};
if(matchMedia("(prefers-reduced-motion: reduce)").matches){svg.pauseAnimations();svg.setCurrentTime(10.7);pause.textContent="播放"}
function update(){const t=svg.getCurrentTime()%12;slider.value=t;label.textContent=t<3.2?"春日 · 坐等":t<6.4?"夏日 · 树长高了":t<9.15?"秋夜 · 喝上椰汁":t<11.3?"冬日 · 终于到 2%":"循环衔接";requestAnimationFrame(update)}update();
</script></body></html>'''
    return page.replace("{SCENE}", svg)


def build():
    import xml.etree.ElementTree as ET
    svg = scene()
    ET.fromstring(svg)
    (ART / "scene.svg").write_text(svg)
    (ROOT / "index.html").write_text(preview(scene(asset_prefix='assets/scene/')))
    print("Built layered 12-second scene and controllable local preview.")


if __name__ == "__main__":
    build()
