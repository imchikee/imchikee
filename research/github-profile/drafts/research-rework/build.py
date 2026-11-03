"""Two local README designs with different reading structures; no publishing."""

from pathlib import Path
from html import escape
import importlib.util
import re
import shutil
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parent
spec = importlib.util.spec_from_file_location('profile_preview', ROOT.parent / 'current-evolution/build.py')
base = importlib.util.module_from_spec(spec)
spec.loader.exec_module(base)
SANS = 'Arial,DejaVu Sans,sans-serif'
SERIF = 'Georgia,DejaVu Serif,serif'
MONO = 'DejaVu Sans Mono,Consolas,monospace'
TOOLS = [('c', 'C'), ('cpp', 'C++'), ('python', 'Python'), ('terminal', 'Shell'),
         ('linux', 'Linux'), (None, 'QNX'), ('cmake', 'CMake'), (None, 'Conan'),
         (None, 'Bazel'), ('git', 'Git')]


def svg(body, width, height, title):
    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}" role="img" aria-labelledby="title"><title id="title">{escape(title)}</title>{body}</svg>\n'''


def palette(dark):
    return dict(paper='#1b2227' if dark else '#f8f4e9', ink='#f1eadd' if dark else '#233f3b',
                muted='#b4b5a9' if dark else '#66716a', rule='#424b4c' if dark else '#d7d8c9',
                orange='#f4ac78' if dark else '#bb572f', blue='#9ab5eb' if dark else '#456bba',
                note='#2a3037' if dark else '#fffdf6')


def folio(dark=False, mobile=False):
    p = palette(dark)
    if mobile:
        return svg(f'''
<rect x="1" y="1" width="518" height="383" rx="5" fill="{p['paper']}" stroke="{p['rule']}"/>
<text x="28" y="34" font-family="{MONO}" font-size="12" fill="{p['muted']}" letter-spacing="1.6">CHIKEE / PERSONAL NOTES</text>
<path d="M28 51H492" stroke="{p['rule']}"/>
<text x="24" y="146" font-family="{SERIF}" font-size="88" fill="{p['ink']}" letter-spacing="-4">Chikee,</text>
<text x="29" y="191" font-family="{SANS}" font-size="30" fill="{p['ink']}">close to the system.</text>
<path d="M30 217Q131 205 236 213" fill="none" stroke="{p['orange']}" stroke-width="3"/>
<g transform="translate(317 225) rotate(6)">
<rect width="158" height="121" rx="4" fill="{p['note']}" stroke="{p['rule']}"/>
<text x="15" y="24" font-family="{MONO}" font-size="10" fill="{p['orange']}">ONE OPEN QUESTION</text>
<text x="14" y="70" font-family="{SERIF}" font-size="44" fill="{p['ink']}">C++?</text>
<text x="15" y="99" font-family="{MONO}" font-size="13" fill="{p['muted']}">see bio.</text></g>
<path id="trail" d="M31 287C83 243 105 339 167 290S252 241 286 285" fill="none" stroke="{p['blue']}" stroke-width="2" stroke-dasharray="3 6"/>
<circle r="4" fill="{p['orange']}"><animateMotion dur="7s" repeatCount="indefinite" path="M31 287C83 243 105 339 167 290S252 241 286 285"/></circle>
<text x="29" y="353" font-family="{MONO}" font-size="12" fill="{p['muted']}">SOFTWARE / LINUX / OPEN QUESTIONS</text>
''', 520, 385, 'Chikee, close to the system. One open question: C++? See bio.')
    return svg(f'''
<rect x="1" y="1" width="998" height="337" rx="5" fill="{p['paper']}" stroke="{p['rule']}"/>
<text x="34" y="36" font-family="{MONO}" font-size="13" fill="{p['muted']}" letter-spacing="1.8">CHIKEE / PERSONAL NOTES</text>
<text x="964" y="36" text-anchor="end" font-family="{MONO}" font-size="12" fill="{p['orange']}">A FEW THINGS ABOUT ME</text>
<path d="M34 55H966" stroke="{p['rule']}"/>
<text x="30" y="166" font-family="{SERIF}" font-size="112" fill="{p['ink']}" letter-spacing="-5">Chikee,</text>
<text x="37" y="228" font-family="{SANS}" font-size="43" fill="{p['ink']}">close to the system.</text>
<path d="M38 252Q187 235 410 248" fill="none" stroke="{p['orange']}" stroke-width="3" stroke-linecap="round"/>
<g transform="translate(696 76) rotate(6)">
<rect x="6" y="8" width="228" height="198" rx="4" fill="{p['rule']}" opacity=".4"/>
<rect width="228" height="198" rx="4" fill="{p['note']}" stroke="{p['rule']}"/>
<path d="M88 -4L151 -4L147 11L92 11Z" fill="{p['orange']}" opacity=".35"/>
<text x="20" y="39" font-family="{MONO}" font-size="11" fill="{p['orange']}" letter-spacing="1">ONE OPEN QUESTION</text>
<text x="18" y="119" font-family="{SERIF}" font-size="69" fill="{p['ink']}">C++?</text>
<path d="M22 140H202" stroke="{p['rule']}"/>
<text x="20" y="171" font-family="{MONO}" font-size="16" fill="{p['muted']}">see bio.</text></g>
<path d="M460 239C490 162 563 261 600 216S642 124 672 145" fill="none" stroke="{p['blue']}" stroke-width="2" stroke-dasharray="3 6"/>
<circle r="4" fill="{p['orange']}"><animateMotion dur="7s" repeatCount="indefinite" path="M460 239C490 162 563 261 600 216S642 124 672 145"/></circle>
<text x="37" y="306" font-family="{MONO}" font-size="13" fill="{p['muted']}" letter-spacing="1.2">SOFTWARE / LINUX / OPEN QUESTIONS</text>
''', 1000, 339, 'Chikee, close to the system. One open question: C++? See bio.')


def theme_note(dark=False, mobile=False):
    p = palette(dark)
    # An illustration of the topic in the local Utopia README, not a screenshot.
    if mobile:
        return svg(f'''
<rect x="1" y="1" width="518" height="423" rx="5" fill="{p['paper']}" stroke="{p['rule']}"/>
<text x="27" y="33" font-family="{MONO}" font-size="12" fill="{p['orange']}" letter-spacing="1.2">CURRENTLY ON THE WORKBENCH</text>
<text x="26" y="85" font-family="{SERIF}" font-size="36" fill="{p['ink']}">A desktop that</text>
<text x="26" y="127" font-family="{SERIF}" font-size="36" fill="{p['ink']}">feels like mine.</text>
{wallpaper_art(26, 149, 1.1, dark)}
<text x="27" y="391" font-family="{MONO}" font-size="14" fill="{p['muted']}">WALLPAPER → PALETTE → DESKTOP</text>
''', 520, 425, 'Current workbench: wallpaper-driven desktop themes. A wallpaper becomes a palette and desktop colors.')
    return svg(f'''
<rect x="1" y="1" width="998" height="321" rx="5" fill="{p['paper']}" stroke="{p['rule']}"/>
<text x="35" y="39" font-family="{MONO}" font-size="12" fill="{p['orange']}" letter-spacing="1.5">CURRENTLY ON THE WORKBENCH</text>
<text x="33" y="116" font-family="{SERIF}" font-size="49" fill="{p['ink']}">A desktop that</text>
<text x="33" y="175" font-family="{SERIF}" font-size="49" fill="{p['ink']}">feels like mine.</text>
<path d="M36 200H384" stroke="{p['rule']}"/>
<text x="36" y="235" font-family="{SANS}" font-size="19" fill="{p['muted']}">Wallpaper-driven themes,</text>
<text x="36" y="263" font-family="{SANS}" font-size="19" fill="{p['muted']}">from an image to the desktop.</text>
{wallpaper_art(502, 66, 1, dark)}
''', 1000, 323, 'Current workbench: wallpaper-driven desktop themes, from an image to the desktop.')


def wallpaper_art(x, y, scale, dark):
    p = palette(dark)
    return f'''<g transform="translate({x} {y}) scale({scale})">
<defs><linearGradient id="land" x2="1" y2="1"><stop stop-color="#d1c8d9"/><stop offset=".5" stop-color="#90aaa3"/><stop offset="1" stop-color="#3d6560"/></linearGradient></defs>
<rect x="4" y="3" width="174" height="137" rx="5" fill="{p['rule']}" transform="rotate(-5 90 70)"/>
<g transform="rotate(-5 90 70)"><rect width="174" height="137" rx="5" fill="{p['note']}" stroke="{p['rule']}"/>
<rect x="8" y="8" width="158" height="97" rx="3" fill="url(#land)"/>
<path d="M8 96L60 49L103 75L139 38L166 56V105H8Z" fill="#3d6560" opacity=".45"/>
<circle cx="131" cy="32" r="12" fill="#efd7b2"/>
<text x="12" y="125" font-family="{MONO}" font-size="10" fill="{p['muted']}">01 / WALLPAPER</text></g>
<path d="M184 62H221M214 55L221 62L214 69" stroke="{p['orange']}" fill="none" stroke-width="2"/>
<rect x="241" y="0" width="162" height="111" rx="5" fill="{p['note']}" stroke="{p['rule']}"/>
<rect x="254" y="15" width="35" height="55" rx="3" fill="#3d6560"/><rect x="296" y="15" width="35" height="55" rx="3" fill="#90aaa3"/><rect x="338" y="15" width="51" height="55" rx="3" fill="#d1c8d9"/>
<text x="254" y="95" font-family="{MONO}" font-size="10" fill="{p['muted']}">02 / PALETTE</text>
<path d="M322 121V150H221" fill="none" stroke="{p['orange']}" stroke-width="2" stroke-dasharray="4 5"/>
<g transform="translate(98 140)"><rect width="190" height="53" rx="5" fill="#14272b" stroke="#51726f"/>
<text x="12" y="22" font-family="{MONO}" font-size="11" fill="#90aaa3">03 / DESKTOP</text>
<path d="m13 33 4 4-4 4M26 37H77M88 37H137" stroke="#d1c8d9" stroke-width="2" fill="none" stroke-linecap="round"/></g>
</g>'''


def code_intro(dark=False, mobile=False):
    bg = '#151c27' if dark else '#eef4f5'
    fg = '#e3edf6' if dark else '#203d43'
    muted = '#91a7bb' if dark else '#587480'
    green = '#82ddc5' if dark else '#207a69'
    w = 520 if mobile else 1000
    return svg(f'''
<rect x="1" y="1" width="{w-2}" height="117" rx="9" fill="{bg}" stroke="{muted}" stroke-opacity=".25"/>
<text x="23" y="33" font-family="{MONO}" font-size="12" fill="{muted}">CHIKEE.HPP / A FEW DECLARATIONS</text>
<text x="23" y="78" font-family="{MONO}" font-size="{'24' if mobile else '30'}" fill="{fg}">knows_cpp = <tspan fill="{green}">false</tspan>;</text>
<circle cx="{w-67}" cy="71" r="18" fill="none" stroke="{muted}" stroke-opacity=".4"/>
<path d="M{w-73} 65Q{w-73} 57 {w-67} 57Q{w-58} 57 {w-59} 65Q{w-59} 70 {w-67} 73V77" fill="none" stroke="{green}" stroke-width="2" stroke-linecap="round"/>
<circle cx="{w-67}" cy="83" r="1.4" fill="{green}"/>
<circle r="3" fill="{green}"><animateMotion dur="5s" repeatCount="indefinite" path="M{w-67} 53a18 18 0 1 1 -.01 0"/></circle>
''', w, 119, 'Chikee.hpp — knows_cpp = false. A playful echo of the profile bio.')


def terminal_theme(dark=False, mobile=False):
    bg = '#131c28' if dark else '#edf2f6'
    line = '#34465a' if dark else '#c4d1dd'
    fg = '#dbe8f4' if dark else '#243e50'
    accent = '#b5a7ef' if dark else '#6d559c'
    w, h = (520, 165) if mobile else (1000, 146)
    return svg(f'''
<rect x="1" y="1" width="{w-2}" height="{h-2}" rx="8" fill="{bg}" stroke="{line}"/>
<text x="23" y="32" font-family="{MONO}" font-size="12" fill="{accent}">ONE OPEN TAB / LINUX WORKSTATIONS</text>
<text x="23" y="{'71' if mobile else '80'}" font-family="{MONO}" font-size="{'23' if mobile else '31'}" fill="{fg}">wallpaper → palette → desktop</text>
<path d="M24 {h-32}H{w-30}" stroke="{line}"/>
<circle cx="30" cy="{h-32}" r="4" fill="{accent}"><animate attributeName="cx" values="30;{w-31};30" dur="8s" repeatCount="indefinite"/></circle>
''', w, h, 'One open tab: wallpaper to palette to desktop. Wallpaper-driven themes in a Linux workstation.')


def picture(name, alt):
    return f'''<picture>
  <source media="(max-width: 600px) and (prefers-color-scheme: dark)" srcset="./assets/{name}-mobile-dark.svg" />
  <source media="(max-width: 600px)" srcset="./assets/{name}-mobile-light.svg" />
  <source media="(prefers-color-scheme: dark)" srcset="./assets/{name}-dark.svg" />
  <img src="./assets/{name}-light.svg" width="100%" alt="{escape(alt)}" />
</picture>'''


def snake():
    return '''<picture><source media="(prefers-color-scheme: dark)" srcset="./assets/contributions-dark.svg" /><img src="./assets/contributions.svg" width="100%" alt="My existing animated contribution snake" /></picture>'''


def tool_row(items):
    cells = []
    for key, name in items:
        icon = f'<img src="./assets/icons/{key}.svg" width="23" height="23" alt="" />&nbsp;' if key else ''
        cells.append(f'<span>{icon}{escape(name)}</span>')
    # Plain inline image/text pairs naturally wrap on GitHub too.
    return ' &nbsp; '.join(cells)


def journal():
    return f'''{picture('folio', 'Chikee, close to the system. One open question: C++? See bio.')}

<p>I'm <strong>Chikee</strong>. My background is in <strong>C/C++ and embedded systems</strong>, with work across software architecture, cross-platform integration, and runtime performance on Linux and QNX.</p>

<p>I like understanding how software fits together — from its build to the machine it runs on.</p>

{picture('theme-note', 'Currently on the workbench: wallpaper-driven desktop themes, from an image to the desktop.')}

<p>Here on GitHub, I explore <strong>Linux workstations and developer tools</strong>. One current rabbit hole: how a wallpaper can shape the desktop around it.</p>

<p>Some of that tinkering lives in <a href="https://github.com/imchikee/utopia"><strong>utopia ↗</strong></a>, my Linux workstation project.</p>

<h2>A few things on the desk</h2>
<p><strong>Languages</strong><br />{tool_row(TOOLS[:4])}</p>
<p><strong>Platforms</strong><br />{tool_row(TOOLS[4:6])}</p>
<p><strong>Builds &amp; version control</strong><br />{tool_row(TOOLS[6:])}</p>

<h2>A little trail of activity</h2>
{snake()}
'''


PROFILE_CODE = '''namespace chikee {
  constexpr auto work =
    "systems software";

  constexpr auto platforms =
    "Linux / QNX";

  const char* focus[] = {
    "software architecture",
    "platform integration",
    "builds & deployment",
    "runtime performance"
  };

  const bool knows_cpp = false;
} // namespace chikee'''


def source():
    return f'''<h1>Hi, I'm Chikee.</h1>

<p>I work with <strong>C/C++ and embedded systems</strong>. I like understanding how software is built, deployed, and made to work across platforms.</p>

{picture('code-intro', 'Chikee.hpp — knows_cpp = false. A playful echo of the profile bio.')}

```cpp
{PROFILE_CODE}
```

<details>
<summary>About that last declaration…</summary>
<p>See the bio. There is always another corner of C++ to figure out.</p>
</details>

<h2>One open tab</h2>

<p>Outside those declarations, I tinker with <strong>Linux workstations, desktop workflows, theming, and developer tools</strong>.</p>

{picture('terminal-theme', 'One open tab: wallpaper to palette to desktop. Wallpaper-driven Linux themes.')}

<p>Currently exploring wallpaper-driven desktop themes in <a href="https://github.com/imchikee/utopia"><strong>utopia →</strong></a>.</p>

<h2>Some familiar tools</h2>
<p>{tool_row(TOOLS[:4])}</p>
<p>{tool_row(TOOLS[4:])}</p>

<h2>And a little movement</h2>
{snake()}
'''


def highlight_cpp(text):
    # Approximate GitHub's fenced-code syntax colors for the local preview.
    token = r'("[^"\n]*"|//[^\n]*|\b(?:namespace|constexpr|const|char|auto|bool|false)\b)'
    out = []
    for part in re.split(token, text):
        cls = 'str' if part.startswith('"') else 'comment' if part.startswith('//') else 'kw' if re.fullmatch(r'namespace|constexpr|const|char|auto|bool|false', part) else None
        out.append(f'<span class="{cls}">{escape(part)}</span>' if cls else escape(part))
    return ''.join(out)


def fragment(text):
    return re.sub(r'```cpp\n([\s\S]*?)\n```', lambda m: '<pre><code class="language-cpp">'+highlight_cpp(m[1])+'</code></pre>', text)


def board():
    html = '''<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>两种整页组织 / 现版 · 本地对照</title><style>
*{box-sizing:border-box}body{margin:0;background:#f3f5f7;color:#263241;font:15px/1.6 system-ui,sans-serif}header{padding:26px 3vw;background:#fff;border-bottom:1px solid #d5dce4}h1{font-size:25px;margin:0 0 8px}header p{margin:0;color:#526172;max-width:1200px}.controls{display:flex;gap:12px;flex-wrap:wrap;margin-top:18px}select,button{font:inherit;padding:6px 12px;border:1px solid #bcc9d7;border-radius:5px;color:#263241;background:white}button{cursor:pointer}button[aria-pressed=true]{background:#233f3b;color:#e1eee7}.columns{display:grid;grid-template-columns:1fr 1fr;gap:22px;padding:24px 3vw 35px;align-items:start}.panel{min-width:0;background:white;border:1px solid #d5dce4;border-radius:7px;overflow:hidden}.panel>div{padding:15px 18px;border-bottom:1px solid #d5dce4}h2{margin:0;font-size:19px}.panel p{margin:5px 0;font-size:13px;color:#526172}.panel img{display:block;width:100%;height:auto}.panel a{color:#0969da}footer{padding:0 3vw 30px;color:#526172;font-size:13px}body.dark{background:#0d1117;color:#e6edf3}body.dark header,body.dark .panel{background:#161b22;border-color:#30363d}body.dark .panel>div{border-color:#30363d}body.dark p,body.dark footer{color:#a0acba}body.dark a{color:#7eb8ff}body.mobile img{max-width:430px;margin:auto}@media(max-width:760px){.columns{grid-template-columns:1fr;padding:14px}header{padding:20px}h1{font-size:22px}}
</style></head><body><header><h1>两种整页组织，与现版一起比较</h1><p>「边注个人页」用图文叙述和贯穿的边注组织内容；「代码自述」用声明、注释和可展开的小玩笑组织内容。头像、Bio 与贡献蛇均保留。这里是截图对照，点击可打开对应 HTML 查看动画。</p><div class="controls"><label>左侧 <select id="left"><option value="journal">边注个人页</option><option value="source">代码自述</option><option value="baseline">现版</option></select></label><label>右侧 <select id="right"><option value="source">代码自述</option><option value="journal">边注个人页</option><option value="baseline">现版</option></select></label><button data-theme="light" aria-pressed="true">浅色</button><button data-theme="dark" aria-pressed="false">深色</button><button data-view="readme" aria-pressed="true">README</button><button data-view="middle" aria-pressed="false">横幅以下</button><button data-view="full" aria-pressed="false">整页</button><button data-view="mobile" aria-pressed="false">手机</button></div></header><div class="columns">
<section class="panel"><div><h2 id="left-title"></h2><p id="left-desc"></p><a id="left-link">打开动态预览 ↗</a></div><a id="left-image-link"><img id="left-image" alt="左侧候选预览"></a></section>
<section class="panel"><div><h2 id="right-title"></h2><p id="right-desc"></p><a id="right-link">打开动态预览 ↗</a></div><a id="right-image-link"><img id="right-image" alt="右侧候选预览"></a></section></div><footer>本地候选，尚未采用或发布。现版来自已存文件的同外框重建；不是本轮实时线上截图。配色、措辞、图形与交互均待看效果后讨论。</footer><script>
const configs={journal:{base:'./journal/',title:'边注个人页',desc:'叙述 → 当前探索图文 → 按用途分组的工具 → 动态收尾'},source:{base:'./source/',title:'代码自述',desc:'简介 → 声明与可展开注释 → 当前探索 → 工具 → 动态收尾'},baseline:{base:'../current-evolution/baseline/',title:'现版',desc:'终端横幅 → 轮播 → 介绍与双卡片 → 工具 → 贡献蛇'}};
let theme='light',view='readme';function refresh(){document.body.className=theme+(view==='mobile'?' mobile':'');for(const side of ['left','right']){const key=document.getElementById(side).value,c=configs[key];document.getElementById(side+'-title').textContent=c.title;document.getElementById(side+'-desc').textContent=c.desc;document.getElementById(side+'-image').src=c.base+view+'-'+theme+'.png';for(const suffix of ['-link','-image-link'])document.getElementById(side+suffix).href=c.base+'preview-'+theme+'.html';}for(const b of document.querySelectorAll('[data-theme]'))b.setAttribute('aria-pressed',String(b.dataset.theme===theme));for(const b of document.querySelectorAll('[data-view]'))b.setAttribute('aria-pressed',String(b.dataset.view===view));}
for(const side of ['left','right'])document.getElementById(side).onchange=refresh;for(const b of document.querySelectorAll('[data-theme]'))b.onclick=()=>{theme=b.dataset.theme;refresh()};for(const b of document.querySelectorAll('[data-view]'))b.onclick=()=>{view=b.dataset.view;refresh()};refresh();
</script></body></html>'''
    (ROOT/'index.html').write_text(html)


def build():
    base.CSS += '''
.markdown-body h1{font-size:32px;line-height:1.25;border-bottom:1px solid var(--border);padding-bottom:.3em;margin:0 0 20px;font-weight:600}.markdown-body pre{padding:16px;overflow:auto;font:13.6px/1.55 ui-monospace,"DejaVu Sans Mono",monospace;background:var(--subtle);border-radius:6px;margin:0 0 16px}.markdown-body pre code{white-space:pre}.markdown-body details{margin:0 0 24px}.markdown-body summary{cursor:pointer;color:var(--link)}.markdown-body details p{margin:12px 0 0}.markdown-body p:has(img[src*="icons/"]){line-height:2.2}.markdown-body p span{white-space:nowrap}.light .kw{color:#cf222e}.light .str{color:#0a3069}.light .comment{color:#6e7781}.dark .kw{color:#ff7b72}.dark .str{color:#a5d6ff}.dark .comment{color:#9198a1}
'''
    for name, function, label in [('journal', journal, '边注个人页'), ('source', source, '代码自述')]:
        folder=ROOT/name
        assets=folder/'assets'
        assets.mkdir(parents=True,exist_ok=True)
        shutil.copytree(base.SOURCE/'icons',assets/'icons',dirs_exist_ok=True)
        for file in ['contributions.svg','contributions-dark.svg']:
            shutil.copyfile(base.SOURCE/file,assets/file)
        shutil.copyfile(base.AVATAR,assets/'avatar.png')
        generators = [('folio',folio),('theme-note',theme_note)] if name=='journal' else [('code-intro',code_intro),('terminal-theme',terminal_theme)]
        for key,generate in generators:
            for dark in [False,True]:
                for mobile in [False,True]:
                    suffix=('-mobile' if mobile else '')+('-dark' if dark else '-light')
                    (assets/f'{key}{suffix}.svg').write_text(generate(dark,mobile))
        text=function()
        (folder/'README.md').write_text(text)
        rendered=fragment(text)
        (folder/'fragment.html').write_text(rendered)
        base.preview(folder,rendered,label+' · 本地候选')
    board()
    for p in ROOT.rglob('*.svg'):
        ET.parse(p)
    print('Built journal and source README candidates; all SVG XML parsed.')


if __name__=='__main__':
    build()
