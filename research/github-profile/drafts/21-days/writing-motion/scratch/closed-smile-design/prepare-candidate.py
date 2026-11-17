from pathlib import Path
from PIL import Image,ImageDraw,ImageChops
import json
p=Path(__file__).resolve().parent
base=Image.open(p/'../reading-identity-static/candidate.png').convert('RGB')
raw=Image.open(p/'mouth-edit-raw.png').convert('RGB')
# Register the one generated crop back to its actual source coordinates.
assert abs(raw.width/raw.height-1.4)<.01
crop=raw.resize((140,100),Image.Resampling.LANCZOS)
layer=base.copy();layer.paste(crop,(620,690))
S=4;mask=Image.new('L',(1316*S,1195*S),0)
points=[(636,706),(649,702),(663,706),(677,716),(691,719),(705,718),(722,708),(737,707),(744,716),(741,740),(730,754),(706,763),(670,762),(646,749),(635,727)]
curve=[]
for i in range(len(points)):
 a,b,c,e=[points[j%len(points)] for j in (i-1,i,i+1,i+2)]
 for j in range(24):
  t=j/24
  curve.append(tuple(S*.5*(2*b[k]+(-a[k]+c[k])*t+(2*a[k]-5*b[k]+4*c[k]-e[k])*t*t+(-a[k]+3*b[k]-3*c[k]+e[k])*t*t*t) for k in (0,1)))
ImageDraw.Draw(mask).polygon(curve,fill=255)
mask=mask.resize(base.size,Image.Resampling.LANCZOS).point(lambda v:0 if v<4 else 255 if v>251 else v)
# Nose is a locked original, including the original lower tip. No other face
# parts are imported, even if the crop generator changed tiny corner fragments.
ImageDraw.Draw(mask).rectangle((675,688,724,717),fill=0)
candidate=Image.composite(layer,base,mask)
candidate.save(p/'candidate.png');mask.save(p/'mouth-support.png')
diff=ImageChops.difference(base,candidate)
for name,box in [('left_eye',(550,610,660,700)),('right_eye',(735,625,815,705)),('nose',(675,688,725,718)),('hat',(470,300,860,550)),('body_books',(0,780,1316,1195))]:
 assert ImageChops.difference(base.crop(box),candidate.crop(box)).getbbox() is None,name
flag=[a!=b for a,b in zip(base.get_flattened_data(),candidate.get_flattened_data())]
assert all(not v or m for v,m in zip(flag,mask.get_flattened_data()))
(p/'scope-check.json').write_text(json.dumps({'size':list(candidate.size),'changed_pixels':sum(flag),'diff_bounds':list(diff.getbbox()),'changes_outside_mouth_support':0,'nose_and_eyes_unchanged':True},indent=2)+'\n')
candidate.resize((534,485),Image.Resampling.LANCZOS).save('/tmp/closed-smile-normal.png')
print('Mouth candidate composed once; changed bounds:',diff.getbbox(),'pixels:',sum(flag))
