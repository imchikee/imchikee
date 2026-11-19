from pathlib import Path
import json
import math
import runpy
import sys

from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageFont

from prepare import BOX, MASTER, SIZE

HERE = Path(__file__).resolve().parent
BLINK = HERE.parent / 'desk-composition-round-eyes-blink/render-blink.py'
FONT = ImageFont.truetype('/usr/share/fonts/noto-cjk/NotoSansCJK-Medium.ttc', 17)
SAMPLES = (37, 43, 49, 59, 66, 73, 82, 87, 91, 136, 143, 150, 154, 162, 173, 182)
OPEN_TIP = (234, 247)


def raw(path, mode):
    return Image.frombytes(mode, SIZE, path.read_bytes())


def contact_shadow(plate, u, lift):
    shadow = Image.new('L', SIZE)
    draw = ImageDraw.Draw(shadow)
    x = 154 - 20 * u
    draw.ellipse((x - 70, 192 + 2 * u, x + 56, 222 + 3 * u), fill=88)
    draw.line((x + 10, 195, x + 70, 239), fill=36, width=14)
    shadow = shadow.filter(ImageFilter.GaussianBlur(7 + lift * .19))
    page_mask = Image.new('L', SIZE)
    ImageDraw.Draw(page_mask).polygon([(48,209),(58,197),(140,191),(300,180),
                                      (351,182),(351,263),(49,263)], fill=255)
    shadow = ImageChops.multiply(shadow, page_mask.filter(ImageFilter.GaussianBlur(2)))
    return Image.composite(Image.new('RGB', SIZE, '#9c542d'), plate, shadow)


def growing_ink(background, strokes):
    # Every segment starts and ends at the same point used for the graphite
    # nib. Only contact strokes reach this layer.
    if not strokes:
        return background
    matte = Image.new('L', (SIZE[0] * 4, SIZE[1] * 4))
    draw = ImageDraw.Draw(matte)
    for a,b in strokes:
        x,y = (v * 4 for v in a)
        u,v = (v * 4 for v in b)
        draw.line((x,y,u,v), fill=222, width=8)
        for px,py in ((x,y),(u,v)):
            draw.ellipse((px-3.6,py-3.6,px+3.6,py+3.6), fill=222)
    matte = matte.resize(SIZE, Image.Resampling.LANCZOS)
    return Image.composite(Image.new('RGB', SIZE, '#443027'), background, matte)


def grip_at(tool, tip, u):
    angle = .059 * u
    a,b = math.cos(angle), math.sin(angle)
    x,y = tip
    return tool.transform(SIZE, Image.Transform.AFFINE,
                          (a,b,OPEN_TIP[0]-a*x-b*y,
                           -b,a,OPEN_TIP[1]+b*x-a*y),
                          Image.Resampling.BICUBIC)


def board(filename, frames, labels, columns):
    w,h = frames[0].size
    rows = (len(frames) + columns - 1) // columns
    panel = Image.new('RGB', (16 + columns * (w+16), 16 + rows * (h+46)), '#202329')
    draw = ImageDraw.Draw(panel)
    for i,(frame,label) in enumerate(zip(frames, labels, strict=True)):
        x,y = 16+(i%columns)*(w+16), 16+(i//columns)*(h+46)
        draw.text((x,y), label, font=FONT, fill='white')
        panel.paste(frame,(x,y+30))
    panel.save(HERE / filename)


def render(work):
    blink = runpy.run_path(str(BLINK))
    master = Image.open(MASTER).convert('RGB')
    still = master.crop(BOX)
    plate = raw(work / 'plate.rgb', 'RGB')
    tool = raw(work / 'tool.rgba', 'RGBA')
    timeline = json.loads((work / 'timeline.json').read_text())
    frame_dir = work / 'frames'
    frame_dir.mkdir(exist_ok=True)
    crop_samples = []
    for i,state in enumerate(timeline):
        t = state['t']
        frame = master.copy()
        if state['active']:
            foreground = raw(work / 'patches' / f'{i:03}.rgba', 'RGBA')
            paper = growing_ink(contact_shadow(plate, state['u'], state['lift']), state['ink'])
            paper.paste(foreground, (0,0), foreground.getchannel('A'))
            grip = grip_at(tool, state['tip'], state['u'])
            paper.paste(grip,(0,0),grip.getchannel('A'))
            frame.paste(Image.blend(still,paper,state['blend']),BOX[:2])
        if blink['closure'](t):
            eyes = blink['crop_at'](t)
            changed = blink['diff_mask'](eyes,blink['open_crop']).point(lambda v: 255 if v else 0)
            frame.paste(eyes,blink['ORIGIN'],changed)
        normal = frame.resize((534,485),Image.Resampling.LANCZOS)
        padded = Image.new('RGB',(534,486),'white')
        padded.paste(normal,(0,0))
        padded.save(frame_dir / f'{i:03}.png',compress_level=1)
        if i in SAMPLES:
            crop_samples.append(frame.crop((300,699,562,917)))
    labels = [f'{i/60:.3f} s' for i in SAMPLES]
    board('review-shoulder-grip-native.png', crop_samples, labels, 4)


if __name__ == '__main__':
    render(Path(sys.argv[1]))
