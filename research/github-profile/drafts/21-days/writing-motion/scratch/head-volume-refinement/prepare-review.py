from pathlib import Path
from PIL import Image,ImageDraw,ImageFont,ImageChops
import json
p=Path(__file__).resolve().parent
ims=[Image.open(p/f'../head-down-poses/pose-{n}.png').convert('RGB') for n in ['a','b']]
new=Image.open(p/'pose-c.png').convert('RGB');ims.append(new)
ref=Image.open(p/'../../../reading-motion/lighting/down-v2.png').convert('RGB')
f='/usr/share/fonts/noto-cjk/NotoSansCJK-Medium.ttc'
def text(d,x,y,t,s=18):d.text((x,y),t,font=ImageFont.truetype(f,s),fill='#eee8dc')
labels=['Pose A · 原有轻微低头','Pose B · 当前脸部受压的基础','新候选 · 保体积低头尝试']
o=Image.new('RGB',(1662,640),'#202329');d=ImageDraw.Draw(o)
text(d,24,12,'低头与脸部体积 · A / B / 新候选',27)
for x,im,label in zip([24,570,1116],ims,labels):
 text(d,x,65,label,19);o.paste(im.resize((534,485),Image.Resampling.LANCZOS),(x,110))
text(d,24,608,'统一534px展示宽度；原有代码原样恢复，无排版优化、调色或角色几何拉伸。',17)
o.save(p/'full-comparison.png')
o=Image.new('RGB',(1662,1215),'#202329');d=ImageDraw.Draw(o)
text(d,24,12,'同坐标局部 · 帽檐 / 额头 / 眼鼻口 / 下巴',27)
for x,label in zip([24,570,1116],labels):text(d,x,65,label,18)
for y,box,title in [(128,(290,340,980,880),'整头与肩颈：同为690×540裁框，保留真实体量差异'),(619,(530,620,840,860),'内部脸区：同为310×240裁框，观察额头与鼻口到下巴空间')]:
 text(d,24,y-12,title,18)
 for x,im in zip([24,570,1116],ims):
  c=im.crop(box);o.paste(c.resize((500,round(c.height*500/c.width)),Image.Resampling.LANCZOS),(x,y+28))
text(d,24,1077,'新候选的脸芯纵向空间增加、帽檐压脸减弱；阅读方向的明确程度需与B一起判断。',18)
text(d,24,1121,'没有把眼睛或嘴巴单独移植，也没有将新图纵向拉伸来制造“保体积”。',18)
o.save(p/'face-comparison.png')
o=Image.new('RGB',(1128,1050),'#202329');d=ImageDraw.Draw(o)
text(d,24,12,'第一幕低头参考 / 新候选',27)
for x,im,label,box in [(24,ref,'第一幕 · lighting/down-v2.png',(285,300,935,830)),(570,new,'第二幕 · 新候选',(300,340,950,870))]:
 text(d,x,65,label,19)
 c=im.crop(box);o.paste(c.resize((500,408),Image.Resampling.LANCZOS),(x,110))
for x,im,box in [(24,ref,(535,580,835,800)),(570,new,(550,650,850,870))]:
 c=im.crop(box);o.paste(c.resize((500,367),Image.Resampling.LANCZOS),(x,565))
text(d,24,965,'每行裁框尺寸及倍率相同，只平移取景位置；不单独匹配脸的纵横比例。',17)
text(d,24,1003,'参考圆腮、短口鼻、短毛笔触与清澈眼睛，不复制第一幕背景或抱书动作。',17)
o.save(p/'reading-reference-comparison.png')
raw=Image.open(p/'pose-c-raw.png').convert('RGB');diff=ImageChops.difference(raw,new)
assert new.size==(1316,1195)
assert diff.crop((0,0,1316,864)).getbbox() is None
# Existing paper content is reused, not optimized or rewritten.
assert ImageChops.difference(Image.open(p/'print-layer.png').convert('RGBA'),Image.open(p/'../head-down-poses/pose-b-ink.png').convert('RGBA')).getbbox() is None
check={'size':list(new.size),'new_pose_generations':1,'pose_postprocessing':False,'original_print_layer_identical':True,'print_diff_bounds':list(diff.getbbox())}
(p/'checks.json').write_text(json.dumps(check,indent=2)+'\n')
new.resize((534,485),Image.Resampling.LANCZOS).save('/tmp/volume-pose-normal.png')
print(json.dumps(check))
