# Notes — notebook coverage re-measure (2026-10-20)

## Environment

| Item | Value |
|---|---|
| Interpreter | `/Users/divy/code/work/infrasure_git_codes/damage_modeling/.venv/bin/python` → Python 3.12.12 (the main checkout's venv; this worktree has none) |
| Jupyter stack | nbconvert 7.17.1 · nbclient 0.11.0 · ipykernel 7.3.0 · nbformat 5.10.4 · jupyter_client 8.9.1 |
| Libraries the notebooks import | pandas 3.0.5 · numpy 2.5.1 · matplotlib 3.11.1 · openpyxl 3.1.5 |
| Kernel actually used (probe) | `.venv/bin/python3.12`, `sys.prefix` = the repository venv — only after isolating the kernel lookup (below) |
| Tree | worktree `claude/amazing-elgamal-e5550b` at `4e8cd3a`, clean before and after the runs; `origin/main` had moved to `b824e10` (branch register) |

### Kernel-shadowing gotcha

`jupyter kernelspec list` from the venv showed `python3 → ~/Library/Jupyter/kernels/python3`, whose `kernel.json`
launches `/Users/divy/code/personal/renewablesinfo_org/.venv/bin/python3`. User-level kernelspecs win over the
venv's `share/jupyter/kernels/python3`, so a plain `.venv/bin/jupyter nbconvert --execute` would have run the
notebooks in another project's interpreter. Fix used here, without touching the user's Jupyter config:

```bash
export JUPYTER_DATA_DIR=<empty scratch folder>     # hides ~/Library/Jupyter; the venv kernelspec is found
.venv/bin/jupyter kernelspec list                   # → python3  .venv/share/jupyter/kernels/python3
```

The venv kernelspec's `argv[0]` is the bare `python`, which `jupyter_client` replaces with `sys.executable`, so
the kernel is the venv's Python. A probe notebook printing `sys.executable` confirmed it before the real runs.

## Commands (all outputs outside the repository)

```bash
# from the repository root; S = session scratch folder
export JUPYTER_DATA_DIR=$S/jupyter_data
for nb in $(find notebooks -name '*.ipynb' | sort); do
  .venv/bin/jupyter nbconvert --to notebook --execute --ExecutePreprocessor.timeout=300 \
    "$nb" --output-dir "$S/executed" --output "$(echo $nb | sed 's#notebooks/##; s#/#__#g; s#.ipynb##')"
done
# a failing notebook was re-run once with --allow-errors to capture the first error output (diagnostic only)
git status --porcelain      # empty before and after
```

The driver that timed each run (`time.perf_counter()` around the `nbconvert` subprocess) and the extractor that
read the identity outputs live in the session scratch folder, not in the repository.

## Per-notebook results

| Notebook | Executes | First failing cell | Error | Identity printed | Wall (s) |
|---|---|---|---|---|---|
| `convective_wind/real_estate/00` | yes | — | — | `convective_wind_real_estate` · `CONVECTIVE_WIND_REAL_ESTATE_EF_SCREENING_V0_1` · model v0.1 / docs r1 · scaffold / proposed · canonical `False` · grade `screening_expert_elicited_damage_degrees_priced_by_damage_state` · no SHA | 9.8 |
| `convective_wind/real_estate/01` | yes | — | — | same | 5.4 |
| `flood/real_estate/00` | yes | — | — | `flood_real_estate` · `FLOOD_REAL_ESTATE_HAZUS_NACCS_SCREENING_V0_2` · model v0.2 / docs r1 · scaffold / proposed · canonical `False` · grade `screening_source_native_adopted_tables` · no SHA | 5.8 |
| `flood/real_estate/01` | yes | — | — | same | 7.5 |
| `flood/solar/00` | **no** | `cells[2]` = first code cell | `RuntimeError: Could not find damage_modeling repo root.` | — | 8.8 |
| `flood/solar/01` | **no** | `cells[2]` = first code cell | `RuntimeError: Could not find damage_modeling repo root from current working directory.` | — | 8.1 |
| `hail/real_estate/00` | yes | — | — | `hail_real_estate` · `HAIL_REAL_ESTATE_ROOF_THRESHOLD_SCREENING_V0_1` · model v0.1 / docs r1 · scaffold / proposed · canonical `False` · grade `screening_material_threshold_component_curves` · no SHA | 3.0 |
| `hail/real_estate/01` | yes | — | — | same | 3.3 |
| `hail/solar/00` | **no** | `cells[2]` = first code cell | `RuntimeError: Could not find damage_modeling repo root.` | — | 2.6 |
| `hail/solar/01` | **no** | `cells[2]` = first code cell | `RuntimeError: Could not find damage_modeling repo root from current working directory.` | — | 3.2 |
| `tropical_cyclone_wind/real_estate/00` | yes | — | — | `tropical_cyclone_wind_real_estate` · `TROPICAL_CYCLONE_WIND_REAL_ESTATE_HAZUS_SCREENING_V0_2` · model v0.2 / docs r1 · scaffold / proposed · canonical `False` · grade `screening_source_native_adopted_tables` · no SHA | 3.2 |
| `tropical_cyclone_wind/real_estate/01` | yes | — | — | same | 2.8 |
| `wildfire/real_estate/00` | yes | — | — | `wildfire_real_estate` · `WILDFIRE_REAL_ESTATE_WRC_FSIM_SCREENING_V0_1` · model v0.1 / docs r1 · scaffold / proposed · canonical `False` · grade `screening_agency_response_function_with_inspection_building_factors` · no SHA | 2.8 |
| `wildfire/real_estate/01` | yes | — | — | same | 2.6 |

- `cells[2]` is the 0-based index into the notebook's cell list (two markdown cells precede it); it is the
  notebook's first code cell, the loader. The failure is the same one recorded on 2026-08-26.
- Wall time is the whole `nbconvert` process including kernel start; the first notebook of the batch carries a
  warm-up. Every notebook is far inside the contract's two-minute budget.
- No executed notebook carries an error output anywhere (`--allow-errors` was only needed for the four solar
  ones, where every later cell then fails on the undefined `REPO_ROOT`).

## Lead artifacts — identity and SHA-256 (computed by this session; no notebook prints one)

| Cell | Artifact the notebooks read | Bundle | Units / records | sha256 |
|---|---|---|---|---|
| `hail_solar` | `docs/cells/hail_solar/current/hail_solar__model_v1_0__docs_r7__curve_artifact.json` (the notebooks pin r5 instead) | v2 | 1 / 3 | `8c52f3442eb606f55aa0502fbb2738df70076f8a181de463c029061020b3cf32` |
| `flood_solar` | `docs/cells/flood_solar/current/flood_solar__model_v1_0__docs_r4__curve_artifact.json` (the notebooks pin r3 instead) | v2 | 8 / 8 | `a08e77ef034e1ecea3e7cd05d13c825921b54d610fca9de8651ebda8e857082d` |
| `flood_real_estate` | `docs/cells/flood_real_estate/proposed/flood_real_estate__model_v0_2__docs_r1__curve_artifact.json` | v3 · 1 pathway | 2 (1 withheld) / 7 | `99fe3f1f6430caada7943a4a83fe74a2f94895c8c454d7789fda97fabfafe9af` |
| `tropical_cyclone_wind_real_estate` | `docs/cells/tropical_cyclone_wind_real_estate/proposed/tropical_cyclone_wind_real_estate__model_v0_2__docs_r1__curve_artifact.json` | v3 · 1 pathway | 2 (1 withheld) / 20 | `99487ff5812e6b1017eeaaeea14d469bcb15ae2265e9d6cf107ce5ca41c85753` |
| `convective_wind_real_estate` | `docs/cells/convective_wind_real_estate/proposed/convective_wind_real_estate__model_v0_1__docs_r1__curve_artifact.json` | v3 · 2 pathways | 2 (1 withheld) / 6 | `e676fb077ca3fb96a1d0efce7b1e408c2a82265ec97ea2eb4ebbef7e5aeeef3d` |
| `hail_real_estate` | `docs/cells/hail_real_estate/proposed/hail_real_estate__model_v0_1__docs_r1__curve_artifact.json` | v3 · 1 pathway | 4 (2 withheld) / 6 | `52cf865d4dfb8b4c593736fb05b5d3e7c341bad2a2441b89499d7e88605fef20` |
| `wildfire_real_estate` | `docs/cells/wildfire_real_estate/proposed/wildfire_real_estate__model_v0_1__docs_r1__curve_artifact.json` | v3 · 1 pathway | 2 (1 withheld) / 3 | `6b7c771d88b46d60e2c0b1339009ab06753f93f6376e8c8f30e40c91f31474ee` |

None of the five Real Estate cells is in `docs/contracts/machine_readable_artifact_index.json`; none has a
`current/` folder; each has a known-answer-test file beside the proposal in `proposed/`.

## Observations worth carrying (not acted on — measure only)

1. The Real Estate notebooks resolve the repo root as "first ancestor with `docs/cells` and
   `scripts/reference_helpers`" and name the proposed artifact explicitly — the proposal-cell loader rule — but
   print no SHA-256 and no `schema_version`; the contract's identity block (Rule 2) asks for both.
2. The hail/solar `00` notebook embeds a source register with public URLs as data; nothing in any notebook
   opens a network connection, imports from the Hazard symlink, or reads `docs/source_drops/extracted/`.
3. `notebooks/**/outputs/` is tracked and the notebooks regenerate it deterministically; a repair session can
   rely on `git status` to tell a changed figure from a re-rendered one.
4. `main` moved to `b824e10` (branch register, four more observations) after this branch was cut; the only file
   both touch is `AGENTS.md`, in different hunks.
