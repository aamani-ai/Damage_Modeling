# Stage B · wind/tornado × wind co-curation triage — adopt / park / reject

**Decisions** on the old repo's wind evidence (facts: [`research/wind_tornado_wind.md`](research/wind_tornado_wind.md)).

## Verdict

**The richest of the three** — because our wind cell is the most *greenfield* (engineering-fit, single EF4
anchor). Still **no measured tornado fragility** (a gap in both repos), and **no wholesale curve swap** (our
design-normalized structure is sound). But the old repo brings real structural-fragility evidence, a **second
empirical anchor**, and **physics** for the tornado shift.

## ✅ Adopt — references / anchors (into the evidence map + assumption register)

| Evidence | Strengthens (our seam) | Note |
|---|---|---|
| **Typhoon Usagi (2013)** | single-EF4-anchor gap | 2nd empirical point (~32% damage @ ~140 mph) for a validation cross-check |
| **Rose et al. (2012, PNAS)** | engineering-fit tower curve | empirical tower fragility — cross-validate our `WT_TOWER_STRUCT` |
| **Kareem et al. (2023)** | tornado D50-shift basis | downburst profile → physics justification for the shift |
| **Kapoor et al. (2020)** | yaw/feather conditioner (uncalibrated) | 5–6× load multipliers for direction error |
| **Punta Lima (Maria 2017)** | high-severity total-loss plausibility | Cat-4 direct hit = ~100% farm loss |
| **UTM (2024)** collapse review | tower failure mechanism | stress-concentration locations (site-risk flag) |

## ⚠️ Candidate v1.1 **model** changes (separate, bigger decision — not v1 ingestion)

DR-changing, so model-version (not docs) changes — flag now, decide later:
- a **numeric yaw-error conditioner** (Kapoor multipliers) · a **tornado D50-shift refinement** (Kareem
  physics + Usagi/Greenfield two-point check) · **IEC Class II/III** x0 offsets.

## ⏸️ Park / ❌ redundant

- Park: claims calibration (absent both); **blade mode-specific** curves (Mishnaevsky — future v1.1+);
  blade/tower/nacelle/foundation **dependency/cascade** (flagged but unmodeled in both); Del Campo TMD
  (mitigation, out of base-fragility scope).
- Redundant: DOE, DTU IEC explainer, Ashes Ve50, NOAA EF, NASA Greenfield, NIST, Rice (already cited); old
  curve params (we keep our normalized form).

## Honest gap (both repos)

**Measured tornado-on-turbine fragility does not exist** in either. The shift stays *"informed by physics
(Kapoor, Kareem), anchored to two points (Greenfield EF4 + Usagi)"* — not claimed as calibrated.

## Ingestion (standard 16) + version call

v1 ingestion = **references + the Usagi/Rose cross-checks + the honest-gap statement → docs revision only**
(per [standard 17](../../../contracts/standards/17_versioning_policy.md)).
The yaw-conditioner / tornado-shift / class-offset items are logged as **candidate model v1.1** changes. One
[standard-16](../../../method/standards/16_reference_ingestion_and_curve_update_protocol.md)
update to the [wind/tornado dossier](../../../cells/wind_tornado_wind/current/wind_tornado_wind_curve_derivation_dossier_v1_0.md).

---
*Stage B · facts → [`research/wind_tornado_wind.md`](research/wind_tornado_wind.md) · workstream → [`README.md`](README.md).*
