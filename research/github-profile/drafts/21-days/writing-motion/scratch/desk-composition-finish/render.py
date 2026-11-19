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
foreground = [
    ([(18,989),(76,922),(217,936),(181,1114)], [(7,416),(69,397),(109,408),(89,456)]),
    ([(212,931),(356,949),(542,1006),(477,1137)], [(109,408),(164,387),(197,410),(89,456)]),
    ([(791,1017),(924,974),(1018,979),(855,1154)], [(438,451),(455,432),(476,419),(481,473)]),
    ([(1047,987),(1102,944),(1315,989),(1163,1103)], [(476,419),(505,403),(534,396),(481,473)]),
]
def embed(pages):
    registered = Image.new('RGBA',(1068,970))
    for src,dst in pages:
        page = Image.new('L',ink.size)
        ImageDraw.Draw(page).polygon(src,fill=255)
        source = Image.composite(ink,Image.new('RGBA',ink.size),page)
        points = [(2*x,2*y) for x,y in dst]
        layer = source.transform(registered.size, Image.Transform.PERSPECTIVE,
                                 perspective(points,src),Image.Resampling.BICUBIC)
        registered = Image.alpha_composite(registered,layer)
    stream = BytesIO()
    registered.save(stream,format='PNG')
    href = b64encode(stream.getvalue()).decode()
    return f'<image xmlns:xlink="http://www.w3.org/1999/xlink" width="534" height="485" xlink:href="data:image/png;base64,{href}"/>'

baseline = Image.open(work.parent/'gentle-smile-soft-rim/candidate.png').convert('RGB')
title = baseline.crop((86,72,705,266)).convert('RGBA')
title.putdata([(r,g,b,round(255*max(0,min(1,(153-r)/61)))) for r,g,b,_ in title.get_flattened_data()])
stream = BytesIO()
title.save(stream,format='PNG')
letters = b64encode(stream.getvalue()).decode()
title_image = f'<image xmlns:xlink="http://www.w3.org/1999/xlink" x="26" y="16" width="248" height="77.7" xlink:href="data:image/png;base64,{letters}"/>'
svg = (work/'painted.svg').read_text()
svg = svg.replace('<!--INK-->',embed(paper)).replace('<!--FOREGROUND_INK-->',embed(foreground)).replace('<!--TITLE-->',title_image)
data = subprocess.check_output(['rsvg-convert'],input=svg.encode())
new = Image.open(BytesIO(data)).convert('RGB')
new.resize((534,485),Image.Resampling.LANCZOS).save(work/'candidate-534.png')

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
board('review-cut-534',[first,scale(new)],['第一幕 · 实播 3.179 s','第二幕 · 精修静帧'])
prior = Image.open(work.parent/'desk-composition-structure/structure.png').convert('RGB')
for name, crop, label in [
    ('head',(280,222,820,642),'头部与腮肩'),
    ('grip',(270,575,810,955),'手腕、笔尖与纸面'),
    ('desk',(0,755,1068,968),'近景桌面与参考书'),
]:
    board('review-'+name,[im.crop(crop) for im in (prior,new)],
          ['结构稿 · '+label,'精修 · '+label])
