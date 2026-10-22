/* Building level: 1,800 sq ft one-story single-family house (1978) on a monolithic slab, 2x4 walls, Fink trusses on a 6:12 gable,
   asphalt shingles, vinyl siding, attached two-car garage, gas furnace and water heater in the garage, condenser at grade.
   x = length (west–east), z = depth (+z = front, facing the street), y = up. y = 0 is the lowest adjacent grade. Metres. */
(function () {
  const R = window.SubsystemModels = window.SubsystemModels || {};
  const X0 = -9.15, X1 = 9.15, HZ = 4.575, GX = 15.85, GZ = -2.125, FL = 0.3, GF = 0.2, PL = 2.74, P = 0.5, OH = 0.45;
  const A = Math.atan(P), RR = PL + HZ * P, GC = (GZ + HZ) / 2, GH = (HZ - GZ) / 2, GR = PL + GH * P;
  R['re-house'] = {
    env: 'prairie', caps: { subsurface: true, internals: true },
    connections: { power: ['rr_panel', 'rr_wiring'], ground: [], comms: [] },
    camera: { theta: 0.6, phi: 1.08, r: 44, target: [3, 1.6, 0] },
    thumbView: { theta: 0.6, phi: 1.02 },
    controls: [{ id: 'flood', label: 'Flood depth above lowest adjacent grade', min: 0, max: 1.5, step: 0.05, value: 0, unit: ' m', presets: [{ label: 'Off', v: 0 }, { label: 'Floor', v: 0.3 }, { label: '100-yr', v: 0.6 }, { label: '500-yr', v: 0.9 }] }],
    build(ctx) {
      const K = window.REKit, T = ctx.T, M = (x, y, z, r, s) => ctx.mat4([x, y, z], r, s), G = (node, o) => ctx.group(null, { node, ...(o || {}) });
      const I = (g, geo, col, list, o) => (list.length ? ctx.instanced(g, geo, col, list, { edges: false, ...(o || {}) }) : null);
      const C = { dry: 0xece9e2, trim: 0xf4f3ef, glass: 0x4f6b7c, wood: 0xc9a46c, cu: 0xc8834a, abs: 0x2f3236, conc: 0xc9c5bc };
      const rep = (base, rx, ry) => { const t = base.clone(); t.needsUpdate = true; t.wrapS = t.wrapT = T.RepeatWrapping; t.repeat.set(rx, ry); return t; };
      const lapB = K.tex(ctx, 64, 64, (c, w, h) => { c.fillStyle = '#c9cdbd'; c.fillRect(0, 0, w, h); const g = c.createLinearGradient(0, 0, 0, h / 2); g.addColorStop(0, 'rgba(0,0,0,0.12)'); g.addColorStop(1, 'rgba(255,255,255,0.08)'); c.fillStyle = g; c.fillRect(0, 0, w, h / 2); c.fillRect(0, h / 2, w, h / 2); c.fillStyle = 'rgba(0,0,0,0.22)'; c.fillRect(0, 0, w, 2); c.fillRect(0, h / 2, w, 2); }, 1, 1);
      const shB = K.tex(ctx, 128, 64, (c, w, h) => { c.fillStyle = '#6a6460'; c.fillRect(0, 0, w, h); const r = K.rnd(5); for (let row = 0; row < 4; row++) { const y = row * 16, off = row % 2 ? 11 : 0; for (let x = -off; x < w; x += 22 + Math.floor(r() * 10)) { c.fillStyle = 'rgba(0,0,0,' + (0.08 + r() * 0.18) + ')'; c.fillRect(x, y + 4, 3, 12); c.fillStyle = 'rgba(255,255,255,' + r() * 0.06 + ')'; c.fillRect(x + 3, y + 5, 18, 10); } c.fillStyle = 'rgba(0,0,0,0.35)'; c.fillRect(0, y + 15, w, 1); } }, 1, 1);
      const plyB = K.tex(ctx, 64, 64, (c, w, h) => { c.fillStyle = '#c7a776'; c.fillRect(0, 0, w, h); c.fillStyle = 'rgba(90,60,20,0.12)'; for (let i = 0; i < 12; i++) c.fillRect(0, i * 5 + 1, w, 1); c.fillStyle = 'rgba(60,40,10,0.5)'; c.fillRect(0, 0, w, 1); c.fillRect(0, 0, 1, h); }, 1, 1);
      ctx.ground({ x0: -24, x1: 30, z0: -22, z1: 20, depth: 2 });

      // context: driveway, walk, patio
      const cx = ctx.group(null, { context: true });
      ctx.box(cx, 5.7, 0.1, 11.5, 0xffffff, [12.5, 0.05, HZ + 5.75], { map: K.conc(ctx, 2, 4, true), rough: 0.9, edgeOpacity: 0.15 });
      ctx.box(cx, 1.2, 0.12, 2.6, 0xffffff, [2.55, 0.06, HZ + 1.3], { map: K.conc(ctx, 1, 1), rough: 0.9, edgeOpacity: 0.15 });
      ctx.box(cx, 7.1, 0.1, 1.2, 0xffffff, [6.1, 0.05, HZ + 3.2], { map: K.conc(ctx, 3, 1), rough: 0.9, edges: false });
      ctx.box(cx, 3.6, 0.1, 3.4, 0xffffff, [4.5, 0.05, -HZ - 1.7], { map: K.conc(ctx, 2, 2, true), rough: 0.9, edgeOpacity: 0.15 });

      // ---------- foundation & floor ----------
      const ftg = G('rr_ftg');
      [[X0, GX, HZ - 0.15], [X0, X1, -HZ + 0.15], [X1, GX, GZ + 0.15]].forEach(([a, b, z]) => ctx.box(ftg, b - a, 0.6, 0.3, C.conc, [(a + b) / 2, -0.1, z], { edgeOpacity: 0.25 }));
      [[X0 + 0.15, -HZ, HZ], [GX - 0.15, GZ, HZ], [X1, -HZ, GZ]].forEach(([x, a, b]) => ctx.box(ftg, 0.3, 0.6, b - a, C.conc, [x, -0.1, (a + b) / 2], { edgeOpacity: 0.25 }));
      const slab = G('rr_slab');
      ctx.box(slab, X1 - X0, 0.1, 2 * HZ, 0xffffff, [0, FL - 0.05, 0], { map: K.conc(ctx, 6, 3, false, '#d3d0c9'), rough: 0.85, edgeOpacity: 0.2 });
      ctx.box(slab, GX - X1, 0.1, HZ - GZ, 0xffffff, [(X1 + GX) / 2, GF - 0.05, GC], { map: K.conc(ctx, 2, 2, true, '#cfccc4'), rough: 0.85, edgeOpacity: 0.2 });
      ctx.box(slab, X1 - X0, FL - 0.1, 2 * HZ, 0xbdb7aa, [0, (FL - 0.1) / 2, 0], { edges: false });

      // ---------- walls ----------
      const w = (x0, x1, y0, y1, k) => ({ a0: x0, a1: x1, y0, y1, k });
      const WALLS = [
        { ax: 'x', c: HZ, out: 1, a0: X0, a1: X1, y0: FL, house: true, ops: [w(-8.0, -6.8, 1.2, 2.4, 'w'), w(-4.4, -3.2, 1.2, 2.4, 'w'), w(-1.2, 1.2, 0.9, 2.4, 'w'), w(2.1, 3.0, FL, 2.33, 'd'), w(5.8, 7.3, 1.2, 2.4, 'w')] },
        { ax: 'x', c: -HZ, out: -1, a0: X0, a1: X1, y0: FL, house: true, ops: [w(-7.8, -6.3, 1.2, 2.4, 'w'), w(-4.4, -3.8, 1.8, 2.4, 'w'), w(0.4, 1.6, 1.4, 2.4, 'w'), w(3.6, 5.4, FL, 2.33, 's')] },
        { ax: 'z', c: X0, out: -1, a0: -HZ, a1: HZ, y0: FL, house: true, ops: [w(1.9, 3.1, 1.2, 2.4, 'w'), w(-3.1, -1.9, 1.2, 2.4, 'w')] },
        { ax: 'z', c: X1, out: 1, a0: -HZ, a1: HZ, y0: FL, house: true, ext: [-HZ, GZ], ops: [w(-1.0, -0.1, FL, 2.33, 'd')] },
        { ax: 'x', c: HZ, out: 1, a0: X1, a1: GX, y0: GF, ops: [w(10.0, 14.9, GF, 2.33, 'g')] },
        { ax: 'z', c: GX, out: 1, a0: GZ, a1: HZ, y0: GF, ops: [w(-1.4, -0.5, GF, 2.23, 'd')] },
        { ax: 'x', c: GZ, out: -1, a0: X1, a1: GX, y0: GF, ops: [w(12.0, 12.9, 1.2, 2.1, 'w')] },
      ];
      const face = (g, W, d, th, y0, y1, col, o, span, base) => {
        const a0 = span ? span[0] : W.a0, a1 = span ? span[1] : W.a1, c = W.c - W.out * d;
        const put = (p0, p1, q0, q1) => {
          if (p1 - p0 < 0.01 || q1 - q0 < 0.01) return;
          const ww = p1 - p0, hh = q1 - q0, m = (p0 + p1) / 2, yc = (q0 + q1) / 2, oo = base ? { ...o, map: rep(base, ww / 2, hh / 0.2) } : o;
          if (W.ax === 'x') ctx.box(g, ww, hh, th, col, [m, yc, c], oo); else ctx.box(g, th, hh, ww, col, [c, yc, m], oo);
        };
        let p = a0;
        W.ops.filter((op) => op.a1 > a0 && op.a0 < a1).sort((a, b) => a.a0 - b.a0).forEach((op) => { put(p, op.a0, y0, y1); put(op.a0, op.a1, y0, Math.max(y0, op.y0)); put(op.a0, op.a1, op.y1, y1); p = op.a1; });
        put(p, a1, y0, y1);
      };
      const exDir = (W, k) => (W.ax === 'x' ? [0, 0, W.out * k] : [W.out * k, 0, 0]);

      // framing
      const st = G('rr_studs'), sX = [], sZ = [];
      WALLS.forEach((W) => {
        const d = 0.057, c = W.c - W.out * d, h = PL - W.y0, inOp = (a) => W.ops.some((op) => a > op.a0 - 0.03 && a < op.a1 + 0.03);
        const push = (a, y, hh) => (W.ax === 'x' ? sX : sZ).push(W.ax === 'x' ? M(a, y, c, null, [1, hh, 1]) : M(c, y, a, null, [1, hh, 1]));
        for (let a = W.a0 + 0.05; a < W.a1 - 0.02; a += 0.406) if (!inOp(a)) push(a, W.y0 + h / 2, h);
        W.ops.forEach((op) => { [op.a0 - 0.02, op.a1 + 0.02].forEach((a) => push(a, W.y0 + h / 2, h)); const hy = op.y1 + 0.1; if (W.ax === 'x') ctx.box(st, op.a1 - op.a0 + 0.1, 0.2, 0.09, C.wood, [(op.a0 + op.a1) / 2, hy, c], { edges: false }); else ctx.box(st, 0.09, 0.2, op.a1 - op.a0 + 0.1, C.wood, [c, hy, (op.a0 + op.a1) / 2], { edges: false }); });
        [W.y0 + 0.02, PL - 0.06, PL - 0.02].forEach((y) => { if (W.ax === 'x') ctx.box(st, W.a1 - W.a0, 0.038, 0.09, C.wood, [(W.a0 + W.a1) / 2, y, c], { edges: false }); else ctx.box(st, 0.09, 0.038, W.a1 - W.a0, C.wood, [c, y, (W.a0 + W.a1) / 2], { edges: false }); });
      });
      I(st, new T.BoxGeometry(0.038, 1, 0.09), C.wood, sX); I(st, new T.BoxGeometry(0.09, 1, 0.038), C.wood, sZ);

      // sheathing, insulation, siding, interior drywall on exterior walls
      WALLS.forEach((W) => {
        face(ctx.group(null, { node: 'rr_sheath', shell: true, explode: exDir(W, 1.2) }), W, 0.006, 0.012, W.y0 - 0.1, PL, 0xffffff, { map: rep(plyB, 4, 1), rough: 0.9, edgeOpacity: 0.15 }, W.ext);
        face(ctx.group(null, { node: 'rr_siding', shell: true, explode: exDir(W, 2.6) }), W, -0.008, 0.016, W.y0 - 0.15, PL, 0xffffff, { rough: 0.7, edgeOpacity: 0.12 }, W.ext, lapB);
        if (W.house) { face(ctx.group(null, { node: 'rr_wins' }), W, 0.057, 0.08, W.y0, PL - 0.08, 0xe9b3b6, { rough: 1, edges: false }); face(ctx.group(null, { node: 'rr_dry' }), W, 0.109, 0.013, W.y0, PL, C.dry, { edges: false }); }
      });
      // gable ends: sheathing + siding triangles
      const gable = (x, z0, z1, ridge, inward) => {
        const sh = new T.Shape(), zc = (z0 + z1) / 2; sh.moveTo(z0, PL); sh.lineTo(z1, PL); sh.lineTo(zc, ridge); sh.lineTo(z0, PL);
        [['rr_sheath', 0.012, 0, 0xc7a776, 1.2], ['rr_siding', 0.016, -0.016, 0xc9cdbd, 2.6]].forEach(([node, th, off, col, ex]) => {
          const geo = new T.ExtrudeGeometry(sh, { depth: th, bevelEnabled: false }); geo.rotateY(-Math.PI / 2);
          const g = ctx.group(null, { node, shell: true, explode: [-inward * ex, 0, 0] });
          ctx.mesh(g, geo, col, { pos: [inward > 0 ? x + th - off : x + off, 0, 0], rough: 0.75 });
        });
      };
      gable(X0, -HZ, HZ, RR, 1); gable(X1, -HZ, HZ, RR, -1); gable(GX, GZ, HZ, GR, -1);

      // openings
      const win = G('rr_win'), dor = G('rr_door'), gd = G('rr_gdoor');
      const gdTex = K.tex(ctx, 64, 64, (c, ww, hh) => { c.fillStyle = '#eceae4'; c.fillRect(0, 0, ww, hh); c.fillStyle = 'rgba(0,0,0,0.16)'; for (let i = 0; i < 4; i++) { c.fillRect(0, i * 16, ww, 1); c.fillRect(4, i * 16 + 4, ww - 8, 1); c.fillRect(4, i * 16 + 12, ww - 8, 1); } }, 1, 1);
      WALLS.forEach((W) => W.ops.forEach((op) => {
        const ww = op.a1 - op.a0, hh = op.y1 - op.y0, m = (op.a0 + op.a1) / 2, yc = (op.y0 + op.y1) / 2;
        const bx = (g, a, b, t, col, pos, d, o) => (W.ax === 'x' ? ctx.box(g, a, b, t, col, [pos, yc + (d || 0), W.c - W.out * (o || 0)], {}) : ctx.box(g, t, b, a, col, [W.c - W.out * (o || 0), yc + (d || 0), pos], {}));
        const frame = (g, col) => { const f = (a, b, p, dy) => (W.ax === 'x' ? ctx.box(g, a, b, 0.08, col, [p, yc + dy, W.c + W.out * 0.01], { edges: false }) : ctx.box(g, 0.08, b, a, col, [W.c + W.out * 0.01, yc + dy, p], { edges: false })); f(ww + 0.1, 0.06, m, hh / 2); f(ww + 0.1, 0.06, m, -hh / 2); f(0.06, hh, op.a0, 0); f(0.06, hh, op.a1, 0); return f; };
        if (op.k === 'w') { const f = frame(win, C.trim); f(ww, 0.05, m, 0); if (W.ax === 'x') ctx.box(win, ww, hh, 0.02, C.glass, [m, yc, W.c - W.out * 0.05], { metal: 0.45, rough: 0.12, opacity: 0.7, edges: false }); else ctx.box(win, 0.02, hh, ww, C.glass, [W.c - W.out * 0.05, yc, m], { metal: 0.45, rough: 0.12, opacity: 0.7, edges: false }); }
        else if (op.k === 's') { const f = frame(dor, C.trim); f(0.06, hh, m, 0); if (W.ax === 'x') ctx.box(dor, ww, hh, 0.02, C.glass, [m, yc, W.c - W.out * 0.05], { metal: 0.45, rough: 0.12, opacity: 0.7, edges: false }); }
        else if (op.k === 'd') { frame(dor, C.trim); bx(dor, ww - 0.04, hh - 0.02, 0.045, W.c === HZ ? 0x7b3b2e : 0xd8d3c8, m, 0, 0.03); }
        else if (op.k === 'g') { frame(gd, C.trim); if (W.ax === 'x') ctx.box(gd, ww, hh, 0.04, 0xffffff, [m, yc, W.c - W.out * 0.03], { map: rep(gdTex, 1, 1), rough: 0.6 }); }
      }));

      // ---------- roof ----------
      const SEG = (list, x, z1, y1, z2, y2) => { const dz = z2 - z1, dy = y2 - y1; list.push(M(x, (y1 + y2) / 2, (z1 + z2) / 2, [Math.atan2(dz, dy), 0, 0], [1, Math.hypot(dz, dy), 1])); };
      const tr = G('rr_truss'), tl = [], cn = G('rr_conn'), cl = [];
      const truss = (x, zc, half, ridge) => {
        const ez = half + OH, ey = PL - OH * P;
        [-1, 1].forEach((s) => { SEG(tl, x, zc + s * ez, ey, zc, ridge); SEG(tl, x, zc + s * half / 3, PL, zc, ridge); SEG(tl, x, zc + s * half / 3, PL, zc + s * half * 2 / 3, PL + half / 3 * P); cl.push(M(x, PL + 0.04, zc + s * (half - 0.05))); });
        SEG(tl, x, zc - half, PL, zc + half, PL);
      };
      for (let x = X0 + 0.05; x <= X1 - 0.02; x += 0.61) truss(x, 0, HZ, RR);
      for (let x = X1 + 0.3; x <= GX - 0.02; x += 0.61) truss(x, GC, GH, GR);
      I(tr, new T.BoxGeometry(0.038, 1, 0.09), C.wood, tl); I(cn, new T.BoxGeometry(0.06, 0.06, 0.12), 0x55595d, cl, { metal: 0.6 });
      const plane = (g, xc, wx, zc, half, ridge, s, t, off, col, o) => {
        const hz = half + OH, len = hz / Math.cos(A), z = zc + s * hz / 2 + s * off * Math.sin(A), y = ridge - (hz / 2) * P + off * Math.cos(A);
        ctx.box(g, wx, t, len, col, [xc, y, z], { rot: [s * A, 0, 0], ...o, map: o.mapB ? rep(o.mapB, wx / o.tile[0], len / o.tile[1]) : undefined });
      };
      const R0 = RR + 0.05 / Math.cos(A), G0 = GR + 0.05 / Math.cos(A);
      const roofs = [[0, X1 - X0 + 2 * OH, 0, HZ, R0], [(X1 + GX + OH) / 2, GX - X1 + OH, GC, GH, G0]];
      [['rr_deck', 0.012, 0.006, 0xffffff, { mapB: plyB, tile: [2.44, 1.22], rough: 0.9, edgeOpacity: 0.2 }, 1.6], ['rr_under', 0.003, 0.016, 0x3b3d40, { rough: 1, edges: false }, 3.0], ['rr_shing', 0.012, 0.026, 0xffffff, { mapB: shB, tile: [1, 0.56], rough: 0.95, edgeOpacity: 0.15 }, 4.6]].forEach(([node, t, off, col, o, ex]) => {
        roofs.forEach(([xc, wx, zc, half, ridge]) => [-1, 1].forEach((s) => plane(ctx.group(null, { node, shell: true, explode: [0, ex, 0] }), xc, wx, zc, half, ridge, s, t, off, col, o)));
      });
      const ed = G('rr_edge');
      roofs.forEach(([xc, wx, zc, half, ridge]) => {
        const ey = PL - OH * P;
        [-1, 1].forEach((s) => { ctx.box(ed, wx, 0.16, 0.025, C.trim, [xc, ey - 0.03, zc + s * (half + OH)], { edges: false }); ctx.box(ed, wx, 0.012, OH, 0xe6e6e1, [xc, ey - 0.1, zc + s * (half + OH / 2)], { edges: false }); });
      });
      [[X0 - OH, 0, HZ, R0], [GX + OH, GC, GH, G0]].forEach(([x, zc, half, ridge]) => [-1, 1].forEach((s) => { const hz = half + OH, len = hz / Math.cos(A); ctx.box(ed, 0.025, 0.16, len, C.trim, [x, ridge - (hz / 2) * P - 0.05, zc + s * hz / 2], { rot: [s * A, 0, 0], edges: false }); }));
      const gu = G('rr_gutter'), ds = [];
      roofs.forEach(([xc, wx, zc, half]) => [-1, 1].forEach((s) => ctx.box(gu, wx, 0.12, 0.13, 0xf0efea, [xc, PL - OH * P - 0.08, zc + s * (half + OH + 0.07)], { metal: 0.3 })));
      [[X0 - 0.3, HZ + OH + 0.07], [8.8, HZ + OH + 0.07], [GX + 0.3, HZ + OH + 0.07], [X0 - 0.3, -HZ - OH - 0.07], [8.8, -HZ - OH - 0.07]].forEach(([x, z]) => ds.push(M(x, (PL - OH * P) / 2, z, null, [1, PL - OH * P, 1])));
      I(gu, new T.BoxGeometry(0.07, 1, 0.09), 0xf0efea, ds);
      const at = G('rr_attic', { shell: true, explode: [0, 1.2, 0] });
      ctx.box(at, X1 - X0 - 0.2, 0.22, 2 * HZ - 0.3, 0xe3d6a8, [0, PL + 0.12, 0], { rough: 1, edgeOpacity: 0.12 });
      ctx.box(at, X1 - X0 - 0.6, 0.06, 0.3, 0x55504c, [0, RR + 0.12, 0], { edges: false });

      // ---------- fixed services ----------
      const pn = G('rr_panel');
      ctx.box(pn, 0.3, 0.45, 0.12, 0x9ea5aa, [14.6, 1.6, GZ - 0.08], { metal: 0.3 }); ctx.cyl(pn, 0.08, 0.08, 0.04, 0xd9dcde, [14.6, 1.62, GZ - 0.15], { seg: 14, rot: [Math.PI / 2, 0, 0], edges: false });
      ctx.rod(pn, [14.6, 1.83, GZ - 0.12], [14.6, 3.7, GZ - 0.12], 0.03, 0x8e979e, { edges: false }); ctx.box(pn, 0.12, 0.1, 0.12, 0x3d4349, [14.6, 3.72, GZ - 0.12]);
      ctx.box(pn, 0.36, 0.76, 0.1, 0x8e979e, [14.6, GF + 1.0 + 0.38, GZ + 0.16], { metal: 0.3 });
      const wi = G('rr_wiring'), ol = [];
      WALLS.filter((W) => W.house).forEach((W) => { const c = W.c - W.out * 0.12; for (let a = W.a0 + 1.2; a < W.a1 - 0.5; a += 3.6) if (!W.ops.some((op) => a > op.a0 - 0.2 && a < op.a1 + 0.2)) ol.push(W.ax === 'x' ? M(a, FL + 0.3, c) : M(c, FL + 0.3, a, [0, Math.PI / 2, 0])); });
      I(wi, new T.BoxGeometry(0.07, 0.11, 0.02), 0xf6f6f2, ol);
      [-2.0, 2.0].forEach((z) => ctx.polyRod(wi, [[14.6, GF + 1.76, GZ + 0.18], [14.6, PL + 0.12, GZ + 0.3], [14.6, PL + 0.12, z], [-8.5, PL + 0.12, z]], 0.012, 0xe8e0c8));
      const fu = G('rr_furn');
      ctx.box(fu, 0.9, 0.46, 0.9, C.wood, [15.25, GF + 0.23, -1.45]); ctx.box(fu, 0.55, 1.25, 0.7, 0xd9dcde, [15.25, GF + 0.46 + 0.625, -1.45], { metal: 0.25 });
      ctx.box(fu, 0.55, 0.35, 0.7, 0xb9bec2, [15.25, GF + 1.71 + 0.18, -1.45], { metal: 0.3 }); ctx.rod(fu, [15.0, GF + 1.71, -1.3], [15.0, 3.6, -1.3], 0.06, 0xa3aaaf, { edges: false });
      const co = G('rr_cond');
      ctx.box(co, 0.95, 0.1, 0.95, C.conc, [7.8, 0.05, -HZ - 1.0]); ctx.box(co, 0.75, 0.8, 0.75, 0xd3d7d9, [7.8, 0.5, -HZ - 1.0], { metal: 0.25 }); ctx.cyl(co, 0.3, 0.3, 0.03, 0x3d4349, [7.8, 0.92, -HZ - 1.0], { seg: 18, edges: false });
      ctx.polyRod(co, [[7.8, 0.55, -HZ - 0.62], [7.8, 0.55, -HZ - 0.05], [7.8, 2.45, -HZ - 0.05], [7.8, PL + 0.18, -HZ + 0.4], [7.8, PL + 0.18, -1.45], [15.1, PL + 0.18, -1.45], [15.1, GF + 1.95, -1.45]], 0.02, 0x2b2f33);
      const du = G('rr_duct'), rg = [];
      ctx.box(du, 0.5, PL - GF - 2.06, 0.5, 0xbfc5c9, [15.25, (PL + GF + 2.06) / 2, -1.45], { metal: 0.45 });
      ctx.rod(du, [15.25, PL, -1.45], [15.25, PL + 0.4, -1.45], 0.18, 0xbfc5c9, { edges: false });
      ctx.box(du, 22.8, 0.25, 0.4, 0xbfc5c9, [3.85, PL + 0.5, -0.6], { metal: 0.45 });
      [[-7.4, 2.6], [-3.8, 2.6], [-7, -2.5], [-4.1, -3.5], [-2.7, -3.5], [1, 2.3], [6.8, 2.3], [2, -2.3], [7.9, -3]].forEach(([x, z]) => { ctx.polyRod(du, [[x, PL + 0.45, -0.6], [x, PL + 0.3, (z - 0.6) / 2], [x, PL + 0.04, z]], 0.07, 0xd2d6d8); rg.push(M(x, PL - 0.012, z)); });
      I(du, new T.BoxGeometry(0.3, 0.02, 0.18), 0xf4f4f2, rg); ctx.box(du, 0.6, 0.02, 0.6, 0xf4f4f2, [-5.5, PL - 0.012, 0.1], { edges: false });
      const wh = G('rr_wh');
      ctx.box(wh, 0.7, 0.46, 0.7, C.wood, [14.35, GF + 0.23, -1.5]); ctx.cyl(wh, 0.27, 0.27, 1.35, 0xeceeee, [14.35, GF + 0.46 + 0.675, -1.5], { seg: 18 }); ctx.rod(wh, [14.35, GF + 1.81, -1.5], [14.35, 3.6, -1.5], 0.05, 0xa3aaaf, { edges: false });
      const pp = G('rr_pipe');
      ctx.polyRod(pp, [[-1.0, -0.25, HZ + 0.9], [-1.0, -0.25, -0.9], [14.2, -0.25, -0.9], [14.2, GF + 0.5, -0.9], [14.2, GF + 0.5, -1.3]], 0.015, C.cu);
      ctx.polyRod(pp, [[14.5, GF + 1.85, -1.5], [14.5, PL + 0.15, -1.5], [8.9, PL + 0.15, -1.5], [8.9, PL + 0.15, -3.6], [-4.1, PL + 0.15, -3.6], [-4.1, FL + 0.6, -3.6]], 0.012, C.cu);
      ctx.polyRod(pp, [[1.0, PL + 0.15, -3.6], [1.0, FL + 0.8, -4.2]], 0.012, C.cu); ctx.polyRod(pp, [[-2.7, PL + 0.15, -3.6], [-2.7, FL + 0.6, -3.6]], 0.012, C.cu);
      ctx.polyRod(pp, [[1.0, -0.35, -4.1], [-4.1, -0.4, -4.1], [-4.1, -0.4, -3.6]], 0.04, C.abs); ctx.polyRod(pp, [[-3.4, -0.4, -4.1], [-3.4, -0.5, HZ], [-3.4, -0.6, HZ + 1.6]], 0.05, C.abs);
      ctx.rod(pp, [-3.4, FL, -3.9], [-3.4, RR - 3.9 * P + 0.35, -3.9], 0.04, C.abs, { edges: false }); ctx.rod(pp, [8.2, -0.35, -4.1], [8.2, FL + 0.9, -4.3], 0.03, C.abs, { edges: false }); ctx.polyRod(pp, [[8.2, -0.35, -4.1], [1.0, -0.35, -4.1]], 0.04, C.abs);
      const bf = G('rr_ao_backflow');
      ctx.cyl(bf, 0.09, 0.09, 0.45, 0x2f6a4a, [-3.4, -0.6, HZ + 1.6], { seg: 12, rot: [Math.PI / 2, 0, 0] }); ctx.rod(bf, [-3.4, -0.55, HZ + 1.6], [-3.4, 0.02, HZ + 1.6], 0.08, 0x2f6a4a, { edges: false }); ctx.cyl(bf, 0.18, 0.18, 0.04, 0x2f7d4f, [-3.4, 0.03, HZ + 1.6], { seg: 16 });

      // ---------- interior finishes ----------
      const dr = G('rr_dry'), PT = [[-5.6, 0.7, HZ, 'z'], [-2.0, -HZ, -0.5, 'z'], [-2.0, 0.7, HZ, 'z'], [0.7, X0, -2.0, 'x'], [-0.5, X0, -2.0, 'x'], [-2.4, -4.8, -2.0, 'x'], [-3.4, -HZ, -2.4, 'z'], [-4.8, -HZ, -0.5, 'z'], [6.6, -HZ, -1.5, 'z'], [-1.5, 6.6, X1, 'x']];
      PT.forEach(([c, a, b, ax]) => (ax === 'z' ? ctx.box(dr, 0.11, PL - FL, b - a, C.dry, [c, (PL + FL) / 2, (a + b) / 2], { edgeOpacity: 0.12 }) : ctx.box(dr, b - a, PL - FL, 0.11, C.dry, [(a + b) / 2, (PL + FL) / 2, c], { edgeOpacity: 0.12 })));
      ctx.box(dr, 0.016, PL - GF, HZ - GZ, C.dry, [X1 + 0.11, (PL + GF) / 2, GC], { edges: false });
      const ce = G('rr_dry', { shell: true, explode: [0, 0.8, 0] });
      ctx.box(ce, X1 - X0 - 0.2, 0.013, 2 * HZ - 0.2, C.dry, [0, PL - 0.007, 0], { edgeOpacity: 0.12 }); ctx.box(ce, GX - X1 - 0.2, 0.016, HZ - GZ - 0.2, C.dry, [(X1 + GX) / 2, PL - 0.008, GC], { edgeOpacity: 0.12 });
      const fl = G('rr_floor'), CAR = 0xc8b89f, VIN = 0xc9b193, TIL = 0xe4e3de;
      [[X0, -5.6, 0.7, HZ, CAR], [-5.6, -2.0, 0.7, HZ, 0xbfb29c], [X0, -2.0, -0.5, 0.7, CAR], [X0, -4.8, -HZ, -0.5, 0xbcae96], [-4.8, -3.4, -HZ, -2.4, TIL], [-3.4, -2.0, -HZ, -2.4, TIL], [-4.8, -2.0, -2.4, -0.5, CAR], [-2.0, 4.6, 0, HZ, 0xb9ab95], [4.6, X1, 0, HZ, VIN], [-2.0, 6.6, -HZ, 0, VIN], [6.6, X1, -HZ, 0, 0xcfc8ba]].forEach(([a, b, c, d, col]) => ctx.box(fl, b - a - 0.02, 0.012, d - c - 0.02, col, [(a + b) / 2, FL + 0.006, (c + d) / 2], { edges: false }));
      const cb = G('rr_cab'), zc = -HZ + 0.11 + 0.3;
      [[-1.8, 1.6], [2.36, 3.4]].forEach(([a, b]) => { ctx.box(cb, b - a, 0.87, 0.6, 0xd6c6a8, [(a + b) / 2, FL + 0.435, zc]); });
      ctx.box(cb, 5.2, 0.04, 0.63, 0x5b5148, [0.8, FL + 0.89, zc], { edges: false });
      [[-1.8, 0.3], [1.7, 3.4]].forEach(([a, b]) => ctx.box(cb, b - a, 0.76, 0.33, 0xd6c6a8, [(a + b) / 2, FL + 1.75, -HZ + 0.11 + 0.165]));
      const ap = G('rr_appl');
      ctx.box(ap, 0.76, 0.9, 0.62, 0xd5d8da, [1.98, FL + 0.45, zc], { metal: 0.4 }); ctx.box(ap, 0.72, 0.02, 0.58, 0x1f2326, [1.98, FL + 0.91, zc], { edges: false });
      ctx.box(ap, 0.76, 0.4, 0.38, 0xd5d8da, [1.98, FL + 1.75, -HZ + 0.3], { metal: 0.4 }); ctx.box(ap, 0.6, 0.82, 0.03, 0xd5d8da, [1.25, FL + 0.43, zc + 0.31], { metal: 0.4, edges: false });
      const ba = G('rr_bath');
      [-4.1, -2.7].forEach((x) => { ctx.box(ba, 1.3, 0.5, 0.75, 0xf4f4f2, [x, FL + 0.25, -HZ + 0.11 + 0.38]); ctx.box(ba, 1.3, 1.5, 0.02, 0xdfe3e2, [x, FL + 1.25, -HZ + 0.12]); ctx.box(ba, 0.4, 0.75, 0.65, 0xf4f4f2, [x - 0.35, FL + 0.38, -2.95]); ctx.box(ba, 0.6, 0.85, 0.5, 0xb59a7a, [x + 0.3, FL + 0.43, -2.7]); });
      const tm = G('rr_trim'), dl = [];
      [[-7.0, 0.7, 'x'], [-3.0, 0.7, 'x'], [-6.0, -0.5, 'x'], [-3.5, -0.5, 'x'], [-4.1, -2.4, 'x'], [-2.7, -2.4, 'x'], [8.0, -1.5, 'x']].forEach(([a, c]) => [-1, 1].forEach((s) => dl.push(M(a, FL + 1.02, c + s * 0.065))));
      I(tm, new T.BoxGeometry(0.8, 2.03, 0.02), 0xf2efe8, dl, { edges: true, edgeOpacity: 0.25 });

      // ---------- contents ----------
      const fn = G('rr_furnish');
      ctx.box(fn, 1.0, 0.55, 2.0, 0x8fa0b3, [-7.4, FL + 0.28, 2.6]); ctx.box(fn, 1.0, 0.55, 2.0, 0xb3a28f, [-3.8, FL + 0.28, 2.6]); ctx.box(fn, 2.1, 0.6, 1.6, 0x9aa79a, [-7.2, FL + 0.3, -2.5]);
      ctx.box(fn, 2.2, 0.85, 0.9, 0x6f7d8c, [1.0, FL + 0.43, 3.9]); ctx.box(fn, 1.2, 0.45, 0.6, 0x8a6d4f, [1.0, FL + 0.23, 2.6]); ctx.box(fn, 1.8, 0.05, 1.0, 0x8a6d4f, [6.9, FL + 0.75, 2.3]);
      [[6.3, 1.6], [7.5, 1.6], [6.3, 3.0], [7.5, 3.0]].forEach(([x, z]) => ctx.box(fn, 0.45, 0.9, 0.45, 0x7a5f45, [x, FL + 0.45, z]));
      const ac = G('rr_appl_c');
      ctx.box(ac, 0.9, 1.75, 0.8, 0xe6e8e9, [3.95, FL + 0.88, -HZ + 0.55], { metal: 0.3 }); [7.2, 7.95].forEach((x) => ctx.box(ac, 0.68, 0.9, 0.7, 0xf2f3f3, [x, FL + 0.45, -HZ + 0.5]));

      const lab = ctx.label('Single-family house', [3, 7.0, 0], { sub: '1,800 sq ft · one story · 1978' });
      const wat = K.water(ctx, -24, 30, -22, 20);
      ctx.onUpdate((v) => {
        const d = +v.flood || 0; wat.set(d);
        if (d > 0.005) lab.set('Water ' + d.toFixed(2) + ' m above grade', d < FL ? (FL - d).toFixed(2) + ' m below the floor' + (d > GF ? ' · garage wet' : '') : (d - FL).toFixed(2) + ' m over the floor', d < FL ? '#2f97b5' : '#d9675e');
        else lab.set('Single-family house', '1,800 sq ft · one story · 1978');
      });
    },
  };
})();
