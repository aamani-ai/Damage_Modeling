# Governance release checklist

Before shipping a new damage-curve-library package:

```text
[ ] Change classification exists.
[ ] Version impacts are recorded.
[ ] Cell registry updated.
[ ] Artifact index updated.
[ ] Prior current artifacts archived if behavior changed.
[ ] New/updated JSON artifacts parse and validate structurally.
[ ] Dossiers/metadata specs point to the canonical JSON artifact.
[ ] Capability declarations are populated.
[ ] Withheld metrics remain withheld.
[ ] Cap-binding policy recorded.
[ ] Known-answer tests run or marked not applicable with reason.
[ ] Release notes include explicit non-changes.
[ ] Manifest lists created/modified/deprecated files.
[ ] Zip integrity checked.
```

Fail conditions:

```text
- model output can change but model version was not bumped;
- runtime artifact changed but registry was not updated;
- unsupported PML/VaR/TVaR is emitted;
- scalar EAL is reported despite missing/failing cap-binding preflight;
- new cell is labeled v1.0 without a reviewable runtime curve;
- deprecated artifact can still be silently used as canonical.
```
