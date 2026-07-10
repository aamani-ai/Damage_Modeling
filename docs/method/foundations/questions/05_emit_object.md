# 05 · The emit object — what M3 puts on the wire  🟢 DECIDED (contract v2 clarification)

The headline of the damage layer. What object does the damage stage emit, per event, per failure
unit? Everything downstream hangs on it — which risk metrics are honest, what the library must
produce, how much sourcing is needed. The earlier framing treated this as a *fidelity ladder*
("how high do we climb: scalar → spread → states → distribution?"). **That framing is wrong, and
the reason it's wrong is the founding incident of this whole project.** This doc reframes the
decision around a single forcing rule — **the first nonlinearity** — and shows scalar-vs-spread is a
*derivation*, not a matter of appetite.

*Source key:* depends on [`01`](01_granularity.md) (emit is **per failure unit, then summed**),
[`02`](02_x_axis_intensity_variable.md) (input is **univariate**), and
[`04`](04_curation_derivation.md) (curation **constrains** the emit form — the curve's functional
form sets what *can* be emitted); principles = `basics_spot_on` (this *is* its incident),
`system_coherence_over_local_elegance`, `hazard_asset_specificity`. `[OURS]` derived; `[REF]`
inherited.

---

## 0 · Why this is the basics-spot-on decision, not a fidelity dial

The old model collapsed a stochastic event-loss process to an expected loss before asking it for a
quantile. By the Law of Total Variance that preserved the mean and **discarded a dominant variance
term**; VaR₉₉ came out **~12× understated** `[REF]`. EAL survived (linearity of expectation); the
shape-dependent metric broke.

The precise lesson is not that every deterministic damage curve must invent a conditional spread.
It is that **whichever random variable is present must remain stochastic until the last nonlinearity
that acts on it**. Hazard supplies a stochastic event/annual process. Evaluating a deterministic
`DR(x)` separately for every sampled event preserves that process and can produce an annual loss
distribution. A curve-intrinsic spread is a second, different source of uncertainty: variation in
damage conditional on the same intensity and selectors. If that spread is not supported, the
consumer must label the annual result as conditional on deterministic vulnerability; it need not
withhold the frequency-driven tail.

> **`basics_spot_on` Axiom 3 `[REF]`.** *Stochastic must stay stochastic past every nonlinearity.*
> The moment you replace a random variable with its expectation **upstream of a nonlinearity**, you
> have silently broken the tail, because `E[f(L)] ≠ f(E[L])`.

---

## 1 · The forcing rule: find the first nonlinearity

The decision is not "which rung." It is: **where is the first nonlinearity downstream of the emit,
and does a scalar mean survive it?**

```
   emit  -->  [ ... downstream operations ... ]  -->  metric

   if everything from emit to the metric is LINEAR (only sums, scalar multiplies):
        E[ Σ Lᵢ ] = Σ E[Lᵢ]      <- scalar mean is EXACT. scalar is CORRECT, not merely cheap.

   the instant a NONLINEARITY sits between emit and metric:
        E[ f(L) ] ≠ f( E[L] )    <- scalar mean is WRONG, and wrong SILENTLY (looks fine, is biased).
```

So the emit object is **dictated by the metric and the terms**, not chosen by taste. The job is to
enumerate the nonlinearities on the path and emit the simplest object that survives all of them.

### 1.1 · The nonlinearities on our actual path

There are exactly three classes between a damage curve and a reported metric, and we already know
where each lives:

```
   N-cap    SATURATION / the per-unit cap Lᵢ        <- doc-08: each failure unit caps at Lᵢ.
            min(cap, DR·v) is nonlinear.               ALREADY PRESENT, even with no financial terms.

   N-fin    DEDUCTIBLE / LIMIT / per-occurrence      <- doc-06 (parked): max(0, L−d), min(L, limit).
            financial terms. nonlinear.                NOT in v1 (gross/occurrence), but coming.

   N-quant  THE QUANTILE OPERATOR ITSELF             <- VaR/PML/TVaR are quantiles of the loss
            VaR, PML, TVaR.                              DISTRIBUTION. a mean carries no quantiles.
                                                         this nonlinearity is the METRIC, unavoidable.
```

The metric you price decides which of these are on your path:

| Metric | Nonlinearities on path | Scalar mean survives? |
|---|---|---|
| **EAL** | N-cap only (if it binds) | **Yes** for a deterministic curve evaluated per event; conditional-spread means require §2's check |
| **VaR / PML / TVaR** | N-quant (always) + N-cap | **No from the curve scalar alone; yes from the consumer's retained event/annual distribution** |
| **net-of-terms EAL or tail** | N-fin + N-cap (+N-quant for tail) | **Yes only when the random event-loss object is retained through the terms** |

---

## 2 · The subtlety the old ladder missed: the cap is *already* a nonlinearity `[OURS]`

Even in v1, with **no** financial terms, we are not in the clean linear world — because
[`01`](01_granularity.md) caps each failure unit at `Lᵢ` (saturation), and saturation
is nonlinear:

```
   loss for unit i  =  min( capᵢ , DRᵢ(x) · valueᵢ )

   summing SCALAR means:    Σ min( capᵢ , E[DRᵢ]·vᵢ )
   the TRUE expected loss:  E[ Σ min( capᵢ , DRᵢ·vᵢ ) ]

   these are EQUAL only when the cap doesn't bite inside the spread.
   if the DR distribution has mass near/above the cap, Jensen's inequality kicks in
   and the scalar OVERSTATES (the cap clips the high tail the mean didn't know about).
```

This Jensen issue exists only if `DR(x)` denotes the mean of a real conditional damage distribution.
For a declared deterministic vulnerability response, there is no hidden conditional mass for the cap
to clip; the cap is applied to each event's deterministic result. So the honest statement is:

> **A deterministic scalar curve can be applied event-by-event through caps and terms. A scalar that
> summarizes an unresolved conditional damage spread is safe for EAL only while the nonlinear cap is
> immaterial. `[OURS]`** A cap-binding preflight is therefore a conditional-spread diagnostic, not a
> blanket veto on deterministic curves or consumer-built annual tails.

This matters because it means "scalar for EAL" is not unconditionally safe — it carries a *checkable
condition*, and stating that condition is part of being basics-spot-on rather than plausibly-wrong.

---

## 3 · The decision

Three sub-decisions, cleanly separable.

### 3.1 · Q-a — the INTERFACE: make the seam distribution-ready (build once, up front)

```
   decision: the SEAM (the parquet schema, the M4 consumer contract) is DISTRIBUTION-CAPABLE.
             it can carry a scalar OR a spread OR a discretized distribution.
   why:      modularity (build the interface up front, fill implementations per cell). a
             distribution-ready interface with scalar current CONTENT is cheap insurance against
             re-plumbing M4 when the first tail metric or financial term arrives.
   cost:     ~nil. it's a schema decision, not a sourcing decision. you reserve the column;
             you don't have to fill it.
```

This is the `modularity_and_scaling` move exactly: the seam is the unit of growth, designed before
the content. We do **not** want to discover at the first VaR request that the schema can only hold a
mean.

### 3.2 · Q-b — the CONTENT: emit the simplest object that survives the path's nonlinearities

```
   current CONTENT rule (the forcing rule applied):

   IF the curve is declared DETERMINISTIC CONDITIONAL VULNERABILITY:
        -> emit scalar DR per sampled event.
        -> the consumer may carry those event losses through caps, terms, occurrence aggregation,
           annual simulation, and quantiles.
        -> label annual metrics "conditional on deterministic vulnerability" and disclose that
           curve-intrinsic spread is not represented.

   IF the curve claims or the use case requires a CONDITIONAL DAMAGE SPREAD at fixed intensity:
        -> carry a spread/states/distribution through every cap or financial nonlinearity that acts
           on it; a scalar conditional mean is structurally wrong there.

   IF the consumer has already collapsed its event/annual distribution to a mean:
        -> do not compute VaR/PML/TVaR from that scalar. Restore the event/annual distribution.
```

The forcing rule is applied **per source of randomness**. The annual hazard-frequency distribution
belongs to the consumer; the conditional vulnerability distribution belongs here. Neither layer may
collapse the random object it owns before a downstream nonlinearity.

### 3.3 · Q-c — UNIFORM vs PER-PERIL: uniform interface, per-source content `[OURS]`

The old framing posed this as either/or ("one emit object repo-wide" vs "per-peril"). It dissolves:

```
   the INTERFACE is UNIFORM      -> always the same distribution-capable object (Q-a). built once.
   the CONTENT follows the SOURCE -> scalar where the curve is a published MDR (the source only
                                     gives a mean); a STATE VECTOR where it's fragility-derived
                                     (the source natively carries P(state)); a spread where
                                     elicited. (Methodology §6's own logic.)

   => NOT "one object" vs "many objects". ONE interface, source-driven fill.
      a fragility-derived cell emits states into the same seam a published-MDR cell emits a scalar into.
```

This also respects `hazard_asset_specificity`: standardize the interface, specialize the content to
what each peril's evidence actually supports.

---

## 4 · The four rungs, re-read as "what survives which nonlinearity"

The ladder isn't a fidelity preference; it's a map of *which nonlinearities each object can pass
through intact.*

| Rung | Vulnerability object | Preserves curve-intrinsic uncertainty through N-cap/N-fin? | Carries curve-intrinsic quantiles? | When it's the right fill |
|---|---|---|---|---|
| **1** | deterministic scalar DR | no intrinsic spread to preserve | no | deterministic vulnerability; consumer may still form frequency-driven annual quantiles |
| **2** | mean + dispersion | yes, approximately | yes, approximately | conditional damage variability is supported; spread form must be declared |
| **3** | damage-state vector P(state) | yes | yes | **fragility-derived** sources; needs state→cost map |
| **4** | discretized distribution | yes | yes (best) | strongest conditional-damage representation; most sourcing |

The honest cost of climbing (why scalar is the current default where it is evidence-supported): moving off scalar
costs (i) **choosing the spread's form** per hazard (beta on [0,1]? lognormal? elicited min/mode/max?),
(ii) **re-parameterizing** the library curves that today emit only a mean, and (iii) **finding
validation data to calibrate the spread** — scarcer than data for the mean. We climb when evidence or
the use case requires conditional vulnerability uncertainty. The consumer's possession of an annual
hazard distribution is not, by itself, such a trigger.

---

## 5 · What the emit object physically is (per [`01`](01_granularity.md) + [`02`](02_x_axis_intensity_variable.md))

Pinning the shape so it's unambiguous:

```
   PER failure unit i, at a univariate intensity x (doc-00x):

   emit_i(x) = a distribution-capable object over the damage ratio DRᵢ ∈ [0, capᵢ]
               current content: a declared deterministic scalar DRᵢ(x)
                                OR a conditional spread/states when supported

   loss_i = ( emit_i applied to value_i )  [capped at capᵢ]
   asset loss = Σ_i loss_i                  (doc-08 summation; NO grouping object)

   KEY: keep each ACTUAL stochastic object alive to its last nonlinearity. The consumer retains
   stochastic events/years; this repo retains conditional vulnerability spread when one is claimed.
   A deterministic scalar curve is a declared response, not a counterfeit distribution.
```

The interface remains distribution-capable so a later cell revision can carry conditional spread
without replumbing M4. Capability metadata says which uncertainty sources are and are not represented.

---

## 6 · What this commits us to

- **The emit object is decided by supported uncertainty and the nonlinearities acting on it, not by
  fidelity appetite.** Enumerate each random source separately.
- **Interface is distribution-ready, built up front** (Q-a) — cheap insurance, a schema decision.
- **A deterministic scalar curve may feed a consumer annual distribution.** It does not, by itself,
  provide curve-intrinsic uncertainty.
- **Uniform interface, per-source content** (Q-c) — scalar for published-MDR sources, state-vector for
  fragility-derived, into the same seam.
- **A conditional mean's EAL-safety through a cap is conditional**; a declared deterministic response
  is evaluated and capped per event.
- **Never collapse the random variable upstream of a nonlinearity** (Axiom 3) — the whole point.

**Parked / downstream:** which metrics ship under scalar + the caveat language ([`06`](06_metrics_and_tail_honesty.md));
the spread *form* per hazard (the climb, when N forces it); financial terms N-fin
([financial-terms (parked)](../../../extra/discussion/archive/06_financial_terms_and_scope_edges.md)).

---

## 7 · Open / revisit triggers

- **Does any runtime cell claim a conditional damage distribution whose mass crosses a downstream
  cap?** If yes, a conditional mean is insufficient for EAL and the cell must carry that distribution.
  Proposed cells with no runtime curve, including wildfire×solar, withhold metrics upstream.
- **The spread form, when we climb.** Beta-on-[0,1] is the natural default for a bounded DR, but
  per-hazard validation data may favor lognormal or elicited three-point. Deferred until a nonlinearity
  forces the climb (don't choose a form we're not yet using).
- **Fragility-derived cells and the state→cost map.** Rung 3 needs a state→cost-ratio map (doc-00 §2's
  worked example). Confirm which cells are fragility-native and would emit states rather than a scalar.
- **Interface schema specifics.** The exact distribution-capable representation (parametric tag +
  params? discretized bins? both?) is an implementation choice for the seam — flagged, not fixed here.

---

## 8 · Status

🟢 **Decided; clarified for contract v2.** The seam is distribution-ready, while content remains
source-supported. A deterministic scalar vulnerability curve can be evaluated for each sampled event
and can therefore feed the consumer's frequency-driven annual distribution. It does not represent
curve-intrinsic uncertainty. Each layer retains the stochastic object it owns through the
nonlinearities that act on it; capability metadata makes the boundary explicit.

*Links:* [`01` grain](01_granularity.md) (emit is per-unit, summed) ·
[`00x x-axis`](02_x_axis_intensity_variable.md) (univariate input) ·
[`06` metrics](06_metrics_and_tail_honesty.md) (the consumer — which metrics are honest) ·
[financial-terms (parked)](../../../extra/discussion/archive/06_financial_terms_and_scope_edges.md) (N-fin) · `basics_spot_on` (this is its
incident; Axiom 3) · `system_coherence_over_local_elegance` · `hazard_asset_specificity`.
