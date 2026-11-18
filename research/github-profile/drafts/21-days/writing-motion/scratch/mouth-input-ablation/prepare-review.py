from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageChops, ImageStat, ImageEnhance
import hashlib
import json

p=Path(__file__).resolve().parent
source=p.parent/'reading-identity-static'
base=Image.open(source/'generated-raw.png').convert('RGB')
ref=Image.open(p/'../../../reading-motion/lighting/down-v2.png').convert('RGB')
previous=Image.open(p.parent/'whole-head-renewal/candidate-b.png').convert('RGB')
raw=Image.open(p/'generated-raw.png').convert('RGBA')
ink=Image.open(source/'print-layer.png').convert('RGBA')
assert raw.size==base.size==ink.size==(1316,1195)
# Only the existing procedural ink is added. No input-neutralization pixels or facial masks are used.
candidate=Image.alpha_composite(raw,ink).convert('RGB')
candidate.save(p/'candidate.png')
candidate.resize((534,485),Image.Resampling.LANCZOS).save(p/'preview-534.png')
diff_after=ImageChops.difference(raw.convert('RGB'),candidate)
assert diff_after.crop((0,0,1316,864)).getbbox() is None

font='/usr/share/fonts/noto-cjk/NotoSansCJK-Medium.ttc'
checks={'generation_calls':1,'size':list(candidate.size),
        'raw_sha256':hashlib.sha256((p/'generated-raw.png').read_bytes()).hexdigest(),
        'post_generation_processing':'existing print-layer.png only; no facial compositing',
        'print_layer_sha256':hashlib.sha256((source/'print-layer.png').read_bytes()).hexdigest(),
        'post_generation_diff_bbox':list(diff_after.getbbox()),'jpeg':{}}
def label(canvas,x,y,text,size=20):
    ImageDraw.Draw(canvas).text((x,y),text,font=ImageFont.truetype(font,size),fill='#eee8dc')
def save(canvas,name):
    canvas.save(p/f'{name}.png')
    for q in range(95,30,-1):
        canvas.save(p/f'{name}.jpg',quality=q,optimize=True,progressive=True,subsampling=0)
        if (p/f'{name}.jpg').stat().st_size<400000:break
    assert (p/f'{name}.jpg').stat().st_size<400000
    checks['jpeg'][name]={'bytes':(p/f'{name}.jpg').stat().st_size,'quality':q,'size':list(canvas.size)}
def panels(name,items,w,h,note):
    canvas=Image.new('RGB',(len(items)*(w+20)+20,h+112),'#202329')
    for i,(im,box,title) in enumerate(items):
        x=20+i*(w+20)
        label(canvas,x,16,title)
        part=im if box is None else im.crop(box)
        canvas.paste(part.resize((w,h),Image.Resampling.LANCZOS),(x,55))
    label(canvas,20,h+72,note,17)
    save(canvas,name)

titles=['第一幕 · 身份参考','上次 B · 旧嘴信息仍在输入中','本轮 · 两张输入均中和旧嘴']
ims=[ref,previous,candidate]
panels('review-full',[(im,None,title) for im,title in zip(ims,titles)],534,485,
       '每幅534px宽；同一排版。一次生成，不做嘴部补救。')
panels('review-head',[(im,(270,300,965,850),title) for im,title in zip(ims,titles)],695,550,
       '相同原始像素裁框，统一1:1；不缩放匹配脸型、眼睛或帽子。')
panels('review-mouth',[(previous,(620,665,765,785),'上次 B · 旧条件'),
                      (candidate,(620,665,765,785),'本轮 · 输入中和')],580,480,
       '相同坐标、统一4倍；检查开口结构、牙尖与下缘及毛纹，不只比较空隙像素。')

# Non-target comparison uses blank-page raw images, so restored code is not counted as generation drift.
raw_rgb=raw.convert('RGB')
delta=ImageChops.difference(base,raw_rgb)
regions=[
    ('title',(30,35,750,280)),
    ('body_grip_pages',(280,775,1000,980)),
    ('lamp',(25,290,355,590)),
    ('shelf_mug',(1000,280,1315,900)),
    ('lower_books',(0,980,1316,1195)),
]
checks['raw_non_target_regions']={}
for name,box in regions:
    d=delta.crop(box)
    checks['raw_non_target_regions'][name]={
        'bbox':box,'changed_pixels':sum(any(v) for v in d.getdata()),
        'mean_absolute_channel_difference':round(sum(ImageStat.Stat(d).mean)/3,3)}
o=Image.new('RGB',(1500,1110),'#202329')
label(o,20,14,'非目标重绘检查 · 原始空白场景 / 本轮原始输出',26)
for x,im,title in [(20,base,'原场景'),(770,raw_rgb,'本轮生成原图')]:
    label(o,x,62,title)
    o.paste(im.crop((30,35,750,280)),(x,100))
    label(o,x,361,'身体、手爪、铅笔、笔记本 · 原像素1:1',18)
    o.paste(im.crop((280,775,1000,980)),(x,397))
    label(o,x,623,'左灯 / 右侧书架与杯子 · 原像素1:1',18)
    o.paste(im.crop((25,290,355,590)),(x,660))
    o.paste(im.crop((1000,580,1315,900)),(x+380,660))
label(o,20,1026,'两列均未调色。生成前后非目标像素有变化；数值仅检测范围，不代表视觉可用。',18)
label(o,20,1062,'比较的是留白原图，不将后加程序化墨迹误判为生成漂移。',18)
save(o,'review-nontarget')

for filename in ['review-inputs.jpg']:
    checks['jpeg'][filename]={'bytes':(p/filename).stat().st_size}
(p/'checks.json').write_text(json.dumps(checks,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(checks,ensure_ascii=False,indent=2))
