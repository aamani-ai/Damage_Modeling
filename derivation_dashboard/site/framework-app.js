/* Ported from the infrastructure playground (digital-infra-playground, framework-app.js) on 2026-11-12 and adapted to read this
   repository: the cases come from data/cases.js, which tools/build.py generates from docs/cells. */
/* Framework · a method as the thing shown. One page for every framework: what it produces, its decisions in order on
   one screen, a walk through them where each decision has one picture to operate, the forks where they occur, and its
   words. The framework is data (framework-damage.js registers Frameworks.damage); this file draws whatever is registered.
   The worked examples reuse the curves of curve-derivations.js (the damage_modeling artifacts' own; never refitted).
   Opened as ?framework=<id>&example=<id>&stage=<1..n>. Grammar: docs/extra/discussions/framework_section/01. */
(() => {
  const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const $ = (id) => document.getElementById(id);
  const S = { fw: '', ex: '', stage: 0, words: 'plain', filter: 'all', rule: 0, out: 0, is: {}, mark: '', markOn: false, openFork: '', showAll: false };
  let F, D, X;
  const STATUS = { handled: ['Settled', 'ok', 'settled'], unclear: ['Answered more than one way', 'warn', 'more than one way'], open: ['Not covered yet', 'gap', 'not covered'] };
  const f2 = (y) => (y == null || Number.isNaN(y) ? '—' : y === 0 ? '0' : y < 0.1 ? y.toFixed(3).replace(/0$/, '') : y.toFixed(2));
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lead = (s) => (S.words === 'plain' ? s.plain : s.term), other = (s) => (S.words === 'plain' ? s.term : s.plain);
  const stageOf = (id) => F.stages.find((s) => s.id === id);
  const forksAt = (id) => F.forks.filter((f) => f.stage === id);
  const cellName = (id) => (F.cells && F.cells[id]) || id;

  // ---- curves: one evaluator for every part's response, in the artifacts' own forms
  const evalF = (f, x) => {
    if (!f) return null;
    if (f.log) return f.log.max_DR / (1 + Math.exp(-f.log.k_per_mm * (x - f.log.D50_mm)));
    if (f.tab) return Number.isInteger(x) && f.tab[x] != null ? f.tab[x] : NaN;
    const p = f.pts; if (x <= p[0][0]) return p[0][1];
    for (let i = 1; i < p.length; i++) if (x <= p[i][0]) { const [a, va] = p[i - 1], [b, vb] = p[i]; return va + ((vb - va) * (x - a)) / (b - a); }
    return p[p.length - 1][1];
  };
  const C = () => D.CASES[X.caseId];
  const curveById = (caseId, id) => D.CASES[caseId].curves.find((c) => c.id === id);

  // ---- small drawing helpers (flat, one accent, direct labels; after model-gpr's docs illustrations, not copied)
  const ARROW = (id) => `<defs><marker id="${id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto"><path d="M0 1 L10 5 L0 9 Z" class="i-head"/></marker></defs>`;
  const svg = (h, label, body) => `<svg viewBox="0 0 760 ${h}" role="img" aria-label="${esc(label)}">${body}</svg>`;
  const tx = (x, y, t, cls = 'i-t', a = 'start') => `<text x="${x}" y="${y}" class="${cls}" text-anchor="${a}">${esc(t)}</text>`;
  // Wrap a label into lines of about n characters
  const wrap = (t, n) => { const out = []; let cur = ''; String(t).split(' ').forEach((w) => { if ((cur + ' ' + w).trim().length > n && cur) { out.push(cur); cur = w; } else cur = (cur + ' ' + w).trim(); }); if (cur) out.push(cur); return out; };
  const lines = (x, y, t, n, cls = 'i-m', a = 'start', lh = 14) => wrap(t, n).map((l, i) => tx(x, y + i * lh, l, cls, a)).join('');
  function plot({ x = 52, y = 26, w = 440, h = 176, axis, yl = 'Share of the part’s value lost' }) {
    const cat = axis.kind === 'cat', n = cat ? axis.states.length : 0;
    const px = cat ? (i) => x + ((i + 0.5) / n) * w : (v) => x + ((v - axis.min) / (axis.max - axis.min)) * w, py = (v) => y + (1 - v) * h;
    let o = `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" class="i-line"/>`;
    [0, 0.5, 1].forEach((v) => { o += `<line x1="${x}" x2="${x + w}" y1="${py(v)}" y2="${py(v)}" class="i-grid"/>${tx(x - 7, py(v) + 4, v === 0 ? '0' : v.toFixed(1), 'i-m', 'end')}`; });
    o += tx(x, y - 8, yl, 'i-m');
    if (cat) axis.states.forEach((s, i) => { o += tx(px(i), y + h + 15, axis.short ? axis.short[i] : s, 'i-m', 'middle'); });
    else axis.ticks.forEach((v) => { o += tx(px(v), y + h + 15, v, 'i-m', 'middle'); });
    o += tx(x + w / 2, y + h + 32, axis.label, 'i-t', 'middle');
    return { px, py, o, x, y, w, h, cat };
  }
  const poly = (f, P, axis, cls) => { const n = 120; return `<polyline points="${Array.from({ length: n + 1 }, (_, i) => { const v = axis.min + ((axis.max - axis.min) * i) / n; return P.px(v).toFixed(1) + ',' + P.py(f(v)).toFixed(1); }).join(' ')}" class="${cls}"/>`; };
  const stems = (pts, P, cls = 'i-acc', r = 5) => pts.slice(1).map(([i, v]) => `<line x1="${P.px(i)}" x2="${P.px(i)}" y1="${P.py(0)}" y2="${P.py(v)}" stroke="var(--primary)" stroke-width="1.6" stroke-dasharray="3 3"/><circle cx="${P.px(i)}" cy="${P.py(v)}" r="${r}" class="${cls}"/>`).join('');
  const range = (k, st, min, max, step, label) => `<label for="c-${k}">${esc(label)}</label><input type="range" id="c-${k}" data-k="${k}" min="${min}" max="${max}" step="${step}" value="${st[k]}">`;
  const pickBtns = (k, st, opts) => `<div class="chips">${opts.map((o, i) => `<button data-set="${k}" data-v="${i}" aria-pressed="${st[k] === i}"${o.off ? ' disabled' : ''}>${esc(o.name || o)}</button>`).join('')}</div>`;

  // ---- the illustrations: one per decision. Each: init (the controls' start), svg, ctl, read, and out (live labels)
  const ILL = {
    // Stage 1 of any chain-shaped method: follow one event and see which links this method owns
    chain: {
      init: (E) => ({ at: E.start }),
      svg(st, E) {
        const L = E.links, n = L.length, bw = 112, g = (760 - n * bw) / (n - 1), y = 64, bh = 66, ins = L.map((l, i) => (l.side !== 'out' ? i : -1)).filter((i) => i >= 0), a = ins[0], z = ins[ins.length - 1];
        let o = ARROW('fw-a1');
        o += `<rect x="${a * (bw + g) - 6}" y="${y - 34}" width="${(z - a) * (bw + g) + bw + 12}" height="${bh + 60}" rx="12" fill="color-mix(in srgb, var(--primary) 6%, var(--background))" stroke="color-mix(in srgb, var(--primary) 45%, var(--background))" stroke-dasharray="5 4"/>`;
        o += tx(a * (bw + g) + 4, y + bh + 19, 'THIS METHOD', 'i-cap');
        L.forEach((l, i) => { const x = i * (bw + g), on = st.at === i + 1, T = wrap(l.t, 15);
          if (i) o += `<path d="M${x - g + 2} ${y + bh / 2} H${x - 3}" class="i-arrow" marker-end="url(#fw-a1)"/>`;
          o += `<g class="i-pick" data-set="at" data-v="${i + 1}" role="button" tabindex="0"><title>${esc(l.t)}</title><rect x="${x}" y="${y}" width="${bw}" height="${bh}" rx="8" class="i-box" style="${l.side === 'out' ? 'stroke:var(--muted-foreground);stroke-dasharray:5 4;' : ''}${on ? 'stroke-width:2.6;fill:color-mix(in srgb, var(--primary) 13%, var(--background));' : ''}${l.side === 'half' && !on ? 'stroke-dasharray:9 3;' : ''}"/>
            ${T.map((t, j) => tx(x + bw / 2, y + bh / 2 - (T.length - 1) * 8 + j * 16 + 4, t, 'i-tb', 'middle')).join('')}</g>`;
          o += lines(x + bw / 2, y + bh + 44, l.own, 17, 'i-m', 'middle', 13);
          if (on) o += `<circle cx="${x + bw / 2}" cy="${y - 44}" r="7" class="i-hot"/><path d="M${x + bw / 2} ${y - 36} V${y - 4}" class="i-arrow" marker-end="url(#fw-a1)"/>`; });
        o += tx(0, 232, 'One event, followed from left to right. The shaded links are this method’s; the dashed ones belong to another model.', 'i-m');
        return svg(240, 'One event followed through six links, showing which links this method owns', o);
      },
      ctl: (st, E) => range('at', st, 1, E.links.length, 1, 'Follow one event') + `<span class="out" data-out="at"></span>`,
      out: { at: (st, E) => st.at + ' of ' + E.links.length },
      read(st, E) { const l = E.links[st.at - 1], tone = l.side === 'in' ? 'ok' : l.side === 'half' ? 'warn' : '';
        return `<span class="tag ${tone}">${l.side === 'in' ? 'Inside this method' : l.side === 'half' ? 'Shared with the consumer' : 'Outside: ' + esc(l.own)}</span> <b>${esc(l.t)}.</b> ${esc(l.ex)}${l.note ? `<small>${esc(l.note)}</small>` : ''}`; },
    },

    // What may each source be used for: a grid of sources against the five jobs
    permit: {
      init: (E) => ({ src: E.start[0], job: E.start[1] }),
      svg(st, E) {
        const J = E.jobs, R = E.sources, x0 = 290, cw = 94, y0 = 46, rh = 34; let o = '';
        J.forEach((j, c) => { o += tx(x0 + c * cw + cw / 2, 20, D.TAGS[j].n.split(' curve')[0].toUpperCase(), 'i-cap', 'middle'); });
        o += `<line x1="0" x2="${x0 + J.length * cw}" y1="30" y2="30" class="i-line"/>`;
        R.forEach((r, i) => { const y = y0 + i * rh, on = st.src === i;
          if (on) o += `<rect x="0" y="${y - 20}" width="${x0 + J.length * cw}" height="${rh - 2}" rx="6" class="i-soft"/>`;
          o += tx(8, y, r.name.length > 42 ? r.name.slice(0, 41) + '…' : r.name, on ? 'i-tb' : 'i-t');
          J.forEach((j, c) => { const may = r.may[j] != null, cx = x0 + c * cw + cw / 2, sel = on && st.job === c;
            o += `<g class="i-pick" data-set="src" data-v="${i}" data-set2="job" data-v2="${c}" role="button" tabindex="0"><title>${esc(r.name)} as a ${esc(D.TAGS[j].n.toLowerCase())}</title><rect x="${x0 + c * cw + 4}" y="${y - 20}" width="${cw - 8}" height="${rh - 2}" rx="6" fill="${sel ? 'color-mix(in srgb, var(--primary) 14%, var(--background))' : 'transparent'}" stroke="${sel ? 'var(--primary)' : 'transparent'}" stroke-width="1.6"/>
              <circle cx="${cx}" cy="${y - 4}" r="${may ? 7 : 5}" ${may ? 'class="i-acc"' : 'fill="var(--background)" stroke="var(--muted-foreground)" stroke-width="1.3" opacity=".55"'}/></g>`; }); });
        const yb = y0 + R.length * rh + 4;
        o += `<circle cx="8" cy="${yb}" r="6" class="i-acc"/>${tx(20, yb + 4, 'may be used for this', 'i-m')}<circle cx="170" cy="${yb}" r="5" fill="var(--background)" stroke="var(--muted-foreground)" stroke-width="1.3" opacity=".55"/>${tx(182, yb + 4, 'may not. Select any cell to see why.', 'i-m')}`;
        return svg(yb + 14, 'A grid of this example’s sources against the five jobs a source can do', o);
      },
      ctl: (st, E) => `<div class="row"><label for="c-src">Take this source</label><select class="tsel" id="c-src" data-k="src">${E.sources.map((r, i) => `<option value="${i}"${st.src === i ? ' selected' : ''}>${esc(r.name)}</option>`).join('')}</select></div>
        <div class="row"><label>and use it as a</label>${pickBtns('job', st, E.jobs.map((j) => D.TAGS[j].n))}</div>`,
      read(st, E) { const r = E.sources[st.src], j = E.jobs[st.job], may = r.may[j], own = Object.keys(r.may).map((k) => D.TAGS[k].n.toLowerCase());
        return may != null ? `<span class="tag ok">Yes</span> <b>${esc(r.name)}</b> may serve as a ${esc(D.TAGS[j].n.toLowerCase())}: ${esc(may)}<small>${esc(D.TAGS[j].d)} Grade of this use: ${esc(r.tier)} · ${esc(F.tiers[r.tier])}.</small>`
          : `<span class="tag gap">No</span> <b>${esc(r.name)}</b> may not serve as a ${esc(D.TAGS[j].n.toLowerCase())}. Its job here: ${esc(own.join(' and '))}.<small>What it does not support: ${esc(r.not)}</small>`; },
    },

    // Every part gets its own response and its own verdict: move the hazard and watch each part answer
    respond: {
      init: (E) => ({ x: E.axis.start }),
      svg(st, E) {
        const U = E.units, x0 = 250, w = 300, rh = 26, y0 = 34; let o = tx(0, 16, 'THE PART', 'i-cap') + tx(x0, 16, 'SHARE OF ITS OWN VALUE LOST', 'i-cap') + tx(760, 16, 'ITS ROLE IN THIS CELL', 'i-cap', 'end');
        U.forEach((u, i) => { const y = y0 + i * rh, v = u.f && !u.other ? evalF(u.f, st.x) : null, R = F.roles[u.role];
          o += tx(0, y + 13, u.name, u.role === 'primary' ? 'i-tb' : 'i-t');
          o += `<rect x="${x0}" y="${y + 3}" width="${w}" height="13" rx="3" class="i-soft"/>`;
          if (v != null && !Number.isNaN(v)) o += `<rect x="${x0}" y="${y + 3}" width="${(w * v).toFixed(1)}" height="13" rx="3" ${u.role === 'primary' ? 'class="i-acc"' : `fill="color-mix(in srgb, var(--primary) ${u.role === 'cond' ? 30 : 55}%, var(--background))"`}/>${tx(x0 + w + 8, y + 14, f2(v), 'i-num')}`;
          else o += tx(x0 + 8, y + 13.5, u.other || R.bar, 'i-m');
          o += tx(760, y + 14, R.n, 'i-m', 'end'); });
        const yb = y0 + U.length * rh + 14;
        o += tx(0, yb, E.caption, 'i-m');
        return svg(yb + 8, 'Each part of the asset and its own response to the same hazard intensity', o);
      },
      ctl(st, E) { const A = E.axis; return range('x', st, A.min, A.max, A.step, A.label) + `<span class="out" data-out="x"></span>`; },
      out: { x: (st, E) => E.axis.fmt(st.x) },
      read(st, E) { const vs = E.units.filter((u) => u.f && !u.other).map((u) => [u, evalF(u.f, st.x)]).filter(([, v]) => v > 0), kept = E.units.filter((u) => !u.f || u.other);
        const lo = Math.min(...vs.map(([, v]) => v)), hi = Math.max(...vs.map(([, v]) => v)), top = vs.find(([, v]) => v === hi);
        return (vs.length ? `At <b>${esc(E.axis.fmt(st.x))}</b>, ${vs.length} ${vs.length === 1 ? 'part answers' : 'parts answer'}${vs.length > 1 ? `, from ${f2(lo)} to ${f2(hi)}` : ': ' + f2(hi)} (${esc(top[0].name)}${vs.length > 1 ? ' highest' : ''}).` : `At <b>${esc(E.axis.fmt(st.x))}</b> no part is damaged.`)
          + ` ${kept.length ? kept.length + (kept.length === 1 ? ' part has' : ' parts have') + ' no bar and still a record: ' + esc(E.kept) : ''}<small>${esc(E.lesson)}</small>`; },
    },

    // From what the hazard source reports to what reaches the part. Three kinds, because the bridge differs by hazard
    bridge: {
      init: (E) => ({ ...E.start }),
      svg(st, E) { return ILL.bridge['svg_' + E.kind](st, E); },
      svg_height(st, E) {
        const gx = 20, gw = 420, gy = 214, k = 56, h = Math.max(0, st.wse - st.z), over = h > E.max, y = (m) => gy - m * k; let o = ARROW('fw-a3');
        o += `<rect x="${gx}" y="${y(st.wse)}" width="${gw}" height="${st.wse * k}" fill="#378ADD" opacity=".16"/><line x1="${gx}" x2="${gx + gw}" y1="${y(st.wse)}" y2="${y(st.wse)}" stroke="#378ADD" stroke-width="1.6"/>`;
        o += `<line x1="${gx - 10}" x2="${gx + gw + 10}" y1="${gy}" y2="${gy}" stroke="var(--foreground)" stroke-width="1.4" opacity=".6"/>${tx(gx + gw + 14, gy + 4, 'ground', 'i-m')}`;
        const bx = gx + 120, bw = 170; // the part on its plinth
        o += `<rect x="${bx - 14}" y="${y(st.z)}" width="${bw + 28}" height="${st.z * k}" class="i-grey"/><rect x="${bx}" y="${y(st.z) - 96}" width="${bw}" height="96" rx="4" class="i-box"/>${tx(bx + bw / 2, y(st.z) - 52, 'The part', 'i-tb', 'middle')}${tx(bx + bw / 2, y(st.z) - 36, E.part, 'i-m', 'middle')}`;
        if (h > 0) o += `<rect x="${bx}" y="${y(st.wse)}" width="${bw}" height="${Math.min(96, h * k)}" fill="#378ADD" opacity=".28"/>`;
        // brackets: water surface, the part's lowest critical point, and the depth that reaches the part
        const br = (x, a, b, t, cls) => `<path d="M${x - 5} ${y(a)} H${x + 5} M${x} ${y(a)} V${y(b)} M${x - 5} ${y(b)} H${x + 5}" stroke="${cls}" stroke-width="1.6" fill="none"/>`;
        o += br(gx + 40, 0, st.wse, '', '#378ADD') + tx(gx + 48, y(st.wse / 2) + 4, st.wse.toFixed(2) + ' m', 'i-num');
        o += br(bx + bw + 34, 0, st.z, '', 'var(--muted-foreground)') + tx(bx + bw + 42, y(st.z / 2) + 4, st.z.toFixed(2) + ' m', 'i-num');
        if (h > 0) o += br(bx + bw + 96, st.z, st.wse, '', '#F29E1F') + tx(bx + bw + 104, y(st.z + h / 2) + 4, h.toFixed(2) + ' m', 'i-num');
        const rx = 470, row = (yy, a, b, c, col) => `<rect x="${rx}" y="${yy - 11}" width="12" height="12" rx="2" fill="${col}"/>${tx(rx + 20, yy, a, 'i-tb')}${tx(760, yy, b, 'i-num', 'end')}${lines(rx + 20, yy + 15, c, 40)}`;
        o += row(40, 'Water surface', st.wse.toFixed(2) + ' m', 'What the hazard source reports', '#378ADD') + row(92, 'The part’s lowest critical point', st.z.toFixed(2) + ' m', 'From the site: a survey or drawings', 'color-mix(in srgb, var(--muted-foreground) 55%, transparent)')
          + row(144, 'Depth at the part', h.toFixed(2) + ' m', 'The axis: h = max(0, surface − critical point)', '#F29E1F');
        o += tx(rx, 196, over ? 'Past the valid range of 0 to ' + E.max + ' m: the cell clamps and warns.' : h === 0 ? 'The water has not reached the part: depth 0, damage 0.' : '', 'i-m');
        o += tx(0, 244, 'Both heights are yours to move. The cell takes the first from the hazard source and the second from the site.', 'i-m');
        return svg(252, 'Water surface, the part’s lowest critical point, and the depth between them that reaches the part', o);
      },
      svg_energy(st, E) {
        const m = E.mass(st.d), v = E.speed(st.d), e = 0.5 * (m / 1000) * v * v, e0 = E.energy(E.test), cx = 120, gy = 196, r = st.d * 0.95; let o = '';
        o += `<line x1="20" x2="250" y1="${gy}" y2="${gy}" class="i-axis"/><circle cx="${cx}" cy="${gy - r}" r="${r}" fill="color-mix(in srgb, #378ADD 16%, var(--background))" stroke="#378ADD" stroke-width="1.6"/>`;
        o += `<circle cx="${cx}" cy="${gy - E.test * 0.95}" r="${E.test * 0.95}" fill="none" stroke="var(--muted-foreground)" stroke-dasharray="4 4"/>${tx(cx, gy + 16, 'dashed: the ' + E.test + ' mm test ball', 'i-m', 'middle')}`;
        o += tx(cx, 16, 'A hailstone of ' + st.d + ' mm', 'i-tb', 'middle');
        const bx = 300, bw = 250, bar = (y, name, val, frac, gloss, cls) => `${tx(bx, y, name, 'i-tb')}${tx(760, y, val, 'i-num', 'end')}<rect x="${bx}" y="${y + 7}" width="${bw + 210}" height="10" rx="3" class="i-soft"/><rect x="${bx}" y="${y + 7}" width="${((bw + 210) * clamp(frac, 0, 1)).toFixed(1)}" height="10" rx="3" ${cls}/>${tx(bx, y + 33, gloss, 'i-m')}`;
        o += bar(30, 'Diameter', st.d + ' mm', st.d / 100, 'What radar and the lab both report: the axis', 'class="i-acc"');
        o += bar(86, 'Mass', m.toFixed(m < 10 ? 2 : 1) + ' g', m / E.mass(100), 'Grows with nearly the cube of the diameter', 'class="i-grey"');
        o += bar(142, 'Fall speed', v.toFixed(1) + ' m/s', v / E.speed(100), 'Grows with about the square root', 'class="i-grey"');
        o += bar(198, 'Impact energy', e.toFixed(e < 10 ? 2 : 1) + ' J', e / E.energy(100), (e / e0).toFixed(1) + ' × the energy of the ' + E.test + ' mm test. What breaks glass: the bridge, not the axis', 'class="i-hot"');
        o += tx(0, 250, 'Mass and speed are the dossier’s fit to the IEC 61215 test table; a stone falling straight down, no wind.', 'i-m');
        return svg(258, 'A hailstone’s diameter, and the mass, fall speed and impact energy that follow from it', o);
      },
      svg_chain(st, E) {
        const L = E.steps, n = L.length + 1, bw = 104, g = (760 - n * bw) / (n - 1), y = 50, bh = 62; let o = ARROW('fw-a4');
        o += `<rect x="0" y="${y}" width="${bw}" height="${bh}" rx="8" class="i-box" style="stroke-width:2.2;fill:color-mix(in srgb, var(--primary) 11%, var(--background))"/>${wrap(E.native, 14).map((t, j) => tx(bw / 2, y + 28 + j * 16, t, 'i-tb', 'middle')).join('')}${tx(bw / 2, y + bh + 18, 'as supplied', 'i-m', 'middle')}`;
        L.forEach((s, i) => { const x = (i + 1) * (bw + g), tried = st.k >= i + 1, T = wrap(s.t, 14);
          o += `<path d="M${x - g + 2} ${y + bh / 2} H${x - 3}" class="${tried ? 'i-bads' : 'i-arrow dash'}" ${tried ? '' : 'opacity=".4"'} marker-end="url(#fw-a4)"/>`;
          o += `<g class="i-pick" data-set="k" data-v="${i + 1}" role="button" tabindex="0"><title>${esc(s.t)}</title><rect x="${x}" y="${y}" width="${bw}" height="${bh}" rx="8" fill="${tried ? 'color-mix(in oklch, #d9675e 9%, var(--background))' : 'var(--background)'}" stroke="${tried ? '#c4544b' : 'var(--border)'}" stroke-width="1.4" stroke-dasharray="5 4"/>
            ${T.map((t, j) => tx(x + bw / 2, y + bh / 2 - (T.length - 1) * 8 + j * 16 + 4, t, 'i-t', 'middle')).join('')}</g>`;
          if (tried) o += `<path d="M${x + bw - 20} ${y + 8} l10 10 m0 -10 l-10 10" stroke="#c4544b" stroke-width="2" fill="none"/>${tx(x + bw / 2, y + bh + 18, 'would be invented', 'i-m', 'middle')}`; });
        o += tx(0, 20, st.k === 0 ? 'The class is used exactly as the hazard source supplies it. Nothing is converted.' : 'Every step to the right of the class needs a calibrated model of its own. None exists.', 'i-t');
        o += tx(0, 158, 'Move the control to try converting the class into a continuous measure, one step at a time.', 'i-m');
        return svg(166, 'The hazard class as supplied, and the five conversions that were rejected', o);
      },
      ctl(st, E) {
        if (E.kind === 'height') return `<div class="row">${range('wse', st, 0, 3, 0.05, 'Water surface above ground')}<span class="out" data-out="wse"></span></div><div class="row">${range('z', st, 0, 2, 0.05, 'The part’s lowest critical point')}<span class="out" data-out="z"></span></div>`;
        if (E.kind === 'energy') return range('d', st, 10, 100, 1, 'Hail diameter') + `<span class="out" data-out="d"></span>`;
        return range('k', st, 0, E.steps.length, 1, 'Convert the class how far?') + `<span class="out" data-out="k"></span>`;
      },
      out: { wse: (st) => st.wse.toFixed(2) + ' m', z: (st) => st.z.toFixed(2) + ' m', d: (st) => st.d + ' mm', k: (st, E) => (st.k === 0 ? 'not at all' : st.k + (st.k === 1 ? ' step' : ' steps')) },
      read(st, E) {
        if (E.kind === 'height') { const h = Math.max(0, st.wse - st.z), y = evalF(E.f, Math.min(h, E.max));
          return `The water stands at ${st.wse.toFixed(2)} m, the part’s lowest critical point at ${st.z.toFixed(2)} m, so the part sees <b>${h.toFixed(2)} m</b>. The ${esc(E.part.toLowerCase())} curve then reads <b>${f2(y)}</b>.<small>${esc(E.lesson)}</small>`; }
        if (E.kind === 'energy') { const e = E.energy(st.d);
          return `A ${st.d} mm stone carries <b>${e.toFixed(e < 10 ? 2 : 1)} J</b>, ${(e / E.energy(E.test)).toFixed(1)} times the ${E.test} mm test ball. The default curve at this size reads <b>${f2(evalF(E.f, st.d))}</b>.<small>${esc(E.lesson)}</small>`; }
        return st.k === 0 ? `<span class="tag ok">The cell’s choice</span> ${esc(E.chosen)}<small>${esc(E.lesson)}</small>` : `<span class="tag gap">Rejected</span> <b>${esc(E.steps[st.k - 1].t)}.</b> ${esc(E.steps[st.k - 1].why)}<small>${esc(E.lesson)}</small>`;
      },
    },

    // The shape a curve may claim grows with what pins it: five real curves, ordered by how much is measured
    ladder: {
      init: (E) => ({ r: E.start }),
      svg(st, E) {
        const R = F.ladder[st.r - 1], K = D.CASES[R.caseId], c = curveById(R.caseId, R.curve), A = K.axis, P = plot({ axis: A }), f = D.fn(c); let o = P.o;
        if (P.cat) o += stems(c.points, P) + c.points.slice(1).map(([i, v]) => tx(P.px(i), P.py(v) - 10, v, 'i-num', 'middle')).join('');
        else o += poly(f, P, A, 'i-accs' + (R.measured ? '' : ' dash'));
        (R.marks || []).forEach((m) => { const X0 = P.px(m.x), Y0 = P.py(m.y);
          o += m.tag === 'boundary' ? `<rect x="${X0 - 5.5}" y="${Y0 - 5.5}" width="11" height="11" transform="rotate(45 ${X0} ${Y0})" class="m-boundary"/>` : `<circle cx="${X0}" cy="${Y0}" r="6" class="m-data"/>`; });
        if (R.cap) o += `<line x1="${P.x}" x2="${P.x + P.w}" y1="${P.py(R.cap)}" y2="${P.py(R.cap)}" class="m-rule"/>`;
        if (R.shapeFrom != null) o += `<rect x="${P.px(R.shapeFrom)}" y="${P.y}" width="${P.x + P.w - P.px(R.shapeFrom)}" height="${P.h}" fill="#e0a030" opacity=".09"/>${tx(P.px(R.shapeFrom) + 6, P.y + 14, 'past the last', 'i-m')}${tx(P.px(R.shapeFrom) + 6, P.y + 28, 'measured point', 'i-m')}`;
        const rx = 520, cnt = (y, n, name, cls) => `${cls}${tx(rx + 22, y + 4, name, 'i-t')}${tx(760, y + 4, n, 'i-num', 'end')}`;
        o += tx(rx, 20, 'WHAT PINS IT', 'i-cap');
        o += cnt(42, R.measured, 'Measured points', `<circle cx="${rx + 7}" cy="42" r="6" class="m-data"/>`) + cnt(66, R.boundaries, 'Boundaries', `<rect x="${rx + 2}" y="61" width="10" height="10" transform="rotate(45 ${rx + 7} 66)" class="m-boundary"/>`) + cnt(90, R.rules, 'Rules', `<line x1="${rx}" x2="${rx + 14}" y1="90" y2="90" class="m-rule"/>`);
        o += `<line x1="${rx}" x2="760" y1="106" y2="106" class="i-line"/>` + tx(rx, 126, 'SO THE SHAPE MAY BE', 'i-cap') + lines(rx, 146, R.form, 34, 'i-tb', 'start', 16);
        o += lines(rx, 146 + wrap(R.form, 34).length * 16 + 4, R.curveName, 38);
        // the rungs
        const ry = 252, n = F.ladder.length;
        F.ladder.forEach((q, i) => { const x = 52 + (i / (n - 1)) * 440, on = i + 1 === st.r;
          o += `<g class="i-pick" data-set="r" data-v="${i + 1}" role="button" tabindex="0"><title>${esc(q.name)}</title><circle cx="${x}" cy="${ry}" r="${on ? 8 : 5.5}" ${on ? 'class="i-acc"' : 'fill="var(--background)" stroke="var(--muted-foreground)" stroke-width="1.4"'}/></g>${tx(x, ry + 22, q.short, on ? 'i-num' : 'i-m', 'middle')}${tx(x, ry + 36, q.measured + ' measured', 'i-m', 'middle')}`;
          if (i) o += `<line x1="${52 + ((i - 1) / (n - 1)) * 440 + 9}" x2="${x - 9}" y1="${ry}" y2="${ry}" class="i-axis" opacity=".5"/>`; });
        o += tx(540, ry + 4, 'Five curves of the library, by how', 'i-m') + tx(540, ry + 18, 'many measured points pin each', 'i-m');
        return svg(298, 'A real curve of the library, with what pins it and the shape that allows', o);
      },
      ctl: (st) => range('r', st, 1, F.ladder.length, 1, 'How much is measured?') + `<span class="out" data-out="r"></span>`,
      out: { r: (st) => F.ladder[st.r - 1].name },
      read(st) { const R = F.ladder[st.r - 1], T = D.TYPES[R.type];
        return `<span class="tag ${T.tone}">${esc(T.n)}</span> <b>${esc(R.name)}.</b> ${esc(R.says)}<small>${esc(T.d)}${R.caseId === X.caseId && R.curve === C().curves[0].id ? ' This is the example’s own curve.' : ''}</small>`; },
    },

    // Three kinds of thing change the answer, each in its own way: which curve, the state on the day, the value touched
    levers: {
      init: (E) => ({ sel: E.sel.start || 0, con: E.con.start || 0, flags: 0, exp: E.exp.start ?? 1 }),
      calc(st, E) {
        const K = C(), opt = E.sel.options[st.sel] || E.sel.options[0], c = curveById(X.caseId, opt.curve), base = D.fn(c);
        let f = base, xr = E.at;
        if (E.con.type === 'blend') { const p = c.params, alt = (x) => E.con.cap * (c.params.max_DR / (1 + Math.exp(-p.k_per_mm * (x - p.D50_mm - E.con.shift)))); f = (x) => st.con * alt(x) + (1 - st.con) * base(x); f.alt = alt; }
        if (E.con.type === 'shift') { xr = Math.max(0, E.at - st.con); }
        const dr = f(xr), share = E.exp.type === 'scale' ? st.exp : 1;
        return { K, c, base, f, xr, dr, d0: base(E.at), share, loss: dr * share };
      },
      svg(st, E) {
        const R = this.calc(st, E), A = R.K.axis, P = plot({ axis: A, w: 400 }); let o = P.o;
        if (P.cat) o += stems(R.c.points, P);
        else { E.sel.options.forEach((q, i) => { if (i !== st.sel && q.curve) o += poly(D.fn(curveById(X.caseId, q.curve)), P, A, 'nb0'); });
          if (E.con.type === 'blend') { o += poly(R.f.alt, P, A, 'nb1') ; if (st.con > 0 && st.con < 1) o += poly(R.base, P, A, 'nb0'); }
          o += poly(R.f, P, A, 'i-accs' + (C().type === 'engineered' ? ' dash' : '')); }
        const xq = P.px(R.xr), yq = P.py(R.dr);
        o += `<line x1="${xq}" x2="${xq}" y1="${P.py(0)}" y2="${yq}" stroke="var(--foreground)" stroke-dasharray="3 3"/><line x1="${P.x}" x2="${xq}" y1="${yq}" y2="${yq}" stroke="var(--foreground)" stroke-dasharray="3 3"/><circle cx="${xq}" cy="${yq}" r="6" fill="var(--background)" stroke="var(--foreground)" stroke-width="2.2"/>`;
        if (E.con.type === 'shift' && st.con > 0) o += `<circle cx="${P.px(E.at)}" cy="${P.py(R.d0)}" r="5" fill="var(--background)" stroke="var(--muted-foreground)" stroke-width="1.6"/><line x1="${P.px(E.at)}" x2="${P.px(E.at)}" y1="${P.py(0)}" y2="${P.py(R.d0) + 5}" stroke="var(--muted-foreground)" stroke-dasharray="3 3"/><path d="M${P.px(E.at)} ${P.py(0) - 7} H${xq + 4}" class="i-hots"/><path d="M${xq + 10} ${P.py(0) - 12} l-8 5 l8 5 Z" class="i-hot"/>`;
        // the three kinds, each beside what it moves
        const rx = 486, kind = (y, name, what, on, col) => `<rect x="${rx}" y="${y - 12}" width="4" height="40" rx="2" fill="${col}" opacity="${on ? 1 : 0.3}"/>${tx(rx + 12, y, name, 'i-tb')}${lines(rx + 12, y + 15, what, 44)}`;
        o += ARROW('fw-a5') + kind(28, E.sel.kindName, E.sel.does, E.sel.numeric, 'var(--primary)') + kind(86, E.con.kindName, E.con.does, E.con.numeric, '#F29E1F') + kind(144, E.exp.kindName, E.exp.does, E.exp.numeric, 'var(--muted-foreground)');
        // the value touched
        const vy = 204, vw = 262;
        o += `<rect x="${rx + 12}" y="${vy}" width="${vw}" height="14" rx="3" class="i-soft"/><rect x="${rx + 12}" y="${vy}" width="${(vw * R.share).toFixed(1)}" height="14" rx="3" class="i-grey"/><rect x="${rx + 12}" y="${vy}" width="${(vw * R.loss).toFixed(1)}" height="14" rx="3" class="i-acc"/>`;
        o += tx(rx + 12, vy + 30, 'The part’s value: touched (grey), lost (green)', 'i-m');
        o += tx(0, 250, E.caption, 'i-m');
        return svg(258, 'One curve and the three kinds of thing that change its answer', o);
      },
      ctl(st, E) {
        const row = (lab, body, note, off) => `<div class="row${off ? ' off' : ''}"><label>${esc(lab)}</label>${body}<small>${esc(note)}</small></div>`;
        const sel = E.sel.options.length > 1 ? pickBtns('sel', st, E.sel.options) : `<span class="tag">${esc(E.sel.options[0].name)}</span>`;
        const con = E.con.type === 'blend' || E.con.type === 'shift' ? `<input type="range" data-k="con" id="c-con" aria-label="${esc(E.con.label)}" min="0" max="${E.con.max}" step="${E.con.step}" value="${st.con}"><span class="out" data-out="con"></span>`
          : `<div class="chips">${E.con.items.map((t, i) => `<button data-flag="${i}" aria-pressed="${!!(st.flags & (1 << i))}">${esc(t)}</button>`).join('')}</div>`;
        const exp = E.exp.type === 'scale' ? `<input type="range" data-k="exp" id="c-exp" aria-label="${esc(E.exp.label)}" min="0" max="1" step="0.05" value="${st.exp}"><span class="out" data-out="exp"></span>` : `<span class="tag">${esc(E.exp.fixed)}</span>`;
        return row(E.sel.kindName + ' · ' + E.sel.label, sel, E.sel.note, !E.sel.numeric) + row(E.con.kindName + ' · ' + E.con.label, con, E.con.note, !E.con.numeric) + row(E.exp.kindName + ' · ' + E.exp.label, exp, E.exp.note, !E.exp.numeric);
      },
      out: { con: (st, E) => E.con.fmt(st.con), exp: (st) => Math.round(st.exp * 100) + '%' },
      read(st, E) { const R = this.calc(st, E), n = E.con.items ? [...Array(E.con.items.length)].filter((_, i) => st.flags & (1 << i)).length : 0;
        return `${esc(E.atText)}: the curve reads <b>${f2(R.dr)}</b>${Math.abs(R.dr - R.d0) > 5e-4 ? ` (${f2(R.d0)} before the ${esc(E.con.kindName.toLowerCase())})` : ''}${E.exp.type === 'scale' ? `, on ${Math.round(R.share * 100)}% of the part’s value: <b>${f2(R.loss)}</b> of it lost` : ''}.`
          + (E.con.items ? ` ${n ? n + (n === 1 ? ' state is' : ' states are') + ' switched on and the number has not moved: ' + esc(E.con.flagSays) : esc(E.con.flagAsk)}` : '') + `<small>${esc(E.lesson)}</small>`; },
    },

    // What the cell may say: put a request to it and see whether it answers, answers on a condition, or holds back
    counter: {
      init: (E) => ({ q: E.start }),
      svg(st, E) {
        const A = E.asks, rh = 30, y0 = 40, K = F.answers; let o = tx(0, 16, 'A CONSUMER ASKS FOR', 'i-cap') + tx(470, 16, 'THE CELL', 'i-cap');
        A.forEach((a, i) => { const y = y0 + i * rh, on = st.q === i, k = K[a.status];
          o += `<g class="i-pick" data-set="q" data-v="${i}" role="button" tabindex="0"><title>${esc(a.q)}</title><rect x="0" y="${y - 19}" width="760" height="${rh - 3}" rx="6" fill="${on ? 'color-mix(in srgb, var(--primary) 9%, var(--background))' : 'transparent'}" stroke="${on ? 'var(--primary)' : 'transparent'}" stroke-width="1.4"/>
            ${tx(10, y, a.q, on ? 'i-tb' : 'i-t')}${mark(a.status, 480, y - 5)}${tx(498, y, k.n, 'i-t')}</g>`; });
        const yb = y0 + A.length * rh + 6, cnt = Object.keys(K).map((s) => [s, A.filter((a) => a.status === s).length]).filter(([, n]) => n);
        o += `<line x1="0" x2="760" y1="${yb - 12}" y2="${yb - 12}" class="i-line"/>`;
        let xx = 0; cnt.forEach(([s, n]) => { o += mark(s, xx + 8, yb + 4) + tx(xx + 24, yb + 9, n + ' ' + K[s].n.toLowerCase(), 'i-m'); xx += 46 + (n + ' ' + K[s].n).length * 6.2; });
        return svg(yb + 20, 'Requests a consumer might make, and whether this cell answers, answers on a condition, or withholds', o);
        function mark(s, x, y) { return s === 'yes' ? `<circle cx="${x}" cy="${y}" r="6.5" class="i-acc"/>` : s === 'cond' ? `<circle cx="${x}" cy="${y}" r="6.5" fill="var(--background)" stroke="var(--primary)" stroke-width="2"/><path d="M${x} ${y - 6.5} a6.5 6.5 0 0 0 0 13 Z" class="i-acc"/>`
          : s === 'no' ? `<circle cx="${x}" cy="${y}" r="6.5" fill="var(--background)" stroke="#c4544b" stroke-width="2"/><path d="M${x - 3} ${y - 3} l6 6 m0 -6 l-6 6" stroke="#c4544b" stroke-width="1.8"/>` : `<circle cx="${x}" cy="${y}" r="6.5" fill="var(--background)" stroke="var(--muted-foreground)" stroke-width="1.6" stroke-dasharray="3 3"/>`; }
      },
      ctl: (st, E) => `<div class="row"><label for="c-q">Ask the cell for</label><select class="tsel" id="c-q" data-k="q">${E.asks.map((a, i) => `<option value="${i}"${st.q === i ? ' selected' : ''}>${esc(a.q)}</option>`).join('')}</select></div>`,
      read(st, E) { const a = E.asks[st.q], k = F.answers[a.status];
        return `<span class="tag ${k.tone}">${esc(k.n)}</span> <b>${esc(a.q)}.</b> ${esc(a.a)}${a.needs ? `<small>The consumer must bring: ${esc(a.needs.join(' · '))}</small>` : ''}${a.flags ? `<small>Travels with the answer: ${a.flags.map((f) => `<code>${esc(f)}</code>`).join(' ')}</small>` : ''}`; },
    },

    // The release: this cell's own history. Pick a release and see what moved and what a consumer had to do
    history: {
      init: (E) => ({ e: E.start }),
      svg(st, E) {
        const H = E.entries, n = H.length, x0 = 70, x1 = 450, y = 74, xs = (i) => (n === 1 ? x0 : x0 + (i / (n - 1)) * (x1 - x0)); let o = `<line x1="${x0 - 30}" x2="${x1 + 30}" y1="${y}" y2="${y}" class="i-axis"/>`;
        H.forEach((h, i) => { const x = xs(i), on = st.e === i, cur = h.pin === E.current;
          o += `<g class="i-pick" data-set="e" data-v="${i}" role="button" tabindex="0"><title>${esc(h.pin)}</title><circle cx="${x}" cy="${y}" r="${on ? 11 : 8}" ${h.artifact ? `class="i-acc"` : 'fill="var(--background)" stroke="var(--muted-foreground)" stroke-width="1.6" stroke-dasharray="3 3"'} ${on ? 'stroke="var(--foreground)" stroke-width="2.4"' : ''}/></g>`;
          o += tx(x, y - 34, h.model, on ? 'i-tb' : 'i-t', 'middle') + tx(x, y - 19, h.docs, on ? 'i-tb' : 'i-m', 'middle') + tx(x, y + 28, h.date, 'i-m', 'middle');
          if (cur) o += `<path d="M${x - 26} ${y + 38} H${x + 26}" stroke="var(--primary)" stroke-width="2.4"/>${tx(x, y + 54, 'consumers pin this', 'i-num', 'middle')}`; });
        const h = H[st.e], rx = 540, lamp = (yy, name, yes, say) => `<circle cx="${rx + 7}" cy="${yy - 4}" r="6.5" ${yes ? 'class="i-hot"' : 'fill="var(--background)" stroke="var(--muted-foreground)" stroke-width="1.5"'}/>${tx(rx + 22, yy, name, 'i-t')}${tx(760, yy, yes ? 'yes' : 'no', 'i-num', 'end')}`;
        o += tx(rx, 20, 'IN THIS RELEASE', 'i-cap') + lamp(46, 'The answer changed', h.behavior) + lamp(72, 'The contract changed', h.contract) + lamp(98, 'A runtime file published', h.artifact);
        o += `<circle cx="14" cy="150" r="7" class="i-acc"/>${tx(28, 154, 'published a runtime file', 'i-m')}<circle cx="190" cy="150" r="7" fill="var(--background)" stroke="var(--muted-foreground)" stroke-width="1.6" stroke-dasharray="3 3"/>${tx(204, 154, 'documents only; nothing for a consumer to load', 'i-m')}`;
        o += tx(0, 176, 'This cell’s own releases, oldest on the left, from its changelog. The answer changes only when the model version does.', 'i-m');
        return svg(184, 'This cell’s releases in order, showing which changed the answer, the contract, or only the documents', o);
      },
      ctl: (st, E) => `<div class="row"><label>Pick a release</label>${pickBtns('e', st, E.entries.map((h) => h.model.replace('model ', '') + ' · ' + h.docs.replace('docs ', '')))}</div>`,
      read(st, E) { const h = E.entries[st.e];
        return `<code>${esc(h.pin)}</code> · ${esc(h.date)}. ${esc(h.summary)}<small>What a consumer does: ${esc(h.action)}</small>`; },
    },
  };

  // ---- the page
  function spark(K) {
    const A = K.curves[0], f = D.fn(A), W = 76, H = 30, n = 40;
    if (K.axis.kind === 'cat') return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" aria-hidden="true">${A.points.slice(1).map(([i, y]) => `<circle cx="${6 + (i - 1) * 12.8}" cy="${H - 3 - y * (H - 6)}" r="2.6" class="sp-dot"/>`).join('')}</svg>`;
    return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" aria-hidden="true"><polyline points="${Array.from({ length: n + 1 }, (_, i) => { const x = K.axis.min + ((K.axis.max - K.axis.min) * i) / n; return (2 + (i / n) * (W - 4)).toFixed(1) + ',' + (H - 3 - f(x) * (H - 6)).toFixed(1); }).join(' ')}" class="sp-line${K.type === 'engineered' ? ' dash' : ''}"/></svg>`;
  }
  const derivHref = (st) => `index.html?case=${encodeURIComponent(X.caseId)}&stage=${st.deriv}`;
  const ill = () => { const st = F.stages[S.stage], E = X.stages[st.id].ill, K = ILL[st.ill], key = S.ex + '/' + st.id; if (!S.is[key]) S.is[key] = K.init(E); return { st, E, K, s: S.is[key] }; };

  function head() {
    return `<section class="hero"><div><h1>${esc(F.title)}</h1><p class="lede">${esc(F.lede)}</p>
        <p class="produces"><b>What it produces.</b> ${esc(F.produces)}</p></div>
      <div><div class="ph">The example carried through</div><div class="cases" role="group" aria-label="Example">${Object.keys(F.examples).map((k) => { const e = F.examples[k], K = D.CASES[e.caseId], t = D.TYPES[K.type];
        return `<button data-ex="${k}" aria-pressed="${k === S.ex}">${spark(K)}<span><b>${esc(e.label)}</b><small>${esc(e.sub)}</small></span><span class="tag ${t.tone}">${esc(t.n)}</span></button>`; }).join('')}</div></div></section>`;
  }
  function map() {
    const node = (id) => { const s = stageOf(id), fk = forksAt(id), i = F.stages.indexOf(s);
      return `<button class="node" data-stage="${i}" aria-current="${i === S.stage}"><span class="nn"><i>${i + 1}</i>${esc(other(s))}</span><b>${esc(lead(s))}</b><span class="q">${esc(s.ask)}</span><span class="res">${esc(X.stages[id].m)}</span>
        <span class="fk" title="${esc(fk.length + ' cases where this decision comes out differently: ' + tally(fk))}">${dots(fk)}</span></button>`; };
    return `<section><div class="ph">The whole method on one screen · select a decision</div>
      <div class="map">${F.acts.map((a) => `<div class="act"><span>${esc(a.label)}</span><div>${a.stages.map(node).join('')}</div></div>`).join('')}</div>
      <p class="key">Each dot is a case where that decision comes out differently: <i class="dot d-handled"></i>${esc(STATUS.handled[0].toLowerCase())} <i class="dot d-unclear"></i>${esc(STATUS.unclear[0].toLowerCase())} <i class="dot d-open"></i>${esc(STATUS.open[0].toLowerCase())}. <a href="#found" data-goto="found">What they add up to ↓</a></p>
      <div class="under"><div><div class="ph">Rules that hold at every decision</div><div class="chips">${F.rules.map((r, i) => `<button data-rule="${i}" aria-pressed="${i === S.rule}">${esc(r.short)}</button>`).join('')}</div><p class="said" id="rule"></p></div>
        <div><div class="ph">Outside this method, and who answers it</div><div class="chips">${F.outside.map((r, i) => `<button data-out-i="${i}" aria-pressed="${i === S.out}">${esc(r.short)}</button>`).join('')}</div><p class="said" id="out"></p></div></div></section>`;
  }
  const said = () => { const r = F.rules[S.rule], o = F.outside[S.out]; $('rule').innerHTML = `${esc(r.text)}<small>${esc(r.src)}</small>`; $('out').innerHTML = `<b>${esc(o.owner)}.</b> ${esc(o.text)}<small>${esc(o.src)}</small>`; };
  // A case where a decision comes out differently: one line (the case, its gist, its status) that opens to the detail
  const dots = (fk) => `<span class="dots">${['open', 'unclear', 'handled'].flatMap((k) => fk.filter((f) => f.status === k).map(() => `<i class="dot d-${k}"></i>`)).join('')}</span>`;
  const tally = (fk) => ['handled', 'unclear', 'open'].map((k) => [fk.filter((f) => f.status === k).length, STATUS[k][2]]).filter(([n]) => n).map(([n, t]) => n + ' ' + t).join(' · ');
  function fork(f, inList) {
    const [n, tone] = STATUS[f.status];
    return `<details class="fk-row"${inList ? '' : ` id="fork-${f.id}"`}${!inList && S.openFork === f.id ? ' open' : ''}><summary><i class="dot d-${f.status}"></i><span class="fq"><b>${esc(f.q)}</b><em>${esc(f.gist)}</em></span><span class="tag ${tone}">${n}</span></summary>
      <div class="fk-body"><div class="br">${f.branches.map((b) => `<div class="${b.cells && b.cells.includes(X.cell) ? 'me' : ''}">${esc(b.t)}${b.cells && b.cells.length ? ' <code>' + b.cells.map(esc).join(' · ') + '</code>' : b.none ? ' <code>no cell yet</code>' : ''}</div>`).join('')}</div>
        <p class="why">${esc(f.note)}</p><p>Where it is written: ${esc(f.src)}</p></div></details>`;
  }
  function walk() {
    const { st, E, K, s } = ill(), ex = X.stages[st.id], fk = forksAt(st.id), i = S.stage, n = F.stages.length;
    return `<section id="walk"><div class="ph">The decisions, one at a time</div>
      <div class="rail" role="tablist" aria-label="Decision">${F.stages.map((q, j) => `<button role="tab" aria-selected="${j === i}" data-stage="${j}"><i>${j + 1}</i>${esc(lead(q))}</button>`).join('')}</div>
      <div class="stage"><div class="panel ill"><h3>${esc(st.idea)}</h3><p class="idea">${esc(st.how)}</p><span class="hint">The picture scrolls sideways.</span><div id="ill-svg">${K.svg(s, E)}</div><div class="ctl" id="ill-ctl">${K.ctl(s, E)}</div><div class="reads" id="ill-read">${K.read(s, E)}</div><p class="srcline">${esc(ex.src)}</p></div>
        <div class="panel side"><div class="dq">Decision ${i + 1} of ${n} · ${esc(other(st))}</div><h2>${esc(lead(st))}</h2><p class="ask">${esc(st.ask)}</p><p class="ins">In the framework’s own words: “${esc(st.own)}”</p>
          <div class="io"><div><span>Takes</span>${esc(st.takes)}</div><div><span>Gives</span>${esc(st.gives)}</div></div>
          <div class="here"><span>${esc(X.label)} · ${esc(X.sub)}</span><p>${esc(ex.a)}</p>${ex.points ? `<ul>${ex.points.map((p) => `<li>${esc(p)}</li>`).join('')}</ul>` : ''}</div>
          <a class="golink" href="${derivHref(st)}">${esc(st.derivText)} ↗</a>${st.seeMarks && F.marks ? `<a class="golink" href="#marks" data-goto="marks">${esc(F.marks.title)}, explained ↓</a>` : ''}
          <div class="steps"><button class="step" data-stage="${Math.max(0, i - 1)}" data-stay${i ? '' : ' disabled'}>← ${i ? esc(lead(F.stages[i - 1])) : 'Back'}</button><button class="step" data-stage="${Math.min(n - 1, i + 1)}" data-stay${i < n - 1 ? '' : ' disabled'}>${i < n - 1 ? esc(lead(F.stages[i + 1])) : 'Next'} →</button></div></div></div>
      <div class="forks"><div class="ph">Where this decision gets hard</div><p class="sub">${fk.length} ${fk.length === 1 ? 'case makes' : 'cases make'} this decision come out differently: ${esc(tally(fk))}. Open one to see how real cells answer it.</p><div class="fk-list">${fk.map((f) => fork(f)).join('')}</div></div></section>`;
  }
  // ---- the five things drawn on a curve (a framework's own marks, if it has any): one picture with all of them,
  // and for the one selected: the question it answers, what it can and cannot do, and what this example has
  const markIds = () => (F.marks ? [...F.marks.order, F.marks.result.id] : []), markInfo = (k) => (k === F.marks.result.id ? F.marks.result : D.TAGS[k]);
  function marksSvg() {
    const M = F.marks, T = D.TAGS, sel = S.mark, R = M.result, x0 = 64, y0 = 30, w = 420, h = 176, px = (u) => x0 + u * w, py = (v) => y0 + (1 - v) * h;
    const f = (u) => 0.9 / (1 + Math.exp(-11 * (u - 0.52))), ref = (u) => 1 / (1 + Math.exp(-9 * (u - 0.74)));
    const path = (fn) => Array.from({ length: 81 }, (_, i) => px(i / 80).toFixed(1) + ',' + py(fn(i / 80)).toFixed(1)).join(' ');
    const g = (k, body) => `<g class="i-pick" data-mark="${k}" role="button" tabindex="0" opacity="${sel === k ? 1 : 0.42}"><title>${esc(T[k].n)}</title>${body}</g>`;
    const lab = (k, x, y, a = 'start') => M.on[k].split('|').map((t, i) => tx(x, y + i * 13, t, sel === k ? 'i-num' : 'i-m', a)).join('');
    let o = ARROW('fw-a9') + tx(x0, y0 - 10, 'Share of the part’s value lost', 'i-m') + `<path d="M${x0} ${y0} V${y0 + h}" class="i-axis"/>`;
    [0.25, 0.5, 0.75].forEach((v) => { o += `<line x1="${x0}" x2="${x0 + w}" y1="${py(v)}" y2="${py(v)}" class="i-grid"/>`; });
    // reference curve, rule, the adopted curve, boundary, data points, and the bridge under the axis
    o += g('reference', `<polyline points="${path(ref)}" fill="none" stroke="#8a8f98" stroke-width="${sel === 'reference' ? 2.4 : 1.6}"/>${lab('reference', px(0.8) + 10, py(0.34))}`);
    o += g('rule', `<line x1="${x0}" x2="${x0 + w}" y1="${py(0.9)}" y2="${py(0.9)}" class="m-rule" style="stroke-width:${sel === 'rule' ? 2.4 : 1.6}"/>${lab('rule', x0 + 8, py(0.9) - 7)}`);
    o += `<g class="i-pick" data-mark="${R.id}" role="button" tabindex="0"><title>${esc(R.n)}</title><polyline points="${path(f)}" fill="none" stroke="transparent" stroke-width="16"/><polyline points="${path(f)}" class="i-accs" style="stroke-width:${sel === R.id ? 4 : 2.6}"/></g>`;
    const bx = px(0.2), by = py(f(0.2));
    o += g('boundary', `<rect x="${bx - 6.5}" y="${by - 6.5}" width="13" height="13" transform="rotate(45 ${bx} ${by})" class="m-boundary"/>${lab('boundary', bx, by - 16, 'middle')}`);
    o += g('data', [0.47, 0.6].map((u) => `<circle cx="${px(u)}" cy="${py(f(u))}" r="6.5" class="m-data"/>`).join('') + lab('data', px(0.6) - 13, py(f(0.6)) - 1, 'end'));
    const ay = y0 + h, ky = ay + 22;
    o += g('bridge', `<line x1="${x0}" x2="${x0 + w}" y1="${ay}" y2="${ay}" stroke="${sel === 'bridge' ? 'var(--primary)' : 'var(--muted-foreground)'}" stroke-width="${sel === 'bridge' ? 3 : 1.4}"/>
      <rect x="${x0}" y="${ky}" width="150" height="30" rx="7" class="i-box" style="stroke:var(--muted-foreground);stroke-dasharray:5 4"/>${tx(x0 + 75, ky + 19, 'The hazard, as reported', 'i-t', 'middle')}
      <path d="M${x0 + 154} ${ky + 15} H${x0 + w - 176}" class="i-arrow" marker-end="url(#fw-a9)"/>${tx(x0 + (w - 20) / 2, ky + 10, 'the bridge', sel === 'bridge' ? 'i-num' : 'i-m', 'middle')}
      <rect x="${x0 + w - 172}" y="${ky}" width="172" height="30" rx="7" class="i-box"/>${tx(x0 + w - 86, ky + 19, 'What reaches the part: the axis', 'i-t', 'middle')}`);
    // the key: each a bold name and a grey gloss, and each a way in
    const rx = 524, glyph = { bridge: (y) => `<path d="M${rx} ${y} H${rx + 16}" class="i-arrow" marker-end="url(#fw-a9)"/>`, boundary: (y) => `<rect x="${rx + 3}" y="${y - 5}" width="10" height="10" transform="rotate(45 ${rx + 8} ${y})" class="m-boundary"/>`,
      data: (y) => `<circle cx="${rx + 8}" cy="${y}" r="6" class="m-data"/>`, reference: (y) => `<line x1="${rx}" x2="${rx + 16}" y1="${y}" y2="${y}" stroke="#8a8f98" stroke-width="2"/>`, rule: (y) => `<line x1="${rx}" x2="${rx + 16}" y1="${y}" y2="${y}" class="m-rule"/>` };
    M.order.forEach((k, i) => { const y = 34 + i * 40;
      o += `<g class="i-pick" data-mark="${k}" role="button" tabindex="0"><title>${esc(T[k].n)}</title><rect x="${rx - 10}" y="${y - 17}" width="${760 - rx + 10}" height="36" rx="7" fill="${sel === k ? 'color-mix(in srgb, var(--primary) 9%, var(--background))' : 'transparent'}" stroke="${sel === k ? 'var(--primary)' : 'transparent'}" stroke-width="1.4"/>
        ${glyph[k](y - 2)}${tx(rx + 26, y - 1, T[k].n, 'i-tb')}${tx(rx + 26, y + 13, M.gloss[k], 'i-m')}</g>`; });
    const ly = 34 + M.order.length * 40;
    o += `<g class="i-pick" data-mark="${R.id}" role="button" tabindex="0"><title>${esc(R.n)}</title><rect x="${rx - 10}" y="${ly - 17}" width="${760 - rx + 10}" height="36" rx="7" fill="${sel === R.id ? 'color-mix(in srgb, var(--primary) 9%, var(--background))' : 'transparent'}" stroke="${sel === R.id ? 'var(--primary)' : 'transparent'}" stroke-width="1.4"/>
      <line x1="${rx}" x2="${rx + 16}" y1="${ly - 2}" y2="${ly - 2}" stroke="var(--primary)" stroke-width="2.6"/>${tx(rx + 26, ly - 1, R.n, 'i-tb')}${tx(rx + 26, ly + 13, R.gloss, 'i-m')}</g>`;
    o += tx(0, 284, M.caption, 'i-m');
    return svg(292, 'A schematic damage curve with the five things that can be drawn on it: a bridge under the axis, a boundary, data points, a reference curve and a rule', o);
  }
  function marksHas(k) {
    const K = C(); if (k === 'bridge') return X.stages.axis ? X.stages.axis.a : '';
    if (k === F.marks.result.id) return K.curves[0].name + '. ' + D.TYPES[K.type].n + (K.pinnedBy ? ': pinned by ' + K.pinnedBy.charAt(0).toLowerCase() + K.pinnedBy.slice(1) : '') + '.' + (K.notFor ? ' Not for: ' + K.notFor.charAt(0).toLowerCase() + K.notFor.slice(1) + '.' : '');
    const got = K.marks.filter((m) => m.tag === k).map((m) => m.label.replace(/^Rule: /, ''));
    return got.length ? got.join('; ').replace(/^./, (c) => c.toUpperCase()) + '.' + (k === 'rule' && K.rules ? ' One of ' + K.rules.length + ' rules that set this table.' : '') : 'None. ' + ((K.empty || {})[k] || '');
  }
  // A tag may carry a plain-words clarification (curve-derivations.js, TAGS[k].clear): three sentences and a quick
  // test up front; the everyday picture, how it looks in each cell and the framework's own name open below
  const clearTop = (t) => (t.clear ? `<ol class="clr">${t.clear.plain.map((x) => `<li>${esc(x)}</li>`).join('')}</ol><p class="clr-t"><b>A quick test.</b> ${esc(t.clear.test)}</p>` : '');
  const clearMore = (t) => (t.clear ? `<details class="clr-d"><summary>An everyday picture</summary><p>${esc(t.clear.everyday)}</p></details>
        <details class="clr-d"><summary>It looks different in every cell</summary>${t.clear.cases.map(([id, what, how]) => `<p><b>${esc(D.CASES[id].title)}.</b> ${esc(what)} <i>${esc(how)}</i></p>`).join('')}</details>
        <p class="ins">${esc(t.clear.alias)}</p>` : '');
  function clearArt(P) {
    const bx = (x, y, [t, sub], on) => `<rect x="${x}" y="${y}" width="210" height="54" rx="8" class="i-box"${on ? ' style="fill:color-mix(in srgb, var(--primary) 10%, var(--background));stroke:var(--primary);stroke-width:2"' : ''}/>${tx(x + 105, y + 23, t, 'i-tb', 'middle')}${tx(x + 105, y + 41, sub, 'i-m', 'middle')}`;
    return svg(190, P.from.join(': ') + '. ' + P.step.join(': ') + '. ' + P.to.join(': ') + '. ' + P.then.join(' ') + '.', ARROW('fw-a10') + tx(125, 14, P.caps[0].toUpperCase(), 'i-cap', 'middle') + tx(635, 14, P.caps[1].toUpperCase(), 'i-cap', 'middle') +
      bx(20, 24, P.from) + `<path d="M232 51 H270" class="i-arrow" marker-end="url(#fw-a10)"/>` + bx(275, 24, P.step, true) + `<path d="M487 51 H525" class="i-arrow" marker-end="url(#fw-a10)"/>` + bx(530, 24, P.to) +
      `<path d="M635 80 V122" class="i-arrow" marker-end="url(#fw-a10)"/>` + bx(530, 126, P.then));
  }
  const clearTry = (k, t) => { const c = t.clear, y = c && c.try; return c ? `<div class="clr-try"><h3>${esc(t.n)}: ${esc(c.title.charAt(0).toLowerCase() + c.title.slice(1))}</h3><div id="clr-art">${clearArt(c.picture)}</div>
        ${y ? `<div class="ctl"><div class="row"><label for="clr-x">Try it · ${esc(y.label.toLowerCase())}</label><input type="range" id="clr-x" data-mk="${k}" min="${y.min}" max="${y.max}" step="${y.step}" value="${y.start}"><b id="clr-v">${y.start.toFixed(y.dp)} ${esc(y.unit)}</b></div></div>` : ''}</div>` : ''; };
  function marksInner() {
    const M = F.marks, k = S.mark, t = markInfo(k), st = stageOf(M.stage[k]), n = F.stages.indexOf(st) + 1;
    return `<div class="ph">${esc(M.title)}</div><div class="stage"><div class="panel ill"><h3>${esc(M.title)}</h3><p class="idea">${esc(M.lede)}</p><span class="hint">The picture scrolls sideways.</span>
        <div id="mk-svg">${marksSvg()}</div><div class="ctl"><div class="row"><label>Select one</label><div class="chips">${markIds().map((id) => `<button data-mark="${id}" aria-pressed="${id === k}">${esc(markInfo(id).n)}</button>`).join('')}</div></div></div>${clearTry(k, t)}</div>
      <div class="panel side"><div class="dq">${k === M.result.id ? 'What the five add up to' : 'One of the five'} · settled at decision ${n}, ${esc(lead(st).toLowerCase())}</div><h2>${esc(t.n)}</h2><p class="ask">${esc(t.q || t.d)}</p>${clearTop(t)}
        ${t.can ? `<div class="io"><div><span>It can</span>${esc(t.can)}</div><div><span>It cannot</span>${esc(t.cannot)}</div></div>` : ''}${t.eg ? `<p class="ins">For example: ${esc(t.eg)}</p>` : ''}${clearMore(t)}
        <div class="here"><span>${esc(X.label)} · ${esc(X.sub)}</span><p>${esc(marksHas(k))}</p></div>
        <a class="golink" href="#walk" data-stage="${n - 1}">Where it is settled: decision ${n}, ${esc(lead(st).toLowerCase())} ↑</a><a class="golink" href="${derivHref(stageOf('form'))}">See what this curve has, drawn on its chart ↗</a></div></div>`;
  }
  const marksSection = () => (F.marks ? `<section id="marks">${marksInner()}</section>` : '');

  // What drawing the method found: the three that matter, a tally by decision, and the full list behind one control
  function allForks() {
    const n = (k) => F.forks.filter((f) => f.status === k).length, show = (f) => S.filter === 'all' || f.status === S.filter;
    return `<section class="all-forks" id="found"><div class="ph">What drawing the method found</div>
      <p class="lead">Drawing the method on real cells turned up <b>${F.forks.length} cases</b> where a decision comes out differently. ${n('handled')} are settled by a written rule, ${n('unclear')} are answered more than one way, and ${n('open')} are not covered yet. Three matter most.</p>
      <div class="top3">${F.top.map((t, i) => { const f = F.forks.find((x) => x.id === t.forks[0]), st = stageOf(f.stage), j = F.stages.indexOf(st);
        return `<article><span class="n">${i + 1}</span><b>${esc(t.t)}</b><p>${esc(t.d)}</p><a href="#walk" data-stage="${j}" data-fork="${f.id}">See it at decision ${j + 1}, ${esc(lead(st).toLowerCase())} ↑</a></article>`; }).join('')}</div>
      <div class="tally">${F.stages.map((st, j) => { const fk = forksAt(st.id); return `<button data-stage="${j}"><i>${j + 1}</i><b>${esc(lead(st))}</b>${dots(fk)}<span>${esc(tally(fk))}</span></button>`; }).join('')}</div>
      <p class="key"><i class="dot d-handled"></i>${esc(STATUS.handled[0])}: a written rule, and cells that follow it <i class="dot d-unclear"></i>${esc(STATUS.unclear[0])}: by the cells or by the documents <i class="dot d-open"></i>${esc(STATUS.open[0])}: no released cell handles it. These three readings are this page’s, for the owner to confirm.</p>
      <details class="allrows"${S.showAll ? ' open' : ''}><summary>All ${F.forks.length} cases, one line each</summary>
        <div class="flt"><div class="seg" role="group" aria-label="Show">${[['all', 'All ' + F.forks.length], ['open', STATUS.open[0] + ' ' + n('open')], ['unclear', STATUS.unclear[0] + ' ' + n('unclear')], ['handled', STATUS.handled[0] + ' ' + n('handled')]].map(([k, t]) => `<button data-filter="${k}" aria-pressed="${S.filter === k}">${esc(t)}</button>`).join('')}</div></div>
        ${F.stages.map((st, j) => { const fk = forksAt(st.id).filter(show); return fk.length ? `<h3>${j + 1} · ${esc(lead(st))}</h3><div class="fk-list">${fk.map((f) => fork(f, true)).join('')}</div>` : ''; }).join('')}</details></section>`;
  }
  function words() {
    return `<section><div class="ph">The words · plain first, the framework’s term beside it</div><div class="panel tw"><table class="words"><thead><tr><th>Plain words</th><th>The framework’s term</th><th>What it means</th><th>Renaming it</th></tr></thead><tbody>
      ${F.vocab.map((v) => `<tr><td>${esc(v.plain)}</td><td>${esc(v.term)}</td><td>${esc(v.means)}</td><td><span class="tag ${v.safe === 'safe' ? 'ok' : v.safe === 'keep' ? '' : 'warn'}">${esc(F.safety[v.safe])}</span></td></tr>`).join('')}</tbody></table></div>
      <p class="sub" style="margin-top:8px">The plain labels are a proposal, not a ruling: <code>docs/extra/discussions/framework_section/02_damage_framework_edge_cases_and_names.md</code>. The switch at the top right puts either set of words first across the page.</p></section>`;
  }
  const foot = () => `<section class="foot"><span>${F.sources.map((s) => esc(s)).join(' ')}</span><span>The method applied to one curve: <a href="index.html?case=${encodeURIComponent(X.caseId)}">${esc(X.label)} on Failure and Recovery ↗</a>. Coming to this section: ${F.next.map(esc).join(' · ')}.</span></section>`;

  function render() { X = F.examples[S.ex]; $('fw').innerHTML = head() + map() + walk() + marksSection() + allForks() + words() + foot(); said(); outs(); }
  function outs() { const { E, K, s } = ill(); document.querySelectorAll('#ill-ctl [data-out]').forEach((el) => { const fn = K.out && K.out[el.dataset.out]; if (fn) el.textContent = fn(s, E); }); }
  function paint(ctl) { const { E, K, s } = ill(); $('ill-svg').innerHTML = K.svg(s, E); $('ill-read').innerHTML = K.read(s, E); if (ctl) $('ill-ctl').innerHTML = K.ctl(s, E); outs(); }
  function sync() { const u = new URL(location.href); u.search = 'framework=' + S.fw + '&example=' + S.ex + '&stage=' + (S.stage + 1) + (S.markOn ? '&mark=' + S.mark : ''); history.replaceState(null, '', u); }
  function go(i, scroll) { S.stage = clamp(i, 0, F.stages.length - 1); sync(); render(); const f = S.openFork && $('fork-' + S.openFork); S.openFork = ''; if (f) f.scrollIntoView({ behavior: 'smooth', block: 'center' }); else if (scroll) $('walk').scrollIntoView({ behavior: 'smooth', block: 'start' }); }

  function start() {
    D = window.CurveDerivations; const all = window.Frameworks, q = new URLSearchParams(location.search);
    S.fw = all[q.get('framework')] ? q.get('framework') : Object.keys(all)[0]; F = all[S.fw];
    S.ex = F.examples[q.get('example')] ? q.get('example') : Object.keys(F.examples)[0];
    const n = Number(q.get('stage')); S.stage = n >= 1 && n <= F.stages.length ? n - 1 : 0;
    const setMarks = () => { S.markOn = markIds().includes(q.get('mark')); S.mark = S.markOn ? q.get('mark') : F.marks ? F.marks.order[0] : ''; }; setMarks();
    const sel = $('fwsel'); sel.innerHTML = Object.keys(all).map((k) => `<option value="${k}"${k === S.fw ? ' selected' : ''}>${esc(all[k].name)}</option>`).join('') + F.next.map((t) => `<option disabled>${esc(t)} (not built)</option>`).join('');
    sel.onchange = () => { S.fw = sel.value; F = all[S.fw]; S.ex = Object.keys(F.examples)[0]; S.stage = 0; S.markOn = false; S.mark = F.marks ? F.marks.order[0] : ''; sync(); render(); };
    document.querySelectorAll('[data-words]').forEach((b) => b.addEventListener('click', () => { S.words = b.dataset.words; document.querySelectorAll('[data-words]').forEach((x) => x.setAttribute('aria-pressed', String(x === b))); render(); }));
    const el = $('fw');
    el.addEventListener('click', (e) => {
      const t = e.target, by = (sel) => t.closest(sel);
      let b;
      if ((b = by('[data-ex]'))) { S.ex = b.dataset.ex; sync(); return render(); }
      if ((b = by('[data-mark]'))) { S.mark = b.dataset.mark; S.markOn = true; sync(); $('marks').innerHTML = marksInner(); return; }
      if ((b = by('[data-goto]'))) { e.preventDefault(); return $(b.dataset.goto).scrollIntoView({ behavior: 'smooth', block: 'start' }); }
      if ((b = by('[data-stage]'))) { e.preventDefault(); S.openFork = b.dataset.fork || ''; return go(Number(b.dataset.stage), !b.closest('.rail') && !('stay' in b.dataset)); }
      if ((b = by('[data-rule]'))) { S.rule = Number(b.dataset.rule); document.querySelectorAll('[data-rule]').forEach((x) => x.setAttribute('aria-pressed', String(x === b))); return said(); }
      if ((b = by('[data-out-i]'))) { S.out = Number(b.dataset.outI); document.querySelectorAll('[data-out-i]').forEach((x) => x.setAttribute('aria-pressed', String(x === b))); return said(); }
      if ((b = by('[data-filter]'))) { S.filter = b.dataset.filter; S.showAll = true; const y = window.scrollY; render(); return window.scrollTo(0, y); }
      if ((b = by('[data-flag]'))) { const { s } = ill(); s.flags ^= 1 << Number(b.dataset.flag); return paint(true); }
      if ((b = by('[data-set]'))) { const { s } = ill(); s[b.dataset.set] = Number(b.dataset.v); if (b.dataset.set2) s[b.dataset.set2] = Number(b.dataset.v2); return paint(true); }
    });
    el.addEventListener('toggle', (e) => { if (e.target.classList && e.target.classList.contains('allrows')) S.showAll = e.target.open; }, true);
    el.addEventListener('keydown', (e) => { const p = e.target.closest && e.target.closest('.i-pick'); if (p && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); p.dispatchEvent(new MouseEvent('click', { bubbles: true })); } });
    el.addEventListener('input', (e) => { if (e.target.id !== 'clr-x') return; const k = e.target.dataset.mk, v = Number(e.target.value);
      $('clr-art').innerHTML = clearArt(D.clearPicture(k, v)); $('clr-v').textContent = v.toFixed(D.TAGS[k].clear.try.dp) + ' ' + D.TAGS[k].clear.try.unit; });
    el.addEventListener('input', (e) => { const k = e.target.dataset && e.target.dataset.k; if (!k) return; const { s } = ill(); s[k] = Number(e.target.value); paint(e.target.tagName === 'SELECT'); });
    render();
    // A link from another page lands on what it names: the mark, or the decision
    if (S.markOn) $('marks').scrollIntoView({ block: 'start' }); else if (q.has('stage')) $('walk').scrollIntoView({ block: 'start' });
  }
  let tries = 0;
  (function ready() { if (window.CurveDerivations && window.Frameworks && document.getElementById('fw')) start(); else if (++tries < 160) setTimeout(ready, 50); })();
})();
