from pathlib import Path
from PIL import Image

ROOT=Path(__file__).resolve().parent
regions=[(0,0,424,483),(424,0,858,483),(858,0,1254,483),(0,483,420,778),(420,483,860,778),(860,483,1254,766),(0,778,420,1254),(420,778,800,1254),(800,766,1254,1254)]
with Image.open(ROOT/'hamster-parts.png') as im:
    alpha=im.getchannel('A').point(lambda a:255 if a>32 else 0)
    assert alpha.getextrema()[0]==0
    defs=f'<image id="atlas" href="hamster-parts.png" width="{im.width}" height="{im.height}"/>'
    for i,(x,y,r,b) in enumerate(regions):
        box=alpha.crop((x,y,r,b)).getbbox()
        l,t,right,bottom=box
        defs+=f'<clipPath id="crop-{i}"><rect x="{x+l}" y="{y+t}" width="{right-l}" height="{bottom-t}"/></clipPath><symbol id="part-{i}" viewBox="{x+l} {y+t} {right-l} {bottom-t}" overflow="hidden"><g clip-path="url(#crop-{i})"><use href="#atlas"/></g></symbol>'

def part(i,x,y,w,h):return f'<use href="#part-{i}" x="{x}" y="{y}" width="{w}" height="{h}"/>'

page='''<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>喝药与穿越 · 连续角色动作</title><style>
*{box-sizing:border-box}body{margin:0;background:#e9eae3;color:#3d483e;font:15px/1.6 system-ui,sans-serif}main{max-width:1020px;margin:24px auto;padding:20px;background:#fffdf4;border:1px solid #cecfc0;border-radius:10px}h1{font-size:24px;margin:0 0 8px}p{margin:0 0 14px;color:#757b69}svg{display:block;width:100%;height:auto}.controls{display:flex;gap:12px;align-items:center;flex-wrap:wrap;margin-top:16px}button{font:inherit;padding:6px 15px;background:transparent;border:1px solid #a9b49b;border-radius:5px;color:inherit;cursor:pointer}input{flex:1;min-width:100px;accent-color:#6a8d66}#phase{min-width:160px;font-size:13px}a{color:#3d775a}footer{font-size:12px;color:#858674;margin-top:14px}@media(max-width:600px){main{margin:10px;padding:12px}#phase{width:100%}}
</style></head><body><main><h1>喝药 → 变年轻 → 走进时间门</h1><p>同一镜头中的连续动作试段，使用分离的头、躯干、四肢与道具。</p>
<svg id="stage" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 600" role="img" aria-label="仓鼠抬手喝药、恢复年轻，再迈步走进时间门"><defs>DEFS
<clipPath id="portal-rim"><path d="M640 160H940V550H640ZM688 230V510H895V230Z" clip-rule="evenodd"/></clipPath>
<clipPath id="forearm-clip"><rect x="-50" y="45" width="150" height="100"/></clipPath><radialGradient id="glow"><stop stop-color="#c9f9e9" stop-opacity=".7"/><stop offset="1" stop-color="#91c9ae" stop-opacity="0"/></radialGradient></defs>
<rect width="960" height="600" fill="#faf5e9"/>
<text x="35" y="46" fill="#4f7054" font-family="system-ui,sans-serif" font-size="24" font-weight="700">DAY 14611</text><text x="35" y="76" fill="#878774" font-family="system-ui,sans-serif" font-size="16" id="action">Reverse aging.</text>
<path d="M32 548Q475 542 930 548" fill="none" stroke="#bdbba2" stroke-width="2"/>
<g id="portal">PORTAL<text x="785" y="167" text-anchor="middle" fill="#537b64" font-family="system-ui,sans-serif" font-size="21" font-weight="700">DAY 21</text></g>
<ellipse id="shadow" cx="280" cy="541" rx="127" ry="9" fill="#8b8b6a" opacity=".15"/>
<g id="rig"><g id="left-leg">LEFTLEG</g><g id="right-leg">RIGHTLEG</g><g id="torso">TORSO</g><g id="left-arm">LEFTARM</g>
<g id="right-arm">RIGHTARM</g><g id="head-pivot"><g id="young">YOUNG</g><g id="old">OLD</g></g><g id="right-forearm" clip-path="url(#forearm-clip)">RIGHTARM</g><g id="flask">FLASK</g></g>
<g id="sparkles" opacity="0" fill="none" stroke="#76ae8e" stroke-width="3"><path d="M160 180h18m-9-9v18M400 280h18m-9-9v18M180 420h18m-9-9v18M422 142h18m-9-9v18"/></g>
<g id="portal-front" clip-path="url(#portal-rim)">PORTAL</g>
<ellipse id="wash" cx="775" cy="360" rx="180" ry="220" fill="url(#glow)" opacity="0"/>
<text x="35" y="582" fill="#9a987e" font-family="system-ui,sans-serif" font-size="11">Story adapted from Abstruse Goose #249 · character motion study</text></svg>
<div class="controls"><button id="play">Pause</button><button id="replay">Replay</button><input id="seek" type="range" min="0" max="11" step=".01" value="0" aria-label="动作进度"><span id="phase"></span></div><footer><a href="../index.html">返回整页</a> · <a href="motion.gif">GIF</a> · <a href="ART.md">素材与提示词</a></footer></main><script src="motion.js"></script></body></html>'''
items={'DEFS':defs,'PORTAL':part(8,640,165,300,385),'LEFTLEG':part(5,-43,-12,86,96),'RIGHTLEG':part(6,-43,-12,86,96),'TORSO':part(0,-120,-242,240,245),'LEFTARM':part(3,-60,-10,90,120),'RIGHTARM':part(4,-25,-10,90,120),'YOUNG':part(2,-155,-405,310,280),'OLD':part(1,-155,-405,310,280),'FLASK':part(7,-26,-38,52,76)}
for key,value in items.items():page=page.replace(key,value)
(ROOT/'index.html').write_text(page)
