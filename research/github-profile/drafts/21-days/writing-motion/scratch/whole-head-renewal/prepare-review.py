from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageChops, ImageStat
import json

p = Path(__file__).resolve().parent
source = p.parent / 'reading-identity-static'
ref = Image.open(p / '../../../reading-motion/lighting/down-v2.png').convert('RGB')
base = Image.open(source / 'generated-raw.png').convert('RGB')
ink = Image.open(source / 'print-layer.png').convert('RGBA')
font = '/usr/share/fonts/noto-cjk/NotoSansCJK-Medium.ttc'
images = [ref]
checks = {}
for key in ['a', 'b']:
    raw = Image.open(p / f'candidate-{key}-raw.png').convert('RGBA')
    assert raw.size == (1316, 1195)
    # Existing programmatically rendered ink, unchanged layout/occlusion.
    candidate = Image.alpha_composite(raw, ink).convert('RGB')
    candidate.save(p / f'candidate-{key}.png')
    candidate.resize((534, 485), Image.Resampling.LANCZOS).save(p / f'preview-{key}-534.png')
    images.append(candidate)
    delta = ImageChops.difference(raw.convert('RGB'), base)
    checks[key] = {}
    for name, box in {'title':(0,0,1316,290), 'pages_body_lower':(0,845,1316,1195), 'right_environment':(1000,290,1316,845)}.items():
        x0,y0,x1,y1=box
        d=delta.crop(box)
        checks[key][name]={'changed_pixels':sum(any(pixel) for pixel in d.getdata()),'mean_channel_difference':round(sum(ImageStat.Stat(d).mean)/3,3)}

def review(name, crops, width, height, labels, note):
    canvas=Image.new('RGB',(3*(width+20)+20,height+112),'#202329')
    draw=ImageDraw.Draw(canvas)
    for i,(im,box,label) in enumerate(zip(images,crops,labels)):
        x=20+i*(width+20)
        draw.text((x,16),label,font=ImageFont.truetype(font,21),fill='#eee8dc')
        part=im if box is None else im.crop(box)
        canvas.paste(part.resize((width,height),Image.Resampling.LANCZOS),(x,55))
    draw.text((20,height+72),note,font=ImageFont.truetype(font,17),fill='#eee8dc')
    canvas.save(p/f'{name}.png')
    for q in range(95,30,-1):
        canvas.save(p/f'{name}.jpg',quality=q,optimize=True,progressive=True,subsampling=0)
        if (p/f'{name}.jpg').stat().st_size<400000:break
    assert (p/f'{name}.jpg').stat().st_size<400000
    checks[name]={'jpeg_bytes':(p/f'{name}.jpg').stat().st_size,'quality':q}

labels=['第一幕 · 身份标准','Candidate A · 灵动方向','Candidate B · 安静方向']
review('review-full',[None]*3,534,485,labels,'每幅534px宽；不调色，不改变角色比例。A/B均为待审候选。')
review('review-head',[(270,300,965,850)]*3,695,550,labels,'相同原图坐标、1:1倍率；完整头部与颈肩连接。')
review('review-mouth',[(620,675,755,775),(620,685,755,785),(620,685,755,785)],405,300,labels,'鼻口统一3倍；仅平移取景，不对齐或拉伸五官。')
(p/'checks.json').write_text(json.dumps(checks,indent=2)+'\n')
print(json.dumps(checks,indent=2))
