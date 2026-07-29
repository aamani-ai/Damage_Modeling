# Numerical candidate audit — flood_wind model v0.1 / docs r1

## Pinned neighboring-cell source

Source: flood_solar@model_v1_0__docs_r4  
Artifact SHA-256: a08e77ef034e1ecea3e7cd05d13c825921b54d610fca9de8651ebda8e857082d

The flood-solar artifact is canonical in its own cell. Its numeric curves are T3 engineering proxies and are
not automatically asset-neutral runtime records.

## Exact candidate values

Common depth grid, metres above the record's component datum:

    0, 0.02, 0.05, 0.15, 0.30, 0.60, 1.00, 1.50, 2.00

| Candidate | Ordinates | Reproduction result | Flood-wind decision |
|---|---|---|---|
| FS_SWG | 0, .10, .40, .85, 1, 1, 1, 1, 1 | exact pin retained | strongest candidate; audit only |
| FS_XFMR | 0, .03, .10, .25, .45, .65, .80, .95, 1 | exact pin retained | reject direct transfer |
| FS_SCADA | 0, .15, .45, .90, 1, 1, 1, 1, 1 | exact pin retained | partial semantic match |
| FS_CABLE | 0, .02, .05, .10, .15, .25, .40, .55, .65 | exact pin retained | mechanism-only neighbor |

## Compatibility findings

FS_SWG has the best equipment and local-depth alignment. It still lacks proof that the target switchgear
population, construction, enclosure, condition states, and cost endpoint match.

FS_XFMR is not dependency-safe: the record uses a control/terminal vulnerable datum while its value language
can encompass the main transformer. The main transformer and auxiliaries/controls must be separated or
modeled as a sourced mutually exclusive state assembly.

FS_SCADA rolls plant monitoring together differently from substation protection, relay, control, and
communications equipment. FS_CABLE aggregates solar AC/DC cable concepts and cannot be transferred to wind
MV bodies, joints, terminations, pull boxes, and conduits without construction and value mapping.

## Legacy reproduction

The legacy anchored logistic calculations are reproduced in the legacy ingestion record and workbook. They
are numerically characterized but fail the evidence, grain, axis, and value tests.

## Runtime isolation

No candidate formula or ordinate appears in curve_records. The workbook labels every candidate audit-only,
and the known-answer tests require null damage outputs even when a complete fixture is supplied.

