# Hazard × asset coverage framing

> Status: accepted planning input on 2026-07-28. The executable sequence now lives in the
> [coverage plan](../../../plans/hazard_asset_coverage/README.md).

## The ambiguity to resolve

The portfolio table mixes three different ideas:

1. a hazard × asset pair has a named row;
2. the repository has a governed cell package for that row; and
3. the cell has a calibrated, canonical runtime curve.

Those are not the same. Treating them as one status hides missing boundaries and can also overstate weak
models. The useful reporting pair is therefore:

```text
structural coverage = canonical cells + complete fail-closed scaffolds
runtime coverage    = canonical output-bearing cells only
```

## Portfolio read

Before the current build:

- five pairs had canonical model-v1 runtime artifacts;
- `flood_wind` and `tropical_cyclone_wind_wind` had complete model-v0.1 scaffolds;
- tropical-cyclone wind × solar was the only active row without a governed cell; and
- hail × wind and wildfire × wind were deliberately marked `Later` and had no cell.

This supports a coverage-first choice: establish tropical-cyclone wind × solar honestly, then reopen the two
deferred wind-asset pairs one at a time before another deep model-v2 cycle. Tropical-cyclone wind × solar,
hail × wind, and wildfire × wind are now complete model-v0.1 scaffolds. A later 2026-08-08 release promoted
flood × wind and wildfire × wind as explicitly partial screening models, bringing canonical output-bearing
coverage to 7/10; the remaining work is depth, not an unnamed coverage gap.

**Release update, 2026-08-09:** the pressure-tested tropical-cyclone wind × wind v1 package is now canonical
for three exact Jaimes selectors on one source-native turbine/tower atom. No generic turbine transfer,
whole-farm value, or annual/tail claim was added. Repository-current canonical coverage is now 8/10.

**Release update, 2026-08-08:** explicit owner authorization advanced wildfire × wind to model v1.0 for two
electrical failure units and promoted it together with flood × wind after common bundle-v3 consumer tests.
Wildfire ordinates remain Tier-4; flood remains a legacy source-native assembly proxy; all other units are
withheld-not-zero. Canonical runtime coverage was then 7/10.

**Depth update, 2026-07-28:** the first one-cell deep pass advanced tropical-cyclone wind × wind from its
v0.1 scaffold to a noncanonical model-v1.0 proposal with three exact source-native Jaimes curves for one
quarantined turbine/tower exposure unit. Standard wind-farm units, value binding, scenario loss, and consumer
promotion remained withheld; at that stage the canonical runtime count stayed 5/10. The 2026-08-09 release
promoted the exact same bounded science without resolving or relaxing those wider coverage gaps.

The second deep pass first advanced flood × wind to a noncanonical model-v1.0 proposal with one exact legacy FEMA
whole-substation screening curve. It does not create component curves: all GSU components and wind-specific
units remain withheld, the full same-substation value may bind only after promotion, and current Hazus 7.0's
mapping-only/disabled status remains an explicit limitation. The later partial-screening release promoted this
exact bounded model without changing the curve or claiming component completeness.

The third deep pass advanced tropical-cyclone wind × solar only as an owner-authorized, noncanonical
coverage-first screening exception. One Perry ground/nontracking source-cohort visible-module-hardware atom
is conditionally numeric on the dataset-native 17.4–39.1 m/s gust field and six exact acknowledgements. The
strict evidence-earned result remains model v0.1/`NO_RUNTIME_CURVE`: the cohort is mixed scale, wind-product
semantics are unresolved, two Tier-4 assumptions create the economic meaning, the severe tail is sparse, and
every generic module, tracker, rack, foundation, electrical, GSU, civil, support, dollar, annual, and tail
output remains withheld. At that stage the canonical runtime count remained 5/10; the later two-cell release
raised the current count to 7/10; the later TC-wind × wind release raised it to 8/10.

The fourth deep pass completed `hail_wind` as an evidence-only docs-r2 revision. Independent primary-source
and repository/legacy reviews found stronger coated-coupon, operational-field, simulation, test-method, and
inspection material, but still no occurrence contact → disposition → same-blade cost chain. Model v0.1 and
`NO_RUNTIME_CURVE` remain the strict execution truth; no source-specific screening atom or canonical runtime
count was added. `wildfire_wind` was next and has since completed its partial-screening release.

## Why not publish a quick curve?

A row is not a damage model. A release-ready curve needs a matched chain:

```text
hazard demand at the failure unit
  -> observed or defensible physical state/disposition
  -> same-unit direct repair or replacement cost
  -> value and exposure at the same subject grain
```

When public evidence supplies mechanisms or a narrow structural-failure probability but not that chain, the
correct coverage product is a complete v0.1 package with `curve_records: []` and `NO_RUNTIME_CURVE`. That
package still eliminates ungoverned placeholders, names the missing data, and creates a safe consumer seam.

If the portfolio owner deliberately authorizes a screening exception, it does not erase that strict result.
The exception may become canonical only when its screening grade is load-bearing, its exact source/
assumption bridge and selectors are machine-enforced, unsupported units/metrics remain explicit, the v0.1
alternative is retained, and the common consumer seam passes.

## Shared-component implication

Coverage remains hazard × asset because release, applicability, exposure, value, and evidence are local. A
shared component such as a GSU/substation may use common anatomy and field definitions, but its response is
not inherited across hazards or host assets.

For the tropical-cyclone wind × solar cell, this means:

- keep the GSU/substation inside the solar cell as a separate failure unit;
- match it to a shared point or yard-polygon exposure and its own value;
- route flood/surge, direct wind, debris, and rain ingress separately; and
- withhold the TC-wind curve until matching demand, disposition, and cost evidence exists.

This is compatible with the existing
[flood/wind shared-electrical discussion](../flood_wind_shared_electrical/README.md): common substrate, local
binding, and no implicit cross-cell runtime dependency.

The same rule is now explicit in `wildfire_wind`: one shared GSU yard is decomposed into transformer,
switchgear/bus, protection/control/DC, and cable-termination units. Solar and wind may reuse that physical
anatomy and field vocabulary when equipment matches, but each hazard × asset cell still owns local attack,
exposure, value, evidence, capability, and release.
