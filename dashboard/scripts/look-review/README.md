# Look-review scripts

The measured half of the look review ([`06` §4](../../../docs/extra/discussion/damage_curve_dashboard/06_look_and_usability.md),
gate G10): screenshots, the keyboard walk, the screenshot-escape frames and the speed numbers, all against the
static export. The judged half (does it look intentional, does a cold reader get the answer) stays with people.
The V0 record they produced: [`evidence/89cc801/REVIEW.md`](../../../docs/plans/damage_curve_dashboard/evidence/89cc801/REVIEW.md).

They drive the system Chrome through `puppeteer-core`, which is **not** a dashboard dependency: its download
chain carries high-severity advisories (`extract-zip`, `basic-ftp`), so it is installed on demand and never
saved. Set `CHROME_PATH` if Chrome is not at the macOS default.

```bash
cd dashboard
npm run build && npm run start                        # static export on http://localhost:3211 (leave running)
npm install --no-save puppeteer-core@23.11.1          # in a second terminal; not written to package.json
RAW=/tmp/look-review && mkdir -p $RAW
node scripts/look-review/shoot.mjs http://localhost:3211 $RAW "$(cat scripts/look-review/routes.v0.json)"
node scripts/look-review/shoot.mjs http://localhost:3211 $RAW '[{"name":"7_greyscale_library","path":"/"}]' --grey --1440-only --light-only --only-viewport
node scripts/look-review/scrolled.mjs http://localhost:3211 $RAW '[{"name":"cell_flood_bess","path":"/cells/flood_bess?open=all"}]'
node scripts/look-review/keywalk.mjs http://localhost:3211
node scripts/look-review/measure.mjs http://localhost:3211 "$(cat scripts/look-review/speed.v0.json)" 7
cd .. && .venv/bin/python dashboard/scripts/look-review/quantize.py $RAW docs/plans/damage_curve_dashboard/evidence/<commit> <commit>
```

| Script | Check (06 §4) | What it does |
|---|---|---|
| `shoot.mjs` | 1 Screens, 2 Greyscale | Each route at 1440 × 900 and 1024 × 768, light and dark, viewport and full page; theme set both ways (`prefers-color-scheme` and next-themes' stored key); `--grey` applies a greyscale filter before capture |
| `scrolled.mjs` | 3 Screenshot escape | Scrolls each route to its middle and bottom at both widths, captures the frame and reports whether the sticky rail is in it |
| `keywalk.mjs` | 4 Keyboard | Library → Flood × Battery storage → trail drawer → PCS dossier → ⓘ → close, keys only; prints the focused element and its computed outline per step |
| `measure.mjs` | 8 Speed | Seven cold runs per page at no throttle and at 4× CPU slowdown; *usable* = hydrated (the theme toggle is a real button) and, on plot pages, the plot's canvas exists |
| `quantize.py` | 1 Screens | 128 colours without dithering and the commit in every file name (needs the repo venv's Pillow) |
