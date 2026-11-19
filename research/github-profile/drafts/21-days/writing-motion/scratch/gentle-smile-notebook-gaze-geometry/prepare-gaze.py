"""Reproject two complete iris discs inside the original painted eye openings."""
from math import atan2, cos, hypot, pi, sin
from pathlib import Path
import json

from PIL import Image, ImageChops, ImageDraw, ImageFont

folder = Path(__file__).resolve().parent
base = Image.open(folder.parent / 'gentle-smile-soft-rim/candidate.png').convert('RGB')
previous = Image.open(folder.parent / 'gentle-smile-notebook-gaze/candidate.png').convert('RGB')
result = base.copy()
allowed = Image.new('L', base.size)
eyes = [
    dict(name='left', center=(615,655), axes=(29,25), pupil=.53, original=(615,641),
         light=(628,630), angle=.08,
         boundary=[(590,628),(600,617),(612,612),(625,612),(637,620),(646,632),(649,646),
                   (645,657),(638,665),(626,670),(612,670),(599,665),(591,656),(587,645)]),
    dict(name='right', center=(768,662), axes=(24,23), pupil=.53, original=(776,649),
         light=(783,637), angle=-.25,
         boundary=[(755,643),(760,632),(769,623),(783,621),(793,628),(799,639),(801,651),
                   (798,666),(791,674),(780,677),(769,675),(759,670),(752,661),(752,651)]),
]


def smooth(t):
    t = max(0., min(1., t))
    return t*t*(3-2*t)


def mix(a, b, t):
    return tuple(x+(y-x)*t for x,y in zip(a,b))


def distance(x, y, a, b):
    dx,dy = b[0]-a[0],b[1]-a[1]
    t = max(0.,min(1.,((x-a[0])*dx+(y-a[1])*dy)/(dx*dx+dy*dy)))
    return hypot(x-a[0]-t*dx,y-a[1]-t*dy)


def pixel(x,y):
    return base.getpixel((round(x),round(y)))


def project_eye(eye):
    poly = eye['boundary']
    support = Image.new('L',base.size)
    ImageDraw.Draw(support).polygon(poly,fill=255)
    allowed.paste(255, (0,0,*base.size),support)
    cx,cy = eye['center']
    ox,oy = eye['original']
    ax,ay = eye['axes']
    hx,hy = eye['light']
    ct,st = cos(eye['angle']),sin(eye['angle'])
    edges = list(zip(poly, poly[1:]+poly[:1]))
    x0,y0,x1,y1 = support.getbbox()
    for y in range(y0,y1):
        for x in range(x0,x1):
            if not support.getpixel((x,y)):
                continue
            edge = min(distance(x,y,a,b) for a,b in edges)
            # Position and foreshortening apply to the entire nested disc.
            u,v = ((x-cx)*ct+(y-cy)*st)/ax, (-(x-cx)*st+(y-cy)*ct)/ay
            r,theta = hypot(u,v),atan2(v,u)
            y_light = smooth((y-y0)/(y1-y0))
            # The visible globe beyond the rotated iris is shaded warm umber.
            outside = mix((42,22,13),(72,34,13),y_light)
            # Use the original amber annulus as a source of fine pigment variation.
            # Reflect sampling into the lit lower arc to separate pigment from old lid shadow.
            q = ((theta + pi) / (2*pi))
            src_theta = .20+2.68*(1-abs(2*q-1))
            src_radius = 18+min(1,max(0,(r-.52)/.48))*8
            rr,gg,bb = pixel(ox+cos(src_theta)*src_radius,oy+sin(src_theta)*src_radius)
            detail = max(-9,min(11,(rr-2*gg+bb)*.45))
            iris = mix((74,38,15),(137,72,24),y_light)
            iris = tuple(c+detail*w for c,w in zip(iris,(1,.56,.28)))
            iris = mix(iris,(32,15,7),smooth((r-.84)/.17))
            pupil = mix((8,5,4),(17,9,5),y_light)
            iris = mix(pupil,iris,smooth((r-eye['pupil']+.035)/.07))
            colour = mix(iris,outside,smooth((r-.96)/.10))
            original = pixel(x,y)
            # Retain the energy and position of the source reflection over the new globe.
            h = hypot((x-hx)/8.5,(y-hy)/8.5)
            reflection = (1-smooth((h-.63)/.37))*smooth((min(original)-28)/145)
            colour = mix(colour,original,reflection)
            colour = mix(original,colour,smooth(edge/4.7))
            result.putpixel((x,y),tuple(round(max(0,min(255,c))) for c in colour))


for eye in eyes:
    project_eye(eye)
result.save(folder/'candidate.png')
delta = ImageChops.difference(base,result)
assert ImageChops.composite(Image.new('RGB',base.size),delta,allowed).getbbox() is None


def dark_center(im, box, threshold, seed):
    x0,y0,x1,y1 = box
    pixels = {(x,y) for y in range(y0,y1) for x in range(x0,x1) if im.getpixel((x,y))[0] <= threshold}
    start = min(pixels,key=lambda p:hypot(p[0]-seed[0],p[1]-seed[1]))
    component = set()
    pending = [start]
    while pending:
        x,y = pending.pop()
        if (x,y) in pixels and (x,y) not in component:
            component.add((x,y))
            pending.extend([(x-1,y),(x+1,y),(x,y-1),(x,y+1)])
    return [round(sum(p[i] for p in component)/len(component),2) for i in (0,1)]


measurements = {}
for e,box in zip(eyes,[(596,625,638,671),(752,632,795,676)]):
    measurements[e['name']] = {
        str(t): [dark_center(im,box,t,e['center']) for im in (base,previous,result)]
        for t in (16,22,28)
    }
(folder/'scope-check.json').write_text(json.dumps({
    'target':(608,905), 'geometry':eyes, 'changed_bbox':delta.getbbox(),
    'changed_pixels':sum(a!=b for a,b in zip(base.get_flattened_data(),result.get_flattened_data())),
    'outside_registered_interiors_changed_pixels':0,
    'dark_connected_centroids_order':['baseline','round 1','round 2'],
    'dark_connected_centroids_by_red_threshold':measurements,
},indent=2)+'\n')

font = ImageFont.truetype('/usr/share/fonts/noto-cjk/NotoSansCJK-Medium.ttc',16)


def review(name,images,labels):
    w,h = images[0].size
    board = Image.new('RGB',(len(images)*(w+16)+16,h+55),'#202329')
    draw = ImageDraw.Draw(board)
    for j,(im,label) in enumerate(zip(images,labels)):
        x = 16+(w+16)*j
        draw.text((x,10),label,font=font,fill='white')
        board.paste(im,(x,39))
    board.save(folder/(name+'.png'))


def scale(im):
    return im.resize((534,485),Image.Resampling.LANCZOS)


labels = ['原版 · 5e19f08','第一轮 · 局部位移','第二轮 · 虹膜整体几何']
review('review-534',[scale(im) for im in (base,previous,result)],labels)
review('review-eyes',[im.crop((548,593,827,690)).resize((558,194),Image.Resampling.LANCZOS)
                       for im in (base,previous,result)],labels)
pair = Image.open(folder.parent/'gentle-smile-blink/review-pair.png')
review('review-cut-534',[pair.crop((534,40,1068,525)),scale(base),scale(result)],
       ['第一幕 · 联播实播 3.179 s','第二幕 · 3.212 s 基线睁眼原画','第二幕 · 静态候选代入开场'])
