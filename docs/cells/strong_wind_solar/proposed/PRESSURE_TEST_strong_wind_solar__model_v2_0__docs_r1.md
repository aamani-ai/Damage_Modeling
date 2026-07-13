# Pressure test — strong_wind_solar proposed model v2.0/docs r1

| Challenge | Test | Outcome |
|---|---|---|
| Is this a duplicate cell? | Compare current v1 scope and cell taxonomy. | No: major revamp inside existing cell. |
| Can hurricane/TC use it? | Submit `tropical_cyclone_wind`. | Reject; separate workstream. |
| Can a derecho label select it? | Supply parent label without local mechanism. | Reject upstream/withhold; local non-tornadic pathway must be resolved. |
| Can fixed and tracker share speed/design ratio? | Compare rigid-pressure and tracker aeroelastic sources. | No; architecture-specific axes required. |
| Can ASCE 10 m gust be evaluated directly? | Submit only 10 m wind. | Reject. |
| Can tracker run without Ucrit? | Omit exact-system Ucrit/qualification. | Reject. |
| Can a Ucrit from another angle/layout/speed basis be used? | Mismatch structured qualification fields. | Reject before DR or the FM action flag. |
| Does 0.75 Ucrit create damage? | Evaluate eta 0.75. | Curve remains continuous; action flag only. |
| Does confirmed stow reduce DR? | Change stow metadata with same exact-system Ucrit. | No numeric change; no universal credit. |
| Are 1P and 2P multiplied differently? | Compare calls with the same qualified Ucrit ratio. | No generic modifier; identity preserved. |
| Are scenarios probabilistic? | Inspect artifact/KAT/capability. | No weights; explicit nonprobabilistic envelope. |
| Are curves monotone and bounded? | Dense grid 0–2 for all four records/scenarios. | Validator must pass. |
| Do state probabilities close? | All KAT and dense-grid points. | Must sum to 1 within `1e-12`. |
| Does structure replacement always destroy modules? | Compare DS2 salvage, DS3 destructive collapse and two salvage bounds. | No deterministic claim; central and bounds remain explicit T4 assumptions. |
| Are nonterminal states independent? | Inspect rule. | Not claimed; dependence flagged. |
| Can foundation inherit structure DR? | Request foundation. | Null/withheld. |
| Can support be multiplied by both DRs? | Inspect value rule. | Prohibited; allocate once after direct state. |
| Is 35.82% installed share a cap? | Inspect value mapping. | No; reporting contribution only. |
| Can reference values be defaults? | Omit values from loss assembly. | Reject/withhold monetary loss. |
| Does output cover full plant? | Inspect coverage matrix. | No; array module+structure only. |
| Does extrapolation silently clamp? | Submit index 2.1. | Reject. |
| Does current v1 remain unchanged? | Verify artifact SHA/index/changelog. | Required promotion invariant. |

## Numerical boundary checks

- Below `x=0.10`, DS0 is returned by an explicitly T4 numerical boundary.
- At `x=1`, fixed central module/structure DRs are `0.1354252692` and `0.1093220595`.
- At tracker `eta=1`, central module/structure DRs are `0.1569055851` and `0.1398263586`.
- Lower-resistance DR is never below central; central is never below upper-resistance.
- At fixed `x=1` with reference values and 25% colocated exposure, central direct array loss under the DS3
  T4 non-salvage rule is `13.8850509347` in the supplied value currency; full-salvage and
  no-salvage-on-any-structure-replacement bounds remain visible.

## Remaining red-team objections

1. T4 curves could be mistaken for calibrated fragility. Mitigation: lifecycle/model-grade flags at artifact,
   record, guide, workbook and emit layers; promotion blocked.
2. Exact-system Ucrit under ABL testing may not transfer to downburst. Mitigation: named convective-profile
   bridge remains mandatory and independent engineering review is a gate.
3. Fixed pressure-index resistance may still hide connection capacity variation. Mitigation: broad scenarios,
   fastener audit metadata and no favorable default.
4. Terminal cascade is only one part of joint dependence. Mitigation: nonterminal dependence flag and state
   ensembles retained.
5. Reference values can differ substantially from replacement cost. Mitigation: no implicit value profile.
