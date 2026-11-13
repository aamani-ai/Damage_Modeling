/* Ported from the infrastructure playground (digital-infra-playground, curve-derivation-app.js) on 2026-11-12 and adapted to read this
   repository: the cases come from data/cases.js, which tools/build.py generates from docs/cells. */
/* Failure and Recovery · how a damage curve was derived. The curve builds itself as the reader steps through the seven
   stages of its derivation: the frame, the part that fails, the axis, the anchors, the curve through them, what shifts
   it, and finally a question put to it. Above it: the verdict and the assumptions; under the curve: a strip showing what
   each stretch of the axis rests on. Data: curve-derivations.js. Opened as ?case=<id>&stage=<1..7>. */
(() => {
  const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const $ = (id) => document.getElementById(id);
  const S = { key: '', stage: 6, x: 0, stow: false, timer: null, node: 'r' };
  let D, C;
  const TONE = { ok: 'ok', warn: 'warn', gap: 'gap' };
  const tierTag = (t) => (t && t !== '—' ? `<span class="tag ${t === 'T4' ? 'gap' : t === 'T3' ? 'warn' : 'ok'}" title="${esc(D.TIERS[t] || '')}">${esc(t)} · ${esc(D.TIERS[t] || '')}</span>` : '<span class="tag">—</span>');
  // A tag is always a way in to what it means: clicking one opens the explainer
  const markTag = (k) => !D.TAGS[k] ? '<span class="tag">Job not recorded</span>' : `<span class="mt" data-tag="${k}" title="What is a ${esc(D.TAGS[k].n.toLowerCase())}?"><span class="mk mk-${k}"></span>${esc(D.TAGS[k].n)}<i class="inf" aria-hidden="true">i</i></span>`;
  const FW_EX = ['hail_solar', 'flood_solar_xfmr', 'wildfire_solar'];
  const fwHref = (stage) => 'framework.html?framework=damage&example=' + encodeURIComponent(FW_EX.includes(S.key) ? S.key : 'hail_solar') + '&stage=' + stage;
  const fmtX = (x) => (C.axis.kind === 'cat' ? C.axis.states[x] : x.toFixed(C.axis.dp) + ' ' + C.axis.unit);

  // ---- small pictures
  function spark(K) {
    const A = K.curves[0], f = D.fn(A), W = 76, H = 30, n = K.axis.kind === 'cat' ? 6 : 40;
    if (K.axis.kind === 'cat') return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" aria-hidden="true">${A.points.slice(1).map(([i, y]) => `<circle cx="${6 + (i - 1) * 12.8}" cy="${H - 3 - y * (H - 6)}" r="2.6" class="sp-dot"/>`).join('')}</svg>`;
    const pts = Array.from({ length: n + 1 }, (_, i) => { const x = K.axis.min + ((K.axis.max - K.axis.min) * i) / n; return (2 + (i / n) * (W - 4)).toFixed(1) + ',' + (H - 3 - f(x) * (H - 6)).toFixed(1); }).join(' ');
    return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" aria-hidden="true"><polyline points="${pts}" class="sp-line${K.type === 'engineered' ? ' dash' : ''}"/></svg>`;
  }
  function flowSVG(spec) {
    const W = 232, H = 60, GX = 52, GY = 14, PAD = 4, TOP = 24, cols = 4, rows = 4;
    const box = (n) => ({ x: PAD + n.col * (W + GX), y: TOP + PAD + n.row * (H + GY), w: W, h: H + ((n.span || 1) - 1) * (H + GY) });
    const at = new Map(spec.nodes.map((n) => [n.id, box(n)])), width = PAD * 2 + cols * W + (cols - 1) * GX, height = TOP + PAD * 2 + rows * H + (rows - 1) * GY;
    const edge = (e) => { const a = at.get(e.from), b = at.get(e.to), y1 = a.y + a.h / 2, y2 = Math.min(Math.max(y1, b.y + 14), b.y + b.h - 14), x1 = a.x + a.w, x2 = b.x - 3, mid = x1 + (x2 - x1) / 2;
      const d = Math.abs(y1 - y2) < 1 ? `M${x1} ${y1} H${x2}` : `M${x1} ${y1} H${mid} V${y2} H${x2}`; return `<path d="${d}" class="${e.dashed ? 'fl-dash' : 'fl-line'}" marker-end="url(#fl-arrow)"/>`; };
    const node = (n) => { const b = at.get(n.id), L = n.label.split('\n'), y0 = b.y + b.h / 2 - ((L.length - 1) * 18) / 2 + 5;
      return `<g class="fl-node${n.id === S.node ? ' sel' : ''}" data-node="${n.id}" role="button" tabindex="0" aria-pressed="${n.id === S.node}"><title>Open this box</title><rect x="${b.x}" y="${b.y}" width="${b.w}" height="${b.h}" rx="7" class="fl-box fl-${n.tone}${n.dashed ? ' fl-opt' : ''}"/>${L.map((t, i) => `<text x="${b.x + b.w / 2}" y="${y0 + i * 18}" class="${i ? 'fl-sub' : 'fl-lab'}">${esc(t)}</text>`).join('')}</g>`; };
    return `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="The derivation in one picture: evidence, the decisions it supports, the result and what it gives" style="width:100%;max-width:${width}px">
      <defs><marker id="fl-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto"><path d="M0 1 L10 5 L0 9 Z" class="fl-head"/></marker></defs>
      ${spec.columns.map((c, i) => `<text x="${PAD + i * (W + GX) + W / 2}" y="14" class="fl-col">${esc(c)}</text>`).join('')}${spec.edges.map(edge).join('')}${spec.nodes.map(node).join('')}</svg>`;
  }


  // ---- one drawing per early stage, before there is a curve to draw
  const svg = (inner, label, H = 372) => `<svg viewBox="0 0 720 ${H}" width="100%" role="img" aria-label="${esc(label)}"><defs><marker id="a-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto"><path d="M0 1 L10 5 L0 9 Z" class="a-head"/></marker></defs>${inner}</svg>`;
  const abox = (x, y, w, h, t, sub, cls) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" class="a-box ${cls || ''}"/><text x="${x + w / 2}" y="${y + h / 2 + (sub ? -4 : 4)}" text-anchor="middle" class="a-text">${esc(t)}</text>${sub ? `<text x="${x + w / 2}" y="${y + h / 2 + 13}" text-anchor="middle" class="a-sub">${esc(sub)}</text>` : ''}`;
  function art(s) {
    if (s === 0) { const Q = C.question; return svg(`
      <text x="20" y="34" class="a-head-t">Not this</text>${abox(120, 56, 220, 56, Q.not[0], '', 'a-off')}${abox(440, 56, 220, 56, Q.not[1], '', 'a-off')}<line x1="342" y1="84" x2="436" y2="84" class="a-line off" marker-end="url(#a-arrow)"/>
      <line x1="104" y1="126" x2="676" y2="42" class="a-strike"/>
      <text x="20" y="150" class="a-head-t">This</text>${abox(120, 166, 220, 60, Q.yes[0], 'what reaches the part', 'a-on')}${abox(440, 166, 220, 60, Q.yes[1], 'for this one part', 'a-on')}<line x1="342" y1="196" x2="436" y2="196" class="a-line" marker-end="url(#a-arrow)"/>
      <text x="360" y="262" text-anchor="middle" class="a-note">Measured as repair cost ÷ replacement value: physical damage only.</text>
      <text x="360" y="282" text-anchor="middle" class="a-note">How often it happens, and the revenue lost while it is repaired, are separate questions.</text>`, 'The question: not the whole plant against the hazard at the site, but one part against what reaches it', 298); }
    if (s === 1) { const rows = C.steps.evidence.table, tags = Object.keys(D.TAGS), ty = (j) => 26 + j * 66, sy = (i) => 26 + i * 66 + (tags.length - rows.length) * 33;
      const slots = tags.map((k, j) => { const has = rows.some((r) => r[1] === k); return `<rect x="486" y="${ty(j)}" width="214" height="50" rx="8" class="a-box ${has ? 'a-on' : 'a-none'}"/><g transform="translate(500 ${ty(j) + 20})">${glyph(k)}</g><text x="520" y="${ty(j) + 22}" class="a-text">${esc(D.TAGS[k].n)}</text><text x="520" y="${ty(j) + 38}" class="a-sub">${has ? esc(D.JOBS[k]) : C.unrecorded ? 'not recorded yet' : 'none for this curve'}</text>`; }).join('');
      const src = rows.map((r, i) => `<rect x="20" y="${sy(i)}" width="356" height="50" rx="8" class="a-box"/><text x="32" y="${sy(i) + 22}" class="a-text">${esc(r[0].length > 50 ? r[0].slice(0, 49) + '…' : r[0])}</text><text x="32" y="${sy(i) + 38}" class="a-sub">${esc(r[4])} · ${esc(D.TIERS[r[4]] || '')}</text>
        ${tags.includes(r[1]) ? `<path d="M376 ${sy(i) + 25} C430 ${sy(i) + 25}, 432 ${ty(tags.indexOf(r[1])) + 25}, 484 ${ty(tags.indexOf(r[1])) + 25}" class="a-line" marker-end="url(#a-arrow)"/>` : ''}`).join('');
      return svg(`<text x="20" y="16" class="a-head-t">Sources</text><text x="486" y="16" class="a-head-t">The one job each is given</text>${slots}${src}`, 'Each source is given one job: fix the axis, pin a point, lend a shape, or set a rule'); }
    if (s === 2) { const U = C.steps.grain.units, n = U.length, per = n > 8 ? 5 : 4, w = (680 - (per - 1) * 12) / per, word = { primary: 'its curve is shown here', other: 'has its own curve', cond: 'only in some conditions', low: 'kept low, not zero', zero: 'reviewed: about 0' };
      const tiles = U.map(([name, k], i) => { const x = 20 + (i % per) * (w + 12), y = 58 + Math.floor(i / per) * 86; return `<rect x="${x}" y="${y}" width="${w}" height="70" rx="8" class="a-box u-${k}"/><text x="${x + w / 2}" y="${y + 31}" text-anchor="middle" class="a-text${k === 'primary' ? ' inv' : ''}">${esc(name.length > 22 ? name.slice(0, 21) + '…' : name)}</text><text x="${x + w / 2}" y="${y + 49}" text-anchor="middle" class="a-sub${k === 'primary' ? ' inv' : ''}">${word[k]}</text>`; }).join('');
      return svg(`<text x="20" y="30" class="a-head-t">The plant, split into the parts that can fail</text>${tiles}<text x="20" y="${58 + Math.ceil(n / per) * 86 + 22}" class="a-note">Loss for the plant = each part’s damage × that part’s value, added up.</text><text x="20" y="${58 + Math.ceil(n / per) * 86 + 42}" class="a-note">No part is dropped: one the hazard cannot hurt stays as a reviewed zero.</text>`, 'The plant split into failure units, with the one shown here highlighted', 58 + Math.ceil(n / per) * 86 + 56); }
    const ch = C.steps.axis.chain, chain = ch.map(([a, b], i) => abox(20 + i * 240, 18, 200, 54, a, b.length > 34 ? b.slice(0, 33) + '…' : b, i === 2 ? 'a-on' : '') + (i < 2 ? `<line x1="${222 + i * 240}" y1="45" x2="${256 + i * 240}" y2="45" class="a-line" marker-end="url(#a-arrow)"/>` : '')).join('');
    let pic = '';
    if (C.hazard === 'hail') pic = [[25, 'the IEC test size'], [50, 'the PVEL lab test size'], [75, 'beyond any anchor']].map(([d, t], i) => { const r = d * 0.62, cx = 170 + i * 190; return `<circle cx="${cx}" cy="${300 - r}" r="${r}" class="a-stone"/><text x="${cx}" y="322" text-anchor="middle" class="a-text">${d} mm</text><text x="${cx}" y="340" text-anchor="middle" class="a-sub">${t}</text>`; }).join('') + `<line x1="60" y1="300" x2="660" y2="300" class="a-ground"/><text x="60" y="120" class="a-note">Hailstones, drawn to scale against each other</text>`;
    if (C.hazard === 'flood') pic = `<rect x="110" y="212" width="500" height="108" class="a-water"/><line x1="110" y1="320" x2="610" y2="320" class="a-ground"/>
      <rect x="300" y="266" width="130" height="54" class="a-pad"/><rect x="312" y="150" width="106" height="116" rx="4" class="a-box a-on"/><text x="365" y="204" text-anchor="middle" class="a-text">Transformer</text><text x="365" y="222" text-anchor="middle" class="a-sub">and controls</text>
      <line x1="150" y1="320" x2="150" y2="214" class="a-dim" marker-end="url(#a-arrow)"/><text x="160" y="250" class="a-text">0.60 m at the site</text>
      <line x1="470" y1="266" x2="470" y2="214" class="a-dim" marker-end="url(#a-arrow)"/><text x="480" y="244" class="a-text">0.30 m at the part</text>
      <line x1="430" y1="266" x2="610" y2="266" class="a-dash"/><text x="480" y="284" class="a-sub">part’s lowest critical point: 0.30 m</text>
      <text x="110" y="120" class="a-note">Depth at the part = water level − the part’s height. Below the part it is zero.</text>`;
    if (C.hazard === 'wildfire') pic = C.axis.states.slice(1).map((n, i) => { const h = [22, 44, 66, 88, 132, 168][i], x = 90 + i * 100; return `<path d="M${x - 22} 318 Q${x - 26} ${318 - h * 0.55} ${x} ${318 - h} Q${x + 26} ${318 - h * 0.55} ${x + 22} 318 Z" class="a-flame"/><text x="${x}" y="338" text-anchor="middle" class="a-sub">${esc(n)}</text><text x="${x}" y="${308 - h}" text-anchor="middle" class="a-text">${i + 1}</text>`; }).join('') + `<line x1="50" y1="318" x2="660" y2="318" class="a-ground"/><text x="50" y="120" class="a-note">Six classes, nothing between them. The top class has no upper end.</text>`;
    return svg(chain + pic, 'What drives the damage: from what the hazard source reports to what reaches the part');
  }
  const glyph = (k) => (k === 'boundary' ? '<rect x="-5" y="-5" width="10" height="10" transform="rotate(45)" class="m-boundary"/>' : k === 'data' ? '<circle r="5.5" class="m-data"/>' : k === 'rule' ? '<line x1="-6" x2="6" class="rule-line solid"/>' : k === 'reference' ? '<line x1="-6" x2="6" class="g-ref"/>' : '<rect x="-5" y="-5" width="10" height="10" rx="2" class="g-bridge"/>');

  // ---- the canvas: what is drawn grows with the stage
  function canvas() {
    if (S.stage < 4) return art(S.stage);
    if (!C.drawable) { const c = C.curves[0]; return `<div class="notdrawn"><p><b>Not drawn here yet.</b> This curve is ${esc(c.about || 'of a form this page does not draw')}: expected damage is a sum over damage states, each with its own cost ratio.</p>${c.table ? `<table><thead><tr><th>Damage state</th><th>Cost ratio</th></tr></thead><tbody>${c.table.map(([d, r]) => `<tr><td>${esc(d)}</td><td>${r}</td></tr>`).join('')}</tbody></table><p class="mutd">${c.scenarios} capacity scenarios in the cell, unweighted.</p>` : ''}</div>`; }
    const W = 720, H = 372, l = 54, r = 22, t = 20, b = 86, A = C.axis, cat = A.kind === 'cat', s = S.stage, pw = W - l - r, ph = H - t - b;
    const px = cat ? (i) => l + ((i + 0.5) / A.states.length) * pw : (x) => l + ((x - A.min) / (A.max - A.min)) * pw, py = (y) => t + (1 - y) * ph;
    let o = `<rect x="${l}" y="${t}" width="${pw}" height="${ph}" class="cv-frame"/>`;
    [0, 0.25, 0.5, 0.75, 1].forEach((y) => { o += `<line x1="${l}" x2="${W - r}" y1="${py(y)}" y2="${py(y)}" class="cv-grid"/><text x="${l - 8}" y="${py(y) + 4}" text-anchor="end" class="cv-tick">${y.toFixed(2)}</text>`; });
    o += `<text x="${l}" y="${t - 7}" class="cv-tick">Share of the part’s value lost</text>`;
    if (s < 3) o += `<text x="${l + pw / 2}" y="${H - b + 30}" text-anchor="middle" class="cv-wait">Against what? Decided at stage 4, Axis</text>`;
    else {
      if (cat) A.states.forEach((n, i) => { o += `<text x="${px(i)}" y="${H - b + 16}" text-anchor="middle" class="cv-tick">${esc(n)}</text>`; });
      else A.ticks.forEach((x) => { o += `<text x="${px(x)}" y="${H - b + 16}" text-anchor="middle" class="cv-tick">${x}</text>`; });
      o += `<text x="${l + pw / 2}" y="${H - b + 34}" text-anchor="middle" class="cv-axis">${esc(A.label)}</text>`;
    }
    if (s < 4) o += `<text x="${l + pw / 2}" y="${t + ph / 2}" text-anchor="middle" class="cv-wait">${['The frame: what is being measured', 'The evidence is gathered, not yet placed', 'The part that fails is chosen', 'The axis is set; the curve comes next'][s]}</text>`;
    if (s >= 4) {
      // ground under the curve
      const gy = H - b + 46;
      C.ground.forEach(([a, z, k, label]) => { const x0 = cat ? px(a) - pw / A.states.length / 2 + 3 : px(a), x1 = cat ? px(z) + pw / A.states.length / 2 - 3 : px(z);
        o += `<rect x="${x0 + 1}" y="${gy}" width="${Math.max(0, x1 - x0 - 2)}" height="12" rx="3" class="gr gr-${k}"><title>${esc(label)}</title></rect><text x="${(x0 + x1) / 2}" y="${gy + 27}" text-anchor="middle" class="cv-ground">${esc(x1 - x0 > 250 ? label : D.GROUND[k].n)}</text>`; });
      // neighbours and stow, from stage 6
      const nb = C.curves.filter((c) => c.role === 'neighbour');
      if (s >= 5) nb.forEach((c, i) => {
        if (cat) c.points.slice(1).forEach(([j, y]) => { o += `<circle cx="${px(j) + [-18, 18, 32][i]}" cy="${py(y)}" r="4" class="nb nb-${i}"><title>${esc(c.name)}: ${y}</title></circle>`; });
        else { const f = D.fn(c); o += `<polyline points="${line(f, px, py)}" class="nb-line nb-${i}"/>`; (c.data || []).forEach(([x, y]) => { o += `<circle cx="${px(x)}" cy="${py(y)}" r="3.2" class="nb nb-${i}"><title>${esc(c.name)}: ${y} at ${x}</title></circle>`; }); }
      });
      if (s >= 5 && C.stow && S.stow) o += `<polyline points="${line(D.stowed(C), px, py)}" class="stow-line"/>`;
      // rules
      C.marks.filter((m) => m.tag === 'rule').forEach((m) => {
        if (m.kind === 'cap') o += `<line x1="${l}" x2="${W - r}" y1="${py(m.y)}" y2="${py(m.y)}" class="rule-line"/><text x="${W - r - 6}" y="${py(m.y) - 6}" text-anchor="end" class="rule-text hit" data-tag="rule">${esc(m.label)}</text>`;
        if (m.kind === 'arrow' && s >= 5) o += `<line x1="${px(m.x)}" x2="${px(m.x)}" y1="${py(m.from) + 6}" y2="${py(m.to) - 8}" class="rule-line solid" marker-end="url(#cv-arrow)"/><text x="${px(m.x) + 9}" y="${m.ly != null ? py(m.ly) : (py(m.from) + py(m.to)) / 2 + 4}" class="rule-text hit" data-tag="rule">${esc(m.label)}</text>`;
      });
      // the adopted curve
      const a0 = C.curves[0], f0 = D.fn(a0);
      if (cat) a0.points.slice(1).forEach(([j, y]) => { o += `<line x1="${px(j)}" x2="${px(j)}" y1="${py(0)}" y2="${py(y)}" class="ad-stem"/><circle cx="${px(j)}" cy="${py(y)}" r="6" class="ad-dot"/><text x="${px(j)}" y="${py(y) - 11}" text-anchor="middle" class="ad-val">${y}</text>`; });
      else o += `<polyline points="${line(f0, px, py)}" class="ad-line${C.type === 'engineered' ? ' dash' : ''}"/>`;
      // boundaries and data points
      C.marks.filter((m) => m.tag !== 'rule').forEach((m) => { const X = px(m.x), Y = py(m.y);
        o += `<g class="hit" data-tag="${m.tag}"><title>What is a ${esc(D.TAGS[m.tag].n.toLowerCase())}?</title>` + (m.tag === 'boundary' ? `<rect x="${X - 6}" y="${Y - 6}" width="12" height="12" transform="rotate(45 ${X} ${Y})" class="m-boundary"/>` : `<circle cx="${X}" cy="${Y}" r="6.5" class="m-data"/>`) +
          (m.at ? `<line x1="${X}" y1="${Y}" x2="${px(m.at[0]) + (m.end ? 4 : -4)}" y2="${py(m.at[1]) - 4}" class="m-lead"/><text x="${px(m.at[0])}" y="${py(m.at[1])}" text-anchor="${m.end ? 'end' : 'start'}" class="m-text m-text-${m.tag}">${esc(m.label)}</text>`
            : `<text x="${X + m.dx}" y="${Y + m.dy}" text-anchor="${m.end ? 'end' : 'start'}" class="m-text m-text-${m.tag}">${esc(m.label)}</text>`) + '</g>'; });
      // the question put to the curve, at the last stage
      if (s >= 6) { const y = f0(S.x), X = px(S.x), Y = py(y);
        o += `<line x1="${X}" x2="${X}" y1="${py(0)}" y2="${Y}" class="q-line"/><line x1="${l}" x2="${X}" y1="${Y}" y2="${Y}" class="q-line"/><circle cx="${X}" cy="${Y}" r="6" class="q-dot"/>`; }
    }
    return `<svg viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="The ${esc(C.part)} curve at stage ${s + 1} of its derivation"><defs><marker id="cv-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M1 1 L9 5 L1 9 Z" class="rule-head"/></marker></defs>${o}</svg>`;
  }
  const line = (f, px, py) => { const A = C.axis, n = 140; return Array.from({ length: n + 1 }, (_, i) => { const x = A.min + ((A.max - A.min) * i) / n; return px(x).toFixed(1) + ',' + py(f(x)).toFixed(1); }).join(' '); };

  // The key to the chart, beside it: the lines, the five things that can pin a curve (present or not), and the ground
  function key() {
    if (S.stage < 4) return '';
    const ch = C.steps.axis.chain;
    const row = (k) => { const has = k === 'bridge' ? [ch[0][0] + ' → ' + ch[2][0]] : C.marks.filter((m) => m.tag === k).map((m) => m.label.replace(/^Rule: (.)/, (_, c) => c.toUpperCase())), none = (C.empty || {})[k];
      return `<button class="kr${has.length ? '' : ' off'}" data-tag="${k}"><span class="kn"><span class="mk mk-${k}"></span>${esc(D.TAGS[k].n)}<i class="inf" aria-hidden="true">i</i></span><span class="kv">${has.length ? esc(has.join(' · ')) : (C.unrecorded ? '<b>Not recorded yet.</b> Needs a derivation record.' : '<b>None on this curve.</b> Open to see why.')}</span></button>`; };
    return `<div class="ph">What pins this curve · click one to see what it means</div>${Object.keys(D.TAGS).map(row).join('')}`;
  }
  // Under the chart: how to read its lines and the strip along its axis
  function under() {
    if (S.stage < 4) return '';
    const nb = S.stage >= 5 ? C.curves.filter((c) => c.role === 'neighbour') : [];
    return `<div class="kg"><small>The lines</small><span class="kl"><i class="lg ad${C.type === 'engineered' ? ' dash' : ''}"></i><span><b>Adopted:</b> ${esc(C.curves[0].name)}</span></span>${nb.map((c, i) => `<span class="kl"><i class="lg nbl nb-${i}"></i>${esc(c.name)}</span>`).join('')}${C.stow && S.stow && S.stage >= 5 ? `<span class="kl"><i class="lg stw"></i>${esc(C.stow.name)}</span>` : ''}</div>
      <div class="kg"><small>The strip: what each stretch rests on</small>${C.ground.map(([a, z, k, label]) => `<span class="kl"><i class="lg gr-${k}"></i><span><b>${C.axis.kind === 'cat' ? esc(C.axis.states[a]) + ' to ' + esc(C.axis.states[z]) : a + ' to ' + z + ' ' + esc(C.axis.unit)}:</b> ${esc(label)}</span></span>`).join('')}</div>`;
  }
  const ky = () => { const k = key(), el = $('ky'); el.innerHTML = k; el.hidden = !k; $('lg').innerHTML = under(); };

  // ---- the explainer: what a bridge, a boundary, a data point, a reference curve and a rule are, on one made-up chart
  function tagArt(k) {
    const W = 560, H = 300, l = 50, r = 26, t = 16, b = 96, pw = W - l - r, ph = H - t - b, px = (u) => l + u * pw, py = (y) => t + (1 - y) * ph;
    const f = (u) => 0.88 / (1 + Math.exp(-10 * (u - 0.58))), g = (u) => 0.95 / (1 + Math.exp(-8 * (u - 0.46)));
    const path = (fn) => Array.from({ length: 61 }, (_, i) => px(i / 60).toFixed(1) + ',' + py(fn(i / 60)).toFixed(1)).join(' '), c = (x) => 'tl ' + (x === k ? 'hot' : 'dim');
    return `<svg viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="A made-up damage curve showing a bridge, a boundary, data points, a reference curve and a rule, with the ${esc(D.TAGS[k].n.toLowerCase())} highlighted">
      <defs><marker id="t-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto"><path d="M0 1 L10 5 L0 9 Z" class="a-head"/></marker></defs>
      <rect x="${l}" y="${t}" width="${pw}" height="${ph}" class="cv-frame"/><line x1="${l}" x2="${W - r}" y1="${py(0.5)}" y2="${py(0.5)}" class="cv-grid"/>
      <text x="${l - 8}" y="${py(1) + 4}" text-anchor="end">1.0</text><text x="${l - 8}" y="${py(0) + 4}" text-anchor="end">0</text><text x="${l + 4}" y="${t + 14}">Share of the part’s value lost</text><text x="${W - r}" y="${py(0) + 15}" text-anchor="end">stronger hazard →</text>
      <g class="${c('reference')}"><polyline points="${path(g)}" class="g-ref-line"/><line x1="190" y1="${py(0.8) + 5}" x2="${px(0.56) - 3}" y2="${py(g(0.56)) - 3}" class="t-lead"/><text x="60" y="${py(0.8)}">A published curve for something similar</text></g>
      <polyline points="${path(f)}" class="ad-line tl-ad"/>
      <g class="${c('rule')}"><line x1="${l}" x2="${W - r}" y1="${py(0.9)}" y2="${py(0.9)}" class="rule-line"/><text x="${W - r - 6}" y="${py(0.9) - 6}" text-anchor="end">A reasoned limit: never above 0.90</text></g>
      <g class="${c('boundary')}"><line x1="104" y1="${py(0.42) + 5}" x2="${px(0.25) - 5}" y2="${py(f(0.25)) - 9}" class="t-lead"/><rect x="${px(0.25) - 6}" y="${py(f(0.25)) - 6}" width="12" height="12" transform="rotate(45 ${px(0.25)} ${py(f(0.25))})" class="m-boundary"/><text x="60" y="${py(0.42)}">Fixed by a standard</text></g>
      <g class="${c('data')}"><circle cx="${px(0.5)}" cy="${py(f(0.5))}" r="6.5" class="m-data"/><circle cx="${px(0.66)}" cy="${py(f(0.66))}" r="6.5" class="m-data"/><text x="${px(0.7)}" y="${py(0.42)}">Measured here</text></g>
      <g class="${c('bridge')}"><rect x="50" y="240" width="156" height="34" rx="7" class="t-box"/><text x="128" y="261" text-anchor="middle">What the source reports</text><line x1="208" y1="257" x2="242" y2="257" class="a-line" marker-end="url(#t-arrow)"/>
        <rect x="246" y="240" width="156" height="34" rx="7" class="t-box"/><text x="324" y="261" text-anchor="middle">What reaches the part</text><line x1="324" y1="240" x2="324" y2="${py(0) + 4}" class="a-line" marker-end="url(#t-arrow)"/><text x="412" y="261">= the axis</text></g>
      <text x="${W - r}" y="${H - 6}" text-anchor="end" class="t-cap">A made-up curve, to show the five things. Not a real one.</text></svg>`;
  }
  // From the place to the part, on one real case: three boxes in a row, then the curve it feeds
  function flowArt(P) {
    const bx = (x, y, [t, sub], on) => `<rect x="${x}" y="${y}" width="196" height="52" rx="8" class="a-box${on ? ' a-on' : ''}"/><text x="${x + 98}" y="${y + 22}" text-anchor="middle" class="a-text">${esc(t)}</text><text x="${x + 98}" y="${y + 39}" text-anchor="middle" class="a-sub">${esc(sub)}</text>`;
    return `<svg viewBox="0 0 660 184" width="100%" role="img" aria-label="${esc(P.from.join(': '))}. ${esc(P.step.join(': '))}. ${esc(P.to.join(': '))}. ${esc(P.then.join(' '))}.">
      <defs><marker id="p-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto"><path d="M0 1 L10 5 L0 9 Z" class="a-head"/></marker></defs>
      <text x="104" y="14" text-anchor="middle" class="a-head-t">${esc(P.caps[0])}</text><text x="556" y="14" text-anchor="middle" class="a-head-t">${esc(P.caps[1])}</text>
      ${bx(6, 24, P.from)}<line x1="204" y1="50" x2="228" y2="50" class="a-line" marker-end="url(#p-arrow)"/>${bx(232, 24, P.step, true)}<line x1="430" y1="50" x2="454" y2="50" class="a-line" marker-end="url(#p-arrow)"/>${bx(458, 24, P.to)}
      <line x1="556" y1="78" x2="556" y2="120" class="a-line" marker-end="url(#p-arrow)"/>${bx(458, 124, P.then)}</svg>`;
  }
  function openTag(k) {
    const dlg = $('tagdlg'), T = D.TAGS[k], rows = C.trail.filter((r) => r[2] === k), marks = C.marks.filter((m) => m.tag === k).map((m) => m.label.replace(/^Rule: (.)/, (_, c) => c.toUpperCase())), none = (C.empty || {})[k];
    const here = (none ? `<p><b>None.</b> ${esc(none)}</p>` : '') + (rows.length ? `<ul>${rows.map((r) => `<li><b>${esc(r[0])}</b> → ${esc(r[3])}</li>`).join('')}</ul>` : !none && marks.length ? `<ul>${marks.map((m) => `<li>${esc(m)}</li>`).join('')}</ul>` : '');
    const grid = `<div class="pn-grid"><div><small>What it can do</small><p>${esc(T.can)}</p></div><div><small>What it cannot do</small><p>${esc(T.cannot)}</p></div><div><small>For example</small><p>${esc(T.eg)}</p></div></div>`, cl = T.clear;
    // A tag with a plain-words clarification leads with it; the chart and the fine print open below
    const body = !cl ? tagArt(k) + grid : `<ol class="cl-plain">${cl.plain.map((x) => `<li>${esc(x)}</li>`).join('')}</ol><div id="cl-art">${flowArt(cl.picture)}</div>
      ${cl.try ? `<div class="cl-try"><label for="cl-x">Try it · ${esc(cl.try.label.toLowerCase())}</label><input type="range" id="cl-x" data-tag="${k}" min="${cl.try.min}" max="${cl.try.max}" step="${cl.try.step}" value="${cl.try.start}"><b id="cl-v">${cl.try.start.toFixed(cl.try.dp)} ${esc(cl.try.unit)}</b></div>` : ''}
      <p class="cl-test"><b>A quick test.</b> ${esc(cl.test)}</p>
      <details class="cl-d"><summary>An everyday picture</summary><p>${esc(cl.everyday)}</p></details>
      <details class="cl-d"><summary>It looks different in every cell</summary><table><thead><tr><th>Cell</th><th>What the ${esc(T.n.toLowerCase())} is there</th><th>In short</th></tr></thead><tbody>${cl.cases.map(([id, what, how]) => `<tr><td><b>${esc(D.CASES[id].title)}</b></td><td>${esc(what)}</td><td>${esc(how)}</td></tr>`).join('')}</tbody></table></details>
      <details class="cl-d"><summary>Where it sits on a chart, with the other four</summary>${tagArt(k)}</details>
      <details class="cl-d"><summary>What it can and cannot do</summary>${grid}</details>
      <p class="cl-alias">${esc(cl.alias)}</p>`;
    dlg.innerHTML = `<div class="td-h"><div><b>What is drawn on a damage curve</b><span>Everything on the chart is one of five things. Each can do one job, and no more.</span></div><button data-close aria-label="Close">✕</button></div>
      <div class="td-b"><div class="td-tabs" role="tablist">${Object.keys(D.TAGS).map((x) => `<button role="tab" data-tagtab="${x}" aria-selected="${x === k}"><span class="mk mk-${x}"></span>${esc(D.TAGS[x].n)}</button>`).join('')}</div>
        <div class="td-c"><h3>${esc(T.n)}</h3><p class="td-q">${esc(T.q)}</p>${body}
          <div class="td-here"><small>In this curve · ${esc(C.title)}, ${esc(C.part)}</small>${here || '<p>Not used.</p>'}</div>
          <a class="fwl" href="${fwHref(2)}&mark=${k}">${esc(T.n)}, explained for any curve in the Framework ↗</a></div></div>`;
    if (!dlg.open) dlg.showModal();
  }

  function ask() {
    if (S.stage < 6 || !C.drawable) return '';
    const A = C.axis, cat = A.kind === 'cat', y = D.fn(C.curves[0])(S.x), g = C.ground.find(([a, z]) => S.x >= a && S.x <= z) || C.ground[0];
    const st = C.stow && S.stow ? ` · stowed ${D.stowed(C)(S.x).toFixed(2)}` : '';
    return `<div class="ask"><label for="qx">Ask it: ${cat ? 'which class?' : 'how much?'}</label><input type="range" id="qx" min="${cat ? 1 : A.min}" max="${cat ? 6 : A.max}" step="${cat ? 1 : A.step}" value="${S.x}">
      <span class="ans" id="ans"><b>${esc(fmtX(S.x))}</b> → ${y.toFixed(y < 0.1 ? 3 : 2)}${st}</span><span class="tag ${TONE[D.GROUND[g[2]].tone]}" id="gnd">${esc(D.GROUND[g[2]].n)}</span>
      ${C.stow ? `<label class="chk"><input type="checkbox" id="stow"${S.stow ? ' checked' : ''}>Trackers stowed (T4 placeholder)</label>` : ''}</div>`;
  }

  // ---- the detail of one stage
  // Beside the picture: the stage's answer, kept short so the two columns end together
  function detail() {
    const [id, name, q] = D.STAGES[S.stage], st = C.steps[id], chain = C.trail.filter((r) => r[4] === id); let h = `<div class="dq">Stage ${S.stage + 1} · ${esc(name)}: ${esc(q)}</div><h3>${esc(st.a)}</h3>`;
    if (id === 'question') h += `<div class="qfor"><div><small>Use it for</small>${esc(C.use)}</div><div><small>Not for</small>${esc(C.notFor)}</div></div>`;
    if (st.units) h += `<p>${st.units.filter(([, k]) => k === 'primary' || k === 'other').length} of ${st.units.length} parts get a curve of their own in every event; the rest are conditional, low or reviewed at about zero.</p>`;
    if (st.table) h += `<div class="evl">${st.table.map(([a, k, b, , t]) => `<div><b>${esc(a)}</b><span>${markTag(k)} · ${esc(t)}</span><p>${esc(b)}</p></div>`).join('')}</div>`;
    if (st.struck) h += `<div class="struck"><span>Rejected, because each step would be invented:</span>${st.struck.map((x) => `<s>${esc(x)}</s>`).join('')}</div>`;
    if (st.formula) h += `<pre>${esc(st.formula)}</pre>`;
    if (st.table3) h += `<div class="evl">${st.table3.map(([a, b, , t]) => `<div><b>${esc(a)} · ${esc(b)}</b><span>${esc(t)}</span></div>`).join('')}</div>`;
    // Beside a chart only the first note is shown; the rest open below
    if (st.points) h += `<ul>${(S.stage < 4 ? st.points : st.points.slice(0, 1)).map((x) => `<li>${esc(x)}</li>`).join('')}</ul>`;
    if (inlineChain(id, st) && chain.length) h += `<div class="pn-sub">The chain behind it</div><div class="trail in narrow">${trailRows(chain)}</div>`;
    if (st.yes) h += `<div class="emit"><div><b>It may say</b>${st.yes.map((x) => `<p class="y">${esc(x)}</p>`).join('')}</div><div><b>Withheld</b>${st.no.map((x) => `<p class="n">${esc(x)}</p>`).join('')}</div></div>`;
    return h + `<a class="fwl" href="${fwHref(S.stage + 1)}">How this stage works for any curve, in the Framework ↗</a>`;
  }
  // Below both columns, full width: the stage's long material as rows that open
  // The heart of the derivation, at the shape stage: how each number was set. The reasoning in order, each step with
  // its references and how strong it is; then number by number; then what it was checked against.
  function how() {
    const H = C.how, link = ([t, u]) => `<a href="${esc(u)}" target="_blank" rel="noopener">${esc(t)} ↗</a>`;
    return `<div class="panel pad how" id="how"><div class="ph">How each number was set · the reasoning and its references</div><p class="how-lead">${esc(H.lead)}</p>
      <ol class="how-steps">${H.steps.map((x) => `<li><b>${esc(x.t)}</b><p>${esc(x.d)}</p><div class="how-refs">${tierTag(x.tier)}${x.refs.map(link).join('')}</div></li>`).join('')}</ol>
      <div class="how-sub">Number by number</div>
      <table class="how-t"><thead><tr>${H.cols.map((c) => `<th>${esc(c)}</th>`).join('')}<th>How strong</th></tr></thead><tbody>${H.rows.map(([a, b, c, d, t]) => `<tr><td><b>${esc(a)}</b></td><td class="num">${esc(b)}</td><td>${esc(c)}</td><td>${esc(d)}</td><td>${tierTag(t)}</td></tr>`).join('')}</tbody></table>
      <div class="how-sub">Checked afterwards, not fitted</div><ul class="how-chk">${H.checks.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>${H.checkRefs ? `<div class="how-refs">${H.checkRefs.map(link).join('')}</div>` : ''}
      <p class="foot">Sources and their roles are as the damage_modeling cell’s dossier and source register record them. This page has not re-read the papers.</p></div>`;
  }
  const inlineChain = (id, st) => id === 'axis' && !st.struck;
  function wide() {
    const id = D.STAGES[S.stage][0], st = C.steps[id], chain = C.trail.filter((r) => r[4] === id), asm = C.assumptions.filter((a) => a.step === id), rows = [];
    if (st.rulesList && C.rules) rows.push([`The ${C.rules.length} rules, as the cell writes them`, `<ol class="rules two">${C.rules.map((x) => `<li>${esc(x)}</li>`).join('')}</ol>`]);
    if (st.table) rows.push(['What each source may and may not support', `<table><thead><tr><th>Source</th><th>Its job</th><th>Supports</th><th>Does not support</th><th>Tier</th></tr></thead><tbody>${st.table.map(([a, k, b, c, t]) => `<tr><td>${esc(a)}</td><td class="nw">${markTag(k)}</td><td>${esc(b)}</td><td>${esc(c)}</td><td class="nw">${esc(t)}</td></tr>`).join('')}</tbody></table>`]);
    if (st.table3) rows.push(['How each one enters', `<table><thead><tr><th>Kind</th><th>What</th><th>Effect</th><th>Tier</th></tr></thead><tbody>${st.table3.map(([a, b, c, t]) => `<tr><td class="nw"><b>${esc(a)}</b></td><td>${esc(b)}</td><td>${esc(c)}</td><td class="nw">${esc(t)}</td></tr>`).join('')}</tbody></table>`, true]);
    if (st.points && S.stage >= 4 && st.points.length > 1) rows.push([`More notes on this stage (${st.points.length - 1})`, `<ul>${st.points.slice(1).map((x) => `<li>${esc(x)}</li>`).join('')}</ul>`]);
    if (!inlineChain(id, st) && chain.length) rows.push([`From a source to the number it set (${chain.length})`, `<div class="trail in">${trailRows(chain)}</div>`]);
    if (asm.length) rows.push([`What this stage assumes (${asm.length})`, `<div class="assume">${asCards(asm)}</div>`]);
    if (st.rejected) rows.push([`Considered and rejected (${st.rejected.length})`, `<div class="rej">${st.rejected.map(([a, b]) => `<p><s>${esc(a)}</s> · ${esc(b)}</p>`).join('')}</div>`]);
    return (id === 'form' && C.how ? how() : '') + rows.map(([t, b, open]) => `<details class="cl-d"${open ? ' open' : ''}><summary>${esc(t)}</summary>${b}</details>`).join('');
  }

  // ---- what a box in the picture opens: the source, the decision with its chain and assumptions, the result, or what it gives
  const trailRows = (rows) => rows.map(([src, says, k, sets, step]) => `<button class="tr" data-go="${step}"><span class="tc"><small>Source</small><b>${esc(src)}</b></span><i>→</i><span class="tc"><small>It reports</small>${esc(says)}</span><i>→</i><span class="tc job"><small>Its job</small>${k === 'chosen' ? '<span class="tag gap">Chosen, no source</span>' : k === 'unassigned' ? '<span class="tag">Job not recorded</span>' : '<span>' + markTag(k) + '</span>'}</span><i>→</i><span class="tc set"><small>What it set</small><b>${esc(sets)}</b></span></button>`).join('');
  const asCards = (list) => list.map((a) => `<div class="as"><b>${esc(a.t)}</b><p>${esc(a.d)}</p><div class="asf">${tierTag(a.tier)}<span>Replaced by: ${esc(a.trigger)}</span></div></div>`).join('');
  const seeStage = (step, label) => `<button class="see" data-go="${step}">${esc(label || 'See this stage drawn')} ↓</button>`;
  function panel() {
    const n = C.flow.nodes.find((x) => x.id === S.node) || C.flow.nodes.find((x) => x.id === 'r'), title = n.label.split('\n')[0], idx = Number(n.id.slice(1));
    const stage = D.STAGES.find(([id]) => id === n.step), stN = D.STAGES.indexOf(stage) + 1, st = C.steps[n.step], doss = `<a href="${esc(C.dossier[1])}" target="_blank" rel="noopener">${esc(C.dossier[0])} ↗</a>`;
    const chain = C.trail.filter((r) => r[4] === n.step), asm = C.assumptions.filter((a) => a.step === n.step);
    if (n.col === 0) { const e = C.evid[idx]; return `<div class="pn-k">Evidence</div><h3>${esc(title)}</h3>
      <div class="pn-grid"><div><small>What it reports</small><p>${esc(e.reports)}</p></div><div><small>What we take from it</small><p>${esc(e.supports)}</p></div><div><small>What we do not take from it</small><p>${esc(e.not)}</p></div><div><small>How strong</small><p>${tierTag(e.tier)}</p></div></div>
      ${chain.length ? `<div class="pn-sub">What it set on the curve</div><div class="trail in">${trailRows(chain)}</div>` : ''}
      <div class="pn-links"><span>Open the source:</span>${e.links.map(([t, u]) => `<a href="${esc(u)}" target="_blank" rel="noopener">${esc(t)} ↗</a>`).join('')}${doss}</div>`; }
    if (n.col === 1) return `<div class="pn-k">Decision · stage ${stN}, ${esc(stage[1])}: ${esc(stage[2])}</div><h3>${esc(st.a)}</h3>
      ${chain.length ? `<div class="pn-sub">The chain behind it: from a source to what it set</div><div class="trail in">${trailRows(chain)}</div>` : ''}
      ${asm.length ? `<div class="pn-sub">What this decision assumes</div><div class="assume">${asCards(asm)}</div>` : '<p class="none">No assumption of its own beyond the sources above.</p>'}
      ${st.rejected ? `<div class="rej"><b>Considered and rejected</b>${st.rejected.map(([a, b]) => `<p><s>${esc(a)}</s> · ${esc(b)}</p>`).join('')}</div>` : ''}
      ${st.points ? `<ul>${st.points.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>` : ''}
      <div class="pn-links">${seeStage(n.step)}${doss}</div>`;
    if (n.id === 'r') { const T = D.TYPES[C.type]; return `<div class="pn-k">The result</div><h3>${esc(C.part)}: ${esc(T.n.toLowerCase())}, pinned by ${esc(C.pinnedBy.toLowerCase())}</h3><p>${esc(C.typeNote)}</p>
      <div class="pn-sub">What each stretch of it rests on</div><div class="gseg">${C.ground.map(([a, z, k, label]) => `<span><i class="lg gr-${k}"></i><b>${C.axis.kind === 'cat' ? esc(C.axis.states[a]) + ' to ' + esc(C.axis.states[z]) : a + ' to ' + z + ' ' + esc(C.axis.unit)}</b> · ${esc(label)}</span>`).join('')}</div>
      <div class="pn-sub">The whole chain: every number, back to its source</div><div class="trail in">${trailRows(C.trail)}</div>
      <div class="pn-links">${seeStage('form', 'See the curve built')}${doss}</div>`; }
    const E = C.steps.emit; return `<div class="pn-k">${n.id === 'o0' ? 'What it gives' : 'What it withholds'}</div><h3>${esc(E.a)}</h3>
      <div class="emit"><div><b>It may say</b>${E.yes.map((x) => `<p class="y">${esc(x)}</p>`).join('')}</div><div><b>Withheld</b>${E.no.map((x) => `<p class="n">${esc(x)}</p>`).join('')}</div></div>
      ${asm.length ? `<div class="pn-sub">What this assumes</div><div class="assume">${asCards(asm)}</div>` : ''}<div class="pn-links">${seeStage('emit', 'Ask the curve a question')}${doss}</div>`;
  }

  // ---- the page
  function render() {
    C = D.CASES[S.key]; const T = D.TYPES[C.type];
    $('derive').innerHTML = `
      ${C.unrecorded ? `<div class="banner"><b>No derivation record yet for this curve.</b> The curve, its parameters and their grades, its sources, what shifts it and what it may say are read from the cell’s files. What pins it, what each stretch rests on and the reasoning step by step wait for a record in <code>derivation_dashboard/records/${esc(C.cell)}.json</code>.</div>` : ''}
      <section class="verdict"><div class="vh"><div><div class="lvl">${C.level.path.map((x, i) => `<span class="${i === C.level.path.length - 1 ? 'on' : ''}">${esc(x)}</span>`).join('<i>›</i>')}<em>${esc(C.level.kind)} level</em></div><h1>${esc(C.title)} · ${esc(C.part)}</h1><p class="lede">${esc(C.says)}</p></div><span class="type ${T.tone}" title="${esc(T.d)}">${esc(T.n)}</span></div>
        <p class="tdesc">${esc(C.typeNote)} <span class="mutd">${esc(C.level.of)}</span></p>
        <div class="tiles"><div><span>Pinned by</span><b>${esc(C.pinnedBy)}</b></div><div><span>Weakest link</span><b>${esc(C.weakest)} · ${esc(D.TIERS[C.weakest])}</b><small>${esc(C.weakestNote)}</small></div><div><span>Use it for</span><b>${esc(C.use)}</b></div><div><span>Not for</span><b>${esc(C.notFor)}</b></div></div></section>
      <section><div class="ph">How this curve was arrived at · click any box</div><div class="panel pad flow" id="fl">${flowSVG(C.flow)}</div><div class="panel pad pn" id="pn">${panel()}</div></section>
      <section><div class="ph">What it assumes, all together</div><div class="assume">${asCards(C.assumptions)}</div></section>
      <section><div class="ph">Build the curve, stage by stage</div>
        <div class="rail" role="tablist" aria-label="Stage">${D.STAGES.map(([id, n], i) => `<button role="tab" aria-selected="${i === S.stage}" data-stage="${i}" class="${i < S.stage ? 'done' : ''}"><i>${i + 1}</i>${esc(n)}</button>`).join('')}
          <span class="grow"></span><button id="play" class="play">▶ Play the build</button></div>
        <div class="build"><div class="panel pad stick"><div id="cv">${canvas()}</div><div id="ask">${ask()}</div><div id="lg" class="under">${under()}</div></div><div class="rcol"><div class="panel pad detail" id="dt">${detail()}</div><div class="panel pad key" id="ky"${key() ? '' : ' hidden'}>${key()}</div></div></div><div class="wide" id="dw">${wide()}</div></section>
      <section><div class="ph">Where it comes from</div><div class="from">
        <div class="fc"><small>The curve’s version</small><code class="pinc">${esc(C.pin)}</code><span><a href="https://github.com/aamani-ai/Damage_Modeling/blob/main/${esc(C.file)}" target="_blank" rel="noopener"><code>${esc(C.file.split('/').pop())}</code> on GitHub ↗</a></span><span><a href="https://github.com/aamani-ai/Damage_Modeling/tree/main/docs/cells/${esc(C.cell)}" target="_blank" rel="noopener">The cell’s folder on GitHub ↗</a></span><span>File checksum <code title="SHA-256 ${esc(C.sha256)}">${esc(C.sha256.slice(0, 12))}…</code></span><span class="mutd">Read by its exact version. Not refitted here.</span></div>
        <div class="fc"><small>Sources</small>${[C.dossier, ...C.sources].map(([t, u]) => `<a href="${esc(u)}" target="_blank" rel="noopener">${esc(t)} ↗</a>`).join('')}</div>
        <div class="fc"><small>This page</small>${C.record ? `<span>Derivation record <a href="https://github.com/aamani-ai/Damage_Modeling/blob/derivation-dashboard/${esc(C.record)}" target="_blank" rel="noopener"><code>${esc(C.record.split('/').pop())}</code> ↗</a> · ${esc(C.record_status)}</span><span class="mutd">On the branch <code>derivation-dashboard</code>, not pushed yet: the link works once it is.</span><span class="mutd">Checked against the curve file at every build.</span>` : '<span>No derivation record yet.</span>'}<span>Built from commit <code>${esc(window.DD.meta.commit)}</code> · ${esc(window.DD.meta.date)}</span><a href="${fwHref(1)}">The method for any damage curve: the Framework ↗</a></div>
      </div></section>`;
  }
  function paint(all) { $('cv').innerHTML = canvas(); if (all) { ky(); $('ask').innerHTML = ask(); $('dt').innerHTML = detail(); $('dw').innerHTML = wide();
      document.querySelectorAll('[data-stage]').forEach((b) => { const i = Number(b.dataset.stage); b.setAttribute('aria-selected', String(i === S.stage)); b.classList.toggle('done', i < S.stage); }); } }
  function sync() { const u = new URL(location.href); u.search = S.key ? 'case=' + encodeURIComponent(S.key) + '&stage=' + (S.stage + 1) : 'asset=' + S.asset + '&hazard=' + S.hazard; history.replaceState(null, '', u); }
  function stop() { clearInterval(S.timer); S.timer = null; const p = $('play'); if (p) p.textContent = '▶ Play the build'; }
  function go(i) { S.stage = Math.max(0, Math.min(6, i)); sync(); paint(true); }
  function pick(k) { stop(); S.key = k; C = D.CASES[k]; S.x = C.axis.start; S.stow = false; S.node = 'r'; sync(); render(); }

  // ---- the library: asset, then hazard, then one curve
  const LIB = () => window.DD.library, cellOf = (key) => { for (const [as, hz] of Object.entries(LIB())) for (const [h, e] of Object.entries(hz)) if (e.curves.some((c) => c.key === key)) return [as, h]; return null; };
  function nav(asset, hazard, key) {
    const L = LIB(), hz = L[asset]; if (!hz[hazard]) hazard = Object.keys(hz).find((h) => hz[h].curves.length) || Object.keys(hz)[0];
    const E = hz[hazard]; $('assets').innerHTML = Object.entries(window.DD.assets).map(([k, n]) => `<button data-asset="${k}" aria-pressed="${k === asset}">${esc(n)}</button>`).join('');
    $('hazard').innerHTML = Object.entries(hz).map(([h, e]) => `<option value="${h}"${h === hazard ? ' selected' : ''}>${esc(e.label)}${e.curves.length ? ' · ' + e.curves.length + ' curve' + (e.curves.length > 1 ? 's' : '') : ' · no curve'}</option>`).join('');
    const rec = E.curves.find((c) => c.type !== 'unrecorded'); key = E.curves.some((c) => c.key === key) ? key : (rec || E.curves[0] || {}).key;
    $('curve').innerHTML = E.curves.map((c) => `<option value="${esc(c.key)}"${c.key === key ? ' selected' : ''}>${esc(c.name)}${c.type !== 'unrecorded' ? ' · explained' : ''}${c.drawable ? '' : ' · not drawn'}</option>`).join('');
    $('curve').hidden = !E.curves.length; S.asset = asset; S.hazard = hazard;
    if (!key) { stop(); S.key = ''; $('derive').innerHTML = `<section class="verdict"><h1>${esc(E.label)} on a ${esc(asset)} plant</h1><p class="lede">${E.curves.length ? '' : 'This cell has no current runtime curve: ' + esc(E.status) + '.'}${E.withheld && E.withheld.length ? ' Withheld: ' + esc(E.withheld.join(', ')) + '.' : ''}</p>${E.dossier ? `<a href="${esc(E.dossier)}" target="_blank" rel="noopener">The cell’s dossier ↗</a>` : ''}</section>`; sync(); return; }
    pick(key);
  }
  function start() {
    D = window.CurveDerivations; const q = new URLSearchParams(location.search);
    const at = q.get('case') && D.CASES[q.get('case')] ? cellOf(q.get('case')) : null;
    const st = Number(q.get('stage')); S.stage = st >= 1 && st <= 7 ? st - 1 : 6;
    $('assets').addEventListener('click', (e) => { const b = e.target.closest('[data-asset]'); if (b) nav(b.dataset.asset, S.hazard, ''); });
    $('hazard').addEventListener('change', (e) => nav(S.asset, e.target.value, ''));
    $('curve').addEventListener('change', (e) => nav(S.asset, S.hazard, e.target.value));
    const el = $('derive');
    el.addEventListener('click', (e) => {
      const tg = e.target.closest('[data-tag]'); if (tg && tg.id !== 'cl-x') { e.preventDefault(); return openTag(tg.dataset.tag); }
      const s = e.target.closest('[data-stage]'); if (s) { stop(); return go(Number(s.dataset.stage)); }
      const tr = e.target.closest('[data-go]'); if (tr) { stop(); go(D.STAGES.findIndex(([id]) => id === tr.dataset.go)); $('cv').scrollIntoView({ behavior: 'smooth', block: 'center' }); return; }
      const n = e.target.closest('.fl-node'); if (n) { S.node = n.dataset.node; $('fl').innerHTML = flowSVG(C.flow); $('pn').innerHTML = panel(); return; }
      if (e.target.id === 'play') { if (S.timer) return stop(); go(0); e.target.textContent = '■ Stop'; S.timer = setInterval(() => { if (S.stage >= 6) return stop(); go(S.stage + 1); }, 2200); }
    });
    el.addEventListener('keydown', (e) => { const n = e.target.closest && e.target.closest('.fl-node'); if (n && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); n.dispatchEvent(new MouseEvent('click', { bubbles: true })); } });
    el.addEventListener('input', (e) => {
      if (e.target.id === 'qx') { S.x = C.axis.kind === 'cat' ? Number(e.target.value) : Math.round(Number(e.target.value) * 100) / 100; paint(false);
        const y = D.fn(C.curves[0])(S.x), g = C.ground.find(([a, z]) => S.x >= a && S.x <= z) || C.ground[0];
        $('ans').innerHTML = `<b>${esc(fmtX(S.x))}</b> → ${y.toFixed(y < 0.1 ? 3 : 2)}${C.stow && S.stow ? ' · stowed ' + D.stowed(C)(S.x).toFixed(2) : ''}`; const G = $('gnd'); G.textContent = D.GROUND[g[2]].n; G.className = 'tag ' + TONE[D.GROUND[g[2]].tone]; }
      if (e.target.id === 'stow') { S.stow = e.target.checked; paint(false); ky(); $('qx').dispatchEvent(new Event('input', { bubbles: true })); }
    });
    const dlg = $('tagdlg');
    dlg.addEventListener('input', (e) => { if (e.target.id !== 'cl-x') return; const k = e.target.dataset.tag, v = Number(e.target.value);
      $('cl-art').innerHTML = flowArt(D.clearPicture(k, v)); $('cl-v').textContent = v.toFixed(D.TAGS[k].clear.try.dp) + ' ' + D.TAGS[k].clear.try.unit; });
    dlg.addEventListener('click', (e) => { const t = e.target.closest('[data-tagtab]'); if (t) return openTag(t.dataset.tagtab); if (e.target === dlg || e.target.closest('[data-close]')) dlg.close(); });
    nav(at ? at[0] : q.get('asset') || 'solar', at ? at[1] : q.get('hazard') || 'hail', q.get('case') || '');
  }
  let tries = 0;
  (function ready() { if (window.CurveDerivations && window.DD && document.getElementById('derive')) start(); else if (++tries < 160) setTimeout(ready, 50); })();
})();
