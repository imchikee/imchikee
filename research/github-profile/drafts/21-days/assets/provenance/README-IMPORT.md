# 21-days hamster animation · ChatGPT asset transfer (read-only staging)

This ZIP is an **asset transfer staging bundle**, NOT a Git commit and NOT an instruction to replace the live Profile. Original ChatGPT Library assets were copied byte-for-byte; only destination filenames in this bundle were normalized. SHA256 sums are for those exact copied bytes.

## Why more than two GIFs?

- `01-core/`: **two static images** (different bytes, distinct roles) and **two requested GIF previews**. These four are the core materials to reconcile with the repository. Keep both static sources separate until their exact roles are confirmed against the current animation frames.
- `02-review-only/`: **four MP4s**, three of them named Candidate A. These are sources/candidates, **not independently user-approved releases**. The acceptance of a 6.4-second GIF never authorizes promotion of an MP4.
- `03-audit/`: historical scripts and evidence. IMPORTANT: `delivery-audit.json` and `build_framed_blink.py` describe another **framed variant**, not the accepted Candidate A GIF. `frame-match-candidate-audit.json` is a static candidate transform only; it does not prove the animation was transformed.

## Already tracked in Git — do not import again

`research/github-profile/drafts/21-days/reading-motion/motion.gif`, blob SHA `83e598ecc5056017cc9d26b7a7704c56b10dc63f`, 2,819,874 bytes; first-act stage-approved. The historically recorded SHA256 is in `SOURCE_MANIFEST.json` (not re-hashed in this run).

## Approved vs identified

- `01-core/first-act-plus-second-act-v3-blink-preview.gif`: **user-approved 6.41-second preview GIF**; smooth chapter transition is not complete; not a final nine-scene Profile export.
- `01-core/second-act-v3-blink-preview.gif`: **user-identified 3.16-second second-act GIF**; no independent acceptance established.
- Static V3 PNG from 2026-11-20 and later user-supplied 2026-11-21 static base **have different hashes and must not be merged**.

## GitHub Profile pipeline (read-only verification)

A profile README embeds GIF/PNG, not playable HTML/MP4. HTML/JS remains the animation preview/authoring environment. Current `export.mjs` captures one still frame per chapter; DO NOT use it to overwrite real-motion assets until corrected and reviewed.

## Codex instructions

1. Extract into an isolated temporary directory **outside the repo**. Run `sha256sum -c SHA256SUMS.txt` from this directory.
2. Read `SOURCE_MANIFEST.json` before copying files; compare hashes against any repository file with the same proposed role.
3. Preserve existing Git-tracked first-act and historical/failed candidates; do not overwrite or delete anything.
4. Recommend canonical repo paths for the four core images/previews and an immutable provenance manifest. Only move a review-only MP4 into tracked canonical production assets if independently approved.
5. Do not merge, commit or push to `main`, modify rendering code, or regenerate GIF/MP4 without explicit approval.

## Important exact hashes

- accepted paired GIF: `2150ac2f6f4faf03ee5d07a512b647db530503684c924985c4b7e42bc89a4f89`
- user-identified second act GIF: `b5ab84edb840f5b38b01d049165e76303d6d9ff0ebfecb1a814bffcdb479e323`

A previously mentioned `46fa7889...` hash for the paired GIF was **incorrect**; the correct SHA256 above was calculated from the exact `(2)` Library file in this run.
