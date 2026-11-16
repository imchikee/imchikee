from pathlib import Path
import json
from PIL import Image, ImageDraw, ImageFont, ImageChops
p=Path(__file__).resolve().parent
base=Image.open(p/'../character-style-unification/candidate.png').convert('RGB')
raw=Image.open(p/'generated-raw.png').convert('RGB')
assert base.size==raw.size==(1316,1195)
# One isolation operation, not a redraw or successive patch refinement.
# Curved, antialiased regions cover only the eye/lid interiors and mouth repair.
S=4
mask=Image.new('L',(1316*S,1195*S),0);d=ImageDraw.Draw(mask)
for box in [(554,618,654,726),(717,633,807,737)]:d.ellipse(tuple(v*S for v in box),fill=255)
points=[(625,720),(639,713),(660,718),(675,727),(706,727),(726,715),(740,722),(744,754),(735,783),(716,800),(663,803),(634,785),(624,753)]
# Closed Catmull-Rom curve avoids a rectangular crop boundary.
curve=[]
for i in range(len(points)):
 a,b,c,e=[points[j%len(points)] for j in (i-1,i,i+1,i+2)]
 for j in range(24):
  t=j/24
  curve.append(tuple(S*.5*((2*b[k])+(-a[k]+c[k])*t+(2*a[k]-5*b[k]+4*c[k]-e[k])*t*t+(-a[k]+3*b[k]-3*c[k]+e[k])*t*t*t) for k in (0,1)))
d.polygon(curve,fill=255)
mask=mask.resize(base.size,Image.Resampling.LANCZOS)
# Clamp resampling ringing: antialias only one pixel around the isolation boundary.
mask=mask.point(lambda v:0 if v<4 else 255 if v>251 else v)
mask.save(p/'edit-support.png')
candidate=Image.composite(raw,base,mask);candidate.save(p/'candidate-attempt.png')
diff=ImageChops.difference(base,candidate)
rawdiff=ImageChops.difference(base,raw)
changed=diff.convert('RGB').point(lambda v:255 if v else 0)
# Exact RGB comparison; these counts describe scope, not visual quality.
flag=[a!=b for a,b in zip(base.getdata(),candidate.getdata())]
rawflag=[a!=b for a,b in zip(base.getdata(),raw.getdata())]
checks={'size':list(base.size),'raw_changed_pixels':sum(rawflag),'isolated_changed_pixels':sum(flag),'changes_outside_support':sum(v for v,m in zip(flag,mask.getdata()) if m==0),'support_bounds':list(mask.getbbox()),'result':'failed-visual-gate'}
checks['protected_regions']={}
for name,box in {'title':(0,0,1316,300),'hat_and_ears':(350,305,940,595),'nose':(674,699,708,724),'left_cheek_outline':(275,590,540,805),'right_cheek_outline':(810,590,980,805),'paws_and_body':(275,810,970,890),'notebook_and_foreground':(0,864,1316,1195),'left_lamp':(0,280,350,960),'mug_and_shelves':(995,30,1316,920)}.items():
 x1,y1,x2,y2=box;checks['protected_regions'][name]=sum(flag[y*1316+x] for y in range(y1,y2) for x in range(x1,x2))
assert checks['changes_outside_support']==0
assert not any(checks['protected_regions'].values())
(p/'scope-check.json').write_text(json.dumps(checks,indent=2)+'\n')
font='/usr/share/fonts/noto-cjk/NotoSansCJK-Medium.ttc'
def txt(d,x,y,t,s=18,col='#eee8dc'):d.text((x,y),t,font=ImageFont.truetype(font,s),fill=col)
first=Image.open(p/'../more-cpp-finish/reading-start.png').convert('RGB')
sheet=Image.new('RGB',(1662,620),'#202329');d=ImageDraw.Draw(sheet)
txt(d,24,10,'第二幕视线与表情 · 唯一编辑候选（未通过）',27)
for x,im,label in [(24,first,'第一幕 · 当前认可输出'),(570,base,'第二幕 · 修改前'),(1116,candidate,'第二幕 · 隔离后的唯一候选')]:
 txt(d,x,63,label);sheet.paste(im.resize((534,485),Image.Resampling.LANCZOS),(x,102))
txt(d,24,592,'同为 534px 展示宽度；嘴部更安静，但眼白与眼形变化使其不适合作为最终版本。保留原版。',17)
sheet.save(p/'full-comparison.png')
sheet=Image.new('RGB',(1128,1045),'#202329');d=ImageDraw.Draw(sheet)
txt(d,24,12,'眼睛与嘴部 · 前后同坐标对照',26)
txt(d,24,59,'修改前',20);txt(d,570,59,'隔离后的唯一候选 · 不采用',20)
for y,box,label in [(110,(540,605,820,740),'眼部：相同 280×135 裁框，放大 1.8×'),(440,(610,690,760,820),'嘴部与鼻子：相同 150×130 裁框，放大 3×')]:
 txt(d,24,y-12,label,17)
 for x,im in [(24,base),(570,candidate)]:
  c=im.crop(box);mult=1.8 if y==110 else 3
  sheet.paste(c.resize((round(c.width*mult),round(c.height*mult)),Image.Resampling.LANCZOS),(x,y+24))
txt(d,24,897,'眼睛有向下的意图，但浅色眼白面积大，眼形也发生变化；不能判为自然的最终专注神态。',17)
txt(d,24,935,'嘴部收敛有效；鼻子、胡须与非目标像素保留原版。未继续调整眼睛或混用旧素材。',17)
txt(d,24,981,'局部边界仅作约 1px 抗锯齿；无大面积羽化、调色、变形或矩形拼贴。',17)
sheet.save(p/'face-comparison.png')
sheet=Image.new('RGB',(1662,650),'#202329');d=ImageDraw.Draw(sheet)
txt(d,24,12,'非目标区域检查 · 原图 / 编辑范围 / 实际变化',26)
txt(d,24,58,'蓝色区域表示唯一允许导入生成像素的位置；差异图只显示发生变化的位置，不代表通过美术验收。',17)
for x,label in [(24,'原始 candidate.png'),(570,'曲线编辑范围（示意）'),(1116,'实际 RGB 差异位置（白色）')]:txt(d,x,101,label,19)
sheet.paste(base.resize((534,485),Image.Resampling.LANCZOS),(24,141))
over=base.copy();color=Image.new('RGB',base.size,'#2c95bd');over=Image.composite(color,over,mask.point(lambda v:round(v*.7)))
sheet.paste(over.resize((534,485),Image.Resampling.LANCZOS),(570,141))
binary=Image.new('L',base.size);binary.putdata([255 if v else 0 for v in flag]);binary=binary.convert('RGB');sheet.paste(binary.resize((534,485),Image.Resampling.NEAREST),(1116,141))
sheet.save(p/'non-target-review.png')
candidate.resize((534,485),Image.Resampling.LANCZOS).save('/tmp/focused-expression-normal.png')
print(json.dumps(checks,indent=2))
