# Standard 10 Review — Per-Cell Scorecards

**Date:** 2026-08-27 · **Standard:** `docs/method/standards/10_review_checklist.md` · **Summary:** `STANDARD_10_REVIEW_SUMMARY_2026-08-27.md`

Verdicts: PASS / FLAG / N-A per checklist item. A FLAG marks an undocumented, inconsistent, or gap-hiding decision — not weak evidence (a labeled placeholder with stated reasoning is a PASS). Per-parameter value sourcing is delegated to the parameter checker throughout.

Cells: [hail_solar](#hail_solar) · [flood_solar](#flood_solar) · [wildfire_solar](#wildfire_solar) · [strong_wind_solar](#strong_wind_solar) · [wind_tornado_wind](#wind_tornado_wind) · [flood_wind](#flood_wind) · [wildfire_wind](#wildfire_wind) · [tropical_cyclone_wind_wind](#tropical_cyclone_wind_wind) · [tropical_cyclone_wind_solar (proposed)](#tropical_cyclone_wind_solar-proposed) · [hail_wind (proposed)](#hail_wind-proposed)

---

## hail_solar

Version reviewed: `current/` — model v1.0, docs r7 (curve content v1.3, crosswalk v1.4). FLAGs: 1 (§9).

| # | Section | Item | Verdict | Evidence | Note |
|---|---------|------|---------|----------|------|
| 1.1 | Package | README + snapshot tree | PASS | README "Current modeling decision" tree; crosswalk | Tree of primary/conditioner/secondary/DR≈0 units present |
| 1.2 | Package | Derivation dossier | PASS | hail_solar_curve_derivation_dossier_v1_3.md | 20 sections + r4/r6/r7 addenda |
| 1.3 | Package | Metadata spec | PASS | damage_code_metadata_spec_hail_solar_v1_3.md | Full input/output contract |
| 1.4 | Package | Canonical JSON artifact | PASS | hail_solar__model_v1_0__docs_r7__curve_artifact.json | Named canonical in README + dossier r7 addendum |
| 1.5 | Package | Workbook audit view | PASS | damage_curve_records_v1_3 (43 sheets) | Explicitly demoted to audit view vs JSON contract |
| 1.6 | Package | Previews | PASS | previews/ (v1_1 dashboard, v1_2 coverage, v1_3 derivation index) | Cover dashboard + audit sheets |
| 1.7 | Package | Archive of prior versions | PASS | archive/v1_0, v1_1, v1_2 | Three prior majors retained |
| 2.1 | Coverage | Primary nonzero unit identified | PASS | Dossier §1; JSON failure_units: PV_MODULE_GLASS_CELL | Single primary term, stated deliberately |
| 2.2 | Coverage | Conditioner-only equipment | PASS | Dossier §1/§16: MOUNTING/TRACKER conditioner-only | Stow affects module curve, not own curve |
| 2.3 | Coverage | Secondary/low-materiality reviewed | PASS | Dossier §16 table (RACKING, SCADA/MET) | Reviewed and tagged, not modeled |
| 2.4 | Coverage | DR≈0 buckets documented | PASS | Dossier §16; workbook Hail_Solar_Coverage | Each with reason |
| 2.5 | Coverage | No silent omission | PASS | Dossier §16 "not decorative" coverage table | Whole-plant sweep shown |
| 2.6 | Coverage | No weak curve padding | PASS | Dossier §1: "not forced into weak nonzero curves" | Explicit anti-padding stance |
| 3.1 | X-axis | Axis stated | PASS | Dossier §2; JSON HAIL_DIAMETER_MESH_EQUIV | mesh_diameter_mm |
| 3.2 | X-axis | Units/conversion | PASS | Spec §2 (mm/in); KAT two-inch conversion | 2 in → 50.8 mm verified |
| 3.3 | X-axis | Source-native availability | PASS | Dossier §2 NOAA Storm Events + MESH table | Hazard products give size, not KE |
| 3.4 | X-axis | Height/terrain bridge | N-A | — | Wind-family concept; not required for hail size |
| 3.5 | X-axis | Alternatives rejected/parked | PASS | Dossier §2 (KE parked), §10.1 (wind-driven hail) | Each parked with reason |
| 3.6 | X-axis | Physics bridge | PASS | Dossier §10: m(D), v(D) power-law fits | Labeled vertical-fall reference bridge |
| 3.7 | X-axis | Multivariate explicit | PASS | Spec §5.1 deferred wind-vector fields + MODEL_BEHAVIOR_CHANGE guard | Wind×stow deferred, not folded in |
| 4.1 | Derivation | y-axis precise | PASS | Dossier §4: DR ≈ P_break | Approximation stated with recalibration seam |
| 4.2 | Derivation | Evidence inventory with links | PASS | Dossier §3 + §20 URL table (12 sources) | Roles per evidence class |
| 4.3 | Derivation | Source-to-parameter map | PASS | Workbook Hail_Evidence_Params; JSON tier-table source_ids | Structure verified; values → parameter checker |
| 4.4 | Derivation | param_role grouping | PASS | JSON param_role on all 8 rows | curve_fit_shape / conditioner_adjustment / boundary_or_cap |
| 4.5 | Derivation | Per-parameter tier table | PASS | JSON parameter_tier_table (full column set) | Per-value audit → parameter checker |
| 4.6 | Derivation | Raw vs interpreted anchors | PASS | Dossier §7.1/§8/§9; IEC 25mm "near-zero anchor, not field damage" | Interpretation flagged as such |
| 4.7 | Derivation | Form alternatives discussed | PASS | Dossier §5 "Why logistic" | Light but documented rejection of step/overfit forms |
| 4.8 | Derivation | Form justified | PASS | Dossier §5: bounded, monotone, threshold-like, sparse anchors | Disclaims "nature is exactly logistic" |
| 4.9 | Derivation | Named rationale narrative | PASS | Dossier v2.5 addendum + JSON derivation_rationale | Source spine, demotions, tier mix |
| 4.10 | Derivation | Math shown | PASS | Dossier §7.2 two-anchor logit closed form; §8 least squares | Reviewer reproduced 0.39000 at 50 mm |
| 4.11 | Derivation | Assumptions registered | PASS | Workbook Hail_Assumption_Register (versioned) | |
| 4.12 | Derivation | Open seams + triggers | PASS | Dossier §17; per-row update_trigger; Open_Seams_Index | Trigger per placeholder |
| 5.1 | Selectors | Selectors fixed attributes | PASS | Dossier §11; spec §4 | module_archetype, glass fields |
| 5.2 | Selectors | Conditioners event-time | PASS | Spec §5 stow_state; dossier §13 | Command vs SCADA-confirmed distinguished |
| 5.3 | Selectors | Exposure scales value | PASS | Dossier §14.4; JSON exposure_logic | Explicitly does not change module DR |
| 5.4 | Selectors | Unknown/default defined | PASS | missing_selector_policy → default + flag; unknown stow → blend; KAT rejects unknown archetype | Default-with-flag |
| 5.5 | Selectors | Blends only for uncertain states | PASS | Dossier §13.2: P(stowed) "is not hail frequency" | Confusion explicitly forbidden |
| 5.6 | Selectors | Adjustments record form+source+tier+reasoning | PASS | JSON conditioner_logic (form, sources, T4, reasoning, open_seam) | Complete tuple for stow adjustment |
| 5.7 | Selectors | Std 07 field names | PASS | Std 07 lines 63–69 list these exact names | hail_solar is the std-07 reference example |
| 6.1 | Value | Unit → value bucket | PASS | JSON value_bucket PV_ARRAY_MODULE_EXPOSED + Solar_Map rows | Row-level traceability |
| 6.2 | Value | Basis labeled | PASS | NLR_Q1_2025 $/kWdc; denominator label travels | Physical vs installed kept distinct |
| 6.3 | Value | f_kind labeled | PASS | JSON f_kind=failure_unit_value_share; workbook Value_Link | |
| 6.4 | Value | Cap_L documented | PASS | Workbook Cap_Binding_Preflight; README demotes legacy 0.8 row | Legacy scenario retained but explicitly demoted |
| 6.5 | Value | Physical vs soft/sunk unmixed | PASS | DR0_NONPHYSICAL excluded row; 0.75/0.8 shares deprecated with reason | |
| 7.1 | Interface | Hazard inputs declared | PASS | Spec §2 | Required/optional flagged |
| 7.2 | Interface | Selectors/conditioners declared | PASS | Spec §4–6, §11–12 worked examples | |
| 7.3 | Interface | Failure-unit DRs first | PASS | Spec §10 | Value views optional |
| 7.4 | Interface | Distribution-ready emit | PASS | 5 modes, populated=[scalar_mean], null fields present | Exactly the checklist pattern |
| 7.5 | Interface | Financial views labeled | PASS | Dossier §1; spec requires value_profile_id_used | No implicit profile |
| 7.6 | Interface | Metadata flags | PASS | DEFAULT_SELECTOR_USED, stow placeholder, cap_sensitive; clamp_or_warn | |
| 7.7 | Interface | Capability machine-readable | PASS | capability_declaration.v2 in JSON + spec YAML | Duplicated consistently |
| 8.1 | Metrics | capability_declaration.v2 | PASS | JSON | Full v2 block |
| 8.2 | Metrics | Deterministic vs spread stated | PASS | curve_intrinsic_spread: not_carried | |
| 8.3 | Metrics | consumer_annual_metrics contract | PASS | Prerequisites + limitation_flags | |
| 8.4 | Metrics | spread_carried honest | PASS | not_carried everywhere | |
| 8.5 | Metrics | Per-event evaluation | PASS | caps_applied_inside_event_or_annual_simulation | Stated consumer obligation |
| 8.6 | Metrics | PML/VaR/TVaR withheld correctly | PASS | consumer_computable_from_validated_annual_loss_distribution; r7 corrected blanket withhold | Matches Std 10 §8 nuance |
| 8.7 | Metrics | Tail discloses missing vuln uncertainty | PASS | TAIL_CONDITIONAL_ON_DETERMINISTIC_VULNERABILITY flag | |
| 8.8 | Metrics | Preflight scoped | PASS | consumer_enforced_fail_closed; workbook rates scalar_bias_risk Med/High >65 mm | Scoped, not blanket |
| 9.1 | QA | JSON parses | PASS | python json.load verified | |
| 9.2 | QA | Required headers | PASS | bundle.v2, hail_solar, HAIL_SOLAR_PV_MODULE_V1, model v1.0, docs r7 | |
| 9.3 | QA | Curve records complete | PASS | 3 records with full field set | |
| 9.4 | QA | Load-bearing params in tier table | FLAG | Tier table has 8 rows, but unstowed `max_DR=1.0` — a declared evaluation-contract parameter — has no tier row | The "100% asymptote" assumption is untiered/unsourced |
| 9.5 | QA | Runtime helper evaluates form | PASS | KAT file (11 runtime + 2 selector + 4 value); reviewer re-evaluated 11/11 within 1e-12 | Single form (logistic); covered |
| 9.6 | QA | Legacy artifacts blocked | PASS | known_noncanonical_legacy_artifacts: capex-weighted legacy, non_canonical, reason given | Blocked by id |

**Readiness:** SITE-ADAPTABLE — selectors, conditioners (incl. probabilistic stow blend), and exposure inputs implemented and machine-readable with KATs; not CALIBRATED (public-source derivation, T4 stow and value-profile placeholders flagged).

**§11 answers:**
1. Logistic: bounded, monotone, threshold-like breakage with sparse public anchors (dossier §5); step and overfit forms argued away; form disclaimed as a controlled v1 choice.
2. Hail damage concentrates on module glass; PV_MODULE_GLASS_CELL is the single primary unit and every other subsystem is explicitly bucketed (dossier §1, §16); whole-asset blends affirmatively blocked as legacy.
3. JSON `parameter_tier_table` (8 rows: source_ids/tier/reasoning/update_trigger) + workbook Hail_Evidence_Params; per-value verification → parameter checker.
4. Missing archetype → default + DEFAULT_SELECTOR_USED; unknown archetype string → hard reject (KAT); unknown stow → blend; out-of-range → clamp_or_warn; no implicit value profile.
5. Dossier §17: BOM test reports → exact curves; claims → recalibrate P_break→DR; stow tests → replace +8 mm/0.90 placeholder; event wind data → contact-normal bridge; MESH swaths → exposure fraction.
6. Curve-intrinsic spread not carried; EAL/PML/VaR/TVaR gated to a consumer with a validated annual loss distribution, with the tail-conditionality flag required.
7. Yes, plausibly — deterministic curve near ~26–35% asset-share caps; answered by consumer_enforced_fail_closed caps inside simulation and the workbook preflight rating.

**Notable:** metrics contract unusually honest (r7 blanket-withhold correction); KATs fully reproducible. Minor: untiered max_DR=1.0, and legacy 0.8 at-risk rows coexist with current profiles (demoted in prose only).

---

## flood_solar

Version reviewed: `current/` — model v1.0, docs r4 runtime pin; docs r5 basics layer. FLAGs: 0.

| # | Section | Item | Verdict | Evidence | Note |
|---|---------|------|---------|----------|------|
| 1.1 | Package | README + snapshot tree | PASS | current/README_flood_solar_v1_0.md (tree L10–35) | Covers primary/conditional/modifier/DR≈0 tiers |
| 1.2 | Package | Derivation dossier | PASS | flood_solar_curve_derivation_dossier_v1_0.md | Incl. v2.5 hardening addendum |
| 1.3 | Package | Metadata spec | PASS | flood_solar_damage_code_metadata_spec_v1_0.md | Inputs/selectors/conditioners/outputs + capability v2 |
| 1.4 | Package | Canonical JSON artifact | PASS | flood_solar__model_v1_0__docs_r4__curve_artifact.json | canonical_runtime_artifact: true |
| 1.5 | Package | Workbook audit view | PASS | damage_curve_records_v1_0 (17 sheets, verified) | Coverage/Evidence/Value_Link/QA/Dashboard |
| 1.6 | Package | Previews | PASS | previews/ v1_0 dashboard + coverage PNGs | |
| 1.7 | Package | Archive | PASS | archive/v0_1/ full package | |
| 2.1 | Coverage | Primary units identified | PASS | Dossier §4; spec §6 (FS_INV/SWG/XFMR/COMB/SCADA) | Five depth-driven electrical primaries |
| 2.2 | Coverage | Conditioner-only identified | PASS | README tree; dossier §4 | Drainage/defense/freeboard as modifiers |
| 2.3 | Coverage | Secondary reviewed | PASS | Dossier §4; MODEL_REFERENCE L66–67 | Civil/racking reviewed, "no runtime record" |
| 2.4 | Coverage | DR≈0 documented | PASS | README tree; dossier §4 | Above-waterline bucket stated |
| 2.5 | Coverage | No silent omission | PASS | MODEL_REFERENCE coverage table; Value_Link | Omissions named with reasons |
| 2.6 | Coverage | No weak curve padding | PASS | FS_FOUND labeled T4 placeholder (dossier §7.3) | Placeholder labeled; no fake curves |
| 3.1 | X-axis | Axis stated | PASS | FLOOD_LOCAL_DEPTH_COMPONENT_DATUM | Local depth above component datum |
| 3.2 | X-axis | Units/conversion | PASS | m, valid 0–2, clamp_or_warn; WSE→local depth | |
| 3.3 | X-axis | Source-native availability | PASS | Spec §2 (WSE preferred, site depth fallback) | |
| 3.4 | X-axis | Bridge implemented/fail-closed | PASS | h_i=max(0,WSE−z_i_crit); missing datum "must not be replaced silently" | Datum bridge implemented |
| 3.5 | X-axis | Alternatives rejected | PASS | Dossier §5 (plant-level depth rejected; depth×duration parked) | Mechanism-argued |
| 3.6 | X-axis | Physics bridge | PASS | Transform is a tiered parameter (T2 axis_bridge) | |
| 3.7 | X-axis | Multivariate explicit | PASS | Velocity own axis; duration/salinity conditioners/seams | |
| 4.1 | Derivation | y-axis precise | PASS | failure_unit_damage_ratio; MODEL_REFERENCE L39 | Repair cost ÷ unit replacement value |
| 4.2 | Derivation | Evidence inventory | PASS | Dossier §3 (URLs + what each source does NOT support) | |
| 4.3 | Derivation | Source-to-parameter map | PASS | JSON source_ids; workbook Flood_Evidence_Params | Values → parameter checker |
| 4.4 | Derivation | param_role grouping | PASS | axis_bridge / curve_fit_shape / open_seam_placeholder / conditioner_adjustment | |
| 4.5 | Derivation | Tier table exists | PASS | 9 rows, full columns | |
| 4.6 | Derivation | Raw vs interpreted separated | PASS | Dossier §8; absence of raw numeric anchors stated, ordinates labeled T3 | |
| 4.7 | Derivation | Form alternatives | PASS | Dossier §6 table (step, logistic, piecewise, discrete states) | |
| 4.8 | Derivation | Form justified | PASS | State-like ingress + HEC-FIA precedent | Mechanism-grounded |
| 4.9 | Derivation | Named rationale | PASS | v2.5 addendum + JSON derivation_rationale | |
| 4.10 | Derivation | Math shown | PASS | Ordinate tables + per-row rationale; honestly labeled T3 parameterization | |
| 4.11 | Derivation | Assumptions registered | PASS | Dossier §8; Flood_Assumption_Register | |
| 4.12 | Derivation | Seams + triggers | PASS | Dossier §13 (7 seams); per-row triggers; docs-r2 memo | |
| 5.1 | Selectors | Fixed attributes | PASS | enclosure_rating, transformer_type, cable rating, mounting | |
| 5.2 | Selectors | Conditioners event-time | PASS | energized_state, shutdown, duration, contamination | conduit_water_path_present classed as open-seam flag |
| 5.3 | Selectors | Exposure scales value | PASS | fraction_value_exposed; dossier §9 explicit | |
| 5.4 | Selectors | Unknown/default defined | PASS | unknown enums, open_seam_flags, fail-closed datum/value basis | Withholds rather than defaults |
| 5.5 | Selectors | Blends scoped | PASS | Dossier §10 policy; no blends implemented in v1.0 | |
| 5.6 | Selectors | Adjustments recorded | PASS | CONDUIT_PATH_FLAG_V1, ELEVATION_SHIFT_V1 carry all four fields | |
| 5.7 | Selectors | Std 07 names | PASS | Aliases recorded (equipment_ip_or_nema_rating etc.); legacy field mapped | |
| 6.1 | Value | Units → buckets | PASS | Value_Link (all 8 units) | Substrate vocabulary |
| 6.2 | Value | Basis labeled | PASS | physical_value_usd / physical_share / installed_share | |
| 6.3 | Value | f_kind labeled | PASS | Value_Link f_kind; JSON f_kind: site_geometry | |
| 6.4 | Value | Cap_L | PASS | cap_L_usd per unit | |
| 6.5 | Value | Unmixed | PASS | "hardware only" notes; separate installed_share | |
| 7.1 | Interface | Hazard inputs | PASS | Spec §2 + conditional velocity input | |
| 7.2 | Interface | Selectors/conditioners declared | PASS | Spec §§4–5 with required-ness levels | |
| 7.3 | Interface | DRs first | PASS | Spec §7; EAL/PML explicit non-goals (§9) | |
| 7.4 | Interface | Distribution-ready emit | PASS | scalar_mean + discrete_state_table; state table correctly deterministic | |
| 7.5 | Interface | Financial views labeled | PASS | Site_Applied_Loss flagged "class-template teaching material" | |
| 7.6 | Interface | Metadata flags | PASS | open_seam_flags, evidence_tier, clamp_or_warn | |
| 7.7 | Interface | Capability machine-readable | PASS | v2 in JSON + spec YAML, consistent | |
| 8.1 | Metrics | v2 populated | PASS | CHANGELOG r4 records contract change | |
| 8.2 | Metrics | Deterministic stated | PASS | not_carried; "deterministic state/depth curves" | |
| 8.3 | Metrics | Annual-metrics contract | PASS | Prerequisites + limitation_flags | |
| 8.4 | Metrics | spread honest | PASS | not_supported declared | |
| 8.5 | Metrics | Per-event evaluation | PASS | sampled coupling + in-sim caps prerequisites | |
| 8.6 | Metrics | PML withholding correct | PASS | consumer_computable…; v2.5→v2 supersession noted | |
| 8.7 | Metrics | Tail disclosure | PASS | TAIL_CONDITIONAL_ON_DETERMINISTIC_VULNERABILITY | |
| 8.8 | Metrics | Preflight scoped | PASS | consumer_enforced_fail_closed with checks + action_if_fail | |
| 9.1 | QA | Parses | PASS | Verified | |
| 9.2 | QA | Headers | PASS | bundle.v2 / flood_solar / FLOOD_SOLAR_ELECTRICAL_INUNDATION_V1 / v1.0 / r4 | |
| 9.3 | QA | Records complete | PASS | 8/8 verified programmatically | |
| 9.4 | QA | Params in tier table | PASS | 8 point sets + transform, all covered | |
| 9.5 | QA | Runtime evaluation | PASS | Runtime notebook; reviewer evaluated FS_INV (h=0.10→DR=0.50; clamp verified) | No committed KAT file — gap self-declared in MODEL_REFERENCE §10 |
| 9.6 | QA | Legacy blocked | PASS | CHANGELOG r3 supersession + pin instructions | |

**Readiness:** SITE-ADAPTABLE — selectors, conditioners, exposure geometry and the local-depth transform implemented with fail-closed missing-metadata behavior; T3/T4 parameterizations mean CALIBRATED is not reached.

**§11 answers:**
1. Piecewise-linear state/depth curves: flood electrical damage is threshold/ingress-state-like with HEC-FIA precedent; step and logistic explicitly rejected (dossier §6).
2. One site flood level produces different local exposure per component elevation/pathway; whole-plant curve rejected; 8 units with distinct replacement logic.
3. JSON tier table maps every point set + transform to source_ids/tier/reasoning/update_trigger; values → parameter checker.
4. Fail-closed: missing datum/value basis withheld, "unknown" enums → open_seam_flags, out-of-range clamps-or-warns; scenario loss withheld without explicit value basis.
5. Dossier §13: claims/OEM depth-damage data replaces T3 ordinates; site survey supplies elevations; geotech replaces FS_FOUND; transformer-type/salinity/duration parked for v1.1.
6. Intrinsic spread not carried; EAL/PML/VaR/TVaR consumer-computable only from a validated frequency-driven distribution with in-sim caps and the deterministic-vulnerability flag preserved.
7. Yes if caps were applied post-hoc: Cap_L = physical bucket value and several curves saturate at DR=1.0 by 0.3–0.6 m — capability v2 correctly requires caps inside the event simulation (fail-closed).

**Notable:** exemplary machine-readable metrics honesty; disciplined withholding (FS_FOUND labeled, no fake civil/racking curves). Documented gaps worth fixing: no committed KAT file, and the runtime notebook still references removed docs-r3 paths/capability-v1 keys.

---

## wildfire_solar

Version reviewed: `current/` — model v1.0, docs r3. FLAGs: 3 (§1×1, §4×2).

| # | Section | Item | Verdict | Evidence | Note |
|---|---------|------|---------|----------|------|
| 1.1 | Package | README + tree | PASS | Cell README "Current runtime package"; current README "Main files" | Linked inventory, complete |
| 1.2 | Package | Dossier | PASS | dossier__model_v1_0__docs_r3.md §§1–10 | |
| 1.3 | Package | Metadata spec | PASS | Spec with error codes + capability boundary | |
| 1.4 | Package | JSON artifact | PASS | canonical_runtime_artifact: true | |
| 1.5 | Package | Workbook | PASS | 8 sheets verified vs manifest | |
| 1.6 | Package | Previews | FLAG | previews/ holds only v0_1 PNGs | No v1.0 previews despite validation report's "every sheet rendered" claim — stale-preview gap |
| 1.7 | Package | Archive | PASS | proposed/ retains full v0.1; runtime-prohibited | No archive/ dir but history retained + demoted |
| 2.1 | Coverage | Primary units | PASS | 10 units with treatment labels | |
| 2.2 | Coverage | Conditioner-only | N-A | No conditioner-only equipment class; site controls are no-credit conditioners | |
| 2.3 | Coverage | Secondary reviewed | PASS | reviewed_low_nonzero_screening_proxy (foundation, grounding) | |
| 2.4 | Coverage | DR≈0 documented | PASS | "Low-response, not automatic immunity" argued | |
| 2.5 | Coverage | No silent omission | PASS | Exclusions (BESS, smoke/ash, PSPS, BI) loud and scoped | |
| 2.6 | Coverage | No padding | PASS | Curves only where burn pathway argued | |
| 3.1 | X-axis | Stated | PASS | FSim conditional flame-length class 1–6 (+0) | |
| 3.2 | X-axis | Units/conversion | PASS | source_native_categorical_class; "no interpolation or midpoint conversion" | Conversion prohibited by design |
| 3.3 | X-axis | Source-native | PASS | FSim RDS-2016-0034-3 DOI; six conditional bins | |
| 3.4 | X-axis | Height/terrain bridge | N-A | Not applicable to categorical fire-class axis | |
| 3.5 | X-axis | Alternatives | PASS | why_not_continuous_FLI_curve; rejected FLI logistic named/blocked | |
| 3.6 | X-axis | Physics bridge | PASS | FLI→heat-flux bridge explicitly fail-closed with citation | |
| 3.7 | X-axis | Multivariate | PASS | burn_probability rejected (FREQUENCY_FIELD_NOT_ALLOWED…) | Frequency/severity split is a hard contract |
| 4.1 | Derivation | y-axis precise | PASS | Conditional-expectation definition, bounded | |
| 4.2 | Derivation | Evidence inventory | PASS | DOIs/URLs; Sources sheet; source_registers (41 IDs) | |
| 4.3 | Derivation | Source-to-parameter map | PASS | Tier table with curve_id + source_ids per row | Values → parameter checker |
| 4.4 | Derivation | param_role grouping | FLAG | 0 occurrences of param_role/parameter_nature in artifact + dossier | Grouping by curve_id/tier only; required field absent |
| 4.5 | Derivation | Tier table shape | FLAG | Has parameter/tier/source_ids/reasoning/update_trigger; `value` on 2 of 9 rows, no `role` column | Substantively usable (values in ORDINATE_TABLE csv) but not the required column shape |
| 4.6 | Derivation | Raw vs interpreted | PASS | §5.1 constraints vs §5.2 T4 anchors vs §5.3 checks | T4 nature never disguised |
| 4.7 | Derivation | Alternatives discussed | PASS | Continuous logistic vs categorical table; decision log retained | |
| 4.8 | Derivation | Form justified | PASS | Categorical state table matches source-native resolution | |
| 4.9 | Derivation | Named rationale | PASS | derivation_rationale + dossier §§5–6 | |
| 4.10 | Derivation | Math shown | PASS | §6 assembly equations; T4 ordinates honestly rule-based | |
| 4.11 | Derivation | Assumptions | PASS | Assumptions sheet; allocation flagged | |
| 4.12 | Derivation | Seams + triggers | PASS | Dossier §10 + per-row triggers | |
| 5.1 | Selectors | Fixed | PASS | model_grade, value_profile_id | |
| 5.2 | Selectors | Event-time | PASS | Mitigation conditioners, numeric_effect none, no_credit default with reason | |
| 5.3 | Selectors | Exposure→value | PASS | site values replace reference without changing DRs; cable double-discount forbidden | |
| 5.4 | Selectors | Unknown/default | PASS | 8-condition missing/invalid table with reject codes | Fail-closed |
| 5.5 | Selectors | Blends scoped | PASS | FLP mode = class uncertainty; burn_probability prohibited | |
| 5.6 | Selectors | Adjustments recorded | N-A | No numeric adjustments exist (documented no-credit policy) | |
| 5.7 | Selectors | Std 07 names | PASS | No applicable alias conflicts; internally consistent | |
| 6.1 | Value | Units → buckets | PASS | 10/10 keyed to Solar_Map rows; reconciles | |
| 6.2 | Value | Basis | PASS | 2024 USD/kWdc; ratio 0.7837461628 explicit | |
| 6.3 | Value | f_kind | PASS | No literal field; allocation_rule per row makes fraction kind unambiguous | |
| 6.4 | Value | Cap_L | N-A | Not computed; caps consumer-owned | |
| 6.5 | Value | Unmixed | PASS | Excluded soft value 242.204 USD/kWdc carried explicitly | |
| 7.1 | Interface | Hazard inputs | PASS | Two exclusive modes (enum + FLP vector) | |
| 7.2 | Interface | Declared | PASS | Incl. cable/value-profile interaction | |
| 7.3 | Interface | DRs first | PASS | Financial assembly opt-in with explicit basis | |
| 7.4 | Interface | Emit | PASS | damage_emit.v1, populated [scalar_mean] | |
| 7.5 | Interface | Views labeled | PASS | profile_grade: screening_reference_not_site_appraisal | |
| 7.6 | Interface | Flags | PASS | SCREENING_ENGINEERING_PROXY, NOT_FIELD_CALIBRATED etc. mandatory | |
| 7.7 | Interface | Capability | PASS | Embedded == standalone (verified equal) | |
| 8.1 | Metrics | v2 populated | PASS | Verified | |
| 8.2 | Metrics | Deterministic stated | PASS | Sensitivity explicitly "not uncertainty" | |
| 8.3 | Metrics | Annual contract | PASS | 5 prerequisites + flags | |
| 8.4 | Metrics | spread honest | PASS | Consistent everywhere | |
| 8.5 | Metrics | Per-event | PASS | Consumer sampling/aggregation validated prerequisite | |
| 8.6 | Metrics | PML withholding | PASS | consumer_computable… — not blanket-withheld | |
| 8.7 | Metrics | Tail disclosure | PASS | Flags travel with metrics | |
| 8.8 | Metrics | Preflight scoped | PASS | 4 named checks, withhold action | |
| 9.1 | QA | Parses | PASS | Artifact + KAT + capability | |
| 9.2 | QA | Headers | PASS | All five fields | |
| 9.3 | QA | Records complete | PASS | 10/10; piecewise_linear as exact-state container, interpolation contract-prohibited | |
| 9.4 | QA | Params in table | PASS | Grouped coverage of all 10 curve_ids + value basis + allocation | Numeric audit → parameter checker |
| 9.5 | QA | Runtime evaluation | PASS | 29 executable KATs; reviewer reproduced state-4 physical DR 0.11213061269215763 | |
| 9.6 | QA | Legacy blocked | PASS | v0.1 scaffold + FLI logistic proxy, runtime_use: prohibited | |

**Readiness:** SITE-ADAPTABLE — selectors, declared no-credit conditioners, exposure/value inputs and fail-closed errors implemented and KAT-covered; explicitly not CALIBRATED and says so everywhere.

**§11 answers:**
1. Exact categorical FSim-class state table because FSim publishes classes, not component heat flux; the v0.1 continuous FLI logistic was rejected as a false-precision converter and is named/blocked.
2. Ten units matching distinct thermal mechanisms and separately valued cost rows, so each T4 ordinate is independently replaceable.
3. Tier table (T2 hazard semantics/values, T4 ordinates/allocation) + ORDINATE_TABLE reasoning; values → parameter checker.
4. Fail-closed with named codes; missing value basis withholds scenario loss but keeps DR; unknown mitigation gets no credit.
5. Dossier §10's seven triggers (paired exposure+disposition data, claims by unit, full-scale tests, routing data, FSim transfer, insurer separation, site profiles) + per-row triggers.
6. Intrinsic spread/distributions; annual metrics without a validated consumer distribution; scenario loss without explicit value basis — always flagged screening/not-calibrated.
7. Low from the curve itself (DR ≤ 0.9/unit, ≤ 0.583 aggregate) but correctly made a consumer preflight (uncapped-vs-capped comparison, withhold-on-fail).

**Notable:** exemplary honesty architecture (T4 loudly labeled; rejected bridge stays rejected). FLAGs: tier-table shape deviates from the standard (no param_role, values external); previews stale at v0.1.

---

## strong_wind_solar

Version reviewed: `current/` — model v1.0, docs r3 runtime pin (package docs r1, basics r4). Non-canonical `proposed/` v2.0 exists — noted, not reviewed. FLAGs: 4 (§3×1, §5×1, §6×1, §9×1).

| # | Section | Item | Verdict | Evidence | Note |
|---|---------|------|---------|----------|------|
| 1.1 | Package | README + tree | PASS | current/README §1; cell README | Full unit/conditioner/exposure/DR≈0 tree |
| 1.2 | Package | Dossier | PASS | 12 sections + v2.5 addendum | |
| 1.3 | Package | Metadata spec | PASS | YAML interface + capability v2 | |
| 1.4 | Package | JSON artifact | PASS | canonical_runtime_artifact: true | |
| 1.5 | Package | Workbook | PASS | 18 sheets verified vs manifest | |
| 1.6 | Package | Previews | PASS | v1_0 dashboard + coverage; v0_1 retained | |
| 1.7 | Package | Archive | PASS | archive/v0_1/ (5 files) | |
| 2.1 | Coverage | Primary units | PASS | Tracker, racking, module-attach, foundation + secondary SCADA | |
| 2.2 | Coverage | Conditioner-only | PASS | Stow state/angle/control availability, row orientation | |
| 2.3 | Coverage | Secondary reviewed | PASS | Cables/inverter/substation named with mechanism rationale | |
| 2.4 | Coverage | DR≈0 documented | PASS | README tree; StrongWind_Coverage sheet | |
| 2.5 | Coverage | No silent omission | PASS | Debris-hit-only conditional named; tornado split declared | |
| 2.6 | Coverage | No padding | PASS | Cables/inverters deliberately not curved; tornado deferred, not faked | |
| 3.1 | X-axis | Stated | PASS | SWS_GUST_3S_ARRAY_HEIGHT; native axis R_eff | |
| 3.2 | X-axis | Units/conversion | PASS | mph, m/s convertible; averaging-time discipline | |
| 3.3 | X-axis | Source-native | PASS | X_Axis_Decision sheet; design-speed normalization argued | |
| 3.4 | X-axis | Height/terrain bridge | FLAG | Spec §2 wind_height_basis is a naming field only | No conversion implemented; mismatch not fail-closed — basics concedes fix arrives only in proposed v2. Terrain multiplier an open seam |
| 3.5 | X-axis | Alternatives | PASS | "Why not raw wind speed / EF rating" | EF/tornado parked to future cell |
| 3.6 | X-axis | Physics bridge | PASS | q=0.5ρV²; R_eff=(V/V_design)² × multipliers (T2) | |
| 3.7 | X-axis | Multivariate | PASS | Direction/duration optional/open-seam; stow/zone as demand multipliers | Nothing smuggled into the axis |
| 4.1 | Derivation | y-axis precise | PASS | failure_unit_damage_ratio; denominator pinned | |
| 4.2 | Derivation | Evidence inventory | PASS | Six source families, supports/does-not-support columns | |
| 4.3 | Derivation | Map exists | PASS | source_ids + Evidence_Params sheet | Values → parameter checker |
| 4.4 | Derivation | param_role | PASS | Five roles across 26 rows | |
| 4.5 | Derivation | Tier table | PASS | 26 rows, full columns, verified complete | |
| 4.6 | Derivation | Raw vs interpreted | PASS | No raw anchors exist; everything declared T4 interpreted fit — honest by construction | |
| 4.7 | Derivation | Alternatives | PASS | Six forms rejected with reasons | |
| 4.8 | Derivation | Form justified | PASS | Threshold + logistic heterogeneity + bounded | |
| 4.9 | Derivation | Named rationale | PASS | Addendum + JSON derivation_rationale | |
| 4.10 | Derivation | Math shown | PASS | Bridge math shown; shape params declared T4 judgment — stated, not hidden | |
| 4.11 | Derivation | Assumptions | PASS | Assumption_Register + evidence-status vocabulary | |
| 4.12 | Derivation | Seams + triggers | PASS | Dossier §11 (6 seams) + per-row triggers | |
| 5.1 | Selectors | Fixed | PASS | design_gust_mph, mounting_type, clamp/foundation types | |
| 5.2 | Selectors | Event-time | PASS | stow_state, stow probability, control availability | |
| 5.3 | Selectors | Exposure→value | PASS | exposure fraction scales value; zone_multiplier moves demand, explicitly justified | |
| 5.4 | Selectors | Unknown/default | FLAG | Zone defaults 1.0; `mounting_type: unknown` allowed with no stated resolution; stow-missing path unstated | Principle exists ("unknown must not be zero") but never operationalized in v1; v2 proposal fail-closes instead |
| 5.5 | Selectors | Blends scoped | PASS | p·0.80+(1−p)·1.25 restricted to stow uncertainty | |
| 5.6 | Selectors | Adjustments recorded | PASS | SWS_STOW_DEMAND_MULTIPLIER_V1 complete | |
| 5.7 | Selectors | Std 07 names | PASS | stow vocabulary variants explicitly recorded | |
| 6.1 | Value | Units → buckets | PASS | 8/6/40/8/2% shares, labeled illustrative T4 | |
| 6.2 | Value | Basis | PASS | TIV $112.0M vs physical base $87.8M, both named | |
| 6.3 | Value | f_kind | FLAG | Labeled in archive/v0_1 dossier; absent from all current/ docs | Label dropped in v1.0 with no alias note — labeling regression |
| 6.4 | Value | Cap_L | PASS | Aggregate cap 0.408 shown and explicitly de-certified as plant maximum | |
| 6.5 | Value | Unmixed | PASS | Physical base carved out of TIV | |
| 7.1 | Interface | Hazard inputs | PASS | Typed gust/height/direction/duration | |
| 7.2 | Interface | Declared | PASS | Required/conditional/optional lists match JSON | |
| 7.3 | Interface | DRs first | PASS | "Does not compute EAL"; 5 DR outputs | |
| 7.4 | Interface | Emit | PASS | damage_emit.v1, scalar-now/distribution-ready | |
| 7.5 | Interface | Views labeled | PASS | Dashboard $ outputs demoted to severity outputs | |
| 7.6 | Interface | Flags | PASS | generic_engineering_fit, not_claims_calibrated, tornado deferred, cascade flag; warn_or_clamp | |
| 7.7 | Interface | Capability | PASS | v2 in JSON + spec YAML | |
| 8.1 | Metrics | v2 populated | PASS | Full blocks | |
| 8.2 | Metrics | Deterministic stated | PASS | not_carried, consistent | |
| 8.3 | Metrics | Annual contract | PASS | 5 prerequisites + flags | |
| 8.4 | Metrics | spread honest | PASS | No phantom distribution | |
| 8.5 | Metrics | Per-event | PASS | Contractually imposed on consumer | |
| 8.6 | Metrics | PML withholding | PASS | r2→r3 correction documented in-place | Exactly the checklist distinction |
| 8.7 | Metrics | Tail disclosure | PASS | TAIL_CONDITIONAL… flag | |
| 8.8 | Metrics | Preflight scoped | PASS | not_evaluated_by_damage_artifact + consumer checks | |
| 9.1 | QA | Parses | PASS | Verified | |
| 9.2 | QA | Headers | PASS | Repo-canonical field names | |
| 9.3 | QA | Records complete | PASS | 5 records, uniform thresholded_logistic_demand | |
| 9.4 | QA | Params in table | PASS | Zero curve params missing (programmatic cross-check) | |
| 9.5 | QA | Runtime evaluation | FLAG | No helper or KAT file in current/ (KATs only in proposed/ v2.0); QA_Checks sheet only | Reviewer evaluated the form from JSON and reproduced dossier §10 exactly (R_eff=1.4283 @140 mph, $32.95M) — form sound, but no machine check ships |
| 9.6 | QA | Legacy blocked | PASS | r2 superseded; v2 proposal explicitly non-canonical in three places | |

**Readiness:** SITE-ADAPTABLE — selectors/conditioners/exposure implemented in the runtime contract and workbook; CALIBRATED correctly out of reach (all shape params, stow multipliers, value shares T4).

**§11 answers:**
1. Thresholded logistic on a speed-squared demand ratio: threshold-like damage with plant heterogeneity near threshold; six alternatives rejected in dossier §6.
2. Wind loads distinct structural pathways (tracker torsion, racking uplift, clamp release, pile pullout, exposed instruments) with distinct capacities and value buckets; whole-plant curve would hide the value-link structure.
3. 26-row tier table (axis bridge T2, everything numeric T4) with source_ids/role/reasoning/trigger per row; values → parameter checker.
4. Partially defined: zone defaults 1.0, warn_or_clamp extrapolation, principle stated — but unknown mounting/stow has no operational rule in v1 (FLAG 5.4); v2 proposal fail-closes.
5. Per-row triggers + dossier §11: claims calibration replaces T4 shapes; aeroelastic data calibrates stow; clamp/foundation selectors split families; cascade rule; tornado becomes its own cell.
6. Intrinsic spread and artifact-computed EAL/PML/VaR/TVaR; annual metrics consumer-computable only from a validated distribution with both flags preserved.
7. Yes in principle — five capped unit curves plus a cascade correlation seam; addressed by per-event capped simulation required fail-closed, though the artifact performs no preflight itself.

**Notable:** r2→r3 capability correction documented in-place; reviewer reproduction to the cent. Weakest x-axis discipline among canonical cells: height bridge named but unenforced, unknown-selector behavior unoperationalized, no KATs — all closed only in the pending non-canonical v2 proposal.

---

## wind_tornado_wind

Version reviewed: `current/` — model v1.0, docs r4 runtime pin (cell README docs r5). FLAGs: 2 (§4×1, §9×1).

| # | Section | Item | Verdict | Evidence | Note |
|---|---------|------|---------|----------|------|
| 1.1 | Package | README + tree | PASS | "One-screen snapshot" (L41–73) | |
| 1.2 | Package | Dossier | PASS | 12 sections + r2/r3 addenda | |
| 1.3 | Package | Metadata spec | PASS | Identity/inputs/selectors/outputs/capability v2 | |
| 1.4 | Package | JSON artifact | PASS | canonical_runtime_artifact: true; pinned in README + CHANGELOG | |
| 1.5 | Package | Workbook | PASS | 22 sheets incl. Curve_Params, Value_Link, QA_Checks | |
| 1.6 | Package | Previews | PASS | v1_0 dashboard + coverage | |
| 1.7 | Package | Archive | PASS | archive/v0_1/ complete | |
| 2.1 | Coverage | Primary units | PASS | Blade, tower, nacelle, foundation with rationale table | |
| 2.2 | Coverage | Conditioner-only | PASS | Pitch, brake, yaw, operating state | |
| 2.3 | Coverage | Secondary reviewed | PASS | SCADA, collection, substation, civil; WT_POWER_ELEC_ACCEL as open seam | |
| 2.4 | Coverage | DR≈0 documented | PASS | "Outside footprint/below threshold" buckets | |
| 2.5 | Coverage | No silent omission | PASS | All wind-farm value buckets covered; footprint-gated | |
| 2.6 | Coverage | No padding | PASS | ACCEL excluded from default aggregate with reason | |
| 3.1 | X-axis | Stated | PASS | Hub-height 3s gust; internal ratio r=V/Ve50 | |
| 3.2 | X-axis | Units/conversion | PASS | Ve50=1.4×Vref, IEC table, power/log law | |
| 3.3 | X-axis | Source-native | PASS | 10m gust accepted only via bridge | |
| 3.4 | X-axis | Height/terrain bridge | PASS | Default alpha 1/7 flagged; fail-closed MISSING_HEIGHT_BRIDGE | Implemented and flagged — strong |
| 3.5 | X-axis | Alternatives | PASS | 10m speed, EF-axis, whole-farm all rejected; EF kept as proxy bridge only | |
| 3.6 | X-axis | Physics bridge | PASS | IEC table sourced, T2 | |
| 3.7 | X-axis | Multivariate | PASS | Tornado = D50-shift variant + exposure fraction, not second axis | Honest proxy treatment |
| 4.1 | Derivation | y-axis precise | PASS | Per-failure-unit DR of value bucket | |
| 4.2 | Derivation | Evidence inventory | PASS | 7 public sources + docs r2 ingested set, URLs | |
| 4.3 | Derivation | Map exists | PASS | §5 table + per-row source_ids | Values → parameter checker |
| 4.4 | Derivation | param_role | PASS | Four roles per row | |
| 4.5 | Derivation | Tier table | PASS | 22 rows, full columns | |
| 4.6 | Derivation | Raw vs interpreted | PASS | Evidence roles vs engineering-fit labels | |
| 4.7 | Derivation | Alternatives | PASS | Step, farm table, piecewise-state, empirical, aeroelastic | |
| 4.8 | Derivation | Form justified | PASS | Bounded, monotone, parameter-light, NIST framing | |
| 4.9 | Derivation | Named rationale | PASS | Addendum + machine-readable copy | |
| 4.10 | Derivation | Math shown | FLAG | §7 gives final table; no worked D50/k derivation (e.g. how EF4 anchor → 1.38) | T4 labeling honest, but the fit path from anchors to specific ratios is asserted, not shown |
| 4.11 | Derivation | Assumptions | PASS | 5 load-bearing assumptions + register | |
| 4.12 | Derivation | Seams + triggers | PASS | §11–12 + "honest gap" + dependency matrix | |
| 5.1 | Selectors | Fixed | PASS | iec_wind_class, hub_height_m, turbine_model | |
| 5.2 | Selectors | Event-time | PASS | operating/feathered/yaw/brake/grid states | |
| 5.3 | Selectors | Exposure→value | PASS | "Modifies value affected, not per-turbine fragility" | |
| 5.4 | Selectors | Unknown/default | PASS | Default IEC II; unknown enums; flagged default alpha; fail-closed bridge | |
| 5.5 | Selectors | Blends | N-A | No blends in v1.0 (conditioners qualitative-only) | |
| 5.6 | Selectors | Adjustments recorded | PASS | WT_TORNADO_D50_SHIFT_V1 complete (form, 3 sources, T4, reasoning, seam) | |
| 5.7 | Selectors | Std 07 names | PASS | iec_wind_class alias turbine_class recorded per standard | |
| 6.1 | Value | Units → buckets | PASS | Shares ≈0.79 + 0.037 secondary (turbine bundle) | |
| 6.2 | Value | Basis | PASS | "Physical replaceable base" on every row | |
| 6.3 | Value | f_kind | N-A | No f_kind vocabulary; shares explicitly physical-base | No ambiguity to resolve |
| 6.4 | Value | Cap_L | N-A | Not computed; caps consumer-owned | |
| 6.5 | Value | Unmixed | PASS | DRs kept separate from financial metrics | |
| 7.1 | Interface | Hazard inputs | PASS | Preferred/tornado_bridge/optional_upstream | |
| 7.2 | Interface | Declared | PASS | hub_height_m conditionally required — correct | |
| 7.3 | Interface | DRs first | PASS | primary_grain: failure_unit | |
| 7.4 | Interface | Emit | PASS | 5 modes, scalar_mean populated, nulls present | |
| 7.5 | Interface | Views labeled | PASS | Site_Applied_Loss = audit view | |
| 7.6 | Interface | Flags | PASS | DEFAULT_POWER_LAW_ALPHA_USED, MISSING_HEIGHT_BRIDGE, open_seams, dependency_flags | |
| 7.7 | Interface | Capability | PASS | v2 duplicated consistently | |
| 8.1 | Metrics | v2 populated | PASS | Enforced by validate_runtime_contracts.py | |
| 8.2 | Metrics | Deterministic stated | PASS | not_carried | |
| 8.3 | Metrics | Annual contract | PASS | Complete prerequisites | |
| 8.4 | Metrics | spread honest | PASS | | |
| 8.5 | Metrics | Per-event | PASS | Explicit consumer requirement | |
| 8.6 | Metrics | PML withholding | PASS | v2.5 blanket withhold superseded in r4 — correct fix | |
| 8.7 | Metrics | Tail disclosure | PASS | Both flags | |
| 8.8 | Metrics | Preflight scoped | PASS | Withhold-or-full-simulation action | |
| 9.1 | QA | Parses | PASS | Verified | |
| 9.2 | QA | Headers | PASS | WIND_TORNADO_WIND_V1, v1.0, r4 | |
| 9.3 | QA | Records complete | PASS | 5 records, wind_tornado_logistic_ratio | |
| 9.4 | QA | Params in table | FLAG | Tier table covers curve params + bridges, but load-bearing `default_value_share_physical_base` values (0.173/0.169/0.345/0.062/0.037) have no tier rows | Value shares drive loss yet sit outside the tier/sourcing structure |
| 9.5 | QA | Runtime evaluation | PASS | Shared helper implements the form; reviewer evaluated blade curve (r=1.38→0.5000, r=1.513→0.831) | No cell-local KAT file in current/ (only in proposed/) |
| 9.6 | QA | Legacy blocked | PASS | r3 superseded; proposed v2.0 blocked; pin stated in three places | |

**Readiness:** SITE-ADAPTABLE — selectors (IEC class/Ve50, hub height), tornado variant, exposure fraction, and the height bridge with fail-closed/default flags all implemented; conditioners honestly qualitative. Not CALIBRATED: D50/k and shifts are T4.

**§11 answers:**
1. Bounded logistic on V/Ve50 — sparse public data + NIST fragility framing; five alternatives rejected; tornado as D50 shift, not a fake independent curve.
2. Repeated-unit structural bundles (blade/tower/nacelle/foundation): extreme wind concentrates in the superstructure; whole-farm curve would bury exposure/double-counting decisions.
3. 22-row tier table + dossier §5 evidence map; values → parameter checker. Note the value-share gap at 9.4.
4. Default IEC II; unknown enums; missing height fails closed (MISSING_HEIGHT_BRIDGE); default alpha emits its flag; extrapolation warns.
5. Per-row triggers: empirical turbine fragility (D50/k), tornado-specific fragility (shifts), claims/OEM (max_DR), M2 hub-height supply (bridge); r2 memo parks v1.1 candidates.
6. Intrinsic spread and vulnerability-uncertainty distributions; EAL/PML/VaR/TVaR consumer-computable only from a validated, capped, frequency-sampled distribution with two mandatory flags.
7. Yes, plausible: four deterministic DRs summed under a flagged unresolved dependency structure could exceed a per-turbine cap near collapse; handled via consumer fail-closed caps in simulation; seam documented.

**Notable:** height/terrain bridge is the repo exemplar. Audit trail thins exactly at the two FLAGs: value shares outside the tier table; D50/k anchors-to-ratios math asserted rather than shown.

---

## flood_wind

Version reviewed: `current/` — model v1.0, docs r1 (canonical screening); `proposed/` holds v0.1 scaffold + promotion audit. FLAGs: 2 (§1×1, §7×1).

| # | Section | Item | Verdict | Evidence | Note |
|---|---------|------|---------|----------|------|
| 1.1 | Package | README + tree | PASS | Package map + canonical files list | |
| 1.2 | Package | Dossier | PASS | 14 sections | |
| 1.3 | Package | Metadata spec | PASS | Field/gate/reason-code contract | |
| 1.4 | Package | JSON artifact | PASS | bundle.v3, canonical_runtime_artifact: true | |
| 1.5 | Package | Workbook | PASS | 13 sheets | Manifest lives in proposed/ |
| 1.6 | Package | Previews | FLAG | No previews/ dir (sibling cells all have one) | Undocumented omission — only material package gap |
| 1.7 | Package | Archive | N-A | First canonical release; v0.1 preserved in proposed/ | |
| 2.1 | Coverage | Primary unit | PASS | FW_HAZUS_GSU_SUBSTATION_ASSEMBLY, primary_nonzero | Source-native atom, grain justified §3 |
| 2.2 | Coverage | Conditioner-only | PASS | Protection credited once upstream in delivered depth | No double credit |
| 2.3 | Coverage | Secondary reviewed | PASS | Support units post-disposition allocation; withheld, not zeroed | |
| 2.4 | Coverage | DR≈0 documented | PASS | Elevated units "geometry-screened, not universal DR≈0" | Refuses unconditional zeros |
| 2.5 | Coverage | No silent omission | PASS | 15 units enumerated (1 numeric, 14 withheld with reason codes) | |
| 2.6 | Coverage | No padding | PASS | "None receives a curve" — central discipline | |
| 3.1 | X-axis | Stated | PASS | FLOOD_DEPTH_ABOVE_SUBSTATION_GRADE_FT_HAZUS | |
| 3.2 | X-axis | Units/conversion | PASS | ft; m→ft 3.280839895013123, single point | |
| 3.3 | X-axis | Source-native | PASS | Table 7.9 knots 0–10 ft native; no re-gridding | |
| 3.4 | X-axis | Bridge/fail-closed | PASS | WSE/grade bridge requires 4 fields + matching datums; VERTICAL_DATUM_MISMATCH reject | |
| 3.5 | X-axis | Alternatives | PASS | v0.1 component axis rejected; no site-average/missing-to-zero proxies | |
| 3.6 | X-axis | Physics bridge | PASS | Pure geometry+unit, mutually exclusive with direct depth | |
| 3.7 | X-axis | Multivariate | PASS | Duration captured/not modeled with flag; velocity/scour/wave routed out | |
| 4.1 | Derivation | y-axis precise | PASS | Conditional direct cost / replacement value; 4-ft functionality threshold not reused as cost threshold | |
| 4.2 | Derivation | Evidence inventory | PASS | 18-row SOURCE_REGISTER with url/accessed/locator | |
| 4.3 | Derivation | Map exists | PASS | 27-row CLAIM_PARAMETER_REGISTER + source_parameter_refs | Values → parameter checker |
| 4.4 | Derivation | param_role | PASS | In CSV and embedded table | |
| 4.5 | Derivation | Tier table | PASS | 33 rows, all required columns + triggers | |
| 4.6 | Derivation | Raw vs interpreted | PASS | Raw percent table vs /100 conversion | |
| 4.7 | Derivation | Alternatives | PASS | Fitted logistic rejected as unwarranted smoothing | |
| 4.8 | Derivation | Form justified | PASS | Piecewise-linear reproduces published knots exactly | |
| 4.9 | Derivation | Named rationale | PASS | Machine and prose agree | |
| 4.10 | Derivation | Math shown | PASS | Trivial by design; shown anyway | |
| 4.11 | Derivation | Assumptions | PASS | Assumption set is a required no-default selector | |
| 4.12 | Derivation | Seams + triggers | PASS | NEMA CS 70006-2026 trigger; metadata alone can't change FEMA knots | |
| 5.1 | Selectors | Fixed | PASS | substation_hazus_class, assumption-set acknowledgement | |
| 5.2 | Selectors | Event-time | PASS | water_quality_class, delivered_depth_basis, duration | |
| 5.3 | Selectors | Exposure→value | PASS | exposure_fraction in loss formula only | |
| 5.4 | Selectors | Unknown/default | PASS | "Never a favorable default"; all defaults null; 16 error KATs | |
| 5.5 | Selectors | Blends | N-A | None anywhere | |
| 5.6 | Selectors | Adjustments recorded | PASS | Freshwater gate: T4, 4 sources, "governance gate, not FEMA-calibrated modifier" | |
| 5.7 | Selectors | Std 07 names | PASS | Distinct source-assembly axis, explicit and unit-bridged — not a silent alias | |
| 6.1 | Value | Unit → bucket | PASS | 19-row VALUE_CROSSWALK; withheld units include=false | |
| 6.2 | Value | Basis | PASS | value_basis_id required; implicit_default_profile: null | |
| 6.3 | Value | f_kind | N-A | Quantity-one whole assembly + explicit exposure_fraction | |
| 6.4 | Value | Cap_L | N-A | No scenario dollars computed in-package | |
| 6.5 | Value | Unmixed | PASS | Mixed NREL 72 USD/kW row quarantined (withheld_split_required) | |
| 7.1 | Interface | Hazard inputs | PASS | Two mutually exclusive payloads; AXIS_PAYLOAD_AMBIGUOUS guard | |
| 7.2 | Interface | Declared | PASS | All required, no defaults | |
| 7.3 | Interface | DRs first | PASS | Dollars strictly downstream | |
| 7.4 | Interface | Emit | PASS | damage_emit.v2, scalar_mean | |
| 7.5 | Interface | Views labeled | PASS | Prohibited denominators enumerated | |
| 7.6 | Interface | Flags | FLAG | Spec says every result carries NONCANONICAL_PROPOSAL, but capability/artifact say CANONICAL_SCREENING_RELEASE | Stale proposal-era flag survived promotion into the governing spec (verified: 1 live occurrence) |
| 7.7 | Interface | Capability | PASS | v3 standalone + embedded | |
| 8.1 | Metrics | Declaration populated | PASS | v3 (successor of checklist's "v2" wording); substance satisfied | |
| 8.2 | Metrics | Deterministic stated | PASS | not_carried, scalar_mean | |
| 8.3 | Metrics | Annual contract | PASS | 6 prerequisites + 4 flags, owner=consumer | |
| 8.4 | Metrics | spread honest | PASS | Fabricating bounds explicitly forbidden | |
| 8.5 | Metrics | Per-event | N-A | Annual aggregation withheld and consumer-owned | |
| 8.6 | Metrics | PML withholding | PASS | Withheld pending real prerequisites, not lack of spread | |
| 8.7 | Metrics | Tail disclosure | PASS | Flag travels with future use | |
| 8.8 | Metrics | Preflight scoped | PASS | Deterministic DR ≤ 0.15; consumer fail-closed checks | |
| 9.1 | QA | Parses | PASS | All 4 JSONs | |
| 9.2 | QA | Headers | PASS | Matches README pin + CHANGELOG | |
| 9.3 | QA | Records complete | PASS | Sole record complete | |
| 9.4 | QA | Params in table | PASS | Knots, interpolation, range, bridge constant, gate | |
| 9.5 | QA | Runtime evaluation | PASS | 15 formula + 6 withheld + 16 error KATs; reviewer re-evaluated all 15 at 1e-12 | |
| 9.6 | QA | Legacy blocked | PASS | legacy_comparison; explicit no-fallback rule | |

**Readiness:** SITE-ADAPTABLE — selectors, conditioners, dual axis payloads, exposure/value contract implemented and KAT-tested fail-closed; explicitly NOT_FIELD_OR_CLAIMS_CALIBRATED.

**§11 answers:**
1. Exact transcription of the only public source-native whole-substation response (Hazus-MH 2.1 Table 7.9); fitted forms rejected as invented smoothing; flood-solar component proxies rejected for grain mismatch.
2. The source atom is a facility assembly that cannot honestly be decomposed; released as one mutually exclusive unit; six component units withheld.
3. 33-row tier table + 18-row source register + 27-row claim register; values → parameter checker.
4. Fail-closed everywhere: no defaults, 26 stable reason codes, >10 ft withholds, unknown water withholds; 16 error KATs prove it.
5. NEMA CS 70006-2026 review (conditioner policy only), field/claims calibration, component decomposition, source-table corrections — all with registered triggers.
6. All annual/tail metrics, BI/financial terms, 14 of 15 units, non-freshwater states, depth >10 ft — reason-coded, never zero-filled.
7. Low in-cell (deterministic, capped at 0.15); residual risk is consumer denominator abuse, which cap_binding checks prohibit fail-closed.

**Notable:** exemplary withholding (14 withheld-not-zero units, per-unit reason codes, prohibited-denominator list). FLAGs are both promotion-hygiene: no previews, and the stale NONCANONICAL_PROPOSAL flag in the governing spec.

---

## wildfire_wind

Version reviewed: `current/` — model v1.0, docs r1 (release 2026-08-08). FLAGs: 0.

| # | Section | Item | Verdict | Evidence | Note |
|---|---------|------|---------|----------|------|
| 1.1 | Package | README + tree | PASS | Cell README §2 snapshot tree | |
| 1.2 | Package | Dossier | PASS | Compact but complete | |
| 1.3 | Package | Metadata spec | PASS | Fail-closed contract | |
| 1.4 | Package | JSON artifact | PASS | bundle-v3, canonical_runtime_artifact: true | |
| 1.5 | Package | Workbook | PASS | 7 sheets verified | |
| 1.6 | Package | Previews | PASS | CSV/JSON mirrors of every sheet | Sheet manifest only in proposed/ |
| 1.7 | Package | Archive | PASS | v0.1 preserved in proposed/, demoted | |
| 2.1 | Coverage | Primary units | PASS | WT_PAD_ELECTRICAL + WT_GSU_PROTECTION_CONTROL_DC | |
| 2.2 | Coverage | Conditioner-only | PASS | Shutdown/energization, numeric_effect none | |
| 2.3 | Coverage | Secondary reviewed | PASS | 10 withheld units with specific reason codes | |
| 2.4 | Coverage | DR≈0 documented | PASS | "None published numerically"; withheld ≠ zero | |
| 2.5 | Coverage | No silent omission | PASS | Turbine (largest bucket, 1090 USD/kW) withheld visibly | |
| 2.6 | Coverage | No padding | PASS | 2 of 12 units curved, owner-authorized partial scope | |
| 3.1 | X-axis | Stated | PASS | FSim class state 0–6 | |
| 3.2 | X-axis | Units/conversion | PASS | Exact-integer rule; no conversion permitted | |
| 3.3 | X-axis | Source-native | PASS | Pinned USFS product, identity mandatory selector | |
| 3.4 | X-axis | Bridge/fail-closed | PASS | No local-attack bridge; explicitly fail-closed, class ≠ heat flux | |
| 3.5 | X-axis | Alternatives | PASS | Delivered-load objects parked as future | |
| 3.6 | X-axis | Physics bridge | N-A | None exists; absence declared | |
| 3.7 | X-axis | Multivariate | PASS | Burn probability excluded; compound-event dedupe rule | |
| 4.1 | Derivation | y-axis precise | PASS | Same-unit replacement ratio | |
| 4.2 | Derivation | Evidence inventory | PASS | URLs, DOI, locators, accessed_on | |
| 4.3 | Derivation | Map exists | PASS | source_parameter_refs + tier source_ids | |
| 4.4 | Derivation | param_role | PASS | In JSON (CSV uses `role`) | |
| 4.5 | Derivation | Tier table | PASS | CSV + embedded; CSV lacks reasoning column (JSON has it) | Values → parameter checker |
| 4.6 | Derivation | Raw vs interpreted | PASS | "Statements support ordering only"; ordinates declared un-anchored T4 | |
| 4.7 | Derivation | Alternatives | PASS | Categorical-vs-continuous argued (thin but present) | |
| 4.8 | Derivation | Form justified | PASS | No invented continuity between classes | |
| 4.9 | Derivation | Named rationale | PASS | Steel vs polymeric/electronic ordering narrative | |
| 4.10 | Derivation | Math shown | N-A | Ordinates are owner-authorized T4 assumptions; no math exists to show — stated | |
| 4.11 | Derivation | Assumptions | PASS | Assumption acknowledgement enforced at runtime | |
| 4.12 | Derivation | Seams + triggers | PASS | Replacement path named | |
| 5.1 | Selectors | Fixed | PASS | Identity pins only | |
| 5.2 | Selectors | Event-time | PASS | numeric_effect none, flagged when missing | |
| 5.3 | Selectors | Exposure→value | PASS | DR × value × exposure_fraction | |
| 5.4 | Selectors | Unknown/default | PASS | Reject/withhold; no numeric fallback | |
| 5.5 | Selectors | Blends | N-A | None; burn probability excluded | |
| 5.6 | Selectors | Adjustments recorded | N-A | No numeric adjustments; absence documented | |
| 5.7 | Selectors | Std 07 names | PASS | No alias conflict | |
| 6.1 | Value | Units → buckets | PASS | Crosswalk + FULL_WIND_FARM prohibition row | |
| 6.2 | Value | Basis | PASS | value_basis_id required; 72 USD/kW row prohibited | |
| 6.3 | Value | f_kind | N-A | Concept not used by this cell/standard set | |
| 6.4 | Value | Cap_L | N-A | Workbook computes no loss | |
| 6.5 | Value | Unmixed | PASS | 345 USD/kW soft excluded; mixing machine-prohibited | |
| 7.1 | Interface | Hazard inputs | PASS | Exact class-state field | |
| 7.2 | Interface | Declared | PASS | KAT negatives enforce | |
| 7.3 | Interface | DRs first | PASS | Verified by running helper | |
| 7.4 | Interface | Emit | PASS | damage_emit.v2, scalar_mean | |
| 7.5 | Interface | Views labeled | PASS | No default dollar view exists | |
| 7.6 | Interface | Flags | PASS | 7 always-on flags + OPERATING_STATE_NOT_MODELED | |
| 7.7 | Interface | Capability | PASS | Standalone + embedded verified identical | |
| 8.1 | Metrics | Declaration populated | PASS | v3, fully populated | |
| 8.2 | Metrics | Deterministic stated | PASS | Consistent across all three docs | |
| 8.3 | Metrics | Annual contract | PASS | Owner, 5 prerequisites, 8 flags | |
| 8.4 | Metrics | spread honest | PASS | | |
| 8.5 | Metrics | Per-event | N-A | Annual aggregation withheld entirely, delegated | |
| 8.6 | Metrics | PML withholding | PASS | Withheld for real distribution gaps | |
| 8.7 | Metrics | Tail disclosure | PASS | Flags carried into consumer block | |
| 8.8 | Metrics | Preflight scoped | PASS | 5 concrete checks, withhold on fail | |
| 9.1 | QA | Parses | PASS | Artifact, capability, KATs | |
| 9.2 | QA | Headers | PASS | Consistent with README pin | |
| 9.3 | QA | Records complete | PASS | Both records + valid_range/selector_match/flags | |
| 9.4 | QA | Params in table | PASS | Point arrays, semantics, ordering, boundary rule | |
| 9.5 | QA | Runtime evaluation | PASS | Reviewer ran all 14 formula KATs (1e-12) + 6 negatives via wildfire_wind_v1_curve_eval.py | Helper's capability_declaration_ref hardcodes the proposed/ path — stale pointer, not a contract break |
| 9.6 | QA | Legacy blocked | PASS | v0.1 non-canonical; solar numerical identity flagged audit-fingerprint-only | |

**Readiness:** REVIEWABLE — curve, evidence lineage, workbook, KATs, fail-closed interface complete and consistent; but selectors carry no site-differentiating attributes and conditioners have zero numeric effect (v0.1's site adapter lives only in proposed/), so SITE-ADAPTABLE is not met; T4 owner-authorized ordinates preclude CALIBRATED.

**§11 answers:**
1. Categorical FSim-class lookup (piecewise-linear container, interpolation rejected) because no matched dose→disposition→cost dataset exists; ordinates are explicit owner-authorized T4 screening assumptions supported by an evidence-based ordering only.
2. One repeated pad-electrical unit + one shared GSU protection-control-DC package — the two subsystems whose boundary/mechanism/ordering could be defended; everything else withheld-not-zero.
3. Tier table maps both point arrays to WW1-A001 (T4) and axis/ordering to WW1-S001–S004; values → parameter checker.
4. Reject or withhold, never numeric fallback: MISSING_REQUIRED_FIELD, SELECTOR_MISMATCH, INVALID_CLASS_STATE, null DR + reason codes (verified by running the helper).
5. The two T4 arrays via a new model version, triggered by qualified local-attack/inspection/cost data or structured elicitation.
6. Whole-plant DR, aggregate electrical DR, EAL, PML, VaR, TVaR, all annual/tail metrics; scenario dollars only with explicit same-unit value + exposure.
7. Low direct risk (no EAL emitted); cap_binding delegates fail-closed checks; residual risk is a consumer ignoring the policy, which the artifact cannot prevent.

**Notable:** withholding honesty exemplary (unit-specific reason codes propagated through all artifacts; FULL_WIND_FARM prohibition row); T4 nature impossible to miss. Minor staleness: helper self-describes as proposal and points at proposed/ capability; v1.0 sheet manifest only in proposed/.

---

## tropical_cyclone_wind_wind

Version reviewed: `current/` — model v1.2, docs r2 (canonical pin; derivation chain v1.2 delta → archive v1.1 → proposed v1.0 full dossier). FLAGs: 4 (§1×2, §4×1, §9×1).

| # | Section | Item | Verdict | Evidence | Note |
|---|---------|------|---------|----------|------|
| 1.1 | Package | README + tree | PASS | ASCII scope diagram + package list | |
| 1.2 | Package | Dossier | PASS | v1.2 delta ("the denominator changed, not the curve") + full v1.0 dossier | Chain via CHANGELOG, not linked from current README — traceability nit |
| 1.3 | Package | Metadata spec | FLAG | Only the v1.0 spec exists (proposed/, pre-proxy); none for v1.2 in current/ | Interface content survives in artifact contracts, but the standalone spec was never revved — stale companion |
| 1.4 | Package | JSON artifact | PASS | canonical_runtime_artifact: true, bundle v3, released_v1_2 | |
| 1.5 | Package | Workbook | PASS | 4 sheets verified | |
| 1.6 | Package | Previews | FLAG | No previews or sheet manifest in current/ (v1.0 manifest not revved) | Small, undocumented gap |
| 1.7 | Package | Archive | PASS | archive/model_v1_0, model_v1_1 (kept for exact reproduction of superseded 0.63 route) | |
| 2.1 | Coverage | Primary unit | PASS | WT_JAIMES_TURBINE_TOWER_EXPOSURE_UNIT — deliberately quarantined source-native atom | |
| 2.2 | Coverage | Conditioner-only | N-A | Only conditioner is operating/control state | |
| 2.3 | Coverage | Secondary reviewed | PASS | 9 further units with reason codes | |
| 2.4 | Coverage | DR≈0 documented | N-A | All non-primary units withheld_not_zero — the documented stance | |
| 2.5 | Coverage | No silent omission | PASS | 0.84 of TIV uncovered, loudly declared | |
| 2.6 | Coverage | No padding | PASS | One-curve-for-BOP rejected; all BOP withheld | |
| 3.1 | X-axis | Stated | PASS | TC_PEAK_GUST_3S_10M_KMH_JAIMES | |
| 3.2 | X-axis | Units/conversion | PASS | mph/knots/1-min rejected; no silent renames | |
| 3.3 | X-axis | Source-native | PASS | Simulated range [108,252], 20 levels | |
| 3.4 | X-axis | Bridge/fail-closed | PASS | "No averaging/height/terrain/hub bridge"; NO_NHC_OR_HUB_HEIGHT_BRIDGE flag; hub-height demand rejected | Fail-closed; conversion deferred to a future governed bridge |
| 3.5 | X-axis | Alternatives | PASS | Saffir-Simpson, NHC 1-min, hub-height, knots, legacy mph all rejected | |
| 3.6 | X-axis | Physics bridge | N-A | bridge_policy declares none exists | |
| 3.7 | X-axis | Multivariate | PASS | Surge/debris/rain/tornado excluded per Std 18; duration/turbulence unmodeled conditioners | |
| 4.1 | Derivation | y-axis precise | PASS | Paper-defined denominator; harmonized_to_CWER: false documented | Denominator ambiguity itself quarantined — a strength |
| 4.2 | Derivation | Evidence inventory | PASS | DOI 10.1002/we.2436 + per-decision locators | Exemplary locator table |
| 4.3 | Derivation | Map exists | PASS | Claim register + embedded tier table | Values → parameter checker |
| 4.4 | Derivation | param_role | PASS | In the v1.0 tier table (params unchanged); current CSV drops it — see 4.5 | |
| 4.5 | Derivation | Tier table shape | FLAG | v1.2 CSV has only parameter/value/tier/meaning; embedded table groups the 1 MW/2.5 MW fits into one row | Source/role columns and per-archetype rows exist only in the superseded v1.0 table — structural, not sourcing, gap |
| 4.6 | Derivation | Raw vs interpreted | PASS | Source DS ratios vs adopted fits; Ct(h) audit-only; delta_V50 naming guards misreading | |
| 4.7 | Derivation | Alternatives | PASS | DS3-as-DR, rebuilt state model, interpolation, clamping rejected | |
| 4.8 | Derivation | Form justified | PASS | Paper's own fitted Eq. 1 adopted, not re-fitted | |
| 4.9 | Derivation | Named rationale | PASS | "Correct the failure unit before tuning the curve" + decision log | |
| 4.10 | Derivation | Math shown | PASS | V_at_DR50 identity serialized and verified | |
| 4.11 | Derivation | Assumptions | PASS | V_zero=90 T4; source's own wording inconsistency registered | |
| 4.12 | Derivation | Seams + triggers | PASS | Replacement requires governed version + Hurricane rerun | |
| 5.1 | Selectors | Fixed | PASS | turbine_archetype_id exact-match; interpolation prohibited | |
| 5.2 | Selectors | Event-time | PASS | actual_operating_control_state, zero numeric effect | |
| 5.3 | Selectors | Exposure→value | PASS | Per-turbine grain; 0.16/0.84 rule | |
| 5.4 | Selectors | Unknown/default | PASS | Defaults null; unknown flags; proxy opt-in KAT | |
| 5.5 | Selectors | Blends | N-A | None | |
| 5.6 | Selectors | Adjustments recorded | PASS | Tower proxy: policy ID + owner source row + identity-only (NO_CAPACITY_RATIO_SCALING) | |
| 5.7 | Selectors | Std 07 names | PASS | Self-declared exact IDs; no alias ambiguity | |
| 6.1 | Value | Unit → bucket | PASS | CONUS_WIND_FARM_TOWER_16PCT_V1; CWER crosswalk prohibited | |
| 6.2 | Value | Basis | PASS | TIV $140M, covered $22.4M, share 0.16 | |
| 6.3 | Value | f_kind | PASS | Literal label absent but fraction nature unambiguous | |
| 6.4 | Value | Cap_L | PASS | Aggregate cap row + occurrence/annual cap KAT | |
| 6.5 | Value | Unmixed | PASS | Soft/nonphysical $345/kW separated; tower binding physical-only | |
| 7.1 | Interface | Hazard inputs | PASS | preferred_input_field, valid_range, policy | |
| 7.2 | Interface | Declared | PASS | Proxy route requires 3 exact IDs | |
| 7.3 | Interface | DRs first | PASS | Dollars consumer-computable only | |
| 7.4 | Interface | Emit | PASS | damage_emit.v2, scalar_mean; Beta-variance non-serialization reasoned | |
| 7.5 | Interface | Views labeled | PASS | scenario_loss_status explicit | |
| 7.6 | Interface | Flags | PASS | 7 always-on + boundary flags, KAT-asserted | |
| 7.7 | Interface | Capability | PASS | Standalone byte-equal to embedded (verified) | |
| 8.1 | Metrics | Declaration populated | PASS | v3 (successor of checklist's v2); no substance gap | |
| 8.2 | Metrics | Deterministic stated | PASS | not_carried + flag | |
| 8.3 | Metrics | Annual contract | PASS | Incl. 0.84 disclosure prerequisite | |
| 8.4 | Metrics | spread honest | PASS | Beta variance withheld with stated reason | |
| 8.5 | Metrics | Per-event | PASS | repeated_turbine_rule: each turbine, local gust | |
| 8.6 | Metrics | PML withholding | PASS | Gated on frequency/coupling/cap validation | |
| 8.7 | Metrics | Tail disclosure | PASS | Both limitation flags | |
| 8.8 | Metrics | Preflight scoped | PASS | Occurrence cap ≤0.16·TIV; correctly scoped | |
| 9.1 | QA | Parses | PASS | All four JSONs; SHAs match validation report | |
| 9.2 | QA | Headers | PASS | v1.2/r2 identity complete | |
| 9.3 | QA | Records complete | PASS | 4 records, thresholded_weibull_expected_damage | |
| 9.4 | QA | Params in table | FLAG | Embedded row groups 1 MW (106.77, 8.94) and 2.5 MW (82.52, 4.54) fits without per-value rows; current CSV rows only the 3.3 MW values | Per-value rows only in superseded v1.0 table |
| 9.5 | QA | Runtime evaluation | PASS | Cell helper + v1.2 validator; reviewer re-evaluated all 33 numeric KATs at 1e-12 incl. boundary-flag branches | |
| 9.6 | QA | Legacy blocked | PASS | Negative KATs reject old 0.63 policy/value/archetype IDs — migration KAT-enforced | |

**Readiness:** SITE-ADAPTABLE — selectors/conditioners/exposure fully implemented, fail-closed, plus a governed 13,085-cell Hurricane consumer rebuild passed; explicitly NOT_FIELD/CLAIMS_CALIBRATED and self-labeled a target-mismatched tower-only screening proxy.

**§11 answers:**
1. Jaimes Eq. 1 is the paper's own fitted expected-damage function; DS3-as-DR, rebuilt mixtures, interpolation, clamping rejected; v1.2 fixed value scope instead of tuning the curve.
2. The source's damage states are tower states on an ambiguous denominator, so the DR is quarantined to a tower exposure unit rather than relabeled as an equipment assembly — the v1.1→v1.2 correction exists precisely because 0.63 assembly grain exceeded the evidence.
3. Embedded tier table (Jaimes 2020 DOI + locators) + source/claim registers; per-value rows in the v1.0 table; values → parameter checker.
4. Fail closed: no selector defaults; proxy needs three exact opt-in IDs (negative KAT); out-of-range withheld/flagged; withheld units return null + reason codes, never zero.
5. Target-matched 5 MW evidence replaces the proxy; denominator harmonization unlocks the assembly unit; claims data upgrades T4 ratios and V_zero; any change is a governed version + Hurricane rerun.
6. Dollar loss except under the exact 0.16 tower basis; all annual/tail metrics pre-validation; DRs for nine non-tower units; the 90–108 km/h band and >252 km/h tail.
7. Low: bounded scalar mean, occurrence cap at covered-value ceiling; the real bias risk is understatement from the 0.84 withheld value, which consumers must disclose rather than zero-fill.

**Notable:** the v1.1→v1.2 correction (max EAL 7.78%→1.98% TIV/yr by fixing the failure unit, not the curve) is a curation exemplar; withholding machine-enforced. FLAGs are companion hygiene: no v1.2 spec, no previews/manifest, tier CSV lost columns and per-archetype rows.

---

## tropical_cyclone_wind_solar (proposed)

Version reviewed: `proposed/` — model v2.1, docs r1 (lead pin; ladder v0.1 → v1.0 r1/r2 → v2.0 → v2.1 retained byte-stable; array-route depth inherited from v2.0 dossier/spec by explicit cross-reference). FLAGs: 1 (§9).

| # | Section | Item | Verdict | Evidence | Note |
|---|---------|------|---------|----------|------|
| 1.1 | Package | README + tree | PASS | Lead-pin yaml + key files + version ladder | |
| 1.2 | Package | Dossier | PASS | v2.1 delta dossier; v2.0 carries axis/form derivation | |
| 1.3 | Package | Metadata spec | PASS | v2.1 spec, array payloads delegated to v2.0 spec by design | |
| 1.4 | Package | JSON artifact | PASS | Parses; SHA matches validation report | canonical_runtime_artifact: false is deliberate proposal state |
| 1.5 | Package | Workbook | PASS | 10 sheets incl. Parameter_Tiers, Plant_Curve_Table, KATs, QA | Sheet manifest stops at v2.0 |
| 1.6 | Package | Previews | N-A | Unreleased proposal; 246-row plant-curve CSV + workbook QA serve the audit role | |
| 1.7 | Package | Archive | N-A | No release → no archive; in-place ladder hash-verified | |
| 2.1 | Coverage | Primary units | PASS | 5 primary_nonzero (Perry, fixed/tracker module + structure) | |
| 2.2 | Coverage | Conditioner-only | PASS | Drive/lock state, control power = qualification context, no multiplier | |
| 2.3 | Coverage | Secondary reviewed | PASS | 5 secondary_conditional incl. SCADA at 1.31 USD/kWdc | |
| 2.4 | Coverage | DR≈0 documented | PASS | 242.20 USD/kWdc soft/sunk labeled, "not called wind-immune" | |
| 2.5 | Coverage | No silent omission | PASS | 100% of 877.80 USD/kWdc mapped; legacy 42%-zeroed defect reversed | |
| 2.6 | Coverage | No padding | PASS | Decision log names the coverage-vs-grade tension; every new curve T4-flagged | |
| 3.1 | X-axis | Stated | PASS | Fixed net-pressure ratio; tracker Vnormal/Ucrit; site pressure ratio | |
| 3.2 | X-axis | Units/conversion | PASS | Dimensionless ratios; (gust/design gust)² proxy stated | |
| 3.3 | X-axis | Source-native | PASS | 10 m gust context-only; UNBRIDGED_TEN_METER_GUST_PROHIBITED | |
| 3.4 | X-axis | Bridge/fail-closed | PASS | Required bridge IDs; content-resolution deferral flagged | Presence checked, resolution honestly deferred to production adapter |
| 3.5 | X-axis | Alternatives | PASS | Five rejected models named with reasons | |
| 3.6 | X-axis | Physics bridge | PASS | Pressure ∝ V² | |
| 3.7 | X-axis | Multivariate | PASS | Duration/direction/cycling named conditioners with not-modeled flag | |
| 4.1 | Derivation | y-axis precise | PASS | DR = Σ P(state)·cost_ratio; probability never relabeled DR | Core legacy fix |
| 4.2 | Derivation | Evidence inventory | PASS | 71-row source register with citation/url/locator | |
| 4.3 | Derivation | Map exists | PASS | 92-claim register + tier source_ids | Values → parameter checker |
| 4.4 | Derivation | param_role | PASS | Tier CSV column | |
| 4.5 | Derivation | Tier table | PASS | 93 rows, full columns (82×T4, 6×T1, 5×T3) | |
| 4.6 | Derivation | Raw vs interpreted | PASS | PAVA_DERIVED_KNOTS flag; claim_type separates observation/interpretation/governance | |
| 4.7 | Derivation | Alternatives | PASS | Anchored-logistic intercept subtraction rejected | |
| 4.8 | Derivation | Form justified | PASS | Ordered-state lognormal keeps probability/cost typed separately | Argued, not asserted |
| 4.9 | Derivation | Named rationale | PASS | derivation_rationale (summary, rejected_models, v2_1 revision) | |
| 4.10 | Derivation | Math shown | PASS | Φ/Q/P/DR recomposition; medians declared T4 assumptions, no fake fit narrative | |
| 4.11 | Derivation | Assumptions | PASS | TCWS2_CELL_LOCAL_SYNTHETIC_DECISION rows throughout | |
| 4.12 | Derivation | Seams + triggers | PASS | Per-row triggers + promotion-gate blockers | |
| 5.1 | Selectors | Fixed | PASS | Architecture, design basis, zone, exact system pin | |
| 5.2 | Selectors | Event-time | PASS | Attained tracker state; "commanded stow is insufficient" | Strong correctness stance |
| 5.3 | Selectors | Exposure→value | PASS | One-zone-to-full-value simplification disclosed via flag | |
| 5.4 | Selectors | Unknown/default | PASS | 42 fail-closed codes; "unknown does not earn favorable routing" | |
| 5.5 | Selectors | Blends | PASS | Scenarios declared "not probabilities/percentiles/frequency" | |
| 5.6 | Selectors | Adjustments recorded | PASS | Per-state tier/source_ids in records | |
| 5.7 | Selectors | Std 07 names | PASS | No conflicts; Perry axis deliberately not aliased | |
| 6.1 | Value | Units → buckets | PASS | 10 unit_values + 18-row crosswalk with double-count guardrails | |
| 6.2 | Value | Basis | PASS | 2024 USD/kWdc physical replacement, named source | |
| 6.3 | Value | f_kind | N-A | financial_class/role_in_loss/include flags carry the semantics | |
| 6.4 | Value | Cap_L | N-A | No cap computed; absence documented (legacy 48% ceiling removed) | |
| 6.5 | Value | Unmixed | PASS | 877.80 vs 1120 denominators separately named | |
| 7.1 | Interface | Hazard inputs | PASS | Component + full-plant modes | |
| 7.2 | Interface | Declared | PASS | Enforced by evaluator reject codes | |
| 7.3 | Interface | DRs first | PASS | Assembly is a named companion, not a replacement | |
| 7.4 | Interface | Emit | PASS | state_ensemble mode; per-state probabilities verified in KAT output | |
| 7.5 | Interface | Views labeled | PASS | physical_damage_assembly.v1 "explicit convenience view, named denominator" | |
| 7.6 | Interface | Flags | PASS | 9 per-emit flags verified at runtime | |
| 7.7 | Interface | Capability | PASS | Standalone + embedded parse | |
| 8.1 | Metrics | Declaration populated | PASS | v3, fully populated | |
| 8.2 | Metrics | Deterministic/spread stated | PASS | nonprobabilistic_epistemic_envelope — explicitly not a distribution | |
| 8.3 | Metrics | Annual contract | PASS | Exact pin, coupling, cap validation, screening-grade acceptance | |
| 8.4 | Metrics | spread honest | PASS | SYNTHETIC_SCENARIOS_ARE_NOT_A_PROBABILITY_DISTRIBUTION flag | |
| 8.5 | Metrics | Per-event | PASS | Delegated to the tier that samples events | |
| 8.6 | Metrics | PML withholding | PASS | Prohibited "without a downstream annual loss distribution" | |
| 8.7 | Metrics | Tail disclosure | PASS | Consumer-owned + non-probabilistic-scenario flags | |
| 8.8 | Metrics | Preflight scoped | PASS | 6 named checks; no in-cell cap to cross | |
| 9.1 | QA | Parses | PASS | All three JSONs; SHA-256 match | |
| 9.2 | QA | Headers | PASS | bundle.v3, …V2_1_PROPOSED, v2.1, r1 | |
| 9.3 | QA | Records complete | PASS | 10 records (1 piecewise_linear + 9 ordered_damage_state_lognormal) | |
| 9.4 | QA | Params in table | FLAG | The 93-row CSV is complete, but the artifact-embedded parameter_tier_table is a stale verbatim-v2.0 copy: 5 rows, still "scenario loss: withheld" (contradicting the same file's scenario_loss_status: supported…), no site-facility rows | Verified directly; also undercuts the validation report's "obsolete v2.0 labels removed: PASS" claim |
| 9.5 | QA | Runtime evaluation | PASS | Evaluator ran: 5/5 KATs match, 5/5 rejection codes exact; reviewer recomputed GSU ordered-state DR at x=1.0 = 0.14796866133525013 exactly | Both curve forms exercised |
| 9.6 | QA | Legacy blocked | PASS | Notebook regression_fixture_only; strong-wind candidate SHA-pinned runtime_approved:false | |

**Readiness:** SITE-ADAPTABLE (capability) at DRAFT governance — selectors/conditioners/exposure implemented, fail-closed, executable with passing KATs; emphatically not CALIBRATED (82/93 params T4, gates G05–G11 blocked) and non-canonical until promotion.

**§11 answers:**
1. Ordered-damage-state lognormal keeps state probability and cost ratio as separate typed quantities, directly repairing the legacy defect of relabeling Ceferino exceedance probability as loss; alternatives named and rejected.
2. Units follow replacement-economics boundaries tied to named value rows; architectures mutually exclusive; Perry stays a source-cohort atom, never aliased.
3. 93-row tier CSV + 92-claim/71-source registers; values → parameter checker.
4. Fail-closed: 42 named failure codes; "unknown does not earn favorable routing"; verified live via rejection KATs.
5. Per-row update_triggers (elicitation or matched TC field/claims calibration replaces T4 medians/costs); gates G05–G11 name required evidence classes.
6. Frequency, EAL, PML/VaR/TVaR (no annual distribution), BI/downtime, rain/debris/surge/tornado loss; direct support-unit DR withheld as assembly-rule-only.
7. Low in-cell: no artificial cap (48% ceiling removed; DR reaches 0.803 at ratio 2.0); soft/sunk explicitly does not cap physical DR; residual risk is consumers treating the unweighted scenario envelope as a distribution — explicitly forbidden.

**Notable:** unusually disciplined honesty architecture with a runnable evaluator. FLAG: stale embedded v2.0 tier table contradicting value_linkage. Minor: v2.1 governance docs (gate matrix, pressure test, seven-step audit, sheet manifest) stop at v2.0.

---

## hail_wind (proposed)

Version reviewed: `proposed/` — model v0.1, docs r2 evidence layer over docs r1 runtime scaffold (artifact SHA verified unchanged; 3,033 validator checks re-run PASS). FLAGs: 2 (§5×1, §8×1).

| # | Section | Item | Verdict | Evidence | Note |
|---|---------|------|---------|----------|------|
| 1.1 | Package | README + tree | PASS | README §2 full snapshot tree incl. withheld units | |
| 1.2 | Package | Dossier | PASS | Documents the no-curve decision, not a curve | |
| 1.3 | Package | Metadata spec | PASS | Fail-closed input/output contract | |
| 1.4 | Package | JSON artifact | PASS | Deliberately noncanonical zero-curve scaffold; schema_envelope_status explains why not bundle v2/v3 | |
| 1.5 | Package | Workbook | PASS | 12-sheet manifest; JSON/CSV authoritative | |
| 1.6 | Package | Previews | N-A | Release convention; cell unreleased | |
| 1.7 | Package | Archive | N-A | First governed hail×wind cell | |
| 2.1 | Coverage | Primary units | PASS | Explicitly none released; WT_BLADE_ASSEMBLY candidate with stated blocker | |
| 2.2 | Coverage | Conditioner-only | PASS | Rotor/pitch/azimuth/shutdown as conditioners | |
| 2.3 | Coverage | Secondary reviewed | PASS | 8 units, each with reason + trigger; "withheld ≠ undamaged" | |
| 2.4 | Coverage | DR≈0 documented | PASS | Foundation geometry_screened_no_curve_not_zero | |
| 2.5 | Coverage | No silent omission | PASS | 11 units cover full CWER anatomy; 26-row crosswalk | |
| 2.6 | Coverage | No padding | PASS | curve_records: []; "no empty v3 bundle… no relabeling" | The cell's central discipline |
| 3.1 | X-axis | Stated | PASS | WITHHELD_PENDING_QUALIFIED_BLADE_CONTACT_DEMAND_BRIDGE | Withholding is the stated decision; leading candidate named |
| 3.2 | X-axis | Units/conversion | PASS | mesh_mm; mesh_in rejected without migration record | |
| 3.3 | X-axis | Source-native | PASS | NOAA diameter vs MRMS MESH not interchangeable | |
| 3.4 | X-axis | Bridge/fail-closed | PASS | reject_no_runtime_axis; gate G5 BLOCKED | |
| 3.5 | X-axis | Alternatives | PASS | 6 candidates dispositioned; severe-hail class rejected, ADF parked | |
| 3.6 | X-axis | Physics bridge | PASS | KE identity shown research-only, blocked from runtime | |
| 3.7 | X-axis | Multivariate | PASS | required_future_bridge_inputs named individually | |
| 4.1 | Derivation | y-axis precise | PASS | Same-blade direct cost ratio; BI/derating excluded | |
| 4.2 | Derivation | Evidence inventory | PASS | 21+7 register rows with URL + exact locators | |
| 4.3 | Derivation | Map exists | PASS | Claim registers r1+r2 structured | Values → parameter checker |
| 4.4 | Derivation | param_role | PASS | axis_guardrail, conditioner, value_reference, capability… | |
| 4.5 | Derivation | Tier table | PASS | 38 rows, all six columns + triggers | |
| 4.6 | Derivation | Raw vs interpreted | PASS | numeric_values_embedded: false — numbers quarantined in audit layer | |
| 4.7 | Derivation | Alternatives | PASS | Future mutually exclusive state model named | |
| 4.8 | Derivation | Form justified | PASS | Selection is "none"; three unsupported mappings argued | |
| 4.9 | Derivation | Named rationale | PASS | NO_RUNTIME_CURVE + reason + trigger, machine and prose agree | |
| 4.10 | Derivation | Math shown | N-A | No numeric parameters exist; refusal to multiply gaps documented | |
| 4.11 | Derivation | Assumptions | PASS | 26+9 claims, decision log HW-D01..09, permitted/prohibited inference | |
| 4.12 | Derivation | Seams + triggers | PASS | 7 gates converted to acceptance tests in r2 | |
| 5.1 | Selectors | Fixed | PASS | Blade/LEP/laminate/vintage identity | |
| 5.2 | Selectors | Event-time | PASS | "Commanded ≠ attained shutdown" | |
| 5.3 | Selectors | Exposure→value | PASS | Lease polygon banned as exposure default (KAT) | |
| 5.4 | Selectors | Unknown/default | PASS | "No unknown state receives default or credit" + KAT | |
| 5.5 | Selectors | Blends | PASS | Credit disabled; frequency out of scope; rule pre-registered | |
| 5.6 | Selectors | Adjustments recorded | PASS | Adjustments exist only as governed refusals, with sources/tier/reasoning | |
| 5.7 | Selectors | Std 07 names | FLAG | Spec uses `mesh_mm`; std 07 canonical example is `mesh_diameter_mm` (hail_solar) | mesh_in prohibition recorded, but the cross-cell divergence has no alias record |
| 6.1 | Value | Units → buckets | PASS | Per-unit value_lineage to NREL CWER ledger; 26-row crosswalk | |
| 6.2 | Value | Basis | PASS | 2023_USD_per_kW, reference_archetype_only_not_enabled_for_loss | |
| 6.3 | Value | f_kind | N-A | No fractional modifiers adopted | |
| 6.4 | Value | Cap_L | N-A | No loss computed; cap_binding still declared fail-closed | |
| 6.5 | Value | Unmixed | PASS | 1623 + 345 = 1968 reconciliation; soft/sunk excluded | |
| 7.1 | Interface | Hazard inputs | PASS | Capture-only status per field | |
| 7.2 | Interface | Declared | PASS | Enum + unknown behavior per field | |
| 7.3 | Interface | DRs first | PASS | All null/withheld, DR-first ordering kept | |
| 7.4 | Interface | Emit | N-A | runtime_status: withheld; fail-closed contract substitutes | |
| 7.5 | Interface | Views labeled | PASS | scenario_loss withheld with own reason codes | |
| 7.6 | Interface | Flags | PASS | Reason-code vocabulary; extrapolation reject; open_split per unit | |
| 7.7 | Interface | Capability | PASS | Parses; duplicated consistently | |
| 8.1 | Metrics | capability_declaration.v2 | FLAG | capability.json is `capability_declaration.v1`; canonical cells use v2+ | No documented reason; schema_envelope_status explains the bundle schema only, not the capability version |
| 8.2 | Metrics | Deterministic/spread stated | PASS | spread_carried: false, emit modes [] — unambiguous | Named v2 field absent (see 8.1) |
| 8.3 | Metrics | Annual contract | PASS | withheld_reason_by_metric incl. MISSING_HAZARD_FREQUENCY… | Conveyed via reason codes rather than the v2 field |
| 8.4 | Metrics | spread honest | PASS | Correct for zero curves | |
| 8.5 | Metrics | Per-event | N-A | No curve exists to evaluate | |
| 8.6 | Metrics | PML withholding | PASS | Both NO_RUNTIME_CURVE and missing-distribution codes — distinction correctly encoded | |
| 8.7 | Metrics | Tail disclosure | N-A | No tail results produced (KAT-asserted withhold) | |
| 8.8 | Metrics | Preflight scoped | PASS | not_executed_no_distribution; required_before_scalar_eal: true | |
| 9.1 | QA | Parses | PASS | Artifact, capability, KATs; SHA-matched to r2 report | |
| 9.2 | QA | Headers | PASS | "docs r1" correct — r2 is docs-only, layering recorded | |
| 9.3 | QA | Records complete | N-A | curve_records: [] — emptiness is the documented decision | |
| 9.4 | QA | Params in table | PASS | 38 governance parameters via parameter_tier_table_ref | |
| 9.5 | QA | Runtime evaluation | N-A | Zero curve forms; scaffold validator re-run PASS (3,033 checks); 14 fail-closed KATs assert withheld outputs | |
| 9.6 | QA | Legacy blocked | PASS | Real Estate_Hail traced to wrong-asset Schmid source with unit-grid defect; r2 escalates to migration blocker with file:line locations | Exemplary |

**Readiness:** DRAFT — structure, evidence governance, and fail-closed contracts complete and consistent, but the curve derivation is deliberately not done (strict NO-GO, empty curve_records), so REVIEWABLE's "curve complete enough for technical review" cannot be met. The best-documented DRAFT the standard allows; the cell's own labels agree.

**§11 answers:**
1. No curve, deliberately: every candidate fails one of three required mappings (hail field→blade contact, physical endpoint→field disposition, disposition→same-blade cost); the future form is pre-committed as a mutually exclusive state model.
2. WT_BLADE_ASSEMBLY as one assembly because coating repair / structural repair / replacement are mutually exclusive or nested — finer splits would double-charge material; BOP units kept as separate withheld subjects.
3. No load-bearing curve numbers exist; the 38-row tier table + registers with exact locators govern every adopted rule and reference value; values → parameter checker.
4. Fail closed: missing/unknown pathway, state, exposure, or value adds reason codes and withholds; nothing defaults to hail_impact, full-farm exposure, or reference values (KATs e4/e5/e10/e11/e13).
5. Gate matrix r2 acceptance tests + evidence Packages A–D (owner/OEM cohort, ISO-style tests, claims linkage, explicit T4 elicitation); promotion is a new model v1.0 on the current schema — never an edit to the scaffold.
6. All of them: failure_unit_scalar_dr, scenario_loss, EAL, PML, VaR, TVaR — each with per-metric reason codes.
7. Not currently — no EAL can be produced; cap_binding is fail-closed with preflight required before any future scalar EAL, pre-empting the risk contractually.

**Notable:** withholding discipline exemplary (non-damage observation not converted to DR=0; 14 fail-closed KATs); legacy hygiene exemplary (Real Estate_Hail defect traced and escalated). FLAGs are cheap pre-promotion fixes: capability v1 without documented reason; mesh_mm vs std-07 mesh_diameter_mm without an alias record.
