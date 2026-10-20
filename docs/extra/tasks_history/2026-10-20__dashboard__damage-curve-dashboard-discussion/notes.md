# Notes — damage-curve dashboard discussion, iteration 2 (2026-10-20)

## Chronology

1. Found the first session's folder uncommitted (six files, 2026-10-19 22:47) and the ledger row already added.
2. Loaded the discuss-open-questions skill and its decision-sheet / staged-workflow references; read all six
   files, the discussion template, the Hazard dashboard framing doc and its dashboard `AGENTS.md`.
3. Three read-only surveys in parallel: (a) the Hazard dashboard and every written UI rule in that repo;
   (b) model-gpr principles, the bankability dashboard's UI plan and its task-history lessons; (c) the Digital
   Twin, every other dashboard under `infrasure_git_codes/` and `personal/`, and every UI-principle doc found.
4. Wrote and ran `evidence/2026-10-19_catalogue_counts.py` (counts at `92ad156`).
5. Claude in Chrome not connected → asked → built-in browser. Opened six references; ran the Hazard dashboard
   (`npm --prefix … run dev`, :3000, local `dashboard/data/`) and the Digital Twin (`python3 -m http.server`
   on `dist/`, :4173) through `.claude/launch.json` (gitignored); viewed at 1440 × 900; captured two Hazard
   PNGs with headless Chrome.
6. Wrote `06_look_and_usability.md` and `evidence/2026-10-20_visual_pass.md`; updated `02`, `03`, `05`, the
   node README (iteration 2, G10–G12, rulings table, the process) and the discussion ledger.
7. The owner ruled all twelve gates on the recommendation (2026-10-20) with three directions (local first,
   feedback on running software, represent the chain). Iteration 3: wrote and ran
   `evidence/2026-10-20_chain_inventory.py`; wrote `07_derivation_chain.md`; created the plan folder
   (`README`, `decisions.md` DCD-D01…D16, `assumptions.md`); promoted the principle to
   `Hazard_modeling/docs/principles/` with a README row; linked it from `AGENTS.md` and corrected two repo-map
   rows; wrote `docs/extra/discussion/2026-10-20_repo_observations.md`; settled the node; updated both ledgers.

## Findings worth keeping

- **The house already has the UI rules; they live in five places.** model-gpr `docs/principles/analytical_ui.md`
  and `ui/*.md` (promoted 2026-09-04), renewablesinfo `ui_design.md`, the Hazard framing doc §6 plus six code
  comments and several principle files, the twin's `decisions.md`, and gt-twin's README. None is reachable
  from `damage_modeling/AGENTS.md`. There is **no written rule for drawing a damage curve or an evidence mark**.
- **The Hazard dashboard's finish, measured:** tokens in `app/globals.css` (zinc neutrals, `--accent #2563eb`,
  state pairs), Geist + Geist Mono, no custom type scale (`text-[10px]` ×159, `text-[11px]` ×101 in the
  components), card titles 11 px uppercase muted, `Card = rounded-lg border border-border bg-card`, drawers
  460–560 px with `shadow-2xl`, a five-tile KPI row, a 3/5 + 2/5 grid, URL state through `router.replace` (16
  occurrences), 14 test files / 49 cases. No shadcn or Radix despite the framing doc's lean.
- **The product tokens are a different family** (oklch neutrals, Inter, brand green in model-gpr's
  `apps/cash_flow`, the twin, PowerUp, renewablesinfo). G3 is a real choice between two existing token sets.
- **model-gpr's rejections are the review bar:** the first cash-flow UI was rejected on theme, typography,
  spacing, headings and information priorities after passing build and numerical checks; later rounds were
  rejected for unboxed facts, nested wrappers, an empty right side, raw source paragraphs, verbose cards and
  whitespace. Latency (23–35 s cold) was the main usability limit.
- **Hazard's `model_coverage_is_metadata.md` (2026-10-07)** and model-gpr's October 4 direction say the same
  thing from two sides: a deliberate component scope is not a "partial" warning. The catalogue marks 14 of 21
  cells and bindings partial today; the two meanings need a field (G5).
- **The twin's BESS parts** (`bess-data.js`) carry `hz: { hazard: [level, why] }` per leaf; Hazard's
  `twin_crosswalk.csv` (58 rows: 34 rolled up, 21 excluded optional, 3 context) already maps them to the value
  buckets. The twin has a `.dark` block that nothing applies.
- **Seen in the browser:** IPCC's hexagon-dot-hatch glyph reads at thumbnail size; INL's library is a
  1,022-row table whose rows do not open; GEM's overlay form adds curves one at a time with tags and line
  styles; OWID's footer (source · unit · date range · last updated · next expected update · managed by) is the
  provenance pattern; the DLML Explorer groups hazard → sector → source with counts and a selected-models tray.

- **The chain is followed unevenly.** As named files: 2 of 21 cells complete on the ten core stations
  (Jung A's flood and hurricane real-estate proposals); the four oldest canonical cells 3–4; seven-step audit
  2, pressure test 2, site adapter 0, bounded search log 0; three naming generations. Older cells keep the
  registers in dossier prose and workbook sheets, so the trail needs four presence states, not two.
- The skill bundle validates (`PASS`, 106 files); there is no `.github/` folder although `AGENTS.md` said
  "CI (starter)"; the skill's `registries/seed_cell_registry_from_v2_5.json` is a July seed nothing implements.

## Gotchas met

- `timeout` does not exist on macOS; the validator loop had to drop it.
- Headless Chrome followed the dark system theme and had no WebGL: the map's cell layer is absent in the PNGs.
- The built-in browser pane is 800 × 600 by default; `resize_window` to 1440 × 900 per tab, reset after.
- `datanutrition.org/labels/` (as cited in `02`) is a 404; the page is `/label/`.
- The Hazard dashboard caches `manifest.json` at boot; a re-export needs a dev-server restart (its README).
