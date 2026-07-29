# Strong-wind × solar axis independent-review packet

Status: **ready for independent review; not itself an approval**  
Candidate: `strong_wind_solar` model v2.0/docs r1  
Pathway: `straight_line_convective`

## Review decision requested

Return one disposition for each axis:

```text
ACCEPT_WITH_CURRENT_CONTRACT
ACCEPT_WITH_REQUIRED_REVISIONS
RESEARCH_ONLY
REJECT_AND_REDESIGN
```

The reviewer should cite the exact proposal field or equation, explain the physical issue, identify any
required evidence and state whether the issue blocks numerical evaluation or only promotion.

## A. Fixed-tilt route

### Proposed preferred axis

```text
x_fixed = peak transient event net-pressure demand
          / comparable same-zone qualified design net-pressure demand
```

The bridge must own geometry, row/zone, wind direction, shielding, height/reference and non-synoptic
transient treatment.

### Proposed screening proxy

```text
x_fixed_proxy = (array_height_3s_gust / qualified_design_array_height_3s_gust)^2
```

Both `convective_profile_bridge_id` and `aerodynamic_demand_bridge_id` are required. The proxy emits a
limitation flag and may not accept an unbridged 10 m gust.

### Reviewer questions

| ID | Question | Blocking if unresolved? |
|---|---|---:|
| FX-01 | Are numerator and denominator genuinely comparable in sign convention, tributary area, row/zone, direction, load combination and averaging treatment? | Yes |
| FX-02 | Does the event bridge preserve downburst rise time, vertical profile, direction change and spatial nonuniformity adequately for the claimed screening use? | Yes |
| FX-03 | Is a single peak net-pressure ratio sufficient for both module-field and support-structure state records, or are different demand measures required? | Yes |
| FX-04 | Is the squared-speed proxy defensible only as a limited quasi-steady proxy with named coefficients, or should it be removed entirely? | Yes |
| FX-05 | Are the current flag/withhold ranges physically and numerically acceptable for research use? | Promotion only |
| FX-06 | Which fixed-tilt architecture fields must be selectors rather than bridge metadata? | Yes |

### Minimum acceptance statement

The reviewer must state exactly which fixed-tilt architectures and event/design bridge families are covered.
An acceptance of the equation without a covered-domain statement is incomplete.

## B. Qualified single-axis-tracker route

### Proposed axis

```text
eta_tracker = local array-height tracker-normal 3-second gust
              / exact-system critical-instability 3-second gust
```

Current required match: 3-second averaging, array-height tracker-normal reference, convective-profile bridge,
1P/2P configuration, layout, attained angle and position, row/zone and drive/lock state.

### Reviewer questions

| ID | Question | Blocking if unresolved? |
|---|---|---:|
| TX-01 | Is `Vnormal/Ucrit` an acceptable screening demand index for the specific instability family represented by the candidate curves? | Yes |
| TX-02 | Must buffeting, galloping, flutter and other self-excited regimes be separately identified rather than normalized by one `Ucrit` field? | Yes |
| TX-03 | Is converting a qualification result to an array-height tracker-normal 3-second gust valid, and what averaging/reference transformation is permitted? | Yes |
| TX-04 | Which critical-speed identification criterion was used, and can different criteria yield materially different `Ucrit` values? | Yes |
| TX-05 | Must the qualification carry an uncertainty interval or conservative design value rather than a point value? | Yes |
| TX-06 | Are structural stiffness, damping and inertia required exact-match fields or provenance-only descriptors? | Yes |
| TX-07 | How must turbulence intensity/spectrum and convective-profile mismatch be treated? | Yes |
| TX-08 | How must row interference and windward/leeward position be matched beyond the current coarse zone enum? | Yes |
| TX-09 | Does the attained angle/position/drive-lock matching prevent false stow credit? | Yes |
| TX-10 | Is `eta >= 0.75` correctly limited to an operational action flag and excluded from damage onset? | Yes |

### Candidate provenance additions

Classify each as `required_exact_match`, `required_provenance`, `optional_research` or `reject_field`:

| Field | Initial recommendation |
|---|---|
| `ucrit_instability_family_id` | `required_exact_match` |
| `ucrit_identification_criterion_id` | `required_exact_match` |
| `ucrit_value_uncertainty_or_interval` | `required_provenance`; reject if the supplied point cannot be interpreted safely |
| `qualification_structural_stiffness_basis` | `required_provenance`, exact match if the qualified value depends on it |
| `qualification_structural_damping_basis` | `required_provenance`, exact match if the qualified value depends on it |
| `qualification_inertia_basis` | `required_provenance`, exact match if the qualified value depends on it |
| `qualification_turbulence_basis` | `required_exact_match` or a named conservative bridge |
| `qualification_row_interference_basis` | `required_exact_match` or a named conservative bridge |

These are review recommendations, not current runtime fields. Unknown values must not receive a favorable
default.

## C. Evidence packet

Review at minimum:

1. current proposal dossier and metadata specification;
2. current artifact architecture input contracts and rejection behavior;
3. existing retained sources `PV_TRACKER_DOWNBURST_2025`, `CPP_TRACKER_INSTABILITY_2015`,
   `TRACKER_LAYOUT_AEROELASTIC_2025`, `PV_TRACKER_AEROELASTIC_2024`, `FIXED_TILT_WIND_DESIGN_2020`,
   `FM_DS_7_106_2026`, `ASCE_7_22`, `ASCE_49_21`, `NIST_THUNDERSTORM_PROFILES_2011` and
   `FULL_SCALE_DOWNBURST_2018`;
4. the [2026-07-28 evidence refresh](evidence_refresh_2026_07_28.md), especially critical-speed criterion,
   uncertainty, row interference, damping/stiffness/inertia and stationary-versus-convective transfer limits.

## D. Required review record

```yaml
reviewer_name:
reviewer_role_and_organization:
review_date:
independence_statement:
fixed_axis_disposition:
tracker_axis_disposition:
blocking_findings: []
required_contract_revisions: []
required_evidence: []
covered_architectures_and_conditions: []
excluded_architectures_and_conditions: []
signed_or_approved_reference:
```

## E. Fail-closed rule

No response, informal verbal agreement or review without a covered-domain statement closes the gate. Until a
complete review record exists, the promotion matrix remains `Axis/bridge: Blocked` and the v2 numerical
payload remains research-only.
