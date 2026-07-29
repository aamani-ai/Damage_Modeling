# Seven-step audit — flood_wind model v0.1 / docs r1

## 1. Define the asset

Land-based wind generation with repeated turbines, array/collection electrical assets, plant civil works, and
zero or one project-associated facility GSU/substation instance. A facility may instead interconnect through
utility-owned equipment; association is not ownership.

Status: pass for class-template anatomy; site inventory remains required.

## 2. Decompose what fails

Shared GSU concepts: switchgear; main transformer; transformer auxiliaries/controls; protection/SCADA/control;
station service/DC; cable terminations/pathways.

Wind-specific subjects: turbine-base electrical; pad/turbine step-up transformer; collection terminations.
Foundation and civil/access/drainage are separate/deferred mechanism splits. Elevated turbine equipment is a
geometry-screened reconciliation subject, not a universal zero.

Status: pass as a proposed taxonomy; final same-replacement-unit assemblies remain open.

## 3. Define the ordinate

Future ordinate: conditional expected direct repair-or-replacement cost divided by the pre-event direct
replacement value of the same failure unit. Outage, BI, curtailment, revenue, frequency, insurance, and
portfolio metrics are excluded.

Status: definition passed; no endpoint-calibrated numeric records.

## 4. Split source value rows

The NREL reference provides 72 2023 USD/kW for mixed electrical infrastructure, 120 foundation, 47 mixed
civil, 1,090 elevated turbine equipment, and 294 support. The 72 row is not split among collection, pad,
turbine-base, and facility GSU subjects.

Status: reconciliation passed; loss-enabling split blocked.

## 5. Allocate physical value

Every direct unit requires site/OEM/SOV value, component count, ownership, and insured inclusion. One shared
GSU is valued once. Support is allocated once after disposition. Unknown or utility-owned interconnection
equipment is excluded from baseline project physical loss while a labeled dependency or sensitivity may be
reported downstream.

Status: blocked for scenario loss.

## 6. Specify site-condition adapter

Use local depth h_i = max(0, WSE - z_i_crit) only when WSE and component datum share a verified vertical datum.
Carry duration, contamination/salinity, energized/isolation state, enclosure, water path, defense, and
at-risk fraction without favorable defaults.

Status: method passed; site observations absent.

## 7. Apply qualified curves or withhold

Flood-solar and legacy candidates fail at least one compatibility, endpoint, value, or evidence gate. No
runtime record is populated.

Status: withhold with NO_RUNTIME_CURVE.

## Audit result

The scaffold is complete enough to guide curation and reject unsafe fallback. It is not an output-bearing
model and cannot enter the artifact index.

