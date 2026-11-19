#!/usr/bin/env bash
set -euo pipefail

here=$(cd -- "$(dirname -- "$0")" && pwd)
work=$(mktemp -d)
trap 'rm -rf "$work"' EXIT
old_pair="$here/../desk-composition-painted-blink/pair-preview.mp4"

python "$here/render-blink.py" "$work/frames"
ffmpeg -v error -y -framerate 60 -i "$work/frames/%03d.png" \
  -vf 'scale=out_range=full:out_color_matrix=bt601,format=yuv420p,setsar=1' \
  -c:v libx264 -crf 17 -level:v 3.1 -color_range pc -colorspace bt470bg \
  -movflags +faststart "$here/preview.mp4"

# The previous pair has an IDR at the 3.2-second cut. Preserve the
# first scene's encoded pictures and append the new scene without re-encoding.
ffmpeg -v error -i "$old_pair" -map 0:v:0 -c copy -f segment \
  -segment_times 3.2 -reset_timestamps 1 "$work/original-%d.mp4"
ln -s "$here/preview.mp4" "$work/second.mp4"
printf 'file original-0.mp4\nfile second.mp4\n' > "$work/pair.txt"
ffmpeg -v error -y -f concat -i "$work/pair.txt" -c copy -movflags +faststart "$here/pair-preview.mp4"
