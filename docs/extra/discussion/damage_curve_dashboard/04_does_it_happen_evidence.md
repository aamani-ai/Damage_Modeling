<!--
author: owner-directed (Divy) · agent-drafted
created: 2026-10-19
updated: 2026-10-19
status: active
scope: Divy's 2026-10-19 idea — field-event evidence per subsystem × hazard as a second kind of reference — written as a definition, states, guards, a triage suggestion, a data shape and the battery worked example.
-->

# 04 — "Does it happen?" evidence

*Divy, 21:49: a reference should also mean actual event reports showing a real risk for that subsystem's
damage curve; if none can be found, that argues against keeping the curve or starting its research. This
note turns that into something the catalogue and the dashboard can carry. It recommends; it does not decide.*

## 1 · Two kinds of reference

| | **How much?** — curve evidence | **Does it happen?** — occurrence evidence |
|---|---|---|
| The question | How does damage rise with intensity, and what does it cost? | Has this hazard physically damaged this subsystem, in the field? |
| Graded by | Shape and cost tiers T1–T4 (exist today) | Four states: ✓ found · ~ adjacent · ∅ none after a logged search · ? not searched (new) |
| Typical sources | Tests, standards, Hazus, fitted claims, engineering proxies | Incident databases, post-event field surveys, statutory accident reports, insurer loss notes, news |
| What it decides | The curve's shape and its price | Whether the curve is worth building or keeping, and in what order |

The two can disagree, which is why they are separate fields. The battery flood search of 2026-10-18 found *"no
directly usable external-depth-to-repair-cost dataset"* — weak *how much* — while the Digital Twin rates flood
the highest exposure for the enclosure and modules. The reverse also happens: a curve with a tidy source can
sit on a hazard nobody has seen damage that part.

## 2 · Definition and states

**Occurrence evidence** is a dated, sourced record that a named hazard physically damaged a given subsystem
(or the same equipment class) of this kind of asset, outside a test. It is kept per **asset × value bucket ×
hazard** — the rows of the asset view — because one hazard can hit one part and spare the next (hail on a
chiller coil, not on the enclosure walls), and because gap cells and buckets with no curve need a state too.
The value buckets are the targets of Hazard's twin crosswalk (for batteries: `battery_enclosures`, `pcs`,
`unit_mv`, `collection`, `controls`, `civil_works`). Curve failure units name their bucket in `subsystem`; for
enclosures and PCS the names match, but the uncovered buckets use other names in the battery cells
(`BESS_MV_AND_SHARED_ELECTRICAL`, `BESS_CIVIL`, `BESS_FIELDWORK`), so the bucket key needs one agreed list (G6).

| State | Meaning |
|---|---|
| ✓ **Found** | At least one direct report: this hazard, this equipment class, comparable installation, physical damage |
| ~ **Adjacent** | Evidence exists for a neighbouring case only: another asset class, rooftop instead of utility scale, rain ingress instead of flood, a failure with no named cause |
| ∅ **None after a logged search** | A search log names the sources, the exact queries and a cutoff date; at least two of the sources could have seen this hazard; nothing was found |
| ? **Not searched** | The default. Not a finding |

### Examples

| State | Example |
|---|---|
| ✓ Found | Typhoon Mawar, Guam (2023): NREL's field survey of 30 PV systems found top clamps the most common and most damaging failure — wind × PV racking (NREL TP-5R00-89629, read by the research scan) |
| ~ Adjacent | Snow and ice on PV: 43 snow and ice accidents at PV systems in Japan in 2018–21 (NITE, from secondary web reads), in heavy-snow regions and, Sarasi noted, on rooftop systems — adjacent for utility-scale plants (ledger `C-172`) |
| ∅ None after a logged search | No row has one yet. The repository's bounded searches (battery flood, wildfire, hurricane) looked for repair-cost evidence, not occurrence |
| ? Not searched | Every battery row today (§6) |

## 3 · The guards — what "not found" can and cannot mean

1. **It must be absence after a recorded search, not absence of searching.** The repository already words
   its negative results this way: *"This is not universal absence or a final no-model decision"*
   (`../bess_damage/02_bounded_search.md`). The occurrence log reuses that format: claim boundary, surfaces,
   exact queries, cutoff.
2. **Each source must say whether it could have seen the hazard.** The main public battery database cannot.
   EPRI defines a failure incident as one *"caused by a BESS system or component failure rather than an
   exogenous cause of failure (e.g., wildfire impacting the BESS)"* (EPRI white paper, May 2024). Zero weather
   incidents there says nothing about weather. Hence the rule: ∅ needs two sources that could see it.
3. **Records name the failure more often than the cause.** A battery fire is recorded; the flood or surge
   that started it may not be. Search the mechanism chain as well (flood → short → thermal event). Grid
   batteries are a young fleet and many losses sit in private claims, so a low count is not a zero risk.
4. **It cuts both ways.** In the winter-storm call Divy's own test was *"If we can find that reference that
   would be super good"*; the first look found adjacent evidence against "no physical damage" (`C-172`).

## 4 · What each state suggests next

| Field reports ↓ · curve → | Gap (no curve) | Curve, T4 | Curve, T1–T3 |
|---|---|---|---|
| ✓ Found | **Build** — order by value at stake | **Strengthen** — the reports may also give intensity, improving the shape | **Check** the curve against the reports (an outside curve check) |
| ~ Adjacent | Placeholder or low priority; search narrower | Keep; note the known bias | Keep |
| ∅ None after a logged search | **Park** — record why, set a revisit trigger | **Review** — keep, mark the part deliberately left out with a reason, or point to business interruption only | Keep; note the absence |
| ? Not searched | **Search first** — cheap, before any curve research | Search | Search when convenient |

**Revisit triggers for a parked row:** a client asks; a loss happens; a new public source appears; the asset
design changes. The parked state stays visible; nothing is deleted.

## 5 · Where it lives — a suggested shape (gate G5)

One register file and one search log per asset × hazard in the cross-cell evidence surface (`docs/evidence/`
holds *"shared ingestion machinery, registers"*; detailed evidence stays cell-owned). Not inside
`docs/cells/catalogue/`: the catalogue builder reads every JSON file there as an entry. Catalogue entries, gap
entries included, would point to the register.

```jsonc
// docs/evidence/occurrence/bess/flood.json   (asset slug / hazard slug, from one shared slug list)
{
  "asset": "bess", "hazard": "flood", "catalogue_entry": "flood_bess",
  "search_log": "docs/evidence/occurrence/bess/flood.md",   // claim boundary · surfaces · exact queries · cutoff
  "last_searched": null,
  "buckets": {
    "battery_enclosures": {
      "state": "not_searched",                                // found | adjacent | none_after_search | not_searched
      "reports": [],                                          // [{ "id": "OCC-BESS-FL-001", "date": "…", "place": "…",
                                                              //    "what_broke": "…", "intensity": "…", "source": "…",
                                                              //    "kind": "direct | adjacent" }]
      "twin_lead": { "level": "H", "nodes": ["be_enc", "be_modules"] }   // a lead only
    },
    "pcs": { "state": "not_searched", "reports": [] }
  }
}
```

Two things the slugs must settle: the catalogue's hazard names (`tropical_cyclone_wind`, `strong_wind`,
`wind_tornado`, `convective_wind`) and asset labels ("Battery storage") versus short slugs (`bess`), and the
twin's seven hazard names. That is the hazard-name crosswalk in gate G6. The catalogue README, builder and
validator would need the pointer field — plan work.

## 6 · Worked example — "for batteries, which hazards affect them?"

*Reference plant: the Hazard BESS reference r1 (100 MW / 400 MWh LFP, 80 enclosures, 20 PCS, $109.8M); Hazard
inspected the Digital Twin as one of its inputs (`Hazard_modeling/docs/discussion/research/_cross_cutting/bess_reference_inputs.md`),
and the twin's sample has the same 80-enclosure layout. Twin nodes are grouped into value buckets by Hazard's
`Hazard_modeling/docs/plans/_cross_cutting/bess_conus/twin_crosswalk.csv`. Twin leads come from
`public/engine/bess-data.js`; they describe design exposure of a sample asset and are leads, not evidence.*

| Hazard | Curve today | Twin leads (node · level · the twin's reason) | Field reports | Leads to check first | Suggested next |
|---|---|---|---|---|---|
| **Flood** | Live · enclosure T4 (0.30 m entry policy) · PCS T3 · 25% of value has no curve | enclosure shell H *"Water at the racks shorts modules and can trigger thermal events"* · modules H *"Submersion shorts modules"* · PCS M *"Skid height"* · DC combiner, MV switchgear, cables, foundations M | ? not searched | NOAA Storm Events narratives; NITE reports of flooded PCS at solar plants (adjacent); EPRI water-intrusion entries (internal-failure scope) | **Search** — highest lead, most value at stake |
| **Hurricane wind** | Live · T4 · T4 (transferred from solar) | enclosure shell L *"Anchorage loads"* (the twin has one "severe wind" hazard) | ? not searched | NOAA Storm Events; NITE typhoon reports | Search |
| **Convective wind** | Gap | enclosure shell L (same lead) | ? not searched | NOAA Storm Events (tornado, thunderstorm wind) | **Search first**; park if ∅ |
| **Hail** | Gap | enclosure shell L *"Panel denting"* · chiller L *"Condenser coil damage"* · venting L *"Panel damage"* | ? not searched | NOAA Storm Events; insurer notes | **Search first**; park if ∅ |
| **Wildfire** | Live · T4 · T4 | modules M *"External fire can propagate into enclosures"* · fire & gas M · yard M *"Vegetation clearance is a fire-code requirement"* · chiller L *"Smoke fouls coils"* | ? not searched (the 10-19 search looked for demand and repair evidence) | US wildfire events near BESS sites; operator notices | Search |
| **Heat** | No damage cell | modules H *"Every +10 °C roughly doubles calendar ageing"* · chiller H *"Chiller capacity sets derating in heat waves"* · PCS H *"Derates above ~40–45 °C"* | — | — | **Performance, not damage** — link to the outage-as-performance work (model-gpr), no curve |
| **Lightning** | No hazard cell | BMS M *"Surges on comms and auxiliary power"* · PCS M *"Surges"* · EMS M · ground grid M | ? not searched | Operator incident notes; insurer notes | Search; if ✓, raise the hazard scope with Hazard |
| **Icing** | No cell | modules L *"Cold limits charge rate until heated"* (performance) · venting L *"Snow load on panels"* | — | — | Low; the `C-172` reasoning applies |

**What this answers.** Which hazards plausibly matter for a battery and through which parts (twin), which have
curves and how strong they are (catalogue), and — once the searches run — which have been seen in the field.

**What it does not answer.** How often a hazard reaches a given site, or the dollars per year — Hazard
computes those. Whether the heat and cold effects matter financially — that is the performance side.

**Not verified here.** The flood, typhoon and water-intrusion leads in the table were named by the research
scan of 2026-10-19 and have not been read for battery-specific content. No battery row has an occurrence
search yet.

*Sources: EPRI, Insights from EPRI's BESS Failure Incident Database: Analysis of Failure Root Cause (white
paper, May 2024), https://restservice.epri.com/publicdownload/000000003002030360/0/Product (read) · EPRI BESS
Failure Incident Database, https://storagewiki.epri.com/index.php/BESS_Failure_Event_Database (read) · NREL,
Typhoon Mawar PV assessment, https://www.nrel.gov/docs/fy25osti/89629.pdf (read by the research scan) · NITE
accident reports, https://www.nite.go.jp/gcet/tso/kohyo.html (read by the research scan) · NOAA Storm Events
Database, https://www.ncei.noaa.gov/stormevents/ · Digital Twin `public/engine/bess-data.js` and
`docs/data-model.md` at `d01abd0` · Hazard `docs/plans/_cross_cutting/bess_conus/twin_crosswalk.csv` at
`95276ac1c` · catalogue entries `flood_bess`, `tropical_cyclone_wind_bess`, `wildfire_bess`, `hail_bess`,
`convective_wind_bess` · learning-log ledger `C-172` (`/Users/divy/Desktop/infrasure/learning_log/LEDGER.md`).*
