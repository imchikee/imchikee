"""Build the isolated one-touch study from two adjacent painted poses."""
from pathlib import Path
from subprocess import Popen

from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parent
P0 = ROOT.parent / "third-act-eye-study" / "p0.png"
REFERENCE = (270, 266, 1380, 1006)
FOCUS = (355, 690, 900, 980)

# Coordinates within the 1110 x 740 edit reference. One region carries the
# connected cheek/shoulder/arm/paw and the contact shadow together.
ANATOMY = [
    (134, 509), (160, 486), (234, 475), (294, 476), (365, 477),
    (441, 481), (492, 503), (529, 528), (556, 556),
    (563, 588), (551, 624), (541, 648), (514, 660), (479, 661),
    (454, 661), (426, 650), (404, 645), (380, 625), (350, 602),
    (274, 601), (221, 609), (188, 631), (151, 635), (129, 610),
]
# Preserve the existing occluding lip, including its narrow dark/cream line.
COMPUTER = [
    (606, 400), (1110, 325), (1110, 740), (518, 740), (529, 702),
    (540, 665), (550, 629), (561, 590), (571, 552), (581, 515), (594, 468),
]
# Include the original cup rim and handle. The foreground stays in registration.
MUG = [
    (187, 589), (189, 582), (199, 576), (215, 570), (243, 567),
    (269, 566), (299, 566), (329, 568), (347, 572), (361, 577),
    (370, 584), (373, 595), (387, 595), (399, 600), (410, 611),
    (416, 628), (420, 648), (419, 669), (414, 687), (408, 702),
    (390, 720), (371, 728), (370, 740), (185, 740),
]

def shape(size, contour):
    mask = Image.new("L", size)
    ImageDraw.Draw(mask).polygon(contour, fill=255)
    return mask

def shoulder_weight(size):
    """Anchor the unmoving upper cheek and outer shoulder in the base."""
    w, h = size
    horizontal = Image.new("L", (w, 1))
    horizontal.putdata([round(255 * max(0, min(1, (x - 216) / 167))) for x in range(w)])
    vertical = Image.new("L", (1, h))
    vertical.putdata([round(255 * max(0, min(1, (y - 478) / 78))) for y in range(h)])
    return ImageChops.multiply(horizontal.resize(size), vertical.resize(size))

def make_contact(base, donor):
    rest = base.crop(REFERENCE)
    pose = donor.resize(rest.size, Image.Resampling.LANCZOS)
    region = shape(rest.size, ANATOMY).filter(ImageFilter.GaussianBlur(5))
    foreground = ImageChops.lighter(shape(rest.size, COMPUTER), shape(rest.size, MUG))
    alpha = ImageChops.multiply(ImageChops.multiply(region, shoulder_weight(rest.size)),
                                ImageChops.invert(foreground))
    patch = Image.composite(pose, rest, alpha)
    diff = ImageChops.difference(patch, rest)
    fixed = alpha.point(lambda value: 0 if value else 255).convert("RGB")
    assert not ImageChops.multiply(diff, fixed).getbbox()
    contact = base.copy()
    contact.paste(patch, REFERENCE[:2])
    return contact

def review(filename, frames):
    font = ImageFont.truetype("/usr/share/fonts/noto-cjk/NotoSansCJK-Regular.ttc", 19, index=2)
    w, h = frames[0][1].size
    sheet = Image.new("RGB", (len(frames) * (w + 12) - 12, h + 42), "#232724")
    draw = ImageDraw.Draw(sheet)
    for i, (title, frame) in enumerate(frames):
        x = i * (w + 12)
        draw.text((x + 12, 7), title, font=font, fill="#f8f3e9")
        sheet.paste(frame, (x, 42))
    sheet.save(ROOT / filename)

def export_preview(contact_path, rebound_path):
    # The Canvas preview uses the same sample indices. This is one tap.
    rest, contact, rebound = (file.read_bytes() for file in (P0, contact_path, rebound_path))
    frames = [rest] * 26 + [rebound] * 2 + [contact] * 3 + [rebound] * 2 + [rest] * 84
    with Popen([
        "ffmpeg", "-v", "error", "-y", "-f", "image2pipe", "-framerate", "30", "-i", "pipe:0",
        "-an", "-c:v", "apng", "-pix_fmt", "rgb24", "-plays", "1",
        "-final_delay", "1/30", "-f", "apng", str(ROOT / "preview.png"),
    ], stdin=-1) as ffmpeg:
        with ffmpeg.stdin as stream:
            for frame in frames:
                stream.write(frame)
        if ffmpeg.wait() != 0:
            raise RuntimeError("FFmpeg preview export failed")

def main():
    with Image.open(P0) as source:
        base = source.convert("RGB")
    poses = {}
    for key, source_name in (("contact", "p1-upper-body.png"), ("rebound", "transition-upper-body.png")):
        with Image.open(ROOT / source_name) as source:
            poses[key] = make_contact(base, source.convert("RGB"))
            poses[key].save(ROOT / (key + ".png"))

    contact, rebound = poses["contact"], poses["rebound"]
    scale = lambda frame: frame.resize((534, 441), Image.Resampling.LANCZOS)
    review("comparison.png", [("P0 · 工作姿势", scale(base)), ("P1 · 接触", scale(contact))])
    review("detail.png", [("P0 · 工作姿势", base.crop(FOCUS)), ("中间／回弹", rebound.crop(FOCUS)),
                          ("P1 · 接触", contact.crop(FOCUS))])
    export_preview(ROOT / "contact.png", ROOT / "rebound.png")

if __name__ == "__main__":
    main()
