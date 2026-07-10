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
[ ] No-curve scaffold tests assert no numeric DR/loss and NO_RUNTIME_CURVE.
[ ] Source IDs and claim source IDs resolve; exact locators and transfer limits are present.
[ ] Seven-step audit and row-level value crosswalk are complete for the lifecycle state.
[ ] Site-conditioned cells include a double-counting matrix and no blanket control credit.
[ ] Proposed main-branch artifacts remain package_release=unreleased and not_included until promoted.
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
- proposed repository artifact is mislabeled as included in the current package;
- support/logistics or one site control is counted more than once;
- rejected/synthetic numeric arrays remain in a runtime-shaped no-curve artifact.
```
