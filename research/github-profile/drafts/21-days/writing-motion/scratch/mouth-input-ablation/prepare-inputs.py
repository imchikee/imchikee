from pathlib import Path
from PIL import Image, ImageDraw, ImageStat, ImageChops, ImageFont
import hashlib
import json

p = Path(__file__).resolve().parent
scene = p.parent / 'reading-identity-static/generated-raw.png'
reference = p / '../../../reading-motion/lighting/down-v2.png'
specs = [
    dict(name='scene', source=scene, role='Edit target: second scene, body, grip, composition; old mouth removed',
         polygon=[(632,701),(748,701),(748,759),(632,759)],
         nose=[675,688,724,717], sample=[650,681,670,691]),
    dict(name='identity', source=reference, role='First-scene character identity reference; old mouth removed',
         polygon=[(633,687),(746,687),(746,738),(729,735),(718,734),(713,736),
                  (706,737),(698,736),(687,734),(675,733),(663,730),
                  (653,726),(646,720),(633,717)],
         nose=[682,674,725,699], sample=[660,678,676,688]),
]
def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()

font = '/usr/share/fonts/noto-cjk/NotoSansCJK-Medium.ttc'
review = Image.new('RGB',(1420,910),'#202329')
d = ImageDraw.Draw(review)
def label(x,y,s,size=20):
    d.text((x,y),s,font=ImageFont.truetype(font,size),fill='#eee8dc')
label(20,14,'输入中和检查 · 仅用于生成条件，不是绘画候选',26)
records = []
for index,spec in enumerate(specs):
    original=Image.open(spec['source']).convert('RGB')
    assert original.size==(1316,1195)
    mask=Image.new('L',original.size)
    ImageDraw.Draw(mask).polygon(spec['polygon'],fill=255)
    mask.paste(0,tuple(spec['nose']))
    color=tuple(int(v) for v in ImageStat.Stat(original.crop(spec['sample'])).median)
    neutral=original.copy()
    neutral.paste(color,(0,0,*original.size),mask)
    output=p/f"input-{spec['name']}-neutral.png"
    neutral.save(output)
    mask.save(p/f"input-{spec['name']}-support.png")
    diff=ImageChops.difference(original,neutral)
    outside=diff.copy()
    outside.paste((0,0,0),(0,0,*original.size),mask)
    assert outside.getbbox() is None
    assert diff.crop(spec['nose']).getbbox() is None
    records.append({
        'order':index+1, 'role':spec['role'],
        'original_path':str(spec['source'].resolve()),
        'original_sha256':sha(spec['source']),
        'input_path':str(output), 'input_sha256':sha(output),
        'size':list(original.size), 'neutral_polygon':spec['polygon'],
        'protected_nose_box_exclusive':spec['nose'],
        'neutral_sample_box':spec['sample'], 'neutral_rgb':list(color),
        'support_bbox_exclusive':list(mask.getbbox()),
        'changed_bbox_exclusive':list(diff.getbbox()),
        'outside_support_changed_pixels':0, 'protected_nose_changed_pixels':0,
        'method':'Opaque sampled median cream; no blur, texture synthesis, or replacement mouth',
    })
    y=70+index*410
    label(20,y,['输入1 · 第二幕场景','输入2 · 第一幕身份'][index])
    review.paste(neutral.resize((267,242),Image.Resampling.LANCZOS),(20,y+40))
    for x,im,text in [(315,original,'原始鼻口'),(860,neutral,'中和鼻口 · 待生成区域')]:
        label(x,y,text)
        review.paste(im.crop((610,665,780,780)).resize((510,345),Image.Resampling.LANCZOS),(x,y+40))
label(20,882,'鼻口统一3×；覆盖区外及鼻子保护框像素不变。遮盖色块不是最终材质。',18)
review.save(p/'review-inputs.png')
for q in range(95,35,-1):
    review.save(p/'review-inputs.jpg',quality=q,optimize=True,progressive=True,subsampling=0)
    if (p/'review-inputs.jpg').stat().st_size<400000:
        break
assert (p/'review-inputs.jpg').stat().st_size<400000

base=(p/'PROMPT-BASE-B.txt').read_text().rstrip('\n')
prompt=(p/'PROMPT.txt').read_text().rstrip('\n')
assert len(base)==1868
assert prompt.startswith(base+'\n\nInput clarification only:')
assert 'undefined' not in prompt
old_a=(p.parent/'whole-head-renewal/PROMPTS.md').read_text().split('## A\n\n')[1].split(' Candidate A:')[0]
assert base.startswith(old_a+' Candidate B:')
request={'referenced_image_paths':[r['input_path'] for r in records],
         'prompt':prompt,'transparent_background':False}
(p/'request.json').write_text(json.dumps(request,ensure_ascii=False,indent=2)+'\n')
manifest={'baseline_commit':'b25993fc6521ab4fa078a68e47a483b1167c0a9d',
          'inputs':records,'prompt_base_characters':len(base),
          'prompt_file_sha256':sha(p/'PROMPT.txt'),
          'request_file_sha256':sha(p/'request.json'),
          'prompt_provenance':'Recovered whole-head-renewal B from prior tool call and session promptB; original repository B record was undefined.',
          'reference_scope':'Only these two neutral full-size inputs; no original unneutralized mouth references.',
          'input_review_jpeg_bytes':(p/'review-inputs.jpg').stat().st_size}
(p/'input-manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(manifest,ensure_ascii=False,indent=2))
