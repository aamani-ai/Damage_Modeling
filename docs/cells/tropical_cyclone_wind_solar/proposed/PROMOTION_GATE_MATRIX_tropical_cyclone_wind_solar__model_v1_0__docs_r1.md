# Promotion gate matrix — tropical_cyclone_wind_solar proposed model v1.0/docs r1

## Promotion decision

```yaml
repository_research_snapshot: PASS_INTERNAL_NONCANONICAL_SCREENING_PROPOSAL
noncanonical_scalar_screening_proxy: validated_conditionally_reviewable
canonical_runtime_promotion: BLOCKED
Hazard_consumer_cutover: BLOCKED
strict_evidence_earned_recommendation: RETAIN_MODEL_V0_1
```

This matrix distinguishes “the research proxy is reproducible” from “the curve is earned for production.”
The first proposition passes internal validation in this snapshot. The evidence-earned production and
consumer propositions remain blocked.

| Gate | Status | Evidence / decision | Closure required |
|---|---|---|---|
| v0.1 preserved | PASS | prior zero-curve scaffold remains intact | retain through any future promotion and rollback plan |
| change classified | PASS | null-to-numeric is a proposed model-behavior change | no action |
| strict-gate exception disclosed | PASS | README, classification, audit, dossier, pressure test, and capability label the NO-GO result | maintain in every consumer-facing view |
| source DOI/file identity | PASS | Perry dataset DOI and source-file SHA are pinned | re-check on source revision |
| source redistribution | PASS WITH LIMIT | raw files are not committed because archive metadata gives no license | preserve reproducible download/hash instructions or obtain permission |
| cohort filter | PASS | ground + `tracking=False` yields n=35 | independent replay from pinned source |
| fit subset/tail lineage | PASS WITH WARNING | n=34 fit; 48.2/0.4142383192 audit-only | preserve tail record and downward-bias disclosure |
| endpoint identity | PASS WITH LIMIT | remote-sensing-labeled visible/missing module fraction | never call observed repair cost or all-damage module DR |
| PAVA reproduction | PASS FOR RESEARCH SNAPSHOT | pinned source replay reproduces cohort, eight blocks, 13 rounded knots, tail, and event sensitivity | repeat on any source/model revision |
| monotonicity/bounds | PASS FOR RESEARCH SNAPSHOT | validator evaluates the retained domain and exact boundary/rejection fixtures | repeat on any curve change |
| interpolation/no extrapolation | PASS FOR RESEARCH SNAPSHOT | linear between knots; below/above-range and 48.2 m/s audit point withhold | preserve in any adapter and consumer test |
| source-axis semantics | BLOCKED FOR PROMOTION | provider/height/averaging/exposure/query unresolved for full cohort | authoritative source metadata or reviewed source-to-Hazard bridge |
| axis alias rejection | PASS FOR RESEARCH SNAPSHOT | NHC/category/ASCE/generic gust and wrong source-product inputs fail closed | repeat in any consumer adapter |
| population representativeness | BLOCKED | manual cohort is mixed/unknown scale | target utility-scale fixed-tilt validation or permanent source-cohort-only policy |
| architecture transfer | BLOCKED | no tracker/roof/carport transfer | architecture-specific evidence chain |
| T4 uniform-value bridge | BLOCKED | area/count-like fraction assumed to equal module material value fraction | observed module/BOM value distribution or independent acceptance |
| T4 full-replacement bridge | BLOCKED | all visible/missing modules assumed fully replaced | inspected disposition, salvage, repair, and cost evidence |
| Perry/Ceferino reconciliation | BLOCKED | four apparent coordinate-nearest matches differ materially; no authoritative shared site ID | identity-adjudicated matched-site review with common endpoint definitions |
| event clustering | BLOCKED FOR INFERENCE | six events; Florence supplies 20/34 rows | cluster-aware model and validation events |
| leave-one-event stability | FAIL FOR GENERALIZATION | omit-Maria high end ~5.41x lower; omit-Florence shifts high end | substantially broader independent event sample |
| sparse severe tail | BLOCKED | strongest severe observation excluded; 9.1 m/s gap | multiple architecture-matched severe observations |
| uncertainty/spread | BLOCKED | no curve-intrinsic distribution | reviewed hierarchical/event-aware uncertainty model |
| generic fixed-tilt unit | BLOCKED | source unit deliberately quarantined | qualified transfer and model change |
| rack/support coverage | BLOCKED | no response/disposition/value chain | failure-unit-specific evidence |
| foundation/electrical/GSU/SCADA/civil | BLOCKED | all remain withheld, not zero | separate physical/value/exposure chains |
| support/logistics allocation | BLOCKED | no repair scope or allocation rule | same-unit repair records and single allocation rule |
| value binding | BLOCKED | scalar proxy only; NLR benchmark anatomy-only | exact site module-material value plus ownership/exposure review |
| scenario dollar loss | BLOCKED | capability withholds before promotion | value binding, promotion, and end-to-end consumer validation |
| full-array/full-plant metrics | BLOCKED | partial source unit only | exhaustive coverage and value reconciliation |
| EAL/PML/VaR/TVaR | BLOCKED / CONSUMER-OWNED | no annual distribution; proposal noncanonical | promoted conditional damage plus consumer-owned hazard/frequency/tail objects |
| artifact/schema validation | PASS FOR RESEARCH SNAPSHOT | 1,172-check validator passes bundle v3, capability v3, emit v2, exact pin, source, register, and index checks | repeat after any artifact/schema change |
| capability parity | PASS FOR RESEARCH SNAPSHOT | embedded and standalone declarations are semantically equal; all 15 always-on flags are enforced through evaluator output | repeat after any capability change |
| KATs | PASS FOR RESEARCH SNAPSHOT | 8 formula, 9 rejection, and 4 withheld-unit fixtures pass | independent consumer replay still required before promotion |
| workbook QA | PASS FOR RESEARCH SNAPSHOT | 13 sheets, 83 formulas, 18/18 QA assertions, formula scan, and rendered-sheet visual review pass | separate print/PDF page design if a print-ready artifact is required |
| repository regressions | PASS FOR RESEARCH SNAPSHOT | model v0.1, TC-wind×wind v1, flood×wind v1, and five canonical runtime-contract validators pass | repeat after any shared contract or consumer change |
| consumer exact pin | BLOCKED | no canonical pin exists | model/docs/schema/full-SHA fixture |
| shadow/dual-read/rollback | BLOCKED | no Hazard adapter approved | consumer migration plan and tested rollback |
| independent review | BLOCKED | audit recommends retaining v0.1 | documented risk-owner and technical approval of exception or replacement evidence |
| explicit promotion action | BLOCKED | no index/current/package change authorized | deliberate release decision after all promotion gates pass |

## Always-on emit limitations

Every numeric research emit must carry, at minimum:

```yaml
metadata_flags_always:
  - NONCANONICAL_PROPOSAL
  - SCREENING_REMOTE_SENSING_LABELED_VISIBLE_FRACTION_WITH_T4_ECONOMIC_BRIDGE
  - SOURCE_COHORT_MIXED_SCALE
  - SOURCE_AXIS_PRODUCT_QUERY_SEMANTICS_UNRESOLVED
  - SOURCE_COMPOSITE_HURRICANE_MODULE_LOSS
  - VISIBLE_DAMAGE_ONLY_HIDDEN_DAMAGE_UNOBSERVED
  - PAVA_DERIVED_KNOTS
  - EQUAL_SITE_WEIGHT_NOT_MODULE_WEIGHTED
  - EVENT_CLUSTERED_SAMPLE
  - SPARSE_SEVERE_TAIL_WITHHELD
  - CROSS_METHOD_SAME_EVENT_ENDPOINT_CONFLICT
  - PARTIAL_FAILURE_UNIT_COVERAGE
  - CURVE_INTRINSIC_SPREAD_NOT_CARRIED
  - NO_EXTRAPOLATION
  - SCENARIO_DOLLAR_LOSS_WITHHELD
```

If the artifact/capability/evaluator does not preserve all load-bearing flags, validation fails.

## Promotion rule

No blocked gate can be converted to a caveat. Repository merge is allowed only as a transparent research
snapshot after validation; it does not change `canonical_runtime_artifact`, the artifact index, a package
release, or the Hazard pin. Canonical promotion requires a new, explicit decision and likely a model update
because closing the evidence seams can change the cohort, axis, curve, range, value meaning, or selectors.
