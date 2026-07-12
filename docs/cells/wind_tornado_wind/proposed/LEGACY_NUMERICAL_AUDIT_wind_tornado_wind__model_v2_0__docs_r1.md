# Legacy numerical audit — wind_tornado_wind proposed model v2.0

Audit date: 2026-07-11
Status: reproducibility and rejection record; not calibration evidence

## Material audited

Two distinct legacy numerical implementations were found:

1. the repository-current Damage Modeling artifact
   `current/wind_tornado_wind__model_v1_0__docs_r4__curve_artifact.json`; and
2. the downstream Hazard Modeling convective-wind/wind-farm M3 implementation, reconstructed again in M4.

They are not the same model. Neither may be blended into the v2 proposal by provenance inheritance.

## A. Damage Modeling current model v1.0

### Reproduced equation

For failure unit `i`:

```text
r = V_3s_hub / Ve50
D50_i,path = D50_i,straight + tornado_D50_shift_i  (only for tornado variant)
DR_i = max_DR_i / (1 + exp[-k_i * (r - D50_i,path)])

default aggregate on physical reference base
  = 0.173 * DR_blade
  + 0.169 * DR_tower
  + 0.345 * DR_nacelle
  + 0.062 * DR_foundation
```

`WT_POWER_ELEC_ACCEL` is not in the default aggregate. The four included shares sum to `0.749`, so the old
aggregate asymptote is below the physical reference base even before the nacelle/foundation `max_DR` caps are
applied:

```text
asymptotic v1 physical-base aggregate
  = 0.173*1 + 0.169*1 + 0.345*0.85 + 0.062*0.65
  = 0.67555
```

### Boundary reproduction, IEC II (`Ve50 = 59.5 m/s`)

| Path/point | v1 blade DR | tower DR | nacelle DR | foundation DR | v1 aggregate / physical base |
|---|---:|---:|---:|---:|---:|
| Straight, 59.5 m/s (`r=1`) | 0.010353738 | 0.005066629 | 0.010309170 | 0.002442951 | 0.006355583 |
| Straight, 70 m/s | 0.079999565 | 0.034263065 | 0.056866024 | 0.011785960 | 0.039979890 |
| Tornado-shift variant, 51 m/s | 0.006216664 | 0.003944705 | 0.006744307 | 0.001389741 | 0.004155088 |
| Tornado-shift variant, 67 m/s | 0.136179049 | 0.070867108 | 0.089519355 | 0.015296316 | 0.067368066 |
| Tornado-shift variant, 80 m/s | 0.684483548 | 0.457581202 | 0.434641203 | 0.095482151 | 0.351617985 |

The equations are monotone and bounded, but zero-input values are positive because the logistic has no
zero-below rule. The tornado variant changes only `D50`; it does not change axis, curve form, evidence,
dispersion, damage states, or exposure contract.

### Legacy disposition

| Item | Audit result | v2 disposition |
|---|---|---|
| IEC `Ve50` normalization | Useful design selector/normalizer, not a failure threshold | Retain only for `straight_line_convective`, require explicit value |
| Generic hub-height 3-second gust | Better than 10 m input but not rotor-effective transient demand | Retain only as flagged proxy |
| Logistic component curves | Numerically reproducible; exact D50/k values are Tier 4 | Reject as v2 calibration |
| Boolean tornado D50 shift | Cannot carry distinct tornado physics/axis/evidence | Retire on future promotion |
| Independent component sum | Consequential tower/nacelle/rotor damage can be counted as independent states | Replace with mutually exclusive assembly states |
| Foundation curve | No supporting post-collapse disposition/geotechnical calibration | Withhold |
| Physical-base shares | Coarse and not row-complete for current value ledger | Replace with exact row crosswalk; do not create implicit full-base curve |

## B. Hazard Modeling hardcoded M3/M4 curves

### Reproduced implementation

The consumer defines a whole-TIV CAPEX split:

```text
rotor_blades 0.26, nacelle_drivetrain 0.21, tower 0.16, foundation 0.12,
substation 0.09, electrical 0.09, civil 0.07  -> sum 1.00
```

It then evaluates separate, directly hardcoded gust-space logistics:

```text
DR_hazard(v, path)
  = sum_s CAPEX_share_s / (1 + exp[-k_s * (v - x0_s)])
```

Straight wind includes rotor, nacelle, substation, and electrical only, with a limiting reach of `0.65`.
Tornado includes all seven buckets and tends to `1.0`. The exact dictionaries are duplicated in M3 and M4,
creating two driftable consumer copies.

### Reproduced points

| Wind m/s | Hazard straight-wind whole-TIV DR | Hazard tornado whole-TIV DR |
|---:|---:|---:|
| 36 | 0.000338579 | 0.008120595 |
| 45 | 0.004644436 | 0.065968486 |
| 51 | 0.025732474 | 0.208892114 |
| 55 | 0.074472147 | 0.361565240 |
| 59.5 | 0.199300104 | 0.541478610 |
| 65 | 0.417085686 | 0.715078851 |
| 67 | 0.486297953 | 0.762090482 |
| 69 | 0.541389138 | 0.801250212 |
| 80 | 0.643684084 | 0.929901454 |

These numbers reproduce the code, but the denominator and failure-unit semantics differ from Damage Modeling
v1 and proposed v2. The consumer curves directly damage substation/electrical/civil values with the turbine
gust and exposure path, despite those assets requiring different point/line/area intersections.

### Hazard legacy disposition

| Item | Audit result | Required migration action |
|---|---|---|
| Whole-TIV CAPEX shares | Not tied to the governed row-level value ledger | Replace with explicit site turbine-equipment value plus separate external-asset values |
| M3 and M4 curve copies | Same dictionaries are maintained twice | Load one pinned Damage artifact; M4 must consume M3 emits |
| Strong-wind cap `0.65` | A consumer assumption, not an intrinsic physical-base cap | Remove; use pathway/failure-unit outputs |
| Rule `tornado DR >= straight DR at same speed` | Not a universal scientific identity because axes/proxies and state uncertainty differ | Remove as a KAT; test each pathway against its own anchors |
| EF-band random speed as turbine input | EF is damage-estimated, not a turbine measurement | Require qualified tornado wind/profile bridge |
| Swept fraction × full TIV | Mixes turbine, foundation, line, point, and civil grains | Replace with turbine-level exposure and separate asset exposure |
| Published EAL/PML/TIV headlines | Depend on consumer frequency/exposure/value/cap assumptions | Do not use as curve calibration targets |

## Unit, sign, asymptote, and endpoint checks

| Check | v1 Damage result | Hazard legacy result | Decision |
|---|---|---|---|
| Units | Dimensionless `V/Ve50`; tornado shift dimensionless | Gust m/s | Both reproducible; not interchangeable |
| Sign | Negative tornado D50 shift raises DR at fixed ratio | Lower tornado x0 raises DR at fixed m/s | Mechanically consistent, evidentially unsupported |
| Zero input | Positive logistic tail | Positive logistic tail | v2 introduces governed zero-below behavior |
| High asymptote | Component/physical aggregate `0.67555` | straight `0.65`, tornado `1.0` of asserted TIV | Denominator-specific; none is a transferable cap |
| Endpoint | Conditional direct physical destruction is intended but component dependencies remain | Whole-TIV blend includes mixed external assets | v2 narrows to same-unit equipment endpoint |
| Exposure | Repeated-unit fraction plus shared-asset flags | full exposure or swept fraction applied to TIV | v2 requires grain-specific exposure |

## Audit conclusion

Legacy equations are retained only in the old-vs-new comparison and regression audit. No legacy D50, k,
tornado shift, CAPEX weight, full-TIV cap, EAL, PML, or tail headline calibrates proposed v2. The appropriate
transition is a schema- and consumer-migration change, not a coefficient patch.
