"""Build the one-error animation into a separate local profile candidate."""

from pathlib import Path
import shutil
import xml.etree.ElementTree as ET

import error_motion

ROOT=Path(__file__).resolve().parent
SOURCE=ROOT.parent/'personal-corner'
SANS='Arial,DejaVu Sans,sans-serif'
MONO='DejaVu Sans Mono,Consolas,monospace'


def hero(dark,mobile):
    ink='#eff4ed' if dark else '#183f3d'
    muted='#b0c0bd' if dark else '#5b716d'
    mint='#8dcfba' if dark else '#357e6b'
    accent='#e6b86c' if dark else '#ad732b'
    rule='#2c4445' if dark else '#dbe6e0'
    if mobile:
        body=f'''<text x="24" y="35" fill="{mint}" font-family="{MONO}" font-size="13" letter-spacing="2">HELLO, I'M</text>
<text x="18" y="124" fill="{ink}" font-family="{SANS}" font-size="88" font-weight="750" letter-spacing="-5">Chikee<tspan fill="{accent}">.</tspan></text>
<text x="24" y="169" fill="{ink}" font-family="{SANS}" font-size="24">Software, close to the system.</text>
<text x="24" y="205" fill="{muted}" font-family="{SANS}" font-size="19">Still learning.</text>
<path d="M25 225Q130 214 221 222" fill="none" stroke="{mint}" stroke-width="2.5"/>
<svg x="-8" y="232" width="536" height="357.33" viewBox="0 0 720 480">{error_motion.scene('scene/')}</svg>
<path d="M25 583H495" stroke="{rule}"/>'''
        w,h=520,600
    else:
        body=f'''<text x="38" y="57" fill="{mint}" font-family="{MONO}" font-size="15" letter-spacing="2.5">HELLO, I'M</text>
<text x="30" y="181" fill="{ink}" font-family="{SANS}" font-size="122" font-weight="750" letter-spacing="-7">Chikee<tspan fill="{accent}">.</tspan></text>
<text x="38" y="241" fill="{ink}" font-family="{SANS}" font-size="27">Software, close to the system.</text>
<text x="38" y="286" fill="{muted}" font-family="{SANS}" font-size="22">Still learning.</text>
<path d="M39 315Q203 303 338 313" fill="none" stroke="{mint}" stroke-width="3"/>
<svg x="484" y="-14" width="714" height="476" viewBox="0 0 720 480">{error_motion.scene('scene/')}</svg>
<path d="M38 439H1162" stroke="{rule}"/>'''
        w,h=1200,456
    return f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}"><title>Chikee. Still learning. Just one C++ error, many diagnostic notes.</title>{body}</svg>'


def build():
    assets=ROOT/'assets'
    for f in (SOURCE/'assets').glob('*'):
        if f.is_file() and (f.name.startswith(('tools-','workbench-','contributions')) or f.name in ['avatar.png','DEVICON-LICENSE']):
            shutil.copyfile(f,assets/f.name)
    for dark in [False,True]:
        for mobile in [False,True]:
            suffix=('-mobile' if mobile else '')+('-dark' if dark else '-light')
            (assets/f'hero{suffix}.svg').write_text(hero(dark,mobile))
    (assets/'scene/scene.svg').write_text(error_motion.standalone())
    (ROOT/'animation.html').write_text(error_motion.preview_page())
    old=(SOURCE/'README.md').read_text()
    text=old.replace('A hamster notices a falling C++ book, gets squashed, then gives a strained thumbs-up.','A confident hamster sees one C++ error, then is buried under its diagnostic notes.')
    text=text.replace('About that C++ book…','About that one error…').replace('The book is winning this round.','One error. Several pages of explanation.')
    (ROOT/'README.md').write_text(text)
    (ROOT/'fragment.html').write_text(text)
    for theme in ['light','dark']:
        page=(SOURCE/f'preview-{theme}.html').read_text()
        start=page.index('<article class="markdown-body">')+len('<article class="markdown-body">')
        end=page.index('</article>',start)
        page=page[:start]+text+page[end:]
        page=page.replace('个人主页 · 本地预览','个人主页 · 只有一个错误 · 本地预览')
        (ROOT/f'preview-{theme}.html').write_text(page)
    shutil.copyfile(ROOT/'preview-light.html',ROOT/'index.html')
    for f in assets.glob('*.svg'): ET.parse(f)
    ET.parse(assets/'scene/scene.svg')
    print('Built separate one-error profile and controllable animation preview.')


if __name__=='__main__':
    build()
