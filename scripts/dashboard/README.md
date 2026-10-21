# scripts/dashboard — the dashboard's data build

The one build step behind [`dashboard/`](../../dashboard/README.md): it reads the catalogue, every cell
artifact, the known-answer tests, the source and claim registers, the occurrence register and Hazard's pinned
twin crosswalk, runs the checks, and writes `dashboard/data/` with a receipt. Nothing under `docs/` is written.
Needs the `python3.12` venv (`openpyxl` reads the workbooks for the trail's prose detector).

```bash
.venv/bin/python scripts/dashboard/build_dashboard_data.py           # build; a structural failure writes nothing
.venv/bin/python scripts/dashboard/build_dashboard_data.py --check   # run every check, write nothing
```

| File | What |
|---|---|
| `build_dashboard_data.py` | The command line: runs the build, prints the failed checks, exits 1 if any check fails |
| `dashboard_build/build.py` | Assembles every JSON the app reads and runs the checks listed in the [dashboard README](../../dashboard/README.md#the-build-checks) |
| `dashboard_build/catalogue.py` | Loads the 25 catalogue entries and checks their pins |
| `dashboard_build/sampling.py` | Samples each curve through the cell's own evaluator in `scripts/reference_helpers/`, reproduces its known answers, or lists it *no evaluator* (G9) |
| `dashboard_build/chain.py` | The ten-station derivation trail: files first, then dossier headings and workbook sheets, else *not yet detected* |
| `dashboard_build/registers.py` | Reads source, claim and parameter registers across their header variants |
| `dashboard_build/occurrence.py` | The occurrence register, the bucket values and the twin crosswalk pin |
| `dashboard_build/summaries.py` | The plain first line of each screen |
| `dashboard_build/common.py` | Paths, formats and the fixed honest-state sentences (discussion `06` §2.4) |
| `seed_occurrence_register.py` | Seeds `docs/evidence/occurrence/<asset>/<hazard>.{json,md}` with every bucket *not searched* and the Digital Twin's leads; never overwrites a searched row or an existing log |
