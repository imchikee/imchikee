from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
import json
p=Path(__file__).resolve().parent
base=Image.open(p/'../reading-identity-static/candidate.png').convert('RGB')
new=Image.open(p/'candidate-attempt.png').convert('RGB')
first=Image.open(p/'../../../reading-motion/lighting/down-v2.png').convert('RGB')
f='/usr/share/fonts/noto-cjk/NotoSansCJK-Medium.ttc'
def text(d,x,y,t,s=18):d.text((x,y),t,font=ImageFont.truetype(f,s),fill='#eee8dc')
def save(o,name):
 o.save(p/f'{name}.png')
 for q in range(95,39,-1):
  o.save(p/f'{name}.jpg','JPEG',quality=q,optimize=True,progressive=True,subsampling=0)
  if (p/f'{name}.jpg').stat().st_size<400000:break
 assert (p/f'{name}.jpg').stat().st_size<400000
 return (p/f'{name}.jpg').stat().st_size
o=Image.new('RGB',(1128,625),'#202329');d=ImageDraw.Draw(o)
text(d,24,12,'无遮挡嘴部结构 · 原候选 / 唯一修正候选',26)
for x,im,label in [(24,base,'原候选 · reading-identity-static'),(570,new,'唯一嘴部修正候选 · 待视觉验收')]:
 text(d,x,65,label,19);o.paste(im.resize((534,485),Image.Resampling.LANCZOS),(x,110))
text(d,24,599,'均为534px宽；眼睛、鼻子、帽子与非目标画面保留原像素。',17)
sizes={'full':save(o,'review-full')}
o=Image.new('RGB',(1464,615),'#202329');d=ImageDraw.Draw(o)
text(d,24,12,'第一幕遮挡嘴部 / 第二幕原候选 / 本轮无遮挡修正',26)
for x,im,label,box in [(24,first,'第一幕 · 书遮挡下缘',(620,680,760,780)),(504,base,'第二幕 · 原候选',(620,690,760,790)),(984,new,'第二幕 · 修正候选',(620,690,760,790))]:
 text(d,x,72,label,19);o.paste(im.crop(box).resize((448,320),Image.Resampling.LANCZOS),(x,125))
text(d,24,486,'三幅均140×100原始裁框、统一3.2×；不把第一幕的遮挡关系直接当作完整嘴部结构。',18)
text(d,24,536,'观察牙尖与口腔下缘的留白及深度关系，而非只看下唇线是否变淡。',18)
sizes['reference']=save(o,'review-reference')
o=Image.new('RGB',(1128,1000),'#202329');d=ImageDraw.Draw(o)
text(d,24,12,'门牙 / 口腔下缘 / 嘴角 · 放大前后对照',26)
text(d,24,65,'原候选',20);text(d,570,65,'唯一修正候选',20)
for x,im in [(24,base),(570,new)]:
 o.paste(im.crop((630,700,750,780)).resize((504,336),Image.Resampling.LANCZOS),(x,115))
 o.paste(im.crop((650,720,725,760)).resize((504,269),Image.Resampling.LANCZOS),(x,536))
text(d,24,476,'下排检查门牙下方空间：相同75×40裁框、相同倍率。未进一步修补或重画。',17)
text(d,24,849,'上排含鼻口衔接与嘴角，左右同倍率；原鼻子保持不动。',18)
text(d,24,902,'仅完成一个生成结果及一次注册组合。图像说明与最终判断见 REPORT.md。',18)
sizes['mouth']=save(o,'review-mouth')
(p/'review-files.json').write_text(json.dumps(sizes,indent=2)+'\n')
print(sizes)
