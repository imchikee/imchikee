from pathlib import Path
from PIL import Image,ImageDraw,ImageFont,ImageChops
import json
p=Path(__file__).resolve().parent
ref=Image.open(p/'../../../reading-motion/lighting/down-v2.png').convert('RGB')
new=Image.open(p/'candidate.png').convert('RGB')
font='/usr/share/fonts/noto-cjk/NotoSansCJK-Medium.ttc'
def text(d,x,y,t,s=18):d.text((x,y),t,font=ImageFont.truetype(font,s),fill='#eee8dc')
def save(o,name):
 o.save(p/f'{name}.png')
 for q in range(95,39,-1):
  o.save(p/f'{name}.jpg','JPEG',quality=q,optimize=True,progressive=True,subsampling=0)
  if (p/f'{name}.jpg').stat().st_size<400000:break
 assert (p/f'{name}.jpg').stat().st_size<400000
 return {'size':list(o.size),'jpeg_bytes':(p/f'{name}.jpg').stat().st_size,'jpeg_quality':q}
results={}
o=Image.new('RGB',(1458,695),'#202329');d=ImageDraw.Draw(o)
text(d,24,12,'角色身份 · 第一幕 / 第二幕唯一新候选',27)
for x,im,label in [(24,ref,'第一幕 · down-v2 角色设计标准'),(739,new,'第二幕 · 从第一幕身份重新制作')]:
 text(d,x,66,label,20);o.paste(im.crop((270,300,965,850)),(x,111))
text(d,24,668,'完全相同的原始像素裁框，1:1倍率；不拉伸脸、不单独匹配眼睛或帽子大小。',17)
results['head']=save(o,'review-head')
o=Image.new('RGB',(1180,860),'#202329');d=ImageDraw.Draw(o)
text(d,24,12,'眼睛 / 鼻子 / 嘴巴 · 同倍率局部',27)
text(d,24,65,'第一幕 · down-v2',20);text(d,604,65,'第二幕 · 唯一候选',20)
for x,im,eye,mouth in [(24,ref,(550,600,825,705),(620,675,755,760)),(604,new,(550,615,825,720),(620,685,755,770))]:
 o.paste(im.crop(eye).resize((550,210),Image.Resampling.LANCZOS),(x,115))
 o.paste(im.crop(mouth).resize((540,340),Image.Resampling.LANCZOS),(x,427))
text(d,24,357,'眼部：相同275×105裁框，统一2×；鼻口：相同135×85裁框，统一4×。',17)
text(d,24,801,'仅平移取景，不变形、调色或匹配五官比例。嘴部更收敛，不沿用场景基础的张嘴吐舌。',17)
results['features']=save(o,'review-features')
o=Image.new('RGB',(1128,625),'#202329');d=ImageDraw.Draw(o)
text(d,24,12,'第一幕同一角色 → 桌前继续学习 C++',26)
for x,im,label in [(24,ref,'第一幕 · 已认可原画'),(570,new,'第二幕 · 唯一静态候选')]:
 text(d,x,65,label,19);o.paste(im.resize((534,485),Image.Resampling.LANCZOS),(x,108))
text(d,24,599,'两幕均534px宽；角色身份优先于低头幅度。本轮不制作或接入动画。',17)
results['full']=save(o,'review-full')
raw=Image.open(p/'generated-raw.png').convert('RGB');diff=ImageChops.difference(raw,new)
assert new.size==(1316,1195)
assert diff.crop((0,0,1316,864)).getbbox() is None
assert ImageChops.difference(Image.open(p/'print-layer.png').convert('RGBA'),Image.open(p/'../character-style-unification/print-layer.png').convert('RGBA')).getbbox() is None
(p/'checks.json').write_text(json.dumps({'generation_calls':1,'image_size':list(new.size),'reference_print_unchanged':True,'post_generation_diff_bounds':list(diff.getbbox()),'jpeg_reviews':results},indent=2)+'\n')
print(json.dumps(results,indent=2))
