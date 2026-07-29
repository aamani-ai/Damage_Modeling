# Flood × wind

## 1. Cell identity

```yaml
cell_id: flood_wind
damage_code_id: FLOOD_WIND_PROPOSED_V0_1
semantic_damage_model_version: model v0.1
human_documentation_revision: docs r1
runtime_documentation_revision: none
consumer_pin: none
package_baseline: library v2.5
lifecycle_state: scaffold
promotion_status: proposed
canonical_runtime_artifact: false
curve_records: 0
package_release: unreleased
runtime_reason: NO_RUNTIME_CURVE
artifact_schema: damage_curve_record_bundle.v1 (noncanonical zero-curve envelope only)
capability_schema: capability_declaration.v1
artifact_sha256: 8dde717bee7fb12db21b4a9b3b81f9927978edb7e2dc3e77691a64c578a6c9b3
capability_sha256: 09b5909c4672f4ddbed583c6c098a61242ef4adf45a57c98dcef754150b3ddc2
runtime_behavior_changed: false
consumer_action: none
```

This cell is the governed flood-damage workstream for a land-based wind facility. It recognizes that the
material direct-flood subjects are often low electrical components—including the facility GSU/substation—
rather than the elevated rotor and nacelle.

**Scaffold deviation from the cell-package standard:** section 4 records *primary candidates*, not approved
primary-nonzero curves. Model v0.1 contains no numerical response and therefore cannot honestly label any
failure unit primary nonzero or DR≈0. The consequence is fail-closed withholding for both CONUS and per-asset
use until a later governed model version passes the promotion gates.

## 2. Snapshot tree

```text
flood × wind
├─ primary candidates — all withheld; no curve
│  ├─ facility GSU/substation
│  │  ├─ switchgear
│  │  ├─ main GSU transformer
│  │  ├─ transformer auxiliaries/controls
│  │  ├─ protection/SCADA/control
│  │  └─ station service/DC
│  └─ wind-specific electrical
│     ├─ turbine-base electrical equipment
│     └─ pad/turbine step-up transformer
├─ conditioner/exposure-only states
│  └─ drainage, pumping, flood defense, temporary protection, isolation
├─ reviewed secondary candidates — all withheld; no curve
│  ├─ GSU cable terminations/pull boxes/water paths
│  └─ MV collection joints/terminations/pull boxes/water paths
├─ geometry-screened; not a universal DR≈0 declaration
│  └─ elevated rotor/nacelle/tower equipment
├─ separate or out-of-primary-pathway subjects
│  ├─ turbine foundation/supporting soil → scour/erosion pathway
│  └─ mixed civil/access/drainage → split subjects and pathways first
└─ post-disposition support; no independent curve
   ├─ fieldwork/assembly
   └─ transport/logistics
```

## 3. Scope and exclusions

| Boundary | Treatment in model v0.1 |
|---|---|
| Direct physical destruction from `flood_inundation_contact` | In scope for curation; numerical DR withheld |
| Riverine, pluvial, or coastal source peril | Accepted only when the delivered contact state and `event_family_id` are complete |
| Scour, erosion, saturated-soil support loss | Separate `flood_scour_erosion` pathway; no fallback |
| Debris impact and wave loading | Separate/deferred; wave loading is outside the onshore reference |
| Outage, dependency, downtime, BI, curtailment, revenue | Excluded from the direct-damage ordinate |
| Frequency, EAL, PML, VaR, TVaR, insurance, portfolio accumulation | Owned by downstream consumers and currently withheld |

## 4. Primary nonzero failure-unit(s)

There are **no approved primary-nonzero records** in model v0.1. The following are the priority candidates:

| Candidate IDs | Mechanism and grain | Curve/value status |
|---|---|---|
| `FW_GSU_SWITCHGEAR`, `FW_GSU_PROTECTION_SCADA`, `FW_GSU_STATION_SERVICE_DC` | Component-local contact/ingress at facility equipment | No curve; same-unit disposition/cost and site value required |
| `FW_GSU_TRANSFORMER_MAIN`, `FW_GSU_TRANSFORMER_AUX_CONTROLS` | Main body versus lower controls/auxiliaries must remain dependency-safe | No curve; anatomy, state, and non-overlapping value split required |
| `FW_TURBINE_BASE_ELECTRICAL`, `FW_PADMOUNT_STEPUP_TRANSFORMER` | Per turbine or verified cluster point | No curve; wind inventory, datum, construction, and value required |

## 5. Conditioner-only equipment

Drainage, pumps, flood walls, temporary barriers, warning/isolation actions, and conduit/water-path controls may
change delivered water contact or event state. They do not receive an independent direct-damage curve in this
scaffold and earn no silent protection credit. Any later modifier must name the affected response, evidence,
state, and numerical rule.

## 6. Reviewed secondary / low-materiality equipment

| ID | Why reviewed but not modeled | Update trigger |
|---|---|---|
| `FW_GSU_CABLE_TERMINATIONS` | Solar cable candidate transfers only a mechanism, not a construction-matched cost response | Construction-specific disposition, same-unit value, and exposure evidence |
| `FW_COLLECTION_CABLE_TERMINATIONS` | A line/network subject cannot be allocated by turbine count | Segment inventory, terminations, water paths, ownership, and cost evidence |
| `FW_ELEVATED_TURBINE_EQUIPMENT` | Normally geometry-screened, but base penetrations or alternate water paths can defeat that screen | Verified site water path and vulnerable point |

## 7. DR≈0 / not-directly-affected buckets

No failure unit is assigned a runtime DR≈0 in model v0.1. A verified local depth of zero is an exposure state,
not permission to invent a curve output; because `curve_records` is empty, DR still returns
`null / withheld / NO_RUNTIME_CURVE`. Elevated turbine equipment is only geometry-screened, and foundation,
civil, and support subjects are routed as shown in the snapshot rather than mislabeled immune.

## 8. Hazard x-axis decision

```text
h_i = max(0, WSE - z_i_crit)

WSE       event water-surface elevation
z_i_crit  first vulnerable point for component instance i
h_i       local depth above that component datum, metres
```

`WSE` and `z_i_crit` must use the same explicit vertical datum. Missing elevation is not dry; a datum mismatch
rejects evaluation. The method is frozen, but a runtime valid range and numerical response are not.

## 9. Curve form and y-axis meaning

Piecewise/tabular state curves are the preferred future form because water contact and equipment disposition
are threshold/state-like. No form, interpolation range, extrapolation, parameter, or ordinate is approved for
runtime in v0.1. The proposed future y-axis is:

```text
E[direct repair-or-replacement cost for failure unit i
  / pre-event direct replacement value of that same unit i
  | delivered contact state and qualified selectors/conditioners]
```

It is neither failure probability nor outage fraction, and its denominator is never whole-site TIV.

## 10. Selector / conditioner / exposure map

| Role | Examples | Effect now |
|---|---|---|
| Fixed selector | equipment/construction, voltage, enclosure, transformer type, design vintage | Capture and compatibility check only; no numeric variant |
| Event conditioner | duration, contamination/salinity, energized/isolation state, water path | Preserve explicit state; no borrowed or favorable modifier |
| Axis bridge | WSE, component vulnerable elevation, common datum | Derive `h_i`; reject missing/mismatched references |
| Exposure | component geometry, instance count, at-risk fraction and basis | Determine which value is touched; does not alter intrinsic fragility |
| Value/ownership | owner, insured inclusion, same-unit value, quantity | Required for future scenario loss; cannot create a DR |

## 11. Value-link basis

Future assembly is `loss_i = DR_i × same-unit direct value_i × exposure fraction_i`, summed once by physical
component. The 2023 wind reference ledger contains a mixed `72 USD/kW` external-electrical row; it is **not**
a GSU value and must be split using a site/OEM/SOV schedule. One shared GSU is valued once, unknown ownership
withholds baseline project loss, and fieldwork/transport are allocated once after disposition rather than
given their own curves. See the [value crosswalk](proposed/VALUE_CROSSWALK_flood_wind__model_v0_1__docs_r1.csv).

## 12. Evidence and derivation pointer

Curve proof and the negative evidence boundary live in the
[derivation dossier](proposed/flood_wind_curve_derivation_dossier__model_v0_1__docs_r1.md),
[source register](proposed/SOURCE_REGISTER_flood_wind__model_v0_1__docs_r1.csv), and
[bounded search log](proposed/BOUNDED_EVIDENCE_SEARCH_LOG_flood_wind__model_v0_1__docs_r1.md).
The [shared substrate](../../method/shared_components/flood_electrical/README.md) carries asset-neutral
vocabulary and compatibility rules only; it is not a curve library.

## 13. Workbook map

The [audit workbook](proposed/damage_curve_records_flood_wind__model_v0_1__docs_r1.xlsx) is derivation and
review evidence, not runtime authority.

| Reviewer question | Workbook sheet |
|---|---|
| What is the package decision and value reconciliation? | `README` |
| How did each governance step resolve? | `Seven_Steps` |
| What may be shared between solar and wind? | `Shared_Substrate` |
| What physical/support subjects were reconciled? | `Failure_Units` |
| How do datum, local depth, exposure, and value stay separate? | `Exposure_Value`, `Site_Adapter` |
| How is the reference ledger split or withheld? | `Value_Crosswalk` |
| What solar and legacy numerics were audited but rejected from runtime? | `Candidate_Audit`, `Legacy_Audit` |
| Which claims, sources, and parameter tiers support each decision? | `Claim_Register`, `Source_Register`, `Parameter_Tiers` |
| Which structural/numerical checks passed? | `QA_Checks` |

## 14. Open seams and update triggers

Promotion requires, in order: component/OEM inventory; exact vulnerable elevations and water paths;
equipment-specific inspect/repair/replace evidence; same-unit cost evidence; non-overlapping value and
ownership schedules; numerical response and domain review; solar/wind compatibility review; positive and
boundary KATs; repository-current model/docs/schema/SHA publication; and M3/M4 dual-read, rollback, and bypass
removal. The detailed status is in the [promotion matrix](proposed/PROMOTION_GATE_MATRIX_flood_wind__model_v0_1__docs_r1.md).

## 15. Implementation notes

- Read [Basics](basics/README.md), [How the model is built](basics/HOW_THE_MODEL_IS_BUILT.md), and
  [Model reference](basics/MODEL_REFERENCE.md) as the three-page reader layer.
- The exact research contract is the [metadata specification](proposed/flood_wind_damage_code_metadata_spec__model_v0_1__docs_r1.md);
  the [zero-curve artifact](proposed/flood_wind__model_v0_1__docs_r1__curve_artifact.json) is noncanonical.
- CONUS and per-asset work must not fork intrinsic response merely by scale. A future compatible response may
  be shared, while CONUS binds class-template distributions and per-asset binds observed component instances,
  elevations, ownership, and value. Missing per-asset facts do not silently fall back to CONUS.
- No artifact-index row, canonical pin, package release, runtime schema, stable `src/` API, or Hazard consumer
  changed. The [handoff boundary](../../contracts/hazard_handoff/flood_wind_model_v0_1_boundary.md) requires a
  later governed cutover; the current M3/M4 hardcodes remain legacy characterization fixtures, not fallbacks.
- Planning and the structural decision are recorded in the
  [plan of record](../../plans/flood_wind_shared_electrical/README.md).
