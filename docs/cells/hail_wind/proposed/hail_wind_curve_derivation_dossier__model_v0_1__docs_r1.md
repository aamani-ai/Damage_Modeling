# Hail × onshore wind derivation dossier — model v0.1/docs r1

## 1. Decision

The reviewed package supports a governed zero-curve scaffold, not a runtime model. Public sources establish
that hydrometeor impacts can damage leading-edge protection and composite blades, and that hail size,
relative speed, blade section, impact angle, rotor state, and repeated impacts matter. They do not provide
the required occurrence-level economic endpoint.

## 2. Physical boundary

The cell covers direct atmospheric hail impact during one occurrence. It excludes chronic multi-year
leading-edge erosion and its performance/revenue consequence. This distinction is load-bearing: the most
recent reproducible public model predicts cumulative coating lifetime from rain and hail, not direct repair
cost caused by one hail event.

## 3. Failure-unit decision

`WT_BLADE_ASSEMBLY` is the first candidate because:

- the blade leading edge receives amplified relative impact velocity;
- public lab/simulation research concentrates on coating/laminate response;
- the NREL value ledger has one aggregate blade row; and
- coating repair, structural repair, and blade replacement must be dependency-safe.

Nacelle, tower fixtures, electrical, GSU, control/met, civil, and foundation subjects remain explicit and
withheld. Missing evidence is never converted to zero.

## 4. Hazard-axis alternatives

| Candidate | Disposition | Reason |
|---|---|---|
| Observed maximum hail diameter | Source input only | One reported largest stone omits distribution, count, wind, and blade motion |
| MRMS MESH | Source input only | Radar estimate/product support; not contact demand |
| Hail diameter + terminal fall velocity | Incomplete bridge candidate | Blade velocity and angle can dominate; distribution/count absent |
| Contact-normal impact energy | Leading local-demand candidate | Requires qualified trajectory/kinematics/material matching |
| Cumulative impact energy / ADF | Chronic-pathway candidate | Useful for coating life, not occurrence economic DR |
| Severe-hail category | Reject as damage axis | Warning threshold is not component capacity or consequence |

No runtime axis is frozen.

## 5. Evidence spine and transfer limits

### Repeated simulated hail ice

Macdonald et al. test 5–20 mm simulated hail at 50–95 m/s on GFRP coupon material. Smaller prevalent stones
show little notable mass/optical damage, while larger/higher-speed impacts show microscopic/material
damage. This constrains mechanism and potential thresholds but is not a field turbine disposition/cost
curve.

### Blade impingement simulation

Fiore, Fujiwara, and Selig simulate one 1.5-MW blade configuration and large hail, finding impact location
and delamination sensitivity at outboard sections. The exact blade/material/threshold transfer and absence
of economic outcome prohibit generic runtime use.

### Cumulative coating-lifetime models

Macdonald/Letson/Pryor/Barthelmie research and the open 2026 data/code show the importance of hail,
precipitation distributions, turbine speed, and episodic cumulative stress for leading-edge coating life.
That evidence is a strong research spine for a future degradation product. It cannot be collapsed to
single-event direct replacement DR.

### Condition states and costs

Sandia/IEA provide visual, mass-loss, aerodynamic, and structural-integrity classification concepts.
Repair papers show that material, labor, access, transport, crane, and downtime can differ sharply by
repair scope. Neither family supplies hail-conditioned state probabilities plus same-blade direct cost.
Downtime and AEP loss are excluded from the ordinate.

## 6. Legacy pressure test

The local “wind-turbine hail MDR” array is not adjacent empirical wind evidence. It is the deprecated
`Real Estate_Hail` array derived from Schmid's buildings/cars work, relabeled as wind, with a centimeters-
to-inches grid mismatch and a high-end plateau extension beyond the source grid. It is rejected from all
runtime and candidate-parameter use and retained only as a migration/review warning.

## 7. Value and exposure

The wind reference ledger reconciles 1,968 installed = 1,623 physical + 345 excluded USD/kW. Blades are
282 USD/kW, but this is not a coating value or hail cap. Actual turbine coordinates and per-unit values are
needed. Unknown substations/BOP cannot be treated as one extra turbine or as fully exposed lease value.

## 8. Curve-form decision

No continuous curve, fragility probability, state table, or step is adopted. A future occurrence model is
most likely a mutually exclusive state model:

```text
delivered impact history
  -> P(no_action, inspect_only, surface_repair, structural_repair, blade_replacement)
  -> same-blade direct cost ratios
  -> expected DR with uncertainty
```

Every state definition, probability, cost, applicability selector, and support allocation requires source
or governed elicitation provenance.

## 9. Capability

All damage and loss metrics are withheld. Annual and tail outputs additionally require downstream
frequency/distribution objects and cap-binding controls, which this cell does not own.

## 10. Promotion rule

Promotion to model v1.0 requires a reviewed occurrence-compatible bridge, representative blade-state
evidence, same-unit direct costs, site value/exposure, numerical KATs, independent review, repository-
current runtime schema, exact hashes, and Hazard migration. Running the workflow alone does not guarantee
promotion.
