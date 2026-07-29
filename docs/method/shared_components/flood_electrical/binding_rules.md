# Flood-electrical binding rules

## 1. Binding key

A cell may bind to a common concept only after recording:

- physical component instance and stable asset subject ID;
- component family and construction;
- voltage/function and indoor/outdoor configuration;
- enclosure or submersion listing;
- vulnerable datum and vertical reference;
- duration, water quality/contamination/salinity, and energized/isolation state;
- same-unit direct value and ownership/inclusion status;
- source cell/response/version/SHA when a numeric candidate is reviewed.

Missing values remain missing. They do not default to dry, protected, project-owned, fully exposed, or zero damage.

## 2. Asset-neutral versus cell-local

| Item | Shared substrate | Cell binding |
|---|---:|---:|
| equipment/mechanism identity | yes | confirms presence |
| local-depth axis definition | yes | supplies WSE, datum, and transform |
| intrinsic candidate response | may reference | approves or withholds |
| component elevation/geometry | no | yes |
| value and ownership | no | yes |
| exposed fraction | no | yes |
| support/logistics | no | allocate once in cell/consumer |
| outage/BI | no | downstream only |

## 3. Legacy Hazus whole-substation screening assembly

`FE_HAZUS_SUBSTATION_SCREENING_ASSEMBLY` is an alternative representation of one complete substation, not another component beneath the substation tree. Its source-native response is `FE_HAZUS21_SUBSTATION_ASSEMBLY_SCREENING_V1`:

    x = local flood depth above substation grade, ft
    x = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    DR = [0, .02, .04, .06, .07, .08, .09, .10, .12, .14, .15]

The same series applies to legacy Hazus classes `ESSL`, `ESSM`, and `ESSH`. Its denominator is the full direct replacement value of the same physical substation assembly. The 4 ft functionality threshold remains a separate operational quantity and must not alter the DR curve or enter direct physical loss.

Linear interpolation is permitted only between the published 0–10 ft knots. Negative or nonfinite depth rejects; depth above 10 ft withholds. Endpoint clamping and extrapolation are prohibited.

The assembly may be bound by a cell only when all of the following are explicit:

- one stable physical substation asset-instance ID;
- a local flood depth above the same substation-grade datum used by the source-native axis;
- low-, medium-, or high-voltage substation screening-class applicability, or an explicitly weaker generic sensitivity;
- project/utility ownership, insured inclusion, and full same-substation direct replacement value;
- a `legacy_source_native_screening` grade and limitation flag;
- one representation mode for the event: `whole_substation_assembly` **or** `component_decomposition`.

Assembly mode is mutually exclusive with `FE_SUBSTATION_SWITCHGEAR`, `FE_GSU_TRANSFORMER_MAIN`, `FE_GSU_TRANSFORMER_AUX_CONTROLS`, `FE_PROTECTION_SCADA_CONTROL`, `FE_STATION_SERVICE_DC`, and `FE_CABLE_TERMINATIONS` for the same physical substation, event, and value basis. If the assembly is evaluated, every component output and value charge for that substation is suppressed; if any component response is evaluated, the assembly is suppressed. The curve cannot be decomposed into component ordinates or applied to the mixed wind electrical rollup or whole-project TIV.

Hazus 7.0 classifies electric-power facilities as mapping-only and states that its default electric-power damage functions are disabled. Consequently this candidate is legacy screening evidence, not current Hazus runtime authority, renewable-specific calibration, or proof of component transferability.

## 4. Transformer split

`FE_GSU_TRANSFORMER_MAIN` covers the main active system/tank/core/windings/insulating medium at a same-unit direct-value denominator. Bushings, LTC drives, marshalling cabinets, cooling controls, terminal boxes, and local auxiliaries may have different vulnerable datums and disposition; they belong under `FE_GSU_TRANSFORMER_AUX_CONTROLS` unless evidence proves a dependency-safe assembly state.

Do not apply a controls-level waterline to the full main-transformer value.

## 5. Protection/control split

Plant-wide SCADA, substation protection relays, communications, station service, and DC battery/charger systems are not synonyms. Bind and value them separately unless a sourced same-replacement-unit assembly is used.

## 6. Cable split

Buried wet-rated cable may survive while joints, terminations, pull boxes, conduits, and control wiring fail. A cell must identify the actual pathway and value subject. Solar AC/DC and wind MV collection are different physical inventories even if one termination response is reusable.

## 7. Pathway rule

`flood_inundation_contact` may accept riverine, pluvial, or coastal delivered exposure only when event identity and the full conditioner vector are preserved. Scour, erosion, saturated-soil support loss, and debris impact require separate pathways.

## 8. Ownership rule

A generation-associated map feature proves functional association, not legal ownership or insured inclusion. Unknown or third-party ownership means baseline project physical loss is withheld/excluded while dependency exposure and a separately named sensitivity may remain.

## 9. Runtime rule

Current catalog entries have reuse status `definition`, `axis`, `evidence`, `candidate_curve`, or `source_native_screening_candidate`. None is `runtime_approved` in the shared layer. A cell with no approved local record must return `NO_RUNTIME_CURVE`, never zero or a neighboring-cell/shared-method fallback. A flood-wind-local materialization of the Hazus assembly does not make this folder loadable and does not promote any component curve.

## 10. CONUS versus per-asset application

Application scale does not create a second intrinsic curve. Once a response passes the exact compatibility
key, CONUS screening and per-asset analysis use that same versioned response:

- a CONUS view binds governed class-template inventories, exposure/value distributions, coverage, and
  uncertainty;
- a per-asset view binds observed component instances, local WSE/elevations, selectors, ownership, and value.

Different bindings can produce different losses without changing the curve. Missing per-asset facts must not
silently fall back to favorable CONUS template values; the result remains withheld or explicitly labeled as a
class-template screening view.

Using observed per-asset depth or value with the Hazus assembly improves the binding but does not upgrade the legacy curve beyond screening grade. Component-resolved analysis remains the intended deeper successor.
