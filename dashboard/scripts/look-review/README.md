# Look-review scripts

The measured half of the look review ([`06` §4](../../../docs/extra/discussion/damage_curve_dashboard/06_look_and_usability.md),
gate G10): screenshots, the keyboard walk, the screenshot-escape frames and the speed numbers, all against the
static export. The judged half (does it look intentional, does a cold reader get the answer) stays with people.
The V0 record they produced: [`evidence/3f9d516/REVIEW.md`](../../../docs/plans/damage_curve_dashboard/evidence/3f9d516/REVIEW.md).

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

**The first V1 step (the two battery cells drawn)** used the same scripts with its own route and speed files,
against the static export served on another port (`npm run start -- 3411`):

```bash
B=http://localhost:3411; RAW=/tmp/look-review-v1 && mkdir -p $RAW
node scripts/look-review/shoot.mjs $B $RAW "$(cat scripts/look-review/routes.v1-battery.json)"
node scripts/look-review/shoot.mjs $B $RAW '[{"name":"5_library","path":"/"},{"name":"6_asset_bess","path":"/assets/bess"},{"name":"7_review_v0","path":"/v0"}]' --1440-only
node scripts/look-review/shoot.mjs $B $RAW '[{"name":"8_greyscale_cell_tc_bess","path":"/cells/tropical_cyclone_wind_bess","waitFor":"main canvas"},{"name":"8_greyscale_cell_wildfire_bess","path":"/cells/wildfire_bess","waitFor":"main canvas"}]' --grey --1440-only --light-only --only-viewport
node scripts/look-review/scrolled.mjs $B $RAW "$(cat scripts/look-review/routes.v1-battery.json)"
node scripts/look-review/keywalk.mjs $B "Hurricane wind × Battery storage" BESS_SEPARATE_PCS_TC_PROXY_V0_1
node scripts/look-review/measure.mjs $B "$(cat scripts/look-review/speed.v1-battery.json)" 7
```

**Iteration 2 (the plain layer, 2026-10-21)** used the same scripts with `routes.iter2.json` and `speed.iter2.json`
against the static export on port 3213 (`PORT=3213 npm run start`; 3211 is the owner's running build). `keywalk.mjs`
walks the new structure: library → tile → the "How this was built" strip (arrow keys) → a step panel (Enter, Escape)
→ the part selector → the curve's own page → ⓘ → close.

```bash
B=http://localhost:3213; RAW=/tmp/look-review-iter2 && mkdir -p $RAW
node scripts/look-review/shoot.mjs $B $RAW "$(cat scripts/look-review/routes.iter2.json)"
node scripts/look-review/shoot.mjs $B $RAW '[{"name":"16_greyscale_cell_flood_bess","path":"/cells/flood_bess","waitFor":"main canvas"},{"name":"16_greyscale_asset_solar","path":"/assets/solar"},{"name":"16_greyscale_library","path":"/"}]' --grey --1440-only --light-only --only-viewport
node scripts/look-review/scrolled.mjs $B $RAW '[{"name":"cell_flood_bess","path":"/cells/flood_bess"},{"name":"cell_hail_solar","path":"/cells/hail_solar"},{"name":"asset_solar","path":"/assets/solar"},{"name":"dossier_pcs","path":"/cells/flood_bess/curves/BESS_PCS_INUNDATION_PROXY"}]'
node scripts/look-review/keywalk.mjs $B
node scripts/look-review/measure.mjs $B "$(cat scripts/look-review/speed.iter2.json)" 7
cd .. && .venv/bin/python dashboard/scripts/look-review/quantize.py $RAW docs/plans/damage_curve_dashboard/evidence/<commit> <commit>
```

**The owner's review of iteration 3 (2026-10-21)** used `routes.iter3-review.json`, then `routes.iter3-review-full.json`
for the full-screen view (viewport only), and `picture.mjs` for the coverage picture. `keywalk.mjs` now walks the
cell page in its order: the four steps come before the part selector (`DCD-D33`). The record is
[`evidence/5db1b4b/REVIEW.md`](../../../docs/plans/damage_curve_dashboard/evidence/5db1b4b/REVIEW.md).

```bash
B=http://localhost:3211; RAW=/tmp/look-review-5db1b4b && mkdir -p $RAW
node scripts/look-review/shoot.mjs $B $RAW "$(cat scripts/look-review/routes.iter3-review.json)"
node scripts/look-review/shoot.mjs $B $RAW "$(cat scripts/look-review/routes.iter3-review-full.json)" --only-viewport
node scripts/look-review/picture.mjs $B
node scripts/look-review/keywalk.mjs $B
cd .. && .venv/bin/python dashboard/scripts/look-review/quantize.py $RAW docs/plans/damage_curve_dashboard/evidence/<commit> <commit>
```

| Script | Check (06 §4) | What it does |
|---|---|---|
| `shoot.mjs` | 1 Screens, 2 Greyscale | Each route at 1440 × 900 and 1024 × 768, light and dark, viewport and full page; theme set both ways (`prefers-color-scheme` and next-themes' stored key); `--grey` applies a greyscale filter before capture |
| `scrolled.mjs` | 3 Screenshot escape | Scrolls each route to its middle and bottom at both widths, captures the frame and reports whether the sticky rail is in it |
| `keywalk.mjs` | 4 Keyboard | Library → a tile (default Flood × Battery storage) → the four steps of *How this curve was made* by arrow keys → a step panel (Enter, Escape) → the part selector → the curve's own page (default the PCS) → ⓘ → close, keys only; prints the focused element and its computed outline per step |
| `picture.mjs` | The coverage picture (`DCD-D21`, `D34`) | Every asset type's block and plant views: the model loads with no console error, the six tools are there, the picture and the list end level, each curve part has its miniature; a table click writes `?hazard=` and `?sel=`, selects the system and keeps the whole model in view; full screen opens and Esc closes it |
| `measure.mjs` | 8 Speed | Seven cold runs per page at no throttle and at 4× CPU slowdown; *usable* = hydrated (the theme toggle is a real button) and, on plot pages, the plot's canvas exists |
| `quantize.py` | 1 Screens | 128 colours without dithering and the commit in every file name (needs the repo venv's Pillow) |
