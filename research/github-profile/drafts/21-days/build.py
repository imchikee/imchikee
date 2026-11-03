"""Review the new illustrated storyboard inside the existing local profile."""
from pathlib import Path
import shutil

ROOT = Path(__file__).resolve().parent
SOURCE = ROOT.parent / 'personal-corner'
STORY = '../../cpp-humor/storyboards/21-days/'

STYLE = '''<style>
.story-hero{display:grid;grid-template-columns:minmax(220px,.8fr) minmax(0,1.2fr);column-gap:20px;align-items:center;margin:0 0 27px;padding-bottom:20px;border-bottom:1px solid var(--border)}
.story-intro{padding:8px 0 25px}.story-intro .hello{font:12px ui-monospace,monospace;letter-spacing:2px;color:#357e6b;margin-bottom:22px}.story-intro h1{font-size:clamp(54px,6vw,88px);font-weight:750;line-height:1.05;letter-spacing:-5px;margin:0 0 24px;color:#183f3d}.story-intro h1 span{color:#ad732b}.story-intro .tagline{font-size:22px;line-height:1.4;margin:0 0 14px}.story-intro .still{font-size:18px;color:var(--muted);margin:0 0 22px}.story-intro .story-name{font-size:12px;letter-spacing:.09em;text-transform:uppercase;color:#357e6b}
.dark .story-intro h1{color:#eff4ed}.dark .story-intro h1 span{color:#e6b86c}.dark .story-intro .hello,.dark .story-intro .story-name{color:#8dcfba}
.story-player{min-width:0}.story-picture{background:#fff9ee;overflow:hidden;border-radius:3px}.story-picture{position:relative;aspect-ratio:534/485}.story-picture>svg,.story-picture>canvas{width:100%;height:100%;display:block}.story-picture>[hidden]{display:none}.story-status{font-size:10px;color:var(--muted);margin-top:7px}.story-controls{display:flex;align-items:center;gap:9px;margin-top:12px;color:var(--muted);font-size:11px}.story-controls button{border:0;background:transparent;color:var(--link);font:inherit;cursor:pointer;padding:4px 0}.story-controls button:focus-visible,.story-controls input:focus-visible{outline:2px solid var(--link);outline-offset:4px}.story-controls input{flex:1;min-width:30px;accent-color:#59916f;height:3px}.story-position{white-space:nowrap;font-variant-numeric:tabular-nums}.story-credit{font-size:10px;color:var(--muted);margin-top:9px;line-height:1.5}.story-credit a{color:inherit;text-decoration:underline}
@media(max-width:650px){.story-hero{display:block;padding-bottom:20px}.story-intro{padding:3px 0 17px}.story-intro .hello{margin-bottom:14px}.story-intro h1{font-size:76px;margin-bottom:14px}.story-intro .tagline{font-size:20px;margin-bottom:10px}.story-intro .still{font-size:17px;margin-bottom:15px}.story-picture>svg{aspect-ratio:1.07}.story-controls{font-size:12px;margin-top:11px}.story-credit{font-size:10px}}
</style>'''

ART = (ROOT / STORY / 'hamster-storyboard-v2.svg').read_text().split('>', 1)[1].removesuffix('</svg>')
ART = ART.replace('href="hamster-', f'href="{STORY}hamster-')

HERO = f'''{STYLE}<header class="story-hero">
  <div class="story-intro"><p class="hello">HELLO, I'M</p><h1>Chikee<span>.</span></h1><p class="tagline">Software, close to the system.</p><p class="still">Still learning.</p><p class="story-name">C++ in 21 days</p></div>
  <div class="story-player">
    <div class="story-picture"><canvas id="reading-stage" width="534" height="485" role="img" aria-label="Hamster reading C++" hidden></canvas><svg id="story-art" xmlns="http://www.w3.org/2000/svg" viewBox="14 93 396 327" role="img" aria-labelledby="story-title"><title id="story-title">Days 1–10: The basics.</title>{ART}</svg></div>
    <div class="story-controls"><button id="story-play" type="button">Pause</button><button id="story-replay" type="button">Replay</button><input id="story-seek" type="range" min="0" value="0" step=".05" aria-label="Comic playback progress"><span id="story-position" class="story-position">1 / 9</span></div>
    <div id="story-status" class="story-status">第1—2幕：动作；第3—9幕：分镜占位</div><div class="story-credit">Story adapted from <a href="https://abstrusegoose.com/249">Abstruse Goose #249</a> · <a href="{STORY}hamster-storyboard-v2.svg">Read the comic</a></div>
  </div>
</header>'''


def build_reading_shot():
    # Snapshot the paused visual implementation; adapt only its playback interface.
    source = (ROOT / 'reading-motion/motion.js').read_text()
    body = source[source.index("const canvas=document.getElementById('stage')"):source.index('play.onclick=')]
    body = body.replace("const canvas=document.getElementById('stage'),ctx=canvas.getContext('2d');", "const ctx=canvas.getContext('2d');")
    body = body.replace("const duration=3.2,seek=document.getElementById('seek'),play=document.getElementById('play');", "const duration=3.2;")
    body = body.replace("let elapsed=0,playing=!matchMedia('(prefers-reduced-motion: reduce)').matches,last=null,ready=false;", "let elapsed=0,ready=false;")
    body = body.replace("image.src=src;", "image.src=assetBase+src;")
    body = body.replace(" seek.value=elapsed;document.getElementById('time').value=elapsed.toFixed(1)+' s';play.textContent=playing?'暂停':'播放';", "")
    body = body.replace('Promise.all([...keys,', 'const readyPromise=Promise.all([...keys,')
    body = body.replace(".catch(()=>{playing=false;document.getElementById('error').textContent='姿态原画加载失败。';});", ".catch(error=>{canvas.dataset.error='Reading artwork failed to load';throw error;});")
    (ROOT / 'reading-shot.js').write_text('// Generated by build.py from the paused reading study.\nwindow.createReadingShot=function(canvas,assetBase){\n'+body+"\nreturn {draw,ready:readyPromise,get loaded(){return ready;},duration};\n};\n")


def build():
    build_reading_shot()
    for theme in ['light', 'dark']:
        page = (SOURCE / f'preview-{theme}.html').read_text()
        start = page.index('<picture>', page.index('<article class="markdown-body">'))
        end = page.index('</picture>', start) + len('</picture>')
        page = page[:start] + HERO + page[end:]
        page = page.replace('./assets/', '../personal-corner/assets/')
        page = page.replace('个人主页 · 本地预览', '个人主页 · 前两幕动作接入，后七幕为分镜')
        page = page.replace('href="animation.html"', 'href="reading-motion/index.html"').replace('>动画细节<', '>阅读动作试段<')
        page = page.replace('href="mobile-light.png"', f'href="mobile-{theme}.png"')
        page = page.replace('About that C++ book…', 'About those 21 days…')
        page = page.replace('The book is winning this round.', 'Story adapted from Abstruse Goose #249.')
        page = page.replace('</body>', '<script src="reading-motion/redrawn/contour-data.js"></script><script src="reading-motion/lighting/config.js"></script><script src="reading-shot.js"></script><script src="writing-motion/shot.js"></script><script src="story.js"></script></body>')
        (ROOT / f'preview-{theme}.html').write_text(page)
    (ROOT / 'index.html').write_text((ROOT / 'preview-light.html').read_text())
    build_github()
    print('Built light/dark full-profile previews; original PNG is shared.')


def build_github():
    target = ROOT / 'github'
    assets = target / 'assets'
    assets.mkdir(parents=True, exist_ok=True)
    for source in (SOURCE / 'assets').iterdir():
        if source.is_file() and (source.name.startswith(('tools-', 'workbench-', 'contributions')) or source.name in ['avatar.png', 'DEVICON-LICENSE']):
            shutil.copyfile(source, assets / source.name)
    readme = (SOURCE / 'README.md').read_text().replace(
        'A hamster notices a falling C++ book, gets squashed, then gives a strained thumbs-up.',
        'A nine-panel hamster comic: learn C++, study physics and biology, reverse aging, return to day 21 and replace your younger self.')
    end = readme.index('</picture>') + len('</picture>')
    readme = readme[:end] + '\n<p><sub>Story adapted from <a href="https://abstrusegoose.com/249">Abstruse Goose #249</a>.</sub></p>' + readme[end:]
    readme = readme.replace('About that C++ book…', 'About those 21 days…').replace('The book is winning this round.', 'The syllabus took a few unexpected turns.')
    (target / 'README.md').write_text(readme)
    for theme in ['light', 'dark']:
        page = (SOURCE / f'preview-{theme}.html').read_text()
        start = page.index('<article class="markdown-body">') + len('<article class="markdown-body">')
        end = page.index('</article>', start)
        page = page[:start] + readme + page[end:]
        page = page.replace('个人主页 · 本地预览', '个人主页 · README GIF 预览')
        page = page.replace('href="animation.html"', 'href="../index.html"').replace('>动画细节<', '>可控制预览<')
        page = page.replace('href="mobile-light.png"', f'href="preview-mobile-{theme}.png"')
        (target / f'preview-{theme}.html').write_text(page)
    (target / 'index.html').write_text((target / 'preview-light.html').read_text())


if __name__ == '__main__':
    build()
