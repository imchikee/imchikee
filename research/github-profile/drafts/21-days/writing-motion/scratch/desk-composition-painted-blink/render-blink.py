from pathlib import Path
from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageFont
import sys

work = Path(__file__).resolve().parent
origin = (450,570)
base = Image.open(work.parent/'desk-composition-painted-cheek-forelimb-review/candidate.png').convert('RGB')
open_crop = Image.open(work/'eye-reference.png').convert('RGB')
paint = Image.open(work/'registered-lid.png').convert('RGB')
closed_mask = Image.open(work/'lid-alpha.png').convert('L')

# Registered to the latest head repaint. Each column stores x, top and bottom
# of the visible eye, followed by the centerline of the painted closed seam.
eyes = [
    [(20,20,28,37),(26,17,41,44),(32,17,56,51),(38,14,62,56),
     (44,15,67,60),(50,16,71,62),(56,19,73,64),(62,24,73,65),
     (68,29,71,65),(73,38,68,66),(76,48,60,66)],
    [(154,83,92,90),(160,77,97,90),(168,68,102,91),(176,60,106,95),
     (184,57,109,97),(192,55,109,98),(200,55,108,98),(208,56,105,95),
     (216,59,100,92),(224,63,94,87),(232,68,86,82),(238,72,76,77)]
]

def smooth(t):
    t = max(0,min(1,t))
    return t*t*(3-2*t)

def closure(t):
    if t <= 1.300 or t >= 1.560:
        return 0
    if t < 1.385:
        return smooth((t-1.300)/.085)
    if t <= 1.415:
        return 1
    return 1-smooth((t-1.415)/.145)

def eye_aperture(amount):
    factor = 4
    high = Image.new('L',(open_crop.width*factor,open_crop.height*factor))
    draw = ImageDraw.Draw(high)
    for columns in eyes:
        top,low = [],[]
        for x,top_y,bottom_y,seam in columns:
            top.append((round(x*factor),round((top_y*(1-amount)+seam*amount)*factor)))
            low.append((round(x*factor),round((bottom_y*(1-amount)+seam*amount)*factor)))
        draw.polygon(top+low[::-1],fill=255)
    return high.resize(open_crop.size,Image.Resampling.LANCZOS)

original_aperture = eye_aperture(0)
def crop_at(t):
    amount = closure(t)
    if amount <= 0:
        return open_crop.copy()
    if amount >= 1:
        return Image.composite(paint,open_crop,closed_mask)
    # Replace only the newly hidden eyeball. Surrounding lashes and fur enter
    # gently at the beginning, before the lids meet.
    removed = ImageChops.multiply(original_aperture,ImageChops.invert(eye_aperture(amount)))
    rim_mix = smooth(amount/.38)
    outside = ImageChops.invert(original_aperture).point(lambda v:round(v*rim_mix))
    covered = ImageChops.lighter(removed,outside)
    return Image.composite(paint,open_crop,ImageChops.multiply(closed_mask,covered))

def scene_at(t):
    output = base.copy()
    output.paste(crop_at(t),origin)
    return output

for t in (0,1.56,1.6,3.2):
    assert ImageChops.difference(scene_at(t),base).getbbox() is None, t
closed_compare = Image.open(work/'closed-static.png').convert('RGB')
assert ImageChops.difference(scene_at(1.40),closed_compare).getbbox() is None
mask = closed_mask.point(lambda v:255 if v else 0)
for j in range(193):
    r,g,b = ImageChops.difference(crop_at(j/60),open_crop).split()
    change = ImageChops.lighter(r,ImageChops.lighter(g,b))
    assert ImageChops.multiply(change,ImageChops.invert(mask)).getbbox() is None
print('Open, resumed, and final frames are RGB-identical to the source. Changes confined to the two new masks.')

times = (1.300,1.333,1.367,1.400,1.433,1.467,1.500,1.533,1.560)
font = ImageFont.truetype('/usr/share/fonts/noto-cjk/NotoSansCJK-Medium.ttc',17)
def sheet(filename,frames,columns):
    w,h = frames[0].size
    panel = Image.new('RGB',(16+columns*(w+16),16+((len(frames)+columns-1)//columns)*(h+46)),'#202329')
    draw = ImageDraw.Draw(panel)
    for index,img in enumerate(frames):
        x=16+index%columns*(w+16)
        y=16+index//columns*(h+46)
        draw.text((x,y),f'{times[index]:.3f} s',font=font,fill='white')
        panel.paste(img,(x,y+30))
    panel.save(work/filename)
sheet('review-blink-stages.png',[crop_at(t) for t in times],3)
sheet('review-blink-534.png',[scene_at(t).resize((534,485),Image.Resampling.LANCZOS) for t in times],3)

# Optional local playback strip for visual testing, kept out of delivery.
if len(sys.argv)>1:
    frame_dir = Path(sys.argv[1])
    frame_dir.mkdir(parents=True,exist_ok=True)
    for j in range(192):
        scene_at(j/60).resize((534,485),Image.Resampling.LANCZOS).save(frame_dir/f'{j:03}.png')
