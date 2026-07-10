# 06 · Metrics & tail honesty — separate the vulnerability spread from the consumer tail  🟢 REFINED

The direct consumer of [`05`](05_emit_object.md), and the last foundational boundary. The reliability rule
still stands: **never fabricate a tail from a mean**. The consumer audit clarified what that sentence does and
does not prohibit.

*Source key:* consumes [`05`](05_emit_object.md), the first-nonlinearity rule, and the consumer boundary in
the damage-code contract. Principles = `basics_spot_on`, `system_coherence_over_local_elegance`, and
`reference_is_input_not_authority`. `[OURS]` derived; `[REF]` inherited.

---

## 1 · The distinction the original v1 decision missed

There are two different distributions:

```text
A. curve-intrinsic vulnerability distribution
   DR | fixed hazard intensity, asset selectors, and event state

B. consumer annual loss distribution
   event count + event intensity + coupling + exposure + DR + value + caps
```

A scalar curve does not contain distribution A. That is a real limitation.

But a consumer may have full distributions for event count, intensity, footprint, and coupling. Applying the
deterministic curve to each sampled event produces distribution B. PML/VaR/TVaR read from B are not fabricated
from a mean; they are conditional on deterministic vulnerability.

The old v1 wording collapsed A and B and therefore over-withheld downstream metrics.

---

## 2 · What “never fabricate a tail from a mean” means

Prohibited:

```text
one expected DR or one expected annual loss
  -> assume lognormal/beta/other shape without evidence
  -> report VaR/PML/TVaR
```

Allowed, when validated:

```text
sample event counts
  + sample event intensity/state/footprint
  + apply coupling
  + evaluate deterministic DR for each event
  + apply explicit value/exposure and caps at the correct grain
  -> annual AEP/OEP vectors
  -> EAL/PML/VaR/TVaR
```

The allowed path must say:

```text
CURVE_INTRINSIC_SPREAD_NOT_CARRIED
TAIL_CONDITIONAL_ON_DETERMINISTIC_VULNERABILITY
```

It may not claim that same-intensity vulnerability uncertainty was sampled.

---

## 3 · Ownership

| Object or decision | Damage modeling owns | Consumer owns |
|---|---:|---:|
| Failure-unit DR function and selectors/conditioners | Yes | Pins and evaluates it. |
| Curve-intrinsic spread/state object | Declares whether carried | Samples it when supplied. |
| Value profile fields and denominator semantics | Yes | Chooses a named profile or supplies site values. |
| Event frequency/intensity/coupling | No | Yes. |
| Annual loss distribution | No | Yes. |
| EAL/PML/VaR/TVaR calculation | No | Yes. |
| Capability/prerequisite declaration | Yes | Enforces it. |
| Failure-unit/occurrence/annual/financial caps | Declares relevant physical caps | Applies all caps at their actual grain. |

The damage artifact declares what the consumer has and lacks. It does not issue annual metrics.

---

## 4 · Metric decision table

| Available information | EAL | PML / VaR / TVaR | Decision |
|---|---|---|---|
| Damage artifact only; no frequency object | Withhold | Withhold | Annual metrics are outside the artifact. |
| One mean annual loss; no annual distribution | Mean may be reportable if construction is explicit and linear | Withhold | A mean has no quantiles. |
| Sampled event count/intensity/coupling + deterministic curve | Consumer-computable | Consumer-computable from annual vectors | Label missing curve-intrinsic spread. |
| Same plus curve states/spread | Consumer-computable | Consumer-computable | State every sampled uncertainty source. |
| No runtime curve | Withhold | Withhold | `NO_RUNTIME_CURVE`. |

This is not permission to ship any tail the consumer happens to calculate. The annual distribution must still
be supported at the requested return period and must apply caps/terms correctly.

---

## 5 · Nonlinearity and cap placement

The first-nonlinearity rule remains load-bearing. A cap after averaging is not the same as a cap inside the
event or annual calculation.

```text
failure-unit cap -> each failure-unit event loss
occurrence cap   -> each occurrence loss
annual/TIV cap   -> each simulated annual aggregate
financial terms -> consumer layer at policy-defined grain
```

If a consumer uses a shortcut, it compares the shortcut mean with the fully capped calculation:

```text
relative_bias = (shortcut_mean - capped_simulation_mean) / capped_simulation_mean
```

If the difference is material for the use case, the shortcut is withheld and the full simulation is used.
There is no universal 2.5% tolerance; a consumer may declare that screening threshold explicitly.

---

## 6 · Known-answer checks

Two check families are now distinct:

```text
curve evaluator KAT
  known input + selector -> known failure-unit DR
  protects equations, parameter names, unit conversion, and selection

consumer distribution KAT
  known event/frequency/value fixture -> known annual mean/quantile/cap behavior
  protects coupling, aggregation, cap grain, and metric extraction
```

A curve KAT cannot validate a compound-Poisson engine. A consumer Monte Carlo cannot prove it parsed D50/k or
selected the right archetype. Both are required at the seam.

---

## 7 · Value-basis honesty

Every reported percentage states its denominator:

```text
% of physical replaceable base
% of installed capex
% of named insured TIV
```

The damage repo publishes denominator semantics and reference allocation profiles. The consumer chooses a
profile or supplies site values. A value share with no basis label is invalid.

For hail, for example, `max_DR=1.0` caps the module failure-unit response. A 35.543% installed-capex asset cap
exists only after selecting the reference profile that includes module hardware plus all general replacement
fieldwork. It is not an intrinsic logistic cap.

---

## 8 · Withhold-not-caveat, retained and narrowed

Withholding remains the correct response to structural absence:

```text
NO_RUNTIME_CURVE
MISSING_VALUE_BASIS
MISSING_EXPOSURE_OR_COUPLING
MISSING_HAZARD_FREQUENCY_OR_INTENSITY_DISTRIBUTION
CAPS_NOT_APPLIED_AT_CORRECT_GRAIN
RETURN_PERIOD_NOT_RESOLVED
```

Missing curve-intrinsic spread is ordinarily a **limitation**, not a blanket annual-tail veto, when the consumer
has a valid frequency-driven distribution. The number and its limitation flags must travel together in machine
metadata.

This preserves the original reliability concern: a number with no structural support is withheld, while a
supported consumer metric is not blocked merely because one uncertainty source remains deterministic.

---

## 9 · What ships at v1

```text
damage artifact:
  failure-unit deterministic DR where supported
  explicit value/exposure contract
  curve-intrinsic-spread status
  cap requirements
  evaluator known-answer tests

consumer, when prerequisites pass:
  EAL/PML/VaR/TVaR from one validated annual loss distribution
  dollars + explicitly named percentage denominator
  limitation flags identifying deterministic vulnerability or other omissions
```

Proposed scaffolds such as wildfire×solar still withhold all numerical outputs because they fail earlier at
`NO_RUNTIME_CURVE`. The refined rule does not turn a scaffold into a model.

---

## 10 · Open / revisit triggers

- A current cell adds curve-intrinsic states, bounds, or a parametric distribution.
- A consumer uses an analytic shortcut instead of event-level capped simulation.
- A requested return period exceeds the event catalog or simulation's resolved tail.
- Financial terms introduce new nonlinearities or aggregation grains.
- A value profile's support-cost allocation becomes claims/site calibrated.
- A limitation flag is dropped between damage emit and final metric output.

---

## 11 · Status

🟢 **Refined after downstream audit.** A scalar vulnerability curve has no curve-intrinsic spread, but it may
be one deterministic transform inside a valid consumer-built annual loss distribution. Annual metrics are
consumer-owned and may ship when frequency, intensity, coupling, value, caps, return-period support, and known
answers pass. They must state that vulnerability spread is absent. A tail inferred from one mean remains
prohibited.

*Links:* [`05 emit object`](05_emit_object.md) · [`04 curation`](04_curation_derivation.md) ·
[`03 valuation`](03_valuation_guide.md) · [`00 deliverable`](../00_assembled_curve_record.md) ·
[`capability standard`](../../../contracts/standards/21_capability_and_cap_binding_standard.md)
