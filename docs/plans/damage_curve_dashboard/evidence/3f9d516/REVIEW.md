<!--
author: owner-directed (Divy) · agent-drafted
created: 2026-10-20
updated: 2026-10-20
status: proposed
scope: The look review (discussion 06 §4, gate G10) of the dashboard's V0 battery-storage slice at receipt commit 3f9d516 — the screenshot set, the greyscale, screenshot-escape, keyboard, copy and theme checks, the measured speed, the number spot-check, what was fixed during the review and what is left for the owner — for the owner's acceptance (check 9).
-->

# V0 look review — battery storage slice at `3f9d516`

This folder is the evidence for the look review of [`06` §4](../../../../extra/discussion/damage_curve_dashboard/06_look_and_usability.md)
for the first slice of the [dashboard plan](../../README.md). Seven of the nine checks pass. The cold read
(check 7) has not been run: it needs a named person who has not read node `06`. The owner's review (check 9) is
open, and nothing merges to `main` before it ([`DCD-D10`](../../decisions.md#dcd-d10--look-sign-off-per-slice)).

| # | Check | Verdict | Evidence here |
|---|---|---|---|
| 1 | Screens | **pass** | 91 PNGs; eight per screen for eight screens, plus supporting views |
| 2 | Greyscale | **pass** | `3f9d516_7_greyscale_*` |
| 3 | Screenshot escape | **pass** | `3f9d516_13_escape_*`, `escape.json` |
| 4 | Keyboard | **pass**, one note for the owner | `keywalk.json` |
| 5 | Copy | **pass**, three questions for the owner | the fixed-sentence table below |
| 6 | Themes | **pass** as far as the builder can judge | every screen in both themes; `10_*`, `14_*` |
| 7 | Cold read | **not run** | needs a named reader |
| 8 | Speed | **pass** | `speed.json` |
| 9 | Owner review | **open** | this folder and the running app |

Every displayed number traced in the plan's spot-check (*"spot-check 20 per slice"*) matches its file: **30 of
30**, in `spot_check_numbers.txt`, produced by `spot_check_numbers.py` with its own code, not the build's.

## How the set was made

- **The build.** The data were rebuilt from a clean tree at `3f9d516`; the receipt (`dashboard/data/receipt.json`)
  says so and every page header says `built 3f9d516`. The static export (`npm run build`) was served by
  `dashboard/scripts/serve-static.mjs` on `localhost:3211`.
- **The captures.** Headless Chrome 155 driven by puppeteer-core 23.11.1 through
  [`dashboard/scripts/look-review/`](../../../../../dashboard/scripts/look-review/README.md). Each theme was
  set both ways (the `prefers-color-scheme` media feature and next-themes' stored key), at device scale 1 with
  reduced motion. The PNGs were reduced to 128 colours without dithering: 91 files, 6.2 MB.
- **WebGL.** Headless Chrome lacks WebGL (`DCD-A12`). The plots use ECharts' canvas renderer, so nothing here
  depends on it.
- **File names.** `3f9d516_<n>_<screen>__<width>x<height>__<theme>[__full|__grey|__middle|__bottom].png`.
  *Eight per screen* means two widths × two themes × the viewport and the full page.

| # | Screen | Route | Images |
|---|---|---|---|
| 1 | Library | `/` | 8 |
| 2 | Battery asset view | `/assets/bess` | 8 |
| 3 | Flood × Battery storage, the cell page | `/cells/flood_bess` | 8 |
| 4 | Separate PCS, the curve dossier | `/cells/flood_bess/curves/BESS_PCS_INUNDATION_PROXY` | 8 |
| 5 | Hail × Battery storage, the occurrence page | `/occurrence/bess/hail` | 8 |
| 6 | The `/code/` resolver, version not found | `/code/BESS_FLOOD_INUNDATION_SCREENING_V1?v=model_v0_9__docs_r1` | 8 |
| 9 | Hurricane wind × Battery storage, *Not drawn* | `/cells/tropical_cyclone_wind_bess` | 8 |
| 9 | Wildfire × Battery storage, *Not drawn* | `/cells/wildfire_bess` | 8 |
| 7 | Greyscale: library, cell page, asset view | 1440, light | 3 |
| 8 | The cell page with every card open (`?open=all`) | 1440, both themes, viewport and full page | 4 |
| 10 | The trail drawer open on Evidence (`?station=evidence`) | 1440, both themes | 2 |
| 11 | A gap cell page (Hail × Battery storage) | 1440, both themes | 2 |
| 12 | The library under the Evidence lens; the asset view with a bucket's twin nodes open | 1440, both themes | 4 |
| 13 | Scrolled frames for the screenshot-escape check | both widths, light | 10 |
| 14 | The ⓘ popover open on the dossier | 1440, both themes | 2 |

## 2 · Greyscale

The browser applied `filter: grayscale(1)` before each capture. On the library every tile kind still reads:
live tiles have a solid border and ■, proposals an outline and ▢, reused bindings a hatch and ▨, gaps a dashed
border and ┈, and the one failed build check reads by its ✕. On the cell page the three curves read as a solid
line, a dashed line and a pale band beneath the solid line (the band marks a curve identical to the first);
defining knots are filled and known answers hollow; the uncovered share of value is hatched. On the asset view
every slot reads by its mark (■ ┈ ✕ ◔ ?) and the H/M/L lead letters.

## 3 · Screenshot escape

Each screen was scrolled to its middle and its bottom at both widths and captured. The sticky rail stayed in
every frame.

| Screen | Scrolls by, at 1440 / 1024 | In every frame |
|---|---|---|
| Library | 0 / 0 px | the title row with `built from catalogue at 3f9d516` |
| Asset view | 0 / 0 px | the header with the reference value and its binding file |
| Cell page, every card open | 3,829 / 4,853 px | the status rail and identity line |
| Dossier | 167 / 905 px | the status rail and identity line |
| Occurrence page | 0 / 80 px | the rail with the register path and its SHA |
| Resolver | 0 / 0 px | no rail; the damage code and version are its second line |

A crop smaller than one screen, such as the plot cut out alone, cannot be held to this rule.

## 4 · Keyboard

`keywalk.mjs` walked the path with keys only, in both themes, and read the focused element and its computed
outline at every step. The same path had been walked by hand in the app's browser pane earlier in the build.

| Step | Keys | Focus lands on |
|---|---|---|
| Library | Tab ×18 | The first tile, named *Hail × Solar farm, live, partial, shape T2, cost T2, not searched* |
| | ArrowDown ×4, ArrowRight ×1 | The Flood × Battery storage tile |
| Cell page | Enter | The page's main region |
| | Tab ×3 | The Scope station of the trail |
| | ArrowRight ×3 | The Evidence station |
| Station drawer | Enter | The drawer's Close button; the URL gains `?station=evidence` and the Evidence card opens |
| | Escape | Back on the Evidence station |
| Curve link | Tab ×14 | The `BESS_PCS_INUNDATION_PROXY` link in the parts list |
| Dossier | Enter | The page's main region |
| ⓘ | Tab ×2 | The *Tier and state definitions* ⓘ button |
| | Enter | The same button, expanded, with its popover shown |
| | Escape | The same button, collapsed |

Every control showed the 2 px accent ring: computed outline `solid 2px rgb(37, 99, 235)` in light and
`rgb(91, 141, 239)` in dark, with `:focus-visible` true.

**Note for the owner.** After a page change the focus moves to the page's main region, as a full page load
would. That region spans the viewport under the sticky header, so its ring is not visible; the next Tab lands
on the first link with the ring. Say if a visible landing mark is wanted.

## 5 · Copy

The state sentences come from one table in the build (`SENTENCES` in
`scripts/dashboard/dashboard_build/common.py`) and reach the pages as data. Each V0 state was read in the
rendered text.

| State | The sentence | Where V0 shows it |
|---|---|---|
| No evaluator | *Not drawn — no reference evaluator for this form in this repository (G9).* | The answer card of the two battery cells without an evaluator (10 curves listed, none drawn); the library's curves figure, after its count |
| Not searched | *Not searched — nobody has looked for field reports yet.* | Every battery bucket on the occurrence page, the cell page's field card and the dossier; the library's field-reports figure |
| No curve | *No curve — ‹part›, ‹$› of the reference value, has no damage response yet.* | The asset view's ✕ slots and the value bars of the three live battery cells |
| Withheld | *Withheld: ‹the artifact's condition›.* | The withheld units of the hurricane and wildfire battery cells |
| None after a search · adjacent only · left out on purpose | — | No V0 data in these states: every battery register row is `not_searched` and nothing is left out |

- **Headings.** No entry ID or routing name is a heading. H1s name the object (*Flood × Battery storage*,
  *Separate PCS*, *Battery storage*); entry and curve IDs appear in mono on tiles, in the identity line, in
  lists and in URLs.
- **The plain first line** is present on every screen. The asset view's reads *Flood, hurricane wind and
  wildfire have curves for batteries, all from transferred or policy evidence (T3–T4); hail and convective
  wind have none; nobody has yet searched for field reports.*, the sentence `06` §2.6 asked for.
- **Owner questions.**
  1. Object names follow `06` §3.2's own example (*Flood × Battery storage*), and asset names are sentence
     case as the catalogue writes them. Two page titles that are not object names are also sentence case:
     *Damage-curve library* and *Resolving a damage code*. Should either be Title Case?
  2. The two battery tiles without an evaluator carry a small *not drawn* tag, whose hover is the fixed
     sentence. `06` §2.4 gives this state no tile form. Keep the tag or drop it?
  3. At 10 px the gap mark ┈ reads close to the left-out mark –. No V0 entry is left out, so they never meet
     yet; the gap tile's dashed border also tells them apart. Keep both glyphs?

## 6 · Themes

Every screen was captured in both themes, and so were the drawer, the ⓘ popover, the plot legend and its end
labels. The series colours proposed in `06` §3.3 failed the dataviz palette validator in both themes and were
replaced before the build's plots were drawn (`DCD-A04`'s trigger).

| Set | Light (surface `#ffffff`) | Dark (surface `#1a1a1e`) |
|---|---|---|
| Proposed in `06` §3.3 | fails: violet↔blue CVD ΔE 2.3 (protan), normal-vision ΔE 12.7 | fails: four of five colours outside the lightness band; violet↔blue CVD ΔE 2.5 |
| Adopted | `#e0662f #2563eb #65a30d #6d28d9 #be123c` — all checks pass on neighbouring pairs, on both surfaces | `#e0662f #5b8def #65a30d #d946ef #e11d48` — all checks pass on neighbouring pairs, on both surfaces |
| Adopted, every pair | fails: orange↔green CVD ΔE 1.3 (deutan); violet↔blue normal-vision ΔE 13.2 | fails: orange↔green CVD ΔE 1.3 (deutan); rose↔orange normal-vision ΔE 11.9 |

Colour never carries a series alone: each of the five slots has its own line style (solid, dashed, dotted,
dash-dot, long dash) and an end label, which is the secondary encoding the validator asks for when a pair sits
below its floor. The V0 battery plots use at most three series. Whether both themes look *intentional* is the
owner's call in check 9; to the builder both read as designed, with state colours only on the review chip and
the build checks.

## 7 · Cold read

Not run. `06` §4 asks for a named person who has not read node `06` to answer *"which hazards affect
batteries, and how sure are we?"* from the asset view in under two minutes, and to say what confused them. The
asset view's first line is written to answer it; the test is whether a cold reader finds and trusts it.

## 8 · Speed

Budget (`06` §2.9): the library within 1 s and a cell page within 1.5 s to usable; the other screens were held
to 1 s. Measured on an Apple M4 laptop (16 GB, macOS 26.1) in headless Chrome 155, against the static export on
localhost at 1440 × 900. Each page was loaded seven times, each in a fresh browser context with a cold cache,
at full speed and at a 4× CPU slowdown. *Usable* means hydrated (the theme toggle has become a real button)
and, on plot pages, the plot's canvas exists.

| Screen | Budget (ms) | Full speed: first paint · usable, median (worst) | 4× slower CPU: first paint · usable, median (worst) |
|---|---|---|---|
| Library | 1,000 | 60 · 78 (104) | 152 · 331 (352) |
| Asset view | 1,000 | 64 · 90 (92) | 204 · 392 (407) |
| Cell page, Flood × Battery storage | 1,500 | 76 · 145 (151) | 208 · 613 (673) |
| Dossier, Separate PCS | 1,500 | 60 · 125 (130) | 160 · 562 (608) |
| Occurrence page | 1,000 | 64 · 86 (105) | 184 · 332 (345) |
| Resolver | 1,000 | 36 · 59 (76) | 96 · 217 (232) |

Every page is prerendered, so there is no spinner. First-paint numbers read from the app's browser pane were
unreliable while the pane sat in the background; these come from headless Chrome.

## 9 · Owner review

Open. Divy accepts or rejects these screenshots and the running app; findings become plan rows (Phase 2).

## Fixed during this review

Two earlier capture passes (at `89cc801` and `289147c`, not kept) found these defects. Each was fixed and the
set was captured again from a clean build.

| Found | Fix | Commit |
|---|---|---|
| The *No curve* sentence repeated the amount on the hurricane and wildfire battery cells: *Civil works ($1.6M), $1.6M of the reference value* | The bracketed amount is dropped from the part name | `ea5a54f` |
| The library's figures typed their own state wording (*10 not drawn — no reference evaluator in this repository yet*) | The card puts a count in front of the fixed sentences | `f98cc44` |
| The proof card cut capability values at 20–40 characters with no ellipsis (*supported with explicit value and exposu*) | Values shown whole and wrapped; EAL and PML on their own rows | `3f9d516` |
| Cells with no known answer run read *20 known answers, not run · 20 not run* | *not run* appears once | `3f9d516` |
| Field-card rows were labelled by bucket key (`electrical_balance`) | Each row carries the asset's bucket label, with the key beneath | `3f9d516` |

## Findings that are not look failures

1. **A data check fails, reported and not loosened.** The `source_ids` check finds 22 references that do not
   resolve in their own cell's source register. The library's check strip shows ✗ *source ids*, the one place
   a state colour marks a failure, and each affected cell's evidence card lists its own.

   | Cell | Unresolved | Example |
   |---|---|---|
   | `tropical_cyclone_wind_wind` | 10 | parameter *V_zero_kmh = 90* → `TCWW-S005` |
   | `wildfire_solar` | 10 | parameter *module state-table ordinates* → `KIEE_JANG_2026_WILDFIRE_PV` |
   | `tropical_cyclone_wind_solar` | 2 | claim `TCWS21-C002` → `TCWS2-S013` |

2. **The two battery evaluators landed on `main` after this branch was cut** (PR #4). At this commit the *Not
   drawn* sentence is true. Commit `2f45e2a` makes the build stop, writing nothing, once an
   `<entry>*_curve_eval.py` exists for a cell listed as having none, so merging `main` forces the sampler to
   draw those cells instead of leaving a false sentence (`DCD-A06`'s trigger).
3. **Digitised source points and the events rug are not built.** No V0 cell carries digitised source points
   (◇) and no field report exists, so the plot has nothing to draw for either; both of `06` §2.1's elements
   wait for data.
4. **Proposal tiles stay outlined under every lens**, as `06` §3.1 specifies, so the Evidence lens tints live
   and reused tiles only (`12_library_lens_evidence`).
5. **At 1024 the trail truncates three station facts** with an ellipsis (*binary step + piecewise…*); the
   full fact is in each station's accessible name and in its drawer.
6. **Two counts the build reports but does not show as checks:** 136 known answers are not run, each with its
   reason in the receipt (104 of them in the two battery cells without an evaluator); and 10 curves are listed,
   not drawn.

## Files in this folder

| File | What |
|---|---|
| `3f9d516_*.png` | The 91 captures |
| `escape.json` | Scroll height and rail-in-frame for each scrolled frame |
| `keywalk.json` | Each keyboard step's focused element, outline and URL, light and dark |
| `speed.json` | The speed runs behind the table above |
| `spot_check_numbers.py` · `.txt` | The 30-number trace from page to file, and its output |
