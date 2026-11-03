"""Build an offline README proposal and a faithful local baseline, using stdlib only."""

from html import escape
from pathlib import Path
import re
import shutil
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parent
RESEARCH = ROOT.parent.parent
SOURCE = ROOT.parent / 'toolbox-labels' / 'assets'
AVATAR = ROOT.parent / 'compact-personal' / 'assets' / 'avatar.png'
MONO = 'DejaVu Sans Mono,Consolas,monospace'
SANS = 'Arial,DejaVu Sans,sans-serif'


def svg(body, width, height, title, description, viewbox=None):
    viewbox = viewbox or f'0 0 {width} {height}'
    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="{viewbox}" role="img" aria-labelledby="title desc">
<title id="title">{escape(title)}</title><desc id="desc">{escape(description)}</desc>
{body}
</svg>\n'''


def type_line(x, y, size, ident, text):
    # Static fallback is fully visible. The reveal starts from a readable prefix.
    width = round(len(text) * size * .61)
    return f'''<defs><clipPath id="{ident}"><rect x="{x}" y="{y-size}" width="{width+4}" height="{size+8}">
<animate attributeName="width" values="{size*5};{width+4};{width+4}" keyTimes="0;.28;1" dur="9s" repeatCount="indefinite"/></rect></clipPath></defs>
<text x="{x}" y="{y}" font-family="{MONO}" font-size="{size}" fill="#b5a7ef" clip-path="url(#{ident})">{escape(text)}</text>'''


def header(mobile=False):
    if mobile:
        return svg(f'''
<defs><linearGradient id="base" x2="1" y2="1"><stop stop-color="#101b23"/><stop offset="1" stop-color="#1c1930"/></linearGradient></defs>
<rect x="1" y="1" width="518" height="350" rx="16" fill="url(#base)" stroke="#344354"/>
<path d="M1 42H519" stroke="#2d3646"/>
<circle cx="22" cy="22" r="4" fill="#e58d92"/><circle cx="38" cy="22" r="4" fill="#e1c284"/><circle cx="54" cy="22" r="4" fill="#82cfa6"/>
<text x="494" y="26" text-anchor="end" fill="#9baabd" font-family="{MONO}" font-size="12">imchikee / profile</text>
<text x="28" y="79" fill="#82ddc5" font-family="{MONO}" font-size="15">~ $ whoami</text>
<text x="24" y="150" fill="#f1f4fa" font-family="{MONO}" font-size="66" font-weight="700" letter-spacing="-3">Chikee<tspan fill="#82ddc5">.</tspan></text>
<text x="28" y="185" fill="#d3dce7" font-family="{SANS}" font-size="22">Software, close to the system.</text>
{type_line(28, 220, 16, 'typing', 'Still figuring out C++.')}
<rect x="25" y="249" width="470" height="78" rx="9" fill="#111c27" stroke="#49405f"/>
<text x="42" y="273" fill="#b5a7ef" font-family="{MONO}" font-size="11" letter-spacing="1">CURRENTLY EXPLORING</text>
<text x="42" y="304" fill="#e5e9f4" font-family="{SANS}" font-size="21">Linux workstations &amp; developer tools</text>
''', 520, 352, 'Chikee — software, close to the system',
                   'Currently exploring Linux workstations and developer tools. Still figuring out C++.')

    # Reuse the current banner's original background, frame, palette and name block.
    original = (SOURCE / 'header.svg').read_text()
    original = original.replace('with abstract layered windows.', 'with a window describing current interests.')
    original = original.replace('<text x="57" y="306" fill="#8898ae" font-size="14">SYSTEMS / LINUX / DEVELOPER TOOLS</text>',
                                type_line(57, 306, 17, 'typing', 'Still figuring out C++.'))
    start = original.index('  <g transform="translate(817 92)">')
    original = original[:start] + f'''
<g transform="translate(759 92)">
 <rect x="24" y="-12" width="371" height="202" rx="12" fill="#211e35" stroke="#49405f"/>
 <rect x="0" y="11" width="371" height="202" rx="12" fill="#131f28" stroke="#46716b"/>
 <path d="M0 45H371" stroke="#2b444b"/>
 <circle cx="19" cy="28" r="3" fill="#82ddc5"/><circle cx="32" cy="28" r="3" fill="#83b5dd"/><circle cx="45" cy="28" r="3" fill="#b5a7ef"/>
 <text x="22" y="78" fill="#82ddc5" font-family="{MONO}" font-size="13" letter-spacing="1.1">CURRENTLY EXPLORING</text>
 <text x="22" y="119" fill="#edf3fa" font-family="{SANS}" font-size="28" font-weight="600">Linux workstations</text>
 <text x="22" y="154" fill="#c3d0dd" font-family="{SANS}" font-size="23">&amp; developer tools</text>
 <path d="m24 175 7 6-7 6" fill="none" stroke="#82ddc5" stroke-width="2" stroke-linecap="round"/>
 <rect x="43" y="175" width="7" height="13" rx="1" fill="#b5a7ef"><animate attributeName="opacity" values="1;1;.15;.15;1" dur="1.5s" repeatCount="indefinite"/></rect>
</g>
</svg>\n'''
    return original


def engineering():
    steps = []
    for i, (y, title, subtitle) in enumerate([
        (137, 'Build', 'Targets & dependencies'),
        (216, 'Deploy', 'Processes, threads & resources'),
        (295, 'Run', 'Performance analysis & tuning'),
    ], 1):
        steps.append(f'''
<circle cx="42" cy="{y-5}" r="14" fill="#172f34" stroke="#6db9a7"/>
<text x="42" y="{y}" text-anchor="middle" font-family="{MONO}" font-size="12" fill="#9be6d3">0{i}</text>
<text x="70" y="{y}" fill="#edf3fa" font-family="{SANS}" font-size="23" font-weight="600">{title}</text>
<text x="70" y="{y+27}" fill="#b6cad2" font-family="{SANS}" font-size="16">{escape(subtitle)}</text>''')
    return svg(f'''
<defs><linearGradient id="bg" x2="1" y2="1"><stop stop-color="#152a30"/><stop offset="1" stop-color="#101a25"/></linearGradient></defs>
<rect x="1" y="1" width="418" height="370" rx="14" fill="url(#bg)" stroke="#36504f"/>
<path d="M25 26h20" stroke="#82ddc5" stroke-width="3" stroke-linecap="round"/>
<text x="56" y="30" fill="#82ddc5" font-family="{MONO}" font-size="11" letter-spacing="1.2">ENGINEERING</text>
<text x="26" y="73" fill="#edf3fa" font-family="{SANS}" font-size="28" font-weight="600">From build to runtime</text>
<path d="M26 94H394" stroke="#2d4149"/>
<path d="M42 146V197M42 225V276" stroke="#365950" stroke-width="2"/>
{''.join(steps)}
<path d="M26 341H394" stroke="#2d4149"/>
<text x="26" y="361" fill="#95b8b6" font-family="{MONO}" font-size="12">C/C++ · EMBEDDED · LINUX / QNX</text>
''', 432, 388, 'Engineering — from build to runtime',
               'Build: targets and dependencies. Deploy: processes, threads and resources. Run: performance analysis and tuning. C/C++, embedded systems, Linux and QNX.', viewbox='-6 0 432 388')


def workbench():
    return svg(f'''
<defs><linearGradient id="bg" x2="1" y2="1"><stop stop-color="#252038"/><stop offset="1" stop-color="#141d2c"/></linearGradient>
<linearGradient id="wall" x2="1" y2="1"><stop stop-color="#3c3960"/><stop offset="1" stop-color="#1c3341"/></linearGradient></defs>
<rect x="1" y="1" width="418" height="370" rx="14" fill="url(#bg)" stroke="#49405f"/>
<path d="M25 26h20" stroke="#b5a7ef" stroke-width="3" stroke-linecap="round"/>
<text x="56" y="30" fill="#b5a7ef" font-family="{MONO}" font-size="11" letter-spacing="1.2">ON MY WORKBENCH</text>
<text x="26" y="73" fill="#edf3fa" font-family="{SANS}" font-size="28" font-weight="600">A Linux place to tinker</text>
<rect x="26" y="98" width="368" height="159" rx="9" fill="url(#wall)" stroke="#625c80"/>
<path d="M26 124H394" stroke="#625c80" stroke-opacity=".65"/>
<circle cx="40" cy="111" r="3" fill="#b5a7ef"/><circle cx="51" cy="111" r="3" fill="#716d91"/><circle cx="62" cy="111" r="3" fill="#716d91"/>
<text x="378" y="115" text-anchor="end" font-family="{MONO}" font-size="10" fill="#b7b1d3">WORKSPACE</text>
<path d="M27 244Q110 154 180 187T393 150V256H27Z" fill="#81b6ae" opacity=".08"/>
<rect x="43" y="142" width="128" height="89" rx="6" fill="#1a2332" stroke="#6d6490"/>
<rect x="55" y="154" width="37" height="29" rx="4" fill="#393958"/>
<rect x="101" y="154" width="57" height="29" rx="4" fill="#2b4249"/>
<rect x="55" y="192" width="103" height="23" rx="4" fill="#302c46"/>
<path d="M63 204H90M107 204H146" stroke="#8e86b0" stroke-width="2" stroke-linecap="round"/>
<rect x="190" y="150" width="186" height="87" rx="6" fill="#111c29" stroke="#637c85"/>
<text x="204" y="172" fill="#82ddc5" font-family="{MONO}" font-size="12">~</text>
<path d="m205 187 5 5-5 5M219 193H252M204 210H283M292 210H351" fill="none" stroke="#8fa5bd" stroke-width="2" stroke-linecap="round"/>
<rect x="261" y="186" width="5" height="12" rx="1" fill="#b5a7ef"/>
<text x="26" y="286" fill="#c5c8df" font-family="{SANS}" font-size="16">Desktop workflows, theming &amp; tools</text>
<rect x="26" y="304" width="368" height="53" rx="7" fill="#b5a7ef" fill-opacity=".09" stroke="#b5a7ef" stroke-opacity=".15"/>
<text x="40" y="327" fill="#eee9ff" font-family="{MONO}" font-size="18" font-weight="600">utopia</text>
<text x="40" y="345" fill="#bcb5d7" font-family="{SANS}" font-size="13">Reproducible workstation setups</text>
<path d="M365 322h12v12m0-12-12 12" fill="none" stroke="#b5a7ef" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
''', 432, 388, 'On my workbench — Linux workstations and developer tools',
               'An illustrative desktop, not a project screenshot. Desktop workflows, theming and developer tools. Utopia: reproducible Linux workstation setups. Follow this card to the Utopia repository.', viewbox='-6 0 432 388')


def label(key, name):
    icon_key = {'shell': 'terminal'}.get(key, key)
    icon_path = SOURCE / 'icons' / f'{icon_key}.svg'
    width = 30 + len(name)*8 + (23 if icon_path.exists() else 0)
    inner = ''
    text_x = 12
    if icon_path.exists():
        raw = icon_path.read_text()
        match = re.search(r'<svg\b([^>]*)>([\s\S]*)</svg>', raw)
        viewbox = re.search(r'viewBox="([^"]+)"', match[1])[1]
        inner = f'<svg x="10" y="7" width="18" height="18" viewBox="{viewbox}">{match[2]}</svg>'
        text_x = 36
    return svg(f'''<rect x=".5" y=".5" width="{width-1}" height="31" rx="5" fill="#18232f" stroke="#3b4859"/>
{inner}<text x="{text_x}" y="21" fill="#e0e7f0" font-family="{SANS}" font-size="13">{escape(name)}</text>''',
               width, 32, name, name)


def readme():
    def labels(items):
        return ' '.join(f'<img src="./assets/labels/{key}.svg" height="32" alt="{escape(name)}" />' for key, name in items)
    return f'''<picture>
  <source media="(max-width: 600px)" srcset="./assets/header-mobile.svg" />
  <img src="./assets/header.svg" width="100%" alt="Chikee — software, close to the system. Currently exploring Linux workstations and developer tools." />
</picture>

<h2>About me</h2>

<p>I'm <strong>Chikee</strong>, a software engineer working with <strong>C/C++ and embedded systems</strong>, with a focus on <strong>software architecture and cross-platform integration</strong>.</p>

<p>Here on GitHub, I tinker with <strong>Linux workstations and developer tools</strong>. Some of that lives in <a href="https://github.com/imchikee/utopia"><strong>utopia →</strong></a>.</p>

<p align="center">
  <img src="./assets/engineering.svg" width="390" alt="Engineering — Build: targets and dependencies. Deploy: processes, threads and resources. Run: performance analysis and tuning. C/C++, embedded systems, Linux and QNX." />
  <a href="https://github.com/imchikee/utopia"><img src="./assets/workbench.svg" width="390" alt="On my workbench: Linux workstations, desktop workflows, theming and developer tools. Utopia: reproducible Linux workstation setups. Open Utopia." /></a>
</p>

<h2>Tools I reach for</h2>

<p><strong>Languages</strong><br />
{labels([('c','C'),('cpp','C++'),('python','Python'),('shell','Shell')])}</p>

<p><strong>Platforms &amp; build tools</strong><br />
{labels([('linux','Linux'),('qnx','QNX'),('cmake','CMake'),('conan','Conan'),('bazel','Bazel'),('git','Git')])}</p>

<h2>Contribution trail</h2>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="./assets/contributions-dark.svg" />
  <img src="./assets/contributions.svg" width="100%" alt="An animated snake tracing my GitHub contribution graph" />
</picture>
'''


# Only the existing snapshot's two Markdown constructs need conversion. New README
# is raw HTML, so preview markup and deployment markup are the same document.
def baseline_fragment(source):
    source = re.sub(r'^## (.+)$', r'<h2>\1</h2>', source, flags=re.M)
    source = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', source)
    blocks = []
    for block in source.strip().split('\n\n'):
        if block.lstrip().startswith('<'):
            blocks.append(block)
        else:
            blocks.append(f'<p>{block}</p>')
    return '\n\n'.join(blocks)


CSS = '''
*{box-sizing:border-box}body{margin:0;font:16px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI",Arial,sans-serif;background:var(--bg);color:var(--fg)}
.light{--bg:#fff;--fg:#1f2328;--muted:#636c76;--border:#d1d9e0;--link:#0969da;--subtle:#f6f8fa;color-scheme:light}
.dark{--bg:#0d1117;--fg:#e6edf3;--muted:#9198a1;--border:#30363d;--link:#4493f8;--subtle:#161b22;color-scheme:dark}
a{color:var(--link);text-decoration:none}a:hover{text-decoration:underline}
.notice{max-width:1240px;margin:20px auto 0;padding:10px 16px;border:1px solid var(--border);border-radius:6px;background:var(--subtle);color:var(--muted);font-size:12px}
.layout{max-width:1240px;margin:26px auto 40px;display:grid;grid-template-columns:248px minmax(0,1fr);gap:28px}.sidebar{padding-top:16px}.avatar{width:248px;height:248px;border-radius:50%;border:1px solid var(--border)}.name{font-size:26px;line-height:1.3;margin:16px 0 0;font-weight:600}.handle{font-size:20px;color:var(--muted)}.bio{margin-top:24px}.sidebar .small{font-size:12px;color:var(--muted)}.tabs{height:50px;display:flex;gap:30px;font-size:14px;color:var(--muted)}.active{color:var(--fg);padding:0 14px 14px;border-bottom:2px solid #f78166;font-weight:600}
main{border:1px solid var(--border);border-radius:7px;padding:24px 31px 28px;min-width:0}.filename{font:12px ui-monospace,monospace;margin-bottom:22px;color:var(--muted)}.markdown-body{word-wrap:break-word}.markdown-body p{margin:0 0 16px}.markdown-body h2{margin:24px 0 16px;padding-bottom:.3em;font-size:24px;line-height:1.25;font-weight:600;border-bottom:1px solid var(--border)}.markdown-body img{max-width:100%;height:auto;vertical-align:middle;box-sizing:content-box}.markdown-body picture{display:block;margin-bottom:22px}.markdown-body p:has(img[src*="labels/"]){line-height:2.6}.markdown-body p img[src*="labels/"]{margin:3px 2px 0 0}.pin-title{margin:22px 0 10px;font-size:14px;color:var(--muted)}.pin{border:1px solid var(--border);border-radius:6px;padding:16px;max-width:440px;font-size:14px}.pin p{font-size:12px;color:var(--muted);margin:9px 0 0}.lang{display:inline-block;width:11px;height:11px;border-radius:50%;background:#3572a5;margin-right:5px}
@media(max-width:800px){.notice{margin:12px 12px 0}.layout{display:block;margin:18px 12px}.sidebar{display:grid;grid-template-columns:62px 1fr;column-gap:14px;padding:0;margin-bottom:20px}.avatar{width:62px;height:62px;grid-row:1/4}.name{font-size:22px;margin:0}.handle{font-size:15px;margin:0}.bio{grid-column:1/-1;margin:12px 0 0}.sidebar .small{display:none}.tabs{gap:17px;height:42px;font-size:13px}main{padding:18px 16px}.filename{margin-bottom:16px}.markdown-body h2{font-size:22px}.markdown-body{font-size:15px}.pin{max-width:none}}
'''


def preview(folder, fragment, label):
    for theme in ['light', 'dark']:
        (folder / f'preview-{theme}.html').write_text(f'''<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{label} · local preview</title><style>{CSS}</style></head>
<body class="{theme}"><div class="notice">{label} · 本地近似 GitHub 预览 · 未发布 · 动画请在此页面查看</div>
<div class="layout"><aside class="sidebar"><img class="avatar" src="./assets/avatar.png" alt="Current GitHub avatar"><div class="name">Chikee</div><div class="handle">imchikee</div><p class="bio">Don't know C++</p><div class="small">现有头像与 Bio</div></aside>
<div><nav class="tabs"><span class="active">Overview</span><span>Repositories</span><span>Stars</span></nav><main><div class="filename">imchikee / README.md</div><article class="markdown-body">{fragment}</article></main>
<div class="pin-title">Pinned</div><div class="pin"><a href="https://github.com/imchikee/utopia"><strong>utopia</strong></a><p>Agent-readable, reproducible Linux workstation engineering.</p><p><span class="lang"></span>Python</p></div></div></div></body></html>''')


def comparison_page():
    (ROOT / 'index.html').write_text('''<!doctype html>
<html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>现版 / 深化试稿 · 本地对照</title><style>
*{box-sizing:border-box}body{margin:0;background:#f3f5f7;color:#263241;font:15px/1.65 system-ui,sans-serif}header{padding:30px 4vw 24px;background:#fff;border-bottom:1px solid #d5dce4}h1{font-size:26px;margin:0 0 6px}header p{margin:0;max-width:1000px;color:#526172}.controls{display:flex;gap:12px;flex-wrap:wrap;margin-top:20px}fieldset{border:0;padding:0;margin:0;display:flex;gap:4px}legend{position:absolute;clip-path:inset(50%);width:1px;height:1px;overflow:hidden}button{cursor:pointer;border:1px solid #c5cfda;border-radius:6px;background:#fff;padding:7px 14px;font:inherit;color:#314354}button[aria-pressed=true]{background:#172c35;color:#a5e5d4;border-color:#172c35}.columns{display:grid;grid-template-columns:1fr 1fr;gap:24px;padding:24px 3vw 40px;align-items:start}section{min-width:0;background:#fff;border:1px solid #d5dce4;border-radius:10px;overflow:hidden}h2{font-size:18px;margin:0}section>div{padding:16px 20px;border-bottom:1px solid #d5dce4}section p{margin:3px 0 0;color:#526172;font-size:13px}section img{display:block;width:100%;height:auto}section a{color:#0969da}footer{padding:0 4vw 35px;color:#526172;font-size:13px}body.dark{background:#0d1117;color:#e6edf3}body.dark header,body.dark section{background:#161b22;border-color:#30363d}body.dark section>div{border-color:#30363d}body.dark header p,body.dark section p,body.dark footer{color:#a0acba}body.dark a{color:#7eb8ff}body.mobile section img{width:auto;max-width:100%;margin:auto}a:focus-visible,button:focus-visible{outline:3px solid #ef8f63;outline-offset:3px}@media(max-width:760px){.columns{grid-template-columns:1fr;padding:16px}header{padding:24px 20px}h1{font-size:22px}}
</style></head><body><header><h1>现版 / 深化试稿</h1><p>沿用终端配色、双卡片与动态表达，比较横幅及中段内容的变化。两侧使用同一近似 GitHub 外框。此页图片为截帧，点击进入 HTML 可查看动画。</p><div class="controls"><fieldset aria-label="主题"><legend>主题</legend><button data-theme="light" aria-pressed="true">浅色</button><button data-theme="dark" aria-pressed="false">深色</button></fieldset><fieldset aria-label="比较范围"><legend>比较范围</legend><button data-view="readme" aria-pressed="true">README</button><button data-view="middle" aria-pressed="false">只看中段</button><button data-view="full" aria-pressed="false">整页</button><button data-view="mobile" aria-pressed="false">手机</button></fieldset></div></header><div class="columns">
<section><div><h2>现版</h2><p>原 README 与素材快照 · <a id="old-link" href="./baseline/preview-light.html">打开动态预览 ↗</a></p></div><a id="old-image-link" href="./baseline/preview-light.html"><img id="old" src="./baseline/readme-light.png" alt="现版 README 本地预览截图"></a></section>
<section><div><h2>深化试稿</h2><p>新增内容窗口、工程流程与工作台插画 · <a id="new-link" href="./preview-light.html">打开动态预览 ↗</a></p></div><a id="new-image-link" href="./preview-light.html"><img id="new" src="./readme-light.png" alt="深化试稿 README 本地预览截图"></a></section></div><footer>未发布，未修改主页仓库。英文措辞、图形与幽默均为候选。本地截图无法证明 GitHub 线上所有浏览器的渲染效果。</footer><script>
let theme='light',view='readme';
function refresh(){document.body.className=[theme,view==='mobile'?'mobile':''].join(' ');for(const [id,base] of [['old','./baseline/'],['new','./']]){document.getElementById(id).src=base+view+'-'+theme+'.png';for(const suffix of ['-link','-image-link'])document.getElementById(id+suffix).href=base+'preview-'+theme+'.html';}document.querySelectorAll('[data-theme]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.theme===theme)));document.querySelectorAll('[data-view]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.view===view)));}
document.querySelectorAll('[data-theme]').forEach(b=>b.onclick=()=>{theme=b.dataset.theme;refresh()});document.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>{view=b.dataset.view;refresh()});
const q=new URLSearchParams(location.search);if(q.get('theme')==='dark')theme='dark';if(['readme','middle','full','mobile'].includes(q.get('view')))view=q.get('view');refresh();
</script></body></html>''')


def build():
    baseline = ROOT / 'baseline'
    baseline.mkdir(parents=True, exist_ok=True)
    for folder in [ROOT, baseline]:
        assets = folder / 'assets'
        assets.mkdir(exist_ok=True)
        for name in ['contributions.svg', 'contributions-dark.svg']:
            shutil.copyfile(SOURCE / name, assets / name)
        shutil.copyfile(AVATAR, assets / 'avatar.png')
    for name in ['header.svg', 'typing.svg', 'engineering.svg', 'interests.svg']:
        shutil.copyfile(SOURCE / name, baseline / 'assets' / name)
    shutil.copytree(SOURCE / 'icons', baseline / 'assets' / 'icons', dirs_exist_ok=True)
    old = (RESEARCH / 'homepage-before.md').read_text()
    (baseline / 'README.md').write_text(old)
    old_fragment = baseline_fragment(old)
    (baseline / 'fragment.html').write_text(old_fragment)
    preview(baseline, old_fragment, '现版快照')
    assets = ROOT / 'assets'
    (assets / 'header.svg').write_text(header())
    (assets / 'header-mobile.svg').write_text(header(True))
    (assets / 'engineering.svg').write_text(engineering())
    (assets / 'workbench.svg').write_text(workbench())
    (assets / 'labels').mkdir(exist_ok=True)
    for key, name in [('c','C'),('cpp','C++'),('python','Python'),('shell','Shell'),('linux','Linux'),('qnx','QNX'),('cmake','CMake'),('conan','Conan'),('bazel','Bazel'),('git','Git')]:
        (assets / 'labels' / f'{key}.svg').write_text(label(key, name))
    shutil.copyfile(SOURCE / 'icons' / 'DEVICON-LICENSE', assets / 'DEVICON-LICENSE')
    text = readme()
    (ROOT / 'README.md').write_text(text)
    (ROOT / 'fragment.html').write_text(text)
    preview(ROOT, text, '现版深化 · 本地试稿')
    comparison_page()
    for path in ROOT.rglob('*.svg'):
        ET.parse(path)
    print('Built baseline, proposal and comparison; all SVG XML parsed.')


if __name__ == '__main__':
    build()
