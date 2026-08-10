# Validation report — wildfire_wind model v1.0/docs r1

Validation command:

```bash
.venv/bin/python scripts/reference_helpers/validate_wildfire_wind_v1_proposal.py
```

Result on 2026-08-08:

```text
PASS wildfire_wind model v1.0/docs r1 proposal: 14 formula KATs, 6 negative KATs
```

The validator checks bundle-v3 and capability-v3 schemas, exact state tables, monotonicity and bounds,
embedded/external capability identity, noncanonical/package flags, exact selector acknowledgement, all
formula KATs, noninteger/range/product/assumption/pathway failures, withheld-unit behavior, semantic payload
corruption, register row minima, and workbook structure.

Passing validation means the proposal is internally consistent. It does not promote Tier-4 assumptions to
empirical evidence or authorize Hazard cutover.
