from pathlib import Path
from PIL import Image
import math,json
p=Path(__file__).resolve().parent
ref=Image.open(p/'eye-reference.png').convert('RGB')
source=Image.open(p/'closed-raw.png').convert('RGB').resize((338,148),Image.Resampling.LANCZOS)
# Gentle smile only: include the original lash tips as well as the eyeballs.
eyes=[dict(x=91,y=74,rx=47,ry=39,angle=-.17),dict(x=260,y=83,rx=35,ry=37,angle=.36)]
original=list(ref.get_flattened_data());raw=list(source.get_flattened_data());result=list(original)
for e in eyes:
 c,s=math.cos(e['angle']),math.sin(e['angle']);domain={};edge=[]
 for y in range(1,147):
  for x in range(1,337):
   dx,dy=x-e['x'],y-e['y'];r=math.sqrt(((dx*c+dy*s)/e['rx'])**2+((-dx*s+dy*c)/e['ry'])**2)
   if r<1:domain[y*338+x]=r
 boundary={i for i in domain if any(j not in domain for j in (i-1,i+1,i-338,i+338))}
 edge=list(boundary);mean=[sum(original[i][k]-raw[i][k] for i in edge)/len(edge) for k in range(3)]
 # Harmonic colour correction propagates the actual boundary light/colour
 # through the lid painting. It never samples the original eyeball interior.
 field={i:([original[i][k]-raw[i][k] for k in range(3)] if i in boundary else mean.copy()) for i in domain}
 interior=[i for i in domain if i not in boundary]
 for _ in range(180):
  for i in interior:
   neighbours=[field[j] for j in (i-1,i+1,i-338,i+338)]
   field[i]=[sum(n[k] for n in neighbours)*.25 for k in range(3)]
 for i,r in domain.items():
  alpha=min(1,(1-r)*min(e['rx'],e['ry'])/1.5)
  colour=[max(0,min(255,raw[i][k]+field[i][k])) for k in range(3)]
  result[i]=tuple(round(original[i][k]*(1-alpha)+colour[k]*alpha) for k in range(3))
closed=Image.new('RGB',(338,148));closed.putdata(result);closed.save(p/'closed-material.png')
lines=[]
for left,right,top,bottom in [(53,126,84,103),(229,291,87,104)]:
 line=[]
 for x in range(left,right+1,3):
  y=min(range(top,bottom+1),key=lambda y:sum(source.getpixel((x,y))[:2]))
  line.append([x,y])
 lines.append(line)
config={'origin':[520,567],'eyes':eyes,'lashLines':lines,'materialMatching':'harmonic RGB boundary correction; 1.5px edge antialias'}
(p/'eye-registration.json').write_text(json.dumps(config,indent=2)+'\n')
(p/'eye-registration.js').write_text('window.gentleSmileEyes='+json.dumps(config)+';\n')
print('Gentle smile eyelid material prepared; original eye texture is never transformed.')
