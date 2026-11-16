from pathlib import Path
import json
from PIL import Image, ImageDraw, ImageFont, ImageChops, ImageStat
p=Path(__file__).resolve().parent
base=Image.open(p/'../character-style-unification/candidate.png').convert('RGB')
new=Image.open(p/'candidate.png').convert('RGB')
first=Image.open(p/'../../../reading-motion/lighting/front-v1.png').convert('RGB')
assert base.size==new.size==first.size==(1316,1195)
f='/usr/share/fonts/noto-cjk/NotoSansCJK-Medium.ttc'
def text(d,x,y,t,s=18):d.text((x,y),t,font=ImageFont.truetype(f,s),fill='#eee8dc')
# Only construct comparison sheets. No masking, retouching or compositing into the candidate.
o=Image.new('RGB',(1128,1210),'#202329');d=ImageDraw.Draw(o)
text(d,24,12,'整块中央脸部重绘 · 唯一原始生成结果',26)
for y,left,label in [(118,base,'第二幕 · character-style-unification 基础'),(694,first,'第一幕 · lighting/front-v1 认可原画')]:
 text(d,24,y-33,label);text(d,570,y-33,'第二幕 · 本轮原始候选')
 o.paste(left.resize((534,485),Image.Resampling.LANCZOS),(24,y))
 o.paste(new.resize((534,485),Image.Resampling.LANCZOS),(570,y))
text(d,24,620,'均为 534px 展示宽度；不调色、不独立缩放角色。',17)
o.save(p/'full-comparison.png')
o=Image.new('RGB',(1128,1345),'#202329');d=ImageDraw.Draw(o)
text(d,24,12,'中央面部 · 同坐标前后对照',26)
text(d,24,59,'修改前',19);text(d,570,59,'本轮唯一候选',19)
rows=[(112,(450,590,900,825),'完整表情区：450×235，统一显示为500px宽'),(469,(550,625,810,765),'眼睛 / 视线：同坐标裁框，统一放大'),(835,(600,690,780,820),'鼻口 / 奶油毛发连续性：同坐标裁框，统一放大')]
for y,box,label in rows:
 text(d,24,y-12,label,17)
 for x,im in [(24,base),(570,new)]:
  c=im.crop(box);o.paste(c.resize((500,round(c.height*500/c.width)),Image.Resampling.LANCZOS),(x,y+26))
text(d,24,1270,'嘴型更收敛、中央毛发连续；五官明显下移，上睑线加重，视线落到笔记仍不够明确。',17)
text(d,24,1308,'此图只是同一原始候选的放大展示，未作眼嘴拆分或后期修补。',17)
o.save(p/'face-comparison.png')
o=Image.new('RGB',(1128,1520),'#202329');d=ImageDraw.Draw(o)
text(d,24,12,'非目标区域 · 同坐标前后检查',26)
text(d,24,59,'基础图',19);text(d,570,59,'本轮原始候选（没有保留像素或恢复文字）',19)
for y,box,label in [(116,(450,325,870,560),'帽子与耳侧：大形接近，笔触仍被重新采样/绘制'),(472,(365,810,965,970),'粉爪、笔与笔记本：布局接近，原字形并非逐像素保留'),(741,(50,945,550,1125),'前景参考书：程序化文字被生成工具重画，字形与细节发生改变'),(1030,(10,300,350,570),'左灯与环境：位置不变，表面纹理与局部颜色有漂移')]:
 text(d,24,y-12,label,17)
 for x,im in [(24,base),(570,new)]:
  c=im.crop(box);o.paste(c.resize((500,round(c.height*500/c.width)),Image.Resampling.LANCZOS),(x,y+28))
o.save(p/'non-target-review.png')
diff=ImageChops.difference(base,new)
checks={'size':list(new.size),'candidate_postprocessed':False,'generation_calls':1,'regions':{}}
for name,box in {'central_face':(440,595,895,810),'cap':(500,335,840,535),'ears':(365,395,540,550),'outer_cheek':(290,580,440,800),'paw_pencil':(460,760,600,900),'notebook':(390,865,975,965),'foreground_books':(30,950,1290,1145),'lamp':(20,300,350,560),'title':(70,60,720,270)}.items():
 a=base.crop(box);b=new.crop(box);count=sum(x!=y for x,y in zip(a.get_flattened_data(),b.get_flattened_data()))
 checks['regions'][name]={'changed_pixels':count,'total_pixels':a.width*a.height,'mean_abs_rgb':round(sum(ImageStat.Stat(ImageChops.difference(a,b)).mean)/3,3)}
(p/'scope-check.json').write_text(json.dumps(checks,indent=2)+'\n')
new.resize((534,485),Image.Resampling.LANCZOS).save('/tmp/central-face-normal.png')
print(json.dumps(checks,indent=2))
