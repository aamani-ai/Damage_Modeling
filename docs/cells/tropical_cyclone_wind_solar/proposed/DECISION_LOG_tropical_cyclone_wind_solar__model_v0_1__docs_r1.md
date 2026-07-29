# Decision log — tropical-cyclone wind × solar

**Cell:** `tropical_cyclone_wind_solar`

**Pathway:** `tropical_cyclone_wind`

**Model / docs:** model v0.1 / docs r1

**Decision date:** 2026-07-28

## Decisions

### D-TCWS-01 — create a separate tropical-cyclone wind pathway

**Status:** adopted

**Evidence:** `TCWS-S001`, `TCWS-S004`, `TCWS-S015`, `GOVERNANCE_CONTRACT`

Create the cell at `tropical_cyclone_wind_solar` with exact pathway ID `tropical_cyclone_wind`. Reuse the neighboring `strong_wind_solar` package only for reviewed solar anatomy, terminology, source discovery, value lineage, and governance controls. Do not inherit convective/downburst axes, curves, T4 parameters, or runtime behavior.

**Reason:** shared asset anatomy does not make tropical-cyclone and straight-line-convective wind fields numerically interchangeable.

**Revisit when:** a formal pathway-equivalence study passes the source-axis, demand, endpoint, and consequence gates.

### D-TCWS-02 — choose coverage-first scaffolding, not a shallow v1 curve

**Status:** adopted

**Evidence:** change classification, `BOUNDED_SEARCH_LOG`, `GOVERNANCE_CONTRACT`

Model v0.1/docs r1 is a noncanonical evidence and governance scaffold. It maps pathways, architectures, failure units, source candidates, value rows, gaps, and promotion gates while keeping `curve_records=[]`.

**Reason:** this expands the portfolio map without manufacturing numerical authority. Coverage is a truthful inventory of modeled, withheld, and excluded units—not a requirement to emit a number.

**Revisit when:** at least one failure-unit chain supports an explicitly classified model v1.0 behavior change.

### D-TCWS-03 — keep the runtime axis withheld

**Status:** adopted / withheld

**Evidence:** `TCWS-S001`, `TCWS-S002`, `TCWS-S005`, `TCWS-S010`, `TCWS-S011`

Preserve NHC one-minute, 10 m, unobstructed wind as an upstream source quantity. Do not silently convert it into Ceferino reconstructed 3-second gust, fixed-tilt net pressure, tracker-normal gust, or exact-system `Ucrit` ratio.

**Reason:** height, averaging, exposure, terrain, topography, direction, duration, architecture, and qualification basis are load-bearing.

**Revisit when:** a validated architecture-specific TC event-to-local-demand bridge is governed.

### D-TCWS-04 — split fixed tilt and tracker from the start

**Status:** adopted

**Evidence:** `TCWS-S005`–`TCWS-S007`, `TCWS-S010`–`TCWS-S012`

Require explicit routing between utility-scale ground-mounted fixed tilt and single-axis tracker. Use candidate units `PV_FIXED_TILT_MODULE_FIELD`, `PV_FIXED_TILT_SUPPORT_STRUCTURE`, `PV_TRACKER_MODULE_FIELD`, and `PV_TRACKER_SBOS_ASSEMBLY`; all remain withheld.

**Reason:** fixed-tilt pressure response and tracker aeroelastic/control response are distinct. Ceferino does not identify architecture for its 14 sites.

**Revisit when:** source populations identify architecture and support a qualified shared or separate curve.

### D-TCWS-05 — retain Ceferino as a probability candidate only

**Status:** deferred candidate; not runtime

**Evidence:** `TCWS-S002`

Retain the source-native probability of site extensive structural failure, the 14-site basis, and the posterior summaries (`v≈90 m/s`, `beta≈0.15`, with reported parameter uncertainty) in the numerical audit. Do not label a median-parameter plug-in as the paper's posterior mean. Do not call the probability physical economic DR.

**Reason:** the endpoint is clip/racking failure in more than 50 percent of panels at site grain. Fixed/tracker identity, mutually exclusive failure-unit states, salvage, and same-unit direct costs are absent; observed cascade includes debris.

**Revisit when:** the source records are enriched and an approved state/consequence bridge passes.

### D-TCWS-06 — use Perry and St. Croix as complementary constraints

**Status:** adopted with limits

**Evidence:** `TCWS-S003`, `TCWS-S004`

Use Perry for visible-damage prevalence, site heterogeneity, and field-data-program design. Use St. Croix for mechanism, dependency, inspection, and compound-pathway anatomy. Do not fit runtime curves from aggregate imagery percentages or one total-loss case.

**Reason:** Perry mixes asset classes and observes visible area, not cost; St. Croix combines wind, driven rain, and flash flood and is a single site. Their strength is coverage and pressure testing.

**Revisit when:** target-specific linked local-demand, disposition, and invoice data become available.

### D-TCWS-07 — standards and engineering studies anchor selectors and bridges

**Status:** adopted with limits

**Evidence:** `TCWS-S005`–`TCWS-S012`, `TCWS-S014`

Use ASCE, FM, IEC, fixed-tilt wind-tunnel, tracker aeroelastic, and joint-demand evidence to define exact editions, systems, configurations, geometry, state, row, direction, qualification, and inspection fields. FM's `0.75 Ucrit` is an action flag only.

**Reason:** design, qualification, load, and instability quantities are not observed population fragility or economic severity.

**Revisit when:** matched field outcomes and costs validate numerical response at the same grain.

### D-TCWS-08 — preserve value evidence without letting it create damage

**Status:** adopted with limits

**Evidence:** `TCWS-S013`, value crosswalk

Use the NLR Q1-2025 UPV reference under `value_source_id=NLR_Q1_2025_UPV_PV_ONLY_2024_USD` for row-level value reconciliation only. Require exact denominator, unit, vintage, architecture, and site-transfer labels. Replacement support has no intrinsic DR and may be allocated once only after qualified direct repair scope.

**Reason:** component cost shares neither calibrate hazard response nor cap intrinsic DR.

**Revisit when:** a new benchmark or site-specific bill of materials and reinstatement evidence is governed.

### D-TCWS-09 — make GSU/substation an explicit separate unit

**Status:** adopted / withheld

**Evidence:** `TCWS-S004`, `TCWS-S013`, `LEG-TCWS-001`, `LEG-TCWS-002`, `GOVERNANCE_CONTRACT`

Create and preserve `PV_GSU_SUBSTATION` as a shared point/yard solar-plant subasset. It is withheld, not zero. Do not reuse the legacy generic hurricane-substation logistic, whole-array exposure, solar-array structural DR, or a flood/ingress curve. Asset-neutral GSU identity and value governance should be developed as a common substrate, while each hazard pathway retains its own demand, mechanism, and curve qualification.

**Reason:** a GSU serves solar and wind through similar equipment anatomy, but its spatial subject and hazard response differ from the host generation field. Shared anatomy is not shared vulnerability.

**Revisit when:** the common asset-neutral GSU contract and TC-wind-specific response chain both pass review.

### D-TCWS-10 — keep other non-array units explicit and withheld

**Status:** adopted / withheld

**Evidence:** `TCWS-S004`, `TCWS-S009`, `TCWS-S013`, `GOVERNANCE_CONTRACT`

Keep `PV_FOUNDATION`, `PV_POWER_CONVERSION_AND_COLLECTION`, `PV_SCADA_COMMUNICATIONS`, and `PV_CIVIL_INFRA` explicit. Do not inherit module/support DR, array exposure, or another hazard's response. Preserve `PV_REPLACEMENT_SUPPORT` as allocation-only.

**Reason:** these units have different point, line, network, area, enclosure, geotechnical, and dependency mechanisms. Unknown is not immune.

**Revisit when:** each unit's demand, state/disposition, value, and exposure chain is qualified.

### D-TCWS-11 — reject the legacy research and consumer bundles for runtime

**Status:** rejected runtime; retained audit/regression

**Evidence:** `TCWS-S002`, `LEG-TCWS-001`, `LEG-TCWS-002`

Preserve the old logistics, hardcoded weights, and exact consumer outputs only in the two audit memos. Do not carry their values into curve records or defaults.

**Reason:** the memo misstates the Ceferino ground posterior, contains internal parameter drift, turns a probability into capped DR, creates unsupported architecture splits, and uses unpinned TIV shares plus a zero remainder.

**Revisit when:** never as-is; a new provenance-complete model must be built and separately promoted.

### D-TCWS-12 — separate compound pathways under one event family

**Status:** adopted

**Evidence:** `TCWS-S002`, `TCWS-S004`, `GOVERNANCE_CONTRACT`

Tropical-cyclone pressure/wind, windborne debris, wind-driven rain/ingress, flood or surge, corrosion progression, and TC-spawned tornadoes route separately while retaining one `event_family_id`. Downstream assembly must prevent the same value stock from being consumed twice.

**Reason:** field cases combine mechanisms, but the curve layer needs causal, exposure, and consequence clarity.

**Revisit when:** a governed multi-pathway joint consequence assembler replaces the current coordination rule.

### D-TCWS-13 — fail closed at both damage and loss seams

**Status:** adopted

**Evidence:** `BOUNDED_SEARCH_LOG`, `GOVERNANCE_CONTRACT`

After identity and input validation, all failure-unit scalar DR and monetary loss outputs return null with `NO_RUNTIME_CURVE`. No adjacent-cell or legacy fallback is permitted, and `canonical_runtime_artifact=false` remains explicit.

**Reason:** no reviewed public candidate completes the local-demand → physical state/disposition → same-unit direct cost chain.

**Revisit when:** the promotion matrix passes, known-answer tests include numerical curves, schemas validate, capability changes, and maintainers approve model v1.0.

## Promotion order

Coverage-first work continues in this order:

1. acquire architecture-labeled event and inspection records for the array units;
2. govern the TC storm-field-to-local-demand bridge separately for fixed tilt and tracker;
3. map mutually exclusive physical states, salvage, and repair versus replacement disposition;
4. link those states to same-unit direct costs and unit-specific exposure;
5. build the asset-neutral GSU identity/value substrate and a separate TC-wind GSU evidence chain;
6. formalize compound-event deduplication; and
7. only then classify, implement, test, and promote a numerical model v1.0.

This order preserves broad, honest asset coverage while directing deep curation toward the evidence seams that actually block runtime use.
