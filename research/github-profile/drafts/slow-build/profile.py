"""Place the existing slow-build animation in the full local profile."""

from pathlib import Path
import shutil
import re
import xml.etree.ElementTree as ET

import motion

BASE=Path(__file__).resolve().parent
ROOT=BASE/'profile'
SOURCE=BASE.parent/'personal-corner'
SANS='Arial,DejaVu Sans,sans-serif'
MONO='DejaVu Sans Mono,Consolas,monospace'


def scene_inner(asset_prefix):
    return motion.scene(transparent=True,asset_prefix=asset_prefix).split(">",1)[1].removesuffix("</svg>")


def hero(dark,mobile,asset_prefix='../../assets/scene/'):
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
<svg x="10" y="242" width="500" height="312.5" viewBox="0 0 960 600">{scene_inner(asset_prefix)}</svg>
<path d="M25 583H495" stroke="{rule}"/>'''
        w,h=520,600
    else:
        body=f'''<text x="38" y="57" fill="{mint}" font-family="{MONO}" font-size="15" letter-spacing="2.5">HELLO, I'M</text>
<text x="30" y="181" fill="{ink}" font-family="{SANS}" font-size="122" font-weight="750" letter-spacing="-7">Chikee<tspan fill="{accent}">.</tspan></text>
<text x="38" y="241" fill="{ink}" font-family="{SANS}" font-size="27">Software, close to the system.</text>
<text x="38" y="286" fill="{muted}" font-family="{SANS}" font-size="22">Still learning.</text>
<path d="M39 315Q203 303 338 313" fill="none" stroke="{mint}" stroke-width="3"/>
<svg x="486" y="8" width="714" height="446.25" viewBox="0 0 960 600">{scene_inner(asset_prefix)}</svg>
<path d="M38 465H1162" stroke="{rule}"/>'''
        w,h=1200,470
    return f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}"><title>Chikee. Still learning. Seasons pass while C++ is still compiling.</title>{body}</svg>'


def animated_header(cover):
    # Inline SVG can load shared PNGs; SVG used as an <img> cannot.
    styles='''<style>.profile-hero{margin-bottom:27px}.profile-hero>svg{width:100%;height:auto;display:none}.profile-hero>picture{display:none;margin:0}.light .profile-hero>.desktop-light,.dark .profile-hero>.desktop-dark{display:block}@media(max-width:600px){.light .profile-hero>.desktop-light,.dark .profile-hero>.desktop-dark{display:none}.light .profile-hero>.mobile-light,.dark .profile-hero>.mobile-dark{display:block}}@media(prefers-reduced-motion:reduce){.profile-hero>svg{display:none!important}.profile-hero>picture{display:block}}</style>'''
    parts=[]
    for dark in [False,True]:
        for mobile in [False,True]:
            name=('mobile' if mobile else 'desktop')+('-dark' if dark else '-light')
            svg=hero(dark,mobile,'../assets/scene/')
            svg=re.sub(r'(id="|href="#|url\(#)([\w-]+)',lambda m:m[1]+name+'-'+m[2],svg)
            source='hero'+('-mobile' if mobile else '')+('-dark' if dark else '-light')+'.svg'
            svg=svg.replace('<svg ',f'<svg class="{name}" data-source="{source}" role="img" aria-label="Seasons pass while C++ is still compiling" ',1)
            parts.append(svg)
    return styles+'<div class="profile-hero">'+cover+''.join(parts)+'</div>'


def build():
    assets=ROOT/'assets'
    assets.mkdir(parents=True,exist_ok=True)
    for f in (SOURCE/'assets').glob('*'):
        if f.is_file() and (f.name.startswith(('tools-','workbench-','contributions')) or f.name in ['avatar.png','DEVICON-LICENSE']):
            shutil.copyfile(f,assets/f.name)
    for dark in [False,True]:
        for mobile in [False,True]:
            suffix=('-mobile' if mobile else '')+('-dark' if dark else '-light')
            (assets/f'hero{suffix}.svg').write_text(hero(dark,mobile))
    old=(SOURCE/'README.md').read_text()
    text=old.replace('A hamster notices a falling C++ book, gets squashed, then gives a strained thumbs-up.','A hamster waits through palm growth and changing seasons while C++ compilation reaches two percent.')
    text=text.replace('About that C++ book…','About that build…').replace('The book is winning this round.','The palm is making better progress.')
    for name in ['hero-light','hero-dark','hero-mobile-light','hero-mobile-dark']:
        text=text.replace(name+'.gif',name+'-still.png')
    (ROOT/'README.md').write_text(text)
    (ROOT/'fragment.html').write_text(text)
    for theme in ['light','dark']:
        page=(SOURCE/f'preview-{theme}.html').read_text()
        start=page.index('<article class="markdown-body">')+len('<article class="markdown-body">')
        end=page.index('</article>',start)
        page=page[:start]+text+page[end:]
        first=page.index('<picture>',start)
        stop=page.index('</picture>',first)+len('</picture>')
        page=page[:first]+animated_header(page[first:stop])+page[stop:]
        page=page.replace('个人主页 · 本地预览','个人主页 · 编译等待 · 本地预览')
        page=page.replace('href="animation.html"','href="../index.html"')
        page=page.replace('href="mobile-light.png"',f'href="mobile-{theme}.png"')
        (ROOT/f'preview-{theme}.html').write_text(page)
    shutil.copyfile(ROOT/'preview-light.html',ROOT/'index.html')
    for f in assets.glob('*.svg'): ET.parse(f)
    print('Built the full local profile with the existing animated scene.')


if __name__=='__main__':
    build()
