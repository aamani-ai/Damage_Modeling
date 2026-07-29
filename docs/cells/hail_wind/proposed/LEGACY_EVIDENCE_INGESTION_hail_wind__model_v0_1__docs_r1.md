# Legacy evidence ingestion — hail_wind model v0.1/docs r1

## Materials reviewed

1. Hazard Modeling hail × wind-farm plan and discussion.
2. Learning-vault hail × wind qualitative/numerical summaries.
3. Deprecated `hazard_analysis` damage-curve tables and current metadata/data CSVs.
4. Old `infrasure-damage-curves` repository inventory.

## Hazard planning disposition

The Hazard notes correctly separate the hail peril from wind-speed peril, reuse M0/M1, recommend per-
turbine point-cloud coupling, keep BOP geometry separate, and call M3 experimental until vulnerability is
source-locked. Those are adopted as consumer/exposure boundary controls. They do not contain a governed
damage curve.

Pinned local consumer context at review:

```text
Hazard_modeling commit: 06fd3b57726a9ca042cd9d7c5f7a9df970585ff0
hail-wind discussion blob: 3c293ae548e678b417ab48a4d99cc24be3931205
hail-wind plan blob: eea920b64efd3d64893a1809e3ed3e99d623ec3b
```

## Rejected alleged wind-turbine hail curve

The Learning material presents an MDR table as wind-turbine evidence and attributes it to Schmid. Source
tracing shows four independent defects:

1. **Wrong asset/endpoint.** Schmid's study concerns buildings and cars, not wind turbines.
2. **Wrong source identity.** The array comes from deprecated `Real Estate_Hail`, not a `Wind_Hail` record.
3. **Unit/grid defect.** The deprecated source notes a 0–4 cm grid converted to approximately 0–1.57 in,
   while the Learning table labels 0.5–4.0 values as inches.
4. **Invented extension.** The approximately 5.78% plateau is extended through 4 in beyond the converted
   source grid.

The current legacy metadata has no Wind/Hail row. Therefore the array is classified:

```yaml
decision: REJECT_RUNTIME_RETAIN_AUDIT
parameter_reuse: prohibited
curve_shape_reuse: prohibited
validation_use: negative_regression_only
```

## Qualitative Learning material

Leading-edge erosion, composite delamination, and tip-speed amplification are retained only as search terms
and mechanism hypotheses where they resolve to public sources. Unproven 1–10% or approximately 6% numeric
ranges are rejected.

## Old curve repository

No governed `hail_wind` artifact or source-locked curve was located in the old damage-curve repository at
commit `12653b2c3d5a013c9524228243ea666c35bb3814`.

## Runtime rule

No legacy numeric array appears in `curve_records`, the KATs contain no numeric DR/loss expectation, and no
consumer is authorized to fall back to the real-estate or solar hail curve.
