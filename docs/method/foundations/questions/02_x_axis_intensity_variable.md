# 00x · The x-axis — what intensity variable a damage curve is a function of  🟢 NEAR-FINAL

The hidden prerequisite to representation ([`05`](05_emit_object.md)). Before we can argue "scalar
vs. 5 modes vs. distribution," we have to know what the curve is a function *of* — because a
distribution over damage at "a 60 mm hail event" is a clean object, while a distribution over "a
flood that's 2 m deep AND 3 m/s AND 18 h long" is a different and harder one. This doc frames the
x-axis decision with two rules: a **parsimony rule** on *how many* axes (univariate by default; a
second axis must earn its place), and a **chain-position rule** on *which* variable (put the axis at
the most-downstream node your hazard data can deliver).

*Source key:* principles = `hazard_asset_specificity` (the dual test + standard-interface),
`basics_spot_on`, `system_coherence_over_local_elegance`; depends on
[`01`](01_granularity.md) (grain) — which does most of the work on Q-x1. `[OURS]`
derived; `[REF]` inherited.

---

## 1 · The question is three nested questions

"What's on the x-axis?" is not one decision. It's three, and conflating them is the usual mess:

```
   Q-x1  HOW MANY axes?       univariate (one intensity scalar) vs multivariate (a surface)
   Q-x2  WHICH variable?      a TWO-part choice:
         Q-x2a  which QUANTITY?      hail: diameter? kinetic energy? momentum?
         Q-x2b  WHERE on the chain?  hazard-output? intermediate? at-the-component?
                                     (wildfire: fireline intensity? heat flux? component temp?)
   Q-x3  CONDITIONED on what? asset-STATE at event time that ISN'T hazard intensity
                              stow angle, prior damage, saturation — the awkward middle
```

This doc covers all three. **Q-x1** (the parsimony rule, §2–§5) gates representation and is where
doc-08 does the heavy lifting. **Q-x2** (the chain-position rule, §5b) is a genuine reasoned choice
with a data dependency, not a hand-wave. **Q-x3** (§6) is separated out cleanly — because a
conditioner is *not* an x-axis at all, and treating it as one is a known error.

---

## 2 · The default: univariate, on physical grounds

Most hazards present *several* physical quantities (a hailstorm has stone size, density, fall speed,
count; a flood has depth, velocity, duration). The instinct is to reach for a multivariate curve.
Parsimony-first says: **resist, and make the second axis earn its place** — the same discipline that
served us on failure units (don't build the primitive unless forced) and the dual test (don't split
unless footprint *and* metric differ).

Why the default is *univariate* and not just *simple*: a damage curve's dominant uncertainty is the
curve itself (`basics_spot_on`). Every extra axis multiplies the data needed to pin the surface and
multiplies the ways the curve can be wrong, while the *marginal* truth it adds is often small. An
axis that doesn't change the decision is precision the system can't use (`system_coherence`).

---

## 3 · The rule: a second axis must survive TWO escapes

A second variable `v2` earns its own axis **only if** the damage cannot be reduced to one axis by
*either* escape below. If either escape applies, stay univariate.

```
   ESCAPE 1 — COMPOSITE (collapse):
     physics gives a combiner that fuses the inputs into ONE intensity scalar.
     -> the curve is univariate on the COMPOSITE.  Not multivariate.
     classic: hail. diameter + density + fall-speed  -->  KINETIC ENERGY = 1/2 m v^2.
              one axis (KE or MESH-equivalent). the physics hands you the combiner; use it.

   ESCAPE 2 — SPLIT (different parts):
     the two variables damage DIFFERENT parts by DIFFERENT mechanisms.
     -> NOT one multivariate curve; TWO univariate curves on different axes, SUMMED (doc-08).
     classic: flood. DEPTH shorts the electricals; VELOCITY scours the foundation.
              => DR_elec(depth) + DR_found(velocity), each univariate. doc-08 already split them.

   A joint AXIS is needed ONLY if BOTH escapes fail:
     the SAME failure unit responds to TWO variables JOINTLY and NON-SEPARABLY
     (can't collapse to a composite, can't split across parts).
```

This is the **exact shape** of the joint≠sum bar from doc 08, one level over: a joint *axis* is the
analogue of a joint *grouping* — needed only when the thing genuinely doesn't separate.

```
   the parsimony cascade:

   apparent multivariate hazard
        |
        +-- ESCAPE 1: does physics give a combiner?  --yes-->  univariate on composite. DONE.
        |        no
        +-- ESCAPE 2: do the variables hit different parts? --yes--> split into univariate curves
        |                                                              (doc-08 summation). DONE.
        |        no
        +-- GENUINELY multivariate: same unit, non-separable joint response.
                 -> a real 2-D damage surface. RARE. must be shown, not assumed.
```

---

## 4 · The crux insight — multivariate at the asset level often dissolves at the unit level `[OURS]`

This is the part most worth your scrutiny, because it's where doc 08 quietly does the heavy lifting.

The reason flood *looks* irreducibly multivariate is that, at the **asset** level, damage depends on
both depth and velocity. But doc 08 already told us not to model at the asset level — we model at the
**failure-unit / subsystem** level and sum. And at *that* level, the two variables come apart:

```
   ASSET level (apparent):    DR_asset = f(depth, velocity)   <- looks 2-D, irreducible

   UNIT level (doc-08):       DR_elec(depth)      univariate on depth
                              DR_found(velocity)  univariate on velocity
                              DR_asset = Σ          <- two 1-D curves, summed

   the multi-axis-ness was an ARTIFACT of aggregating parts that respond to DIFFERENT variables.
   resolve to the right grain (doc-08) and the joint axis EVAPORATES.
```

> **Claim `[OURS]`.** Genuine irreducible multivariate damage curves are **rare**, because most
> apparent multi-axis behavior comes from *different parts responding to different variables* — which
> doc-08's grain resolution already separates into independent univariate curves. The joint axis only
> survives when a **single** failure unit needs two non-separable variables at once.

This is a strong simplifier: the x-axis question is *mostly already answered* by getting the grain
right. True 2-D surfaces are the exception we handle case by case, not the rule we design for. §5
applies the duration test and leaves **one unresolved candidate** (wildfire residence time). The
wildfire×solar scaffold therefore withholds a runtime curve rather than treating a one-dimensional
shortcut as established.

---

## 5 · The one surviving candidate is duration — resolved where supported, withheld for wildfire

Both escapes dispose of the obvious multivariate cases. The *only* candidate left for a genuine
second axis is **duration**. Supported v1 cells can resolve it; wildfire×solar cannot yet. The key is
to not conflate two things both called "duration":

```
   "duration" splits into the damage-PROCESS it feeds:

   (2a) PEAK / threshold     -> damage is set by the PEAK; once exceeded, duration irrelevant.
   (2b) CUMULATIVE / fatigue -> damage ACCUMULATES with time at intensity (cross-EVENT, slow).
   (2c) PROGRESSIVE / burn-through -> sustained exposure reaches DEEPER than a flash (per-event).

   only 2b and 2c make duration a real second PHYSICAL axis. 2a folds duration away.
```

Sorting the in-scope pairs by process:

| Hazard | Process | Why | Duration verdict |
|---|---|---|---|
| **Hail** | 2a peak | impact is instantaneous; "storm length" = stone *count* = **frequency**, not duration | univariate (KE); no axis |
| **Flood** | 2a threshold | shorting is set by *reaching* the equipment (depth); longer submersion → corrosion is 2nd-order / maintenance | univariate (depth) + univariate (velocity), per §4 |
| **Wind** | 2a per event; 2b cross-event | a single extreme *event* does **peak-load** damage (gust exceeds threshold *now*); **fatigue** is slow accumulation over *years* of normal operation — not an event, belongs to the lifetime/disruption track (AWN-31) | univariate (gust); fatigue → out of event-damage scope |
| **Wildfire** | **2c burn-through** | flame **residence time** plausibly changes thermal dose beyond what a flame-length class alone captures; it is a per-event exposure variable, not a disruption-track duration | unresolved multivariate candidate; no runtime curve (§5a) |

The decisive move for **wind**: our pipeline models discrete *events* (compound-Poisson). Fatigue
isn't an event — it's the erosion of capacity *between* events — so it leaves the per-event damage
curve by the same logic that puts feathering and derating on the disruption track. That's a real
physical distinction, not a dodge. So wind is **peak-driven, univariate on gust**, for event-based
damage.

### 5a · Wildfire residence time — a material candidate, not yet parameterized `[OURS]`

Wildfire burn-through (2c) is in scope, and duration may be first-order. That does not by itself prove
that a two-dimensional surface is required, nor does it justify collapsing duration into a
one-dimensional fireline-intensity curve. The proposed wildfire×solar cell remains noncanonical and
emits no runtime curve while the local-exposure bridge is missing:

- FSim landscape products provide burn probability and **conditional flame-length probability bins**,
  not a continuous fireline-intensity time series at the equipment;
- flame length is still upstream of the delivered radiant/convective exposure, ember assault, and
  exposure duration that act on solar components;
- distance, intervening fuels, wind, terrain, equipment geometry, and barriers such as walls or fences
  can change that bridge and cannot be hidden inside an uncalibrated universal curve.

> **The documented wall `[OURS]`.** FSim's source-native flame-length bins may feed an exposure
> selector, but they are not themselves component demand. Promotion requires a defensible mapping to
> delivered local exposure (including time/dose where material), followed by a component-response and
> economic-loss mapping. Whether the promoted representation is one-dimensional, two-dimensional, or
> state-based is an evidence decision, not a v1 presumption.

So the v1 interface may remain one-dimensional for supported cells, but wildfire×solar is an explicit
withheld exception until its exposure representation is earned.

---

## 5b · Q-x2b — WHERE on the causal chain the axis sits (the chain-position rule) `[OURS]`

Choosing the x-axis isn't only "which quantity" (Q-x2a) — it's *where on the causal chain from
hazard to damage* you place it. Every hazard has a chain, and any node on it is a valid "intensity."
Wildfire makes this vivid, but it **generalizes to every pair**:

```
   the causal chain (wildfire shown; every hazard has one):

   FSim conditional     -->  realized local fire    -->  delivered heat/ember  -->  component   --> DAMAGE
   flame-length bins         conditions                  exposure + duration        response        (DR)

   hail:   stone kinetic energy  -->  impact force at panel  -->  glass stress  -->  DAMAGE
   flood:  water depth           -->  hydrostatic load/ingress -->  equipment short --> DAMAGE
   wind:   3-s gust              -->  aerodynamic load on member --> stress      -->  DAMAGE

   the x-axis can sit at ANY node. they trade off the SAME way every time:
```

```
   UPSTREAM (hazard output)        <---------------->     DOWNSTREAM (at the component)

   + matches the HAZARD data you have      |   + closer to the actual DAMAGE physics
     (FSim supplies conditional            |     (delivered exposure and component
      flame-length probabilities)          |      response drive damage)
   + one curve travels across equipment    |   + more mechanistically honest
   - hides the coupling (geometry,         |   - REQUIRES a coupling model to reach the node
     exposure, material) inside the curve  |     (intensity -> temp needs assumptions + data)
```

> **The chain-position rule `[OURS]`.** Put the x-axis at the **most-downstream node on the causal
> chain that your hazard layer can actually deliver as data.** Go as close to the damage as the data
> lets you; no closer. Everything between that node and the damage is absorbed into the *curve* (and
> its conditioners) — not the axis — **only after that intervening bridge is supported for the stated
> domain**. You pick the axis the data can *speak* without inventing the missing coupling.

This is the `hazard_asset_specificity` standard-interface idea applied to the x-axis: the axis sits
at the **seam where hazard data is emitted**, and the downstream physics lives *inside* the curve.

**Worked — wildfire `[OURS]`.** FSim supplies source-native conditional flame-length probability
classes, which are appropriate upstream hazard inputs. It does **not** hand us continuous fireline
intensity, equipment-level heat flux, ember dose, or residence time. The wildfire×solar scaffold
therefore records the FSim classes without declaring them the damage-curve x-axis. A local-exposure
model must first connect those classes and site conditions to the demand experienced by each failure
unit; until that bridge is supported, damage and loss outputs are withheld.

**The coherence consequence (ties to §6) `[OURS]`.** Whatever node you pick, the variables *upstream*
of it that you folded away must not silently become forgotten conditioners. For wildfire, distance
from flame, fuel continuity, wind/terrain, exposure geometry, barriers, and ember pathways must be
explicit selectors, conditioners, or exposure-model inputs. They may be absorbed into a curve only
after calibration for the stated domain. Moving the axis **upstream** increases what the curve would
hide; moving it **downstream** decreases hidden coupling but demands more exposure data. Same "where
does the complexity live" trade as everywhere else.

---

## 6 · Q-x3 — conditioning variables are NOT an x-axis `[OURS]`

The awkward middle from the very start of our whole damage discussion. Stow angle, prior damage,
panel age — these change how intensity maps to damage, but they are **not** hazard intensity and do
**not** belong on the x-axis. Putting them there conflates "how hard the hazard hit" with "what state
the asset was in."

```
   THREE different roles, kept separate:

   x-AXIS         : hazard INTENSITY (what the event did)          -> hail KE, flood depth, gust
   CONDITIONER    : asset STATE at event time (modulates the map)  -> stow angle, prior damage
   CURVE-SELECTOR : fixed asset ATTRIBUTE (picks the curve)        -> glass thickness, tracker type
```

A conditioner acts on the curve in one of three ways (the §07 question, parked there): shift x₀,
fork the curve, or scale DR. The point *here* is only: **it is not a second x-axis.** It's a
parameter *of* the curve, not an *input dimension* of it. And the nasty case — stow angle correlates
with the hazard (you stow *because* hail is forecast) — is a *conditioning* problem, not an
axis-dimensionality problem, so it stays out of this doc and lives in [component-depth (parked)](../../../extra/discussion/archive/07_component_attribute_depth.md).

> Keeping Q-x3 off the x-axis is what stops the dimensionality from exploding. If conditioners were
> axes, every curve would be 5-D. They're not axes; they're modifiers.

---

## 7 · Per-hazard map (resolved for v1)

Both rules applied to the in-scope damage hazards. Q-x1 (how many) and a first Q-x2b (where on the
chain, data-driven). These are v1 assignments for supported cells; wildfire×solar is deliberately
shown as an unresolved proposed scaffold rather than a runtime assignment.

| Hazard × asset | Q-x1: axes | Escape / reason | x-axis (v1) + chain node |
|---|---|---|---|
| **Hail × solar** | univariate | E1 composite KE; count→frequency | **kinetic energy / MESH** (hazard-output node) |
| **Tornado/strong wind × wind** | univariate | E1 gust as peak; fatigue→cross-event→disruption | **3-s gust** (hazard-output node) |
| **Flood × solar** | two univariate | E2 split: depth→electricals, velocity→foundation | **depth** & **velocity**, summed |
| **Wildfire × solar** | unresolved; no runtime curve | source-native FSim flame-length bins are upstream of delivered local exposure; duration/embers/site geometry remain unresolved (§5a) | **not selected**; FSim conditional flame-length probability bins retained as upstream inputs |
| **Hurricane × {s,w}** | split | E2: wind→structure, surge/rain→flood pathway | **gust** + flood pathway (cross-linked, per catalog) |
| **Winter ice/snow × {s,w}** | univariate | E1 gravity load as composite | **areal load (kPa)** (hazard-output node) |

The recurring pattern remains useful: **E1 collapses most, E2 splits many others, and count often
belongs in frequency.** It is not a license to force every pair into one dimension. Wildfire×solar
is the named fail-closed case: its upstream hazard descriptor is known, but the dimensionality and
chain position of a defensible damage response are not.

---

## 8 · What this commits us to

- **Univariate by default (Q-x1).** A second axis must survive **both escapes** (composite-collapse,
  part-split) to earn its place.
- **Most apparent multivariate-ness dissolves at the doc-08 grain** — different parts respond to
  different variables → separate univariate curves, summed.
- **Duration is peak-captured or disruption-side** for many in-scope pairs. Wildfire burn-through is
  the unresolved exception; it receives no runtime curve until its materiality and exposure bridge
  are supported (§5a).
- **Chain-position rule (Q-x2b):** the x-axis sits at the **most-downstream node the hazard data can
  deliver**. FSim's flame-length bins are an upstream wildfire input, not a substitute for delivered
  local exposure or component response.
- **Conditioners (stow, age, prior damage) are NOT axes** — they're curve modifiers (§6), parked to
  [component-depth (parked)](../../../extra/discussion/archive/07_component_attribute_depth.md). Whatever the axis folds away upstream must be tracked as a
  conditioner, not lost.
- **Payoff for [`05`](05_emit_object.md):** supported curves may retain a clean one-dimensional emit
  interface. A pair that cannot earn its axis, such as wildfire×solar, withholds its runtime object;
  the interface does not manufacture a scalar merely to preserve uniformity.

---

## 9 · Open / revisit triggers

- **Wildfire exposure bridge and residence-time materiality.** Establish how source-native FSim
  flame-length classes, local fuels, wind/terrain, separation, barriers, and ember pathways map to
  delivered component exposure, and then test whether duration is first-order. FSim alone does not
  answer that component-demand question.
- **Composite metric validity (Q-x2a).** When E1 collapses to a composite (hail KE, areal load, or a
  future calibrated fire metric), is the combiner *real physics* (KE = ½mv²) or a convenient average that
  hides a metric choice? E1 is only a clean escape if the combiner is principled.
- **Chain-position vs the conditioner ledger.** Each upstream-axis choice (§5b) pushes variables into
  the curve as implicit conditioners. Confirm per cell that none are silently dropped (the §6 tie-in).
- **The hurricane cross-link.** Hurricane splits into wind + flood-pathway (E2); confirm the x-axis
  split matches the catalog's surge↔coastal-flood primary/secondary structure rather than inventing a
  parallel one.

---

## 10 · Status

🟢 **Near-final as a decision standard.** Two rules are established: **Q-x1 parsimony** (univariate by
default, with dimensionality earned from evidence) and **Q-x2b chain-position** (axis at the most-
downstream node the hazard data can actually deliver). Supported v1 curves can use the resulting
univariate interface. Wildfire×solar is a deliberate blocker, not a counterexample to hide: FSim
provides upstream conditional flame-length bins, while the local exposure bridge and response
dimensionality remain unresolved, so the proposed cell emits no runtime curve.

*Links:* [`05` emit object](05_emit_object.md) (the consumer) · [`01` grain](01_granularity.md)
(does the heavy lifting via E2) · [component-depth (parked)](../../../extra/discussion/archive/07_component_attribute_depth.md) (conditioners) ·
[scope-edges (parked)](../../../extra/discussion/archive/06_financial_terms_and_scope_edges.md) (duration/disruption boundary) ·
`hazard_asset_specificity` (dual test + standard interface) · `Hazard_Data_Reference` (two-track scope).
