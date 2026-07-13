# Decision log — strong_wind_solar proposed model v2.0/docs r1

| ID | Decision | Evidence/reason | Consequence | Revisit trigger |
|---|---|---|---|---|
| SWS2-D01 | Revamp `strong_wind_solar`; do not create `convective_wind_solar`. | Current v1 already claims straight-line/derecho wind. | One cell identity, no overlapping artifacts. | Repository taxonomy redesign. |
| SWS2-D02 | Require `pathway_id=straight_line_convective`. | Downburst/derecho local outflow differs from TC, tornado and synoptic wind. | Wrong/missing pathways reject. | Contract redesign. |
| SWS2-D03 | Exclude hurricane/TC, tornado, hail, debris and ingress. | Different duration, wind field, impact/exposure and endpoints. | No neighboring-hazard numeric fallback. | Equivalence study passes. |
| SWS2-D04 | Split rigid fixed tilt and qualified single-axis trackers. | Fixed arrays use pressure/load paths; trackers can be aeroelastically unstable. | Distinct records and axes. | Transfer evidence proves equivalence. |
| SWS2-D05 | Fixed axis is qualified transient event/design net-pressure-demand ratio. | Better matches structural demand than raw wind without claiming design demand is resistance. | Named bridge required; T4 curve medians carry capacity uncertainty. | Validated alternative demand/capacity metric. |
| SWS2-D06 | Permit a fixed speed-squared proxy only with array-height/design gust and two named bridges. | Pressure scales with `V²`, but convective profile and coefficients are not universal. | Flagged lower-fidelity evaluation. | Qualified pressure field becomes standard. |
| SWS2-D07 | Tracker axis is `V_normal/Ucrit` from exact-system aeroelastic qualification. | Critical velocity varies with design, 1P/2P, angle, row and direction. | No generic tracker Ucrit or fixed-tilt coefficient. | Validated damage-demand metric. |
| SWS2-D08 | Keep FM `0.75 Ucrit` as an action flag only. | It is an operational stow margin. | No hard zero or damage step at 0.75. | FM criterion changes. |
| SWS2-D09 | Carry stow/angle/control as context; no universal numeric credit. | Public evidence does not calibrate an effect and current v1 logic is defective. | Exact attained condition belongs in Ucrit/bridge. | Tracker-specific calibration. |
| SWS2-D10 | Separate module and structure records. | Value rows are separate and module-only/structure-only outcomes are not one valid severity order. | Four active records across two architectures. | Joint-state/cost evidence supports another assembly. |
| SWS2-D11 | Separate structure replacement from destructive collapse and expose module-salvage bounds. | Structural damage can destroy modules, but public cases do not prove universal non-salvage. | DS2 assumes salvage; DS3 central T4 non-salvage; full-salvage and no-salvage-on-replacement bounds. | Claims-level dependence/salvage data. |
| SWS2-D12 | Withhold foundations, electrical, SCADA and civil. | Missing mechanism/value/exposure grain. | Null outputs with reason codes. | Failure-unit-specific evidence. |
| SWS2-D13 | Allocate replacement support once outside intrinsic DR. | Labor/inspection are repair consequences, not hardware. | Explicit downstream rule required. | Claims allocation data. |
| SWS2-D14 | Use the Q1-2025 repository value crosswalk as reference only. | It is current and row complete but not a site BOM. | No implicit value profile. | New benchmark/site valuation. |
| SWS2-D15 | Serialize Q1-2024 tracker and Q1-2021 fixed ranges as sensitivities only. | They add architecture context but differ in vintage/basis. | Never blend values. | Current architecture-specific benchmark. |
| SWS2-D16 | Publish T4 numerical scenarios because the user explicitly accepts approximation. | No matched public calibration set exists; a fail-closed scaffold alone would not meet the requested curve outcome. | Screening model with broad unweighted envelopes and blocked promotion. | Matched data or formal elicitation. |
| SWS2-D17 | Use ordered lognormal state records as an auditable surrogate. | Monotone/bounded/state-explicit; not a statistical claim. | `beta` and medians remain T4. | Model comparison on population data. |
| SWS2-D18 | Keep v1 canonical. | v2 changes behavior, contract and values. | Proposal absent from index/changelog. | All promotion gates pass. |
