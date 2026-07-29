# Decision log — tropical_cyclone_wind_solar model v2.0/docs r1

## TCWS2-D001 — create the requested v2 as an explicit synthetic-T4 exception

**Decision:** add generic fixed/tracker numerical coverage, label every generic parameter synthetic Tier 4,
and keep the package noncanonical.

**Why:** the owner selected coverage now after being shown that public evidence does not calibrate these
responses. Refusing to distinguish the assumption from evidence would be worse than making the decision
explicit and testable.

## TCWS2-D002 — preserve Perry as a compatibility route

**Decision:** carry the v1 13-knot Perry record byte-for-value under
`perry_ground_nontracking_source_cohort_v1_compat`.

**Why:** it remains the strongest direct numerical evidence and supplies an exact regression target. It is
not renamed generic fixed tilt and remains restricted to its source axis, range, unit, and acknowledgements.

## TCWS2-D003 — adopt cell-local T4 values and compare them to a common audit profile

**Decision:** adopt the beta, medians, and state costs as cell-local TC-solar Tier-4 assumptions by owner
decision. Record their byte equality to the non-runtime solar-wind profile only as a post-adoption audit
fingerprint. Remove the former positive hard-zero threshold.

**Why:** inventing a separate hurricane shift without data would add false precision. Common synthetic values
make the assumption visible; TC wind-field, duration, direction, and cycling differences stay in the bridge
and metadata until calibrated.

The shared `candidate_curve` never populates the cell bundle and is not a runtime dependency. The complete
claim-supersession map retains C216's ban on empirical transfer while scoping its older output conclusion.

## TCWS2-D004 — type probability and consequence separately

**Decision:** compute generic DR as:

```text
DR_u(x) = sum_s P(exact state s | x, synthetic scenario) * c_u,s
```

Every `c_u,s` is listed separately as a T4 same-unit state-cost ratio. A state exceedance probability is
never itself called DR.

**Why:** this directly avoids the legacy category error that treated Ceferino's probability of extensive
site failure as fraction of value destroyed.

## TCWS2-D005 — no positive hard-zero threshold or anchored intercept subtraction

**Decision:** generic lognormal state curves are exactly zero at `x=0`; there is no asserted immune interval
above zero and no subtract-and-clip anchoring.

**Why:** a positive hard zero would be another unsupported threshold. Intercept subtraction changes the
meaning of fitted parameters and asymptotes.

## TCWS2-D006 — unsupported value is null, never zero

**Decision:** foundation, power conversion/collection, GSU, SCADA, civil, and replacement support receive no
numeric DR. Full-plant DR and scenario dollars remain withheld.

**Why:** missing evidence must not recreate the legacy 42-percent wind-immune remainder or artificial
approximately 48-percent plant cap.

## TCWS2-D007 — tracker state must be attained and qualification matched

**Decision:** tracker output requires exact system, 1P/2P, layout, attained angle/position, zone and spatial
object, drive/lock, 3-second reference, a qualification document ID and SHA, and matching
wind-field/direction/duration qualification bases. Commanded stow rejects.

`0.75 Ucrit` produces an operational-action flag only and neither forces damage nor earns protection credit.

## TCWS2-D008 — GSU remains a separate facility-level subject

**Decision:** `PV_GSU_SUBSTATION` remains withheld at its yard/point grain.

**Why:** it cannot inherit array exposure, module/mounting DR, flood response, a wind-farm curve, or the
legacy generic substation logistic. Shared anatomy does not close local TC demand → disposition → cost.
A direct GSU query bypasses the array architecture and array axis entirely.

## TCWS2-D009 — no consumer promotion

**Decision:** do not create `current/`, change the artifact index or changelog, ship a package, or authorize
Hazard cutover.

**Why:** a validated synthetic research curve is still synthetic and noncanonical.
