# Wildfire × utility-scale solar PV — research scaffold

## Status

```yaml
cell_id: wildfire_solar
semantic_damage_model_version: model v0.1
documentation_revision: docs r1
lifecycle_state: scaffold
promotion_status: proposed
review_status: pressure_tested
documentation_status: working_revision
package_release: unreleased
package_baseline: library v2.5
package_inclusion_status: not_included
damage_code_id: WILDFIRE_SOLAR_PROPOSED_V0_1
canonical_runtime_artifact: false
curve_records: 0
ordinate_status: withheld
withdrawn_candidate_ordinate_status: withdrawn_no_direct_calibration
reportability: none
standard_runtime_reason: NO_RUNTIME_CURVE
```

## Pressure-tested conclusion

No reviewed source in the bounded evidence record maps FSim `FIL1`–`FIL6` directly to conditional economic damage ratio for a utility-scale solar failure unit. The initial five low/base/high proposals contained 90 unsupported ordinates. Their apparent monotonicity and bounds were implementation properties, not calibration, so every ordinate and the synthetic FLP fixture were withdrawn.

The value-corrected stress test shows why fail-closed behavior matters: the withdrawn FIL6 aggregate percentage would produce $36.791M if applied to the $65.698146M direct-hardware reference subtotal, or $49.157M if incorrectly scaled across the entire $87.779570M physical reference base. The latter wrongly gives pure support rows an independent DR and applies one unsplit treatment to mixed civil row 14. These are audit-only warnings, not loss estimates.

The legacy `WILDFIRE_x_SOLAR.md` supplied useful mechanism, site-variable, and source leads, but its numerical converters, tables, weights, curves, modifiers, event anchors, and uncertainty claims fail provenance or internal-consistency tests and have no runtime effect.

## Scope and causal architecture

In scope: exogenous geographic wildfire burnover physical damage to ground-mounted utility-scale PV equipment.

Split or deferred: smoke/ash production effects, cleaning, PSPS, BI/outage duration, equipment-origin fire, BESS thermal runaway, ember-only recipient ignition, and financial/insurance terms.

```text
source-native FIL / event fire behavior
  → site/local attack transfer
     (fuels, distance, wind/slope, fences/walls/firebreaks,
      component position, burial/enclosure, access and duration)
  → component-zone radiant/convective/contact/ember state
  → BOM-specific failure and inspection/replacement state
  → same-unit direct replacement-cost ratio
  → split mixed civil row 14 into direct failure units versus pathway/support treatment
  → allocate only rows 12, 13, and 15 support costs once, outside the curve ordinate
```

Fireline intensity in `kW/m` and incident equipment heat flux in `kW/m²` are not interchangeable. FSim burn probability is frequency and stays outside M3. The 1/3/5-hour FSim active periods are simulation fire-growth windows, not equipment exposure durations.

## What is retained

- exact FSim conditional flame-length-bin semantics and product caveats;
- candidate failure-unit and coverage inventory;
- test-specific module and cable heat-flux/time observations with transfer limits;
- $1,120.000000/kWdc installed, $877.795702/kWdc physical, $656.981457/kWdc direct-hardware, and $242.204298/kWdc excluded reference reconciliation;
- explicit proposed future y-axis and support-cost treatment;
- selectors, conditioners, bridge inputs, exposure fields, and no-credit/withholding defaults;
- row-level source, claim, parameter-tier, value, and legacy audit trails;
- bounded-evidence search surfaces, query families, endpoint tests, and update triggers;
- fail-closed capability and known-answer behavior.

## Site-condition rule

Wildfire attack is site-conditioned. Fences, walls, vegetation management, firebreaks, setbacks, burial, enclosures, suppression, access, and de-energization receive no generic percentage discounts. Combustible fences may transmit fire; open-metal fences are not assumed to shield radiation; solid walls require material/height/continuity/gap/distance/wind/ember modeling. Unknown mitigation receives no credit, and missing load-bearing exposure state withholds loss.

```yaml
whole_site_exposure_default: prohibited
unknown_mitigation: NO_CREDIT
chain_link_radiant_shield_credit: DISABLED_NO_QUALIFIED_MODEL
solid_wall_credit_without_qualified_model: DISABLED_NO_QUALIFIED_MODEL
suppression_credit_without_event_response_model: DISABLED_NO_EVENT_RESPONSE_MODEL
buried_or_protected_value_in_exposed_pathway: prohibited
ember_damage_emission: withheld_deferred_pathway
```

These disabled states prevent unsupported credits; they do not assert zero exposure or zero damage. The site-adapter double-counting matrix controls overlapping fuel, distance, barrier, protection, and response fields.

## Seven-step outcome

| Step | Outcome |
|---|---|
| Define asset | `PASS_VALUE_ARCHETYPE_ONLY` |
| Decompose asset | `PARTIAL_COVERAGE_UNRECONCILED` |
| Choose basis/y-axis | `PASS_REFERENCE_BASIS_Y_AXIS_PROPOSED` |
| Split basis | `PARTIAL_ROW_GROUPS_ONLY` |
| Allocate physical value | `PARTIAL_FAIL_CLOSED` |
| Site-condition adapter | `SPECIFIED_NOT_PARAMETERIZED` |
| Apply curves/loss | `WITHHELD_NO_RUNTIME_CURVE` |

## Capability

```yaml
failure_unit_DR: withheld
scenario_loss: withheld
scalar_EAL: withheld
PML_VaR_TVaR: withheld
reason: NO_RUNTIME_CURVE
```

## Promotion gates

1. Validate a landscape/event-to-component-zone radiant, convective, contact, and duration bridge.
2. Govern ember/firebrand attack separately if it will emit damage.
3. Reconcile every material failure unit and split exposed/buried/protected value by zone.
4. Define BOM-specific inspection/failure-to-replacement rules.
5. Calibrate conditional direct replacement-cost ratios with representative tests, field/claims data, or documented structured expert elicitation.
6. Parameterize site effects without double counting and validate their applicability domain.
7. Review provenance, uncertainty, cap behavior, reportability, and a governed new-cell model release.

## Companion records

The binding evidence trail is in the source register, claim/parameter register, parameter-tier table, value crosswalk, legacy-ingestion memo, seven-step audit, site adapter, pressure test, workbook, and validation report in this directory.
