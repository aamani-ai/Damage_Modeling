/* Site level: ~9-acre warehouse site — the building as one item, truck court and trailer stalls, car parking, detention pond,
   trench drains and storm pipe, utility transformer, fire water loop, fence and guard booth, pole lighting, landscaping.
   Same axes as the building twin: y = 0 is the truck court. Metres. */
(function () {
  const R = window.SubsystemModels = window.SubsystemModels || {};
  const L = 61, W = 38.1, FL = 1.22, PAD = 1.0, EH = FL + 10.4, SL = 0.25 / 12, RH = EH + W * SL, A = Math.atan(SL);
  const roofY = (z) => EH + (W - Math.abs(z)) * SL;
  R['re-warehouse-site'] = {
    env: 'prairie', caps: { subsurface: true },
    connections: { power: ['rsi_xfmr'], ground: [], comms: [] },
    camera: { theta: 0.55, phi: 1.0, r: 330, target: [0, 0, 18] },
    controls: [{ id: 'flood', label: 'Flood depth above truck court', min: 0, max: 2.5, step: 0.05, value: 0, unit: ' m', presets: [{ label: 'Off', v: 0 }, { label: '100-yr', v: 0.9 }, { label: 'Floor', v: 1.22 }, { label: '500-yr', v: 1.5 }] }],
    build(ctx) {
      const K = window.REKit, T = ctx.T, M = (x, y, z, r, s) => ctx.mat4([x, y, z], r, s), G = (node, o) => ctx.group(null, { node, ...(o || {}) });
      const I = (g, geo, col, list, o) => (list.length ? ctx.instanced(g, geo, col, list, { edges: false, ...(o || {}) }) : null), r = K.rnd(5);
      const rot = (z) => [z < 0 ? -A : A, 0, 0];
      ctx.ground({ x0: -122, x1: 126, z0: -102, z1: 116, depth: 3 });

      // building massing
      const b = G('rsi_bldg');
      ctx.box(b, 136, PAD, 86.2, 0x93a06b, [0, PAD / 2, -5], { rough: 1, edgeOpacity: 0.2 });
      ctx.box(b, 122.6, FL + 0.2, 0.32, 0xc9c5bc, [0, (FL - 0.2) / 2, W + 0.16]);
      ctx.box(b, 122.4, EH - PAD, 76.3, 0xffffff, [0, (EH + PAD) / 2, 0], { map: K.ribs(ctx, 114, '#dfe2e4', '#c3c8cc') });
      [-1, 1].forEach((sz) => ctx.box(b, 122.8, 0.06, W + 0.4, 0xffffff, [0, (roofY(sz * W) + RH) / 2 + 0.03, sz * (W + 0.4) / 2], { rot: rot(sz), map: K.ribs(ctx, 201, '#c9ced2', '#9ca3a9'), metal: 0.35, rough: 0.45 }));
      const gab = new T.Shape(); gab.moveTo(-W, 0); gab.lineTo(W, 0); gab.lineTo(0, W * SL); gab.lineTo(-W, 0);
      [-1, 1].forEach((sx) => { const geo = new T.ExtrudeGeometry(gab, { depth: 0.1, bevelEnabled: false }); geo.rotateY(-Math.PI / 2); ctx.mesh(b, geo, 0xdfe2e4, { pos: [sx * 61.2 + 0.05, EH, 0] }); });
      [-1, 1].forEach((sz) => ctx.box(b, 122.8, 0.6, 76.6 * 0 + 0.12, 0x5f676d, [0, EH - 0.45, sz * (W + 0.2)], { edges: false }));
      const dL = []; for (let i = 0; i < 20; i++) dL.push(M(-40 + i * 3.66, FL + 1.525, W + 0.2));
      I(b, new T.BoxGeometry(2.74, 3.05, 0.1), 0xe9eae7, dL, { edges: true, edgeOpacity: 0.3 }); ctx.box(b, 3.66, 4.27, 0.1, 0xe9eae7, [48.5, FL + 2.135, W + 0.2]);
      ctx.box(b, 13, 2.2, 0.08, 0x48606f, [-53.5, FL + 2.0, -W - 0.2], { metal: 0.5, rough: 0.2, edges: false });
      ctx.box(b, 4.8, 0.34, 12.3, 0xc9c5bc, [48.5, FL / 2 - 0.14, W + 6.15], { rot: [Math.atan(FL / 12.2), 0, 0] });
      const lbl = ctx.label('Warehouse', [0, RH + 5, 0], { sub: '100,000 sq ft' });

      // paving
      const tc = G('rsi_truck');
      ctx.box(tc, 132, 0.04, 40, 0xffffff, [0, 0.02, W + 20.3], { map: K.conc(ctx, 28, 9, true), rough: 0.95, edgeOpacity: 0.12 });
      ctx.box(tc, 132, 0.04, 16, 0xffffff, [0, 0.02, W + 48.3], { map: K.stalls(ctx, 36, 1), rough: 1, edgeOpacity: 0.12 });
      const cx = ctx.group(null, { context: true });
      [1, 4, 7, 12, 15, 18].forEach((i) => K.trailer(ctx, cx, -40 + i * 3.66, W + 0.5 + 8.1, 0));
      [2, 3, 6, 10, 11, 14, 19, 22, 27, 30, 31, 34].forEach((i) => K.trailer(ctx, cx, -64.2 + i * 3.66, W + 48.3, Math.PI));
      const au = G('rsi_auto');
      ctx.box(au, 86, 0.04, 22, 0xffffff, [-23, 0.02, -63], { map: K.stalls(ctx, 31.8, 2), rough: 1, edgeOpacity: 0.12 });
      ctx.box(au, 46, 0.04, 8, 0xffffff, [-89, 0.02, -58.5], { map: K.asph(ctx, 10, 2), rough: 1, edges: false });
      ctx.box(au, 54, 0.04, 9, 0xffffff, [-93, 0.02, W + 48], { map: K.asph(ctx, 12, 2), rough: 1, edges: false });
      ctx.box(au, 12, 0.04, 30, 0xffffff, [-70, 0.02, W + 28], { map: K.asph(ctx, 3, 7), rough: 1, edges: false });
      const carL = []; for (let i = 0; i < 46; i++) { if (r() < 0.25) continue; carL.push([-64.6 + (i % 23) * 2.7 * 1.33, i < 23 ? -69.5 : -56.5, 0]); }
      K.cars(ctx, cx, carL);
      const road = ctx.group(null, { context: true });
      ctx.box(road, 10, 0.05, 218, 0xffffff, [-116, 0.025, 7], { map: K.asph(ctx, 2, 40), rough: 1, edges: false });
      ctx.box(road, 0.15, 0.06, 218, 0xe8d36a, [-116, 0.03, 7], { edges: false });

      // stormwater
      const pd = G('rsi_pond');
      [[97, 41, 44, 3], [97, 99, 44, 3], [76.5, 70, 3, 61], [117.5, 70, 3, 61]].forEach(([x, z, w, d]) => ctx.box(pd, w, 0.8, d, 0x8e9b62, [x, 0.4, z], { rough: 1, edgeOpacity: 0.15 }));
      ctx.box(pd, 38, 0.06, 55, 0x5a8aa3, [97, 0.35, 70], { rough: 0.15, metal: 0.1, edges: false, opacity: 0.9 });
      ctx.box(pd, 1.6, 1.4, 1.6, 0xc9c5bc, [115.6, 0.7, 92]);
      const inl = G('rsi_inlets'), grate = [];
      ctx.box(inl, 120, 0.03, 0.4, 0x2b2f33, [0, 0.05, W + 3], { edges: false });
      [-45, -15, 15, 45].forEach((x) => grate.push(M(x, 0.05, W + 30)));
      I(inl, new T.BoxGeometry(0.9, 0.03, 0.9), 0x2b2f33, grate);
      ctx.polyRod(inl, [[-60, -1.2, W + 3], [66, -1.2, W + 3], [66, -1.2, W + 30], [78, -1.2, W + 30]], 0.3, 0x8b8f93);
      ctx.polyRod(inl, [[-45, -1.2, W + 30], [66, -1.2, W + 30]], 0.2, 0x8b8f93);

      // utilities
      const xf = G('rsi_xfmr');
      ctx.box(xf, 3, 0.15, 3, 0xc9c5bc, [54, PAD + 0.07, -45.5]); ctx.box(xf, 2.0, 1.7, 2.2, 0x5d7a5a, [54, PAD + 1.0, -45.5], { metal: 0.3 });
      [[-1.4, -1.4], [1.4, -1.4], [-1.4, 1.4], [1.4, 1.4]].forEach(([dx, dz]) => ctx.cyl(xf, 0.1, 0.1, 1.1, 0xe0b02a, [54 + dx, PAD + 0.55, -45.5 + dz], { seg: 8, edges: false }));
      ctx.polyRod(xf, [[54, PAD - 0.6, -45.5], [54, PAD - 0.6, -39], [52, PAD - 0.6, -38.2]], 0.08, 0x3d4349);
      const fw = G('rsi_fw'), hyd = [];
      ctx.polyRod(fw, [[-68, -1.5, -50], [68, -1.5, -50], [68, -1.5, W + 5], [-68, -1.5, W + 5], [-68, -1.5, -50]], 0.13, 0xb03a2e);
      ctx.polyRod(fw, [[-112, -1.5, -40], [-68, -1.5, -40]], 0.13, 0xb03a2e);
      [[-68, -50], [0, -50], [68, -50], [68, 0], [-68, 0], [-68, W + 5]].forEach(([x, z]) => hyd.push(M(x, 0.45, z + (z < 0 ? -1.5 : 0))));
      I(fw, new T.CylinderGeometry(0.16, 0.2, 0.9, 10), 0xc0392b, hyd);
      ctx.box(fw, 1.2, 1.0, 2.0, 0xd8cfb8, [-105, 0.5, -40]); ctx.cyl(fw, 0.08, 0.08, 1.1, 0xe0b02a, [62, PAD + 0.55, -46], { seg: 8 });
      const wsg = G('rsi_wsg');
      ctx.polyRod(wsg, [[-112, -1.2, -30], [-61, -1.2, -30]], 0.06, 0x3f7fc0); ctx.polyRod(wsg, [[-112, -2.0, -22], [-61, -2.0, -22]], 0.12, 0x7a5a3a); ctx.polyRod(wsg, [[-112, -0.9, -46], [-30, -0.9, -46], [-30, -0.9, -38.5]], 0.05, 0xe0b02a);

      // fence, lights, landscape
      const fe = G('rsi_fence'), posts = [], fab = [];
      const run = (x0, z0, x1, z1) => { const len = Math.hypot(x1 - x0, z1 - z0), n = Math.max(1, Math.round(len / 3)); for (let i = 0; i <= n; i++) posts.push(M(x0 + ((x1 - x0) * i) / n, 1.2, z0 + ((z1 - z0) * i) / n)); fab.push(M((x0 + x1) / 2, 1.2, (z0 + z1) / 2, [0, Math.atan2(x1 - x0, z1 - z0), 0], [1, 1, len])); };
      run(-66, W + 0.5, -66, W + 43); run(-66, W + 53, -66, W + 57); run(-66, W + 57, 68, W + 57); run(68, W + 57, 68, W + 0.5);
      I(fe, new T.CylinderGeometry(0.04, 0.04, 2.4, 6), 0x9aa1a7, posts, { metal: 0.5 }); I(fe, new T.BoxGeometry(0.02, 2.4, 1), 0x9aa1a7, fab, { opacity: 0.28 });
      ctx.box(fe, 0.08, 2.2, 10, 0x9aa1a7, [-66.5, 1.2, W + 48], { opacity: 0.5 });
      ctx.box(fe, 3, 2.7, 2.6, 0xe4e1d8, [-72, 1.35, W + 42]); ctx.box(fe, 3.05, 0.8, 2.65, 0x48606f, [-72, 1.9, W + 42], { metal: 0.4, edges: false }); ctx.box(fe, 3.4, 0.2, 3.0, 0x5f676d, [-72, 2.8, W + 42]);
      const li = G('rsi_lights'), pol = [], hds = [];
      [[-60, 95], [-30, 95], [0, 95], [30, 95], [60, 95], [-62, 58], [62, 58], [-60, -77], [-30, -77], [0, -77], [-66, -50], [66, -50], [70, 0], [-70, 0]].forEach(([x, z]) => { pol.push(M(x, 4.5, z)); hds.push(M(x, 9.1, z)); });
      I(li, new T.CylinderGeometry(0.1, 0.14, 9, 8), 0x8e979e, pol, { metal: 0.5 }); I(li, new T.BoxGeometry(0.7, 0.18, 0.4), 0x3d4349, hds);
      const ld = G('rsi_land'), tp = [];
      for (let z = -94; z <= 108; z += 11) tp.push([-107, z, 0.9 + r() * 0.3]);
      for (let x = -62; x <= 18; x += 10) tp.push([x, -78.5, 0.8 + r() * 0.3]);
      [[72, 30], [74, 108], [120, 30], [-100, 104]].forEach(([x, z]) => tp.push([x, z, 1.1]));
      K.trees(ctx, ld, tp);

      // neighbours
      const nb = ctx.group(null, { context: true });
      [[250, -20, 150, 90], [-30, -230, 180, 100], [230, 190, 120, 80]].forEach(([x, z, w, d]) => { ctx.box(nb, w, 10, d, 0xdcdfe1, [x, 5, z], { edgeOpacity: 0.15 }); ctx.box(nb, w + 0.5, 0.2, d + 0.5, 0xc4c9cd, [x, 10.1, z], { edges: false }); });

      const wat = K.water(ctx, -122, 126, -102, 116);
      const lab = ctx.label('Warehouse site', [-20, 22, -60], { sub: '~9 acres · Zone AE sample site' });
      ctx.onUpdate((v) => {
        const d = +v.flood || 0; wat.set(d);
        if (d > 0.005) lab.set('Water ' + d.toFixed(2) + ' m above the truck court', d < FL ? 'Floor clear by ' + (FL - d).toFixed(2) + ' m' : 'Floor flooded by ' + (d - FL).toFixed(2) + ' m', d < FL ? '#2f97b5' : '#d9675e');
        else lab.set('Warehouse site', '~9 acres · Zone AE sample site');
        lbl.sprite.visible = d < 0.005;
      });
    },
  };
})();
