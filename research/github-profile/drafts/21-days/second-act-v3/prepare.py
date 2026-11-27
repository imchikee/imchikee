"""Pack Candidate A's approved V3 poses using the standalone GIF timing."""
from hashlib import sha256
import json
from pathlib import Path
import subprocess

from PIL import Image, ImageChops, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parent
PREVIEWS = ROOT.parent / 'assets' / 'previews'
SIZE = 320
MASTER_SIZE = 1254
WIDTH, HEIGHT = 534, 485
COLUMNS = 8
TITLE_BOX = (0, 0, 312, 117)


def read_gif_durations(filename, expected_hash, count):
    path = PREVIEWS / filename
    assert sha256(path.read_bytes()).hexdigest() == expected_hash, filename
    durations = []
    with Image.open(path) as gif:
        assert (gif.format, gif.size, gif.n_frames) == ('GIF', (SIZE, SIZE), count)
        for index in range(count):
            gif.seek(index)
            durations.append(gif.info['duration'])
    return durations


def read_master(count):
    path = ROOT.parent / 'assets/candidates/second-act-v3-blink-master-candidate-a-1254.mp4'
    assert sha256(path.read_bytes()).hexdigest() == (
        '65dc4884dab3554dfe7b09f840b51a1553508a93f9d392f91e996fc316d8c429'
    )
    # The approved frame mapping is Candidate A frame 5 * GIF index + 2.
    selection = '+'.join(rf'eq(n\,{5 * index + 2})' for index in range(count))
    decoded = subprocess.check_output([
        'ffmpeg', '-v', 'error', '-i', str(path), '-map', '0:v:0',
        '-vf', f'select={selection}', '-fps_mode', 'passthrough',
        '-pix_fmt', 'rgb24', '-f', 'rawvideo', 'pipe:1',
    ])
    frame_bytes = MASTER_SIZE * MASTER_SIZE * 3
    assert len(decoded) == count * frame_bytes

    # Measure the inset inside the brown line in the previous 534 × 485 framing,
    # then map it straight to the master. Keep the tip of the right book in frame.
    units_per_pixel = (SIZE - 4) / WIDTH
    height = 467
    width = height * WIDTH / HEIGHT
    left = (WIDTH - width) / 2 + 1.8
    top = 9.8
    box = tuple(edge * MASTER_SIZE / SIZE for edge in (
        4 + left * units_per_pixel,
        19.5 + top * units_per_pixel,
        4 + (left + width) * units_per_pixel,
        19.5 + (top + height) * units_per_pixel,
    ))
    for start in range(0, len(decoded), frame_bytes):
        frame = Image.frombytes('RGB', (MASTER_SIZE, MASTER_SIZE),
                                decoded[start:start + frame_bytes])
        yield frame.resize((WIDTH, HEIGHT), Image.Resampling.LANCZOS, box)


def title_mask():
    mask = Image.new('L', (WIDTH, HEIGHT))
    ImageDraw.Draw(mask).polygon(
        [(0, 0), (295, 0), (297, 58), (292, 84), (271, 99),
         (225, 105), (144, 108), (64, 110), (0, 109)],
        fill=255,
    )
    return mask.filter(ImageFilter.GaussianBlur(5)).crop(TITLE_BOX)


def correct_title_paper(frame, mask):
    title = frame.crop(TITLE_BOX)
    pixels, mask_pixels = title.load(), mask.load()
    for y in range(title.height):
        for x in range(title.width):
            rgb = pixels[x, y]
            # Fade out toward the brown ink and toward the surrounding painted wall.
            light = max(0, min(1, (rgb[1] - 115) / 98))
            weight = mask_pixels[x, y] / 255 * light * light * (3 - 2 * light)
            pixels[x, y] = tuple(
                round(value + (255 - value) * gain * weight)
                for value, gain in zip(rgb, (0.27, 0.54, 0.58))
            )
    frame.paste(title, TITLE_BOX)
    return frame


def main():
    durations = read_gif_durations(
        'second-act-v3-blink-preview.gif',
        'b5ab84edb840f5b38b01d049165e76303d6d9ff0ebfecb1a814bffcdb479e323',
        38,
    )
    pair_durations = read_gif_durations(
        'first-act-plus-second-act-v3-blink-preview.gif',
        '2150ac2f6f4faf03ee5d07a512b647db530503684c924985c4b7e42bc89a4f89',
        77,
    )
    assert sum(durations) == 3160
    assert sum(pair_durations[:39]) == 3250
    assert pair_durations[39:] == durations

    mask = title_mask()
    frames = [correct_title_paper(frame, mask) for frame in read_master(len(durations))]
    # Identical pixels can share a tile. Every source frame keeps its time slot.
    unique, slots, tile_for_pixels = [], [], {}
    for frame in frames:
        pixels = frame.tobytes()
        tile = tile_for_pixels.setdefault(pixels, len(unique))
        if tile == len(unique):
            unique.append(frame)
        slots.append(tile)

    def tile_origin(tile):
        row, column = divmod(tile, COLUMNS)
        return (column * WIDTH, row * HEIGHT)

    rows = (len(unique) + COLUMNS - 1) // COLUMNS
    atlas = Image.new('RGB', (COLUMNS * WIDTH, rows * HEIGHT))
    for tile, frame in enumerate(unique):
        atlas.paste(frame, tile_origin(tile))
    atlas_path = ROOT / 'frames-hd.webp'
    atlas.save(atlas_path, lossless=True)

    with Image.open(atlas_path) as packed:
        for index, (tile, frame) in enumerate(zip(slots, frames)):
            x, y = tile_origin(tile)
            tile_image = packed.crop((x, y, x + WIDTH, y + HEIGHT))
            assert ImageChops.difference(frame, tile_image).getbbox() is None, index

    data = dict(width=WIDTH, height=HEIGHT, columns=COLUMNS,
                frameTiles=slots, durationsMs=durations)
    (ROOT / 'frame-table.js').write_text(
        '// Generated by prepare.py from Candidate A with the accepted GIF timing.\n'
        'window.SECOND_ACT_V3_FRAMES = ' + json.dumps(data, separators=(',', ':')) + ';\n',
        encoding='utf-8',
    )
    print(f'Verified {len(frames)} source frames and their durations, packed into {len(unique)} tiles.')


if __name__ == '__main__':
    main()
