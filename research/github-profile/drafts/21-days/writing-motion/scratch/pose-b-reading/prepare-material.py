from pathlib import Path
from PIL import Image
import math,json
p=Path(__file__).resolve().parent
ref=Image.open(p/'eye-reference.png').convert('RGB')
source=Image.open(p/'closed-raw.png').convert('RGB').resize((300,150),Image.Resampling.LANCZOS)
# Pose B only: include the original lash tips as well as the eyeballs.
eyes=[dict(x=78,y=53,rx=51,ry=44,angle=.18),dict(x=226,y=81,rx=43,ry=34,angle=-.60)]
original=list(ref.get_flattened_data());raw=list(source.get_flattened_data());result=list(original)
for e in eyes:
 c,s=math.cos(e['angle']),math.sin(e['angle']);domain={};edge=[]
 for y in range(1,149):
  for x in range(1,299):
   dx,dy=x-e['x'],y-e['y'];r=math.sqrt(((dx*c+dy*s)/e['rx'])**2+((-dx*s+dy*c)/e['ry'])**2)
   if r<1:domain[y*300+x]=r
 boundary={i for i in domain if any(j not in domain for j in (i-1,i+1,i-300,i+300))}
 edge=list(boundary);mean=[sum(original[i][k]-raw[i][k] for i in edge)/len(edge) for k in range(3)]
 # Harmonic colour correction propagates the actual boundary light/colour
 # through the lid painting. It never samples the original eyeball interior.
 field={i:([original[i][k]-raw[i][k] for k in range(3)] if i in boundary else mean.copy()) for i in domain}
 interior=[i for i in domain if i not in boundary]
 for _ in range(180):
  for i in interior:
   neighbours=[field[j] for j in (i-1,i+1,i-300,i+300)]
   field[i]=[sum(n[k] for n in neighbours)*.25 for k in range(3)]
 for i,r in domain.items():
  alpha=min(1,(1-r)*min(e['rx'],e['ry'])/1.5)
  colour=[max(0,min(255,raw[i][k]+field[i][k])) for k in range(3)]
  result[i]=tuple(round(original[i][k]*(1-alpha)+colour[k]*alpha) for k in range(3))
closed=Image.new('RGB',(300,150));closed.putdata(result);closed.save(p/'closed-material.png')
lines=[]
for left,right,top,bottom in [(36,102,35,78),(193,250,70,102)]:
 line=[]
 for x in range(left,right+1,3):
  y=min(range(top,bottom+1),key=lambda y:sum(source.getpixel((x,y))[:2]))
  line.append([x,y])
 lines.append(line)
config={'origin':[535,690],'eyes':eyes,'lashLines':lines,'materialMatching':'harmonic RGB boundary correction; 1.5px edge antialias'}
(p/'eye-registration.json').write_text(json.dumps(config,indent=2)+'\n')
(p/'eye-registration.js').write_text('window.poseBEyes='+json.dumps(config)+';\n')
print('Pose B eyelid material prepared; original eye texture is never transformed.')
