# Notes — damage-curve dashboard, V0 build (2026-10-20)

## Chronology (commits on `claude/dashboard-v0-5d463c`)

1. `05188ae` — the occurrence register home (`docs/evidence/occurrence/`), its slug list, eight battery
   registers and search-log stubs seeded by `scripts/dashboard/seed_occurrence_register.py`; the catalogue's
   `occurrence_register` and `left_out` fields; `CATALOGUE.md` rebuilt.
2. `2f032d8` — Phase 0: `scripts/dashboard/build_dashboard_data.py` and `dashboard_build/`, every check, the
   receipt.
3. `9ac5044` — Phase 1: the Next.js app (library, battery asset view, cell page with the trail, dossier,
   occurrence page, `/code/` resolver).
4. `d7fc8bf`, `89cc801` — fixes from walking the app in the built-in browser: keyboard focus after a drawer
   closes and after a page change, URL state that survives prerendering, gap pages, the dossier rail,
   collapsible cards, one row per evidence claim.
5. First capture pass at `89cc801`; the palette validator; the speed runs; the keyboard path by hand.
6. `main` gained PR #4 (the two battery evaluators). `2f45e2a` added the guard (decision D8).
7. `ea5a54f`, `f98cc44` — copy fixes found in the first pass; `289147c` — the look-review scripts.
8. Second capture pass at `289147c`; `3f9d516` — three more fixes (capability values cut mid-word, a doubled
   *not run*, field rows named by key).
9. Final capture pass at `3f9d516`, committed as `6a74807` with `REVIEW.md`.
10. `06260af` — the portable Hazard lookup; `473e204` — the READMEs; then this entry, the plan's state and the
    PR.

## Measurements (at `3f9d516`)

| What | Value |
|---|---|
| Catalogue entries · curves declared · drawn · listed *no evaluator* | 25 · 104 · 94 · 10 |
| Known answers declared · run · reproduced · not run (with a reason) | 1,884 · 1,748 · 1,748 · 136 |
| Pins checked | 45, all equal |
| Unresolved source IDs (data check) | 22, in three non-battery cells |
| `dashboard/data/` | 147 files, 3.9 MB; the build takes under a second |
| Static export | 166 pages; `next build` about 3 s |
| Evidence folder | 91 PNGs, 6.2 MB after 128-colour reduction |
| Speed, worst of 7 cold runs at a 4× slower CPU | library 352 ms · cell page 673 ms · dossier 608 ms (budgets 1,000 / 1,500 / 1,500) |
| Displayed numbers traced to files | 30 of 30 |
| Repository checks on this branch | catalogue validator: 25 entries, 0 problems · `CATALOGUE.md` up to date · `pytest tests`: 19 passed |

## Gotchas met

- **The venv lives in the main checkout.** A worktree has no `.venv`; run
  `<main checkout>/.venv/bin/python …` from the worktree root.
- **`~/.npm` is root-owned on this Mac**, so `npm install` fails with `EACCES` unless given `--cache` on a
  writable folder.
- **Headless Chrome and themes.** next-themes reads its stored key before the media query, so a capture must
  set both `prefers-color-scheme` and the `theme` key; otherwise half the "dark" shots come out light.
- **ECharts colours** are read from CSS variables after the theme class flips (one animation frame later), or
  a theme switch leaves the old palette on the canvas.
- **Prerendering and URL state.** In a static export `useSearchParams` needs a Suspense boundary, and the
  prerendered HTML then holds only the fallback; `useSyncExternalStore` over `location.search` renders the
  default on the server and the URL's state on the client.
- **Functions cannot cross the server/client boundary**: the trail receives the GitHub blob base as a string,
  and helpers the server needs live in `lib/plot-utils.ts`, not in a client component.
- **A permission hook holds `rm` commands**; scratch output went to fresh folders instead of being deleted.
- **`puppeteer-core` 23** pulls `extract-zip` and `basic-ftp` with high-severity advisories; it is installed
  with `--no-save` for the look review only.
- **The palette validator** (`dataviz` skill, `validate_palette.js`) checks neighbouring pairs by default;
  `--pairs all` is stricter, and no five-colour set found passes it in either theme.

## Data realities reported, not fixed

- 22 source-ID references do not resolve in their own cell's register: `tropical_cyclone_wind_wind` 10,
  `wildfire_solar` 10, `tropical_cyclone_wind_solar` 2. They are shown on the library's check strip and in
  each cell's evidence card.
- 136 known answers are not run, each with its reason in the receipt: 104 in the two battery cells without an
  evaluator, the rest prose assertions or request-contract tests that belong to the cells' own validators.
- No battery bucket has been searched for field reports; every register row is `not_searched`.
