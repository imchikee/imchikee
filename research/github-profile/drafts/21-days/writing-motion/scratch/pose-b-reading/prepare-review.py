from pathlib import Path
from PIL import Image,ImageDraw,ImageFont,ImageChops
import json,hashlib
p=Path(__file__).resolve().parent
base=Image.open(p/'../head-down-poses/pose-b.png').convert('RGB')
font='/usr/share/fonts/noto-cjk/NotoSansCJK-Medium.ttc'
def text(d,x,y,t,s=18):d.text((x,y),t,font=ImageFont.truetype(font,s),fill='#eee8dc')
checks={'base':'../head-down-poses/pose-b.png','outside_eyes':{},'identical_to_base':{}}
for n in ['start','middle','end','closing','blink','opening']:
 im=Image.open(p/f'{n}.png').convert('RGB');diff=ImageChops.difference(base,im)
 checks['identical_to_base'][n]=diff.getbbox() is None
 pixels=diff.load();changed=0
 for y in range(1195):
  for x in range(1316):
   if not ((561<=x<=666 and 697<=y<=789) or (721<=x<=800 and 731<=y<=811)) and pixels[x,y]!=(0,0,0):changed+=1
 checks['outside_eyes'][n]=changed
 assert changed==0,(n,changed)
for n in ['start','middle','end']:assert checks['identical_to_base'][n]
# Key poses, full-size source shown at normal Profile width.
o=Image.new('RGB',(1662,635),'#202329');d=ImageDraw.Draw(o)
text(d,24,12,'Pose B 静态基线 / 动画首帧 / 完全闭眼',27)
for x,im,label in [(24,base,'人工采用的 Pose B'),(570,Image.open(p/'start.png'),'动画首帧 · t=0'),(1116,Image.open(p/'blink.png'),'眨眼 · t=1.40')]:
 text(d,x,65,label);o.paste(im.resize((534,485),Image.Resampling.LANCZOS),(x,109))
text(d,24,604,'均为534px宽；首帧与基线逐像素一致，眨眼仅作用于Pose B当前两眼范围。',17)
o.save(p/'baseline-review.png')
# Keep compact eye crops for nine phases, not nine duplicate full paintings.
o=Image.new('RGB',(1212,890),'#202329');d=ImageDraw.Draw(o)
text(d,24,10,'眨眼完整睁闭过程 · 当前 Pose B 眼位',25)
for j,t in enumerate([1.30,1.333,1.367,1.40,1.433,1.467,1.50,1.533,1.56]):
 im=Image.open(p/f'phase-{j}.png').convert('RGB')
 if im.size==(1316,1195):
  im=im.crop((535,690,835,840));im.save(p/f'phase-{j}.png')
 x=12+(j%3)*400;y=64+(j//3)*266
 text(d,x,y,f'{t:.3f}s',18);o.paste(im.resize((390,195),Image.Resampling.LANCZOS),(x,y+35))
text(d,24,863,'快合、短停、稍慢睁开；没有移动、压扁或重新定位原眼球。',17)
o.save(p/'blink-review.png')
# Existing static ink is preserved unchanged through the blink.
o=Image.new('RGB',(1128,550),'#202329');d=ImageDraw.Draw(o)
text(d,24,12,'书页与笔爪 · Pose B 基线 / 动画闭眼帧',25)
for x,im,label in [(24,base,'Pose B 原画'),(570,Image.open(p/'blink.png'),'动画 t=1.40（代码和笔爪完全不动）')]:
 text(d,x,60,label,18)
 for y,box in [(112,(430,810,850,950)),(322,(0,930,1316,1195))]:
  crop=im.crop(box);o.paste(crop.resize((534,round(crop.height*534/crop.width)),Image.Resampling.LANCZOS),(x,y))
o.save(p/'page-review.png')
files=['../head-down-poses/pose-b.png','../head-down-poses/restore-print.js','../../book-content.js','../../../reading-motion/motion.js','../../../reading-motion/redrawn/contour-data.js','../../../reading-motion/lighting/config.js']
checks['source_sha256']={f:hashlib.sha256((p/f).read_bytes()).hexdigest() for f in files}
(p/'scope-check.json').write_text(json.dumps(checks,indent=2)+'\n')
print(json.dumps(checks,indent=2))
