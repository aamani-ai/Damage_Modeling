/* Grid infrastructure substations: one shared builder, three reference stations (transmission 345/138 kV breaker-and-a-half,
   switching 345 kV ring bus, distribution 138/12.47 kV). x = east, z = south, y = up, y = 0 is yard grade. Metres. */
(function () {
  const R = window.SubsystemModels = window.SubsystemModels || {};
  const C = { galv: 0xb3b9be, steel: 0x9aa2a8, porc: 0x8a5a3c, poly: 0x8d969c, tank: 0x8b959b, txg: 0x87939a, alu: 0xc6ccd1, dark: 0x3d4349, conc: 0xc9c5bc, cab: 0xd9dcdc, wire: 0x9ba3a9, wood: 0x7a5c3e, house: 0xd8d6cf };
  function kit(ctx) {
    const T = ctx.T, K = window.REKit, M = (p, r, s) => ctx.mat4(p, r, s);
    const prof = [[0, 0], [0.07, 0], [0.07, 0.03]];
    for (let i = 0; i < 9; i++) { const y = 0.05 + i * 0.105; prof.push([0.17, y + 0.02], [0.065, y + 0.05], [0.065, y + 0.09]); }
    prof.push([0.08, 0.98], [0.08, 1], [0, 1]);
    const insG = new T.LatheGeometry(prof.map(([r, y]) => new T.Vector2(r, y)), 10), boxG = new T.BoxGeometry(1, 1, 1);
    const bins = {}, bin = (node, key, geo, col, o) => { const k = node + '|' + key; return (bins[k] = bins[k] || { node, geo, col, list: [], o }).list; };
    const flush = () => Object.values(bins).forEach((b) => b.list.length && ctx.instanced(ctx.group(null, { node: b.node }), b.geo, b.col, b.list, { edges: false, ...(b.o || {}) }));
    const G = {}, grp = (node, o) => (o ? ctx.group(null, { node, ...o }) : (G[node] = G[node] || ctx.group(null, { node })));
    const dirV = (ax) => (ax === 'x' ? [1, 0] : [0, 1]), perpV = (ax) => (ax === 'x' ? [0, 1] : [1, 0]);
    const at = (p, v, k) => [p[0] + v[0] * k, p[1] + v[1] * k];
    const phases = (c, ax, sp) => { const q = perpV(ax); return [-1, 0, 1].map((k) => at(c, q, k * sp)); };
    const ins = (node, x, y, z, h, o) => bin(node, 'ins' + ((o && o.col) || C.porc), insG, (o && o.col) || C.porc, { rough: 0.35 }).push(M([x, y, z], (o && o.rot) || null, [(o && o.rs) || 1, h, (o && o.rs) || 1]));
    const col = (node, x, z, y0, h, w) => bin(node, 'stl', boxG, C.galv, { metal: 0.55, rough: 0.5 }).push(M([x, y0 + h / 2, z], null, [w || 0.3, h, w || 0.3]));
    const beam = (node, a, b, y, w) => { const dx = b[0] - a[0], dz = b[1] - a[1]; bin(node, 'stl', boxG, C.galv, { metal: 0.55, rough: 0.5 }).push(M([(a[0] + b[0]) / 2, y, (a[1] + b[1]) / 2], null, [Math.abs(dx) + (w || 0.3), w || 0.3, Math.abs(dz) + (w || 0.3)])); };
    const wire = (node, a, b, r) => ctx.rod(grp(node), a, b, r || 0.05, C.wire, { edges: false });
    const S = {
      345: { ph: 5, cb: { len: 3.6, r: 0.55, cy: 2.6, bh: 4.2 }, ds: { hs: 4.2, hi: 3.2, bl: 4.2 }, hb: 8, vt: { s: 2.6, h: 4.2 }, sa: { s: 2.4, h: 3.6 }, de: 18 },
      138: { ph: 3, cb: { len: 2.2, r: 0.36, cy: 1.9, bh: 2.4 }, ds: { hs: 3.0, hi: 1.7, bl: 2.4 }, hb: 6, vt: { s: 2.2, h: 2.2 }, sa: { s: 2.2, h: 1.8 }, de: 13 },
    };
    const k = {
      T, K, M, C, flush, grp, wire, col, beam, ins, phases, at, dirV, perpV,
      breaker(node, c, ax, kv) {
        const s = S[kv].cb, v = dirV(ax), g = grp(node), pts = phases(c, ax, S[kv].ph), a = 0.38;
        pts.forEach((p) => {
          ctx.cyl(g, s.r, s.r, s.len, C.tank, [p[0], s.cy, p[1]], { seg: 18, rot: ax === 'x' ? [0, 0, Math.PI / 2] : [Math.PI / 2, 0, 0], metal: 0.35 });
          [-1, 1].forEach((e) => { const q = at(p, v, e * s.len * 0.3); ins(node, q[0], s.cy + s.r * 0.8, q[1], s.bh, { rs: 1.15, rot: ax === 'x' ? [0, 0, -e * a] : [e * a, 0, 0] }); });
          [-1, 1].forEach((e) => { const q = at(p, v, e * s.len * 0.38); col(node, q[0], q[1], 0, s.cy - s.r, 0.25); });
        });
        const e0 = at(pts[0], v, s.len / 2 + 0.7); ctx.box(g, 0.9, 1.5, 0.9, C.cab, [e0[0], 1.0 + 0.75, e0[1]], { metal: 0.2 });
        beam(node, at(pts[0], v, -s.len * 0.38), at(pts[2], v, -s.len * 0.38), s.cy - s.r - 0.1, 0.22); beam(node, at(pts[0], v, s.len * 0.38), at(pts[2], v, s.len * 0.38), s.cy - s.r - 0.1, 0.22);
        return pts.map((p) => [p[0], S[kv].hb - 1.5, p[1]]);
      },
      disconnect(node, c, ax, kv) {
        const s = S[kv].ds, v = dirV(ax), pts = phases(c, ax, S[kv].ph), g = grp(node);
        pts.forEach((p) => { col(node, p[0], p[1], 0, s.hs, 0.28); [-1, 1].forEach((e) => { const q = at(p, v, e * s.bl / 2); ins(node, q[0], s.hs, q[1], s.hi, { rs: 0.8 }); }); const a = at(p, v, -s.bl / 2), b = at(p, v, s.bl / 2); ctx.rod(g, [a[0], s.hs + s.hi + 0.1, a[1]], [b[0], s.hs + s.hi + 0.1, b[1]], 0.07, C.alu, { edges: false }); });
        [-1, 1].forEach((e) => beam(node, at(pts[0], v, e * s.bl / 2), at(pts[2], v, e * s.bl / 2), s.hs, 0.25));
        ctx.box(g, 0.5, 0.7, 0.35, C.cab, [pts[0][0], 1.4 + 0.35, pts[0][1]], { metal: 0.2 });
      },
      support(node, c, ax, kv, h) { const sp = S[kv], hb = h || sp.hb; phases(c, ax, sp.ph).forEach((p) => { col(node, p[0], p[1], 0, hb - sp.ds.hi, 0.26); ins(node, p[0], hb - sp.ds.hi, p[1], sp.ds.hi, { rs: 0.8 }); }); },
      vt(node, c, ax, kv) { const s = S[kv].vt, g = grp(node); phases(c, ax, S[kv].ph).forEach((p) => { col(node, p[0], p[1], 0, s.s, 0.3); ctx.cyl(g, 0.32, 0.32, 0.6, C.tank, [p[0], s.s + 0.3, p[1]], { seg: 14, metal: 0.3, edges: false }); ins(node, p[0], s.s + 0.6, p[1], s.h, { rs: 1.05 }); }); },
      arrester(node, c, ax, kv) { const s = S[kv].sa; phases(c, ax, S[kv].ph).forEach((p) => { col(node, p[0], p[1], 0, s.s, 0.26); ins(node, p[0], s.s, p[1], s.h, { rs: 0.65, col: C.poly }); }); },
      deadend(node, c, ax, kv, out) {
        const sp = S[kv], h = sp.de, v = dirV(ax), q = perpV(ax), pts = phases(c, ax, sp.ph), g = grp(node);
        const c1 = at(pts[0], q, -3), c2 = at(pts[2], q, 3);
        [c1, c2].forEach((p) => { col(node, p[0], p[1], 0, h + 3, 0.7); });
        beam(node, c1, c2, h - 0.5, 0.6);
        const tips = pts.map((p) => { const a = at(p, v, out * 0.4), b = at(p, v, out * (kv === 345 ? 3.4 : 2.0)); ctx.rod(g, [a[0], h - 0.6, a[1]], [b[0], h - 0.6, b[1]], kv === 345 ? 0.16 : 0.11, C.poly, { edges: false }); return [b[0], h - 0.6, b[1]]; });
        const back = pts.map((p) => { const a = at(p, v, -out * 0.4); return [a[0], h - 0.6, a[1]]; });
        return { tips, back, peaks: [[c1[0], h + 3, c1[1]], [c2[0], h + 3, c2[1]]] };
      },
      transformer(ids, x, z, s) {
        const pad = 0.6, top = pad + s.H, gC = grp(ids.core), gB = ids.bush, gK = grp(ids.cool), gL = grp(ids.ltc), gO = grp(ids.cons), gA = grp(ids.cab);
        ctx.box(gC, s.L + 1.2, pad, s.W + 1.2, C.conc, [x, pad / 2, z], { edgeOpacity: 0.2 });
        ctx.box(gC, s.L, s.H, s.W, C.txg, [x, pad + s.H / 2, z], { metal: 0.3, rough: 0.55 });
        ctx.box(gC, s.L + 0.2, 0.15, s.W + 0.2, C.txg, [x, top + 0.07, z], { metal: 0.3, edges: false });
        [-1, 0, 1].forEach((i) => { ins(gB, x + i * s.bs, top, z - s.W / 2 + 0.7, s.hv, { rs: s.rs, rot: [-0.12, 0, 0] }); ins(gB, x + i * s.bs * 0.8, top, z + s.W / 2 - 0.6, s.lv, { rs: s.rs * 0.8, rot: [0.12, 0, 0] }); });
        ins(gB, x + s.L / 2 - 0.8, top, z, s.lv * 0.6, { rs: s.rs * 0.6 });
        [-1, 1].forEach((e) => {
          const rx = x + e * (s.L / 2 + 0.75);
          for (let i = 0; i < s.nr; i++) bin(ids.cool, 'rad', boxG, 0x7d898f, { metal: 0.3 }).push(M([rx, pad + 0.4 + s.H * 0.42, z - s.W / 2 + 0.45 + (i * (s.W - 0.9)) / (s.nr - 1)], null, [1.3, s.H * 0.8, 0.07]));
          [-0.25, 0.25].forEach((f) => ctx.cyl(gK, 0.42, 0.42, 0.2, C.dark, [rx + e * 0.8, pad + 0.9, z + f * s.W], { seg: 16, rot: [0, 0, Math.PI / 2], edges: false }));
          ctx.box(gK, 0.25, 0.25, s.W - 0.6, 0x7d898f, [rx - e * 0.55, top - 0.4, z], { edges: false });
        });
        ctx.cyl(gO, s.cr, s.cr, s.L * 0.55, 0x8f9aa0, [x - s.L * 0.12, top + 1.5 + s.cr, z + s.W * 0.2], { seg: 18, rot: [0, 0, Math.PI / 2], metal: 0.3 });
        [-1, 1].forEach((e) => col(ids.cons, x - s.L * 0.12 + e * s.L * 0.2, z + s.W * 0.2, top, 1.5, 0.18));
        ctx.box(gL, 1.3, s.H * 0.6, 1.0, C.txg, [x + s.L / 2 - 1.0, pad + s.H * 0.55, z + s.W / 2 + 0.5], { metal: 0.3 });
        ctx.box(gL, 0.8, 1.0, 0.45, C.cab, [x + s.L / 2 - 1.0, 1.3 + 0.5, z + s.W / 2 + 1.25], { metal: 0.2 });
        ctx.box(gA, 1.2, 1.6, 0.5, C.cab, [x - s.L * 0.25, 1.0 + 0.8, z + s.W / 2 + 0.3], { metal: 0.2 });
        return { hv: [-1, 0, 1].map((i) => [x + i * s.bs, top + s.hv * 0.97, z - s.W / 2 + 0.7 - s.hv * 0.12]), lv: [-1, 0, 1].map((i) => [x + i * s.bs * 0.8, top + s.lv * 0.97, z + s.W / 2 - 0.6 + s.lv * 0.12]) };
      },
      containment(node, x, z, w, d) { const g = grp(node); [[0, -d / 2, w, 0.3], [0, d / 2, w, 0.3], [-w / 2, 0, 0.3, d], [w / 2, 0, 0.3, d]].forEach(([dx, dz, ww, dd]) => ctx.box(g, ww, 0.3, dd, C.conc, [x + dx, 0.15, z + dz], { edgeOpacity: 0.2 })); ctx.box(g, w - 0.3, 0.06, d - 0.3, 0x8f8a80, [x, 0.13, z], { edges: false, rough: 1 }); },
      house(ids, x, z, w, d, fl, n) {
        const h = 3.2, g = grp(ids.house), y0 = fl;
        ctx.box(g, w + 0.6, fl, d + 0.6, C.conc, [x, fl / 2, z], { edgeOpacity: 0.25 });
        [[0, -d / 2, w, 0.15, [0, 0, -1]], [0, d / 2, w, 0.15, [0, 0, 1]], [-w / 2, 0, 0.15, d, [-1, 0, 0]], [w / 2, 0, 0.15, d, [1, 0, 0]]].forEach(([dx, dz, ww, dd, ex]) => ctx.box(ctx.group(null, { node: ids.house, shell: true, explode: ex.map((q) => q * 2.5) }), ww, h, dd, C.house, [x + dx, y0 + h / 2, z + dz], { rough: 0.7, edgeOpacity: 0.2 }));
        ctx.box(ctx.group(null, { node: ids.house, shell: true, explode: [0, 3, 0] }), w + 0.5, 0.2, d + 0.5, 0x9ea4a8, [x, y0 + h + 0.1, z], { metal: 0.3 });
        ctx.box(g, 1.0, 2.1, 0.06, 0x6f777c, [x - w / 2 + 1.4, y0 + 1.05, z + d / 2 + 0.06], { edges: false });
        ctx.box(g, 1.0, 1.0, 0.6, 0xe4e6e3, [x + w / 2 + 0.4, y0 + 1.6, z], { metal: 0.2 });
        const rl = bin(ids.relay, 'rp', boxG, 0xc9cdd0, { metal: 0.25, edges: true, edgeOpacity: 0.25 });
        const rows = Math.max(1, Math.round(n / 8)), per = Math.ceil(n / rows);
        for (let r = 0; r < rows; r++) for (let i = 0; i < per && r * per + i < n; i++) rl.push(M([x - w / 2 + 2.2 + i * 0.85, y0 + 1.15, z - d / 2 + 1.2 + r * 1.8], null, [0.8, 2.3, 0.6]));
        const gd = grp(ids.dc); [0, 1, 2].forEach((t) => ctx.box(gd, 2.4, 0.35, 0.6 - t * 0.12, 0x2f3438, [x + w / 2 - 2.0, y0 + 0.525 + t * 0.42, z - d / 2 + 0.7 + t * 0.1], { edges: false }));
        ctx.box(grp(ids.rtu), 0.6, 2.0, 0.6, 0x3d4349, [x + w / 2 - 0.8, y0 + 1.0, z + d / 2 - 0.8], { metal: 0.3 });
        ctx.box(grp(ids.ss), 1.2, 1.6, 0.4, 0xb9bec2, [x + w / 2 - 2.4, y0 + 1.4, z + d / 2 - 0.3], { metal: 0.25 });
        return [x + w / 2, z];
      },
      trench(node, segs) { const g = grp(node); segs.forEach(([a, b]) => { const dx = b[0] - a[0], dz = b[1] - a[1]; ctx.box(g, Math.abs(dx) + 0.8, 0.62, Math.abs(dz) + 0.8, C.conc, [(a[0] + b[0]) / 2, -0.26, (a[1] + b[1]) / 2], { edgeOpacity: 0.2 }); }); },
      ground(node, x0, x1, z0, z1, st) { const l = bin(node, 'gg', boxG, 0xb8733d, { metal: 0.6 }); for (let x = x0; x <= x1 + 0.01; x += st) l.push(M([x, -0.5, (z0 + z1) / 2], null, [0.03, 0.03, z1 - z0])); for (let z = z0; z <= z1 + 0.01; z += st) l.push(M([(x0 + x1) / 2, -0.5, z], null, [x1 - x0, 0.03, 0.03])); },
      rock(node, x0, x1, z0, z1) { const t = K.tex(ctx, 256, 256, (c, w, h) => { c.fillStyle = '#b4ada0'; c.fillRect(0, 0, w, h); const r = K.rnd(11); for (let i = 0; i < 5000; i++) { c.fillStyle = ['#a39c8f', '#c6bfb1', '#968f83', '#d0cabc', '#8b857a'][i % 5]; c.fillRect(r() * w, r() * h, 2, 2); } }, (x1 - x0) / 6, (z1 - z0) / 6); ctx.box(grp(node), x1 - x0, 0.15, z1 - z0, 0xffffff, [(x0 + x1) / 2, 0.0, (z0 + z1) / 2], { map: t, rough: 1, edgeOpacity: 0.12 }); },
      fence(node, x0, x1, z0, z1, gate) {
        const g = grp(node), posts = bin(node, 'fp', boxG, 0x9aa1a6, { metal: 0.5 }), sides = [[[x0, z0], [x1, z0]], [[x1, z0], [x1, z1]], [[x1, z1], [x0, z1]], [[x0, z1], [x0, z0]]];
        sides.forEach(([a, b], si) => {
          const L = Math.hypot(b[0] - a[0], b[1] - a[1]), ux = (b[0] - a[0]) / L, uz = (b[1] - a[1]) / L, spans = gate && gate.side === si ? [[0, gate.at - gate.w / 2], [gate.at + gate.w / 2, L]] : [[0, L]];
          spans.forEach(([s0, s1]) => { if (s1 - s0 < 0.5) return; const m0 = [a[0] + ux * s0, a[1] + uz * s0], m1 = [a[0] + ux * s1, a[1] + uz * s1];
            ctx.box(g, Math.abs(m1[0] - m0[0]) + 0.04, 2.1, Math.abs(m1[1] - m0[1]) + 0.04, 0xa9b0b5, [(m0[0] + m1[0]) / 2, 1.05, (m0[1] + m1[1]) / 2], { opacity: 0.32, edges: false, metal: 0.4 });
            ctx.rod(g, [m0[0], 2.45, m0[1]], [m1[0], 2.45, m1[1]], 0.02, 0x6f767b, { edges: false });
            for (let s = s0; s <= s1 + 0.01; s += 3) posts.push(M([a[0] + ux * s, 1.25, a[1] + uz * s], null, [0.07, 2.5, 0.07])); });
        });
      },
      masts(node, pts, h, wires) { const g = grp(node); pts.forEach((p) => ctx.cyl(g, 0.12, 0.4, h, C.galv, [p[0], h / 2, p[1]], { seg: 10, metal: 0.5 })); (wires || []).forEach(([i, j]) => ctx.rod(g, [pts[i][0], h - 0.3, pts[i][1]], [pts[j][0], h - 0.3, pts[j][1]], 0.02, C.wire, { edges: false })); },
      tower(g, x, z, h, ax) { ctx.cyl(g, 0.7, 2.6, h, 0xc3c8cc, [x, h / 2, z], { seg: 4, metal: 0.4, edgeOpacity: 0.35 }); const q = perpV(ax); const w = 8; ctx.box(g, ax === 'x' ? 0.5 : w * 2, 0.5, ax === 'x' ? w * 2 : 0.5, 0xc3c8cc, [x, h * 0.78, z], { edges: false }); return [-1, 0, 1].map((k2) => [x + q[0] * k2 * w * 0.9, h * 0.78 - 1.5, z + q[1] * k2 * w * 0.9]); },
      pole(g, x, z, h, ax, sp, col0) { ctx.cyl(g, 0.22, 0.36, h, col0 || 0x9aa2a8, [x, h / 2, z], { seg: 10, metal: col0 ? 0 : 0.4 }); const q = perpV(ax); ctx.box(g, ax === 'x' ? 0.2 : sp * 2.4, 0.2, ax === 'x' ? sp * 2.4 : 0.2, col0 || 0x9aa2a8, [x, h - 1, z], { edges: false }); return [-1, 0, 1].map((k2) => [x + q[0] * k2 * sp, h - 1.3, z + q[1] * k2 * sp]); },
      ringBus(node, sup, x0, x1, z0, z1, kv, h, every) {
        const sp = S[kv].ph, g = grp(node), rects = [0, 1, 2].map((p) => [x0 - p * sp, x1 + p * sp, z0 - p * sp, z1 + p * sp]);
        rects.forEach(([a, b, c, d2]) => [[[a, c], [b, c]], [[b, c], [b, d2]], [[b, d2], [a, d2]], [[a, d2], [a, c]]].forEach(([p, q]) => ctx.rod(g, [p[0], h, p[1]], [q[0], h, q[1]], kv === 345 ? 0.09 : 0.07, C.alu, { edges: false })));
        const dsh = S[kv].ds.hi;
        rects.forEach(([a, b, c, d2]) => { for (let x = a + every / 2; x < b; x += every) [c, d2].forEach((z) => { col(sup, x, z, 0, h - dsh, 0.24); ins(sup, x, h - dsh, z, dsh, { rs: 0.8 }); }); for (let z = c + every / 2; z < d2; z += every) [a, b].forEach((x) => { col(sup, x, z, 0, h - dsh, 0.24); ins(sup, x, h - dsh, z, dsh, { rs: 0.8 }); }); });
        return (side, t) => [0, 1, 2].map((p) => { const [a, b, c, d2] = rects[p]; return side === 'n' ? [t, h, c] : side === 's' ? [t, h, d2] : side === 'w' ? [a, h, t] : [b, h, t]; });
      },
      flood(dfe, ext, lab0) {
        const wat = K.water(ctx, ext[0], ext[1], ext[2], ext[3]), lab = ctx.label(lab0[0], lab0[2], { sub: lab0[1] });
        ctx.onUpdate((vv) => { const dd = +vv.flood || 0; wat.set(dd); if (dd > 0.005) lab.set('Water ' + dd.toFixed(2) + ' m above the yard', dd < lab0[3] ? 'Control house floor clear by ' + (lab0[3] - dd).toFixed(2) + ' m' : 'Control house floor flooded by ' + (dd - lab0[3]).toFixed(2) + ' m', dd < lab0[3] ? '#2f97b5' : '#d9675e'); else lab.set(lab0[0], lab0[1]); });
      },
    };
    return k;
  }
  const ctl = (dfe) => [{ id: 'flood', label: 'Flood depth above the yard', min: 0, max: 2, step: 0.05, value: 0, unit: ' m', presets: [{ label: 'Off', v: 0 }, { label: 'Trench', v: 0.05 }, { label: '100-yr', v: dfe }, { label: '500-yr', v: +(dfe + 0.5).toFixed(2) }] }];
  const ids = (p) => ({ house: p + 'pc_house', relay: p + 'pc_relay', dc: p + 'pc_dc', rtu: p + 'pc_rtu', ss: p + 'pc_ss' });
  const tid = (p) => ({ core: p + 'tx_core', bush: p + 'tx_bush', cool: p + 'tx_cool', ltc: p + 'tx_ltc', cons: p + 'tx_cons', cab: p + 'tx_cab' });

  // ---------------- TRANSMISSION 345/138 kV ----------------
  R['gi-sub-trans'] = {
    env: 'prairie', caps: { subsurface: true, internals: true },
    connections: { power: ['st_hv_bus', 'st_lv_bus'], ground: ['st_cv_grid'], comms: ['st_pc_rtu', 'st_pc_cable'] },
    camera: { theta: 0.62, phi: 0.92, r: 300, target: [0, 0, 12] }, thumbView: { theta: 0.62, phi: 0.9 },
    controls: ctl(0.9),
    build(ctx) {
      const k = kit(ctx), p = 'st_', ph = 5, W = k.wire, X = [-36, 0, 36];
      ctx.ground({ x0: -170, x1: 170, z0: -170, z1: 170, depth: 2 });
      k.rock(p + 'cv_rock', -78, 72, -76, 102); k.fence(p + 'cv_fence', -78, 72, -76, 102, { side: 3, at: 62, w: 8 });
      k.ground(p + 'cv_grid', -76, 70, -74, 100, 8);
      // 345 kV main buses (phases offset outward) and supports
      const hb = 11, B1 = [-50, -54, -58], B2 = [10, 14, 18];
      [B1, B2].forEach((B) => { B.forEach((z) => W(p + 'hv_bus', [-56, hb, z], [56, hb, z], 0.1)); for (let x = -54; x <= 54.1; x += 12) B.forEach((z) => { k.col(p + 'hv_bus', x, z, 0, hb - 3.2, 0.26); k.ins(p + 'hv_bus', x, hb - 3.2, z, 3.2, { rs: 0.8 }); }); });
      const seq = { ds: [-46, -34, -26, -14, -6, 6], cb: [-40, -20, 0], tapA: -30, tapB: -10 }, hc = 6.5;
      X.forEach((x) => {
        seq.ds.forEach((z) => k.disconnect(p + 'hv_ds', [x, z], 'z', 345)); seq.cb.forEach((z) => k.breaker(p + 'hv_cb', [x, z], 'z', 345));
        [-1, 0, 1].forEach((i) => { const xi = x + i * ph; W(p + 'hv_bus', [xi, hc, -48], [xi, hc, 8], 0.08); W(p + 'hv_bus', [xi, hc, -48], [xi, hb, B1[1 + i] ?? -50], 0.06); W(p + 'hv_bus', [xi, hc, 8], [xi, hb, B2[1 + i] ?? 10], 0.06); });
      });
      const lines = [[-45, -36, seq.tapA], [-27, -36, seq.tapB], [0, 0, seq.tapA], [36, 36, seq.tapA]], ext = [];
      const gx = ctx.group(null, { context: true });
      lines.forEach(([dx, sx, tz]) => {
        const de = k.deadend(p + 'hv_de', [dx, -68], 'z', 345, -1);
        k.vt(p + 'hv_vt', [dx, -63], 'z', 345); k.arrester(p + 'hv_sa', [dx, -65.5], 'z', 345);
        de.back.forEach((b, i) => { W(p + 'hv_bus', [sx + (i - 1) * ph, hc, tz], [sx + (i - 1) * ph, 15, tz], 0.06); W(p + 'hv_bus', [sx + (i - 1) * ph, 15, tz], b, 0.06); });
        const arms = k.tower(gx, dx, -135, 40, 'z'); de.tips.forEach((t, i) => ctx.rod(gx, t, arms[i], 0.05, k.C.wire, { edges: false })); ext.push(de);
      });
      const ring = k.ringBus(p + 'lv_bus', p + 'lv_bus', -12, 48, 52, 82, 138, 6, 12);
      // autotransformers
      const TX = [[0, 30], [36, 30]], S345 = { L: 9, W: 4.5, H: 5, hv: 6, lv: 3.4, bs: 2.6, rs: 1.6, nr: 9, cr: 0.6 };
      TX.forEach(([x, z], j) => {
        const tt = k.transformer(tid(p), x, z, S345);
        k.containment(p + 'tx_oc', x, z, S345.L + 5.5, S345.W + 5);
        tt.hv.forEach((hv, i) => { const xi = x + (i - 1) * ph; W(p + 'hv_bus', [xi, hc, seq.tapB], [xi, 13, seq.tapB], 0.06); W(p + 'hv_bus', [xi, 13, seq.tapB], [xi, 13, 22], 0.06); W(p + 'hv_bus', [xi, 13, 22], hv, 0.06); });
        k.arrester(p + 'hv_sa', [x, 24.5], 'z', 345); k.vt(p + 'hv_vt', [x - 11, 22], 'x', 345);
        const rn = ring('n', x); tt.lv.forEach((lv, i) => W(p + 'lv_bus', lv, rn[2 - i], 0.06));
      });
      ctx.box(k.grp(p + 'tx_oc'), 0.4, 7, 10, k.C.conc, [18, 3.5, 30], { edgeOpacity: 0.25 });
      // 138 kV ring bus
      const cb = (side, t, ax) => { k.breaker(p + 'lv_cb', side === 'n' ? [t, 49] : side === 's' ? [t, 85] : side === 'w' ? [-15, t] : [51, t], ax, 138); [-5, 5].forEach((o) => k.disconnect(p + 'lv_ds', side === 'n' ? [t + o, 49] : side === 's' ? [t + o, 85] : side === 'w' ? [-15, t + o] : [51, t + o], ax, 138)); };
      cb('n', 18, 'x'); cb('e', 59, 'z'); cb('e', 75, 'z'); cb('s', 18, 'x'); cb('w', 75, 'z'); cb('w', 59, 'z');
      [[0, 40], [36, 40]].forEach(([x, z]) => k.vt(p + 'lv_vt', [x - 6, z], 'x', 138));
      const lv = [['w', 67, [-32, 67], 'x', -1, [-150, 67]], ['e', 67, [66, 67], 'x', 1, [150, 67]], ['s', 6, [6, 96], 'z', 1, [6, 150]], ['s', 30, [30, 96], 'z', 1, [30, 150]]];
      lv.forEach(([side, t, pos, ax, out, far]) => {
        const de = k.deadend(p + 'lv_de', pos, ax, 138, out), rp = ring(side, t); k.vt(p + 'lv_vt', ax === 'x' ? [pos[0] - out * 6, pos[1]] : [pos[0], pos[1] - 6], ax, 138);
        de.back.forEach((b, i) => W(p + 'lv_bus', rp[i], b, 0.05)); const arms = k.pole(gx, far[0], far[1], 24, ax, 3); de.tips.forEach((tp, i) => ctx.rod(gx, tp, arms[i], 0.04, k.C.wire, { edges: false }));
      });
      // control house, trench, shielding, drainage, road
      k.house(ids(p), -66, 30, 18, 9, 0.3, 19);
      k.trench(p + 'pc_cable', [[[-57, 30], [-57, 40]], [[-57, 40], [56, 40]], [[-18, 40], [-18, -60]], [[18, 40], [18, -60]], [[54, 40], [54, -60]], [[18, 40], [18, 47]], [[-30, 40], [-30, 67]]]);
      const mp = [[-60, -64], [56, -64], [-60, 2], [56, 2], [-24, 44], [62, 44], [-24, 92], [62, 92]];
      k.masts(p + 'cv_shield', mp, 25, [[0, 1], [2, 3], [0, 2], [1, 3], [4, 5], [6, 7], [4, 6], [5, 7]]);
      const gd = k.grp(p + 'cv_drain'); ctx.box(gd, 168, 0.04, 6, 0x6f8f4c, [-3, 0.02, 108], { edges: false, rough: 1 }); ctx.box(gd, 6, 0.04, 184, 0x6f8f4c, [78, 0.02, 14], { edges: false, rough: 1 }); ctx.cyl(gd, 0.6, 0.6, 10, 0x9aa0a4, [-90, -0.2, 108], { seg: 14, rot: [0, 0, Math.PI / 2], metal: 0.4 });
      ctx.box(gx, 340, 0.03, 9, 0x4f86a8, [0, 0.03, 128], { opacity: 0.8, rough: 0.2, edges: false });
      ctx.box(k.grp(p + 'cv_road'), 92, 0.12, 7, 0x8c877d, [-124, 0.06, 40], { rough: 1, edgeOpacity: 0.15 });
      k.flush();
      k.flood(0.9, [-170, 170, -170, 170], ['345/138 kV transmission substation', '2 × 336 MVA · breaker-and-a-half', [0, 34, 10], 0.3]);
    },
  };

  // ---------------- SWITCHING 345 kV RING ----------------
  R['gi-sub-switch'] = {
    env: 'prairie', caps: { subsurface: true, internals: true },
    connections: { power: ['ss_hv_bus'], ground: ['ss_cv_grid'], comms: ['ss_pc_rtu', 'ss_pc_cable'] },
    camera: { theta: 0.6, phi: 0.95, r: 175, target: [-6, 0, 0] }, thumbView: { theta: 0.6, phi: 0.92 },
    controls: ctl(0.5),
    build(ctx) {
      const k = kit(ctx), p = 'ss_', W = k.wire, ph = 5;
      ctx.ground({ x0: -150, x1: 150, z0: -160, z1: 160, depth: 2 });
      k.rock(p + 'cv_rock', -54, 40, -46, 46); k.fence(p + 'cv_fence', -54, 40, -46, 46, { side: 3, at: 66, w: 8 }); k.ground(p + 'cv_grid', -52, 38, -44, 44, 6);
      const ring = k.ringBus(p + 'hv_bus', p + 'hv_bus', -18, 18, -12, 12, 345, 8, 12);
      [['n', 0, 'x', [0, -17]], ['s', 0, 'x', [0, 17]], ['w', 0, 'z', [-23, 0]], ['e', 0, 'z', [23, 0]]].forEach(([side, t, ax, c]) => { k.breaker(p + 'hv_cb', c, ax, 345); [-7.5, 7.5].forEach((o) => k.disconnect(p + 'hv_ds', ax === 'x' ? [c[0] + o, c[1]] : [c[0], c[1] + o], ax, 345)); });
      const gx = ctx.group(null, { context: true });
      const pos = [[-18, -12, -1, 'Line north A', true], [18, -12, -1, 'Line north B', true], [-18, 12, 1, 'Solar gen-tie', true], [18, 12, 1, 'Spare position', false]];
      pos.forEach(([cx, cz, out, nm, live], j) => {
        const dx = cx + (cx < 0 ? -8 : 8), dz = out * 36, de = k.deadend(p + 'hv_de', [dx, dz], 'z', 345, out);
        k.vt(p + 'hv_vt', [dx + (cx < 0 ? 12 : -12), out * 26], 'z', 345); k.arrester(p + 'hv_sa', [dx, out * 32.5], 'z', 345);
        const corner = ring(cz < 0 ? 'n' : 's', cx);
        de.back.forEach((b, i) => { W(p + 'hv_bus', corner[i], [b[0], 12, corner[i][2] + out * 4], 0.06); W(p + 'hv_bus', [b[0], 12, corner[i][2] + out * 4], b, 0.06); });
        if (!live) return;
        if (j < 2) { const arms = k.tower(gx, dx, -140, 40, 'z'); de.tips.forEach((t, i) => ctx.rod(gx, t, arms[i], 0.05, k.C.wire, { edges: false })); }
        else { [[-34, 70], [-62, 104], [-96, 140]].forEach(([hx, hz], m) => { const arms = k.pole(gx, hx, hz, 22, 'z', 5, k.C.wood); if (m === 0) de.tips.forEach((t, i) => ctx.rod(gx, t, arms[i], 0.05, k.C.wire, { edges: false })); }); }
      });
      // revenue metering on the gen-tie position
      k.vt(p + 'hv_mtr', [-26, 21], 'z', 345); const gm = k.grp(p + 'hv_mtr'); k.phases([-26, 24.5], 'z', ph).forEach((q) => { k.col(p + 'hv_mtr', q[0], q[1], 0, 2.6, 0.3); ctx.cyl(gm, 0.45, 0.45, 1.0, k.C.tank, [q[0], 2.6 + 4.2, q[1]], { seg: 14, metal: 0.3 }); k.ins(p + 'hv_mtr', q[0], 2.6, q[1], 4.2, { rs: 1.1 }); });
      k.house(ids(p), -42, -4, 12, 5, 0.3, 6);
      k.trench(p + 'pc_cable', [[[-36, -4], [28, -4]], [[-18, -4], [-18, -40]], [[-18, -4], [-18, 30]], [[18, -4], [18, -40]], [[18, -4], [18, 30]]]);
      const mp = [[-36, -32], [30, -32], [-36, 32], [30, 32]]; k.masts(p + 'cv_shield', mp, 25, [[0, 1], [2, 3], [0, 2], [1, 3]]);
      const gd = k.grp(p + 'cv_drain'); [[-7, -52, 100, 4], [-7, 52, 100, 4]].forEach(([x, z, w, d]) => ctx.box(gd, w, 0.04, d, 0x6f8f4c, [x, 0.02, z], { edges: false, rough: 1 })); [[-60, 0, 4, 108], [46, 0, 4, 108]].forEach(([x, z, w, d]) => ctx.box(gd, w, 0.04, d, 0x6f8f4c, [x, 0.02, z], { edges: false, rough: 1 }));
      ctx.box(k.grp(p + 'cv_road'), 96, 0.12, 7, 0x8c877d, [-102, 0.06, -20], { rough: 1, edgeOpacity: 0.15 });
      k.flush();
      k.flood(0.5, [-150, 150, -160, 160], ['345 kV switching station', '4-position ring bus · solar POI', [-6, 30, 0], 0.3]);
    },
  };

  // ---------------- DISTRIBUTION 138/12.47 kV ----------------
  R['gi-sub-dist'] = {
    env: 'prairie', caps: { subsurface: true, internals: true },
    connections: { power: ['sd_hv_bus', 'sd_lv_fdr'], ground: ['sd_cv_grid'], comms: ['sd_pc_rtu', 'sd_pc_cable'] },
    camera: { theta: 0.55, phi: 0.95, r: 150, target: [0, 0, 0] }, thumbView: { theta: 0.55, phi: 0.92 },
    controls: ctl(1.0),
    build(ctx) {
      const k = kit(ctx), p = 'sd_', W = k.wire, ph = 3, hb = 7.5;
      ctx.ground({ x0: -120, x1: 120, z0: -125, z1: 120, depth: 2 });
      k.rock(p + 'cv_rock', -42, 42, -44, 36); k.fence(p + 'cv_fence', -42, 42, -44, 36, { side: 2, at: 69, w: 7 }); k.ground(p + 'cv_grid', -40, 40, -42, 34, 5);
      [[-42, -30.5], [-23.5, 42]].forEach(([a, b]) => ctx.box(k.grp(p + 'cv_fence'), b - a, 2.6, 0.4, 0xc8b9a4, [(a + b) / 2, 1.3, 36.4], { edgeOpacity: 0.2 }));
      const BZ = [-18, -21, -24];
      [[-26, -6], [6, 26]].forEach(([a, b]) => BZ.forEach((z) => W(p + 'hv_bus', [a, hb, z], [b, hb, z], 0.07)));
      [-24, -17, -10, -3, 3, 10, 17, 24].forEach((x) => BZ.forEach((z) => { k.col(p + 'hv_bus', x, z, 0, hb - 1.7, 0.24); k.ins(p + 'hv_bus', x, hb - 1.7, z, 1.7, { rs: 0.8 }); }));
      k.breaker(p + 'hv_cb', [0, -21], 'x', 138); [-4, 4].forEach((o) => k.disconnect(p + 'hv_ds', [o, -21], 'x', 138));
      [-26, 26].forEach((x) => k.vt(p + 'hv_vt', [x, -21], 'x', 138));
      const gx = ctx.group(null, { context: true });
      [-18, 18].forEach((x) => {
        const de = k.deadend(p + 'hv_de', [x, -38], 'z', 138, -1); k.disconnect(p + 'hv_ds', [x, -31], 'z', 138); k.arrester(p + 'hv_sa', [x, -34.5], 'z', 138);
        de.back.forEach((b, i) => W(p + 'hv_bus', b, [x + (i - 1) * ph, hb, BZ[i]], 0.05));
        const arms = k.pole(gx, x, -95, 26, 'z', 3); de.tips.forEach((t, i) => ctx.rod(gx, t, arms[i], 0.04, k.C.wire, { edges: false }));
      });
      const S30 = { L: 5.5, W: 3.2, H: 3.4, hv: 2.6, lv: 1.4, bs: 1.4, rs: 1.1, nr: 7, cr: 0.42 };
      [-16, 16].forEach((x) => {
        k.disconnect(p + 'hv_ds', [x, -13], 'z', 138); k.breaker(p + 'hv_cb', [x, -7], 'z', 138); k.disconnect(p + 'hv_ds', [x, -1], 'z', 138); k.arrester(p + 'hv_sa', [x, 4], 'z', 138);
        const tt = k.transformer(tid(p), x, 9, S30); k.containment(p + 'tx_oc', x, 9, S30.L + 4.5, S30.W + 4);
        [-1, 0, 1].forEach((i) => { const xi = x + i * ph; W(p + 'hv_bus', [xi, hb, BZ[0]], [xi, 5.5, -13], 0.05); W(p + 'hv_bus', [xi, 5.5, -1], [xi, 5.5, 3], 0.05); W(p + 'hv_bus', [xi, 5.5, 3], tt.hv[i + 1], 0.05); });
        const ge = k.grp(p + 'lv_swg'), e9 = Math.sign(x) * 9; ctx.box(ge, 1.0, 0.8, 14, 0x9aa2a8, [x, 4.6, 19.5], { metal: 0.3 }); ctx.box(ge, Math.abs(x - e9), 0.8, 1.0, 0x9aa2a8, [(x + e9) / 2, 4.6, 26.5], { metal: 0.3 }); [14, 21].forEach((z) => k.col(p + 'lv_swg', x, z, 0, 4.2, 0.25));
      });
      ctx.box(k.grp(p + 'tx_oc'), 0.35, 5.5, 8, k.C.conc, [0, 2.75, 9], { edgeOpacity: 0.25 });
      // switchgear enclosure on piers
      const fl = 0.6, ex = 9, z0 = 24, z1 = 29, eh = 3.8;
      for (let x = -ex + 1; x <= ex - 1 + 0.01; x += 4) [z0 + 0.5, z1 - 0.5].forEach((z) => k.col(p + 'lv_enc', x, z, 0, fl, 0.4));
      ctx.box(k.grp(p + 'lv_enc'), 2 * ex, 0.2, z1 - z0, 0x9ea4a8, [0, fl, (z0 + z1) / 2], { metal: 0.3 });
      [[0, z0, 2 * ex, 0.12, [0, 0, -1]], [0, z1, 2 * ex, 0.12, [0, 0, 1]], [-ex, (z0 + z1) / 2, 0.12, z1 - z0, [-1, 0, 0]], [ex, (z0 + z1) / 2, 0.12, z1 - z0, [1, 0, 0]]].forEach(([x, z, w, d, e]) => ctx.box(ctx.group(null, { node: p + 'lv_enc', shell: true, explode: e.map((q) => q * 2.5) }), w, eh, d, 0xd5d8d6, [x, fl + eh / 2, z], { rough: 0.6, edgeOpacity: 0.2 }));
      ctx.box(ctx.group(null, { node: p + 'lv_enc', shell: true, explode: [0, 3, 0] }), 2 * ex + 0.3, 0.2, z1 - z0 + 0.3, 0x9ea4a8, [0, fl + eh + 0.1, (z0 + z1) / 2], { metal: 0.3 });
      [-5, 0, 5].forEach((x) => ctx.box(k.grp(p + 'lv_enc'), 1.4, 0.9, 1.4, 0xe4e6e3, [x, fl + eh + 0.65, (z0 + z1) / 2], { metal: 0.2 }));
      const gb = k.grp(p + 'lv_bk'); for (let i = 0; i < 11; i++) ctx.box(gb, 0.9, 2.3, 2.2, i === 5 ? 0xa9b2b8 : 0xc4cacd, [-5 + i * 1.0, fl + 0.1 + 1.15, z0 + 1.4], { metal: 0.25, edgeOpacity: 0.3 });
      // capacitor banks
      [5, 17].forEach((z) => { const g = k.grp(p + 'lv_cap'); ctx.box(g, 4, 0.2, 2.2, k.C.galv, [32, 2.6, z], { metal: 0.5 }); [[30.2, z - 0.9], [33.8, z - 0.9], [30.2, z + 0.9], [33.8, z + 0.9]].forEach(([x, zz]) => k.col(p + 'lv_cap', x, zz, 0, 2.6, 0.2)); for (let r = 0; r < 2; r++) for (let i = 0; i < 6; i++) ctx.box(g, 0.45, 0.9, 0.3, 0xc9ced1, [30.6 + i * 0.56, 3.2 + r * 1.1, z], { metal: 0.3, edgeOpacity: 0.25 }); });
      // feeder getaways to riser poles on the street
      const gf = k.grp(p + 'lv_fdr');
      for (let i = 0; i < 8; i++) { const xi = -7 + i * 2, x = -21 + i * 6; ctx.polyRod(gf, [[xi, fl, z1], [xi, -1.0, z1 + 1], [x, -1.0, 42], [x, -1.0, 44], [x, 0.5, 44]], 0.08, 0x2f3438); ctx.cyl(gf, 0.16, 0.22, 12, k.C.wood, [x, 6, 44.5], { seg: 8 }); ctx.box(gf, 2.4, 0.15, 0.15, k.C.wood, [x, 11, 44.5], { edges: false }); ctx.rod(gf, [x, 0.5, 44.3], [x, 10.6, 44.3], 0.06, 0x2f3438, { edges: false }); }
      ctx.polyRod(gf, [[-21, 11.3, 44.5], [-110, 11.3, 44.5]], 0.025, k.C.wire); ctx.polyRod(gf, [[21, 11.3, 44.5], [110, 11.3, 44.5]], 0.025, k.C.wire);
      k.house(ids(p), -33, 6, 10, 4, 0.15, 4);
      k.trench(p + 'pc_cable', [[[-28, 0], [26, 0]], [[-8, 0], [-8, -27]], [[-8, 0], [-8, 23]], [[26, 0], [26, 18]]]);
      k.masts(p + 'cv_shield', [[-38, -40], [38, -40], [-38, 32], [38, 32]], 18, [[0, 1], [2, 3], [0, 2], [1, 3]]);
      const gd = k.grp(p + 'cv_drain'); ctx.box(gd, 4, 0.04, 80, 0x6f8f4c, [46, 0.02, -4], { edges: false, rough: 1 }); ctx.cyl(gd, 0.5, 0.5, 6, 0x9aa0a4, [52, -0.2, 20], { seg: 14, rot: [0, 0, Math.PI / 2], metal: 0.4 });
      ctx.box(k.grp(p + 'cv_road'), 6, 0.12, 14, 0x5c6064, [-27, 0.06, 43], { rough: 1, edgeOpacity: 0.15 });
      // context: street, houses, creek, trees
      const K = k.K; ctx.box(gx, 240, 0.04, 10, 0xffffff, [0, 0.02, 56], { map: K.asph(ctx, 40, 2), rough: 1, edges: false }); ctx.box(gx, 240, 0.08, 2, 0xd3d0c9, [0, 0.04, 49.5], { edges: false });
      [[-70, 78], [-40, 78], [-10, 78], [20, 78], [50, 78], [-80, -10], [-80, 25]].forEach(([x, z]) => { ctx.box(gx, 14, 3.2, 10, 0xd8d2c4, [x, 1.6, z], { edgeOpacity: 0.2 }); ctx.box(gx, 15, 0.3, 11, 0x6a6460, [x, 3.4, z], { edges: false }); });
      ctx.box(gx, 10, 0.04, 245, 0x4f86a8, [66, 0.03, -2], { opacity: 0.8, rough: 0.2, edges: false });
      K.trees(ctx, gx, [[58, -60, 1.6], [58, -30, 1.4], [74, 10, 1.7], [58, 40, 1.3], [-60, -70, 1.4], [-96, 60, 1.2], [90, -80, 1.5]], 0);
      k.flush();
      k.flood(1.0, [-120, 120, -125, 120], ['138/12.47 kV distribution substation', '2 × 30 MVA · 8 feeders', [0, 22, 0], 0.15]);
    },
  };
})();
