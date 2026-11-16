"""Pair the already rendered 30fps outputs; never rerender or adjust motion."""
from pathlib import Path
import json
import subprocess

root = Path(__file__).resolve().parent
filters = (
    "[0:v]pad=988:938:0:40:color=0x181d21,drawtext=expansion=none:text='70% baseline':fontcolor=white:fontsize=24:x=12:y=8[l];"
    "[1:v]pad=988:938:0:40:color=0x181d21,drawtext=expansion=none:text='Stable forearm + wrist candidate':fontcolor=white:fontsize=24:x=12:y=8[r];"
    "[l][r]hstack=inputs=2[v]"
)
subprocess.run([
    'ffmpeg', '-y', '-v', 'error', '-i', str(root / 'baseline.mp4'),
    '-i', str(root / 'candidate.mp4'), '-filter_complex', filters,
    '-map', '[v]', '-c:v', 'libx264', '-crf', '18', '-pix_fmt', 'yuv420p',
    '-movflags', '+faststart', str(root / 'comparison.mp4'),
], check=True)
metadata = {}
for name in ['baseline', 'candidate', 'comparison']:
    file = str(root / f'{name}.mp4')
    subprocess.run(['ffmpeg', '-v', 'error', '-i', file, '-f', 'null', '-'], check=True)
    metadata[name] = json.loads(subprocess.check_output([
        'ffprobe', '-v', 'error', '-show_entries',
        'format=duration:stream=width,height,nb_frames,r_frame_rate', '-of', 'json', file,
    ], text=True))
(root / 'video-metadata.json').write_text(json.dumps(metadata, indent=2) + '\n')
