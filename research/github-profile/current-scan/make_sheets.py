from pathlib import Path
from PIL import Image, ImageChops, ImageDraw, ImageFont
import json

root = Path(__file__).resolve().parent
entries = json.loads((root / 'source-results.json').read_text())['records']
font = ImageFont.truetype('/usr/share/fonts/TTF/DejaVuSans.ttf', 24)
small = ImageFont.truetype('/usr/share/fonts/TTF/DejaVuSans.ttf', 16)
for offset in range(0, len(entries), 4):
    group = entries[offset:offset+4]
    out = root / 'sheets' / f'page-{offset//4+1:02}.jpg'
    if out.exists():
        continue
    paths = [root / 'screenshots' / f"{e['id']:03}-{e['name']}.png" for e in group]
    if not all(p.exists() for p in paths):
        continue
    canvas = Image.new('RGB', (1800, 2880), '#e8edf3')
    draw = ImageDraw.Draw(canvas)
    for i, (entry, path) in enumerate(zip(group, paths)):
        x, y = (i%2)*900, (i//2)*1440
        draw.rectangle((x+5,y+5,x+895,y+1435), fill='white')
        draw.text((x+15,y+14), f"{entry['id']:03} - {entry['name']}", font=font, fill='#172334')
        draw.text((x+15,y+48), 'Current page: top 2400px; raw capture 5000px', font=small, fill='#516071')
        im = Image.open(path).convert('RGB')
        im = im.crop((0,0,im.width,min(im.height,2400)))
        # Only remove solid trailing background in this comparison copy; raw screenshots remain intact.
        bg = Image.new('RGB', im.size, im.getpixel((0,im.height-1)))
        bounds = ImageChops.difference(im,bg).getbbox()
        if bounds:
            im = im.crop((0,0,im.width,min(im.height,bounds[3]+20)))
        im.thumbnail((870,1340))
        canvas.paste(im,(x+15+(870-im.width)//2,y+82))
    canvas.save(out,quality=90)
    print(out.name, flush=True)
