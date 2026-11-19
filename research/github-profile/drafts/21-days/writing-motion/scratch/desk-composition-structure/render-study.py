from base64 import b64encode
from io import BytesIO
from pathlib import Path
import subprocess
from PIL import Image, ImageDraw, ImageFont

work = Path(__file__).resolve().parent
ink = Image.open(work.parent/'reading-identity-static/print-layer.png').convert('RGBA')


def perspective(source, destination):
    rows = []
    for (x, y), (u, v) in zip(source, destination):
        rows += [[x,y,1,0,0,0,-u*x,-u*y,u], [0,0,0,x,y,1,-v*x,-v*y,v]]
    for col in range(8):
        pivot = max(range(col,8),key=lambda j:abs(rows[j][col]))
        rows[col],rows[pivot] = rows[pivot],rows[col]
        rows[col] = [v/rows[col][col] for v in rows[col]]
        for j,row in enumerate(rows):
            if j != col:
                rows[j] = [a-row[col]*b for a,b in zip(row,rows[col])]
    return tuple(row[-1] for row in rows)


paper = [
    ([(401,879),(698,865),(780,930),(504,956)], [(161,352),(273,323),(288,383),(193,415)]),
    ([(712,865),(881,854),(973,909),(790,932)], [(273,323),(393,307),(466,356),(288,383)]),
]
registered = Image.new('RGBA',(1068,970))
for src, dst in paper:
    page = Image.new('L',ink.size)
    ImageDraw.Draw(page).polygon(src,fill=255)
    source = Image.composite(ink,Image.new('RGBA',ink.size),page)
    twice = [(2*x,2*y) for x,y in dst]
    transform = perspective(twice,src)
    layer = source.transform(registered.size, Image.Transform.PERSPECTIVE, transform,Image.Resampling.BICUBIC)
    registered = Image.alpha_composite(registered,layer)
stream = BytesIO()
registered.save(stream,format='PNG')
href = b64encode(stream.getvalue()).decode()
svg = (work/'structure.svg').read_text()
svg = svg.replace('<!--INK-->',f'<image xmlns:xlink="http://www.w3.org/1999/xlink" x="0" y="0" width="534" height="485" xlink:href="data:image/png;base64,{href}"/>')
data = subprocess.check_output(['rsvg-convert'],input=svg.encode())
new = Image.open(BytesIO(data)).convert('RGB')
new.save(work/'structure.png')
baseline = Image.open(work.parent/'gentle-smile-soft-rim/candidate.png').convert('RGB')
first = Image.open(work.parent/'gentle-smile-blink/review-pair.png').convert('RGB').crop((534,40,1068,525))
font = ImageFont.truetype('/usr/share/fonts/noto-cjk/NotoSansCJK-Medium.ttc',18)


def board(name, images, labels):
    w,h = images[0].size
    canvas = Image.new('RGB',(2*w+48,h+58),'#202329')
    draw = ImageDraw.Draw(canvas)
    for i,(im,label) in enumerate(zip(images,labels)):
        x = 16+i*(w+16)
        draw.text((x,10),label,font=font,fill='white')
        canvas.paste(im,(x,41))
    canvas.save(work/(name+'.png'))


scale = lambda im: im.resize((534,485),Image.Resampling.LANCZOS)
board('review-534',[scale(baseline),scale(new)],['第二幕原版 · 5e19f08','新构图 · 无视觉标记'])
board('review-cut-534',[first,scale(new)],['第一幕 · 实播 3.179 s','第二幕 · 新静态结构稿'])
board('review-detail',[new.crop((280,222,820,640)),new.crop((255,547,795,965))],
      ['新构图 · 头部与眼睛','新构图 · 腕部、笔尖与纸面'])
