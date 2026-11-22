import cv2, numpy as np, json, subprocess, os
from PIL import Image, ImageDraw
from pathlib import Path

ROOT=Path('/mnt/data/anim_audit')
ROOT.mkdir(parents=True,exist_ok=True)
SRC='/mnt/data/files/second-act-v3-blink-master-1254.mp4'
BASE='/mnt/data/image(20261121-133256).png'
OUT=str(ROOT/'second-act-v3-blink-master-framed-1254.mp4')
PREVIEW=str(ROOT/'second-act-v3-blink-preview-framed-534.mp4')
SHEET=str(ROOT/'second-act-v3-blink-framed-keyframes.png')
AUDIT=str(ROOT/'second-act-v3-blink-framed-audit.json')

base=np.array(Image.open(BASE).convert('RGB'))
assert base.shape==(1254,1254,3), base.shape
cap=cv2.VideoCapture(SRC)
fps=cap.get(cv2.CAP_PROP_FPS)
count=int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
w=int(cap.get(cv2.CAP_PROP_FRAME_WIDTH)); h=int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
assert (w,h,count,round(fps))==(1254,1254,192,60),(w,h,count,fps)
ret,first_bgr=cap.read(); assert ret
first=cv2.cvtColor(first_bgr,cv2.COLOR_BGR2RGB)

# Source eye bounds and destination eye bounds measured from the two images.
# Each eye is transformed independently because the accepted V3 update slightly
# changed inter-eye spacing as well as eye size.
eye_specs=[
    {'name':'left','src_bbox':(528,592,79,70),'dst_bbox':(551,599,59,53)},
    {'name':'right','src_bbox':(711,632,71,63),'dst_bbox':(687,629,52,47)},
]

# FFmpeg accepts a raw BGR stream and writes a high-quality 60fps MP4.
cmd=['ffmpeg','-hide_banner','-loglevel','error','-y','-f','rawvideo','-pix_fmt','bgr24','-s','1254x1254','-r','60','-i','-','-an','-c:v','libx264','-preset','slow','-crf','15','-pix_fmt','yuv420p','-movflags','+faststart',OUT]
proc=subprocess.Popen(cmd,stdin=subprocess.PIPE)

active_start,active_end=79,93
threshold=55
max_outside=0
changed_outside=0
changed_bbox=[None,None]
key_indices=[0,78,79,81,83,86,89,91,93,94,191]
keyframes={}
frame_records=[]

# Include frame 0 already read, then process sequentially from it.
for i in range(count):
    if i==0:
        src_frame=first
    else:
        ret,fr=cap.read()
        if not ret: raise RuntimeError(f'failed reading frame {i}')
        src_frame=cv2.cvtColor(fr,cv2.COLOR_BGR2RGB)
    out=base.copy()
    per_eye=[]
    if active_start <= i <= active_end:
        for spec in eye_specs:
            ox,oy,ow,oh=spec['src_bbox']; nx,ny,nw,nh=spec['dst_bbox']
            pad=12
            sx0,sy0=ox-pad,oy-pad; sx1,sy1=ox+ow+pad,oy+oh+pad
            patch=src_frame[sy0:sy1,sx0:sx1]
            base_patch=first[sy0:sy1,sx0:sx1]
            diff=np.max(np.abs(patch.astype(np.int16)-base_patch.astype(np.int16)),axis=2).astype(np.uint8)
            mask=(diff>threshold).astype(np.uint8)*255
            kernel=cv2.getStructuringElement(cv2.MORPH_ELLIPSE,(3,3))
            mask=cv2.morphologyEx(mask,cv2.MORPH_CLOSE,kernel)
            mask=cv2.dilate(mask,cv2.getStructuringElement(cv2.MORPH_ELLIPSE,(5,5)),iterations=1)
            mask=cv2.GaussianBlur(mask,(0,0),0.8)
            sx=nw/ow; sy=nh/oh
            M=np.array([[sx,0,nx-sx*(ox-sx0)],[0,sy,ny-sy*(oy-sy0)]],np.float32)
            warped=cv2.warpAffine(patch,M,(1254,1254),flags=cv2.INTER_CUBIC,borderMode=cv2.BORDER_CONSTANT,borderValue=(0,0,0))
            wm=cv2.warpAffine(mask,M,(1254,1254),flags=cv2.INTER_CUBIC,borderMode=cv2.BORDER_CONSTANT,borderValue=0).astype(np.float32)/255.0
            tx0=max(0,int(nx-pad*sx)-4); ty0=max(0,int(ny-pad*sy)-4)
            tx1=min(1254,int(nx+nw+pad*sx)+5); ty1=min(1254,int(ny+nh+pad*sy)+5)
            a=wm[ty0:ty1,tx0:tx1,None]
            region=out[ty0:ty1,tx0:tx1].astype(np.float32)
            out[ty0:ty1,tx0:tx1]=(warped[ty0:ty1,tx0:tx1].astype(np.float32)*a+region*(1-a)).clip(0,255).astype(np.uint8)
            per_eye.append({'name':spec['name'],'mask_pixels':int((mask>20).sum()),'max_diff':int(diff.max())})
    # Strict audit: output can differ from final static only in two small eye zones.
    delta=np.max(np.abs(out.astype(np.int16)-base.astype(np.int16)),axis=2)
    allowed=np.zeros((1254,1254),np.uint8)
    for nx,ny,nw,nh in [s['dst_bbox'] for s in eye_specs]:
        pad=24
        allowed[max(0,ny-pad):min(1254,ny+nh+pad),max(0,nx-pad):min(1254,nx+nw+pad)]=1
    outside=delta[allowed==0]
    m=int(outside.max()) if outside.size else 0
    n=int((outside>0).sum())
    max_outside=max(max_outside,m); changed_outside+=n
    if np.any(delta>0):
        ys,xs=np.where(delta>0)
        bbox=(int(xs.min()),int(ys.min()),int(xs.max()),int(ys.max()))
    else: bbox=None
    frame_records.append({'frame':i,'time_s':round(i/fps,4),'outside_max_delta':m,'outside_changed_pixels':n,'changed_bbox':bbox,'eyes':per_eye})
    if i in key_indices: keyframes[i]=out.copy()
    proc.stdin.write(cv2.cvtColor(out,cv2.COLOR_RGB2BGR).tobytes())

cap.release(); proc.stdin.close(); rc=proc.wait()
if rc: raise RuntimeError(f'ffmpeg encode failed: {rc}')

# Generate 534px preview from the 1254px master, preserving the square framed canvas.
subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-i',OUT,'-vf','scale=534:534:flags=lanczos','-r','60','-c:v','libx264','-preset','slow','-crf','17','-pix_fmt','yuv420p','-movflags','+faststart',PREVIEW],check=True)

# Keyframe sheet: full canvas thumbnails and eye close-ups for manual inspection.
thumb_w,thumb_h=314,314
cols=4; rows=(len(key_indices)+cols-1)//cols
sheet=Image.new('RGB',(cols*thumb_w,rows*(thumb_h+28)),(245,242,235))
d=ImageDraw.Draw(sheet)
for j,i in enumerate(key_indices):
    im=Image.fromarray(keyframes[i]).resize((thumb_w,thumb_h),Image.Resampling.LANCZOS)
    x=(j%cols)*thumb_w; y=(j//cols)*(thumb_h+28)
    sheet.paste(im,(x,y))
    d.text((x+8,y+thumb_h+5),f'frame {i}  t={i/60:.3f}s',fill=(40,30,20))
sheet.save(SHEET)

# Verify media metadata after encoding.
probe=subprocess.check_output(['ffprobe','-v','error','-select_streams','v:0','-show_entries','stream=width,height,r_frame_rate,avg_frame_rate,nb_frames,duration','-show_entries','format=duration,size','-of','json',OUT],text=True)
probe_preview=subprocess.check_output(['ffprobe','-v','error','-select_streams','v:0','-show_entries','stream=width,height,r_frame_rate,avg_frame_rate,nb_frames,duration','-show_entries','format=duration,size','-of','json',PREVIEW],text=True)
audit={
 'source_master':os.path.basename(SRC),
 'new_static_base':os.path.basename(BASE),
 'new_master':os.path.basename(OUT),
 'new_preview':os.path.basename(PREVIEW),
 'fps':fps,'frame_count':count,'duration_s':count/fps,
 'blink_active_frames':[active_start,active_end],
 'blink_active_time_s':[active_start/fps,active_end/fps],
 'threshold':threshold,
 'eye_transforms':eye_specs,
 'outside_allowed_regions_max_delta':max_outside,
 'outside_allowed_regions_changed_pixels_total':changed_outside,
 'master_probe':json.loads(probe),
 'preview_probe':json.loads(probe_preview),
 'notes':'Output frames use the final 1254x1254 static image as the exact base. Only two bounded eye regions receive the accepted blink motion transferred from the prior master; the rest of each frame is copied from the new static base.'
}
with open(AUDIT,'w') as f: json.dump(audit,f,indent=2)
print(json.dumps(audit,ensure_ascii=False,indent=2))
print('created',OUT,os.path.getsize(OUT),'bytes')
print('created',PREVIEW,os.path.getsize(PREVIEW),'bytes')
print('created',SHEET,os.path.getsize(SHEET),'bytes')
