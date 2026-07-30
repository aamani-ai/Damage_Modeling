# Resiliency-modeling handoff

This is the Damage-side producer view of the cross-repository resiliency seam. The canonical ownership and
execution contract lives in
[`aamani-ai/Resiliency_Modeling-`](https://github.com/aamani-ai/Resiliency_Modeling-/blob/main/docs/contracts/cross_repository_execution_contract.md).
If this note conflicts with that contract, stop the scenario run and reconcile the documents before
publication.

## Boundary in one screen

```text
damage_modeling                         resiliency_modeling                    Hazard_modeling
─────────────────────────────           ─────────────────────────────          ─────────────────────
failure-unit response artifacts   <──   pins artifacts and capability   ──>   executes typed scenario
axes + units + valid domains            profile + applicability                over a pinned baseline
selectors + conditioner inputs          measure state/failure/dependence       and computes EAL/tail
value/assembly basis                     composition + direct cost
capability + KATs                        pairing/result authority
```

The interface can contain selectors, conditioners, and exposure fields without making this repository the
owner of a resiliency measure. Damage owns the physical response and the meaning and supported domain of
those inputs. Resiliency owns why a measure changes an input, the measure's operational state and failure
process, how multiple measures compose, scenario choices, direct cost, and any declaration of ancillary
financial effects. Hazard owns event/runtime execution and annual risk metrics.

## Damage supplies

- artifact ID, semantic model version, documentation revision, schema version, and content hash;
- failure-unit IDs, physical response, value/assembly basis, and emit grain;
- intensity axes, units, valid ranges, and out-of-domain behavior;
- supported fixed selectors and event-time conditioner inputs;
- caps, limitations, uncertainty/spread status, and output-specific capability; and
- known-answer tests or an equivalent validation record.

Damage does **not** supply measure applicability, stow/failure probability, dependence assumptions,
operator ordering, annual hazard frequency, scenario direct cost, ancillary financing effects, or EAL/tail
metrics.

## How a resiliency scenario uses Damage

1. The Resiliency integration binding pins a Damage artifact and the exact failure units it uses.
2. The scenario supplies fixed target facts separately from event-time measure state.
3. Hazard applies the declared operator order through its typed runtime seam and calls the pinned Damage
   response at supported inputs.
4. Unsupported inputs or outputs fail closed according to the Damage capability declaration.
5. The paired result records the Damage identity and hash; no consumer copies or silently re-derives its
   vulnerability formula.

If a measure requires a genuinely different vulnerability response, Resiliency commissions and pins it;
Damage derives, validates, versions, and publishes it. If a measure changes delivered intensity or state
before the response, the measure recipe remains Resiliency-owned even when a compiled representation can be
drawn as a curve.

## Mean-curve guard

A conditional mean curve may be an acceptable compiled view for an explicitly supported linear expectation.
It is not automatically equivalent for PML, VaR, TVaR, zero-loss probability, deductibles, limits, or other
nonlinear downstream operations. For those outputs, preserve state-aware occurrence logic unless the
equivalence gate is demonstrated and recorded for every requested metric.

## Change rule

An integration change that can alter damage ratio for identical Damage inputs requires the appropriate
Damage model/artifact version treatment. A change only to a Resiliency profile, state model, scenario,
operator composition, or cost does not silently bump or fork the Damage artifact; the paired run pins those
objects independently.
