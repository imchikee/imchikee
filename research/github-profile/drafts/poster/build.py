"""Build the local B candidate using README-safe SVG and HTML/Markdown."""

from html import escape
from pathlib import Path
import re
import shutil

from markdown_it import MarkdownIt

ROOT = Path(__file__).resolve().parent
BASE = ROOT.parent / 'ac-comparison/A'
MONO = 'ui-monospace,DejaVu Sans Mono,monospace'
SANS = 'Arial,Helvetica,sans-serif'


def svg(body, width, height):
    return f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}">{body}</svg>\n'


def header():
    return svg(f'''
<defs>
  <clipPath id="typing"><rect x="42" y="256" width="482" height="40">
    <animate attributeName="width" values="482;482;0;0;482;482" keyTimes="0;.1;.28;.35;.75;1" dur="10s" repeatCount="indefinite"/>
  </rect></clipPath>
</defs>
<rect x="1" y="1" width="998" height="368" rx="2" fill="#1c1d20" stroke="#454348" stroke-width="2"/>
<path d="M41 62H958" stroke="#4b4847"/>
<text x="42" y="39" fill="#f08a60" font-family="{MONO}" font-size="14" letter-spacing="1.4">CHIKEE / PERSONAL SPACE</text>
<text x="957" y="39" fill="#c8c1b5" font-family="{MONO}" font-size="13" text-anchor="end">WELCOME IN.</text>
<text x="44" y="103" fill="#aaa69f" font-family="{MONO}" font-size="13" letter-spacing="2.8">SOFTWARE ENGINEER</text>
<text x="35" y="236" fill="#f4eee4" font-family="{SANS}" font-size="145" font-weight="800" letter-spacing="-8">Chikee</text>
<rect x="513" y="215" width="20" height="20" fill="#f08a60"/>
<path d="M930 87H820L758 149V224L820 286H930V235H845L813 203V170L845 138H930Z" fill="#ef875c"/>
<path d="M948 87V138M948 235V286" stroke="#706055" stroke-width="2"/>
<path d="M730 149V224" stroke="#706055" stroke-width="2"/>
<rect x="930" y="164" width="28" height="28" fill="#f4eee4"/>
<path d="M752 308H960" stroke="#4b4847"/>
<text x="752" y="331" fill="#aaa69f" font-family="{MONO}" font-size="12" letter-spacing="1.5">ALWAYS A WORK IN PROGRESS</text>
<g clip-path="url(#typing)">
  <text x="42" y="285" fill="#e8c4a6" font-family="{MONO}" font-size="22" textLength="482" lengthAdjust="spacingAndGlyphs">Building things. Figuring things out.</text>
</g>
<rect x="528" y="263" width="3" height="25" fill="#f08a60">
  <animate attributeName="x" values="528;528;42;42;528;528" keyTimes="0;.1;.28;.35;.75;1" dur="10s" repeatCount="indefinite"/>
  <animate attributeName="opacity" values="1;1;0;0" dur="1.2s" repeatCount="indefinite"/>
</rect>
<path d="M42 317H671" stroke="#4b4847"/>
<text x="42" y="343" fill="#aaa69f" font-family="{MONO}" font-size="13">Some assembly required.</text>
''',1000,370)


def label(name):
    width = max(70, 28+len(name)*9)
    return svg(f'''<rect x=".5" y=".5" width="{width-1}" height="29" fill="#f3eee6" stroke="#d1c8bd"/>
<path d="M1 1V29" stroke="#d9764e" stroke-width="3"/>
<text x="13" y="20" fill="#39312d" font-family="{MONO}" font-size="14">{escape(name)}</text>''',width,30)


def footer():
    return svg(f'''<path d="M0 1H1000" stroke="#b8a795"/>
<rect x="0" y="1" width="52" height="3" fill="#d9764e"/>
<text x="0" y="33" font-family="{MONO}" font-size="13" fill="#aa8a71">CHIKEE</text>
<text x="1000" y="33" text-anchor="end" font-family="{MONO}" font-size="13" fill="#aa8a71">THANKS FOR STOPPING BY.</text>''',1000,48)


def readme():
    languages = [('c','C'),('cpp','C++'),('python','Python'),('shell','Shell')]
    tools = [('linux','Linux'),('qnx','QNX'),('cmake','CMake'),('conan','Conan'),('bazel','Bazel'),('git','Git')]
    def tags(items):
        return ' '.join(f'<img src="./assets/labels/{key}.svg" alt="{name}" />' for key,name in items)
    return f'''<p><img src="./assets/header.svg" width="100%" alt="Chikee — software engineer. Building things. Figuring things out." /></p>

I'm **Chikee**. I work with **systems software** and enjoy understanding how the pieces fit together.

<table width="100%">
<tr>
<td width="50%" valign="top">
<h3>Engineering</h3>
<p><strong>C/C++ · embedded systems</strong></p>
<p>Software architecture, cross-platform builds, deployment, and runtime performance.</p>
</td>
<td width="50%" valign="top">
<h3>Exploring</h3>
<p><strong>Linux · developer tools</strong></p>
<p>Tinkering with workstation setups, desktop workflows, and tools for everyday development.</p>
</td>
</tr>
</table>

Some of that tinkering lives in **[utopia →](https://github.com/imchikee/utopia)**, my project for reproducible Linux workstation setups.

## Tools of the trade

**Languages**

<p>{tags(languages)}</p>

**Platforms &amp; build tools**

<p>{tags(tools)}</p>

## A trail of commits

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="./assets/contributions-dark.svg" />
  <source media="(prefers-color-scheme: light)" srcset="./assets/contributions.svg" />
  <img src="./assets/contributions.svg" width="100%" alt="An animated snake tracing my GitHub contribution graph" />
</picture>

<p><img src="./assets/footer.svg" width="100%" alt="Chikee — thanks for stopping by" /></p>
'''


def build():
    assets = ROOT/'assets'
    labels = assets/'labels'
    labels.mkdir(parents=True,exist_ok=True)
    (assets/'header.svg').write_text(header())
    (assets/'footer.svg').write_text(footer())
    for key,name in [('c','C'),('cpp','C++'),('python','Python'),('shell','Shell'),('linux','Linux'),('qnx','QNX'),('cmake','CMake'),('conan','Conan'),('bazel','Bazel'),('git','Git')]:
        (labels/f'{key}.svg').write_text(label(name))
    for filename in ['avatar.png','contributions.svg','contributions-dark.svg']:
        shutil.copyfile(BASE/'assets'/filename,assets/filename)
    text = readme()
    (ROOT/'README.md').write_text(text)
    md = MarkdownIt('commonmark',{'html':True})
    tokens = md.parse(text)
    for i,token in enumerate(tokens):
        if token.type == 'heading_open':
            token.attrSet('id',re.sub(r'[^a-z0-9 -]','',tokens[i+1].content.lower()).replace(' ','-'))
    fragment = md.renderer.render(tokens,md.options,{})
    (ROOT/'fragment.html').write_text(fragment)
    # Same approximate GitHub shell as A/C; only add normal Markdown table rules.
    table_css = '''.markdown-body table{border-spacing:0;border-collapse:collapse;max-width:100%;margin-bottom:16px}.markdown-body td{border:1px solid var(--border);padding:16px;vertical-align:top}.markdown-body td h3{margin:0 0 12px}.markdown-body td p:last-child{margin-bottom:0}@media(max-width:800px){.markdown-body td{padding:12px}.markdown-body td h3{font-size:18px}}'''
    for theme in ['light','dark']:
        page = (BASE/f'preview-{theme}.html').read_text()
        page = page.replace('A · 插画个人空间','B · 海报式主页')
        page = re.sub(r'(<article class="markdown-body">).*?(</article>)',lambda m:m[1]+fragment+m[2],page,flags=re.S)
        page = page.replace('</style>',table_css+'</style>')
        (ROOT/f'preview-{theme}.html').write_text(page)


if __name__ == '__main__':
    build()
