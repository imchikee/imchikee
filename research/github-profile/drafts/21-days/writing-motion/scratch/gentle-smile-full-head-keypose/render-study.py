"""Single-view structural study from a depth proxy and independently posed eyes."""
import json
from math import atan2, cos, exp, hypot, radians, sin, sqrt
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageFont

here = Path(__file__).resolve().parent
base = Image.open(here.parent/'gentle-smile-soft-rim/candidate.png').convert('RGB')
pitch, turn = map(radians, (15, -4))
pivot = (664, 750)
outline = [(369,496),(376,443),(404,405),(454,383),(504,382),
           (537,354),(580,337),(642,332),(663,321),(694,337),
           (745,360),(775,394),(790,426),(831,410),(875,435),
           (902,476),(900,514),(879,551),(899,588),(918,632),
           (933,681),(933,725),(915,759),(888,778),(849,790),
           (807,796),(754,802),(688,812),(620,809),(549,797),
           (502,775),(482,752),(461,752),(443,775),(400,778),
           (352,770),(321,747),(301,717),(296,679),(310,628),
           (331,579),(358,549),(386,523)]


def gaussian(x,y,cx,cy,rx,ry):
    return exp(-((x-cx)/rx)**2-((y-cy)/ry)**2)


def depth(x,y):
    # Relative to the shoulder support, the nose and bill project farther
    # than the brow or ears. The focal plane is the original orthographic view.
    return (18*gaussian(x,y,617,558,260,225)
            + 72*gaussian(x,y,698,673,175,116)
            + 23*gaussian(x,y,708,494,180,51)
            - 14*gaussian(x,y,655,339,110,45))


def project(x,y):
    X,Y = x-pivot[0],y-pivot[1]
    Z = depth(x,y)
    xx,zz = X*cos(turn)+Z*sin(turn), Z*cos(turn)-X*sin(turn)
    yy = Y*cos(pitch)+zz*sin(pitch)
    return pivot[0]+xx,pivot[1]+yy


def inverse(x,y):
    u,v = x,y
    for _ in range(10):
        xx,yy = project(u,v)
        u,v = u+x-xx,v+y-yy
    return u,v


def smooth(k):
    k = max(0.,min(1.,k))
    return k*k*(3-2*k)


def mix(a,b,t):
    return tuple(x+(y-x)*t for x,y in zip(a,b))


support = Image.new('L',base.size)
ImageDraw.Draw(support).polygon(outline,fill=255)
box = support.getbbox()
xs = list(range(box[0],box[2],4))+[box[2]]
ys = list(range(box[1],box[3],4))+[box[3]]
grid = {(x,y):inverse(x,y) for x in xs for y in ys}
mesh = [
    ((x-box[0],y-box[1],r-box[0],b-box[1]),grid[x,y]+grid[x,b]+grid[r,b]+grid[r,y])
    for y,b in zip(ys,ys[1:]) for x,r in zip(xs,xs[1:])
]
head = base.transform((box[2]-box[0],box[3]-box[1]),Image.Transform.MESH,mesh,Image.Resampling.BICUBIC)
result = base.copy()
mask = ImageChops.multiply(support.filter(ImageFilter.MinFilter(13)).filter(ImageFilter.GaussianBlur(4)),support)
result.paste(head,box[:2],mask.crop(box))

# Independent eyeballs share the head pose. They use new rounded apertures
# shaded as one glossy warm surface. Each globe aims toward the target in its
# own direction. A light reflection remains on the cornea, above the dark core.
eyes = [
    dict(point=(614,641), radius=(29,29), gaze=(-.04,.51), glint=(10,-9)),
    dict(point=(777,650), radius=(23,27), gaze=(-.28,.48), glint=(7,-9)),
]
for e in eyes:
    cx,cy = project(*e['point'])
    rx,ry = e['radius']
    gx,gy = e['gaze']
    gz = sqrt(1-gx*gx-gy*gy)
    hx,hy = e['glint']
    for y in range(int(cy-ry),int(cy+ry+1)):
        for x in range(int(cx-rx),int(cx+rx+1)):
            if not support.getpixel((x,y)):
                continue
            u,v = (x-cx)/rx,(y-cy)/ry
            r2 = u*u+v*v
            if r2>=1:
                continue
            z = sqrt(1-r2)
            toward = u*gx+v*gy+z*gz
            amber = gaussian(u,v,-.14,.19,1.15,.77)
            shade = smooth((v+.95)/1.16)
            angle = atan2(v-gy,u-gx)
            rays = 1+.13*sin(17*angle)+.07*cos(25*angle)
            iris = mix((23,11,7),(120,62,24),min(1,amber*shade*rays))
            pupil = smooth((toward-.823)/.138)
            colour = mix(iris,(10,6,4),pupil*.97)
            glint = hypot((x-cx-hx)/5.4,(y-cy-hy)/5.2)
            colour = mix(colour,(118,75,42),.27*exp(-glint*glint/1.7))
            colour = mix(colour,(255,243,218),smooth((1.11-glint)/.53))
            colour = mix(result.getpixel((x,y)),colour,smooth((1-r2)/.24))
            result.putpixel((x,y),tuple(round(c) for c in colour))

delta = ImageChops.difference(base,result)
assert ImageChops.composite(Image.new('RGB',base.size),delta,support).getbbox() is None
assert delta.crop((0,813,1316,1195)).getbbox() is None
guard = Image.new('L',base.size)
draw = ImageDraw.Draw(guard)
draw.polygon([(462,760),(477,759),(600,899),(590,908),(462,781)],fill=255)
draw.polygon([(280,815),(350,797),(420,803),(484,819),(555,823),
              (576,860),(552,896),(278,889)],fill=255)
draw.polygon([(741,811),(880,796),(914,855),(880,884),(729,877)],fill=255)
assert Image.composite(delta,Image.new('RGB',base.size),guard).getbbox() is None
result.save(here/'keypose.png')
(here/'scope-check.json').write_text(json.dumps({
    'baseline':'5e19f08b144caf0f50a414c9dc8487f1293d5efe',
    'proxy_rotation_degrees':{'pitch':15,'screen_left_turn':4},
    'paper_target':(608,905),
    'head_support':outline,
    'changed_pixels':sum(a!=b for a,b in zip(base.get_flattened_data(),result.get_flattened_data())),
    'changed_bbox':delta.getbbox(),
    'outside_head_support_changed_pixels':0,
    'guarded_pencil_arms_paws_changed_pixels':0,
    'rows_813_and_below_changed_pixels':0,
},indent=2)+'\n')

font = ImageFont.truetype('/usr/share/fonts/noto-cjk/NotoSansCJK-Medium.ttc',18)


def review(name,a,b,left,right):
    w,h = a.size
    board = Image.new('RGB',(2*w+48,h+58),'#202329')
    draw = ImageDraw.Draw(board)
    for x,img,label in [(16,a,left),(32+w,b,right)]:
        draw.text((x,11),label,font=font,fill='white')
        board.paste(img,(x,41))
    board.save(here/(name+'.png'))


def display(im):
    return im.resize((534,485),Image.Resampling.LANCZOS)


review('review-534',display(base),display(result),'原画 · 5e19f08','完整新头姿 · 结构关键帧')
pair = Image.open(here.parent/'gentle-smile-blink/review-pair.png')
review('review-cut-534',pair.crop((534,40,1068,525)),display(result),
       '第一幕 · 实播 3.179 s','第二幕 · 新静帧置于切换处')
head_box = (276,307,953,833)
review('review-head',base.crop(head_box),result.crop(head_box),'原画头部 · 原尺寸','新头姿 · 原尺寸')
