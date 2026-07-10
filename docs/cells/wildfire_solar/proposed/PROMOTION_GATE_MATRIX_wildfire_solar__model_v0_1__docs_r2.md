# Promotion-gate matrix — wildfire_solar model v0.1 to first runtime model

> Historical field-calibration gate audit. Model v1.0 docs r3 was subsequently released as an explicitly
> Tier 4 screening engineering proxy under user-authorized approximation. The blocked empirical/site-loss
> gates below remain the upgrade path to a calibrated future model; they no longer mean that no screening
> runtime exists.

This is the work program for promotion. A `PASS` means the gate has evidence and an auditable acceptance
test; it does not mean the whole cell is ready.

## Current gate status

| Gate | Current state | What docs r2 adds | Acceptance test for release | Status |
|---|---|---|---|---|
| G0 scope and grain | Eleven candidate/decomposition/allocation records; physical destruction only | Field events reinforce multi-subsystem scope | Every runtime response has one failure-unit endpoint, selector set, exposure axis, value denominator and coverage role | `PARTIAL_PASS` |
| G1 source-native hazard | FSim BP and conditional FLP semantics governed | Regional-screening/site-loss split | No invented midpoint/FIL6 cap; frequency remains outside DR; imputation/product vintage retained | `PASS_FOR_SCREENING` |
| G2 site/local attack transfer | Variables specified, no converter | Field heat-flux evidence sharpens required fuels/geometry/contact/flux/time inputs | Validated model or measurements predict component-zone attack with uncertainty and out-of-domain rules | `BLOCKED` |
| G3 component endpoint | Candidate thermal/ignition mechanisms only | EL/IR field diagnostics and NEMA disposition protocol | Endpoint protocol yields reproducible inspect/repair/replace state by BOM and exposure | `PARTIAL` |
| G4 population response | No representative fragility | More test-specific studies; no representative population | Affected and unaffected counts support response estimates with uncertainty for each selector stratum | `BLOCKED` |
| G5 economic y-axis | Proposed same-unit direct replacement DR; r1 value crosswalk reconciles basis | Field-data schema makes work-order linkage explicit | Costed repair/replacement records use the same unit and separate support/logistics, salvage and protected value | `BLOCKED` |
| G6 coverage and assembly | Failure-unit inventory and allocate-support-once rule exist | Module-only pathway explicitly cannot stand for whole site | Material value is qualified, explicitly immune, separately withheld, or bounded under approved coverage policy; zonal sums reconcile | `BLOCKED` |
| G7 controls and adaptation | Site adapter has fields but no credits | FM guidance and standards-scope guardrails | Any credit is supported by matched/physics evidence with uncertainty; otherwise controls remain selectors only | `BLOCKED_FOR_CREDITS` |
| G8 uncertainty | No curve-intrinsic spread | Physics sources identify transfer variability | Parameter, transfer and response uncertainty are quantified with dependence and domain rules; no invented factor-of-two ranges | `BLOCKED` |
| G9 KATs and implementation | 13 withholding/contract KATs; zero runtime KATs | Candidate two-mode behavior | Equation and payload pinned; known-answer rows cover selectors, bounds, OOD, missing state and value basis | `BLOCKED` |
| G10 independent pressure test | r1 rejection audit complete | Hazard consumer proxy independently traced | Reviewer reproduces fit, endpoint mapping, value reconciliation and consumer integration without hidden constants | `BLOCKED_PENDING_MODEL` |
| G11 release and notification | Noncanonical r1 scaffold excluded from index | docs r2 handoff and explicit no-release state | New release class, version record, changelog, canonical artifact index, hashes, consumer pin and notification all pass | `BLOCKED_PENDING_MODEL` |

## Evidence packages that can close the blockers

### Package A — operator/forensic event cohort

Minimum viable cohort:

- at least two independently observed wildfire events or one event with materially distinct attack zones;
- geolocated pre-event inventory and BOM;
- local fire reconstruction or measurement with uncertainty;
- inspected affected and unaffected units under the same protocol;
- final disposition and cost/work-order records;
- documented selection and missingness.

This is not a fixed sample-size promise. Statistical adequacy depends on event diversity, selector strata,
endpoint prevalence, clustering and censoring, and must be assessed before fitting.

### Package B — controlled external-fire test program

Use representative full-size utility components, not a pooled generic PV specimen. Pre-register:

- BOM and ageing/pre-damage states;
- radiant, convective, contact and ember protocols separately;
- flux-time histories and geometry;
- functional, safety, inspection and replacement endpoints;
- unexposed controls, replication and censoring;
- transfer boundary to field conditions.

Controlled tests can close parts of G3/G4. They do not close G2 or G5 without field transfer and costs.

### Package C — insurer/operator claims linkage

Required fields include exogenous-wildfire peril code, asset-years, site footprint, component inventory,
affected quantities, repair/replacement scope, direct cost, support cost, deductible/limit separation and
event location/time. Aggregate `fire` claim shares alone do not qualify.

### Package D — structured expert elicitation, only if needed

Elicitation may inform priors or gap ranges only under the governance skill: named endpoint, evidence pack,
calibration questions, multiple independent experts, uncertainty elicitation, aggregation method, conflict
record, and update trigger. It cannot convert an anonymous engineering opinion into T1/T2 evidence.

## Candidate release sequence

```text
R0  docs r2 (current)
    evidence and consumer contract; zero curves

R1  research prototype
    local-attack interface + endpoint protocol + synthetic-only integration tests
    still model v0.1; still no reportable DR

R2  partial empirical candidate
    one or more failure-unit response objects with explicit coverage gaps
    model remains proposed until asset-loss/reportability policy is approved

R3  first runtime release
    model v1.0 only after G0-G11 release-relevant gates pass
```

No calendar date or softening of the curve can substitute for these gates.
