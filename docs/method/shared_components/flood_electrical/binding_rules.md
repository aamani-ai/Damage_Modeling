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

## 3. Transformer split

`FE_GSU_TRANSFORMER_MAIN` covers the main active system/tank/core/windings/insulating medium at a same-unit direct-value denominator. Bushings, LTC drives, marshalling cabinets, cooling controls, terminal boxes, and local auxiliaries may have different vulnerable datums and disposition; they belong under `FE_GSU_TRANSFORMER_AUX_CONTROLS` unless evidence proves a dependency-safe assembly state.

Do not apply a controls-level waterline to the full main-transformer value.

## 4. Protection/control split

Plant-wide SCADA, substation protection relays, communications, station service, and DC battery/charger systems are not synonyms. Bind and value them separately unless a sourced same-replacement-unit assembly is used.

## 5. Cable split

Buried wet-rated cable may survive while joints, terminations, pull boxes, conduits, and control wiring fail. A cell must identify the actual pathway and value subject. Solar AC/DC and wind MV collection are different physical inventories even if one termination response is reusable.

## 6. Pathway rule

`flood_inundation_contact` may accept riverine, pluvial, or coastal delivered exposure only when event identity and the full conditioner vector are preserved. Scour, erosion, saturated-soil support loss, and debris impact require separate pathways.

## 7. Ownership rule

A generation-associated map feature proves functional association, not legal ownership or insured inclusion. Unknown or third-party ownership means baseline project physical loss is withheld/excluded while dependency exposure and a separately named sensitivity may remain.

## 8. Runtime rule

Current catalog entries have reuse status `definition`, `axis`, `evidence`, or `candidate_curve`. None is `runtime_approved`. A cell with no approved record must return `NO_RUNTIME_CURVE`, never zero or a neighboring-cell fallback.

## 9. CONUS versus per-asset application

Application scale does not create a second intrinsic curve. Once a response passes the exact compatibility
key, CONUS screening and per-asset analysis use that same versioned response:

- a CONUS view binds governed class-template inventories, exposure/value distributions, coverage, and
  uncertainty;
- a per-asset view binds observed component instances, local WSE/elevations, selectors, ownership, and value.

Different bindings can produce different losses without changing the curve. Missing per-asset facts must not
silently fall back to favorable CONUS template values; the result remains withheld or explicitly labeled as a
class-template screening view.
