"""Extract deduplicated lossless local patches for Third Act (Phase 3.9).

Reads verified p0.png, source/forepaw.apng, and source/eyes.apng, packs all
unique non-P0 local patches without scaling/interpolation/redrawing into
patches.png, writes atlas.js, and verifies 117/117 reconstructed frames match
the direct lossless composition pixel-for-pixel.
"""
from __future__ import annotations

import hashlib
import json
from pathlib import Path
from PIL import Image, ImageChops

ROOT = Path(__file__).resolve().parent
SIZE = (1380, 1140)
FPS = 30
FRAMES = 117
DURATION = 3.9

# Left, top, right, bottom (right/bottom exclusive)
PAW_BOX = (601, 775, 805, 934)
EYE_BOX = (692, 577, 937, 661)

EXPECTED_SHA256 = {
    'p0.png': '30c99af1ee1aeacf8029477745bd8496b146a43085444d0e800dfb541c3c914f',
    'source/forepaw.apng': '641a53c5d18ea79a3747ca58e943b06279dd1bd829cb16c851c77d6b8baa9213',
    'source/eyes.apng': 'd4817af9aa7f8f71e0119dc8ce9d0104c8a916164c7461bec53c33e673940279',
}

EXPECTED_UNIQUE_PAW = 5
EXPECTED_UNIQUE_EYE = 12


def sha256_file(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def load_apng_frames(path: Path) -> list[Image.Image]:
    frames: list[Image.Image] = []
    with Image.open(path) as im:
        count = getattr(im, 'n_frames', 1)
        assert count == FRAMES, f'{path}: expected {FRAMES} frames, got {count}'
        for i in range(count):
            im.seek(i)
            rgb = im.convert('RGB')
            assert rgb.size == SIZE, f'{path} frame {i}: expected {SIZE}, got {rgb.size}'
            frames.append(rgb)
    return frames


def inside_box(bbox: tuple[int, int, int, int], box: tuple[int, int, int, int]) -> bool:
    return bbox[0] >= box[0] and bbox[1] >= box[1] and bbox[2] <= box[2] and bbox[3] <= box[3]


def main() -> None:
    for rel, expected in EXPECTED_SHA256.items():
        path = ROOT / rel
        actual = sha256_file(path)
        assert actual == expected, f'SHA256 mismatch for {rel}: {actual} != {expected}'

    with Image.open(ROOT / 'p0.png') as im:
        p0 = im.convert('RGB')
    assert p0.size == SIZE, f'Unexpected P0 size: {p0.size}'

    paw_frames_src = load_apng_frames(ROOT / 'source/forepaw.apng')
    eye_frames_src = load_apng_frames(ROOT / 'source/eyes.apng')

    paw_unique: list[Image.Image] = []
    paw_index_by_hash: dict[bytes, int] = {}
    paw_frame_map: list[int] = []

    eye_unique: list[Image.Image] = []
    eye_index_by_hash: dict[bytes, int] = {}
    eye_frame_map: list[int] = []

    direct_frames: list[Image.Image] = []

    for i in range(FRAMES):
        pf = paw_frames_src[i]
        ef = eye_frames_src[i]

        p_diff = ImageChops.difference(p0, pf)
        p_bbox = p_diff.getbbox()
        if p_bbox is not None:
            assert inside_box(p_bbox, PAW_BOX), f'Forepaw frame {i} diff {p_bbox} outside {PAW_BOX}'
            patch = pf.crop(PAW_BOX)
            key = hashlib.sha256(patch.tobytes()).digest()
            idx = paw_index_by_hash.get(key)
            if idx is None:
                idx = len(paw_unique)
                paw_index_by_hash[key] = idx
                paw_unique.append(patch)
            paw_frame_map.append(idx)
        else:
            paw_frame_map.append(-1)

        e_diff = ImageChops.difference(p0, ef)
        e_bbox = e_diff.getbbox()
        if e_bbox is not None:
            assert inside_box(e_bbox, EYE_BOX), f'Eye frame {i} diff {e_bbox} outside {EYE_BOX}'
            patch = ef.crop(EYE_BOX)
            key = hashlib.sha256(patch.tobytes()).digest()
            idx = eye_index_by_hash.get(key)
            if idx is None:
                idx = len(eye_unique)
                eye_index_by_hash[key] = idx
                eye_unique.append(patch)
            eye_frame_map.append(idx)
        else:
            eye_frame_map.append(-1)

        # Direct lossless reference composite for frame i
        ref = p0.copy()
        if p_bbox is not None:
            ref.paste(pf.crop(PAW_BOX), PAW_BOX[:2])
        if e_bbox is not None:
            ref.paste(ef.crop(EYE_BOX), EYE_BOX[:2])
        direct_frames.append(ref)

    assert len(paw_unique) == EXPECTED_UNIQUE_PAW, (
        f'Expected {EXPECTED_UNIQUE_PAW} unique forepaw patches, got {len(paw_unique)}'
    )
    assert len(eye_unique) == EXPECTED_UNIQUE_EYE, (
        f'Expected {EXPECTED_UNIQUE_EYE} unique eye patches, got {len(eye_unique)}'
    )

    # Verify exact action timeline intervals (0-indexed at 30 fps)
    paw_active = [i for i, idx in enumerate(paw_frame_map) if idx >= 0]
    eye_active = [i for i, idx in enumerate(eye_frame_map) if idx >= 0]
    assert paw_active == list(range(24, 38)), f'Unexpected paw active frames: {paw_active}'
    assert eye_active == list(range(43, 50)) + list(range(59, 70)), f'Unexpected eye active frames: {eye_active}'
    assert paw_frame_map[0] == -1 and eye_frame_map[0] == -1, 'Frame 0 must be exact P0'
    assert paw_frame_map[-1] == -1 and eye_frame_map[-1] == -1, 'Frame 116 must be exact P0'

    # Pack all 17 lossless patches into patches.png without scaling or resampling
    paw_w, paw_h = PAW_BOX[2] - PAW_BOX[0], PAW_BOX[3] - PAW_BOX[1]  # 204 x 159
    eye_w, eye_h = EYE_BOX[2] - EYE_BOX[0], EYE_BOX[3] - EYE_BOX[1]  # 245 x 84
    eye_cols = 6
    eye_rows = (len(eye_unique) + eye_cols - 1) // eye_cols  # 2

    atlas_w = max(len(paw_unique) * paw_w, eye_cols * eye_w)  # max(1020, 1470) = 1470
    atlas_h = paw_h + eye_rows * eye_h  # 159 + 168 = 327
    atlas = Image.new('RGB', (atlas_w, atlas_h), (0, 0, 0))

    paw_tiles: list[list[int]] = []
    for idx, patch in enumerate(paw_unique):
        x, y = idx * paw_w, 0
        atlas.paste(patch, (x, y))
        paw_tiles.append([x, y])

    eye_tiles: list[list[int]] = []
    for idx, patch in enumerate(eye_unique):
        r, c = divmod(idx, eye_cols)
        x, y = c * eye_w, paw_h + r * eye_h
        atlas.paste(patch, (x, y))
        eye_tiles.append([x, y])

    patches_path = ROOT / 'patches.png'
    atlas.save(patches_path, format='PNG', optimize=True)

    # Write atlas.js (pure global assignment for direct file:// compatibility)
    atlas_data = {
        'width': SIZE[0],
        'height': SIZE[1],
        'fps': FPS,
        'frames': FRAMES,
        'duration': DURATION,
        'pawBox': [PAW_BOX[0], PAW_BOX[1], paw_w, paw_h],
        'eyeBox': [EYE_BOX[0], EYE_BOX[1], eye_w, eye_h],
        'pawTiles': paw_tiles,
        'eyeTiles': eye_tiles,
        'pawFrames': paw_frame_map,
        'eyeFrames': eye_frame_map,
    }
    atlas_js = (
        '// Generated by building-motion/prepare.py. Do not edit by hand.\n'
        'window.BUILDING_ATLAS=' + json.dumps(atlas_data, separators=(',', ':')) + ';\n'
    )
    atlas_js_path = ROOT / 'atlas.js'
    atlas_js_path.write_text(atlas_js, encoding='utf-8')

    # Re-read patches.png from disk and verify 117/117 reconstructed frames match 0-diff
    with Image.open(patches_path) as im:
        disk_atlas = im.convert('RGB')
    assert disk_atlas.size == (atlas_w, atlas_h)

    for i in range(FRAMES):
        reconstructed = p0.copy()
        p_idx = paw_frame_map[i]
        if p_idx >= 0:
            sx, sy = paw_tiles[p_idx]
            reconstructed.paste(disk_atlas.crop((sx, sy, sx + paw_w, sy + paw_h)), (PAW_BOX[0], PAW_BOX[1]))
        e_idx = eye_frame_map[i]
        if e_idx >= 0:
            sx, sy = eye_tiles[e_idx]
            reconstructed.paste(disk_atlas.crop((sx, sy, sx + eye_w, sy + eye_h)), (EYE_BOX[0], EYE_BOX[1]))
        diff_bbox = ImageChops.difference(reconstructed, direct_frames[i]).getbbox()
        assert diff_bbox is None, f'Reconstruction mismatch on frame {i}: diff bbox {diff_bbox}'

    print(
        f'OK: packed {len(paw_unique)} paw + {len(eye_unique)} eye unique patches '
        f'into patches.png ({atlas_w}x{atlas_h}, {patches_path.stat().st_size} bytes)'
    )
    print(f'Verified 117/117 reconstructed frames match direct lossless composition with 0 differing pixels.')
    for rel in ['p0.png', 'source/forepaw.apng', 'source/eyes.apng', 'patches.png', 'atlas.js']:
        print(f'  {sha256_file(ROOT / rel)}  {rel}')


if __name__ == '__main__':
    main()
