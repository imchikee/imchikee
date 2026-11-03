"""Build two local, README-compatible profile candidates; never publish them."""

from html import escape
from pathlib import Path
import re
import shutil

from markdown_it import MarkdownIt

ROOT = Path(__file__).resolve().parent
PROFILE = Path('/home/chikee/code/imchikee')
AVATAR = ROOT.parent / 'compact-personal/assets/avatar.png'
MONO = 'ui-monospace,DejaVu Sans Mono,monospace'
SANS = 'Arial,Helvetica,sans-serif'


def svg(body, width, height):
    return f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}">{body}</svg>\n'


def personal_header():
    return svg(f'''
<defs><pattern id="paper" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".8" fill="#d6c8b4" opacity=".55"/></pattern></defs>
<rect x="1" y="1" width="998" height="358" rx="20" fill="#fff5e5" stroke="#d9cbb9" stroke-width="2"/>
<rect x="2" y="2" width="996" height="356" rx="19" fill="url(#paper)"/>
<g fill="#533e32">
<text x="42" y="47" font-family="{MONO}" font-size="14" letter-spacing="2">A LITTLE CORNER OF THE INTERNET</text>
<text x="38" y="134" font-family="Georgia,serif" font-size="62">Hi, I'm</text>
<text x="35" y="228" font-family="Georgia,serif" font-weight="bold" font-size="100" letter-spacing="-4">Chikee.</text>
</g>
<path d="M44 251 Q176 239 332 249" stroke="#dc8a59" stroke-width="6" fill="none" stroke-linecap="round"/>
<text x="43" y="302" fill="#6d7567" font-family="{SANS}" font-size="20">Software, systems &amp; things worth tinkering with.</text>
<g transform="translate(561 40)">
<path d="M28 261 Q-5 188 34 111 Q70 50 151 37 Q230 5 318 56 Q403 116 368 229 Q334 287 221 280Z" fill="#e5e7d4"/>
<g transform="rotate(-6 92 80)">
<rect x="11" y="29" width="171" height="148" rx="9" fill="#fffdf4" stroke="#9aa58a" stroke-width="2"/>
<path d="M11 57H182" stroke="#c4cdb4" stroke-width="2"/>
<circle cx="27" cy="43" r="3" fill="#da9466"/><circle cx="39" cy="43" r="3" fill="#b8c0a6"/>
<text x="27" y="84" font-family="{MONO}" font-size="13" fill="#68775c">notes &amp; experiments</text>
<path d="M29 108H69M29 108V143H69M69 108H105M69 143H113" fill="none" stroke="#b3bea2" stroke-width="3"/>
<rect x="108" y="99" width="44" height="16" rx="4" fill="#eddfbe"/>
<rect x="116" y="135" width="36" height="16" rx="4" fill="#dbe0cb"/>
</g>
<g transform="rotate(9 322 66)">
<path d="M266 7H358V102L341 119H266Z" fill="#f6d587" stroke="#d9b265" stroke-width="1.5"/>
<path d="M341 102H358L341 119Z" fill="#e2ba69"/>
<path d="M291 4L325 0L329 16L295 20Z" fill="#f2c09b" opacity=".8"/>
<text x="281" y="45" font-family="{MONO}" font-size="22" fill="#765331">C++</text>
<text x="280" y="69" font-family="{SANS}" font-size="15" fill="#765331">still learning.</text>
</g>
<path d="M105 274H370" stroke="#ae8666" stroke-width="5" stroke-linecap="round"/>
<g stroke="#987157" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
<ellipse cx="249" cy="193" rx="68" ry="73" fill="#fffaf0"/>
<circle cx="205" cy="116" r="21" fill="#c49a78"/>
<circle cx="281" cy="109" r="21" fill="#c49a78"/>
<circle cx="205" cy="116" r="9" fill="#e6bdaf" stroke="none"/>
<circle cx="281" cy="109" r="9" fill="#e6bdaf" stroke="none"/>
<path d="M180 170Q174 129 211 120Q246 102 282 119Q311 124 317 157Q328 187 305 201Q279 219 239 212Q190 214 180 170Z" fill="#fffaf0"/>
<path d="M211 121Q224 109 243 116Q254 119 261 133Q246 148 231 150Q212 142 211 121Z" fill="#c49a78" stroke="none"/>
<path d="M222 157V165M267 155V163"/>
<path d="M239 169L246 168L243 173Z" fill="#987157" stroke="none"/>
<path d="M243 174Q237 183 231 176M243 174Q250 182 255 175" stroke-width="3" fill="none"/>
<ellipse cx="205" cy="178" rx="10" ry="6" fill="#eac5b8" stroke="none"/>
<ellipse cx="284" cy="175" rx="10" ry="6" fill="#eac5b8" stroke="none"/>
<path d="M199 205Q181 203 176 220M289 203Q310 202 314 220" fill="none"/>
</g>
<path d="M152 213H308L299 265H162Z" fill="#809184" stroke="#5f7267" stroke-width="3" stroke-linejoin="round"/>
<path d="M140 265H318L308 273H151Z" fill="#a6b3a5" stroke="#5f7267" stroke-width="2"/>
<path d="M221 233L230 242L221 250M239 250H249" fill="none" stroke="#edf0db" stroke-width="3" stroke-linecap="round"/>
<rect x="342" y="234" width="27" height="36" rx="5" fill="#df9c70" stroke="#b97851" stroke-width="2"/>
<path d="M369 241Q387 238 383 251Q382 258 369 256" fill="none" stroke="#b97851" stroke-width="3"/>
</g>
<g stroke="#da9865" stroke-width="2" fill="none"><path d="M532 73V91M523 82H541"/><path d="M940 286V300M933 293H947"/></g>
''', 1000, 360)


PIXELS = {
    'C': ['01111','11000','11000','11000','11000','11000','01111'],
    'H': ['11011','11011','11011','11111','11011','11011','11011'],
    'I': ['11111','00100','00100','00100','00100','00100','11111'],
    'K': ['11011','11010','11100','11100','11010','11011','11011'],
    'E': ['11111','11000','11000','11110','11000','11000','11111'],
}


def pixel_word(word, x, y, size, color):
    out = []
    for i, char in enumerate(word):
        for row, line in enumerate(PIXELS[char]):
            for col, bit in enumerate(line):
                if bit == '1':
                    out.append(f'<rect x="{x+(i*6+col)*size}" y="{y+row*size}" width="{size}" height="{size}" fill="{color}"/>')
    return ''.join(out)


def retro_header():
    hamster = [
        '       bb    bb      ',
        '      bppb  bppb     ',
        '      bppbbbbppb     ',
        '     bbwwbbbbwwwb    ',
        '    bwwwwbbwwwwwb    ',
        '   bwwwwwwwwwwwwb    ',
        '  bwwwkw wwwkwwwb    ',
        '  bwwwwwbwwwwwwwb    ',
        '  bwpwwwbwwwpwwwb    ',
        '   bwwwwwwwwwwwb     ',
        '    bwwwwwwwwwb      ',
        '  bbwwwwwwwwwwb      ',
        ' bwwwwwwwwwwwwwb     ',
        ' bwwwwwwwwwwwwb      ',
        '  bbbbwwwwwwbb       ',
        '    bwwbbwwwb        ',
        '    bbbb bbbb        ',
    ]
    colors = {'b':'#805d45','p':'#e8b4aa','w':'#fff9e9','k':'#302239'}
    sprite = ''.join(f'<rect x="{732+c*9}" y="{82+r*9}" width="9" height="9" fill="{colors[ch]}"/>'
                     for r,row in enumerate(hamster) for c,ch in enumerate(row) if ch in colors)
    letters = pixel_word('CHIKEE', 42, 91, 10, '#42345b')
    return svg(f'''
<rect x="9" y="9" width="986" height="365" fill="#2f2741"/>
<path d="M3 3H985V364H3Z" fill="#ebe3fa" stroke="#342843" stroke-width="5"/>
<path d="M7 7H981V44H7Z" fill="#746293"/>
<text x="22" y="32" font-family="{MONO}" font-size="17" fill="#ffffff">chikee.home</text>
<g stroke="#33273f" stroke-width="2"><path d="M896 14H916V34H896Z M924 14H944V34H924Z M952 14H972V34H952Z" fill="#dcd2eb"/>
<path d="M900 29H912M929 18H939V29H929ZM957 19L967 29M967 19L957 29"/></g>
<text x="43" y="75" fill="#6e5b82" font-family="{MONO}" font-size="13" letter-spacing="2">WELCOME TO MY PERSONAL HOMEPAGE</text>
{letters}
<text x="44" y="194" fill="#4e3f5c" font-family="{MONO}" font-size="18">Software engineer. Linux tinkerer.</text>
<text x="44" y="229" fill="#6d5c7d" font-family="{MONO}" font-size="16">Make yourself at /home.</text>
<rect x="701" y="66" width="257" height="184" fill="#fff9ed" stroke="#79668d" stroke-width="2"/>
<path d="M711 76H948M711 76V240" stroke="#cdbfd8" stroke-width="3" fill="none"/>
{sprite}
<path d="M720 188H738M714 199H732M720 210H738" fill="none" stroke="#b89471" stroke-width="3"/>
<path d="M30 274H958V334H30Z" fill="#fff0b6" stroke="#77603f" stroke-width="2"/>
<path d="M47 315L62 289L77 315Z" fill="#e4ad44" stroke="#7d622d" stroke-width="2"/>
<path d="M62 298V305M62 309V311" stroke="#76532a" stroke-width="2"/>
<text x="93" y="311" font-family="{MONO}" font-size="21" fill="#6c5030">C++ knowledge: under construction</text>
<rect x="907" y="294" width="27" height="18" fill="#6c5030"><animate attributeName="opacity" values="1;1;0;0" dur="1.8s" repeatCount="indefinite"/></rect>
''', 1000, 380)


def tag(name, retro):
    width = max(72, 32 + len(name)*9)
    if retro:
        art = f'''<path d="M4 4H{width-1}V31H4Z" fill="#342843"/>
<path d="M1 1H{width-4}V28H1Z" fill="#e7dff2" stroke="#746284"/>
<path d="M3 26V3H{width-6}" fill="none" stroke="#fffafc" stroke-width="2"/>
<path d="M8 11H12V15H16V19H12V15H8Z" fill="#827093"/>
<text x="24" y="20" font-family="{MONO}" font-size="14" fill="#40324d">{escape(name)}</text>'''
    else:
        art = f'''<rect x="1" y="1" width="{width-2}" height="28" rx="8" fill="#f5eddf" stroke="#d9cbb8"/>
<circle cx="13" cy="15" r="3" fill="#8b9c81"/>
<text x="24" y="20" font-family="{MONO}" font-size="14" fill="#5b4737">{escape(name)}</text>'''
    return svg(art,width,32)


def footer(retro):
    if retro:
        return svg(f'''<path d="M0 2H1000" stroke="#857095" stroke-width="2" stroke-dasharray="8 5"/>
<rect x="0" y="20" width="167" height="26" fill="#e8dff1" stroke="#8b7799"/>
<text x="11" y="38" font-family="{MONO}" font-size="13" fill="#564263">THANKS FOR VISITING</text>
<text x="1000" y="38" text-anchor="end" font-family="{MONO}" font-size="13" fill="#8e7a9e">/home/chikee</text>''',1000,55)
    return svg(f'''<path d="M0 4Q250 0 500 4T1000 4" fill="none" stroke="#c6b396" stroke-width="2"/>
<text x="500" y="39" text-anchor="middle" font-family="Georgia,serif" font-style="italic" font-size="20" fill="#a38a6b">Thanks for stopping by. See you around.</text>''',1000,55)


def readme(retro):
    headings = ['About','Workbench','Tools','Commit trail'] if retro else ['A little about me','On my workbench','Tools I reach for','A trail of commits']
    nav = '<p align="center"><a href="#about">about.txt</a> &nbsp; / &nbsp; <a href="#workbench">workbench/</a> &nbsp; / &nbsp; <a href="#tools">tools/</a> &nbsp; / &nbsp; <a href="#commit-trail">commits.log</a></p>\n\n' if retro else ''
    group1 = ' '.join(f'<img src="./assets/labels/{key}.svg" alt="{name}" />' for key,name in [('c','C'),('cpp','C++'),('python','Python'),('shell','Shell')])
    group2 = ' '.join(f'<img src="./assets/labels/{key}.svg" alt="{name}" />' for key,name in [('linux','Linux'),('qnx','QNX'),('cmake','CMake'),('conan','Conan'),('bazel','Bazel'),('git','Git')])
    return f'''<p><img src="./assets/header.svg" width="100%" alt="Chikee's personal corner of the internet" /></p>

{nav}## {headings[0]}

I'm **Chikee**, a software engineer working with **C/C++, embedded systems, and software architecture**.

Much of my work is about getting software to build, run, and work across different platforms. **Linux and QNX** are familiar territory.

## {headings[1]}

Here on GitHub, I tinker with **Linux workstations and developer tools** — how a development environment looks, feels, and fits together.

Some of that tinkering lives in **[utopia →](https://github.com/imchikee/utopia)**, my project for reproducible Linux workstation setups.

## {headings[2]}

**Languages**

<p>{group1}</p>

**Platforms &amp; build tools**

<p>{group2}</p>

## {headings[3]}

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="./assets/contributions-dark.svg" />
  <source media="(prefers-color-scheme: light)" srcset="./assets/contributions.svg" />
  <img src="./assets/contributions.svg" width="100%" alt="An animated snake tracing my GitHub contribution graph" />
</picture>

<p><img src="./assets/footer.svg" width="100%" alt="Thanks for visiting" /></p>
'''


CSS = '''
*{box-sizing:border-box}body{margin:0;font:16px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI",Arial,sans-serif;background:var(--bg);color:var(--fg)}
.light{--bg:#ffffff;--fg:#1f2328;--muted:#636c76;--border:#d1d9e0;--link:#0969da;--subtle:#f6f8fa;color-scheme:light}
.dark{--bg:#0d1117;--fg:#e6edf3;--muted:#9198a1;--border:#30363d;--link:#4493f8;--subtle:#161b22;color-scheme:dark}
a{color:var(--link);text-decoration:none}a:hover{text-decoration:underline}.notice{max-width:1240px;margin:22px auto 0;padding:10px 16px;background:var(--subtle);border:1px solid var(--border);border-radius:6px;color:var(--muted);font-size:12px}
.layout{max-width:1240px;margin:28px auto 40px;display:grid;grid-template-columns:248px minmax(0,1fr);gap:28px}.sidebar{padding-top:16px}.avatar{width:248px;height:248px;border-radius:50%;border:1px solid var(--border)}.name{font-size:26px;line-height:1.3;margin:16px 0 0;font-weight:600}.handle{color:var(--muted);font-size:20px;margin-bottom:18px}.bio{margin:16px 0}.small{font-size:14px;color:var(--muted)}.tabs{height:50px;display:flex;align-items:start;gap:30px;font-size:14px;color:var(--muted)}.active{color:var(--fg);padding:0 14px 14px;border-bottom:2px solid #f78166;font-weight:600}
main{border:1px solid var(--border);border-radius:7px;padding:24px 31px 26px;min-width:0}.filename{font:12px ui-monospace,monospace;margin-bottom:22px;color:var(--muted)}.markdown-body{word-wrap:break-word}.markdown-body p{margin:0 0 16px}.markdown-body h2{margin:24px 0 16px;padding-bottom:.3em;font-size:24px;line-height:1.25;font-weight:600;border-bottom:1px solid var(--border)}.markdown-body h3{font-size:20px;margin:24px 0 16px}.markdown-body img{max-width:100%;height:auto;vertical-align:middle;box-sizing:content-box}.markdown-body>p:first-child{margin-bottom:22px}.markdown-body a img{border:0}.markdown-body p img[src*="labels/"]{margin:0 3px 5px 0}.markdown-body p:has(img[src*="labels/"]){line-height:2.2}.markdown-body picture{display:block;margin-bottom:22px}.markdown-body .heading-element{display:inline}.markdown-body .anchor{display:none}.markdown-body .markdown-heading{position:relative}.markdown-body .markdown-heading h2{margin-top:24px}.pin-title{margin:22px 0 10px;font-size:14px;color:var(--muted)}.pin{border:1px solid var(--border);border-radius:6px;padding:16px;max-width:440px;font-size:14px}.pin p{font-size:12px;color:var(--muted);margin:9px 0 0}.pin .lang{display:inline-block;width:11px;height:11px;border-radius:50%;background:#3572a5;margin-right:5px}.pagefoot{text-align:center;color:var(--muted);font-size:12px;margin:36px 0}
@media(max-width:800px){.notice{margin:12px 12px 0}.layout{display:block;margin:18px 12px}.sidebar{display:grid;grid-template-columns:62px 1fr;column-gap:14px;padding:0;margin-bottom:20px}.avatar{width:62px;height:62px;grid-row:1/4}.name{font-size:22px;margin:0}.handle{font-size:15px;margin:0}.bio{grid-column:1/-1;margin:12px 0 0}.sidebar .small{display:none}.tabs{gap:17px;height:42px;font-size:13px}main{padding:18px 16px}.filename{margin-bottom:16px}.markdown-body h2{font-size:22px}.markdown-body{font-size:15px}.markdown-body p img[src*="labels/"]{margin-right:1px}.pin{max-width:none}}
'''


def previews():
    for name,label in [('A','A · 插画个人空间'),('C','C · 复古个人站')]:
        folder = ROOT/name
        fragment = (folder/'fragment.html').read_text()
        for theme in ['light','dark']:
            html = f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{label} — local preview</title><style>{CSS}</style></head>
<body class="{theme}"><div class="notice">{label} · 本地候选，未发布 · 本地 Markdown 渲染＋近似 GitHub 外框 · 动画请打开 HTML 查看</div>
<div class="layout"><aside class="sidebar"><img class="avatar" src="./assets/avatar.png" alt="Current GitHub avatar"><div class="name">Chikee</div><div class="handle">imchikee</div><p class="bio">Don't know C++</p><div class="small">Profile avatar and bio unchanged</div></aside>
<div><nav class="tabs"><span class="active">Overview</span><span>Repositories</span><span>Stars</span></nav><main><div class="filename">imchikee / README.md</div><article class="markdown-body">{fragment}</article></main>
<div class="pin-title">Pinned</div><div class="pin"><a href="https://github.com/imchikee/utopia"><strong>utopia</strong></a><p>Agent-readable, reproducible Linux workstation engineering.</p><p><span class="lang"></span>Python</p></div></div></div><div class="pagefoot">Local design preview · imchikee</div></body></html>'''
            (folder/f'preview-{theme}.html').write_text(html)


def build():
    for name, retro in [('A',False),('C',True)]:
        folder = ROOT/name
        assets = folder/'assets'
        labels = assets/'labels'
        labels.mkdir(parents=True,exist_ok=True)
        (assets/'header.svg').write_text(retro_header() if retro else personal_header())
        (assets/'footer.svg').write_text(footer(retro))
        for key,text in [('c','C'),('cpp','C++'),('python','Python'),('shell','Shell'),('linux','Linux'),('qnx','QNX'),('cmake','CMake'),('conan','Conan'),('bazel','Bazel'),('git','Git')]:
            (labels/f'{key}.svg').write_text(tag(text,retro))
        for filename in ['contributions.svg','contributions-dark.svg']:
            shutil.copyfile(PROFILE/'assets'/filename,assets/filename)
        shutil.copyfile(AVATAR,assets/'avatar.png')
        text = readme(retro)
        (folder/'README.md').write_text(text)
        md = MarkdownIt('commonmark', {'html':True})
        tokens = md.parse(text)
        for index,token in enumerate(tokens):
            if token.type == 'heading_open':
                slug = re.sub(r'[^a-z0-9 -]', '', tokens[index+1].content.lower()).replace(' ','-')
                token.attrSet('id',slug)
        (folder/'fragment.html').write_text(md.renderer.render(tokens,md.options,{}))
        request_file = folder/'render-request.json'
        if request_file.exists():
            request_file.unlink()
    previews()


if __name__ == '__main__':
    build()
