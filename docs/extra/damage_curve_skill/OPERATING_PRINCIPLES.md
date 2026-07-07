# Operating principles

## 1. System coherence over local cleverness

A cell that looks elegant but breaks the library contract is not acceptable. The goal is a coherent library of hazard × asset damage records that downstream M3/M4 systems can consume safely.

## 2. Failure-unit grain first

The default record grain is:

```text
hazard × asset × failure-unit
```

Whole-asset damage curves are allowed only when the dossier explains why failure-unit decomposition would be false, unnecessary, or unsupported.

## 3. Reference is input, not authority

A source can provide a mechanism, boundary, curve form, lab anchor, field observation, claims anchor, or prior-model proxy. It does not automatically define the curve. The dossier must say how the source was used, what was rejected, and why.

## 4. Value basis must be explicit

The damage library can emit failure-unit DRs and scenario losses only when value basis is labeled. Do not mix:

```text
installed TIV
physical replaceable value
exposed failure-unit value
insured value
net claim after deductible
business interruption
```

without saying which one is in use.

## 5. Withhold, do not caveat

Unsupported metrics should be absent, not emitted with a footnote. A caveated bad tail metric still travels as a number.

## 6. Version numbers mean something

If same inputs produce same outputs, do not bump the cell model version. If same inputs can produce different outputs, bump the cell model version and document old-vs-new behavior.

## 7. Archive before replacing

The current cell folder is not a scratchpad. Before replacing a current artifact, preserve the prior current artifact in archive or create a proposed folder and promote after review.

## 8. Make assumptions reviewable

Every default, source demotion, proxy parameter, hazard-axis bridge, value mapping, cap, and open seam needs an update trigger.

## 9. Keep M3 inside M3

The damage-code layer is a component of M3. It should not embed M1 frequency, M4 annual aggregation, policy terms, or premium logic.

## 10. Build for future spread even when v1 is scalar

V1 cells may emit scalar means, but the schema must remain distribution-ready so that future tail-supporting models can be added without re-plumbing the pipeline.
