---
author: owner-directed (JL) · agent-drafted
created: 2026-11-17
updated: 2026-11-17
status: proposed
---

# winter_storm_solar — seven-step audit (model v0.2 / docs r1)

The governing endpoint, asset boundary and value basis are those of the
[r1 audit](SEVEN_STEP_AUDIT_winter_storm_solar__model_v0_1__docs_r1.md); only the steps the v0.2 changes touch are
restated.

```text
DR_u(x, s) = E[ direct repair-or-replacement cost of failure unit u / pre-event replacement value of u
              | snow gravity demand x (SWE only), verified selector/conditioner state s, compliant rack branch ]
```

| Step | model v0.2 status |
|---|---|
| 1 Asset and boundary | unchanged; glaze moved to a separate upper-bound scenario (not part of x). **Complete.** |
| 2 Failure units | unchanged set; `WSS1_MODULE_FIELD_BREAKAGE` now has two curve records chosen by `array_architecture`. **Complete.** |
| 3 Y-axis and value basis | unchanged. **Complete.** |
| 4 Row-by-row value split | unchanged (877.80 physical = 656.98 direct + 189.59 support + 31.22 civil; 1120 installed); priced 45.7% direct, 58.9% with support. **Complete** (validator, 1e-9). |
| 5 Physical value allocation | exposed fraction defaults to 1.0 (flagged); plant-size-class selector with no governed values; NITE shares are a calibration target. **Complete for the active units; calibration open.** |
| 6 Site-condition logic | [adapter v0.2](SITE_CONDITION_ADAPTER_winter_storm_solar__model_v0_2__docs_r1.md): Risk Category I default, clearance-versus-depth flag, under-designed share captured, glaze separate. **Complete (no credit granted).** |
| 7 Apply or withhold | conditional screening curves for racks (compliant branch) and modules (tracker; fixed-tilt judgment anchor); others withheld; under-designed branch parked. **Conditional; promotion blocked.** |
