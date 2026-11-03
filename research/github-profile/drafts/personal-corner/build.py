"""Build one personal README around the avatar, self-deprecation, and real work."""

from pathlib import Path
from html import escape
import importlib.util
import re
import shutil
import xml.etree.ElementTree as ET
import book_motion

ROOT = Path(__file__).resolve().parent
spec = importlib.util.spec_from_file_location('profile_base', ROOT.parent/'current-evolution/build.py')
base = importlib.util.module_from_spec(spec)
spec.loader.exec_module(base)
SANS = 'Arial,DejaVu Sans,sans-serif'
MONO = 'DejaVu Sans Mono,Consolas,monospace'


def svg(body, width, height, title):
    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}" role="img" aria-labelledby="title"><title id="title">{escape(title)}</title>{body}</svg>\n'''


def colors(dark):
    return dict(ink='#eff4ed' if dark else '#183f3d', muted='#b0c0bd' if dark else '#5b716d',
                accent='#e6b86c' if dark else '#ad732b', mint='#8dcfba' if dark else '#357e6b',
                rule='#2c4445' if dark else '#dbe6e0', pale='#142326' if dark else '#f0f5f0')


def hero(dark=False, mobile=False):
    c=colors(dark)
    motion=book_motion.scene()
    if mobile:
        return svg(f'''
<text x="24" y="35" fill="{c['mint']}" font-family="{MONO}" font-size="13" letter-spacing="2">HELLO, I'M</text>
<text x="18" y="124" fill="{c['ink']}" font-family="{SANS}" font-size="88" font-weight="750" letter-spacing="-5">Chikee<tspan fill="{c['accent']}">.</tspan></text>
<text x="24" y="169" fill="{c['ink']}" font-family="{SANS}" font-size="24">Software, close to the system.</text>
<text x="24" y="205" fill="{c['muted']}" font-family="{SANS}" font-size="19">Still learning.</text>
<path d="M25 225Q130 214 221 222" fill="none" stroke="{c['mint']}" stroke-width="2.5" stroke-linecap="round"/>
<svg x="-8" y="232" width="536" height="357.33" viewBox="0 0 720 480">{motion}</svg>
<path d="M25 583H495" stroke="{c['rule']}"/>
''',520,600,'Chikee. Software, close to the system. Still learning. A surprised hamster is squashed by a falling C++ textbook, then gives a strained thumbs-up.')
    return svg(f'''
<text x="38" y="57" fill="{c['mint']}" font-family="{MONO}" font-size="15" letter-spacing="2.5">HELLO, I'M</text>
<text x="30" y="181" fill="{c['ink']}" font-family="{SANS}" font-size="122" font-weight="750" letter-spacing="-7">Chikee<tspan fill="{c['accent']}">.</tspan></text>
<text x="38" y="241" fill="{c['ink']}" font-family="{SANS}" font-size="27">Software, close to the system.</text>
<text x="38" y="286" fill="{c['muted']}" font-family="{SANS}" font-size="22">Still learning.</text>
<path d="M39 315Q203 303 338 313" fill="none" stroke="{c['mint']}" stroke-width="3" stroke-linecap="round"/>
<svg x="484" y="-14" width="714" height="476" viewBox="0 0 720 480">{motion}</svg>
<path d="M38 439H1162" stroke="{c['rule']}"/>
''',1200,456,'Chikee. Software, close to the system. Still learning. A surprised hamster is squashed by a falling C++ textbook, then gives a strained thumbs-up.')


def icon(name,x,y,size=27):
    raw=(base.SOURCE/'icons'/f'{name}.svg').read_text()
    match=re.search(r'<svg\b([^>]*)>([\s\S]*)</svg>',raw)
    viewbox=re.search(r'viewBox="([^"]+)"',match[1])[1]
    return f'<svg x="{x}" y="{y}" width="{size}" height="{size}" viewBox="{viewbox}">{match[2]}</svg>'


def tools(dark=False,mobile=False):
    c=colors(dark)
    if mobile:
        body=f'''
<path d="M25 110H495M25 225H495" stroke="{c['rule']}"/>
<g font-family="{MONO}" font-size="13" fill="{c['muted']}" letter-spacing="1.2">
<text x="25" y="31">LANGUAGES</text><text x="25" y="147">SYSTEMS</text><text x="25" y="264">BUILD &amp; VERSIONING</text></g>
{icon('cpp',25,54,30)}{icon('python',195,54,30)}{icon('terminal',352,54,30)}{icon('linux',25,170,30)}{icon('cmake',25,287,30)}{icon('git',205,337,30)}
<g font-family="{SANS}" font-size="26" fill="{c['ink']}">
<text x="68" y="79">C/C++</text><text x="238" y="79">Python</text><text x="395" y="79">Shell</text>
<text x="68" y="195">Linux</text><text x="238" y="195">QNX</text>
<text x="68" y="312">CMake</text><text x="260" y="312">Conan</text>
<text x="68" y="362">Bazel</text><text x="248" y="362">Git</text></g>
'''
        return svg(body,520,388,'Familiar pieces: C, C++, Python, Shell; Linux and QNX; CMake, Conan, Bazel and Git.')
    body=f'''
<path d="M374 21V153M743 21V153" stroke="{c['rule']}"/>
<g font-family="{MONO}" font-size="12" fill="{c['muted']}" letter-spacing="1.3">
<text x="25" y="28">LANGUAGES</text><text x="407" y="28">SYSTEMS</text><text x="779" y="28">BUILD &amp; VERSIONING</text></g>
{icon('c',25,55)}{icon('cpp',143,55)}{icon('python',25,111)}{icon('terminal',205,111)}{icon('linux',407,55)}{icon('cmake',779,55)}{icon('git',962,111)}
<g font-family="{SANS}" font-size="24" fill="{c['ink']}">
<text x="67" y="78">C</text><text x="185" y="78">C++</text><text x="67" y="134">Python</text><text x="247" y="134">Shell</text>
<text x="449" y="78">Linux</text><text x="449" y="134">QNX</text>
<text x="821" y="78">CMake</text><text x="976" y="78">Conan</text>
<text x="821" y="134">Bazel</text><text x="1004" y="134">Git</text></g>
'''
    return svg(body,1150,174,'Familiar pieces: C, C++, Python, Shell; Linux and QNX; CMake, Conan, Bazel and Git.')


def workbench(dark=False,mobile=False):
    c=colors(dark)
    terminal=f'''
<rect width="172" height="109" rx="10" fill="#183437" stroke="#4b6b64"/>
<path d="M0 28H172" stroke="#3b5955"/>
<circle cx="17" cy="15" r="3" fill="#d3997c"/><circle cx="28" cy="15" r="3" fill="#ddbc76"/><circle cx="39" cy="15" r="3" fill="#91cbb3"/>
<path d="m19 49 9 8-9 8" stroke="#99d2b8" stroke-width="2.4" fill="none" stroke-linecap="round"/>
<path d="M43 58H105M19 83H78M91 83H136" stroke="#849b99" stroke-width="3" stroke-linecap="round"/>
<rect x="115" y="50" width="6" height="15" rx="1" fill="#b5a7df"><animate attributeName="opacity" values="1;1;.1;.1;1" dur="1.7s" repeatCount="indefinite"/></rect>
'''
    if mobile:
        body=f'''
<rect x="1" y="1" width="518" height="260" rx="12" fill="{c['pale']}" stroke="{c['rule']}"/>
<g transform="translate(23 26) scale(.63)">{terminal}</g>
<text x="155" y="42" font-family="{MONO}" font-size="11" letter-spacing="1" fill="{c['muted']}">ON MY WORKBENCH</text>
<g font-family="{SANS}" font-size="27" font-weight="600" fill="{c['ink']}"><text x="155" y="80">Linux, a little</text><text x="155" y="113">more personal.</text></g>
<text x="25" y="162" font-family="{SANS}" font-size="21" fill="{c['muted']}">Desktop workflows, themes &amp; tools.</text>
<text x="25" y="217" font-family="{MONO}" font-size="25" fill="{c['mint']}" font-weight="600">utopia ↗</text>
<path d="M444 204H476M465 193L476 204L465 215" stroke="{c['mint']}" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
'''
        return svg(body,520,262,'On my workbench: Linux, a little more personal. Desktop workflows, themes and tools. Open utopia.')
    body=f'''
<rect x="1" y="1" width="1148" height="169" rx="12" fill="{c['pale']}" stroke="{c['rule']}"/>
<g transform="translate(25 30)">{terminal}</g>
<text x="239" y="42" font-family="{MONO}" font-size="12" fill="{c['muted']}" letter-spacing="1.4">ON MY WORKBENCH</text>
<text x="239" y="88" font-family="{SANS}" font-size="32" font-weight="600" fill="{c['ink']}">Linux, a little more personal.</text>
<text x="239" y="128" font-family="{SANS}" font-size="21" fill="{c['muted']}">Desktop workflows, themes &amp; developer tools.</text>
<path d="M923 35V136" stroke="{c['rule']}"/>
<text x="963" y="96" font-family="{MONO}" font-size="25" fill="{c['mint']}" font-weight="600">utopia ↗</text>
'''
    return svg(body,1150,171,'On my workbench: Linux, a little more personal. Desktop workflows, themes and developer tools. Open utopia.')


def picture(name,alt):
    if name=='hero' and all((ROOT/'assets'/f'hero{suffix}.gif').exists() for suffix in ['-light','-dark','-mobile-light','-mobile-dark']):
        return f'''<picture>
  <source media="(max-width: 600px) and (prefers-color-scheme: dark) and (prefers-reduced-motion: reduce)" srcset="./assets/hero-mobile-dark-still.png" />
  <source media="(max-width: 600px) and (prefers-reduced-motion: reduce)" srcset="./assets/hero-mobile-light-still.png" />
  <source media="(prefers-color-scheme: dark) and (prefers-reduced-motion: reduce)" srcset="./assets/hero-dark-still.png" />
  <source media="(prefers-reduced-motion: reduce)" srcset="./assets/hero-light-still.png" />
  <source media="(max-width: 600px) and (prefers-color-scheme: dark)" srcset="./assets/hero-mobile-dark.gif" />
  <source media="(max-width: 600px)" srcset="./assets/hero-mobile-light.gif" />
  <source media="(prefers-color-scheme: dark)" srcset="./assets/hero-dark.gif" />
  <img src="./assets/hero-light.gif" width="100%" alt="{escape(alt)}" />
</picture>'''
    return f'''<picture>
  <source media="(max-width: 600px) and (prefers-color-scheme: dark)" srcset="./assets/{name}-mobile-dark.svg" />
  <source media="(max-width: 600px)" srcset="./assets/{name}-mobile-light.svg" />
  <source media="(prefers-color-scheme: dark)" srcset="./assets/{name}-dark.svg" />
  <img src="./assets/{name}-light.svg" width="100%" alt="{escape(alt)}" />
</picture>'''


def readme():
    return f'''{picture('hero','Hi, I’m Chikee. Software, close to the system. Still learning. A hamster notices a falling C++ book, gets squashed, then gives a strained thumbs-up.')}

<h3>Where the pieces meet</h3>

<p>I work with <strong>C/C++ and embedded systems</strong> — software architecture, cross-platform integration, and getting things to run on <strong>Linux and QNX</strong>.</p>

<p>I like the part where the pieces have to fit: the build, the deployment, and what actually happens at runtime.</p>

{picture('tools','Familiar tools: C, C++, Python, Shell; Linux and QNX; CMake, Conan, Bazel and Git.')}

<h3>A workbench of my own</h3>

<p>Here on GitHub, I tinker with <strong>Linux workstations and developer tools</strong> — how a development environment looks, feels, and fits together. A current rabbit hole: wallpaper-driven desktop themes.</p>

<a href="https://github.com/imchikee/utopia">
{picture('workbench','utopia — my Linux workstation project. Desktop workflows, themes and developer tools. Open the repository.')}
</a>

<h3>A little trail of activity</h3>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="./assets/contributions-dark.svg" />
  <img src="./assets/contributions.svg" width="100%" alt="My existing animated contribution snake" />
</picture>

<details>
<summary>About that C++ book…</summary>
<p>The book is winning this round.</p>
</details>
'''


def build():
    assets=ROOT/'assets'
    assets.mkdir(parents=True,exist_ok=True)
    for name in ['contributions.svg','contributions-dark.svg']:
        shutil.copyfile(base.SOURCE/name,assets/name)
    shutil.copyfile(base.AVATAR,assets/'avatar.png')
    shutil.copyfile(base.SOURCE/'icons/DEVICON-LICENSE',assets/'DEVICON-LICENSE')
    for name,function in [('hero',hero),('tools',tools),('workbench',workbench)]:
        for dark in [False,True]:
            for mobile in [False,True]:
                suffix=('-mobile' if mobile else '')+('-dark' if dark else '-light')
                (assets/f'{name}{suffix}.svg').write_text(function(dark,mobile))
    text=readme()
    (ROOT/'README.md').write_text(text)
    (ROOT/'fragment.html').write_text(text)
    base.CSS+='''
.markdown-body h3{font-size:20px;line-height:1.3;margin:26px 0 14px;font-weight:600}.markdown-body details{margin:18px 0 2px;color:var(--muted);font-size:14px}.markdown-body summary{cursor:pointer}.markdown-body details p{margin:12px 0 0}.notice a{margin-left:12px}.markdown-body>picture:first-child{margin-bottom:27px}.markdown-body a>picture{margin-top:21px;margin-bottom:25px}
'''
    base.preview(ROOT,text,'Chikee · 个人主页试稿')
    for theme in ['light','dark']:
        file=ROOT/f'preview-{theme}.html'
        html=file.read_text()
        old='Chikee · 个人主页试稿 · 本地近似 GitHub 预览 · 未发布 · 动画请在此页面查看'
        new='个人主页 · 本地预览 <a href="preview-light.html">浅色</a><a href="preview-dark.html">深色</a><a href="mobile-light.png">手机截图</a><a href="animation.html">动画细节</a>'
        file.write_text(html.replace(old,new))
    shutil.copyfile(ROOT/'preview-light.html',ROOT/'index.html')
    (assets/'book-drop/scene.svg').write_text(book_motion.standalone())
    (ROOT/'animation.html').write_text(book_motion.preview_page())
    for path in assets.glob('*.svg'):
        ET.parse(path)
    print('Built one README, responsive artwork and standalone previews.')


if __name__=='__main__':
    build()
