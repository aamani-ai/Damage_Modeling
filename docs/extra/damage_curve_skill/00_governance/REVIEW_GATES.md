# Review gates

## Gate A — scope

```text
[ ] hazard and asset are named;
[ ] in-scope and out-of-scope mechanisms listed;
[ ] related hazards that should split are named;
[ ] no downstream M4 metric is hidden in the M3 damage cell.
```

## Gate B — evidence

```text
[ ] source register has stable IDs, exact locators, roles, tiers, transfer limits, and decisions;
[ ] load-bearing claims have claim-level provenance;
[ ] chosen spine explained;
[ ] rejected/demoted sources explained;
[ ] parameter tier table populated;
[ ] T3/T4 update triggers listed;
[ ] legacy equations/tables/citations reproduced when legacy material is used;
[ ] proposed numbers pressure-tested at boundaries and on explicit denominators.
```

## Gate B2 — seven-step, site, and value integrity

```text
[ ] seven-step audit records pass/partial/withheld status and blocking seam for every step;
[ ] row-level value crosswalk reconciles direct, mixed, support, and excluded rows;
[ ] support/logistics are allocated once, not assigned an independent DR;
[ ] site-conditioned hazards have a site adapter;
[ ] fences/walls/barriers and bypass pathways receive no blanket credit;
[ ] adapter includes a double-counting matrix;
[ ] unknown at-risk/exposure/mitigation states do not silently become one/full credit.
```

## Gate C — runtime contract

```text
[ ] JSON artifact is canonical;
[ ] workbooks are derivation/audit views;
[ ] damage_code_id and model version are stable;
[ ] field names and aliases are explicit;
[ ] emit contract is distribution-ready.
```

## Gate D — reportability

```text
[ ] failure-unit DR support stated;
[ ] scenario loss support requires value basis;
[ ] scalar EAL requires downstream frequency + value basis + cap-binding pass;
[ ] PML/VaR/TVaR withheld unless spread exists;
[ ] no-curve scaffold emits no numeric DR/loss and uses NO_RUNTIME_CURVE.
```

## Gate E — release

```text
[ ] registry/index/changelog/manifest updated;
[ ] validation report produced;
[ ] package zip integrity checked.
```
