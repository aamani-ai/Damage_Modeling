# Seven-step audit — <cell_id>

## Governing y-axis and loss contract

Define the failure-unit numerator, denominator, conditioning state, exclusions, and once-only support allocation.

## Step 1 — define the asset and boundary

## Step 2 — decompose the asset into failure units

## Step 3 — choose the y-axis and value basis

## Step 4 — split the value basis row by row

## Step 5 — allocate physical value by failure unit and zone

## Step 6 — specify the site-condition exposure adapter

## Step 7 — apply qualified curves and reconcile loss, or withhold

## Audit outcome

| Step | Status | Evidence passed | Blocking seam | Required next evidence |
|---|---|---|---|---|
| 1. Define asset | | | | |
| 2. Decompose asset | | | | |
| 3. Choose basis | | | | |
| 4. Split basis | | | | |
| 5. Allocate value | | | | |
| 6. Site adapter | | | | |
| 7. Curves/loss | | | | |

If Step 7 is blocked, record `curve_records: []`, withhold every dependent metric, and use `NO_RUNTIME_CURVE` rather than publishing a caveated number.

For a multi-pathway cell, repeat Step 3, Step 6, and Step 7 decisions at pathway × failure-unit grain. Add this matrix:

| pathway_id | failure_unit_id | axis/bridge status | evidence/curve status | value status | final support | reason code |
|---|---|---|---|---|---|---|

If every pair is blocked, use `NO_RUNTIME_CURVE`. If only some pairs are blocked, keep supported records, omit unsupported records, and use `NO_RUNTIME_CURVE_FOR_PATHWAY_UNIT` for those pairs. Never borrow another pathway's curve.
