"""Prepare registered, eye-only patches for the 117-frame Canvas study."""
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parent
REFERENCE = (592, 449, 1042, 749)
PATCH = (100, 128, 345, 212)
BOXES = ((100, 139, 181, 212), (273, 128, 345, 201))
FPS = 30
FRAMES = 117
COLUMNS = 12
HALF_CLOSED_FRAMES = (43, 44, 48, 49)
FULLY_CLOSED_FRAMES = (45, 46, 47)

def read_rgb(name):
    with Image.open(ROOT / name) as source:
        return source.convert("RGB")

def smooth(value):
    value = max(0, min(1, value))
    return value * value * (3 - 2 * value)

def clip_to_eyes(mask):
    out = Image.new("L", mask.size)
    for box in BOXES:
        out.paste(mask.crop(box), box[:2])
    return out

def lid_mask(opened, painted):
    open_ink = opened.convert("L").point(lambda n: 255 if n < 152 else 0)
    lid_ink = painted.convert("L").point(lambda n: 255 if n < 150 else 0)
    ink = clip_to_eyes(ImageChops.lighter(open_ink, lid_ink))
    return clip_to_eyes(ink.filter(ImageFilter.MaxFilter(11)).filter(ImageFilter.GaussianBlur(1.35)))

def gaze_mask(opened):
    # Both ellipses sit inside the unchanged open outlines.
    inner = Image.new("L", opened.size)
    draw = ImageDraw.Draw(inner)
    draw.ellipse((119, 153, 162, 196), fill=223)
    draw.ellipse((288, 143, 327, 185), fill=223)
    inner = inner.filter(ImageFilter.GaussianBlur(3))
    # Preserve the original warm key-light glints.
    glints = Image.new("L", opened.size)
    draw = ImageDraw.Draw(glints)
    draw.ellipse((143, 146, 168, 171), fill=255)
    draw.ellipse((305, 138, 330, 161), fill=255)
    return clip_to_eyes(ImageChops.multiply(inner, ImageChops.invert(glints.filter(ImageFilter.GaussianBlur(1)))))

def main():
    original = read_rgb("p0.png").crop(REFERENCE)
    closed_paint = read_rgb("eyelids-source.png").resize(original.size, Image.Resampling.LANCZOS)
    half_paint = read_rgb("half-lid-source.png").resize(original.size, Image.Resampling.LANCZOS)
    gaze = read_rgb("gaze-source.png").resize(original.size, Image.Resampling.LANCZOS)
    closed = Image.composite(closed_paint, original, lid_mask(original, closed_paint))
    half = Image.composite(half_paint, original, lid_mask(original, half_paint))
    gaze_matte = gaze_mask(original)
    width, height = PATCH[2] - PATCH[0], PATCH[3] - PATCH[1]
    sheet = Image.new("RGBA", (COLUMNS * width, ((FRAMES + COLUMNS - 1) // COLUMNS) * height))

    for frame in range(FRAMES):
        t = frame / FPS
        glance = smooth((t - 1.93) / .13) * (1 - smooth((t - 2.10) / .22))
        # Show painted eyelid poses directly, with no dissolve between eye outlines.
        if frame in FULLY_CLOSED_FRAMES:
            eye = closed
        elif frame in HALF_CLOSED_FRAMES:
            eye = half
        elif glance > 0:
            eye = Image.composite(gaze, original, gaze_matte.point(lambda n: round(n * glance)))
        else:
            continue
        sheet.paste(eye.crop(PATCH), ((frame % COLUMNS) * width, (frame // COLUMNS) * height))
    sheet.save(ROOT / "eye-frames.png", optimize=True)

if __name__ == "__main__":
    main()
