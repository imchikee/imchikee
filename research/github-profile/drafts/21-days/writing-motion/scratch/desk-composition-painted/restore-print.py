"""Composite only the existing chapter lettering, mug mark and C++ ink."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageChops, ImageFont

work = Path(__file__).resolve().parent
raw = Image.open(work/'generated-raw.png').convert('RGBA')
old = Image.open(work.parent/'gentle-smile-soft-rim/candidate.png').convert('RGBA')
ink = Image.open(work.parent/'reading-identity-static/print-layer.png').convert('RGBA')
assert raw.size == old.size == ink.size == (1316,1195)


def perspective(source, destination):
    rows = []
    for (x,y),(u,v) in zip(source,destination):
        rows.extend([[x,y,1,0,0,0,-u*x,-u*y,u],[0,0,0,x,y,1,-v*x,-v*y,v]])
    for j in range(8):
        pivot = max(range(j,8),key=lambda i:abs(rows[i][j]))
        rows[j], rows[pivot] = rows[pivot], rows[j]
        k = rows[j][j]
        rows[j] = [x/k for x in rows[j]]
        for i,row in enumerate(rows):
            if i != j:
                rows[i] = [a-row[j]*b for a,b in zip(row,rows[j])]
    return tuple(row[-1] for row in rows)


def map_point(t,x,y):
    a,b,c,d,e,f,g,h = t
    return ( (a*x+b*y+c)/(g*x+h*y+1), (d*x+e*y+f)/(g*x+h*y+1) )


def polygon(points):
    m = Image.new('L',raw.size)
    ImageDraw.Draw(m).polygon(points,fill=255)
    return m


pages = [
    ([(401,879),(698,865),(780,930),(504,956)], [(345,859),(639,840),(737,947),(432,955)]),
    ([(712,865),(881,854),(973,909),(790,932)], [(649,839),(858,829),(985,914),(746,945)]),
    ([(76,922),(212,931),(283,968),(181,1114),(17,1052),(18,989)], [(98,927),(263,975),(202,1125),(20,1049)],),
    ([(287,971),(356,949),(542,1006),(477,1137),(188,1111)], [(286,977),(548,1011),(479,1141),(208,1122)],),
    ([(791,1017),(924,974),(1018,979),(1159,1103),(855,1154)], [(787,1021),(1031,975),(1154,1117),(859,1151)],),
    ([(1047,987),(1102,944),(1190,943),(1315,989),(1315,1052),(1163,1103)], [(1044,985),(1313,986),(1313,1062),(1170,1118)],),
]
source_maps = [
    pages[0][0],pages[1][0],
    [(76,922),(283,968),(181,1114),(17,1052)],
    [(287,971),(542,1006),(477,1137),(188,1111)],
    [(791,1017),(1018,979),(1159,1103),(855,1154)],
    [(1047,987),(1315,989),(1315,1052),(1163,1103)],
]
layer = Image.new('RGBA',raw.size)
for i,((src,dst),quad) in enumerate(zip(pages,source_maps)):
    registration = dst
    if i==0:
        tip = map_point(perspective(quad,dst),592,900)
        shift = (520-tip[0],901-tip[1])
        registration = [(x+shift[0],y+shift[1]) for x,y in dst]
    mapped = Image.composite(ink,Image.new('RGBA',raw.size),polygon(src)).transform(
        raw.size,Image.Transform.PERSPECTIVE,perspective(registration,quad),Image.Resampling.BICUBIC)
    visible = polygon(dst)
    # Exclude the foreground pencil and the two soft paws from ink.
    draw = ImageDraw.Draw(visible)
    draw.polygon([(424,717),(441,714),(515,875),(524,903),(511,903),(417,731)],fill=0)
    draw.polygon([(401,806),(453,793),(489,799),(511,827),(495,863),
                  (486,880),(450,882),(405,861)],fill=0)
    draw.polygon([(762,796),(790,781),(846,780),(864,794),(852,828),
                  (827,843),(783,838),(764,825)],fill=0)
    mapped.putalpha(ImageChops.multiply(mapped.getchannel('A'),visible))
    layer = Image.alpha_composite(layer,mapped)


def letters(box,kind):
    clip = old.crop(box)
    if kind=='heading':
        alpha = [round(255*max(0,min(1,(156-r)/68))) for r,g,b,_ in clip.get_flattened_data()]
    else:
        alpha = [round(255*max(0,min(1,(r-g*.45-83)/73))) for r,g,b,_ in clip.get_flattened_data()]
    matte = Image.new('L',clip.size)
    matte.putdata(alpha)
    clip.putalpha(matte)
    return clip


heading = (78,68,710,263)
layer.alpha_composite(letters(heading,'heading'),heading[:2])
layer.alpha_composite(letters((1098,653,1201,708),'mug'),(1098,653))
layer.save(work/'print-layer.png')
out = Image.alpha_composite(raw,layer).convert('RGB')
out.save(work/'candidate.png')
out.resize((534,485),Image.Resampling.LANCZOS).save(work/'candidate-534.png')

first = Image.open(work.parent/'gentle-smile-blink/review-pair.png').convert('RGB')
ref = Image.open(work.parent.parent.parent/'reading-motion/lighting/down-v2.png').convert('RGB')
font = ImageFont.truetype('/usr/share/fonts/noto-cjk/NotoSansCJK-Medium.ttc',17)


def board(name,images,labels):
    w,h = images[0].size
    panel = Image.new('RGB',(2*w+48,h+57),'#202329')
    draw = ImageDraw.Draw(panel)
    for j,(im,label) in enumerate(zip(images,labels)):
        x = 16+j*(w+16)
        draw.text((x,11),label,font=font,fill='white')
        panel.paste(im,(x,40))
    panel.save(work/(name+'.png'))


board('review-cut-534',[first.crop((534,40,1068,525)),Image.open(work/'candidate-534.png')],
      ['第一幕 · 实播 3.179s','第二幕 · 新插画 534px'])
board('review-head',[ref.crop((207,302,997,824)),out.crop((218,300,1008,822))],
      ['第一幕低头原画 · 原像素倍率','第二幕新插画 · 原像素倍率'])
board('review-grip',[old.convert('RGB').crop((276,724,1027,989)),out.crop((273,720,1024,985))],
      ['第二幕基线 · 笔腕与纸面','新插画 · 笔腕与纸面'])
