#!/usr/bin/env bash
set -euo pipefail

here=$(cd -- "$(dirname -- "$0")" && pwd)
work=$(mktemp -d)
trap 'rm -rf "$work"' EXIT

python -B "$here/prepare.py" "$work"
node "$here/poses.mjs" "$work"
python -B "$here/render-writing.py" "$work"

ffmpeg -v error -y -framerate 60 -i "$work/frames/%03d.png" \
  -vf 'scale=out_range=full:out_color_matrix=bt601,format=yuv420p,setsar=1' \
  -c:v libx264 -crf 17 -level:v 3.1 -color_range pc -colorspace bt470bg \
  -movflags +faststart "$here/preview.mp4"

# The existing pair starts the second chapter on an IDR frame at 3.2s.
# Stream-copy the first chapter so its original animation is frame-identical.
ffmpeg -v error -i "$here/../desk-composition-round-eyes-writing/pair-preview.mp4" \
  -map 0:v:0 -c copy -f segment -segment_times 3.2 -reset_timestamps 1 "$work/original-%d.mp4"
ln -s "$here/preview.mp4" "$work/second.mp4"
printf 'file original-0.mp4\nfile second.mp4\n' > "$work/pair.txt"
ffmpeg -v error -y -f concat -i "$work/pair.txt" -c copy -movflags +faststart "$here/pair-preview.mp4"

# Play the writing once so the final settled pose does not jump back.
ffmpeg -v error -y -framerate 60 -i "$work/frames/%03d.png" \
  -filter_complex 'fps=25,crop=534:485:0:0,split[a][b];[a]palettegen[p];[b][p]paletteuse=dither=bayer:bayer_scale=4:diff_mode=rectangle' \
  -loop -1 "$here/preview.gif"
