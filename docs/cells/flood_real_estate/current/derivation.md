---
author: "Jung A Lim (source curation); owner-directed (Divy) · agent-reviewed admission"
created: 2026-10-25
updated: 2026-10-25
status: active
scope: Warehouse-only Flood screening admission of unchanged Hazus DF341 from Junga's v0.2 return.
---

# Warehouse Flood — first accepted Real Estate response

Divy accepted warehouse Flood first on October 25: Hazus DF341 for freshwater and coastal still water,
0.25 ft first-floor height, and $11M building-only replacement cost. Waves, velocity, contents and BI
stay excluded. The source curator is Jung A Lim; the source proposal is retained unchanged at SHA
`99fe3f1f6430caada7943a4a83fe74a2f94895c8c454d7789fda97fabfafe9af`.
The [original return](../proposed/RETURN_PACKAGE_flood_real_estate__model_v0_2__docs_r1.md) carries her
sources, reasoning, claims comparison and limitations. This release selects only `RE_IND_WAREHOUSE` /
`FRE_IND_HAZUS_DF341`. House, office and retail have no runtime fallback in this release.

**Classification:** first reviewed `NEW_CELL_MODEL_RELEASE`, model v1.0/docs r1, bundle/capability v3
unchanged. No intrinsic curve ordinate, interpolation, spread or coastal multiplier was fitted. Release
scope, consumer value qualification and conditional annual capability are now explicit. The portable
library remains unreleased. The proposal stays available for the profiles awaiting their own admission.

| Seven-step audit | Qualification |
|---|---|
| Asset and boundary | One 100,000 ft², 400×250 ft, one-story steel/slab warehouse, no loading docks; same hypothetical reference in every CONUS cell |
| Failure unit | One source-native building structure assembly: foundation/floor, frame, roof, enclosure, fixed services and fixed interiors; no child-curve additions |
| Numerator and denominator | Direct physical repair/replacement / same-building structure RCN; source Hazus COM2 class average, not an exact-design fragility |
| Value rows | One assembly budget: 100,000 ft² × $110/ft² = $11M, Q3 2025 Dallas; land, contents, machinery, external site works, BI and financing excluded |
| Allocation | Full included building scope is the owner-accepted same-assembly approximation. RLB hard-cost benchmark to Hazus structure RCN is T4 scope transfer; no invented component fractions or claim of itemized source equivalence |
| Site adapter | Full building rectangle controls placement fit; local reference-point grade depth drives the assembly. Subtract 0.25 ft once; preserve grade wet/dry. Point demand does not establish uniform water across the building or site hydraulics |
| Response and annual boundary | Exact 29 Hazus knots, linear interpolation, −4…24 ft above floor; below range zero, above range unknown. Annual construction requires the separately tested Hazard frequency, support, cap and distribution gates |

**Evidence pressure test.** DF341 is FEMA's COM2 wholesale/warehouse default and an average over 22 source
classes. Junga verified the ordinates across three carriers and the default assignment in Hazus versions
5.1, 6.1 and 7.0. The inherited NFIP check reports 365 freshwater warehouse claims in shallow bands, where
the source curve is 2–8 percentage points low. The coastal warehouse comparison has only 14 claims at
1–3 ft, with mean damage about twice this curve. These are selected claims comparisons and thin coastal
evidence; no claim calibration or new curve correction is asserted. Hazus's default assignment and the
owner's bounded screening acceptance support this coastal still-water proxy, with salinity, waves and
velocity unquantified. All original evidence IDs resolve through the proposal's source/claim registers.

**Depth example.** Two feet above grade becomes 1.75 ft above first floor. The exact interpolation is
`0.05 + 0.75 × (0.08 − 0.05) = 0.0725`; same-scope loss is $797,500. At dry grade the result is zero.
The first-floor height is a declared reference assumption, not an observed property elevation.

**Annual qualification.** Damage supplies conditional DR, with no intrinsic random spread. Hazard may
reuse its existing inland annual-maximum and Coastal compound-Poisson clocks only after testing the
warehouse footprint and once-only floor bridge. A location remains fixed within a simulated year.
Original unavailable location/event mass remains represented; modeled contributions carry coverage tags
and full-risk metrics remain null. Coastal event sums are capped once at $11M. The curve's 73% endpoint
is not a physical annual loss cap or permission to extrapolate beyond the source range. Parent tails
come from weighted annual distributions. Combined EAL-sum / metric-wise tail-max is a screening composite,
not a joint Flood distribution, portfolio Total or a guaranteed lower bound on actual losses.

**Revisit:** coastal observations or salinity/wave response; first-floor height data; exact building damage
or replacement scope; warehouse subtype and contents; better flood hydraulics; material annual-domain or
support gaps. These remain scoped limitations rather than invented zero loss or undocumented modifiers.
