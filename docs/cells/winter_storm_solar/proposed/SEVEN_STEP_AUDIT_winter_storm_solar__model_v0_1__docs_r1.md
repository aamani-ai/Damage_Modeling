---
author: owner-directed (JL) · agent-drafted
created: 2026-10-12
updated: 2026-10-12
status: proposed
---

# winter_storm_solar — seven-step audit (model v0.1 / docs r1)

## Governing endpoint

```text
DR_u(x, s) = E[ direct repair-or-replacement cost of failure unit u
                / pre-event direct replacement value of the same unit u
              | delivered snow (+ glaze) gravity demand x, verified selector/conditioner state s ]
```

BI, derating, downtime, revenue, insurance, frequency and annual or tail metrics are excluded. Support costs
are allocated once, outside the ordinate.

## 1 — Asset and boundary

```yaml
asset: utility_scale_ground_mount_pv (fixed tilt or single-axis tracker)
reference: Hazard CONUS_SOLAR_REFERENCE_V2 (single-axis tracker, 100 MWac / 120 MWdc) — read-only, origin/main
value_vintage: NREL/NLR Q1-2025 PVSCM, 2024 USD
included: snowpack and glaze gravity load on arrays
neighbouring_routes: ice + wind, shedding/drift, snowmelt flood, blizzard wind, frost heave, extreme cold
excluded: BI, downtime, derating, frequency, finance, annual and tail metrics
```

The reference profile has no snow rating, module rating or stow fields. The cell declares these as selectors
and does not read them from the profile. **Status: complete.**

## 2 — Failure units

| Unit | Treatment |
|---|---|
| `WSS1_SUPPORT_STRUCTURE_COLLAPSE` | primary; ordered-state curve on r |
| `WSS1_MODULE_FIELD_BREAKAGE` | primary; direct-breakage curve on array kPa + cascade |
| `WSS1_FOUNDATION` | withheld (no snow-load evidence; frost heave is a separate pathway) |
| `WSS1_POWER_CONVERSION_AND_ELECTRICAL` | withheld |
| `WSS1_SCADA_COMMUNICATIONS` | withheld |
| `WSS1_CIVIL_INFRA` | withheld (buildings are a separate asset class) |
| `WSS1_REPLACEMENT_SUPPORT` | allocation only |

**Status: complete.** The units tile every value row (see step 4).

## 3 — Y-axis and value basis

Same-unit direct replacement cost ratio. Reference denominators are informational only; site values
override. **Status: complete.**

## 4 — Row-by-row value split

```text
1120.00 installed = 877.80 physical + 242.20 excluded (network upgrade 38.25, officework 70.28, other 133.67)
 877.80 physical  = 656.98 direct hardware + 189.59 support pool + 31.22 site prep (civil, withheld)
 656.98 direct    = 291.21 module + 109.99 racking/tracker   (active)
                  + 31.12 foundation + 224.66 electrical/SCADA (withheld)
```

**Status: complete** (validator reconciles to 1e-9).

## 5 — Physical value allocation

Per array zone, a consumer-supplied `exposed_fraction` with no default; the module and structure values
are colocated. **Status: complete for the active units.**

## 6 — Site-condition logic

See the [site-condition adapter](SITE_CONDITION_ADAPTER_winter_storm_solar__model_v0_1__docs_r1.md). Stow,
clearance and snow removal are captured with no credit; the slope factor defaults to 1.0. **Status:
complete (no credit granted).**

## 7 — Apply curves or withhold

The chain is supported at screening grade for the two active units: measured structural capacity spread,
regulator damage-share cases, and a lab module-capacity range. The mapping to the US design basis remains
T4 and is carried as scenarios. Other units are withheld. **Status: conditional screening curves; promotion
blocked (see the promotion gates).**
