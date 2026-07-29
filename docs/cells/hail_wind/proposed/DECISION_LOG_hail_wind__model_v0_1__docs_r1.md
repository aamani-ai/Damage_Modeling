# Decision log — hail_wind model v0.1/docs r1

| ID | Decision | Reason | Revisit trigger |
|---|---|---|---|
| HW-D01 | Create `hail_wind` as a separate cell with `pathway_id=hail_impact`. | Hail impact is not a wind-speed pathway and cannot inherit solar response. | Formal pathway redesign with consumer migration. |
| HW-D02 | Keep occurrence physical damage separate from chronic leading-edge degradation. | Repository v1 scope is occurrence destruction; strongest public model is lifetime coating fatigue. | A governed lifecycle product is added or occurrence attribution is validated. |
| HW-D03 | Use `WT_BLADE_ASSEMBLY` as the primary candidate. | Public evidence and value ledger align most closely at blade assembly; nested states need dependency safety. | Source/SOV supports a finer coating-versus-structure split. |
| HW-D04 | Treat observed diameter and MESH as source inputs, not blade demand. | Rotor/blade motion, angle, distribution, wind, and strike history are load-bearing. | Qualified bridge passes independent review and KATs. |
| HW-D05 | Use per-turbine and separate BOP geometries. | Sparse wind-farm lease polygons are not solid damageable assets. | None; site data improve geometry fidelity. |
| HW-D06 | Withhold non-blade units rather than assign DR=0. | Missing matched evidence is not physical immunity. | Unit-specific evidence qualifies a curve or near-zero review. |
| HW-D07 | Reject the legacy alleged wind-turbine hail MDR array. | Wrong asset/citation, source identity, units, and high-end extension. | Only a correct wind-turbine source chain could supersede the rejection. |
| HW-D08 | Fail closed at model v0.1. | No public matched occurrence demand-to-disposition-to-cost chain was located. | Promotion gates close and independent review approves model v1.0. |
| HW-D09 | Do not publish or alter Hazard runtime. | Repository presence is review state, not a runtime release. | Explicit package publication and consumer cutover. |
