from pathlib import Path
from PIL import Image,ImageDraw,ImageFont,ImageChops
import json
p=Path(__file__).resolve().parent
ref=Image.open(p/'../../../reading-motion/lighting/down-v2.png').convert('RGB')
base=Image.open(p/'../character-style-unification/candidate.png').convert('RGB')
a=Image.open(p/'pose-a.png').convert('RGB');b=Image.open(p/'pose-b.png').convert('RGB')
f='/usr/share/fonts/noto-cjk/NotoSansCJK-Medium.ttc'
def text(d,x,y,t,s=18):d.text((x,y),t,font=ImageFont.truetype(f,s),fill='#eee8dc')
ims=[ref,a,b]
labels=['第一幕 · down-v2 认可原画','Pose A · 轻微低头候选','Pose B · 更明显低头候选']
o=Image.new('RGB',(1662,625),'#202329');d=ImageDraw.Draw(o)
text(d,24,12,'真实低头姿态 · 第一幕 / A / B',27)
for x,im,label in zip([24,570,1116],ims,labels):
 text(d,x,64,label,19);o.paste(im.resize((534,485),Image.Resampling.LANCZOS),(x,108))
text(d,24,599,'同为 534px 展示宽度；A/B均恢复程序化C++文字，无眼嘴拼贴、后期角色变形或调色。',17)
o.save(p/'full-comparison.png')
o=Image.new('RGB',(1662,1520),'#202329');d=ImageDraw.Draw(o)
text(d,24,12,'头部透视与连接 · 第一幕 / A / B',27)
for x,label in zip([24,570,1116],labels):text(d,x,64,label,19)
rows=[(119,'01  完整头部、帽檐与圆腮（同尺寸裁框）',[(280,300,980,850),(280,340,980,890),(280,340,980,890)]),(602,'02  眼睛与鼻口（同尺寸裁框）',[(535,600,835,765),(535,645,835,810),(535,690,835,855)]),(975,'03  肩颈、短臂与毛发连接（同尺寸裁框）',[(220,730,820,1010),(280,670,880,950),(280,670,880,950)])]
for y,title,boxes in rows:
 text(d,24,y-12,title,18)
 for x,im,box in zip([24,570,1116],ims,boxes):
  c=im.crop(box);o.paste(c.resize((500,round(c.height*500/c.width)),Image.Resampling.LANCZOS),(x,y+28))
text(d,24,1280,'俯仰证据：帽顶、帽檐与鼻口关系改变；B下巴更接近笔记本，双眼仍可见。',18)
text(d,24,1325,'风险：A/B也有侧倾，B帽冠视觉体量偏大；俯倾不能仅按提示词中的角度认定。',18)
text(d,24,1370,'第一幕保持原画，不为本轮改绘；各行同裁框尺寸与缩放倍率，未拉伸角色。',18)
o.save(p/'head-comparison.png')
o=Image.new('RGB',(1662,1210),'#202329');d=ImageDraw.Draw(o)
text(d,24,12,'书页恢复与笔爪遮挡 · 基础图 / A / B',26)
for x,label in zip([24,570,1116],['造型基础（恢复后的原字）','Pose A · 现有程序化排版','Pose B · 相同程序化排版']):text(d,x,64,label,18)
for y,box,title in [(125,(430,810,850,940),'笔尖、粉爪与笔记本上缘'),(376,(370,845,1000,980),'中央笔记本与页缘'),(615,(15,915,665,1160),'左前景参考书'),(903,(740,930,1316,1165),'右前景参考书')]:
 text(d,24,y-16,title,18)
 for x,im in zip([24,570,1116],[base,a,b]):
  c=im.crop(box);o.paste(c.resize((500,round(c.height*500/c.width)),Image.Resampling.LANCZOS),(x,y+24))
o.save(p/'page-review.png')
checks={}
for key,im in [('a',a),('b',b)]:
 raw=Image.open(p/f'pose-{key}-raw.png').convert('RGB');diff=ImageChops.difference(im,raw)
 assert diff.crop((0,0,1316,864)).getbbox() is None
 # All post-generation changes must come from adding the existing programmatic ink.
 checks[key]={'size':list(im.size),'post_generation_diff_bounds':list(diff.getbbox()),'changed_above_y864':False,'face_retouch':False}
 im.resize((534,485),Image.Resampling.LANCZOS).save(f'/tmp/head-down-{key}-normal.png')
(p/'page-check.json').write_text(json.dumps(checks,indent=2)+'\n')
print(json.dumps(checks,indent=2))
