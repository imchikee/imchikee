from math import floor, hypot
from pathlib import Path
import json

from PIL import Image, ImageChops

p = Path(__file__).resolve().parent
base = Image.open(p.parent / 'gentle-smile-soft-rim/candidate.png').convert('RGB')
result = base.copy()
pixels = base.load()
allowed = Image.new('L', base.size)
# Canvas coordinates. The target is the existing ink just to the right of the pencil tip.
target = (608, 905)
eyes = [
    dict(center=(616, 642), radii=(30, 29), shift=(-1, 9), light=(628, 630, 9, 9)),
    dict(center=(777, 649), radii=(23, 28), shift=(-6, 9), light=(783, 637, 8, 9)),
]


def smooth(x):
    x = max(0, min(1, x))
    return x * x * (3 - 2 * x)


def separate_reflection(light):
    cx, cy, rx, ry = light
    interior = {}
    for y in range(cy - ry, cy + ry + 1):
        for x in range(cx - rx, cx + rx + 1):
            if hypot((x-cx)/rx, (y-cy)/ry) < 1:
                interior[x,y] = tuple(float(c) for c in pixels[x, cy + ry])
    # Extend neighbouring dark iris colours through the small reflection footprint.
    for _ in range(170):
        for x,y in interior:
            neighbours = [interior.get(q, pixels[q]) for q in ((x-1,y),(x+1,y),(x,y-1),(x,y+1))]
            interior[x,y] = tuple(sum(c[i] for c in neighbours)*.25 for i in range(3))
    return interior


def bilinear(x, y, clean):
    ix, iy = floor(x), floor(y)
    u, v = x-ix, y-iy
    a, b, c, d = [clean.get(q, pixels[q]) for q in ((ix,iy),(ix+1,iy),(ix,iy+1),(ix+1,iy+1))]
    return tuple((a[i]*(1-u)+b[i]*u)*(1-v)+(c[i]*(1-u)+d[i]*u)*v for i in range(3))


for eye in eyes:
    cx, cy = eye['center']
    rx, ry = eye['radii']
    dx, dy = eye['shift']
    clean = separate_reflection(eye['light'])
    for y in range(cy-ry, cy+ry+1):
        for x in range(cx-rx, cx+rx+1):
            r = hypot((x-cx)/rx, (y-cy)/ry)
            if r >= 1:
                continue
            allowed.putpixel((x,y), 255)
            weight = 1-smooth((r-.22)/.78)
            colour = bilinear(x-dx*weight, y-dy*weight, clean)
            original = pixels[x,y]
            # Reapply the original reflected light at its original coordinates.
            if (x,y) in clean:
                colour = tuple(colour[i]+original[i]-clean[x,y][i] for i in range(3))
            result.putpixel((x,y),tuple(round(max(0,min(255,c))) for c in colour))

diff = ImageChops.difference(base,result)
outside = ImageChops.composite(Image.new('RGB',base.size),diff,allowed)
assert not outside.getbbox()
result.save(p/'candidate.png')
count = sum(a != b for a,b in zip(base.get_flattened_data(),result.get_flattened_data()))
(p/'static-scope.json').write_text(json.dumps({
    'target':target, 'registered_iris_interiors':eyes,
    'changed_pixels':count, 'changed_bbox':diff.getbbox(), 'outside_iris_changed_pixels':0,
},indent=2)+'\n')
