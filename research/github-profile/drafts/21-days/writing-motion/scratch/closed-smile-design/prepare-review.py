from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
import json
p=Path(__file__).resolve().parent
base=Image.open(p/'../reading-identity-static/candidate.png').convert('RGB')
new=Image.open(p/'candidate.png').convert('RGB')
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
o=Image.new('RGB',(1128,630),'#202329');d=ImageDraw.Draw(o)
text(d,24,12,'闭合式自然微笑 · 先看正常534px全景',26)
for x,im,label in [(24,base,'原版 · reading-identity-static'),(570,new,'唯一新候选 · 闭合小笑')]:
 text(d,x,65,label,19);o.paste(im.resize((534,485),Image.Resampling.LANCZOS),(x,110))
text(d,24,601,'同为534px宽；旧露牙张口收为闭合微笑，其余画面保留原像素。',17)
sizes={'full':save(o,'review-full')}
o=Image.new('RGB',(1464,620),'#202329');d=ImageDraw.Draw(o)
text(d,24,12,'第一幕鼻口参考 / 第二幕原版 / 闭合式候选',26)
for x,im,label,box in [(24,first,'第一幕 · 下缘被书遮挡',(620,680,760,780)),(504,base,'第二幕 · 原版U形张口',(620,690,760,790)),(984,new,'第二幕 · 新闭合结构',(620,690,760,790))]:
 text(d,x,72,label,19);o.paste(im.crop(box).resize((448,320),Image.Resampling.LANCZOS),(x,125))
text(d,24,487,'相同140×100裁框，统一3.2×；保留圆润短口鼻身份，不照搬第一幕的遮挡口腔形状。',17)
text(d,24,540,'新候选取消大面积深色U形开口，只微露牙尖，下面直接过渡到奶油色下巴毛发。',17)
sizes['reference']=save(o,'review-reference')
o=Image.new('RGB',(1128,1020),'#202329');d=ImageDraw.Draw(o)
text(d,24,12,'结构放大 · 嘴角 / 合口线 / 牙尖 / 毛发连续性',25)
text(d,24,65,'原版U形开口',20);text(d,570,65,'唯一闭合式候选',20)
for x,im in [(24,base),(570,new)]:
 o.paste(im.crop((630,700,750,780)).resize((504,336),Image.Resampling.LANCZOS),(x,115))
 o.paste(im.crop((650,720,725,765)).resize((504,302),Image.Resampling.LANCZOS),(x,552))
text(d,24,482,'下排：同一75×45区域，重点检查是否仍有托牙下唇，以及旧开口区域是否接回真实毛纹。',17)
text(d,24,897,'原鼻子保留；眼睛、头部、帽子、身体、书页和场景均未参与这次绘画。',17)
text(d,24,943,'只完成一次绘画与一次原坐标组合，无几何拉伸、纯色覆盖或第二轮补边。',17)
sizes['mouth']=save(o,'review-mouth')
(p/'review-files.json').write_text(json.dumps(sizes,indent=2)+'\n')
# This is an export at the actual requested display width, not a new candidate.
new.resize((534,485),Image.Resampling.LANCZOS).save(p/'preview-534.png')
print(sizes)
