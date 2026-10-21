#!/usr/bin/env python3
"""Shrink look-review screenshots for the repository: 128 colours, no dithering (text stays crisp), and the
commit in every file name (06 §4 check 1). Needs Pillow (in the repo venv through matplotlib).

    .venv/bin/python dashboard/scripts/look-review/quantize.py <raw_dir> docs/plans/damage_curve_dashboard/evidence/<commit> <commit>
"""
import sys
from pathlib import Path

from PIL import Image

raw, dst, commit = Path(sys.argv[1]), Path(sys.argv[2]), sys.argv[3]
dst.mkdir(parents=True, exist_ok=True)
for src in sorted(raw.glob("*.png")):
    im = Image.open(src).convert("RGB").quantize(colors=128, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE)
    im.save(dst / f"{commit}_{src.name}", optimize=True)
    print(dst / f"{commit}_{src.name}")
