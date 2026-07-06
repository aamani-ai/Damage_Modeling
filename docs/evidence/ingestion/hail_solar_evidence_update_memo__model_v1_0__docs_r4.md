# Evidence update memo · hail × solar · model v1.0 · docs r4

## 1. Update type

```text
cell_id: HAIL_SOLAR
semantic_damage_model_version: v1.0
new_documentation_revision: docs r4
update_type: evidence co-curation / validation and caveat ingestion
runtime_DR_change: no
```

This memo records the standard-16 ingestion of the legacy hail × solar evidence triage. The ingestion is
**documentation-only**: the current PVEL/Kiwa-anchored sigmoid remains the active v1.0 damage model.

---

## 2. Current model preserved

```text
primary failure-unit:
    PV_ARRAY / PV_MODULE / glass-cell replacement trigger

primary x-axis:
    MESH-equivalent maximum hail diameter, mm

curve form:
    bounded logistic module replacement DR

semantic behavior:
    unchanged in this update
```

---

## 3. Adopted as validation / caveat evidence

| Evidence | Current model role | Disposition | Runtime effect |
|---|---|---|---:|
| VU Amsterdam 2024, 249-claim NL damage curve | Independent field validation of lab sigmoid shape | Adopt into evidence map / dossier confidence note | None |
| Ha et al. 2020, glass-thickness / power-loss evidence | Supports fragile vs hardened glass variant direction | Adopt into archetype discussion and assumption register | None |
| NREL six-year field monitoring | Supports latent cracking vs glass-breakage seam | Promote into discussion of replacement trigger and latent damage caveat | None |
| VDE / Maugeri stow evidence | Supports direction of stow benefit | Adopt as support for stow direction; `+8 mm` magnitude remains placeholder | None |

---

## 4. Caveat added

Field evidence may imply higher real-world loss than the lab-only breakage curve. The triage specifically
notes a field > lab signal: Midway-like field losses can appear higher than the PVEL/Kiwa 50 mm laboratory
anchor.

Interpretation:

```text
This is not ignored.
It is documented as a caveat and update trigger.
It is not yet a parameter refit.
```

---

## 5. Still open

```text
f_hail material-share value concentration remains unresolved.
```

Neither the current library nor the legacy triage supplies a robust module-component cost breakdown that would
close this seam.

---

## 6. Version call

```text
same inputs before update → same DR after update
cell damage-model version: unchanged at hail_solar model v1.0
documentation revision: docs r4
```

---

## 7. Source pointers

```text
source triage:
    99_source_context/evidence_harvest/triage/01_hail_solar_triage.md

raw research file desired for future deeper refit:
    research/hail_solar.md
```
