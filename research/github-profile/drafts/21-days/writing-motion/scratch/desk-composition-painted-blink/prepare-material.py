from pathlib import Path
from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageFont
import json

work = Path(__file__).resolve().parent
ORIGIN = (450,570)
BASE = work.parent/'desk-composition-painted-cheek-forelimb-review/candidate.png'
with Image.open(BASE) as scene:
    base = scene.convert('RGB')
target = Image.open(work/'eye-reference.png').convert('RGB')
assert target.size == (272,142)
box = (*ORIGIN,ORIGIN[0]+target.width,ORIGIN[1]+target.height)
assert ImageChops.difference(base.crop(box),target).getbbox() is None

# Check scale registration against fixed landmarks. Use only non-eyelid objects.
source = Image.open(work/'closed-raw.png').convert('RGB')
assert abs(source.width/source.height-target.width/target.height)<0.003
registered = source.resize(target.size,Image.Resampling.LANCZOS)
landmarks = {'nose':(89,99,119,118), 'left whisker':(4,67,23,79), 'right whisker':(244,108,260,125)}
for name,rect in landmarks.items():
    part = target.crop(rect).convert('L')
    def match(dx,dy):
        shifted = registered.crop((rect[0]+dx,rect[1]+dy,rect[2]+dx,rect[3]+dy)).convert('L')
        return sum(i*n for i,n in enumerate(ImageChops.difference(part,shifted).histogram()))
    offset = min(((dx,dy) for dx in range(-3,4) for dy in range(-3,4)),key=lambda v:match(*v))
    print(name,offset)

contours = [
    [(14,21),(19,13),(32,10),(46,9),(58,13),(69,20),(77,32),(82,46),
     (84,61),(79,74),(69,82),(55,81),(42,77),(30,69),(21,58),(16,44)],
    [(146,76),(157,60),(171,51),(187,46),(205,47),(219,51),(231,59),
     (242,66),(250,72),(249,81),(238,90),(230,102),(218,112),(201,117),
     (179,116),(159,109),(149,98),(145,85)]
]
alpha = Image.new('L',target.size)
for contour in contours:
    mask = Image.new('L',target.size)
    ImageDraw.Draw(mask).polygon(contour,fill=255)
    feather = ImageChops.multiply(mask,mask.filter(ImageFilter.MinFilter(7)).filter(ImageFilter.GaussianBlur(3)))
    alpha = ImageChops.lighter(alpha,feather)
alpha.save(work/'lid-alpha.png')
registered.save(work/'registered-lid.png')
closed = Image.composite(registered,target,alpha)
result = base.copy()
result.paste(closed,ORIGIN)
result.save(work/'closed-static.png')
outside = Image.new('L',base.size)
outside.paste(alpha.point(lambda v:255 if v else 0),ORIGIN)
r,g,b = ImageChops.difference(base,result).split()
assert not ImageChops.multiply(ImageChops.lighter(r,ImageChops.lighter(g,b)),ImageChops.invert(outside)).getbbox()
print('Static source changes are limited to the two new eye masks.')

font = ImageFont.truetype('/usr/share/fonts/noto-cjk/NotoSansCJK-Medium.ttc',17)
def comparison(left,right):
    gap = 16
    w,h = left.size
    canvas = Image.new('RGB',(2*w+gap*3,h+57),'#202329')
    for x,img,caption in [(gap,left,'睁眼 · 母版'),(w+2*gap,right,'完全闭眼 · 静态配准')]:
        canvas.paste(img,(x,40))
        ImageDraw.Draw(canvas).text((x,11),caption,font=font,fill='white')
    return canvas
comparison(base.resize((534,485),Image.Resampling.LANCZOS),result.resize((534,485),Image.Resampling.LANCZOS)).save(work/'review-closed-534.png')
comparison(target,closed).save(work/'review-closed-eyes.png')
