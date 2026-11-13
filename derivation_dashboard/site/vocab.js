/* Ported from the infrastructure playground (digital-infra-playground, curve-derivations.js) on 2026-11-12 and adapted to read this
   repository: the cases come from data/cases.js, which tools/build.py generates from docs/cells. */
/* How a damage curve was derived, case by case, for the Failure and Recovery page. One framework for every curve
   (docs/extra/discussions/damage_failure_recovery/04_curve_derivation_framework.md):
     - five layers, each a tag on the chart: bridge, boundary, data point, reference curve, rule;
     - a derivation type set by what pins the curve: fitted, engineered, state table (and transferred, observed);
     - the damage_modeling repository's seven stages as the breakdown: question, evidence, grain, axis, form,
       adjustments, emit.
   Curves, anchors, tiers and reasons are the damage_modeling cells' own (origin/main b0dc82b, 5 Nov 2026), read from
   each cell's runtime artifact and derivation dossier; parameters are kept verbatim and tests/curve-derivations.test.cjs
   holds them to the artifacts. Nothing here refits or edits a curve. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.CurveDerivations = api;
})(typeof window === 'object' ? window : this, function () {
  const REPO = 'https://github.com/aamani-ai/Damage_Modeling/tree/main/docs/cells/';
  // Everything drawn on a damage curve is one of these five. n and d are short; q, can, cannot and eg feed the explainer.
  const TAGS = {
    bridge: { n: 'Bridge', d: 'How the hazard at the site becomes the intensity at the part. Fixes the horizontal axis.',
      q: 'How does the hazard, as it is reported, become what actually reaches the part?', can: 'Set the horizontal axis: what is measured, in which unit, and where it starts and ends.', cannot: 'Say anything about how much damage follows.',
      eg: 'Radar hail size becomes the stone diameter at the module. The site water level minus the part’s height becomes the depth at the part.',
      // Said plainly, for the reader meeting the word for the first time (owner, 12 November 2026: "this makes more sense").
      // Both pages show it: the explainer on Failure and Recovery, and the five things on the Framework page.
      clear: {
        plain: ['Hazard data tells you about the place.', 'A damage curve needs to know about the part.', 'The bridge is the step that gets you from one to the other.'],
        // One flood, on the twin's own numbers: the transformer's lowest critical point is 0.30 m; FS_XFMR reads 0.45 at 0.30 m
        title: 'One real flood, from the place to the part',
        picture: { caps: ['About the place', 'About the part'], from: ['Flood map', '0.60 m at the site'], step: ['Bridge', 'minus its height, 0.30 m'], to: ['Transformer', '0.30 m of water'], then: ['Its damage curve', 'reads 0.45'] },
        // The same picture, operable: move the flood, and the depth at the part and the curve's reading follow
        try: { caseId: 'flood_solar_xfmr', label: 'Flood depth at the site', unit: 'm', dp: 2, min: 0, max: 1.5, step: 0.05, start: 0.6, height: 0.3 },
        test: 'Does this tell me how much hazard reaches the part, or how much the part is damaged by it? The first is the bridge. The second is the curve.',
        everyday: 'The weather report gives the temperature outside. Whether chocolate left in a car melts depends on the temperature inside the car. Getting from one to the other is the bridge; how chocolate melts is the curve. They are two separate pieces of knowledge, and both are needed.',
        cases: [['hail_solar', 'The radar’s hail size is taken as the stone size at the module.', 'Almost invisible: the number passes straight through.'],
          ['flood_solar_xfmr', 'The site water level minus the part’s height.', 'A clear step: one subtraction.'],
          ['wildfire_solar', 'None could be defended, so the fire data’s classes are used as they come.', 'Missing on purpose.']],
        alias: 'The damage framework’s own name for this is the chain-position rule: index a curve by what hits the part, not by what the hazard source reports.',
      } },
    boundary: { n: 'Boundary', d: 'A point fixed by a standard, a rating or physics. Pins the start, a floor or the ceiling.',
      q: 'Which points are fixed before any data, by a standard, a rating or physics?', can: 'Pin where the curve starts, a floor under it, or its ceiling.', cannot: 'Say what happens between the pinned points.',
      eg: 'A module certified to IEC 61215 survives a 25 mm ice ball, so the hail curve is held at about 1% there.',
      clear: {
        plain: ['Some points on a curve are known before any damage is measured.', 'A standard, a rating or plain physics fixes them.', 'A boundary pins the curve at such a point: where it starts, a floor under it, or its ceiling.'],
        title: 'One real standard, and the point it fixes',
        picture: { caps: ['What a standard says', 'What it fixes'], from: ['IEC 61215 hail test', 'a 25 mm ice ball'], step: ['Boundary', 'a qualified module passes'], to: ['A fixed point', 'about 1% at 25 mm'], then: ['The hail curve', 'has to start from there'] },
        test: 'Would this point still be true if nobody had ever measured the damage? If yes, it is a boundary. If it had to be observed, it is a data point.',
        everyday: 'A ladder carries a rated load. Nobody has to break it to know that a person under that load is safe: the rating fixes that end of the picture. What happens well above the rating, the label does not say.',
        cases: [['hail_solar', 'The IEC 61215 test: a qualified module at 25 mm is held at about 1%.', 'One point, from a test standard.'], ['flood_solar_xfmr', 'No damage until the water reaches the part, and total loss at 2 m, where the valid range ends.', 'Two ends, from physics and from the range.'], ['wildfire_solar', 'No fire, no damage.', 'One point, and the only fixed one.']],
        alias: 'In the damage framework’s words: standards are boundary conditions, anchors and not curves. A curve has an anchored start and a cap.',
      } },
    data: { n: 'Data point', d: 'A measured outcome at a known intensity. Pins the curve where it was measured.',
      q: 'Where was the outcome actually measured?', can: 'Pin the curve at the intensity that was tested or observed, for the kind of part that was tested.', cannot: 'Speak for other intensities, or for other kinds of part.',
      eg: 'PVEL’s 2023 lab test: 39% of 3.2 mm glass-on-backsheet modules broke at 50 mm.',
      clear: {
        plain: ['Somewhere, someone measured what actually happened.', 'A data point is that measurement: this much damage, at this intensity, for this kind of part.', 'It pins the curve there, and only there.'],
        title: 'One real lab test, and the point it pins',
        picture: { caps: ['What was measured', 'What it pins'], from: ['PVEL 2023 lab test', '50 mm ice balls'], step: ['Data point', '39% of modules broke'], to: ['The curve at 50 mm', 'pinned at 0.39'], then: ['At 50 mm, the curve', 'reads 0.39: measured'] },
        // Move the hail size: only at the tested size is the reading a measurement
        try: { caseId: 'hail_solar', label: 'Hail size', unit: 'mm', dp: 0, min: 10, max: 90, step: 1, start: 50 },
        test: 'Was the outcome observed, at a known intensity, on the kind of part this curve is for? If any of the three is missing, it is not a data point for this curve.',
        everyday: 'You weigh yourself on Monday. That tells you your weight on Monday. A line drawn through it to next month is your guess, however sensible; only another weighing would be a second point.',
        cases: [['hail_solar', 'PVEL’s 2023 lab test: 39% of 3.2 mm glass-on-backsheet modules broke at 50 mm.', 'One measured point on the default curve, five on the fragile one.'], ['flood_solar_xfmr', 'None. No flooded-transformer outcome with its depth has been found.', 'Missing: this is why the curve is engineered.'], ['wildfire_solar', 'None. No public loss by flame-length class for a solar plant.', 'Missing: this is why every value is chosen.']],
        alias: 'In the damage framework’s words this is direct evidence: tier T1 when loss was observed on the real asset in the field, T2 when it comes from a lab test, as here.',
      } },
    reference: { n: 'Reference curve', d: 'A published curve for a similar subject. Suggests a shape; never adopted as it is.',
      q: 'Has someone published a whole curve for something similar?', can: 'Suggest a shape, and serve as a comparison afterwards.', cannot: 'Be adopted as it is: its subject, its units and its cost basis differ from ours.',
      eg: 'The US Army Corps’ HEC-FIA depth tables lent the flood curve its form, a table of depths, and none of its values.',
      clear: {
        plain: ['Sometimes someone has already published a whole curve for something similar.', 'A reference curve is that: useful for its shape, and for comparing against afterwards.', 'It is never adopted as it stands, because its subject, its units and its cost basis are not ours.'],
        title: 'One published set of tables, and what was taken from it',
        picture: { caps: ['What was published', 'What we took from it'], from: ['USACE HEC-FIA', 'damage by depth, as tables'], step: ['Reference curve', 'lends its form'], to: ['Our flood curve', 'a table of nine depths'], then: ['Its nine values', 'chosen here, none borrowed'] },
        test: 'Is this a whole curve made for something else? Then it may lend a shape or serve as a check. It may not supply our numbers.',
        everyday: 'A recipe written for another oven tells you the steps and roughly what to expect. You would not trust its exact minutes in yours.',
        cases: [['hail_solar', 'None drawn. Field and claims studies are kept for checking the result, not fitted.', 'Kept out, on purpose.'], ['flood_solar_xfmr', 'The US Army Corps’ HEC-FIA depth tables lent the form: damage as a table of depths.', 'The form only, none of its values.'], ['wildfire_solar', 'None. An earlier continuous curve was rejected and is kept in the cell’s history.', 'Rejected.']],
        alias: 'In the damage framework’s words: a reference is an input, not an authority. A found curve is taken apart, never copied as a black box.',
      } },
    rule: { n: 'Rule', d: 'A reasoned constraint without a measurement: an ordering, a cap, a steepness.',
      q: 'What do we know by reasoning, without a number?', can: 'Order curves against each other, cap a value, or set how steeply it rises.', cannot: 'Supply a value. Whatever a rule shapes is still chosen, not measured.',
      eg: 'A transformer is damaged more gradually than switchgear. No wildfire value goes above 0.90.',
      clear: {
        plain: ['Some things are known by reasoning, without a number.', 'A rule states one: this curve sits below that one, no value goes above a cap, it rises gently.', 'It shapes the curve, but the values it shapes are still chosen, not measured.'],
        title: 'One real rule, and what it does to two curves',
        picture: { caps: ['What we reason', 'What it does to the curves'], from: ['NEMA GD 1 guidance', 'replace, or evaluate first'], step: ['Rule', 'flatter than switchgear'], to: ['Switchgear, at 0.15 m', 'reads 0.85'], then: ['Transformer, same water', 'reads 0.25: lower, by the rule'] },
        // Move the water at the part: the transformer never reads above the switchgear, and the two meet at the ends
        try: { caseId: 'flood_solar_xfmr', label: 'Water depth at the part', unit: 'm', dp: 2, min: 0, max: 2, step: 0.05, start: 0.15 },
        test: 'Does it give a number that was observed? Then it is not a rule. Does it only say higher, lower, never above, or how steep? Then it is.',
        everyday: 'You have never timed either walk, but you know the one uphill takes longer. That ordering is a rule. It does not tell you how many minutes either takes.',
        cases: [['hail_solar', 'None on the base curve. One sits behind the stow adjustment: stowed trackers take less damage, direction only.', 'Only on the adjustment.'], ['flood_solar_xfmr', 'A transformer is damaged more gradually than switchgear.', 'The one thing that shapes the curve.'], ['wildfire_solar', 'Seven rules, for example no value above 0.90, and metal parts below electronics.', 'Everything rests on them.']],
        alias: 'In the damage framework’s words this is engineering judgement: tier T3 when a source supports the mechanism, T4 when it is a placeholder. Each carries a trigger for replacing it.',
      } },
  };
  const TYPES = {
    unrecorded: { n: 'No derivation record yet', tone: 'gap', d: 'Everything shown is read from the cell’s files. What pins the curve, and what each stretch rests on, wait for a derivation record.' },
    fitted: { n: 'Fitted', tone: 'ok', d: 'A stated shape drawn through measured points. Trust it where the points are; beyond them it is the shape’s assumption.' },
    engineered: { n: 'Engineered', tone: 'warn', d: 'Boundaries and rules only; the values between are chosen. Every value waits for the first measurement.' },
    table: { n: 'Table by class', tone: 'warn', d: 'The hazard is supplied in classes, not as a continuous measure, so the part has one value for each class and nothing in between.' },
    transferred: { n: 'Transferred', tone: 'warn', d: 'A published curve for a similar subject, adapted by a stated bridge.' },
    observed: { n: 'Observed', tone: 'ok', d: 'Fitted directly to claims or field outcomes.' },
  };
  // What a stretch of the axis rests on, drawn as a strip under the curve
  const GROUND = { unrec: { n: 'Not recorded', tone: 'gap' }, pinned: { n: 'Rests on measurement', tone: 'ok' }, shape: { n: 'The shape only', tone: 'warn' }, chosen: { n: 'Chosen', tone: 'gap' } };
  // What a tag's slot does on the chart, in a few words (the evidence drawing)
  const JOBS = { bridge: 'fixes the axis', boundary: 'pins a point by a standard', data: 'pins a point by measurement', reference: 'lends a shape', rule: 'orders and limits' };
  const TIERS = { T1: 'Direct empirical', T2: 'Standards, lab tests, physics', T3: 'Inferred or proxy', T4: 'Judgement or placeholder' };
  const STAGES = [['question', 'Question', 'What loss, for which part?'], ['evidence', 'Evidence', 'What may each source support?'], ['grain', 'Grain', 'What actually fails?'],
    ['axis', 'Axis', 'What drives the damage?'], ['form', 'Form', 'What shape, pinned by what?'], ['adjust', 'Adjustments', 'What else changes it?'], ['emit', 'Emit', 'What may it say, and what is withheld?']];
  const XD = [0, 0.02, 0.05, 0.15, 0.3, 0.6, 1, 1.5, 2], pw = (ys) => XD.map((x, i) => [x, ys[i]]), st = (ys) => ys.map((y, i) => [i, y]);
  const FLOW_COLS = ['EVIDENCE', 'DECISIONS', 'THE RESULT', 'WHAT IT GIVES'];
  const flow = (ev, de, res, out) => ({
    columns: FLOW_COLS,
    nodes: [...ev.map(([label, dashed], i) => ({ id: 'e' + i, label, col: 0, row: i, tone: 'input', step: ['grain', 'axis', 'form', 'adjust'][i], dashed })),
      ...de.map((label, i) => ({ id: 'd' + i, label, col: 1, row: i, tone: 'model', step: ['grain', 'axis', 'form', 'adjust'][i] })),
      { id: 'r', label: res, col: 2, row: 0, span: 4, tone: 'result', step: 'form' },
      { id: 'o0', label: out[0], col: 3, row: 1, tone: 'use', step: 'emit' }, { id: 'o1', label: out[1], col: 3, row: 2, tone: 'held', step: 'emit' }],
    edges: [...ev.map(([, dashed], i) => ({ from: 'e' + i, to: 'd' + i, dashed })), ...de.map((_, i) => ({ from: 'd' + i, to: 'r' })), { from: 'r', to: 'o0' }, { from: 'r', to: 'o1', dashed: true }],
  });

  const CASES = (typeof window === 'object' && window.DD && window.DD.cases) || {};

  const logistic = (p) => (x) => (p.R0 != null && x < p.R0 ? 0 : p.max_DR / (1 + Math.exp(-p.k_per_mm * (x - p.D50_mm))));
  const weibull = (p) => (x) => (x <= p.V0 ? 0 : p.max_DR * (1 - Math.pow(0.5, Math.pow((x - p.V0) / p.delta, p.rho))));
  const piece = (pts) => (x) => { if (x <= pts[0][0]) return pts[0][1]; for (let i = 1; i < pts.length; i++) if (x <= pts[i][0]) { const [a, va] = pts[i - 1], [b, vb] = pts[i]; return va + ((vb - va) * (x - a)) / (b - a); } return pts[pts.length - 1][1]; };
  // The curve as a function. A state table answers only at an exact class.
  const fn = (c) => (c.form === 'none' ? () => NaN : c.form === 'weibull' ? weibull(c.params) : c.form === 'logistic' ? logistic(c.params) : c.form === 'piecewise' ? piece(c.points) : (x) => (Number.isInteger(x) && c.points[x] ? c.points[x][1] : NaN));
  const stowed = (C) => { const a = C.curves[0], p = a.params; return (x) => C.stow.cap * logistic({ ...p, D50_mm: p.D50_mm + C.stow.shift })(x); };
  // A tag's clarifying picture at one value of its control. At the control's start it is the still picture.
  const clearPicture = (k, v) => { const c = TAGS[k].clear, t = c.try, P = c.picture, f = (i) => fn(CASES[t.caseId].curves[i]);
    if (k === 'bridge') { const at = Math.max(0, v - t.height);
      return { ...P, from: [P.from[0], v.toFixed(2) + ' m at the site'], to: [P.to[0], at > 1e-9 ? at.toFixed(2) + ' m of water' : 'dry: the water is below it'], then: [P.then[0], 'reads ' + f(0)(at).toFixed(2)] }; }
    if (k === 'data') return { ...P, then: ['At ' + v + ' mm, the curve', v === 50 ? 'reads 0.39: measured' : v === 25 ? 'reads 0.01: the boundary' : 'reads ' + f(0)(v).toFixed(2) + (v < 25 ? ': below any test' : v < 50 ? ': between anchors' : ': shape, not a test')] };
    if (k === 'rule') { const a = f(1)(v), b = f(0)(v);
      return { ...P, to: ['Switchgear, at ' + v.toFixed(2) + ' m', 'reads ' + a.toFixed(2)], then: [P.then[0], 'reads ' + b.toFixed(2) + (b < a - 1e-9 ? ': lower, by the rule' : ': they meet here')] }; }
    return P; };
  const list = () => Object.keys(CASES);
  const forNode = (asset, node) => list().filter((k) => CASES[k].asset === asset && CASES[k].node === node);
  return { TAGS, TYPES, GROUND, JOBS, TIERS, STAGES, CASES, fn, stowed, clearPicture, list, forNode };
});
