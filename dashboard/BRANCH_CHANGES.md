# Dashboard changes on `dashboard-traceability-completeness`, compared with `main`

This branch reworks the damage-curve dashboard so a reader can follow every number to its source and see what is
complete and what is still open, in plain words. Nothing here is merged into `main` or deployed yet: the live
dashboard still shows `main`.

## Run this branch locally and compare it with the live dashboard

You need Node 22 and access to `aamani-ai/Damage_Modeling`. The dashboard's data are committed on the branch, so
Python is only needed if you want to rebuild them.

1. Get the branch:

   ```bash
   git clone https://github.com/aamani-ai/Damage_Modeling.git
   cd Damage_Modeling
   git checkout dashboard-traceability-completeness
   ```

   In an existing checkout: `git fetch origin` then `git checkout dashboard-traceability-completeness`.

2. Start the dashboard:

   ```bash
   cd dashboard
   npm install
   npm run dev -- -p 3211
   ```

   If `npm install` fails with `EACCES` under `~/.npm`, use another cache: `npm install --cache /tmp/npm-cache`.

3. Open <http://localhost:3211>. A yellow strip at the top says it is a preview of this branch, not `main`.

4. Compare with the live dashboard, which shows `main`: <https://damage-curves-wsd6lcl64q-uc.a.run.app> (sign in
   with an aamani.ai Google account). Open the same page in both, for example the library, **Power plants › Solar
   farm**, or **Hail × Solar farm**.

Optional, to rebuild the data from this branch (needs the repository's `python3.12` venv, see `AGENTS.md`): from the
repository root, `.venv/bin/python scripts/dashboard/build_dashboard_data.py --source worktree`. It prints one
failed data check, `hazard_match`; that is expected (see "Hazard" below).

## What changed

### Words and layout everywhere

- **Plain words.** Statuses read live · proposal · reused · no curve yet (was "gap"). Evidence reads field-calibrated
  · published · borrowed · our judgment. Codes and file names stay one click away, never in the main text.
- **One set of coverage words** across the subsystem table, the 3D model and its table: has a curve · partial · in
  the whole-building curve · no curve yet · no direct damage · changes another curve · not priced by this curve.
  "What the words mean" explains each, and shows only the words on that page.
- **Release status is the curve's status.** Live and reused curves are released for Hazard; proposals are not. The
  separate "in production index" tag is gone.
- **Every fold looks the same** (small upper-case heading, larger arrow) and starts closed where it is secondary:
  What the words mean, the 3D model and its table, the written blocks on a curve page, How the names connect.
- **Sources are links to GitHub** at the commit the data were built from.

### Library (main page)

- Tiles are shaded by status (live white, proposal grey, reused dashed, no curve yet dark grey); one view shows status
  and evidence together; the other views are Value covered and Read by.
- **Value covered** (still in progress; open to review) now says, for every solar, wind, battery and substation tile, how the asset's value splits for
  that hazard, in parts that add up to all of it: *priced* (a curve, or a cost the cell adds in step with the other
  parts' damage) · *partly priced* · *no direct damage* · *not priced*. It is worked out from the profile's value
  budget and each subsystem's state. `main` showed a figure for only 4 tiles and "share not stated" elsewhere. Real
  estate says "no value budget for buildings yet". What the words mean on the library page explains each part.
- **Heat** has a column with the research so far. Icing and lightning are hidden (no curve, no research).
- The header gives the counts; the KPI cards are gone.

### Asset pages (for example Power plants › Solar farm)

- **The header** names the plant in one tag: its value budget where it has one (solar, wind, battery, substation),
  otherwise its profile (the buildings). What the picture shows is said in View by Digital Twin part.
- **The curves** (a fold, open by default): the library's own tiles, one per hazard including heat.
- **The plant behind the dollars** is Hazard's settled reference (`06_settled_reference_design.md`, linked from the
  page): solar 100 MWac / 120 MWdc single-axis tracker, $105.3M; wind twenty 5 MW turbines, $162.3M. The value
  ledger's per-kW prices are multiplied by that plant, not by the ledger's own default size (100 MWdc, 200 MW).
- **Value budgets for solar and wind** (still in progress, with Value covered): the subsystem shares come from the repository's value ledger
  (`docs/method/value_basis/solar_wind_value_breakdown.xlsx`, NREL benchmarks: a 100 MWdc solar plant, a 200 MW wind
  plant), grouped by subsystem with installation labour beside its hardware, as the battery and substation budgets
  are. Before, each row added up its cell's own value lines, so hurricane × solar counted the fixed-tilt and tracker
  lines together (PV modules 66%). A cell's own value lines are now in each row's hover, listed, not added up.
- **Replacement labour** is treated differently by each cell (hail adds it to the modules, hurricane and wildfire let
  it follow the other parts' damage, flood and convective wind leave it out); the subsystem view says so.
- **View by subsystem**: every subsystem (cost bucket) against the hazards. It opens on Hail and has an **All
  hazards** tab. An opened row gives its value share, the cell's own name for the part, its failure unit and subsystem
  code, and its curves in brief, with a link to them on the curve page. The old part-list grid is removed.
- **View by Digital Twin part**: the **3D model** and a **Table** of the twin's systems (folded until opened). The
  table lists the parts each system contains and counts mixed systems ("has a curve for 1 of 2 parts"). Links say
  where the Digital Twin repository defines each asset's breakdown.
- Parts a hazard does not damage by the cell's decision read **no direct damage**, not "no curve yet".
- The 3D model's colour key defines each word with an (i), and the Twin table lists the words it uses with their
  meanings above its rows, for example **changes another curve**: no curve of its own, but its condition (such as
  whether a protection is in place) changes another part's curve.
- In View by subsystem, a curve's **Used by Hazard** tag opens the curve page at its For Hazard footer.

### Curve pages (each hazard × asset, for example Hail × Solar farm)

- **The curve** picks subsystem → part → curve. Curves that share a name say what sets them apart (fixed tilt /
  tracker, fresh / salt water, module type, terrain). It folds (open by default); a "see the curve" link opens it if
  folded.
  - Its "How sure" names the two grades plainly: *damage at each hazard level* and *the dollar value it is applied
    to* (were "how damage rises" and "how it becomes dollars", renamed everywhere), with one line saying loss = damage
    ratio × value.
  - Its **References** line is only a link to the sources in step 3, so they are listed once.
- **How this curve was made**, four steps. Each panel is complete on its own and ends with **Read from:** links to the
  GitHub files it was written from (folded), next to **Details** for reviewers (method checks, source IDs, file
  fingerprints). Each list starts with its count.
  - *What it covers*: its summary counts subsystems as the subsystem table does ("1 of 10 subsystems with a curve · 5
    no curve yet · 4 no direct damage"), with the catalogue's own list in the hover; scope, what it leaves out, open questions, each part as subsystem › part, withheld units named
    in words with their reasons.
  - *How it was derived*: each hazard measure with the parts read against it, the curve shapes, what Hazard has to
    supply; seven-step audits are found wherever the cell keeps them, or an earlier version's is named.
    Hurricane × solar adds an *Open question* line: its pressure-ratio axes do not say how to form them from gusts (the
    ratio or its square); this repository's substation bindings square it.
    Whether a site-condition adapter exists is said once, under the audit, with what one is.
  - *Where the numbers come from*: what we assumed (the cell's judgment calls; where Hazard multiplies a unit by a
    different share, that share is given beside them, as for hail × solar's 35.5% against the curve file's 26%), then the sources and the parameters,
    each list starting with its count ("21 sources (1 with no link…)", "8 parameters (4 published, 2 borrowed, 2 our
    judgment)"). Each parameter appears once with the parts it applies to; a number with no source says "our judgment,
    no source cited". The paragraph above only says where the sources are kept, so nothing is said twice.
  - *Has it been checked*: outside checks and who has read the entry.
- **Every subsystem, curve or gap**: an opened row gives the curve's name, form, axis and evidence, and jumps to The
  curve. Its **Used by Hazard** tag jumps to the For Hazard footer.
- **How the names connect** (folded): subsystem → the cell's part → failure unit and curves → Digital Twin system ›
  part, grouped by the twin's view (for solar: tracker block and solar plant), as the 3D model's side panel names them.
- What is covered, What is missing and Open questions are listed once, in the What it covers step. What we assumed is
  in Where the numbers come from.
- **For Hazard** (footer) says once whether Hazard's dashboard uses this exact file. A binding (the substation
  screening bindings) reports its own run in Hazard, with the branch and the release it pins, not its source cell's
  layer. Its **What it outputs** gives
  what the curve may be used for in plain words (once on the page), then the emit modes and limitation flags. Long
  file names wrap inside their column.
- A real-estate curve page opened for one building (`?building=residential`) is titled for it and shows only its
  parts, curves and 3D model.

### Pages for pairs with no curve

- Every no-curve pair (the four catalogue gaps and heat on each asset) opens the same page: each subsystem's row
  (folded, first), why there is no curve, the research so far with links, and the asset's other hazards.
- The research follows the no-curve research audit of 4 Nov 2026: hail × wind farm links its no-go decision and both
  evidence searches; hail × substation and the battery hail and convective-wind pages name the owner deferrals (on
  Hazard branches) and say no evidence search has been run.

### Hazard

- "Used by Hazard" compares each curve file with what Hazard's internal dashboard serves (a snapshot of
  `hazard-grid-resiliency-internal`, 3 Nov 2026): used · differs · not on Hazard's dashboard.
- Where only the version differs (the real-estate proposals: Hazard runs v1.0 from an unmerged Damage branch), the note
  says the loss is the same and the flag is the version gap. This is why the build's `hazard_match` check fails.

### Data build (`scripts/dashboard/`)

- Reads Hazard's `main` from GitHub, not a local checkout; a Hazard file only on a branch is linked to that branch.
- New research index entries for the no-curve pairs; plain words for the cells' reason codes; withheld units named.
- Seven-step audits matched by model version across `current/` and `proposed/`.
- `docs/contracts/twin_crosswalks/spine.json` records where the Digital Twin defines each asset (`twin_defined_in`).
- Reads the solar and wind value ledger (`parts.py`, `ledger_budget`) and works out each tile's value split
  (`value_split`): a subsystem whose cost follows the other parts' damage (replacement labour) counts as priced; a
  partly covered subsystem whose cell states its covered dollars on the same budget is split by them (flood × battery
  comes to 75%, the cell's own figure).

## Still open

- **Value covered and the solar and wind value budgets are still in progress**; they can be reviewed, but the figures
  and wording may change.
- Not merged to `main`, so the live dashboard does not show any of this yet.
- The catalogue's part names were drafted per cell and are not one agreed vocabulary; the Twin crosswalks match on
  them by name.
- Real estate has no value budget, so its tiles give no value split.
- Wind's ledger prices collection and the GSU substation as one line (counted once, under Collection network) and has
  no line for the control building.
- The catalogue's "partial" flag and Value covered can disagree: wildfire × solar is flagged partial because its
  replacement labour has no curve of its own, yet it is 100% priced because that labour follows the other parts'
  damage.
- The solar ledger is a 100 MWdc plant; the profile is described as 100 MWac. The shares are unaffected, the dollar
  total is the ledger's.
