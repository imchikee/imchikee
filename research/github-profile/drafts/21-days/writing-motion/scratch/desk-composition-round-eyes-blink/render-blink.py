from pathlib import Path
import math
import sys

from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageFont

HERE = Path(__file__).resolve().parent
OLD = HERE.parent / 'desk-composition-painted-blink'
BASE = HERE.parent / 'desk-composition-painted-rounded-upper-contours/candidate.png'
ORIGIN = (450, 570)
SIZE = (272, 142)
BOX = (*ORIGIN, ORIGIN[0] + SIZE[0], ORIGIN[1] + SIZE[1])
FPS = 60
FRAME_COUNT = 192
SAMPLES = (78, 80, 82, 84, 86, 88, 90, 92, 94)
FONT = ImageFont.truetype('/usr/share/fonts/noto-cjk/NotoSansCJK-Medium.ttc', 17)

base = Image.open(BASE).convert('RGB')
open_crop = base.crop(BOX)
paint = Image.open(OLD / 'registered-lid.png').convert('RGB')
old_mask = Image.open(OLD / 'lid-alpha.png').convert('L')

# Coordinates in the registered crop. The junctions trace the existing
# painted closure. The opened envelopes come from the new static artwork.
EYES = (
    (range(19, 83), range(6, 79),
     [(19, 33), (25, 41), (32, 51), (38, 57), (44, 60), (50, 63),
      (56, 64), (62, 65), (68, 65), (74, 66), (82, 67)]),
    (range(149, 246), range(43, 113),
     [(149, 91), (158, 90), (165, 90), (174, 94), (183, 97),
      (192, 98), (198, 98), (207, 96), (216, 92), (225, 87),
      (235, 81), (245, 78)]),
)


def clamp(value, low=0, high=1):
    return max(low, min(high, value))


def smooth(value):
    t = clamp(value)
    return t * t * (3 - 2 * t)


def interpolate(points, x):
    for (x0, y0), (x1, y1) in zip(points, points[1:]):
        if x <= x1:
            return y0 + (y1 - y0) * (x - x0) / (x1 - x0)
    return points[-1][1]


def closure(t):
    if t <= 1.300 or t >= 1.560:
        return 0
    if t < 1.385:
        return smooth((t - 1.300) / .085)
    if t <= 1.415:
        return 1
    return 1 - smooth((t - 1.415) / .145)


source = open_crop.load()
silhouette = Image.new('L', SIZE)
silhouette_pixels = silhouette.load()
calibrations = []
for columns, rows, seams in EYES:
    extents = {}
    for x in columns:
        dark = [y for y in rows if source[x, y][0] < 150]
        if dark:
            extents[x] = (dark[0], dark[-1])
            for y in range(dark[0], dark[-1] + 1):
                silhouette_pixels[x, y] = 255
    # Retain open geometry but smooth raster steps before moving the rim.
    smoothed = {}
    for x in extents:
        neighbors = [extents[i] for i in (x - 1, x, x + 1) if i in extents]
        smoothed[x] = tuple(sum(edge) / len(edge) for edge in zip(*neighbors))
    calibrations.append((columns, seams, smoothed))

eye_fill = silhouette.filter(ImageFilter.MaxFilter(5))
feather = silhouette.filter(ImageFilter.MaxFilter(13)).filter(ImageFilter.GaussianBlur(2))
scope = ImageChops.lighter(old_mask, ImageChops.lighter(eye_fill, feather))
assert not ImageChops.subtract(silhouette, scope).getbbox()
closed = Image.composite(paint, open_crop, scope)
painter = paint.load()
coverage = scope.load()


def sample(x, y):
    y = clamp(y, 0, SIZE[1] - 1)
    row = int(y)
    amount = y - row
    a = painter[x, row]
    if not amount:
        return a
    b = painter[x, row + 1]
    return tuple(v + (w - v) * amount for v, w in zip(a, b))


def crop_at(t):
    amount = closure(t)
    if amount <= 0:
        return open_crop
    if amount >= 1:
        return closed

    result = open_crop.copy()
    pixels = result.load()
    rim_mix = smooth(amount / .38)
    settling = smooth((amount - .90) / .10)
    lift = smooth(amount / .24)

    for columns, seams, opened in calibrations:
        left, right = min(opened), max(opened)
        for x in columns:
            seam = interpolate(seams, x)
            if x in opened:
                top, bottom = opened[x]
                u = clamp((x - left) / (right - left))
                center_arch = 4 * u * (1 - u)
                side_motion = smooth((x - left + 1) / 6) * smooth((right - x + 1) / 6)
                # The raised middle preserves curvature when the open arch
                # transitions to the opposite arc of a fully shut eye.
                upper = (top + (seam - top) * amount
                         - 6.5 * center_arch * math.sin(math.pi * amount))
                lower = bottom + (seam - bottom) * amount ** 1.85
            else:
                top = bottom = upper = lower = seam

            for y in range(SIZE[1]):
                alpha = coverage[x, y] / 255
                if not alpha:
                    continue
                if x not in opened:
                    color = painter[x, y]
                    weight = rim_mix
                else:
                    open_eye = smooth((y - top + 1.6) / 2) * smooth((bottom - y + 1.6) / 2)
                    upper_cover = smooth((upper - y + 1.35) / 2.7)
                    lower_cover = smooth((y - lower + 1.35) / 2.7)
                    lid_cover = max(upper_cover, lower_cover)
                    weight = lid_cover * (rim_mix + (1 - rim_mix) * open_eye)
                    if upper_cover >= lower_cover:
                        top_anchor = min(top, upper, seam) - 17
                        scale = clamp((y - top_anchor) / (upper - top_anchor))
                        color = sample(x, y + (seam - upper) * scale * side_motion)
                    else:
                        bottom_anchor = max(bottom, lower, seam) + 13
                        scale = clamp((bottom_anchor - y) / (bottom_anchor - lower))
                        # Sample below the painted seam. It belongs to the
                        # moving upper lid until the aperture has disappeared.
                        color = sample(x, y + (seam + 5 * (1 - settling) - lower) * scale * side_motion)
                    if settling:
                        color = tuple(a + (b - a) * settling
                                      for a, b in zip(color, painter[x, y]))
                        weight += (1 - weight) * settling

                weight *= alpha * lift
                pixels[x, y] = tuple(round(a + (b - a) * weight)
                                     for a, b in zip(source[x, y], color))
    return result


def scene_at(crop):
    frame = base.copy()
    frame.paste(crop, ORIGIN)
    return frame


def diff_mask(a, b):
    r, g, blue = ImageChops.difference(a, b).split()
    return ImageChops.lighter(ImageChops.lighter(r, g), blue)


def board(filename, frames, labels, columns):
    w, h = frames[0].size
    rows = math.ceil(len(frames) / columns)
    panel = Image.new('RGB', (16 + columns * (w + 16), 16 + rows * (h + 46)), '#202329')
    draw = ImageDraw.Draw(panel)
    for i, (img, label) in enumerate(zip(frames, labels, strict=True)):
        x, y = 16 + i % columns * (w + 16), 16 + i // columns * (h + 46)
        draw.text((x, y), label, font=FONT, fill='white')
        panel.paste(img, (x, y + 30))
    panel.save(HERE / filename)


def main(frame_dir):
    frame_dir.mkdir(parents=True, exist_ok=True)
    allowed = scope.point(lambda v: 255 if v else 0)
    # Even height for 4:2:0, retaining all 485 rows of artwork.
    picture = Image.new('RGB', (534, 486), 'white')
    reviews, closeups = [], []
    last_open = None
    for i in range(FRAME_COUNT):
        t = i / FPS
        crop = crop_at(t)
        assert not ImageChops.multiply(diff_mask(crop, open_crop), ImageChops.invert(allowed)).getbbox()
        if not closure(t):
            assert not diff_mask(crop, open_crop).getbbox()
        frame = scene_at(crop) if closure(t) or last_open is None else None
        if frame is not None:
            picture.paste(frame.resize((534, 485), Image.Resampling.LANCZOS), (0, 0))
            png = frame_dir / f'{i:03}.png'
            picture.save(png, compress_level=2)
            if not closure(t):
                last_open = png
        else:
            png = frame_dir / f'{i:03}.png'
            if png.exists():
                png.unlink()
            png.hardlink_to(last_open)
        if i in SAMPLES:
            reviews.append(picture.crop((0, 0, 534, 485)) if frame is not None else
                           Image.open(last_open).crop((0, 0, 534, 485)))
            closeups.append(crop.copy())
    for t in (0, 1.560, 3.2):
        assert not diff_mask(scene_at(crop_at(t)), base).getbbox()
    assert not diff_mask(crop_at(1.4), closed).getbbox()
    phases = ('睁眼', '开始闭合', '接近闭合', '完全闭合', '开始恢复',
              '半睁', '继续恢复', '接近睁开', '恢复睁眼')
    labels = [f'{i / FPS:.3f}s · {phase}' for i, phase in zip(SAMPLES, phases, strict=True)]
    board('review-blink-534.png', reviews, labels, 3)
    board('review-eyes-native.png', closeups, labels, 3)
    print('192 source frames checked. Closed eye fully covered; open and recovered RGB match the current master.')


if __name__ == '__main__':
    main(Path(sys.argv[1]))
