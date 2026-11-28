"""Compose native Act 4 poses and render the isolated 534 × 485 loop."""
import math
from pathlib import Path
import subprocess

from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parent
SOURCE = ROOT / "../../../cpp-humor/storyboards/21-days/hamster-storyboard-v1.png"
BOX = (21, 446, 405, 796)
SIZE = (384, 350)
DISPLAY = (534, 485)
FPS = 30
COUNT = 126
BASE = Image.open(SOURCE).convert("RGB").crop(BOX)


def mask(points, feather=0):
    oversample = 4
    coverage = Image.new("L", (SIZE[0] * oversample, SIZE[1] * oversample))
    ImageDraw.Draw(coverage).polygon(
        [(round(x * oversample), round(y * oversample)) for x, y in points], fill=255
    )
    edge = coverage.resize(SIZE, Image.Resampling.LANCZOS)
    return edge.filter(ImageFilter.GaussianBlur(feather)) if feather else edge


def clone(source, dx, dy):
    return source.transform(SIZE, Image.Transform.AFFINE, (1, 0, -dx, 0, 1, -dy))


def rgba(source, coverage):
    layer = source.convert("RGBA")
    layer.putalpha(coverage)
    return layer


def restore(frame, donor, coverage):
    frame.paste(donor, (0, 0), coverage)


def move(frame, layer, angle, pivot, offset=(0, 0), occlusion=None):
    pose = layer.rotate(angle, Image.Resampling.BICUBIC, center=pivot, translate=offset)
    coverage = pose.getchannel("A")
    if occlusion is not None:
        coverage = ImageChops.subtract(coverage, occlusion)
    restore(frame, pose.convert("RGB"), coverage)


LEFT_OUTLINE = [
    (34, 240), (42, 234), (55, 228), (68, 226), (88, 227), (103, 226),
    (111, 228), (118, 232), (119, 236), (114, 239), (109, 239), (109, 246),
    (105, 250), (103, 254), (95, 257), (89, 261), (83, 266), (70, 271),
    (55, 268), (43, 263), (33, 261),
]
LEFT_HOLDOUT = mask([
    (0, 265), (12, 265), (21, 264), (46, 264), (53, 269), (55, 278),
    (104, 275), (105, 277), (144, 273), (151, 217), (162, 211),
    (172, 350), (0, 350),
])
LEFT_ERASE = mask([
    (45, 238), (57, 230), (69, 226), (88, 226), (102, 225), (111, 226),
    (119, 230), (121, 235), (119, 240), (112, 242), (111, 249),
    (106, 256), (95, 260), (88, 265), (79, 271), (65, 275), (51, 274),
    (46, 267),
], 1.1)
left_plate = BASE.copy()
# Sample the brown chest below the cheek and above the cup. Reflect the
# sample at its bounds so the fill can never pull in either foreground prop.
brown_chest = Image.new("RGB", SIZE)
for y in range(221, 282):
    for x in range(35, 120):
        sample_x = 24 + abs((x - 36) % 78 - 39)
        sample_y = 245 + abs((y - 247) % 30 - 15)
        brown_chest.putpixel((x, y), BASE.getpixel((sample_x, sample_y)))
restore(left_plate, brown_chest, mask([
    (38, 227), (110, 221), (113, 229), (109, 240), (104, 253), (97, 266),
    (92, 275), (38, 276),
], 2.5))
restore(left_plate, clone(BASE, -21, -3), mask([
    (121, 216), (139, 226), (126, 267), (112, 275), (92, 274), (97, 267),
    (104, 253), (107, 243), (111, 231),
], 1.9))
LEFT_ARM = rgba(BASE, mask(LEFT_OUTLINE, 0.35))
# Taper coverage inside the body at the shoulder. The hand contour stays opaque.
left_alpha = LEFT_ARM.getchannel("A")
for x in range(33, 60):
    band = left_alpha.crop((x, 0, x + 1, SIZE[1]))
    gain = (x - 33) / 27
    left_alpha.paste(band.point(lambda value: round(value * gain)), (x, 0))
LEFT_ARM.putalpha(left_alpha)

RIGHT_OUTLINE = [
    (306, 217), (312, 214), (321, 215), (331, 222), (340, 229),
    (349, 234), (350, 241), (346, 245), (336, 239), (336, 249),
    (323, 253), (320, 259), (315, 253), (310, 244), (309, 238),
    (305, 236), (302, 231), (303, 224),
]
RIGHT_HOLDOUT = mask([
    (270, 208), (302, 209), (307, 214), (304, 229), (300, 246),
    (295, 264), (290, 281), (286, 285), (303, 292), (320, 289),
    (319, 274), (320, 261), (321, 253), (334, 250), (334, 242),
    (337, 237), (349, 234), (369, 234), (372, 230), (384, 230),
    (384, 350), (270, 350),
])
# Keep the gap between the laptop and books open down to the tabletop.
RIGHT_HOLDOUT = ImageChops.subtract(RIGHT_HOLDOUT, mask([
    (306, 217), (314, 203), (384, 203), (384, 228), (369, 229),
    (367, 233), (349, 233), (336, 236), (333, 241), (333, 249),
    (320, 252), (318, 259), (318, 281), (316, 288), (305, 287),
    (290, 282), (292, 272), (297, 254), (302, 236),
]))
RIGHT_ERASE = ImageChops.subtract(mask([
    (301, 215), (313, 211), (325, 214), (338, 225), (353, 229),
    (352, 234), (335, 244), (332, 255), (321, 261), (316, 258),
    (309, 249), (307, 240), (301, 234),
], 1.3), RIGHT_HOLDOUT)
right_plate = BASE.copy()
restore(right_plate, clone(BASE, -21, 9), mask([
    (299, 207), (334, 207), (352, 230), (335, 236), (327, 256),
    (317, 263), (300, 254),
], 2))
restore(right_plate, clone(BASE, -12, 24), mask([
    (300, 231), (326, 234), (330, 250), (320, 263), (302, 267),
], 2.2))
RIGHT_ARM = rgba(BASE, ImageChops.subtract(mask(RIGHT_OUTLINE, 0.35), RIGHT_HOLDOUT))
NOTE_OUTLINE = [
    (296, 269), (305, 266), (317, 264), (322, 266), (322, 280),
    (315, 283), (312, 286), (304, 283), (291, 278),
]
NOTE_ERASE = ImageChops.subtract(mask(NOTE_OUTLINE, 0.95), RIGHT_HOLDOUT)
note_plate = BASE.copy()
restore(note_plate, clone(BASE, 63, -49), mask([
    (284, 265), (324, 261), (324, 290), (284, 288),
], 1.4))

# The rest pose crops both sides of this sheet. Complete the hidden paper
# corners under the holdouts, keeping the lettering from the exposed interior.
paper_edge = mask([(287, 271), (319, 264), (329, 277), (312, 286), (286, 278)], 0.28)
paper_face = mask([(288, 271.5), (319, 265), (327, 277), (312, 284.7), (287, 277.5)], 0.4)
paper = Image.new("RGB", SIZE, "#815635")
restore(paper, "#f0e2cc", paper_face)
restore(paper, BASE, mask([
    (300, 270), (309, 267), (316, 267), (318, 271), (317, 278),
    (312, 282), (304, 279), (297, 276),
], 1.3))
NOTE = rgba(paper, paper_edge)

def eye_layers():
    clean = BASE.copy()
    layers = []
    for cx, cy, rx, ry in [(176, 175, 10.2, 12.2), (224, 174, 9.1, 11.9)]:
        iris = mask([
            (cx + rx * math.cos(t / 24 * math.tau), cy + ry * math.sin(t / 24 * math.tau))
            for t in range(24)
        ], 0.38)
        donor = Image.new("RGB", SIZE)
        for y in range(cy - 18, cy + 19):
            left = BASE.getpixel((cx - 14, y))
            right = BASE.getpixel((cx + 14, y))
            for x in range(cx - 14, cx + 15):
                w = (x - cx + 14) / 28
                texture = BASE.getpixel((x, y - 30))
                speckle = (texture[1] - BASE.getpixel((x + 1, y - 30))[1]) * 0.48
                donor.putpixel((x, y), tuple(
                    max(0, min(255, round(a * (1 - w) + b * w + speckle)))
                    for a, b in zip(left, right)
                ))
        restore(clean, donor, iris.filter(ImageFilter.MaxFilter(5)))
        layers.append((rgba(BASE, iris), cx, cy))
    return clean, layers


EYE_PLATE, EYES = eye_layers()
EYE_AREA = ImageChops.difference(BASE, EYE_PLATE).convert("L").point(
    lambda value: 255 if value else 0
)


def eyes(frame, dx, dy, open_fraction):
    restore(frame, EYE_PLATE, EYE_AREA)
    for layer, cx, cy in EYES:
        if open_fraction > 0.24:
            pose = layer.transform(
                SIZE, Image.Transform.AFFINE, (1, 0, -dx, 0, 1, -dy),
                Image.Resampling.BICUBIC,
            )
            coverage = pose.getchannel("A")
            if open_fraction < 1:
                # Reveal the original iris below the curved upper lid so its
                # texture and proportions stay fixed during the blink.
                edge_y = cy + dy - 15 + (1 - open_fraction) * 27
                arch = [
                    (cx + dx + x, edge_y - 0.023 * x * x)
                    for x in range(-13, 14, 2)
                ]
                aperture = mask(arch + [(cx + dx + 13, cy + 19),
                                        (cx + dx - 13, cy + 19)], 0.35)
                coverage = ImageChops.multiply(coverage, aperture)
            restore(frame, pose.convert("RGB"), coverage)
        else:
            lid = Image.new("L", SIZE)
            ImageDraw.Draw(lid).line(
                [(cx + dx + x, cy + dy + y) for x, y in
                 [(-8, 4), (-5, 7), (-2, 8), (2, 8), (5, 6), (8, 3)]],
                fill=255, width=2,
            )
            restore(frame, (58, 26, 15), lid.filter(ImageFilter.GaussianBlur(0.45)))


# Values between adjacent poses ease in and out. Each beat holds the readable pose.
LEFT = [(0, 0), (12, 0), (25, -15), (31, -15), (42, 11), (54, 10),
        (61, 5), (73, 0), (125, 0)]
GAZE_X = [(0, 0), (41, 0), (50, -4.8), (67, -4.4), (78, 0),
          (88, 3.2), (99, 3.0), (114, 0), (125, 0)]
GAZE_Y = [(0, 0), (41, 0), (50, 1.3), (57, 1.3), (62, 3), (73, 1.1),
          (80, 0), (90, 3), (102, 3), (114, 0), (125, 0)]
LIDS = [(0, 1), (55, 1), (58, 0.51), (60, 0.19), (61, 0.19),
        (64, 0.64), (67, 1), (125, 1)]
OFFER = [(0, 0), (69, 0), (83, 0.88), (88, 1), (98, 0.98), (113, 0), (125, 0)]

KEYS = {
    0: "original",
    28: "draw-back",
    46: "point",
    52: "look-left",
    60: "acknowledge",
    88: "offer-notes",
    98: "look-at-notes",
    125: "settle",
}


def value(keys, frame):
    for (a, start), (b, end) in zip(keys, keys[1:]):
        if a <= frame <= b:
            t = (frame - a) / (b - a)
            return start + (end - start) * t * t * (3 - 2 * t)
    raise ValueError(frame)


def draw(frame_number):
    frame = BASE.copy()
    left = value(LEFT, frame_number)
    gaze_x = value(GAZE_X, frame_number)
    gaze_y = value(GAZE_Y, frame_number)
    lids = value(LIDS, frame_number)
    offer = value(OFFER, frame_number)
    if left:
        start = frame.copy()
        restore(frame, left_plate, ImageChops.subtract(LEFT_ERASE, LEFT_HOLDOUT))
        move(frame, LEFT_ARM, left, (51, 249), (max(left, 0) * 1.15, 0), LEFT_HOLDOUT)
        # Match the original painting while the new pose is within two source pixels.
        frame = Image.blend(start, frame, min(1, abs(left) / 2))
    if gaze_x or gaze_y or lids < 1:
        eyes(frame, gaze_x, gaze_y, lids)
    if offer:
        start = frame.copy()
        restore(frame, note_plate, NOTE_ERASE)
        restore(frame, right_plate, RIGHT_ERASE)
        move(frame, NOTE, -56 * offer, (321, 271), (12 * offer, -26 * offer), RIGHT_HOLDOUT)
        move(frame, RIGHT_ARM, 38 * offer, (349, 225), (-1 * offer, 0), RIGHT_HOLDOUT)
        frame = Image.blend(start, frame, min(1, offer / 0.07))
    return frame


def display(native):
    # xMidYMin slice: width fixes the uniform scale and the surplus is at bottom.
    visible_height = DISPLAY[1] * SIZE[0] / DISPLAY[0]
    return native.resize(DISPLAY, Image.Resampling.LANCZOS, box=(0, 0, SIZE[0], visible_height))


def main():
    native = ROOT / "keyframes"
    native.mkdir(exist_ok=True)
    frames = [display(draw(i)) for i in range(COUNT)]
    for i, name in KEYS.items():
        draw(i).save(native / f"{i:03}-{name}.png", optimize=True)

    render = [
        "ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-f", "rawvideo",
        "-pixel_format", "rgb24", "-video_size", f"{DISPLAY[0]}x{DISPLAY[1]}",
        "-framerate", str(FPS),
        "-i", "-", "-an",
    ]
    pixels = b"".join(frame.tobytes() for frame in frames)
    subprocess.run(render + [
        "-f", "apng", "-plays", "0", "-final_delay", f"1/{FPS}", str(ROOT / "loop.png"),
    ], input=pixels, check=True)
    subprocess.run(render + [
        "-c:v", "libx264", "-crf", "16", "-pix_fmt", "yuv444p",
        "-movflags", "+faststart", str(ROOT / "preview.mp4"),
    ], input=pixels, check=True)

    grid_frames = [(i, name) for i, name in KEYS.items()]
    grid_frames.insert(-1, (108, "returning"))
    width, height = DISPLAY
    heading = 30
    gap = 8
    grid = Image.new("RGB", (width * 3 + gap * 4, (height + heading) * 3 + gap * 4),
                     "#f1e7d7")
    label = ImageDraw.Draw(grid)
    font = ImageFont.load_default(size=17)
    for slot, (i, name) in enumerate(grid_frames):
        x = gap + slot % 3 * (width + gap)
        y = gap + slot // 3 * (height + heading + gap)
        label.text((x + 4, y + 4), f"{i / FPS:.2f} s  {name.replace('-', ' ')}",
                   fill="#442b20", font=font)
        grid.paste(frames[i], (x, y + heading))
    grid.save(ROOT / "key-moments.jpg", quality=94, subsampling=0)


if __name__ == "__main__":
    main()
