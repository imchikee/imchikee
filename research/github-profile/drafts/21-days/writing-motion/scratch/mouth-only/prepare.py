from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageChops
p=Path(__file__).resolve().parent
base=Image.open(p/'../character-style-unification/candidate.png').convert('RGB')
previous=Image.open(p/'../focused-expression/candidate-attempt.png').convert('RGB')
assert base.size==previous.size==(1316,1195)
# The previous result already has an antialiased mouth boundary. Select its
# existing RGB values once; do not blend again or introduce new painted pixels.
S=4
mouth=Image.new('L',(1316*S,1195*S),0)
points=[(625,720),(639,713),(660,718),(675,727),(706,727),(726,715),(740,722),(744,754),(735,783),(716,800),(663,803),(634,785),(624,753)]
curve=[]
for i in range(len(points)):
 a,b,c,e=[points[j%len(points)] for j in (i-1,i,i+1,i+2)]
 for j in range(24):
  t=j/24
  curve.append(tuple(S*.5*(2*b[k]+(-a[k]+c[k])*t+(2*a[k]-5*b[k]+4*c[k]-e[k])*t*t+(-a[k]+3*b[k]-3*c[k]+e[k])*t*t*t) for k in (0,1)))
ImageDraw.Draw(mouth).polygon(curve,fill=255)
mouth=mouth.resize(base.size,Image.Resampling.LANCZOS).point(lambda v:255 if v>=4 else 0)
# Exclude the complete former eye editing regions, including surrounding fur.
eyes=Image.new('L',(1316*S,1195*S),0);d=ImageDraw.Draw(eyes)
for box in [(554,618,654,726),(717,633,807,737)]:d.ellipse(tuple(v*S for v in box),fill=255)
eyes=eyes.resize(base.size,Image.Resampling.LANCZOS).point(lambda v:255 if v>=4 else 0)
selection=ImageChops.subtract(mouth,eyes)
ImageDraw.Draw(selection).rectangle((0,0,1315,713),fill=0)
candidate=Image.composite(previous,base,selection);candidate.save(p/'candidate.png')
flag=[a!=b for a,b in zip(base.get_flattened_data(),candidate.get_flattened_data())]
assert all(not v or m for v,m in zip(flag,selection.get_flattened_data()))
assert all(not v for v,m in zip(flag,eyes.get_flattened_data()) if m)
# The entire upper eye/lid/fur band is original, as is the original nose.
for name,box in [('eye band',(530,600,830,714)),('nose',(674,699,708,724)),('body and pages',(0,810,1316,1195))]:
 assert ImageChops.difference(base.crop(box),candidate.crop(box)).getbbox() is None,name
print('Changed pixels:',sum(flag),'bounds:',ImageChops.difference(base,candidate).getbbox())
print('Both eye supports, upper eye/fur band, nose, and everything outside mouth selection: unchanged.')
font='/usr/share/fonts/noto-cjk/NotoSansCJK-Medium.ttc'
def text(d,x,y,t,s=18):d.text((x,y),t,font=ImageFont.truetype(font,s),fill='#eee8dc')
o=Image.new('RGB',(1128,610),'#202329');d=ImageDraw.Draw(o)
text(d,24,12,'第二幕 · 仅组合现有柔和微笑',27)
for x,im,label in [(24,base,'原版 · character-style-unification'),(570,candidate,'本轮嘴部候选 · 待视觉确认')]:
 text(d,x,65,label);o.paste(im.resize((534,485),Image.Resampling.LANCZOS),(x,103))
o.save(p/'full-comparison.png')
o=Image.new('RGB',(1662,950),'#202329');d=ImageDraw.Draw(o)
text(d,24,12,'原版 / 上轮失败候选 / 本轮嘴部候选',27)
for x,im,label in [(24,base,'原版'),(570,previous,'上轮失败候选（仅作对照）'),(1116,candidate,'本轮嘴部候选 · 保留原眼睛')]:
 text(d,x,62,label)
 o.paste(im.crop((530,600,830,835)).resize((500,392),Image.Resampling.LANCZOS),(x,105))
 o.paste(im.crop((610,704,760,815)).resize((450,333),Image.Resampling.LANCZOS),(x+25,565))
text(d,24,516,'下排放大同坐标嘴部与奶油色毛纹：仅用于检查边界，不作调色、模糊或额外修绘。',18)
text(d,24,916,'本轮没有调用 imagegen；全部改动来自上轮已有嘴部像素。是否采用由人工视觉验收决定。',18)
o.save(p/'face-comparison.png')
candidate.resize((534,485),Image.Resampling.LANCZOS).save('/tmp/mouth-only-normal.png')
