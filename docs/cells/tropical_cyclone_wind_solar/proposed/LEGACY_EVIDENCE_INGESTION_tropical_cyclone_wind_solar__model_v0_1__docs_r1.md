# Legacy evidence ingestion — tropical-cyclone wind × solar

**Disposition:** `REJECT_RUNTIME_RETAIN_AUDIT`

**Cell:** `tropical_cyclone_wind_solar`

**Model / docs:** model v0.1 / docs r1

**Reviewed:** 2026-07-28

## Intake pins

The old research package and the downstream provisional implementation are retained as two distinct legacy objects. Neither is a scientific source for the new scaffold.

| Legacy ID | Repository pin | File pin / locator | Permitted use |
|---|---|---|---|
| `LEG-TCWS-001` | `infrasure-damage-curves` commit `12653b2c3d5a013c9524228243ea666c35bb3814` | `research/HURRICANE_x_SOLAR.md`, blob `ea9febd74f91e79a41b5f7aca5ebd58d36a7230d`; `data/master_curve_index.json`, blob `42e4b3d13d434322dd1e0c8d549d0e4b8167f28e` | source discovery, numerical reproduction, defect audit, and migration fixtures |
| `LEG-TCWS-002` | `Hazard_modeling` commit `5033169cfed315dfe8575520a44f84404e89ecda` | `Notebooks/hurricane/solar/m3_damage/01_damage.py`, blob `d5cba3db1ed9f55bd2e8d1884b4a1f2fc144c3d2`, especially lines 14–39, 56–105, 136–183, 197–207 | exact consumer-behavior regression only |

The decision is intentionally bundle-level: no individual legacy number is promoted merely because it can be reproduced.

## Legacy research bundle reproduced

The master index stores ordinary logistic records of the form

\[
f(V)=\frac{L}{1+\exp[-k(V-x_0)]},
\]

with wind speed `V` labeled as 3-second gust in mph. The legacy memo and index contain the following proposed records.

| Legacy record | `L` | `k` | `x0_mph` | Runtime disposition |
|---|---:|---:|---:|---|
| tracker modules, stowed | 0.85 | 0.055 | 148 | rejected; audit only |
| tracker modules, mid-tilt | 0.95 | 0.065 | 115 | rejected; audit only |
| fixed-tilt modules | 0.90 | 0.048 | 130 | rejected; audit only |
| generic modules | 0.85 | 0.050 | 135 | rejected; audit only |
| tracker mounting | 0.80 | 0.055 | 120 | rejected; audit only |
| fixed mounting | 0.70 | 0.045 | 140 | rejected; audit only |
| generic substation | 0.80 | 0.040 | 120 | rejected; audit only |

Two internal drifts are also preserved rather than silently reconciled:

- the narrative memo summarizes tracker mounting as `L=0.75`, `k=0.058`, `x0=120`, while the index uses `0.80`, `0.055`, `120`; and
- the narrative memo summarizes fixed mounting as `0.70`, `0.042`, `140`, while the index uses `0.70`, `0.045`, `140`.

This drift is itself a provenance failure: a consumer cannot know which record was intended without an explicit versioned choice.

## Primary-source correction

The memo attributes a ground-mounted hurricane fragility near `v=58 m/s` and `beta=0.30` to Ceferino et al. That is not the ground-mounted posterior reported in the reviewed 2023 paper. `TCWS-S002` reports ground-mounted posterior medians of approximately `v=90 m/s` and `beta=0.15`, for the probability that a **site** experiences extensive clip/racking failure in more than 50 percent of panels.

The error is not repaired by replacing the two legacy numbers. Even the corrected Ceferino probability remains ineligible for direct runtime use because:

1. probability of a composite site limit state is not a physical economic damage ratio;
2. the 14-site table does not identify fixed tilt versus tracker;
3. failure-unit disposition, salvage, and direct cost are absent;
4. observed cascade includes debris; and
5. the source retains posterior parameter and reconstructed-wind uncertainty.

The legacy bundle instead applied unsupported architecture shifts, caps, and slopes and treated the resulting ordinary logistics as damage ratios. Those transformations have no complete source-to-parameter chain.

## Downstream consumer behavior reproduced

The Hazard provisional implementation copied a subset of the legacy records, subtracts the zero-wind value from each logistic, and combines them with hardcoded full-TIV weights:

- PV/modules: `0.35`;
- mounting: `0.15`;
- substation: `0.08`; and
- remainder: `0.42`, assigned zero wind damage.

For the consumer's headline tracker-stow route, the audited whole-asset outputs are:

| 3-second gust (mph) | provisional asset DR |
|---:|---:|
| 90 | 0.04514 |
| 110 | 0.10156 |
| 130 | 0.19424 |
| 150 | 0.30600 |
| 170 | 0.39755 |
| 180 | 0.42747 |
| 190 | 0.44770 |
| 250 | 0.47920 |
| 300 | 0.48060 |

The headline tracker-stow route approaches approximately `0.4807278`; the mid-tilt route approaches approximately `0.515626`. These are implementation consequences of caps, fixed weights, and the zero remainder—not observed whole-plant damage ceilings. Subtracting `f(0)` anchors the curve at zero but does not renormalize it to its nominal cap.

## Why runtime reuse is rejected

| Gate | Finding | Decision |
|---|---|---|
| Hazard axis | nominal 3-second-gust mph label, but no governed storm-field-to-site/array bridge | fail |
| Pathway | aerodynamic pressure, windborne debris, rain/ingress, and generic substation effects are mixed | fail |
| Asset selectors | fixed tilt, tracker stow, tracker mid-tilt, and generic shifts are not supported by the cited field population | fail |
| Failure-unit atom | module, mounting, and substation proxies do not match a complete mutually exclusive state/disposition model | fail |
| Economic endpoint | logistic exceedance concepts are converted to capped DR without same-unit repair/replacement-cost evidence | fail |
| Value basis | weights are hardcoded full-TIV fractions with no pinned row-level denominator or site transfer rule | fail |
| Exposure | array, point/yard substation, and uncategorized remainder are pooled at whole-asset grain | fail |
| Coverage | the 42-percent remainder is treated as approximately wind-immune rather than explicitly withheld | fail |
| Provenance | source mischaracterization and memo/index parameter drift leave parameters unresolved | fail |
| Uncertainty | no governed aleatory/epistemic treatment or parameter-scenario identity | fail |

The numerical reproduction is therefore a **migration invariant**, not a candidate model.

## Coverage treatment carried forward

The new scaffold preserves the legacy bundle's useful signal—that solar-plant loss is not only a module-field question—without preserving its numeric proxies.

- `PV_FIXED_TILT_MODULE_FIELD`, `PV_FIXED_TILT_SUPPORT_STRUCTURE`, `PV_TRACKER_MODULE_FIELD`, and `PV_TRACKER_SBOS_ASSEMBLY` are explicit candidate-primary units, all withheld.
- `PV_POWER_CONVERSION_AND_COLLECTION` remains explicit and withheld; inverter, combiner, line, enclosure, grounding, and collection mechanisms must not inherit array DR.
- `PV_GSU_SUBSTATION` is split as an explicit shared point/yard subasset and withheld. The legacy generic substation logistic is not reused. Asset-neutral GSU identity and value governance may be shared across solar and wind only after an explicit cross-asset mapping; hazard response remains pathway specific.
- foundation, SCADA/communications, civil infrastructure, and replacement support retain separate roles; absent curves are never encoded as zero.

## Migration rule

No legacy value appears in `curve_records`, no legacy curve can be selected as a fallback, and no consumer output is reportable from this scaffold. A future cutover must compare the new governed artifact with the pinned legacy fixture, explain differences, and obtain an explicit behavior-change approval. Until that release, model v0.1 remains noncanonical with `curve_records=[]` and `NO_RUNTIME_CURVE` for scalar damage and loss.
