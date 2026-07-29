# Numerical candidate audit — tropical_cyclone_wind_wind model v0.1

## Disposition

Two published tower-buckling/collapse function families were independently reproduced on their native axes.
They remain audit-only because their endpoints, archetypes, and axes do not support a general economic damage
ratio for a modern onshore wind farm.

```yaml
runtime_curve_records: 0
candidate_structural_probability_records: 5
runtime_enabled_candidates: 0
economic_damage_ratio: withheld
standard_reason: NO_RUNTIME_CURVE
```

## Jaimes DS3 reproduction

Source: `TCWW-S005`, Table 3. The source form is treated as a lognormal fragility:

```text
P(DS3 | v) = Phi((ln(v_km/h) - mu_ln_km/h) / sigma_ln_km/h)
native axis = 3-second peak gust at 10 m, km/h
simulation range = 108 to 252 km/h
endpoint = tower-wall buckling with assumed structural collapse
```

| Archetype | `mu` | `sigma` | Derived median km/h | 160 | 180 | 200 | 220 |
|---|---:|---:|---:|---:|---:|---:|---:|
| generic 1 MW, Table-2 hub 44 m | 5.3165 | 0.0485 | 203.669789 | ~0.000004 | 0.005428 | 0.353868 | 0.944112 |
| generic 2.5 MW, hub 80 m | 5.2276 | 0.0516 | 186.345038 | 0.001569 | 0.250990 | 0.914733 | ~0.999378 |
| generic 3.3 MW, hub 100 m | 5.1642 | 0.0567 | 174.897485 | 0.058193 | 0.693984 | 0.990994 | ~0.999973 |

Displayed probabilities are rounded audit calculations. The workbook and validation helper retain more
precision. Table 2 is used for the 1 MW hub height; Figure 5's 40 m caption is preserved as a source
discrepancy rather than silently resolved.

### Applicability gates

The three fragilities may be considered later only when the target turbine demonstrably matches the modeled
rating/geometry/material/foundation/state assumptions and the supplied wind is on the same native axis or a
validated bridge. They do not cover:

- modern turbines outside the modeled 1–3.3 MW generic archetypes;
- blades, pitch, hub, nacelle, drivetrain, yaw, electrical, foundation, or civil assets;
- DS1/DS2-to-repair disposition and cost;
- population uncertainty, model-form uncertainty, or claims calibration;
- operating/yaw/pitch/grid states beyond the modeled setup.

The paper's vulnerability/economic step uses assumed state damage ratios because matching wind-farm loss
data were unavailable. Those assumed consequences are rejected for runtime calibration.

## Rose reproduction

Source: `TCWW-S003`, Eq. 5 and Table 1:

```text
P(buckling | v) = 1 / (1 + (alpha_knots / v_knots)^beta)
native axis = 10-minute hub-height wind, knots
endpoint = binary tower buckling of the NREL 5-MW reference turbine
```

| Control/load state | `alpha` knots | `beta` | P at 100 kt | P at 120 kt | P at 140 kt | P at 160 kt | P at 174 kt | P at 200 kt |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| active yaw, rotor aligned | 174 | 19.3 | ~0.000023 | ~0.000759 | 0.014831 | 0.165355 | 0.500000 | 0.936300 |
| non-yaw, rotor perpendicular | 140 | 18.6 | 0.001911 | 0.053799 | 0.500000 | 0.922990 | 0.982224 | ~0.998677 |

The adjacent paper is retained as a state-sensitivity and numerical validation source. It is not averaged
with Jaimes, converted to surface mph, or used as a generic onshore economic curve. The formal correction
`TCWW-S004` changes risk equations 6 and 8, not the damage function in Eq. 5/Table 1.

## Legacy memo reproduction failures

The legacy `HURRICANE_x_WIND.md` proposed ordinary-logistic component curves. Recalculation exposed defects
that make the displayed table and formulas non-authoritative.

| Check | Legacy displayed | Recalculated from displayed parameters | Result |
|---|---:|---:|---|
| blade at 130 mph | 0.569 | 0.6215 | mismatch |
| nacelle at 96 mph | 0.069 | 0.0891 | mismatch |
| foundation at 130 mph | 0.059 | 0.0706 | mismatch |
| rotor aggregate component cap | 0.88 stated | 0.82 weighted from displayed caps | mismatch |
| rotor at 130 mph | 0.6505 aggregate curve | 0.5666 weighted displayed components | mismatch |

The memo also gives incompatible Rose surface-wind conversions and conflates structural-state probability,
component replacement ratio, whole-farm exposure, and aggregate loss. All legacy parameters, conversions,
caps, and confidence labels are rejected. The memo remains useful only for source discovery and migration
regression.

## Why the candidates do not become runtime DR

```text
source-native structural fragility                 AVAILABLE, narrow
representative modern onshore target applicability MISSING
all-severity mutually exclusive states             MISSING
inspection/repair/replacement disposition           MISSING
same-unit direct cost consequence by state          MISSING
foundation/electrical/civil response                 MISSING
support allocation calibration                      MISSING
runtime axis and TC bridge                           MISSING
```

Publishing `P(collapse)` as `DR` would assert that a binary structural probability equals expected repair
cost ratio of the turbine assembly. That identity is neither defined nor supported. Model v0.1 therefore
retains the arithmetic, labels it precisely, and withholds runtime output.
