"""Register painted Act 4 poses to the storyboard and export the review loop."""

from functools import lru_cache
from pathlib import Path
import struct
import subprocess

from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parent
STORYBOARD = ROOT / "../../../cpp-humor/storyboards/21-days/hamster-storyboard-v1.png"
CROP = (21, 446, 405, 796)
SIZE = (384, 350)
DISPLAY = (534, 485)
FPS = 30
COUNT = 126

# Native coordinates of the 6× edit references and static registration anchors.
REFERENCES = {
    "L": ((0, 83, 160, 313), ((5, 85, 79, 112), (58, 283, 99, 306), (107, 277, 145, 294))),
    "C": ((95, 78, 284, 269), ((100, 79, 276, 90), (159, 216, 282, 232), (172, 236, 281, 267))),
    "R": ((246, 92, 384, 315), ((263, 94, 381, 112), (248, 211, 289, 267), (331, 253, 383, 308))),
}

# Draw only coverage mattes. All visible artwork comes from P0 or a painted pose.
LAPTOP = [(103,277),(143,273),(152,223),(156,215),(164,211),(290,207),(301,207),
          (306,210),(309,216),(303,236),(298,256),(291,283),(283,302),(270,307),
          (142,309),(135,304),(104,283)]
LEFT_MUG = [(0,275),(6,273),(12,268),(20,265),(42,264),(51,267),(56,272),
            (58,284),(57,315),(27,321),(0,312)]
RIGHT_MUG = [(269,290),(275,285),(288,281),(295,281),(303,283),(310,286),(312,289),(310,323),(275,324),(266,310)]
BOOKS = [(317,287),(317,282),(321,279),(323,274),(323,260),(321,258),(323,252),
         (336,250),(335,244),(338,239),
         (352,236),(364,235),(364,231),(371,228),(384,227),(384,350),(293,350),(293,291)]
LEFT_MATTE = [
    (0,126),(11,122),(23,125),(34,123),(47,121),(65,122),(77,117),(88,116),(97,121),
    (99,130),(97,141),(103,151),(114,161),(123,176),(129,194),(129,211),(134,219),
    (136,234),(128,244),(117,254),(104,266),(92,273),(72,278),(57,280),(40,284),(0,278),
]
CENTER_MATTE = [
    (104,135),(106,121),(114,113),(126,106),(139,104),(145,101),(154,96),(169,92),
    (174,88),(185,88),(193,91),(207,91),(216,96),(220,106),(231,105),(244,106),
    (255,113),(259,128),(255,142),(247,149),(253,157),(263,164),(274,178),(278,197),(277,213),
    (166,224),(148,236),(136,236),(129,228),(121,220),(122,208),(125,196),(121,181),
    (116,169),(112,159),(111,153),(105,147),
]
RIGHT_MATTE = [
    (264,162),(274,150),(285,140),(283,131),(288,117),(299,113),(308,115),(317,122),
    (330,118),(344,120),(355,124),(361,122),(369,126),(370,134),(384,137),
    (384,285),(326,290),(308,290),(288,281),(292,266),(297,244),(301,219),
    (277,211),(276,195),(270,178),
]

# First held frame of each independently timed character drawing. None means P0.
TRACKS = {
    "L": ((10, "L_gather"), (14, "L_reach"), (18, "L_point"),
          (46, "L_reach"), (50, "L_gather"), (54, None)),
    "C": ((34, "C_left_in"), (38, "C_look_left"), (53, "C_left_in"),
          (57, "C_half_blink"), (60, "C_ack_nod"), (64, "C_half_blink"),
          (67, None), (70, "C_right_in"), (74, "C_look_right"),
          (109, "C_right_in"), (113, None)),
    "R": ((65, "R_pick_up"), (69, "R_lift"), (73, "R_share"),
          (106, "R_lift"), (110, "R_pick_up"), (114, None)),
}
MOMENTS = {
    0: "original",
    10: "gather",
    14: "reach",
    18: "point",
    34: "left-turn-in",
    38: "listen",
    57: "half-blink",
    60: "nod",
    65: "pick-up",
    69: "lift",
    70: "right-turn-in",
    74: "share-and-read",
    107: "lower",
    111: "return",
    125: "settle",
}


def load_rgb(path):
    with Image.open(path) as source:
        return source.convert("RGB")


def polygon(points):
    matte = Image.new("L", SIZE)
    ImageDraw.Draw(matte).polygon(points, fill=255)
    return matte


def pose_masks():
    protected = Image.new("L", SIZE)
    for contour in (LAPTOP, LEFT_MUG, RIGHT_MUG, BOOKS):
        protected = ImageChops.lighter(protected, polygon(contour))
    masks = {}
    for actor, contour in (("L", LEFT_MATTE), ("C", CENTER_MATTE), ("R", RIGHT_MATTE)):
        outline = polygon(contour)
        edges = outline.filter(ImageFilter.GaussianBlur(1.15))
        masks[actor] = ImageChops.multiply(ImageChops.multiply(edges, outline),
                                           ImageChops.invert(protected))
    return masks, protected


def register(p0, donor, actor):
    """Fit the whole donor crop to fixed texture anchors by scale and translation."""
    box, anchors = REFERENCES[actor]
    left, top, right, bottom = box
    width, height = right - left, bottom - top
    target = p0.convert("L").filter(ImageFilter.FIND_EDGES)
    targets = [target.crop(anchor) for anchor in anchors]
    donor_luma = donor.convert("L")

    def anchor_error(plate, dx, dy):
        error = 0
        for anchor, expected in zip(anchors, targets):
            x0, y0, x1, y1 = anchor
            sample = plate.crop((x0 - dx, y0 - dy, x1 - dx, y1 - dy))
            hist = ImageChops.difference(sample, expected).histogram()
            error += sum(min(value, 45) * count for value, count in enumerate(hist)) / sample.width / sample.height
        return error

    def fit(source, padding, dx, dy):
        scale = 1 + padding / 100
        # Align the center of the crop, then use the anchor-derived offset.
        canvas = Image.new(source.mode, SIZE)
        crop = source.resize((round(width * scale), round(height * scale)), Image.Resampling.LANCZOS)
        canvas.paste(crop, (round(left + (width - crop.width) / 2) + dx,
                            round(top + (height - crop.height) / 2) + dy))
        return canvas

    candidates = []
    for padding in (-2, -1, 0, 1, 2):
        plate = fit(donor_luma, padding, 0, 0).filter(ImageFilter.FIND_EDGES)
        for dx in range(-4, 5):
            for dy in range(-4, 5):
                cost = anchor_error(plate, dx, dy) + 0.12 * (abs(dx) + abs(dy) + abs(padding))
                candidates.append((cost, padding, dx, dy))
    _, scale, dx, dy = min(candidates)
    registration = (scale, dx, dy)
    return fit(donor, *registration), registration


def display(native, resampler=Image.Resampling.LANCZOS):
    visible_height = DISPLAY[1] * SIZE[0] / DISPLAY[0]
    return native.resize(DISPLAY, resampler, box=(0, 0, SIZE[0], visible_height))


def export(frames):
    ffmpeg = [
        "ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-f", "rawvideo",
        "-pixel_format", "rgb24", "-video_size", "534x485", "-framerate", str(FPS),
        "-i", "-", "-an",
    ]
    pixels = b"".join(frame.tobytes() for frame in frames)
    subprocess.run(ffmpeg + [
        "-f", "apng", "-plays", "0", "-final_delay", "1/30", str(ROOT / "loop.png"),
    ], input=pixels, check=True)
    # Keep the odd 485-pixel height without adding a matte row.
    subprocess.run(ffmpeg + [
        "-c:v", "libx264", "-crf", "16", "-pix_fmt", "yuv444p", "-movflags", "+faststart",
        str(ROOT / "preview.mp4"),
    ], input=pixels, check=True)


def verify_apng(frames):
    payload = (ROOT / "loop.png").read_bytes()
    offset = 8
    delays = []
    while offset < len(payload):
        length, kind = struct.unpack_from(">I4s", payload, offset)
        if kind == b"acTL":
            assert struct.unpack_from(">II", payload, offset + 8) == (COUNT, 0)
        if kind == b"fcTL":
            delays.append(struct.unpack_from(">HH", payload, offset + 28))
        offset += length + 12
    assert delays == [(1, FPS)] * COUNT, delays
    with Image.open(ROOT / "loop.png") as apng:
        assert apng.size == DISPLAY and apng.n_frames == COUNT and apng.info["loop"] == 0
        for index, expected in enumerate(frames):
            apng.seek(index)
            assert apng.convert("RGB").tobytes() == expected.tobytes(), index


def sheet(output, frames, columns=3):
    width, height = frames[0][1].size
    gap, heading = 8, 28
    rows = (len(frames) + columns - 1) // columns
    grid = Image.new("RGB", (columns * (width + gap) + gap,
                            rows * (height + heading + gap) + gap), "#f1e7d7")
    label = ImageDraw.Draw(grid)
    font = ImageFont.load_default(size=16)
    for slot, (title, frame) in enumerate(frames):
        x = gap + slot % columns * (width + gap)
        y = gap + slot // columns * (height + heading + gap)
        label.text((x + 4, y + 4), title, fill="#442b20", font=font)
        grid.paste(frame, (x, y + heading))
    grid.save(output, quality=95, subsampling=0)


def main():
    p0 = load_rgb(STORYBOARD).crop(CROP)
    masks, protected = pose_masks()
    overlays = {}
    for actor, track in TRACKS.items():
        for _, name in track:
            if name is None or name in overlays:
                continue
            donor = load_rgb(ROOT / "source" / f"{name}.png")
            plate, fit = register(p0, donor, actor)
            overlays[name] = plate
            print(f"{name}: scale percent delta, x, y = {fit}")

    base_display = display(p0)
    protected_display = display(protected, Image.Resampling.NEAREST)

    @lru_cache(maxsize=None)
    def compose(poses):
        result = p0.copy()
        active = Image.new("L", SIZE)
        for actor, name in zip(("R", "C", "L"), poses):
            if name is not None:
                result.paste(overlays[name], (0, 0), masks[actor])
                active = ImageChops.lighter(active, masks[actor])
        difference = ImageChops.difference(p0, result)
        fixed = active.point(lambda value: 0 if value else 255)
        assert not ImageChops.multiply(difference, fixed.convert("RGB")).getbbox()
        assert not ImageChops.multiply(difference, protected.convert("RGB")).getbbox()
        allowed_display = display(ImageChops.invert(fixed), Image.Resampling.NEAREST)
        rendered = Image.composite(display(result), base_display, allowed_display)
        display_difference = ImageChops.difference(base_display, rendered)
        assert not ImageChops.multiply(display_difference, protected_display.convert("RGB")).getbbox()
        return result, rendered

    def get_pose(index, track):
        return next((name for start, name in reversed(track) if start <= index), None)

    natives, frames = zip(*(compose(tuple(get_pose(i, TRACKS[actor]) for actor in ("R", "C", "L")))
                            for i in range(COUNT)))
    assert natives[0].tobytes() == p0.tobytes() == natives[-1].tobytes()
    native_dir = ROOT / "keyframes"
    native_dir.mkdir(exist_ok=True)
    for index, name in MOMENTS.items():
        natives[index].save(native_dir / f"{index:03}-{name}.png", optimize=True)
    assert frames[0].tobytes() == base_display.tobytes() == frames[-1].tobytes()
    export(frames)
    verify_apng(frames)
    sheet(ROOT / "key-moments.jpg", [(f"{index / FPS:.2f} s   {name}", frames[index])
                                    for index, name in MOMENTS.items()])
    print("126 decoded frames match the render, 1/30 s each, loop=0.")


if __name__ == "__main__":
    main()
