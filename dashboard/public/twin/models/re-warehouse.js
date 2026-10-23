/* Building level: 100,000 sq ft dock-high distribution warehouse, pre-engineered steel. x = length (west–east), z = width
   (+z = south, the dock side), y = up. y = 0 is the truck court, the building's lowest adjacent grade. Metres.
   Also defines window.REKit, shared by the real-estate site and retail models. */
(function () {
  const rnd = (seed) => () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const K = window.REKit = window.REKit || {
    rnd,
    tex(ctx, w, h, draw, rx, ry) { const t = ctx.texture(w, h, draw); t.wrapS = t.wrapT = ctx.T.RepeatWrapping; t.repeat.set(rx || 1, ry || 1); return t; },
    ribs(ctx, rx, base, line, ry) { return K.tex(ctx, 64, 64, (c, w, h) => { c.fillStyle = base; c.fillRect(0, 0, w, h); c.fillStyle = line; c.fillRect(0, 0, 5, h); c.fillStyle = 'rgba(255,255,255,0.35)'; c.fillRect(6, 0, 3, h); c.fillStyle = 'rgba(0,0,0,0.05)'; c.fillRect(32, 0, 2, h); }, rx, ry || 1); },
    conc(ctx, rx, ry, joint, base) { const r = rnd(7); return K.tex(ctx, 128, 128, (c, w, h) => { c.fillStyle = base || '#cbc8c1'; c.fillRect(0, 0, w, h); for (let i = 0; i < 900; i++) { c.fillStyle = ['rgba(0,0,0,0.04)', 'rgba(255,255,255,0.18)', 'rgba(0,0,0,0.07)'][i % 3]; c.fillRect(r() * w, r() * h, 2, 2); } if (joint) { c.fillStyle = 'rgba(70,70,70,0.35)'; c.fillRect(0, 0, w, 2); c.fillRect(0, 0, 2, h); } }, rx, ry); },
    asph(ctx, rx, ry) { const r = rnd(3); return K.tex(ctx, 128, 128, (c, w, h) => { c.fillStyle = '#5c6064'; c.fillRect(0, 0, w, h); for (let i = 0; i < 1400; i++) { c.fillStyle = ['rgba(255,255,255,0.08)', 'rgba(0,0,0,0.12)'][i % 2]; c.fillRect(r() * w, r() * h, 2, 2); } }, rx, ry); },
    stalls(ctx, rx, ry, stallW) { return K.tex(ctx, 128, 128, (c, w, h) => { c.fillStyle = '#5c6064'; c.fillRect(0, 0, w, h); c.fillStyle = '#e8e6df'; c.fillRect(0, 0, 4, h * 0.9); }, rx, ry); },
    water(ctx, x0, x1, z0, z1) {
      const T = ctx.T, m = new T.Mesh(new T.BoxGeometry(x1 - x0, 1, z1 - z0), new T.MeshStandardMaterial({ color: 0x4f86a8, transparent: true, opacity: 0.42, roughness: 0.25, metalness: 0, depthWrite: false }));
      m.position.set((x0 + x1) / 2, 0.5, (z0 + z1) / 2); m.userData.fx = true; m.renderOrder = 4; m.visible = false; m.castShadow = false; m.raycast = () => {}; ctx.root.add(m);
      return { set(d) { m.visible = d > 0.005; m.scale.y = Math.max(0.001, d); m.position.y = d / 2; } };
    },
    trees(ctx, g, pts, y0) {
      const T = ctx.T, tr = [], cr = [];
      pts.forEach(([x, z, k]) => { const s = k || 1; tr.push(ctx.mat4([x, (y0 || 0) + 1.2 * s, z], null, [1, s, 1])); cr.push(ctx.mat4([x, (y0 || 0) + 3.6 * s, z], [0, x * 0.7, 0], [s, s * 1.05, s])); });
      ctx.instanced(g, new T.CylinderGeometry(0.14, 0.2, 2.4, 6), 0x6b5440, tr); ctx.instanced(g, new T.IcosahedronGeometry(1.9, 0), 0x5f8048, cr, { rough: 0.95, metal: 0 });
    },
    colorize(m, list) { if (!m) return; const T = window.THREE, c = new T.Color(); list.forEach((hex, i) => m.setColorAt(i, c.setHex(hex))); if (m.instanceColor) m.instanceColor.needsUpdate = true; },
    cars(ctx, g, list, y0) {
      const T = ctx.T, b = [], t = [], cols = [0x8b939a, 0xe9e9e6, 0x2c3238, 0x9f2d2b, 0x3f5e86, 0xc7c9c4, 0x55606a], bc = [];
      list.forEach(([x, z, ry], i) => { b.push(ctx.mat4([x, (y0 || 0) + 0.6, z], [0, ry || 0, 0])); t.push(ctx.mat4([x, (y0 || 0) + 1.25, z], [0, ry || 0, 0])); bc.push(cols[(i * 5 + 3) % cols.length]); });
      K.colorize(ctx.instanced(g, new T.BoxGeometry(1.8, 0.75, 4.4), 0xffffff, b, { metal: 0.3, rough: 0.4 }), bc);
      ctx.instanced(g, new T.BoxGeometry(1.6, 0.55, 2.2), 0x3a4148, t, { metal: 0.4, rough: 0.3 });
    },
    trailer(ctx, g, x, z, ry, y0) {
      const p = ctx.group(g, { pos: [x, y0 || 0, z], rot: [0, ry || 0, 0] });
      ctx.box(p, 2.6, 2.9, 16.2, 0xf0f0ed, [0, 2.7, 0], { edgeOpacity: 0.25 }); ctx.box(p, 2.62, 0.22, 16.22, 0x2f6fb8, [0, 3.7, 0], { edges: false });
      ctx.box(p, 2.3, 0.28, 15.8, 0x3a3f44, [0, 1.1, 0], { edges: false });
      [-6.6, -5.3].forEach((zz) => [-0.95, 0.95].forEach((sx) => ctx.cyl(p, 0.5, 0.5, 0.42, 0x222426, [sx, 0.5, zz], { rot: [0, 0, Math.PI / 2], seg: 14, edges: false })));
      [-0.9, 0.9].forEach((sx) => ctx.box(p, 0.12, 1.0, 0.12, 0x555b60, [sx, 0.5, 5.6], { edges: false }));
      return p;
    },
  };

  const R = window.SubsystemModels = window.SubsystemModels || {};
  const L = 61, W = 38.1, FL = 1.22, PAD = 1.0, EH = FL + 10.4, SL = 0.25 / 12, RH = EH + W * SL, A = Math.atan(SL);
  const roofY = (z) => EH + (W - Math.abs(z)) * SL;
  const FX = []; for (let k = 0; k <= 10; k++) FX.push(-L + k * 12.2);
  const DOORX = []; for (let i = 0; i < 20; i++) DOORX.push(-40 + i * 3.66);
  R['re-warehouse'] = {
    env: 'prairie', caps: { subsurface: true, internals: true },
    connections: { power: ['ri_swbd', 'ri_panels', 'ri_light'], ground: [], comms: ['ri_falarm'] },
    camera: { theta: 0.62, phi: 1.08, r: 178, target: [0, 4, 6] },
    thumbView: { theta: 0.62, phi: 1.0 },
    controls: [{ id: 'flood', label: 'Flood depth above truck court', min: 0, max: 2.5, step: 0.05, value: 0, unit: ' m', presets: [{ label: 'Off', v: 0 }, { label: '100-yr', v: 0.9 }, { label: 'Floor', v: 1.22 }, { label: '500-yr', v: 1.5 }] }],
    build(ctx) {
      const T = ctx.T, M = (x, y, z, r, s) => ctx.mat4([x, y, z], r, s), G = (node, o) => ctx.group(null, { node, ...(o || {}) });
      const I = (g, geo, col, list, o) => (list.length ? ctx.instanced(g, geo, col, list, { edges: false, ...(o || {}) }) : null);
      const C = { steel: 0x8e979e, red: 0x7a8b9a, conc: 0xc9c5bc, wall: 0xdde1e3, trim: 0x5f676d, dark: 0x3d4349, sprk: 0xc0392b, drywall: 0xebe8e1 };
      const rot = (z) => [z < 0 ? -A : A, 0, 0], r = K.rnd(11);

      ctx.ground({ x0: -78, x1: 78, z0: -58, z1: 94, depth: 3 });
      // context: truck court apron, north lot, trailers and cars
      const cx = ctx.group(null, { context: true });
      ctx.box(cx, 140, 0.04, 56, 0xffffff, [0, 0.02, W + 28], { map: K.conc(ctx, 30, 12, true), rough: 0.95, edgeOpacity: 0.08 });
      ctx.box(cx, 44, 0.04, 9, 0xffffff, [-44, PAD + 0.02, -W - 14.5], { map: K.asph(ctx, 10, 2), rough: 1, edges: false });
      K.cars(ctx, cx, [-62, -59, -56, -50, -44, -41, -35, -29, -26].map((x, i) => [x + 0.2, -W - 14.5 + (i % 2 ? 0.3 : -0.3), 0]), PAD);
      [2, 5, 11, 16].forEach((i) => K.trailer(ctx, cx, DOORX[i], W + 0.5 + 8.1, 0));

      // ---------- foundation & floor ----------
      const pad = G('ri_pad', { shell: true });
      ctx.box(pad, 136, PAD, 86.2, 0x93a06b, [0, PAD / 2, -5], { rough: 1, edgeOpacity: 0.2 });
      ctx.box(pad, 15, 0.04, 6, 0xffffff, [-53.5, PAD + 0.02, -W - 4.5], { map: K.conc(ctx, 3, 1), edges: false });
      const ftg = G('ri_ftg'), fP = [], piers = [];
      FX.forEach((x) => [-W + 0.6, -W / 2, 0, W / 2, W - 0.6].forEach((z) => { fP.push(M(x, 0.1, z)); piers.push(M(x, 0.7, z)); }));
      [-1, 1].forEach((sx) => [-25.4, -12.7, 12.7, 25.4].forEach((z) => { fP.push(M(sx * (L - 0.6), 0.1, z)); piers.push(M(sx * (L - 0.6), 0.7, z)); }));
      I(ftg, new T.BoxGeometry(2.4, 0.6, 2.4), C.conc, fP, { edges: true, edgeOpacity: 0.25 }); I(ftg, new T.BoxGeometry(0.6, 0.6, 0.6), 0xbdb8ae, piers);
      const gb = G('ri_gb');
      ctx.box(gb, 122, PAD + 0.2, 0.6, C.conc, [0, (PAD - 0.2) / 2, -W + 0.3], { edgeOpacity: 0.2 });
      [-1, 1].forEach((sx) => ctx.box(gb, 0.6, PAD + 0.2, 76.2, C.conc, [sx * (L - 0.3), (PAD - 0.2) / 2, 0], { edgeOpacity: 0.2 }));
      ctx.box(gb, 122.6, FL + 0.2, 0.32, 0xffffff, [0, (FL - 0.2) / 2, W + 0.16], { map: K.conc(ctx, 24, 1), rough: 0.9 });
      const slab = G('ri_slab');
      ctx.box(slab, 122, FL - PAD, 76.2, 0xffffff, [0, (FL + PAD) / 2, 0], { map: K.conc(ctx, 26.5, 16.5, true, '#d3d0c9'), rough: 0.85, edgeOpacity: 0.2 });

      // ---------- structure ----------
      const cols = G('ri_cols'), cE = [], cI = [], plates = [];
      FX.slice(1, -1).forEach((x) => {
        [-1, 1].forEach((sz) => { cE.push(M(x, (EH + FL) / 2, sz * (W - 0.32))); plates.push(M(x, FL + 0.02, sz * (W - 0.32))); });
        [-W / 2, 0, W / 2].forEach((z) => { const h = roofY(z) - 0.8 - FL; cI.push(M(x, FL + h / 2, z, null, [1, h, 1])); plates.push(M(x, FL + 0.02, z)); });
      });
      I(cols, new T.BoxGeometry(0.3, EH - FL, 0.6), C.steel, cE, { edges: true, edgeOpacity: 0.2, metal: 0.35 }); I(cols, new T.BoxGeometry(0.3, 1, 0.3), C.steel, cI, { metal: 0.35 });
      const raf = G('ri_raft'), rL = [];
      FX.slice(1, -1).forEach((x) => [-1, 1].forEach((sz) => rL.push(M(x, (roofY(sz * W) + RH) / 2 - 0.52, sz * W / 2, rot(sz)))));
      I(raf, new T.BoxGeometry(0.25, 0.75, W), C.steel, rL, { edges: true, edgeOpacity: 0.2, metal: 0.35 });
      I(G('ri_anchor'), new T.BoxGeometry(0.5, 0.04, 0.75), 0x6d757b, plates, { metal: 0.4 });
      const ew = G('ri_endwall'), ewC = [], ewR = [];
      [-1, 1].forEach((sx) => { for (let z = -W; z <= W + 0.01; z += 6.35) { const h = roofY(z) - 0.35 - FL; ewC.push(M(sx * (L - 0.2), FL + h / 2, z, null, [1, h, 1])); } [-1, 1].forEach((sz) => ewR.push(M(sx * (L - 0.2), (roofY(sz * W) + RH) / 2 - 0.25, sz * W / 2, rot(sz)))); });
      I(ew, new T.BoxGeometry(0.22, 1, 0.3), C.steel, ewC, { metal: 0.35 }); I(ew, new T.BoxGeometry(0.22, 0.4, W), C.steel, ewR, { metal: 0.35 });
      const pur = G('ri_purlins', { explode: [0, 5, 0] }), pL = [], gL = [];
      for (let z = -W + 0.8; z <= W - 0.7; z += 1.52) pL.push(M(0, roofY(z) - 0.17, z, rot(z)));
      [-1, 1].forEach((sz) => pL.push(M(0, EH - 0.1, sz * (W - 0.15))));
      I(pur, new T.BoxGeometry(122, 0.25, 0.07), 0x9aa2a8, pL, { metal: 0.3 });
      [FL + 2.2, FL + 4.4, FL + 6.6, FL + 8.8].forEach((y) => { gL.push(M(0, y, -W + 0.12)); [-1, 1].forEach((sx) => gL.push(M(sx * (L - 0.12), y, 0, [0, Math.PI / 2, 0]))); });
      [FL + 3.5, FL + 5.7, FL + 7.9].forEach((y) => gL.push(M(0, y, W - 0.12)));
      I(pur, new T.BoxGeometry(122, 0.2, 0.06), 0x9aa2a8, gL.slice(0, 12).filter((_, i) => i % 3 === 0).concat(gL.slice(12)), { metal: 0.3 });
      I(pur, new T.BoxGeometry(76.2, 0.2, 0.06), 0x9aa2a8, gL.slice(0, 12).filter((_, i) => i % 3 !== 0), { metal: 0.3 });
      const br = G('ri_brace');
      [[-L, -L + 12.2], [L - 12.2, L]].forEach(([x0, x1]) => {
        [[-W, -W / 2], [-W / 2, 0], [0, W / 2], [W / 2, W]].forEach(([za, zb]) => { ctx.rod(br, [x0, roofY(za) - 0.5, za], [x1, roofY(zb) - 0.5, zb], 0.025, 0x6d757b, { edges: false, seg: 6 }); ctx.rod(br, [x0, roofY(zb) - 0.5, zb], [x1, roofY(za) - 0.5, za], 0.025, 0x6d757b, { edges: false, seg: 6 }); });
        ctx.rod(br, [x0, FL + 0.3, -W + 0.25], [x1, EH - 0.3, -W + 0.25], 0.025, 0x6d757b, { edges: false, seg: 6 }); ctx.rod(br, [x1, FL + 0.3, -W + 0.25], [x0, EH - 0.3, -W + 0.25], 0.025, 0x6d757b, { edges: false, seg: 6 });
      });
      ctx.box(br, 12.2, 0.7, 0.3, C.steel, [-3, EH - 1.4, W - 0.32], { metal: 0.35, edgeOpacity: 0.2 });

      // ---------- roof ----------
      const rp = G('ri_rpanel', { shell: true, explode: [0, 14, 0] }), ri = G('ri_rins', { shell: true, explode: [0, 9, 0] });
      [-1, 1].forEach((sz) => {
        ctx.box(rp, 122.6, 0.06, W + 0.4, 0xffffff, [0, (roofY(sz * W) + RH) / 2 + 0.03 - 0.4 * SL / 2, sz * (W + 0.4) / 2], { rot: rot(sz), map: K.ribs(ctx, 201, '#c9ced2', '#9ca3a9'), metal: 0.35, rough: 0.45, edgeOpacity: 0.25 });
        ctx.box(ri, 122, 0.05, W, 0xf3f3f0, [0, (roofY(sz * W) + RH) / 2 - 0.1, sz * W / 2], { rot: rot(sz), edges: false, rough: 0.9 });
      });
      const sky = G('ri_sky', { explode: [0, 16, 0] }), skL = [], svL = [];
      for (let k = 0; k < 9; k++) [-28, -12, 12, 28].forEach((z) => skL.push(M(-54.9 + k * 12.2 + (z > 0 ? 3 : -3), roofY(z) + 0.1, z, rot(z))));
      I(sky, new T.BoxGeometry(1.22, 0.14, 3.05), 0xe9f0f4, skL, { opacity: 0.85, rough: 0.2, edges: true, edgeOpacity: 0.3 });
      [[-30, -20], [0, 20], [30, -20], [45, 20]].forEach(([x, z]) => svL.push(M(x, roofY(z) + 0.18, z, rot(z))));
      I(sky, new T.BoxGeometry(1.6, 0.32, 2.4), 0x8f979d, svL, { edges: true, edgeOpacity: 0.3, metal: 0.3 });
      const gut = G('ri_gutter');
      [-1, 1].forEach((sz) => ctx.box(gut, 122.6, 0.22, 0.3, 0xb8bec2, [0, EH - 0.05, sz * (W + 0.38)], { metal: 0.4, edgeOpacity: 0.25 }));
      const dsp = [];
      for (let k = 0; k < 8; k++) { const x = -53.4 + k * 15.25; dsp.push([x, PAD, -W - 0.45]); }
      [-41.83, -30.85, -19.87, -8.89, 2.09, 13.07, 24.05, 35.5].forEach((x) => dsp.push([x, 0.25, W + 0.45]));
      dsp.forEach(([x, y0, z]) => ctx.rod(gut, [x, EH - 0.1, z], [x, y0, z], 0.07, 0xbfc4c8, { edges: false, seg: 8 }));
      const trim = G('ri_trim');
      ctx.box(trim, 122.6, 0.1, 0.7, C.trim, [0, RH + 0.08, 0], { metal: 0.3, edges: false });
      [-1, 1].forEach((sx) => [-1, 1].forEach((sz) => ctx.box(trim, 0.16, 0.32, W + 0.4, C.trim, [sx * (L + 0.32), (roofY(sz * W) + RH) / 2, sz * (W + 0.4) / 2], { rot: rot(sz), metal: 0.3, edges: false })));
      [-1, 1].forEach((sz) => ctx.box(trim, 122.6, 0.6, 0.1, C.trim, [0, EH - 0.45, sz * (W + 0.12)], { metal: 0.3, edges: false }));
      [-1, 1].forEach((sx) => ctx.box(trim, 0.1, 0.6, 76.4, C.trim, [sx * (L + 0.12), EH - 0.45, 0], { metal: 0.3, edges: false }));

      // ---------- walls & openings ----------
      const wN = G('ri_wpanel', { shell: true, explode: [0, 0, -12] }), wS = G('ri_wpanel', { shell: true, explode: [0, 0, 12] }), wE = G('ri_wpanel', { shell: true, explode: [12, 0, 0] }), wW = G('ri_wpanel', { shell: true, explode: [-12, 0, 0] });
      ctx.box(wN, 122.4, EH - PAD, 0.08, 0xffffff, [0, (EH + PAD) / 2, -W - 0.06], { map: K.ribs(ctx, 114, '#dfe2e4', '#c3c8cc') });
      ctx.box(wS, 122.4, EH - FL, 0.08, 0xffffff, [0, (EH + FL) / 2, W + 0.06], { map: K.ribs(ctx, 114, '#dfe2e4', '#c3c8cc') });
      const gab = new T.Shape(); gab.moveTo(-W, 0); gab.lineTo(W, 0); gab.lineTo(0, W * SL); gab.lineTo(-W, 0);
      [[wE, 1], [wW, -1]].forEach(([g, sx]) => {
        ctx.box(g, 0.08, EH - PAD, 76.3, 0xffffff, [sx * (L + 0.06), (EH + PAD) / 2, 0], { map: K.ribs(ctx, 71, '#dfe2e4', '#c3c8cc') });
        const geo = new T.ExtrudeGeometry(gab, { depth: 0.08, bevelEnabled: false }); geo.rotateY(-Math.PI / 2);
        ctx.mesh(g, geo, 0xdfe2e4, { pos: [sx * (L + 0.06) + 0.04, EH, 0] });
      });
      const doorTex = K.tex(ctx, 128, 128, (c, w, h) => { c.fillStyle = '#e9eae7'; c.fillRect(0, 0, w, h); c.fillStyle = '#b9bdbd'; [32, 64, 96].forEach((y) => c.fillRect(0, y - 1, w, 3)); c.fillStyle = '#3f4a52'; for (let i = 0; i < 4; i++) c.fillRect(10 + i * 30, 40, 20, 12); c.fillStyle = '#8f9696'; c.fillRect(0, 0, 3, h); c.fillRect(w - 3, 0, 3, h); });
      const dd = G('ri_ddoor', { explode: [0, 0, 16] }), sl = G('ri_seal', { explode: [0, 0, 18] }), lv = G('ri_lev', { explode: [0, 3, 0] });
      const dL = [], sS = [], sT = [], bm = [], rs = [], lp = [], ll = [], pit = [];
      DOORX.forEach((x) => { dL.push(M(x, FL + 1.525, W + 0.13)); [-1, 1].forEach((s) => { sS.push(M(x + s * 1.55, FL + 1.62, W + 0.3)); bm.push(M(x + s * 1.0, FL - 0.24, W + 0.43)); }); sT.push(M(x, FL + 3.28, W + 0.3)); rs.push(M(x, 0.32, W + 0.47)); lp.push(M(x, FL + 0.03, W - 1.22)); ll.push(M(x, FL + 0.04, W - 0.06)); pit.push(M(x, FL - 0.31, W - 1.25)); });
      I(dd, new T.BoxGeometry(2.74, 3.05, 0.07), 0xffffff, dL, { map: doorTex, edges: true, edgeOpacity: 0.3 });
      I(sl, new T.BoxGeometry(0.3, 3.45, 0.36), 0x26303a, sS); I(sl, new T.BoxGeometry(3.4, 0.45, 0.36), 0x26303a, sT); I(sl, new T.BoxGeometry(0.3, 0.36, 0.26), 0x1b1d1f, bm); I(sl, new T.BoxGeometry(0.46, 0.34, 0.3), 0xe0b02a, rs);
      I(lv, new T.BoxGeometry(1.83, 0.06, 2.44), 0x687076, lp, { metal: 0.4, edges: true, edgeOpacity: 0.3 }); I(lv, new T.BoxGeometry(1.83, 0.07, 0.14), 0xe0b02a, ll); I(lv, new T.BoxGeometry(1.92, 0.6, 2.5), 0x3b4045, pit);
      const drv = G('ri_drive');
      ctx.box(drv, 3.66, 4.27, 0.07, 0xffffff, [48.5, FL + 2.135, W + 0.13], { map: doorTex });
      ctx.box(drv, 4.8, 0.34, 12.3, 0xffffff, [48.5, FL / 2 - 0.14, W + 6.15], { rot: [Math.atan(FL / 12.2), 0, 0], map: K.conc(ctx, 2, 5), rough: 0.9 });
      [-1, 1].forEach((s) => ctx.cyl(drv, 0.1, 0.1, 1.1, 0xe0b02a, [48.5 + s * 2.2, FL + 0.55, W + 0.6], { seg: 10, edges: false }));
      const st = G('ri_store'), mu = [];
      ctx.box(st, 13, 2.2, 0.06, 0x48606f, [-53.5, FL + 2.0, -W - 0.12], { metal: 0.5, rough: 0.2, edges: false });
      ctx.box(st, 0.06, 2.2, 18, 0x48606f, [-L - 0.12, FL + 2.0, -27], { metal: 0.5, rough: 0.2, edges: false });
      for (let x = -60; x <= -47; x += 1.3) mu.push(M(x, FL + 2.0, -W - 0.15));
      for (let z = -36; z <= -18; z += 1.5) mu.push(M(-L - 0.15, FL + 2.0, z, [0, Math.PI / 2, 0]));
      I(st, new T.BoxGeometry(0.07, 2.3, 0.1), 0x9aa1a6, mu, { metal: 0.5 });
      ctx.box(st, 1.9, 2.2, 0.08, 0x2f3d46, [-53.5, FL + 1.1, -W - 0.16], { metal: 0.5, rough: 0.2 });
      ctx.box(st, 7, 0.25, 2.8, C.trim, [-53.5, FL + 3.4, -W - 1.5], { metal: 0.3 });
      ctx.box(st, 7, FL - PAD, 3.2, 0xffffff, [-53.5, (FL + PAD) / 2, -W - 1.7], { map: K.conc(ctx, 2, 1), edges: false });
      const pd = G('ri_pdoor'), pdL = [];
      [-24, 0, 24, 44].forEach((x) => pdL.push(M(x, FL + 1.07, -W - 0.12)));
      [-1, 1].forEach((sx) => [-10, 18].forEach((z) => pdL.push(M(sx * (L + 0.12), FL + 1.07, z, [0, Math.PI / 2, 0]))));
      I(pd, new T.BoxGeometry(0.95, 2.15, 0.07), 0x6f7e89, pdL, { edges: true, edgeOpacity: 0.3 });
      const ao = G('ri_ao_barrier'), aoL = [], aoP = [];
      DOORX.forEach((x) => { aoL.push(M(x, FL + 0.31, W + 0.55)); [-1, 1].forEach((s) => aoP.push(M(x + s * 1.48, FL + 0.32, W + 0.55))); });
      I(ao, new T.BoxGeometry(2.9, 0.62, 0.08), 0xa9b1b8, aoL, { metal: 0.5, edges: true, edgeOpacity: 0.35 }); I(ao, new T.BoxGeometry(0.1, 0.66, 0.16), 0x6d757b, aoP);
      ctx.box(ao, 3.9, 0.62, 0.08, 0xa9b1b8, [48.5, FL + 0.31, W + 0.55], { metal: 0.5 });

      // ---------- fixed services ----------
      const fh = G('ri_fhead', { explode: [0, 3, 0] }), brL = [], hdL = [];
      for (let z = -W + 1.5; z < W - 1; z += 3.05) { const y = roofY(z) - 0.6; brL.push(M(0, y, z, [0, 0, Math.PI / 2])); for (let x = -L + 1.5; x < L - 1; x += 3.05) hdL.push(M(x, y - 0.12, z)); }
      I(fh, new T.CylinderGeometry(0.035, 0.035, 120, 6), C.sprk, brL); I(fh, new T.CylinderGeometry(0.05, 0.03, 0.14, 6), 0xd9c27a, hdL, { metal: 0.6 });
      [-20, 25].forEach((x) => [-1, 1].forEach((sz) => ctx.rod(fh, [x, roofY(sz * (W - 1)) - 0.8, sz * (W - 1)], [x, RH - 0.8, 0], 0.09, C.sprk, { edges: false, seg: 10 })));
      const rsr = G('ri_riser');
      [57.4, 59.2].forEach((x) => { ctx.rod(rsr, [x, FL, -36.6], [x, FL + 4.4, -36.6], 0.1, C.sprk, { seg: 12, edges: false }); ctx.box(rsr, 0.45, 0.6, 0.45, 0xa8322a, [x, FL + 1.4, -36.6], { metal: 0.3 }); });
      ctx.box(rsr, 2.4, 0.25, 0.9, 0x5b6268, [57.2, FL + 0.13, -34.1]); ctx.cyl(rsr, 0.32, 0.32, 0.9, C.sprk, [56.6, FL + 0.6, -34.1], { rot: [0, 0, Math.PI / 2], seg: 16 }); ctx.cyl(rsr, 0.36, 0.36, 1.1, 0x6f7a82, [57.8, FL + 0.62, -34.1], { rot: [0, 0, Math.PI / 2], seg: 16 });
      ctx.box(rsr, 0.8, 1.4, 0.35, 0xb83a2f, [60.3, FL + 1.3, -33.4]);
      ctx.box(rsr, 0.25, 0.4, 0.5, 0xb83a2f, [L + 0.22, FL + 0.9, -35]);
      const fa = G('ri_falarm'), faL = [];
      FX.slice(1, -1).forEach((x, i) => faL.push(M(x + 0.2, FL + 3, i % 2 ? W / 2 : -W / 2)));
      I(fa, new T.BoxGeometry(0.15, 0.2, 0.12), 0xc0392b, faL); ctx.box(fa, 0.6, 0.8, 0.15, 0xb83a2f, [-46.2, FL + 1.6, -20], { edgeOpacity: 0.3 });
      const sw = G('ri_swbd');
      for (let i = 0; i < 4; i++) ctx.box(sw, 0.88, 2.3, 0.6, 0xb7bcc0, [50.6 + i * 0.9, FL + 1.15, -37.5], { metal: 0.3, edgeOpacity: 0.45 });
      const pn = G('ri_panels'), pnL = [];
      [[54.6, -32.3], [51, -32.3], [-46.3, -30], [-46.3, -16]].forEach(([x, z]) => pnL.push(M(x, FL + 2.1, z)));
      FX.slice(2, 9).forEach((x) => pnL.push(M(x + 0.3, FL + 2.1, W - 0.5)));
      I(pn, new T.BoxGeometry(0.55, 1.2, 0.2), 0x9ea5aa, pnL, { metal: 0.3, edges: true, edgeOpacity: 0.3 });
      ctx.rod(pn, [52, FL + 2.3, -36.8], [52, EH - 1.2, -36.8], 0.05, 0x7d858b, { edges: false }); ctx.rod(pn, [52, EH - 1.2, -36.8], [52, EH - 1.2, W - 1], 0.05, 0x7d858b, { edges: false });
      const lt = G('ri_light'), ltL = [];
      for (let x = -42; x <= 56; x += 7.6) for (let k = 0; k < 11; k++) ltL.push(M(x, EH - 1.8, -30.6 + k * 5.7));
      I(lt, new T.CylinderGeometry(0.3, 0.3, 0.12, 12), 0xf1f1ea, ltL, { rough: 0.4 });
      const uh = G('ri_uh'), uhL = [];
      [-36, -12, 12, 36].forEach((x) => [-1, 1].forEach((sz) => uhL.push(M(x, FL + 6, sz * (W - 1.4)))));
      [-1, 1].forEach((sx) => [-14, 14].forEach((z) => uhL.push(M(sx * (L - 1.4), FL + 6, z))));
      I(uh, new T.BoxGeometry(0.9, 0.7, 0.7), 0x8c949a, uhL, { metal: 0.3, edges: true, edgeOpacity: 0.3 });
      const rtu = G('ri_rtu', { explode: [0, 6, 0] });
      [-57, -50].forEach((x) => { const y = roofY(-26) + 0.06; ctx.box(rtu, 2.3, 0.4, 1.4, 0x7d858b, [x, y + 0.2, -26], { edges: false }); ctx.box(rtu, 2.6, 1.25, 1.65, 0xd3d7d9, [x, y + 1.02, -26], { metal: 0.25 }); ctx.cyl(rtu, 0.5, 0.5, 0.05, 0x3d4349, [x + 0.6, y + 1.67, -26], { seg: 18, edges: false }); });
      const ex = G('ri_exh'), exL = [];
      [-36, -12, 12, 36].forEach((x) => [-1, 1].forEach((sz) => exL.push(M(x, roofY(sz * 6) + 0.38, sz * 6))));
      I(ex, new T.CylinderGeometry(0.55, 0.7, 0.62, 14), 0xb9bfc4, exL, { metal: 0.4, edges: true, edgeOpacity: 0.25 });
      const pl = G('ri_plumb'), drn = [];
      ctx.cyl(pl, 0.3, 0.3, 1.5, 0xe9ebec, [-47, FL + 0.75, -14], { seg: 16 });
      ctx.rod(pl, [-46.6, FL + 2.6, -37.6], [-46.6, FL + 2.6, -14], 0.04, 0x3f7fc0, { edges: false });
      for (let x = -36; x <= 30; x += 11) drn.push(M(x, FL + 0.005, W - 4));
      I(pl, new T.BoxGeometry(0.35, 0.01, 0.35), 0x2b2f33, drn);

      // ---------- interior construction ----------
      const pt = G('ri_part'), lid = G('ri_part', { shell: true });
      ctx.box(pt, 0.15, 4.3, 25.1, C.drywall, [-46, FL + 2.15, -25.55]); ctx.box(pt, 15, 4.3, 0.15, C.drywall, [-53.5, FL + 2.15, -13]);
      ctx.box(pt, 15, 2.9, 0.12, C.drywall, [-53.5, FL + 1.45, -25]);
      [-56, -51].forEach((x) => [[-31.5, 12.9], [-19, 11.9]].forEach(([z, d]) => ctx.box(pt, 0.12, 2.9, d * 0.97, C.drywall, [x, FL + 1.45, z])));
      ctx.box(pt, 12, 4.5, 0.2, 0xd8d5ce, [55, FL + 2.25, -32]); ctx.box(pt, 0.2, 4.5, 6.1, 0xd8d5ce, [49, FL + 2.25, -35.05]); ctx.box(pt, 0.2, 4.5, 6.1, 0xd8d5ce, [55.9, FL + 2.25, -35.05]);
      ctx.box(lid, 12.2, 0.15, 6.1, 0xd8d5ce, [55, FL + 4.55, -35.05]);
      const ceilTex = K.tex(ctx, 64, 64, (c, w, h) => { c.fillStyle = '#f4f4f1'; c.fillRect(0, 0, w, h); c.fillStyle = '#c9cbc8'; c.fillRect(0, 0, w, 2); c.fillRect(0, 0, 2, h); c.fillRect(0, 32, w, 1); }, 12, 20);
      ctx.box(G('ri_ceil', { shell: true, explode: [0, 4, 0] }), 15, 0.03, 25.1, 0xffffff, [-53.5, FL + 2.9, -25.55], { map: ceilTex, edges: false });
      const ff = G('ri_floorfin');
      ctx.box(ff, 14.8, 0.012, 24.9, 0x7b8591, [-53.5, FL + 0.006, -25.55], { edges: false }); ctx.box(ff, 14.8, 0.014, 2.2, 0xb7ad9c, [-53.5, FL + 0.007, -25], { edges: false });
      const rr = G('ri_rest');
      [-49.5, -48.3, -47.1].forEach((x) => ctx.box(rr, 0.45, 0.8, 0.7, 0xf4f4f2, [x, FL + 0.4, -14.0]));
      ctx.box(rr, 3.2, 0.9, 0.65, 0x9b8a74, [-58.6, FL + 0.45, -13.6]);

      // ---------- contents ----------
      const rk = G('ri_rack'), up = [], bmL = [], gd = [], gdC = [], tone = [0xb98d5b, 0xc49a66, 0xa87c4f, 0xd9d6cf, 0x8b979f, 0xb48958];
      for (let row = 0; row < 10; row++) {
        const z0 = -33.5 + row * 5.7, lines = [z0, z0 + 1.07, z0 + 1.22, z0 + 2.29];
        for (let i = 0; i <= 32; i++) lines.forEach((z) => up.push(M(-43 + i * 2.74, FL + 3.65, z)));
        [1.5, 3.0, 4.5, 6.0].forEach((h) => lines.forEach((z) => bmL.push(M(-43 + 16 * 2.74, FL + h, z))));
        [z0 + 0.535, z0 + 1.755].forEach((zc) => { for (let i = 0; i < 32; i++) [0.04, 1.5, 3.0, 4.5, 6.0].forEach((h) => [-0.66, 0.66].forEach((dx) => { if (r() < 0.14) return; gd.push(M(-43 + i * 2.74 + 1.37 + dx, FL + h + 0.66, zc)); gdC.push(tone[Math.floor(r() * tone.length)]); })); });
      }
      for (let i = 0; i < 46; i++) { gd.push(M(-38 + r() * 80, FL + 0.6, 25 + r() * 9, [0, r() * 0.3, 0])); gdC.push(tone[Math.floor(r() * tone.length)]); }
      I(rk, new T.BoxGeometry(0.08, 7.3, 0.08), 0x2f6fb8, up, { metal: 0.3 }); I(rk, new T.BoxGeometry(32 * 2.74, 0.12, 0.06), 0xe07b2a, bmL, { metal: 0.3 });
      K.colorize(I(G('ri_goods'), new T.BoxGeometry(1.0, 1.15, 1.05), 0xffffff, gd, { rough: 0.9, metal: 0 }), gdC);

      const lab = ctx.label('Distribution warehouse', [0, RH + 5, 0], { sub: '100,000 sq ft · dock-high floor' });
      const wat = K.water(ctx, -78, 78, -58, 94);
      ctx.onUpdate((v) => {
        const d = +v.flood || 0; wat.set(d);
        if (d > 0.005) lab.set('Water ' + d.toFixed(2) + ' m above the truck court', d < FL ? (FL - d).toFixed(2) + ' m below the floor' : (d - FL).toFixed(2) + ' m over the floor', d < FL ? '#2f97b5' : '#d9675e');
        else lab.set('Distribution warehouse', '100,000 sq ft · dock-high floor');
      });
    },
  };
})();
