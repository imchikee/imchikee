from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
import json
p=Path(__file__).resolve().parent
original=Image.open(p/'../reading-identity-static/candidate.png').convert('RGB')
closed=Image.open(p/'../closed-smile-design/candidate.png').convert('RGB')
new=Image.open(p/'candidate.png').convert('RGB')
font='/usr/share/fonts/noto-cjk/NotoSansCJK-Medium.ttc'
def text(d,x,y,t,s=18):d.text((x,y),t,font=ImageFont.truetype(font,s),fill='#eee8dc')
def save(o,name):
 o.save(p/f'{name}.png')
 for q in range(95,39,-1):
  o.save(p/f'{name}.jpg','JPEG',quality=q,optimize=True,progressive=True,subsampling=0)
  if (p/f'{name}.jpg').stat().st_size<400000:break
 assert (p/f'{name}.jpg').stat().st_size<400000
 return {'bytes':(p/f'{name}.jpg').stat().st_size,'quality':q}
ims=[original,closed,new];labels=['原始U形嘴 · 体量参考','当前闭合嘴 · 编辑基线','唯一新候选 · 微张口小笑']
o=Image.new('RGB',(1662,635),'#202329');d=ImageDraw.Draw(o)
text(d,24,12,'先看正常尺寸 · U形嘴 / 闭合嘴 / 微张口候选',26)
for x,im,label in zip([24,570,1116],ims,labels):
 text(d,x,65,label,19);o.paste(im.resize((534,485),Image.Resampling.LANCZOS),(x,110))
text(d,24,604,'均为534px宽。新候选只改嘴部；眼睛、鼻子及其余原画保持不动。',17)
files={'full':save(o,'review-full')}
o=Image.new('RGB',(1464,670),'#202329');d=ImageDraw.Draw(o)
text(d,24,12,'三版嘴部 · 相同原始裁框、相同倍率',26)
for x,im,label in zip([24,504,984],ims,labels):
 text(d,x,72,label,19);o.paste(im.crop((620,690,760,790)).resize((448,320),Image.Resampling.LANCZOS),(x,125))
text(d,24,492,'每幅140×100裁框，统一3.2×。原始U形嘴只提供牙齿体量参考，没有混入新候选。',17)
text(d,24,540,'观察门牙长度、牙后浅空间、牙尖与下缘是否接触，以及嘴角是否机械对称。',17)
text(d,24,590,'同一新候选，没有放大或拉伸牙齿像素，也未另做第二版。',17)
files['mouth']=save(o,'review-mouth')
o=Image.new('RGB',(1128,1000),'#202329');d=ImageDraw.Draw(o)
text(d,24,12,'嘴周毛发与边界 · 闭合基线 / 新候选',26)
for x,im,label in [(24,closed,'闭合版原画'),(570,new,'一次绘画与注册后的新候选')]:
 text(d,x,65,label,19)
 o.paste(im.crop((620,695,760,790)).resize((504,342),Image.Resampling.LANCZOS),(x,115))
 o.paste(im.crop((625,735,755,785)).resize((520,200),Image.Resampling.LANCZOS),(x,557))
text(d,24,488,'下排放大旧开口及其下方毛发：相同130×50裁框、统一4×。',17)
text(d,24,810,'鼻子和非嘴部范围保留原像素；没有调色、模糊或第二轮补边。',17)
text(d,24,860,'检查色块、硬接边、旧嘴残线及重复毛纹；细节图不能代替534px全景验收。',17)
files['boundary']=save(o,'review-boundary')
new.resize((534,485),Image.Resampling.LANCZOS).save(p/'preview-534.png')
(p/'review-files.json').write_text(json.dumps(files,indent=2)+'\n')
print(json.dumps(files))
