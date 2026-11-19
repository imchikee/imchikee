from pathlib import Path
from math import log
import json

from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageFont

here = Path(__file__).resolve().parent
base = Image.open(here.parent / 'gentle-smile-soft-rim/candidate.png').convert('RGB')
# Region inside the painted head. The pencil, arms, paws, and chest are below
# this boundary. The edge fades to the existing fur within this region.
outline = [
    (366,498),(371,448),(397,407),(447,380),(505,378),
    (530,352),(578,335),(645,330),(665,320),(693,335),
    (742,357),(776,390),(790,422),(834,409),(881,433),
    (906,477),(904,516),(882,552),(900,582),(918,629),
    (935,676),(934,724),(918,760),(890,780),(848,790),
    (807,797),(752,804),(689,813),(620,810),(550,799),
    (502,776),(483,755),(462,755),(445,777),(399,780),
    (350,770),(319,749),(298,717),(294,679),(307,627),
    (327,580),(355,548),(386,523),
]
# Source x/y and destination delta x/y. From the top of the cap toward
# the muzzle, the protruding surfaces travel farther downward.
anchors = {
    'cap': [(666,333,2,3),(573,350,1,5),(610,385,-2,9),(750,401,-4,11),
            (610,474,-5,14),(778,458,-7,16),(688,516,-9,21),(834,517,-9,18)],
    'ears': [(441,431,0,3),(482,507,-3,8),(859,466,-3,7),(859,540,-3,9)],
    'forehead': [(508,564,-6,12),(624,547,-8,17),(734,551,-8,20),(842,579,-8,16)],
    'near_eye': [(584,634,-8,20),(613,609,-9,20),(648,638,-10,21),(615,673,-10,21),
                 (617,642,-10,27)],
    'far_eye': [(751,646,-8,22),(777,620,-10,23),(805,647,-11,23),(778,680,-10,22),
                (775,650,-15,28)],
    'muzzle': [(701,672,-12,26),(709,688,-15,30),(705,709,-15,28),
               (647,707,-12,25),(756,714,-13,25),(703,730,-15,25)],
    'cheeks': [(401,662,-2,5),(496,688,-6,11),(561,736,-8,15),
               (619,763,-8,14),(698,765,-9,13),(790,747,-7,14),(878,713,-4,6)],
}
points = [p for group in anchors.values() for p in group] + [(x,y,0,0) for x,y in outline]


def radial(r2):
    return r2*log(r2) if r2 > 1e-12 else 0.


def fit_inverse():
    sites = [((x+dx)/500,(y+dy)/500) for x,y,dx,dy in points]
    n = len(sites)
    matrix = []
    for (x,y),(_,_,dx,dy) in zip(sites,points):
        matrix.append([radial((x-a)**2+(y-b)**2) for a,b in sites]+[1,x,y,-dx,-dy])
    for row in [[1]*n,[x for x,_ in sites],[y for _,y in sites]]:
        matrix.append(row+[0,0,0,0,0])
    for j in range(n+3):
        k = max(range(j,n+3),key=lambda i:abs(matrix[i][j]))
        matrix[k],matrix[j] = matrix[j],matrix[k]
        pivot = matrix[j][j]
        assert abs(pivot)>1e-10
        matrix[j] = [v/pivot for v in matrix[j]]
        for i,row in enumerate(matrix):
            if i!=j:
                factor = row[j]
                matrix[i] = [a-factor*b for a,b in zip(row,matrix[j])]
    weights = [row[-2:] for row in matrix]

    def source(px,py):
        x,y = px/500,py/500
        values = [radial((x-a)**2+(y-b)**2) for a,b in sites]+[1,x,y]
        return (px+sum(v*w[0] for v,w in zip(values,weights)),
                py+sum(v*w[1] for v,w in zip(values,weights)))
    return source


support = Image.new('L',base.size)
ImageDraw.Draw(support).polygon(outline,fill=255)
box = support.getbbox()
source = fit_inverse()
xs = list(range(box[0],box[2],4))+[box[2]]
ys = list(range(box[1],box[3],4))+[box[3]]
grid = {(x,y):source(x,y) for x in xs for y in ys}
mesh = []
for y,b in zip(ys,ys[1:]):
    for x,r in zip(xs,xs[1:]):
        corners = grid[x,y]+grid[x,b]+grid[r,b]+grid[r,y]
        mesh.append(((x-box[0],y-box[1],r-box[0],b-box[1]),corners))
mask = ImageChops.multiply(support.filter(ImageFilter.MinFilter(9)).filter(ImageFilter.GaussianBlur(3)),support)
warp = base.transform((box[2]-box[0],box[3]-box[1]),Image.Transform.MESH,mesh,Image.Resampling.BICUBIC)
result = base.copy()
result.paste(warp,box[:2],mask.crop(box))
delta = ImageChops.difference(base,result)
assert ImageChops.composite(Image.new('RGB',base.size),delta,support).getbbox() is None
assert delta.crop((0,814,1316,1195)).getbbox() is None
result.save(here/'candidate.png')
(here/'scope-check.json').write_text(json.dumps({
    'baseline':'5e19f08b144caf0f50a414c9dc8487f1293d5efe',
    'warp_anchors_source_and_delta': anchors, 'allowed_polygon':outline,
    'changed_bbox':delta.getbbox(),
    'changed_pixels':sum(a!=b for a,b in zip(base.get_flattened_data(),result.get_flattened_data())),
    'outside_polygon_changed_pixels':0, 'rows_814_and_below_changed_pixels':0,
},indent=2)+'\n')

font = ImageFont.truetype('/usr/share/fonts/noto-cjk/NotoSansCJK-Medium.ttc',18)


def review(name,a,b,left,right):
    w,h = a.size
    board = Image.new('RGB',(2*w+48,h+60),'#202329')
    for x,img,label in [(16,a,left),(32+w,b,right)]:
        ImageDraw.Draw(board).text((x,11),label,font=font,fill='white')
        board.paste(img,(x,42))
    board.save(here/(name+'.png'))


def display(img):
    return img.resize((534,485),Image.Resampling.LANCZOS)


review('review-534',display(base),display(result),'原版 · 5e19f08','轻俯静帧候选')
pair = Image.open(here.parent/'gentle-smile-blink/review-pair.png')
review('review-cut-534',pair.crop((534,40,1068,525)),display(result),
       '第一幕 · 实播 3.179s','第二幕 · 静态代入切换')
head = (276,307,953,833)
review('review-head',base.crop(head),result.crop(head),'原画头部 · 原尺寸','轻俯头部 · 原尺寸')
