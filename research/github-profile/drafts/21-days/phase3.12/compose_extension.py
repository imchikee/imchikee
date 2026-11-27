"""Register the bottom-only ImageGen outpaint to the locked P0."""
from pathlib import Path

from PIL import Image, ImageChops, ImageFilter

REVIEW = Path(__file__).resolve().parent
ART = REVIEW.parent / 'building-motion'
BAND = 114


def read_rgb(path):
    with Image.open(path) as image:
        return image.convert('RGB')


def match_edge(donor, original):
    """Fade the seam's local color correction into the generated pixels."""
    width = donor.width
    original_y = original.height - 1
    strip = donor.crop((0, 1, width, BAND + 1))
    edge = original.crop((0, original_y, width, original_y + 1)).load()
    # Correct broad color drift without transferring lettering or page-edge contrast.
    original_mean = original.crop((0, original_y, width, original.height)).filter(
        ImageFilter.GaussianBlur(9),
    ).load()
    donor_mean = donor.crop((0, 0, width, 1)).filter(ImageFilter.GaussianBlur(9)).load()
    delta = [
        tuple(max(-36, min(36, a - b))
              for a, b in zip(original_mean[x, 0], donor_mean[x, 0]))
        for x in range(width)
    ]
    px = strip.load()
    rows = 24
    for y in range(rows):
        u = 1 - y / rows
        strength = u * u * (3 - 2 * u)
        for x in range(width):
            corrected = [value + strength * shift for value, shift in zip(px[x, y], delta[x])]
            # Keep edge grain through the join while the donor immediately takes over.
            if y < 3:
                mix = (3 - y) * 0.18
                corrected = [a * (1 - mix) + b * mix
                             for a, b in zip(corrected, edge[x, 0])]
            px[x, y] = tuple(max(0, min(255, round(value))) for value in corrected)
    return strip


def register_bottom(donor, boundary):
    # Align the notebook corners, marker and adjacent blue book at the seam.
    controls = [(0, 0, -2), (375, 0, -2), (452, -1, -3), (535, -2, -3),
                (770, 0, -2), (842, 6, -2), (887, 21, -1), (902, 16, -1),
                (927, 3, -2), (962, -9, -2), (1020, -8, -2), (1110, 0, -3),
                (1225, -10, 1), (1259, -1, -2), (1307, -3, -3),
                (1336, -6, -3), (1355, 0, -18), (1380, 0, -21)]
    quads = []
    for (x0, dx0, dy0), (x1, dx1, dy1) in zip(controls, controls[1:]):
        reference = boundary - 1
        quads.append((
            (x0, 0, x1, BAND + 1),
            (x0 + dx0, reference + dy0, x0, donor.height,
             x1, donor.height, x1 + dx1, reference + dy1),
        ))
    return donor.transform((donor.width, BAND + 1), Image.Transform.MESH, quads,
                           resample=Image.Resampling.BICUBIC)


def match_left_desk(donor):
    # The earlier bottom outpaint follows the long grain lines more closely at the join.
    # Blend in that registered wood texture only, before the leftmost notebook.
    width, depth = 390, 39
    earlier = read_rgb(REVIEW / 'imagegen-bottom-original.png').resize(
        (donor.width, 570), Image.Resampling.LANCZOS,
    ).crop((0, 511, width, 511 + depth))
    mask = Image.new('L', (width, depth))
    mask.putdata([
        round(255 * max(0, 1 - (y / (depth - 1)) ** 2) ** 2
              * min(1, max(0, (width - 1 - x) / 55)) ** 2)
        for y in range(depth) for x in range(width)
    ])
    donor.paste(earlier, (0, 0), mask)


def main():
    p0 = read_rgb(ART / 'p0.png')
    width, height = p0.size
    lower_context = 546
    bottom_guide = read_rgb(REVIEW / 'imagegen-bottom-114-original.png').resize(
        (width, lower_context + BAND), Image.Resampling.LANCZOS,
    )
    registered_bottom = register_bottom(bottom_guide, lower_context)
    match_left_desk(registered_bottom)

    extended = Image.new('RGB', (width, height + BAND))
    extended.paste(match_edge(registered_bottom, p0), (0, height))
    extended.paste(p0, (0, 0))
    assert ImageChops.difference(p0, extended.crop((0, 0, width, height))).getbbox() is None
    extended.save(ART / 'p0-extended.png')


if __name__ == '__main__':
    main()
