# Seven-step audit — flood_wind proposed model v1.0 / docs r1

## 1. Define the asset and boundary

The asset is a land-based wind generation facility with repeated turbines, collection electrical assets,
civil works, and zero or one project-associated facility GSU/substation. The model-v1 numeric subject is not
the full wind farm: it is one complete electric-power substation classified under the source's `ESSL`,
`ESSM`, or `ESSH` taxonomy.

The governed mechanism is `flood_inundation_contact`. Scour, erosion, saturated-soil support loss, debris,
wave action, outage, restoration, BI, revenue, insurance, frequency, and portfolio metrics are separate.

**Status:** pass for a source-native class-template assembly; site identity and ownership remain required.

## 2. Decompose what fails

Two valid modeling resolutions are preserved but may not be combined:

1. the Hazus whole-substation assembly, which receives the one source-native screening curve; or
2. the InfraSure component decomposition, whose switchgear, transformer, auxiliary/control, protection,
   station-service/DC, and cable units remain withheld.

Wind turbine-base equipment, pad transformers, collection terminations, elevated turbine equipment,
foundation/civil subjects, and support costs retain their v0.1 treatment.

**Status:** pass with a hard mutual-exclusion rule. The source assembly is not evidence for its components.

## 3. Define the ordinate

Table 7.9 reports percent damage. Model v1 serializes those values divided by 100 as direct physical DR for
the same whole-substation assembly:

```text
DR = direct physical repair/replacement cost
     / full pre-event direct replacement value of the same facility substation
```

The function is not failure probability, functionality loss, outage duration, or whole-project loss. The
source's four-foot functionality threshold is retained as source context but does not alter the DR curve or
enter the direct physical ordinate.

**Status:** conditional pass at source assembly grain; no component denominator inference.

## 4. Split the value basis row by row

The public wind reference still provides only one mixed `72 2023 USD/kW` external-electrical row. That row
does not isolate a facility GSU and cannot become the assembly denominator. A site SOV/BOM/appraisal must
identify the complete same-facility substation value, owner, insured inclusion, quantity, and non-overlap with
collection and turbine electrical equipment.

**Status:** reference ledger reconciled; site value is required for dollar loss.

## 5. Allocate physical value

The assembly is counted once per physical facility. Its at-risk fraction is one when the source assembly
representation is selected; partial component-value allocation is incompatible with the whole-assembly
curve. All component GSU values and responses are disabled for that event/asset representation. Unknown or
utility ownership withholds baseline project dollar loss, though intrinsic assembly DR may still be reported
when all curve inputs are complete.

Fieldwork and transport/logistics remain support-once items after qualified disposition and are not in the
intrinsic assembly denominator unless the site replacement appraisal explicitly and non-duplicatively treats
them as direct replacement cost.

**Status:** allocation rule passed; site value/ownership binding remains external and required for loss.

## 6. Specify the site-condition adapter

Evaluate the governed axis `FLOOD_DEPTH_ABOVE_SUBSTATION_GRADE_FT_HAZUS` at the actual substation. The
preferred input is:

```text
flood_depth_above_substation_grade_ft
```

Alternatively, and never in the same payload, derive it as:

```text
(water_surface_elevation_m - substation_grade_elevation_m) * 3.280839895013123
```

That bridge requires `water_surface_vertical_datum_id` and `substation_grade_vertical_datum_id` to match.
Numeric response additionally requires `substation_hazus_class`, freshwater/non-contaminated water,
`delivered_depth_basis = unprotected_or_internal_post_bypass_depth`, and
`source_assumption_set_id = FEMA_HAZUS_MH_2_1_TABLE_7_9_UNPROTECTED_SUBSTATION`.
Freshwater-contaminated, brackish, saltwater, chemically contaminated, and unknown-water requests withhold.
Protection is handled once in delivered internal depth, including post-bypass/overtopping depth; no extra
credit or second protection transform is applied. Missing component identity/elevation is not dry.

The freshwater-only gate is conservative T4 governance. NEMA GD 1-2016 is historical, and its same-titled
2026 successor must be acquired and reviewed before promotion; that work may refine conditioner/disposition
policy but does not change FEMA source knots by implication.

**Status:** method pass; observed site data and exact compatibility remain request-time prerequisites.

## 7. Apply the qualified curve or withhold

For 0–10 ft, apply `FW_HAZUS_2_1_SUBSTATION_SCREENING_PWL` by piecewise-linear interpolation through the
exact Table 7.9 points. All three source classes use the same ordinates. Withhold above 10 ft; reject
negative/nonfinite delivered depth. Unsupported classes, pathways, water qualities, depth bases, failure
units, or assumption sets receive no numeric fallback.

The source carries no probabilistic spread. Model grade and metadata must state
`screening_source_native_legacy_fema_proxy`, and Hazus 7.0's mapping-only/disabled status must remain visible.

**Status:** conditional numerical pass for one noncanonical assembly record; all other units withheld.

## Audit result

Proposed model v1.0 earns a narrow output-bearing state because an exact official table exists at whole-
substation grain. It does not close component-level calibration, current-Hazus enablement, contaminated-water,
protection, site-value, ownership, consumer, or canonical-release gates.
