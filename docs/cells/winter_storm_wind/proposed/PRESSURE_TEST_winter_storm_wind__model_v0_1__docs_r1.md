---
author: owner-directed (JL) · agent-drafted
created: 2026-10-12
updated: 2026-10-12
status: proposed
---

# winter_storm_wind — pressure test (model v0.1 / docs r1)

## 1. Why a fail-closed result is the conservative answer

The guide's rule is: "Conservatism is not always a lower damage number." The legacy curves would charge
money where the evidence shows none:

| Case | Legacy loss on a 100 MW reference farm (CWER values, support allocated once) | Evidence |
|---|---|---|
| Snow-only event, 0 ice | ≈ 1.2% of physical value (≈ $1.9M) | no mechanism |
| 19 mm (0.75 in) ice, Texas-2021-like | ≈ 7.6% (≈ $12M) | NERC: outages, no damage reported |
| 38 mm (1.5 in) ice | ≈ 20% (≈ $32M) | no located case |

These figures come from the exploratory end-to-end harness of 2026-10-12. They are kept as audit arithmetic
only and are never runtime-shaped.

## 2. What a future curve must pass

- Zero at zero ice, monotone, and bounded by the same-unit value.
- Agreement with the February 2021 record (outages without reported damage at up to about 19 mm) and with
  Blue Canyon 2010, routed to the shedding pathway.
- No charge to the merged electrical row until it is split; overhead lines only where the topology is overhead.
- Falling-ice damage kept out of the accretion-load pathway.

## 3. Interim screening note

An interim scratch number (about 0.15% of turbine equipment at 19 mm, from Blue Canyon) was shown during
exploration. Under governance it belongs to the deferred **ice-shedding** pathway, at T4, and is **not**
adopted here.
