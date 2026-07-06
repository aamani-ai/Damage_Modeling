# Value Basis And Physical-Damage Valuation

This folder holds the shallow method surface for value-basis work: how subsystem/component dollar values are
assigned before a damage ratio is applied.

These files are method support, not raw source drops and not runtime artifacts.

## Files

| File | Role |
|---|---|
| [`supporting_evaluation_guide.md`](supporting_evaluation_guide.md) | Explains financial valuation vs physical-damage valuation, basis selection, allocation, and at-risk fraction. |
| [`solar_wind_value_breakdown.xlsx`](solar_wind_value_breakdown.xlsx) | Sourced solar/wind value-breakdown workbook mapping public cost benchmarks into subsystem/component buckets. |

## Relationship To The v2.5 Source Drop

The raw v2.5 ZIP also contains `99_source_context/solar_wind_value_breakdown.xlsx`. That original copy is
preserved in `docs/source_drops/raw_zips/`.

This folder is the reader-facing method location for the value-basis workbook and its guide.

Do not treat the workbook as the runtime artifact store. Runtime JSON/package publishing remains deferred
until the cloud bucket layout, version pinning, artifact publishing, Hazard loading path, and repo
responsibility for code vs data are decided.
