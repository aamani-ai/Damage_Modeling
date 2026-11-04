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
- **Heat** has a column with the research so far. Icing and lightning are hidden (no curve, no research).
- The header gives the counts; the KPI cards are gone.

### Asset pages (for example Power plants › Solar farm)

- **The curves**: the library's own tiles, one per hazard including heat.
- **View by subsystem**: every subsystem (cost bucket) against the hazards. It opens on Hail and has an **All
  hazards** tab. An opened row gives its value share, the cell's own name for the part, its failure unit and subsystem
  code, and its curves in brief, with a link to them on the curve page. The old part-list grid is removed.
- **View by Digital Twin part**: the **3D model** and a **Table** of the twin's systems (folded until opened). The
  table lists the parts each system contains and counts mixed systems ("has a curve for 1 of 2 parts"). Links say
  where the Digital Twin repository defines each asset's breakdown.
- Parts a hazard does not damage by the cell's decision read **no direct damage**, not "no curve yet".

### Curve pages (each hazard × asset, for example Hail × Solar farm)

- **The curve** picks subsystem → part → curve. Curves that share a name say what sets them apart (fixed tilt /
  tracker, fresh / salt water, module type, terrain).
- **How this curve was made**, four steps. Each panel is complete on its own and ends with **Read from:** links to the
  GitHub files it was written from (folded), next to **Details** for reviewers (method checks, source IDs, file
  fingerprints). Each list starts with its count.
  - *What it covers*: scope, what it leaves out, open questions, each part as subsystem › part, withheld units named
    in words with their reasons.
  - *How it was derived*: each hazard measure with the parts read against it, the curve shapes, what Hazard has to
    supply; seven-step audits are found wherever the cell keeps them, or an earlier version's is named.
  - *Where the numbers come from*: each parameter once, with the parts it applies to; a number with no source says
    "set by the team; no source cited".
  - *Has it been checked*: outside checks and who has read the entry.
- **Every subsystem, curve or gap**: an opened row gives the curve's name, form, axis and evidence, and jumps to The
  curve.
- **How the names connect** (folded): subsystem → the cell's part → failure unit and curves → Digital Twin parts.
- What is covered, What is missing and Open questions are listed once, in the What it covers step; the page keeps
  only **What it can be used for** and **What we assumed** at the bottom.
- **For Hazard** (footer) says once whether Hazard's dashboard uses this exact file.
- A real-estate curve page opened for one building (`?building=residential`) is titled for it and shows only its
  parts, curves and 3D model.

### Pages for pairs with no curve

- Every no-curve pair (the four catalogue gaps and heat on each asset) opens the same page: why there is no curve, the
  research so far with links, each subsystem's row, and the asset's other hazards.
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

## Still open

- Not merged to `main`, so the live dashboard does not show any of this yet.
- The catalogue's part names were drafted per cell and are not one agreed vocabulary; the Twin crosswalks match on
  them by name.
- For most assets the dashboard says which parts have no curve but not how much value that leaves out.
