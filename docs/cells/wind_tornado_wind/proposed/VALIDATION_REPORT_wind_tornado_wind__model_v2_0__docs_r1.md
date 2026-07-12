# Validation report — wind_tornado_wind proposed model v2.0, docs r1

Validation date: 2026-07-11
Validation scope: repository proposal package, reference evaluator, workbook, draft schemas, and current-runtime
regression
Promotion status: **not promoted; model v1.0/docs r4 remains canonical**

## Scope

```yaml
package_release: unreleased
cell_ids:
  - wind_tornado_wind
change_class:
  skill_revision: damage_curve_skill 0.5 -> 0.6
  model_behavior_change: model v1.0 -> proposed model v2.0
  schema_contract_change:
    - damage_curve_record_bundle.v3
    - damage_emit.v2
    - capability_declaration.v3
pathways:
  - straight_line_convective
  - tornado_direct_hit
neighboring_workstream_not_delivered:
  - tropical_cyclone_wind
```

## Immutable proposal snapshot

| Object | SHA-256 |
|---|---|
| Proposed bundle-v3 artifact | `736ffa95a4ae4afd05e54d2a4256ab3712f921bcd334af89a8ac28b8cf859bcd` |
| Final review workbook | `b20b182e96e1c1078527e94168c0434e2be5442b04afc69b013e4340952abda8` |
| Current canonical v1 artifact, unchanged | `908f386953d062a62a33b6714020374b9b9d8a4538006e80d37047686c2c127a` |

The proposed SHA is a review snapshot, not a canonical consumer pin. Any artifact-byte edit invalidates it.

## Structural checks

| Check | Status | Result |
|---|---|---|
| JSON parsing | PASS | Bundle, capability, KAT fixture, skill registries/templates, and schemas parse |
| Required proposal files | PASS | Every artifact reference resolves from repository root |
| CSV rectangularity | PASS | Source, claim, parameter-tier, value, and old-vs-new registers have complete rows |
| Provenance resolution | PASS | Source IDs and special governance IDs resolve; no orphan load-bearing reference |
| Self-reference hygiene | PASS | No stale `01_cells/` or downstream `Hazard_modeling/` path occurs in the machine artifact |
| Current registry/index | PASS | Index remains on model v1.0/docs r4/bundle v2 and exact SHA `908f386...` |
| Proposal index isolation | PASS | No `proposed/` path or v2 pin leaked into the canonical artifact index/changelog |
| Whitespace/diff check | PASS | `git diff --check` returns clean |
| Workbook container | PASS | Exact 12-sheet name/order reconciliation and `unzip -t` pass |

## Draft JSON Schema execution

Formal Draft 2020-12 validation was run with `jsonschema 4.26.0` and `referencing 0.37.0` in an isolated
validation environment.

| Check | Status | Result |
|---|---|---|
| Schema meta-validation | PASS | Bundle v3, capability v3, and emit v2 schemas validate as Draft 2020-12 schemas |
| Bundle instance | PASS | Proposed artifact validates, including its capability-v3 reference |
| Capability instances | PASS | Standalone and embedded declarations validate and are byte-equivalent as JSON objects |
| Straight-line emit | PASS | Full five-unit emit validates; one numeric equipment unit and explicit withheld rows |
| Tornado emit | PASS | Full five-unit emit validates with exact tornado pathway identity |
| Renamed curve payload negative | PASS | Replacing `beta_ln` with `beta` fails schema validation |
| Missing pathway negatives | PASS | Missing bundle pathway ID and missing emit pathway ID both fail |
| Extra result-field negative | PASS | Unexpected failure-unit runtime field fails emit-v2 validation |

The repository validator retains dependency-free structural/semantic checks when those optional schema
packages are absent. With the formal layer enabled it reports 14,906 assertions; without it, 14,902.

## Runtime and known-answer checks

| Test | Status | Result |
|---|---|---|
| Reference evaluator compilation | PASS | Dependency-free pathway evaluator imports and executes |
| Runtime/withholding KATs | PASS | 13 tests across both pathways, all three scenarios, exact states, proxies, bounds, and withheld units |
| Contract rejection KATs | PASS | 13 fail-closed cases for routing, bridges, axes, EF-only input, and archetype |
| Cross-pathway assertion | PASS | Equal numeric speed does not collapse pathway, record, axis, or response identity |
| Consumer pin tests | PASS | Exact model/docs/schema/computed-SHA pin accepted; stale/incomplete pins rejected |
| Equation semantics | PASS | Exact probabilities are nonnegative/exhaustive; DR is bounded/monotone; resistance ordering holds |
| Value boundary | PASS | Evaluator emits no exposure, value, support, frequency, EAL, PML, VaR, or TVaR field |
| Old-vs-new reproduction | PASS | All 24 comparison rows independently reproduce v1, Hazard hardcodes, and proposed-v2 equations |
| Current runtime regression | PASS | Five current canonical artifacts and hail/wildfire runtime/KAT suites pass unchanged |

## Workbook checks

| Check | Status | Result |
|---|---|---|
| Formula inspection | PASS | 358 formula cells survive final export/re-import |
| Spreadsheet errors | PASS | Zero `#REF!`, `#DIV/0!`, `#VALUE!`, `#NAME?`, or `#N/A` values |
| Workbook QA | PASS | All 15 formula-driven `QA` checks return `PASS` |
| KAT cross-check | PASS | Straight-line central DR at `V = Ve50` is `0.1061718428482847`; tornado central DR at `67 m/s` is `0.654490901632399` |
| Value cross-check | PASS | `1090 + 239 + 294 = 1623`; `1623 + 345 = 1968`; denominator ratios reconcile |
| Visual review | PASS | Every one of the 12 sheets rendered and was inspected at original resolution; no load-bearing clipping or broken layout |
| Final round trip | PASS | Sheet order, formulas, cached values, KAT bridge flag, and error scan survive `.xlsx` re-import |

## Skill-bundle checks

| Check | Status | Result |
|---|---|---|
| OpenAI skill validator | PASS | `Skill is valid!` |
| Damage-curve bundle validator | PASS | 103 governed files |
| Governance self-tests | PASS | 8 classification/workflow cases |
| Skill manifest/hash check | PASS | Revision-0.6 bundle hashes and templates reconcile |

## Reportability checks

| Metric/output | Status | Reason |
|---|---|---|
| Equipment failure-unit DR | CONDITIONAL | Screening proxy only; exact pathway, supported archetype, qualified axis/proxy, and scenario labels required |
| Resistance-scenario DRs | CONDITIONAL | Unweighted epistemic engineering envelope; not percentiles or a probability distribution |
| Turbine/plant loss | WITHHELD BY INTRINSIC EVALUATOR | Hazard must supply explicit unit value and turbine exposure; support is allocated once outside the curve |
| Foundation/external electrical/civil DR | WITHHELD | No unit-specific calibration and no shared turbine-exposure rule |
| Scalar EAL | WITHHELD BEFORE PROMOTION | Proposal is noncanonical; after promotion the frequency-driven annual computation remains consumer-owned |
| PML/VaR/TVaR | WITHHELD BEFORE PROMOTION | Requires validated occurrence, intensity, exposure, values, caps, dependence, and convergence in Hazard |
| Hurricane/tropical-cyclone DR | NOT DELIVERED | Separate neighboring workstream required; neither proposed pathway may be reused silently |

## Remaining promotion blockers

The Damage Modeling proposal package itself passes its construction and validation suite. Promotion remains
blocked on external integration and an explicit decision:

1. Hazard must load one exact model/docs/schema/SHA pin and remove both hardcoded curve copies.
2. Hazard must correct the 10 m/hub/profile seam, turbine-versus-plant exposure grains, occurrence thinning,
   severity sampling, and convective/tornado/tropical-cyclone event overlap.
3. A dual-read shadow run must explain differences without calibrating v2 to legacy EAL/PML headlines.
4. Cutover and rollback must be rehearsed with v1 remaining the recorded rollback pin.
5. A maintainer must explicitly promote the artifact, registry/index, changelog, and consumer pin together.

## Final status

```text
PROPOSAL PACKAGE: PASS
SCIENTIFIC GRADE: SCREENING ENGINEERING PROXY
CANONICAL PROMOTION: BLOCKED
CURRENT RUNTIME: MODEL V1.0 / DOCS R4 UNCHANGED
```
