"""Assemble captured screenshots for comparing the two local candidates."""

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent
FONT = ImageFont.truetype('/usr/share/fonts/Adwaita/AdwaitaSans-Regular.ttf',24)

for theme in ['light','dark','mobile']:
    dark = theme == 'dark'
    panels = []
    for variant in ['A','C']:
        source = Image.open(ROOT/variant/f'preview-{theme}.png').convert('RGB')
        if theme != 'mobile':
            source = source.crop((360,132,1344,1765))
            source = source.resize((660,1096),Image.Resampling.LANCZOS)
        else:
            source = source.crop((0,0,430,1700))
        panels.append(source)
    gap = 18
    bg = '#0d1117' if dark else '#f0f1f3'
    out = Image.new('RGB',(panels[0].width*2+gap*3,panels[0].height+68),bg)
    draw = ImageDraw.Draw(out)
    for i,(name,panel) in enumerate(zip(['A / Personal space','C / Retro homepage'],panels)):
        x = gap+i*(panel.width+gap)
        draw.text((x+8,14),name,font=FONT,fill='#e6edf3' if dark else '#33333b')
        out.paste(panel,(x,54))
    out.save(ROOT/f'comparison-{theme}.png')
