# Workbook sheet manifest — tropical_cyclone_wind_wind proposed model v1.0/docs r1

Workbook: `damage_curve_records_tropical_cyclone_wind_wind__model_v1_0__docs_r1.xlsx`  
Status: **proposed, noncanonical audit companion**

The workbook must implement the 12-sheet order below. Its purpose is to make the source equation, exact
selectors, runtime range, source-specific denominator, withheld units, and old-versus-new differences
reviewable. It does not broaden the machine capability or promote the model.

| Order | Sheet | Purpose | Required reconciliation / QA |
|---:|---|---|---|
| 1 | `README` | Identity, model/docs/schema status, navigation, and noncanonical warning | Must say scalar source-unit DR only; no CWER/dollar/plant/annual output |
| 2 | `Scope_Coverage` | Pathway boundary and all supported/withheld/support failure units | Exactly one pathway; one conditional source unit; every standard turbine/BOP/support unit explicit |
| 3 | `Inputs` | Native axis, selector tuples, source-state limitation, range, rejection and metadata rules | Must distinguish hazard-axis ID `TC_PEAK_GUST_3S_10M_KMH_JAIMES` from evaluated field/record x-axis `tc_peak_gust_3s_10m_kmh`; no default/proxy selector or unit/height/duration alias |
| 4 | `Jaimes_Curves` | Formula-driven Eq. 1 grids for all three exact source classes | `V<=90` zero; 90-108 visibly audit-only/withheld; 108-252 evaluated; >252 withheld; midpoint identity exact |
| 5 | `Failure_Units` | Source-specific unit, standard InfraSure units, spatial grains, and no-double-count boundary | Jaimes atom must not be relabeled or summed with CWER equipment; unsupported units remain null |
| 6 | `Value_Crosswalk` | Existing CWER reference rows and source-denominator nonbinding decision | Reconcile `1090 + 239 + 294 + 345 = 1968`; no CWER row binds the Jaimes DR |
| 7 | `Old_vs_New` | v0.1 no-curve, current Hazard placeholder, legacy memo, and v1 source curve | Values and statuses must match the governed comparison CSV; denominators/axes visible |
| 8 | `KATs` | Human-readable mirror of executable positive and negative fixtures | IDs, inputs, expected values/statuses/reason codes must match KAT JSON |
| 9 | `Source_Register` | Governed source records reused from the v0.1 proof trail plus final adoption status | Stable IDs and exact locators; `TCWW-S005` must not be duplicated |
| 10 | `Claim_Register` | Claim/parameter/source/tier/decision map | Every load-bearing Eq. 1, parameter, range, denominator, selector, and capability claim resolves |
| 11 | `Parameter_Tiers` | Adopted parameters, evidence tier, permitted/prohibited use, and update trigger | Source-derived parameters remain screening grade; assumed costs and denominator ambiguity visible |
| 12 | `QA` | Formula, selector, range, value, sheet, source-link, and spreadsheet-error checks | Every required check `PASS`; no formula error or unsupported numeric output |

## Required `Inputs` and `Jaimes_Curves` content

`Inputs` must expose editable source parameters and `Jaimes_Curves` must reference them rather than paste
only ordinates:

| Selector ID | `V_zero_kmh` | `delta_V50_kmh` | `rho` | `V_at_DR50_kmh` | `max_dr` |
|---|---:|---:|---:|---:|---:|
| `TCWW_JAIMES_GENERIC_1MW_HH44_V1` | 90 | 106.77 | 8.94 | 196.77 | 1 |
| `TCWW_JAIMES_GENERIC_2P5MW_HH80_V1` | 90 | 82.52 | 4.54 | 172.52 | 1 |
| `TCWW_JAIMES_GENERIC_3P3MW_HH100_V1` | 90 | 73.30 | 4.99 | 163.30 | 1 |

Formula cells must implement:

```text
IF(V<=V_zero, 0,
   max_dr * (1 - POWER(0.5, POWER((V-V_zero)/delta_V50, rho))))
```

Runtime-status cells are separate from formula cells. In particular:

```text
0 <= V <= 90    -> supported + SOURCE_ASSUMED_NO_DAMAGE_THRESHOLD_NOT_EMPIRICAL
90 < V < 108    -> withheld + BELOW_SOURCE_SIMULATION_RANGE
108 <= V <= 252 -> supported
V > 252         -> withheld + ABOVE_SOURCE_SIMULATION_RANGE
```

The workbook may display mathematical audit values at 100 or 253 km/h only when the runtime-output cell is
blank/null and the status is withheld.

## Required QA checks

At minimum, `QA` must verify:

1. exact workbook sheet names and order;
2. all three selector IDs and rating/hub/rotor tuples are unique and complete;
3. the 1 MW tuple uses 44 m and carries the 40/44 m source discrepancy flag;
4. every midpoint produces DR `0.5` within the executable KAT tolerance;
5. each supported grid is finite, bounded `[0,1]`, and nondecreasing;
6. the domain endpoints and open 90-108 gap have the required statuses;
7. the old-versus-new rows match the CSV, including blank v0.1/runtime-withheld cells;
8. `1090 + 239 + 294 = 1623` and `1623 + 345 = 1968`;
9. no value row binds the Jaimes source-unit DR to CWER, dollar, or plant loss;
10. every unsupported failure unit returns a withholding reason rather than numeric zero;
11. every adopted source/claim/parameter reference resolves to a governed ID;
12. noncanonical, source-assumed-cost, denominator-ambiguity, component-coverage, and no-spread flags exist;
13. no `#REF!`, `#DIV/0!`, `#VALUE!`, `#NAME?`, or `#N/A` error exists in used ranges;
14. workbook formulas survive export/re-import and the XLSX ZIP is valid.

## Validation record required before review-ready status

After the workbook is frozen, record in the validation report—not by manually changing formula outputs here:

- exact workbook SHA-256;
- formula-cell count and round-trip result;
- rendered visual review of every sheet;
- spreadsheet-error scan result;
- KAT/CSV/artifact reconciliation result;
- final source/claim/parameter row counts;
- any intentionally blank/withheld output cells.

Until those checks are complete, the manifest defines the required workbook structure but does not claim the
binary has passed. Even after it passes, JSON remains runtime truth and the dossier/registers remain
derivation truth.
