# Pressure test — hail_wind model v0.1/docs r1

## Tests performed

### 1. Endpoint chain

```text
hail size/MESH                                  available
size distribution, count, wind and time        partial / site-product dependent
blade-relative contact demand                  candidate physics only
inspected mutually exclusive blade state       not representative/qualified
same-blade direct cost ratio                    not matched
site exposure/value/support allocation         not complete
```

Outcome: withhold.

### 2. Solar-curve substitution

The solar curve's glass/cell breakage endpoint, dense areal exposure, module value, and tracker/stow logic
do not match a rotating composite blade. Equal hail diameter does not produce equal component demand or
response. Substitution is rejected.

### 3. Chronic-to-occurrence substitution

The open coating-lifetime/ADF model is reproducible and relevant, but it integrates rain/hail impacts over
years and predicts coating lifetime, not one-event repair-cost ratio. Converting it to occurrence DR would
invent temporal attribution, state mapping, and cost. Substitution is rejected.

### 4. Lab/simulation-to-economic substitution

Coupon SEM/mass loss and simulated particle/delamination ratios are not inspected field dispositions.
Multiplying either by generic repair cost would splice unmatched populations/endpoints. Substitution is
rejected.

### 5. Legacy curve reproduction

The alleged wind MDR array is traced to `Real Estate_Hail`, has a wrong wind-turbine citation/asset label,
misstates a converted 0–4 cm source grid as a 0.5–4 in table, and extends the high-end plateau. It fails
before any economic plausibility test.

### 6. Dollar denominator checks

Reference relationships:

```text
blade / physical = 282 / 1623 = 17.3752%
blade / installed = 282 / 1968 = 14.3293%
physical + excluded = 1623 + 345 = 1968 USD/kW
```

These calculations verify denominator anatomy only. They are not loss estimates, caps, or exposure.

### 7. Geometry checks

One hit turbine does not imply every turbine, collection segment, or the shared GSU is hit. A lease-polygon
shortcut can overstate touched value. Unknown BOP locations withhold rather than defaulting to the turbine
point or full farm.

### 8. Support double count

Fieldwork and transport total 294 USD/kW in the reference ledger. They are allocated once after repair/
replacement scope. Giving them an independent hail DR and also scaling them with blade loss is prohibited.

### 9. Boundary/zero checks

At zero or no verified local exposure, this scaffold still does not publish a numeric zero DR; it returns
withheld because no runtime response exists. Foundation/buried assets are geometry-screened for this
pathway, while accumulation/meltwater is routed separately.

## Outcome

Every plausible shortcut either changes the endpoint, temporal grain, failure unit, population, exposure,
or value denominator. The defensible model-v0.1 result is `curve_records: []` and `NO_RUNTIME_CURVE`.
