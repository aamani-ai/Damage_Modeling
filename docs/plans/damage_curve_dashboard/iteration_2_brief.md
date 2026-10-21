<!--
author: owner-directed (Divy) · agent-drafted
created: 2026-10-20
updated: 2026-10-20
status: active
scope: Iteration 2 of the damage-curve dashboard — the owner's first review of V0 on the running app (2026-10-20), what it means, the redesign (plain layer first, one curve at a time, sources as links, every asset, one data quality across cell generations), and the brief for the session that builds it.
-->

# Iteration 2 — the owner's first review, and what changes

## 1 · The review, in the owner's words (2026-10-20, on the running V0)

> "Things are not very well structured … in the cases where you have multiple curves … you need to improve
> that somehow. I'm opening a flood, and it's really hard to understand or read things … At some point, it
> sounds very technical, but this is also something we want to showcase to Prashant and others. The same
> happens whenever I click on, let's say, scope, units, X's, and all that. It's very tricky to even
> understand and read at all … Can you make it a bit more user-friendly so people can understand? I think
> your library and settings are good."

> "For sources and all, I am under the assumption you will provide a link, but it seems like that's not the
> case, so we need to find something else. For batteries, you are providing an amazing thing, right? Why
> don't we do that for solar and wind? … there is a lot of inconsistency between these things as well, or
> maybe it's … because, for those things, our breakdown was different than it should be. That's what we want
> to ultimately understand, right? Let's do one more iteration."

> "You're putting all that into dropdowns of, let's say, evidence and all, but it's really not doing a
> great job. I'm getting overwhelmed. Forget about other people … It looks too cluttery right now."

## 2 · What was on the screen, and why it reads that way

Looked at again after the review (1440 × 900, dark theme):

| Where | What the owner saw | Why it is there |
|---|---|---|
| Status rail and identity line | `LIVE · screening · shape T3–4 · cost T3–4 · field reports ? not searched · entry agent-read 2026-10-19 · release —`, then `BESS_FLOOD_INUNDATION_SCREENING_V1 · model v1.0 · docs r1 · sha c9bc919` | Every fact of P15/P16 in one line, in the house's shorthand |
| The trail | `SCOPE 3 deferred · UNITS 2 units · AXIS·FORM binary step · piecewise linear · EVIDENCE 19 src · T3–4 · … · CAPABILITY IR supported · EAL conditional · PROOF 30 of 30 KAT reproduced` with gate letters | The ten stations of 07 §3 with one *fact* each — facts, not meanings |
| THE ANSWER | Four lines on one plot (enclosure fresh/saline as a band, PCS fresh, PCS saline band), knots, known-answer dots, a "our judgment (T4)" flag, an "identical response" footnote, then `BESS_ACTIVE_CONTACT_STATE · Battery enclosure (active hardware) · T4/T4 …` | 03 §4 said overlay a cell's own curves; with variants that is four lines and two bands |
| HOW TO USE | `single event · allowed — per-unit damage ratio for a stated depth and a stated water type …`, `yearly loss · conditional — Hazard computes it only if frequency, shared event, per-unit cap and missing-data checks pass …` | The catalogue's `how_to_use.outputs` strings, verbatim |
| The six cards | `THE PARTS · station 2 units · gate A · B2 · 2 parts · shape T3–4 · cost T3–4` … `THE EVIDENCE · 19 sources · 30 claims · 5 parameters · weakest T4`, all collapsed | 07 §4's "cards open as a one-line summary with its count and weakest tier" — the summary is a ledger line |
| A station drawer (Scope) | *Files behind this station* with SHAs, then *Gate A — scope* as a checklist of `cell_id in the artifact`, `hazard_scope/deferred in the entry's out_of_scope`, `proven / human` | 07 §7's gate view, built early, with the machine's field names |
| The dossier | *What sets this curve*: `bridge · battery state: inflectional_depth_m > 0.30; only binary states accepted …`; *Parameters and their sources*: `entry_and_active_replacement T4 BF-S01 · BF-S02 · BF-S06 · BF-S15`, source IDs as text | Register rows rendered as they are stored; no locator was surfaced |
| Hail × Solar farm | `0 sources · 0 claims · 8 parameters · weakest T4`; *share of value not stated in the files*; three curves whose end labels overlap | The oldest cells keep their registers in dossier prose and workbook sheets (07 §2); the build read only files |
| Battery storage asset view | Value buckets × hazards with `H ■ T4 ◔ ?`-style marks and a legend line; no equivalent for solar, wind, substation or real estate | 03 §2.2 built for the first slice only; the other assets have no twin crosswalk and no single value-bucket list |

The pattern: V0 is faithful and complete, and it reads like an audit ledger because every sentence on it is
a *fact in shorthand*. The owner, who wrote the framework, got overwhelmed; Prashant would get nothing. That
is a balance problem of the page, not a data problem — the catalogue already holds plain sentences for most of
what the page needs (`input`, `method.summary`, `how_to_use.share_of`, `judgment`, `not_covered`,
`key_sources`, each row's `shape_basis` / `cost_basis` / `notes`), written by Jung A for a human reader, and
V0 used them as footnotes.

## 3 · What changes — the design of iteration 2

**The rule that changes.** 06 §2.6 and `DCD-D12` said "one plain sentence, then the instrument". The review
shows that is the wrong balance for a page that Prashant and a new reviewer must read: **the plain layer is
the page; the ledger is behind one control** (`DCD-D19`). Nothing is removed from the ledger — IDs, tiers,
gates, SHAs, registers, known answers stay, one click away, exactly where they were. The library and its
lenses stay as they are ("your library and settings are good").

### 3.1 The cell page, rebuilt as a story

```text
Flood × Battery storage                      [Live · a screening model]  [Evidence: transferred and policy]  [Not yet reviewed by a person]
Flood on batteries: an enclosure is written off once water rises above 0.30 m (a policy, not a measurement); a PCS loses
value gradually with depth, following the solar inverter curve. Three quarters of the plant's value has a curve; a quarter has none yet.

HOW THIS WAS BUILT   ○ What it covers · ○ What breaks · ○ How damage is measured · ● Where the numbers come from · ○ What it is worth
                     ○ The audit · ○ The files · ○ What it can output · ○ How it was tested · ○ Seen in the field, and reviewed
                     (plain names; one line of meaning under each on hover; click opens the side panel of §3.3)

THE CURVE            part: [Battery enclosure] [Separate PCS]      water: [fresh] [saline]      ☐ compare all parts
 ┌─────────────────────────────────────────────┐   WHAT THIS CURVE SAYS
 │   one curve, large, the 0.30 m entry marked  │   A separate PCS keeps its value until water reaches its 0.30 m entry, then loses it
 │   in words ("water enters here"); the T4     │   quickly: fully replaced by 0.9 m above grade. Beyond 2.3 m we assume full
 │   continuation drawn dotted and captioned    │   replacement — our judgment, no data that deep.
 │   "beyond the data: assumed"                 │   HOW SURE   shape: borrowed from the solar inverter curve (transferred · T3)
 └─────────────────────────────────────────────┘             cost: market unit value $520,000 (transferred · T3) · entry height: owner policy (T4)
                                                   SEEN IN THE FIELD   nobody has looked yet → open the search log
                                                   MAIN REFERENCES   Flood × Solar model v1.0 ↗ · NEMA GD 1-2016 ↗ · SMA Sunny Central Storage manual ↗
                                                   Show the numbers ▾   (knots · claim IDs · tiers · 30 known answers · the record's ID)

WHAT IT CAN BE USED FOR    ✓ one flood event (give depth and water type)   ✓ a dollar scenario (give the unit value)
                           ◐ yearly loss — only through Hazard, which checks frequency and caps   ✗ PML, VaR — not supported
WHAT IS COVERED            ▇▇▇▇▇▇▇▇ enclosures $84.0M · ▇ PCS $10.4M      ░░ no curve yet: racks and fire suppression $11.9M · electrical balance $13.2M · civil $1.6M · fieldwork $0.6M
WHAT WE ASSUMED (4)        water enters at 0.30 m above grade (owner policy) · any entry means the enclosure's hardware is replaced · …
WHAT IS MISSING            wave impact · scour · debris          OPEN QUESTIONS (3) …
───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Identity  BESS_FLOOD_INUNDATION_SCREENING_V1 · model v1.0 · docs r1 · sha c9bc919 · built at 3f9d516      Files · Registers · Known answers ▾
```

Rules:
- **Words before codes, everywhere in the default view.** Tiers appear as words with the code secondary
  (*lab-tested · T2*, *standard · T2*, *transferred · T3*, *our judgment · T4*); states as sentences; the
  status rail as three plain chips. No gate letter, station number, register ID or SHA is visible until the
  reader asks for the ledger ("Show the numbers", "Details", the identity footer).
- **One curve at a time.** A part selector and a variant toggle; the other parts ghosted; *compare all* is an
  opt-in overlay. Labels never overlap because only one line is labelled by default.
- **Every curve has a caption written for a reader** — *what it says*, *how sure*, *seen in the field*, *main
  references* — assembled by the build from the catalogue row (`shape_basis`, `cost_basis`, `notes`), the
  entry's `judgment` and `key_sources`, and the register, in that order. Never typed in a component.
- **The six cards become five plain blocks** that are *open*: what it can be used for (the capability strings
  rewritten as ✓ ◐ ✗ sentences), what is covered, what we assumed, what is missing, open questions. The
  parts, audit, proof and review ledgers live in the side panels of §3.3 and under *Show the numbers*.
- **Identity moves to the footer**, in mono, once.

### 3.2 Sources are links

Every source shown is a link when its register row has a URL or DOI; otherwise the document title and its
locator (edition, section, page) as text, with the words *no link in the register* — which is itself a finding
the review queue lists. `key_sources` are the *main references* of the page; the full register is in the
"Where the numbers come from" panel. Repository files (dossier, workbook, registers, known answers) link to
GitHub at the build commit. This needs the build to carry `url`, `doi`, `title`, `locator` per source.

### 3.3 The trail becomes "How this was built" — the same ten stations, in words

Each station opens a side panel that **explains first**:

```text
Where the numbers come from                                                                      ×
Five sources set this cell: the Hazard battery reference (layout and budget), NEMA's guide to water-damaged
equipment, the Flood × Solar inverter curve, an SMA PCS manual and NREL's cost shares. Of the five parameters,
three are transferred from those sources (T3) and two are our own policy (T4): the 0.30 m entry height and
"any entry means full replacement".
SOURCES         Flood × Solar model v1.0 ↗ · NEMA GD 1-2016 ↗ · SMA Sunny Central Storage manual ↗ · NREL PVSCM 2024 Q1 ↗ · Hazard BESS reference r1 ↗
PARAMETERS      entry height 0.30 m · owner policy (T4) · from BF-Q01          unit value $520,000 · transferred (T3) · from BF-S13 …
Details ▾       register IDs · claim IDs · gate B checklist · files and SHAs
```

The panel's first paragraph is generated per station from the entry and registers with a fixed template per
station (what it covers / what breaks / how damage is measured / where the numbers come from / what it is
worth / the audit / the files / what it can output / how it was tested / seen in the field and reviewed). The
gate checklist and the file list keep their place under *Details*.

### 3.4 Every asset gets the asset view — and the breakdown question is answered on it

```text
Solar farm — which hazards affect it, and how sure are we?
Hail is the one hazard with a lab-tested curve (modules); flood, hurricane wind and wildfire have curves built from transferred or
judgment evidence; convective wind's curve is our judgment. Four parts of the plant have no curve under any hazard.

PART OF THE PLANT (value share)     HAIL                 FLOOD                  HURRICANE WIND          CONVECTIVE WIND       WILDFIRE
PV modules            33 %          curve · lab-tested   no curve               curve · transferred     curve · judgment      curve · screening
Inverters              — %          no curve             curve · transferred    …
…
seen in the field: not checked for any part            legend: words first; marks on hover

THESE CELLS SPLIT THE PLANT DIFFERENTLY  ▸   hail: modules · mounting · instruments · inverters(0) …   flood: inverters · switchgear · collection · foundations …
                                              hurricane: … — the parts do not line up; no reference budget exists for solar in this repository (Hazard has one for batteries and substations).
```

The parts come from each cell's artifact (`failure_unit_coverage` / `value_linkage`) and crosswalk where
one exists; where the cells of one asset name their parts differently, the page says so in a block and shows
the parts side by side — that is the inconsistency the owner wants to understand, made visible instead of
smoothed over. Twin leads appear only where a twin crosswalk exists (batteries, substations); the others say
*no twin mapping yet*.

### 3.5 One data quality across the three cell generations

The build extracts sources, claims and parameters for the older cells from where they actually are — the
workbook sheets (`Evidence_Log`, `*_Evidence_Params`, `Open_Seams_Index`, per 02 §5) and the dossier's
headings — so Hail × Solar no longer shows *0 sources* beside a page that cites PVEL, Kiwa and IEC. Where
extraction is not possible, the page says *sources are in the dossier prose; not yet extracted* with a link to
the dossier — never an empty count that reads as "no evidence".

## 4 · What stays

The library and its five lenses; the data build and its checks; the occurrence register and its page; the
`/code/` resolver; the `/v0` walkthrough (rewritten for iteration 2); both themes; keyboard grids; the look
principle. The ledger loses nothing — it moves one click deeper.

## 5 · Acceptance for iteration 2

| # | Check | Pass when |
|---|---|---|
| 1 | No code in the default view | On every page, no register ID, claim ID, gate letter, station number, tier code without its word, or SHA is visible until a *Show the numbers* / *Details* / footer control is used |
| 2 | One curve at a time | A cell page opens on one labelled curve; variants and parts are selected, not overlaid; *compare all* is opt-in |
| 3 | Captions | Every curve has *what it says* / *how sure* / *seen in the field* / *main references*, generated by the build |
| 4 | Sources | Every source is a link or a titled citation with locator and the words *no link in the register*; the count of unlinked sources is on the review queue |
| 5 | Every asset | `/assets/<asset>` renders for all five assets; the *split differently* block appears where parts do not line up |
| 6 | Older cells | Hail × Solar, Flood × Solar, Convective wind × Solar and Tornado × Wind show their sources and parameters from the workbook/dossier, or say they are not yet extracted |
| 7 | Plain panels | Each of the ten stations opens a panel whose first paragraph is a sentence a non-specialist can read |
| 8 | Cold read | A named reader who does not know the framework answers *which hazards affect solar farms, and how sure are we?* from the asset view, and *what does the PCS flood curve say and what is it based on?* from the cell page, in under two minutes each, and says what confused them |
| 9 | The look review | 06 §4 checks 1–8, then the owner on the running app |

## 6 · For the session that builds it

Read: this file; the plan README, `decisions.md` (`DCD-D18`, `D19`) and `assumptions.md`; discussion `06`
(the look rules still hold), `07` (the stations keep their meaning), `03` §2 (the wireframes this revises);
`dashboard/README.md` and the code as it is on `main`; `docs/cells/catalogue/README.md` for the plain fields;
one older cell's workbook (`docs/cells/hail_solar/current/*.xlsx`) and dossier to see where its registers live.

Build order: (1) the data build — source `url`/`doi`/`title`/`locator`, the curve captions, the station
paragraphs, the per-asset parts and the *split differently* finding, the workbook/dossier extraction for the
older cells, the per-page plain sentences; (2) the cell page and the dossier; (3) the station panels; (4) the
asset view for every asset; (5) the `/v0` walkthrough rewritten; (6) the screenshot set and REVIEW.md for the
look review; (7) the PR — do not merge; the owner reviews on the running app and the branch is deleted at merge.

Don'ts carry over from discussion `05` §8, plus: do not remove any ledger fact — move it; do not type a
caption or a paragraph in a component — the build writes them; do not smooth over the parts mismatch between
cells — show it.
