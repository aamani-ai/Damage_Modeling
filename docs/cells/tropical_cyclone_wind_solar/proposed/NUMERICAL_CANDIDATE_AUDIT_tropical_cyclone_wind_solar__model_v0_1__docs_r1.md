# Numerical candidate audit — tropical-cyclone wind × solar

**Cell:** `tropical_cyclone_wind_solar`

**Pathway:** `tropical_cyclone_wind`

**Model / docs:** model v0.1 / docs r1

**Runtime numerical candidates accepted:** **none**

This memo is the only intended home, together with the legacy-ingestion record and parameter-tier table, for candidate or rejected fragility numbers. It does not authorize a curve record.

## Gate used

A numerical candidate is runtime-eligible only if its hazard axis, asset selectors, failure-unit atom, physical state/disposition, same-unit economic consequence, value denominator, exposure grain, uncertainty, and provenance all align. A probability becomes expected physical economic damage only through an explicit mutually exclusive consequence model, for example

\[
E[DR_u\mid x]=\sum_s P(S_u=s\mid x)\,c_{u,s},
\]

where each `c_{u,s}` is direct repair or replacement cost for failure unit `u` divided by that same unit's replacement value. A fragility exceedance probability alone does not supply those severities.

## C1 — Ceferino ground-mounted extensive-failure probability

### Source-native record

Ceferino et al. (`TCWS-S002`) define

\[
q(w;v,\beta)=\Phi\!\left(\frac{\ln w-\ln v}{\beta}\right),
\]

for the probability that a large ground-mounted site has **extensive structural failure**, defined as clip or racking failure in more than 50 percent of panels, conditional on a reconstructed 3-second gust `w`.

The field basis and source summaries are:

- 14 Caribbean ground-mounted installations, average size reported near 13 MW;
- five of 14 classified with significant failure;
- observed failures begin at reconstructed gusts near 83 m/s, with mean reconstructed gust among failed sites near 91 m/s;
- ground-mounted posterior median `v ≈ 90 m/s`, with posterior standard deviation about 6 m/s;
- posterior median `beta ≈ 0.15`, with posterior standard deviation about 0.07; and
- the reported **posterior-mean** fragility rises approximately from 10 to 90 percent over 73 to 116 m/s.

The paper derives winds from a tropical-cyclone reconstruction and converts one-minute sustained wind to a 3-second gust using its stated empirical method. The source axis is therefore not interchangeable with an unbridged NHC value or an arbitrary site gust.

### Reproduction rule

The medians may be used to construct a labeled **median-parameter diagnostic** on the paper's native equation. That diagnostic must not be called the paper's posterior-mean curve. The paper's posterior mean integrates over parameter uncertainty using posterior samples; nonlinear integration is not reproduced by substituting marginal medians. A future exact reproduction should use the full posterior artifact or a digitized/source-authorized posterior-mean series, retain the reconstructed-wind method, and document numerical tolerance.

### Pressure test

| Gate | Result |
|---|---|
| pathway | relevant tropical-cyclone field evidence |
| local demand | source-defined reconstructed 3-second gust, but not a governed general site adapter |
| target asset | large ground-mounted PV, direct at broad asset class |
| architecture | fixed tilt versus tracker absent |
| failure unit | composite site clips/racking condition involving more than 50 percent of panels; not a module or support atom |
| mechanism purity | observed cascade includes debris from damaged panels |
| physical severity | binary extensive-failure exceedance; lower and higher mutually exclusive states not priced |
| economic endpoint | absent |
| value denominator | absent |
| exposure | site-level event classification, not unit exposure |
| uncertainty | explicit Bayesian and wind-reconstruction uncertainty; small sample |

### Decision

`DEFER_CANDIDATE_ONLY`. The candidate may pressure-test a future **probability** model at its exact source grain. It cannot be multiplied by an assumed cap, component value share, or whole-site value and labeled DR. In particular,

- `P(more than 50% panels have clip/racking failure)` is not expected percent of modules destroyed;
- it is not expected rack replacement fraction;
- it is not total-site repair-cost ratio; and
- the data do not authorize fixed-tilt, tracker, module, GSU, or power-conversion parameter splits.

## C2 — Perry visible-damage prevalence

Perry et al. (`TCWS-S003`) manually reviewed pre/post remote-sensing imagery for 1,534 PV sites after Hurricanes Irma and Maria. The mixed residential, commercial, and utility population yielded:

- 17 percent with visible hurricane damage; and
- 2.8 percent with more than 50 percent visible damage.

The study also reports a weak relationship between estimated maximum gust and visible damage and emphasizes installation/site heterogeneity; a highlighted nearby-site comparison differed dramatically and implicated proprietary mounting details.

| Gate | Result |
|---|---|
| target population | mixed; utility-scale ground-mounted subset not separately calibrated |
| architecture | fixed tilt/tracker generally unavailable for curve fitting |
| hazard axis | third-party maximum-gust estimates, not a complete target site-demand bridge |
| endpoint | visible module-area damage estimated from imagery |
| hidden damage / disposition | not observed |
| economic endpoint | absent |
| independence | Irma/Maria region and period overlap Ceferino; record-level independence not established |

**Decision:** `ADOPT_AUDIT_ONLY`. The percentages constrain field prevalence and support a better data-collection program. They are neither points on a utility-scale fragility curve nor economic severity values.

## C3 — DOE/FEMP St. Croix case

The St. Croix report (`TCWS-S004`) describes one 469 kW fixed-tilt array assessed as total loss after Hurricane Maria. It reports an estimated site wind near 104 mph and a design basis near 145 mph, plus beam/rack deformation, torsional response, clamp/fastener issues, corrosion, liberated modules, and electrical damage involving enclosures, conduit, inverters, switchgear, and transformers.

Those two wind values fail as candidate thresholds because the event combined high wind, wind-driven rain, and flash flooding; the case does not isolate causal shares, representative capacity, or a population failure probability. The total-loss outcome also cannot be decomposed into portable failure-unit cost ratios from public information.

**Decision:** `MECHANISM_AND_CASE_ONLY`. Do not use 104 mph as onset, 145 mph as median or capacity, or total loss as a universal severity.

## C4 — Design, qualification, and instability numbers

| Number or quantity | Source | Source-native meaning | Prohibited damage inference | Decision |
|---|---|---|---|---|
| code/design wind and pressure | `TCWS-S005`, `TCWS-S010` | design basis and fixed-tilt demand coefficients within exact provisions/geometry | as-built failure median, probability, or DR | future demand bridge only |
| `0.75 × Ucrit` | `TCWS-S006` | operating action/stow trigger 25 percent below tested instability speed | damage onset, zero boundary, or fragility point | exact-basis flag only |
| tracker `Ucrit` | `TCWS-S011`, `TCWS-S012` | critical instability speed for defined system, angle, layout, direction, row, and test flow | generic tracker threshold or economic severity | exact-system bridge candidate only |
| IEC qualification identity | `TCWS-S007`, `TCWS-S008` | test/qualification provenance | site TC capacity, survival probability, or mitigation credit | selector only |

No number in this group supplies post-event disposition or same-unit repair cost.

## C5 — NLR cost values

The NLR Q1-2025 UPV resource (`TCWS-S013`) is governed under `value_source_id=NLR_Q1_2025_UPV_PV_ONLY_2024_USD`. Its row-level component and support values can reconcile a reference denominator after unit, vintage, architecture, and site-transfer checks.

It does **not** provide a hazard probability, failure state, exposed fraction, repair disposition, salvage rule, or support-allocation function. Combining an NLR share with a Ceferino or Perry probability would not repair their atom mismatch. Value share is not an intrinsic damage cap.

**Decision:** `REFERENCE_VALUE_ONLY`; monetary output remains withheld.

## C6 — Legacy logistics and consumer blend

The legacy research bundle (`LEG-TCWS-001`) used ordinary logistics `L/(1+exp[-k(V-x0)])` on a 3-second-gust-mph label:

| Record | `L` | `k` | `x0_mph` |
|---|---:|---:|---:|
| tracker modules, stowed | 0.85 | 0.055 | 148 |
| tracker modules, mid-tilt | 0.95 | 0.065 | 115 |
| fixed-tilt modules | 0.90 | 0.048 | 130 |
| generic modules | 0.85 | 0.050 | 135 |
| tracker mounting | 0.80 | 0.055 | 120 |
| fixed mounting | 0.70 | 0.045 | 140 |
| generic substation | 0.80 | 0.040 | 120 |

The memo also contains tracker-mount and fixed-mount slope/cap drift relative to the index. More fundamentally, it describes Ceferino's ground result as `v=58 m/s`, `beta=0.30` rather than the reviewed paper's approximately `90 m/s`, `0.15`, and then turns a probability endpoint into architecture-specific capped economic DR without observed state costs.

The Hazard provisional code (`LEG-TCWS-002`) subtracts the zero-wind logistic value and blends module, mounting, and substation results with full-TIV weights `0.35`, `0.15`, and `0.08`; the remaining `0.42` is assigned zero. Its headline tracker-stow route produces approximately:

| mph | 90 | 110 | 130 | 150 | 170 | 180 | 190 | 250 | 300 |
|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| asset DR | 0.04514 | 0.10156 | 0.19424 | 0.30600 | 0.39755 | 0.42747 | 0.44770 | 0.47920 | 0.48060 |

Its headline tracker-stow asymptote is about `0.4807278`; the mid-tilt route approaches about `0.515626`. These are formula-and-weight artifacts, not evidence-backed loss ceilings.

**Decision:** `REJECT_RUNTIME_RETAIN_REGRESSION`. Preserve exact behavior only for migration comparison. Do not reuse the generic substation proxy for `PV_GSU_SUBSTATION`, do not scale `PV_POWER_CONVERSION_AND_COLLECTION`, and do not call the uncovered remainder immune.

## Final candidate disposition

| Candidate | Probability / demand evidence | Failure-unit state evidence | Same-unit cost evidence | Final status |
|---|---:|---:|---:|---|
| Ceferino extensive site failure | strong, narrow, small-sample | composite only | no | `defer_candidate_only` |
| Perry visible damage | strong field prevalence, mixed target | visible area only | no | `audit_only` |
| St. Croix case | site-specific compound case | detailed mechanisms, one outcome | not transferable | `case_only` |
| fixed-tilt design sources | engineering demand | no | no | `bridge_only` |
| tracker qualification/aeroelastic sources | exact-system engineering response | no population disposition | no | `selector_or_bridge_only` |
| NLR cost benchmark | no | no | denominator rows only | `reference_value_only` |
| legacy logistics / consumer blend | unsupported translation | unsupported | hardcoded shares/caps | `reject_runtime` |

Therefore `curve_records=[]`, `canonical_runtime_artifact=false`, and both failure-unit scalar DR and monetary loss return null with `NO_RUNTIME_CURVE` after input validation.
