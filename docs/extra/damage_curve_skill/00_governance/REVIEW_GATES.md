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
[ ] source inventory complete enough for v-state;
[ ] chosen spine explained;
[ ] rejected/demoted sources explained;
[ ] parameter tier table populated;
[ ] T3/T4 update triggers listed.
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
[ ] PML/VaR/TVaR withheld unless spread exists.
```

## Gate E — release

```text
[ ] registry/index/changelog/manifest updated;
[ ] validation report produced;
[ ] package zip integrity checked.
```
