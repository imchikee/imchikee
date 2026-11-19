"""Extract two complete painted foreleg poses in a shared registered crop."""
from pathlib import Path
import sys

from PIL import Image, ImageChops, ImageDraw, ImageFilter

HERE = Path(__file__).resolve().parent
MASTER = HERE.parent / 'desk-composition-painted-rounded-upper-contours/candidate.png'
PRINT = HERE.parent / 'desk-composition-painted/print-layer.png'
BOX = (285, 654, 637, 918)
SIZE = (BOX[2] - BOX[0], BOX[3] - BOX[1])
SCALE = 4

# Foreleg outline, exposed upper pencil, exposed lower pencil. The pose
# patches share the cheek boundary and carry the paint through the wrist.
CONTOURS = (
    (
        [(61,52),(65,60),(75,68),(89,75),(104,82),(121,91),(136,101),
         (146,111),(158,128),(166,139),(185,147),(198,152),(209,159),
         (217,168),(221,177),(220,185),(216,192),(207,195),(208,201),
         (203,208),(194,211),(189,215),(184,220),(173,222),(162,221),
         (150,218),(135,214),(119,209),(103,204),(88,200),(72,195),
         (60,189),(49,180),(41,168),(36,154),(35,139),(37,125),
         (41,109),(47,91),(52,74)],
        [(139,68),(147,65),(153,68),(158,75),(164,87),(170,100),
         (177,114),(184,129),(194,145),(201,154),(186,152),(170,145),
         (163,134),(156,119),(150,105),(142,91),(137,80),(136,74)],
        [(203,184),(216,192),(221,204),(227,218),(230,230),(235,247),
         (233,247),(225,240),(216,230),(207,219),(200,205)],
    ),
    (
        [(61,52),(65,61),(74,69),(86,76),(99,82),(112,90),(123,99),
         (135,114),(146,134),(151,143),(168,148),(180,155),(190,163),
         (197,171),(200,181),(198,191),(192,196),(187,198),(187,204),
         (180,210),(172,212),(168,218),(159,223),(148,225),(134,223),
         (119,215),(106,211),(92,207),(76,201),(63,197),(50,190),
         (40,183),(31,174),(23,162),(20,148),(21,131),(25,118),
         (33,99),(44,84),(52,69)],
        [(122,69),(130,67),(137,70),(142,77),(148,89),(154,102),
         (160,116),(166,132),(173,148),(183,163),(163,153),(149,147),
         (144,137),(138,124),(132,110),(125,94),(119,83),(118,75)],
        [(182,185),(193,192),(199,207),(205,221),(207,235),(210,251),
         (206,249),(197,241),(187,231),(179,220),(174,207)],
    ),
)


def matte(contours, soften):
    high = Image.new('L', (SIZE[0] * SCALE, SIZE[1] * SCALE))
    draw = ImageDraw.Draw(high)
    for contour in contours:
        draw.polygon([(round(x * SCALE), round(y * SCALE)) for x, y in contour], fill=255)
    mask = high.resize(SIZE, Image.Resampling.LANCZOS)
    return mask.filter(ImageFilter.GaussianBlur(soften))


def prepare(work):
    master = Image.open(MASTER).convert('RGB').crop(BOX)
    end = Image.open(HERE / 'painted-contact.png').convert('RGB')
    clean = Image.open(HERE / 'revealed-surface.png').convert('RGB')
    mask_a = matte(CONTOURS[0], .8)
    # Widen the original footprint only enough to cover the old silhouette
    # and its contact shadow. Leave the already-printed graphite in place.
    shadow = matte([[(60,192),(108,184),(187,196),(228,219),(239,239),
                    (228,247),(197,240),(150,231),(101,217),(63,207)]], 5.0)
    reveal = ImageChops.lighter(mask_a.filter(ImageFilter.MaxFilter(9)), shadow)
    reveal = reveal.filter(ImageFilter.GaussianBlur(2.1))
    ink = Image.open(PRINT).convert('RGBA').crop(BOX).getchannel('A')
    ink_guard = ink.point(lambda v: min(255, v * 7)).filter(ImageFilter.MaxFilter(3))
    reveal = ImageChops.multiply(reveal, ImageChops.invert(ink_guard))
    plate = Image.composite(clean, master, reveal)

    # A single rigid layer carries the paper-facing graphite, painted shaft,
    # and the visible toes which wrap over it. Leave a broad fur join on its
    # left side while retaining the soft original paw silhouette.
    grip = [(137,145),(161,143),(180,146),(198,152),(209,159),
            (217,168),(221,177),(220,185),(216,192),(207,195),(208,201),
            (203,208),(194,211),(189,215),(184,220),(173,222),(162,221),
            (150,218),(135,214),(119,209),(115,199),(118,182),(127,163)]
    digits = matte([grip], .8)
    hand_overlap = Image.new('L', SIZE)
    ImageDraw.Draw(hand_overlap).polygon([(142,138),(351,138),(351,235),(127,235)], fill=255)
    digits = ImageChops.multiply(digits, hand_overlap.filter(ImageFilter.GaussianBlur(4.5)))
    tool_mask = ImageChops.lighter(digits, matte(CONTOURS[0][1:],.65))
    tool = master.convert('RGBA')
    tool.putalpha(tool_mask)
    (work / 'tool.rgba').write_bytes(tool.tobytes())

    cutoffs = (
        [(166,140),(237,140),(237,260),(145,260),(146,208),(155,181)],
        [(145,142),(222,142),(222,262),(123,262),(126,209),(135,183)],
    )
    for stem, art, outlines, cutoff in zip(('a','b'), (master,end), CONTOURS, cutoffs, strict=True):
        mask = matte(outlines[:1], .9)
        pen = matte(outlines[1:], .5).filter(ImageFilter.MaxFilter(5))
        occluded = ImageChops.lighter(pen, matte([cutoff],3.1))
        mask = ImageChops.multiply(mask, ImageChops.invert(occluded))
        layer = art.convert('RGBA')
        layer.putalpha(mask)
        (work / f'{stem}.rgba').write_bytes(layer.tobytes())
    (work / 'plate.rgb').write_bytes(plate.tobytes())


if __name__ == '__main__':
    prepare(Path(sys.argv[1]))
