/* Site level: ~1.6-acre neighbourhood retail site — the building as one item, front parking lot and rear service drive, sidewalk,
   curb inlets and underground detention, utility transformer and gas meters, pylon sign, lot lighting, dumpster enclosure and landscaping.
   Same axes as the building twin: y = 0 is the parking lot. Metres. */
(function () {
  const R = window.SubsystemModels = window.SubsystemModels || {};
  const HL = 30.5, HD = 9.15, FL = 0.2, YR = 4.82, YF = 5.2, AR = -Math.atan((YF - YR) / (2 * HD));
  R['re-retail-site'] = {
    env: 'prairie', caps: { subsurface: true },
    connections: { power: ['rsc_xfmr', 'rsc_lights'], ground: [], comms: [] },
    camera: { theta: 0.5, phi: 1.02, r: 150, target: [0, 0, 14] },
    controls: [{ id: 'flood', label: 'Flood depth above parking lot', min: 0, max: 1.2, step: 0.05, value: 0, unit: ' m', presets: [{ label: 'Off', v: 0 }, { label: 'Floor', v: 0.2 }, { label: '100-yr', v: 0.35 }, { label: '500-yr', v: 0.6 }] }],
    build(ctx) {
      const K = window.REKit, T = ctx.T, M = (x, y, z, r, s) => ctx.mat4([x, y, z], r, s), G = (node, o) => ctx.group(null, { node, ...(o || {}) });
      const I = (g, geo, col, list, o) => (list.length ? ctx.instanced(g, geo, col, list, { edges: false, ...(o || {}) }) : null), r = K.rnd(9);
      ctx.ground({ x0: -52, x1: 52, z0: -34, z1: 74, depth: 2.5 });

      // building massing
      const b = G('rsc_bldg');
      const cmu = K.tex(ctx, 128, 64, (c, w, h) => { c.fillStyle = '#d6cfbf'; c.fillRect(0, 0, w, h); c.fillStyle = '#bfb7a6'; c.fillRect(0, 0, w, 3); c.fillRect(0, 32, w, 3); }, 38, 13);
      ctx.box(b, 61, YR + 0.8, 18.3, 0xffffff, [0, (YR + 0.8) / 2, 0], { map: cmu });
      ctx.box(b, 61, 0.03, 18.3, 0xf2f3ef, [0, (YF + YR) / 2 + 0.12, 0], { rot: [AR, 0, 0], edges: false });
      ctx.box(b, 61.6, 3.0, 0.35, 0xd9cdb5, [0, 5.8, HD + 0.2]); ctx.box(b, 61.8, 0.3, 0.55, 0xc8bba1, [0, 7.15, HD + 0.25], { edges: false });
      ctx.box(b, 61, 3.8, 0.05, 0x4f6b7c, [0, FL + 1.9, HD + 0.02], { metal: 0.45, rough: 0.12, edges: false });
      ctx.box(b, 61.4, 0.35, 2.44, 0x7d858b, [0, 4.15, HD + 1.42], { metal: 0.3 });
      const ru = []; [-24.4, -12.2, 0, 12.2, 24.4].forEach((x) => ru.push(M(x, 6.0, -1)));
      I(b, new T.BoxGeometry(2.5, 1.15, 1.55), 0xd3d7d9, ru, { edges: true, edgeOpacity: 0.3 });
      ctx.box(b, 3.0, 1.4, 0.3, 0x9ea5aa, [-26.5, 1.7, -HD - 0.15]);
      const bl = ctx.label('Retail building', [0, 9.6, 0], { sub: '12,000 sq ft' });

      // paving
      const lot = G('rsc_lot');
      ctx.box(lot, 80, 0.04, 39.2, 0xffffff, [0, 0.02, 32.4], { map: K.asph(ctx, 16, 8), rough: 1, edgeOpacity: 0.1 });
      [15.55, 28.35, 33.85, 46.65].forEach((z) => ctx.box(lot, 80, 0.006, 5.5, 0xffffff, [0, 0.043, z], { map: K.stalls(ctx, 29.6, 1), rough: 1, edges: false }));
      ctx.box(lot, 88, 0.04, 12.6, 0xffffff, [0, 0.02, -15.7], { map: K.asph(ctx, 18, 3), rough: 1, edges: false });
      ctx.box(lot, 10, 0.04, 8, 0xffffff, [-30, 0.02, 56], { map: K.asph(ctx, 2, 2), rough: 1, edges: false }); ctx.box(lot, 10, 0.04, 8, 0xffffff, [30, 0.02, 56], { map: K.asph(ctx, 2, 2), rough: 1, edges: false });
      ctx.box(lot, 7, 0.04, 22, 0xffffff, [-44, 0.02, 1], { map: K.asph(ctx, 2, 4), rough: 1, edges: false });
      const carL = []; [15.55, 28.35, 33.85, 46.65].forEach((z, j) => { for (let i = 0; i < 29; i++) if (r() < (j === 0 ? 0.55 : 0.3)) carL.push([-38.65 + i * 2.7, z, (j % 2 ? Math.PI : 0) + (r() - 0.5) * 0.05]); });
      K.cars(ctx, ctx.group(null, { context: true }), carL);
      const wk = G('rsc_walk');
      ctx.box(wk, 62, 0.15, 3.65, 0xffffff, [0, 0.075, HD + 1.83], { map: K.conc(ctx, 20, 1, true), rough: 0.9, edgeOpacity: 0.2 });
      ctx.box(wk, 62.4, 0.16, 0.18, 0xd9d6cf, [0, 0.08, 12.85], { edges: false });

      // stormwater
      const inl = G('rsc_inlets'), gr = [];
      [[-20, 21.9], [20, 21.9], [-20, 40.2], [20, 40.2]].forEach(([x, z]) => gr.push(M(x, 0.05, z)));
      I(inl, new T.BoxGeometry(1.2, 0.04, 0.6), 0x2b2f33, gr);
      ctx.polyRod(inl, [[-20, -1.0, 21.9], [-20, -1.0, 36], [20, -1.0, 36], [20, -1.0, 21.9]], 0.2, 0x8b8f93); ctx.polyRod(inl, [[-20, -1.0, 40.2], [-20, -1.0, 36]], 0.2, 0x8b8f93); ctx.polyRod(inl, [[20, -1.0, 40.2], [20, -1.0, 36]], 0.2, 0x8b8f93);
      const det = G('rsc_det'), pp = [];
      [30.5, 32.5, 34.5].forEach((z) => pp.push(M(0, -1.8, z, [0, 0, Math.PI / 2])));
      I(det, new T.CylinderGeometry(0.9, 0.9, 30, 16), 0x9aa0a4, pp, { metal: 0.4 }); ctx.polyRod(det, [[15, -1.8, 32.5], [15, -1.8, 60], [15, -1.8, 66]], 0.15, 0x8b8f93);

      // utilities
      const xf = G('rsc_xfmr');
      ctx.box(xf, 2.4, 0.15, 2.4, 0xc9c5bc, [-26, 0.07, -15]); ctx.box(xf, 1.6, 1.4, 1.8, 0x5d7a5a, [-26, 0.85, -15], { metal: 0.3 });
      [[-1.2, -1.2], [1.2, -1.2], [-1.2, 1.2], [1.2, 1.2]].forEach(([dx, dz]) => ctx.cyl(xf, 0.09, 0.09, 1.0, 0xe0b02a, [-26 + dx, 0.5, -15 + dz], { seg: 8, edges: false }));
      ctx.polyRod(xf, [[-26, -0.6, -15], [-26, -0.6, -9.6]], 0.07, 0x3d4349);
      const gs = G('rsc_gas');
      ctx.box(gs, 0.9, 0.9, 0.35, 0xe0b02a, [-20, 0.9, -HD - 0.25], { metal: 0.3 });
      ctx.polyRod(gs, [[-20, -0.9, -HD - 0.3], [-20, -0.9, -26], [-48, -0.9, -26]], 0.05, 0xe0b02a); ctx.polyRod(gs, [[-10, -1.2, -HD - 0.3], [-10, -1.2, -28], [-48, -1.2, -28]], 0.06, 0x3f7fc0); ctx.polyRod(gs, [[0, -1.8, -HD - 0.3], [0, -1.8, -30], [-48, -1.8, -30]], 0.1, 0x7a5a3a);

      // sign, lighting, landscape
      const sg = G('rsc_sign');
      const st = ctx.texture(128, 256, (c, w, h) => { c.fillStyle = '#f5f2ea'; c.fillRect(0, 0, w, h); ['#2f6fb8', '#b5452f', '#2f7d4f', '#6b4e9b', '#c78a1f'].forEach((col, i) => { c.fillStyle = col; c.fillRect(14, 16 + i * 46, 100, 30); }); });
      [-1.3, 1.3].forEach((dx) => ctx.box(sg, 0.35, 9, 0.35, 0x6d757b, [38 + dx, 4.5, 56], { metal: 0.3 }));
      ctx.box(sg, 3.2, 6, 0.6, 0xffffff, [38, 6.0, 56], { map: st }); ctx.box(sg, 3.6, 0.4, 0.8, 0x5f676d, [38, 9.2, 56]);
      const li = G('rsc_lights'), pol = [], hds = [];
      [[-30, 22], [0, 22], [30, 22], [-30, 40], [0, 40], [30, 40]].forEach(([x, z]) => { pol.push(M(x, 3.8, z)); hds.push(M(x, 7.7, z)); });
      I(li, new T.CylinderGeometry(0.09, 0.12, 7.6, 8), 0x8e979e, pol, { metal: 0.5 }); I(li, new T.BoxGeometry(0.6, 0.16, 0.35), 0x3d4349, hds);
      const dp = G('rsc_dump');
      ctx.box(dp, 4.2, 1.9, 0.2, 0xd6cfbf, [22, 0.95, -19.5]); [-1, 1].forEach((s) => ctx.box(dp, 0.2, 1.9, 3.2, 0xd6cfbf, [22 + s * 2.0, 0.95, -18]));
      ctx.box(dp, 1.9, 1.2, 1.3, 0x2f6a4a, [21.9, 0.6, -18.3]);
      const ld = G('rsc_land'), tp = [];
      ctx.box(ld, 80, 0.15, 2.6, 0x7f9a55, [0, 0.075, 50.7], { rough: 1, edges: false });
      [-1, 1].forEach((s) => ctx.box(ld, 2.5, 0.15, 11, 0x7f9a55, [s * 41.5, 0.075, 31.1], { rough: 1, edges: false }));
      for (let x = -36; x <= 36; x += 9) tp.push([x, 50.7, 0.8 + r() * 0.25]);
      [-1, 1].forEach((s) => [27, 35].forEach((z) => tp.push([s * 41.5, z, 0.9])));
      for (let x = -44; x <= 44; x += 8) tp.push([x, -24.5, 1 + r() * 0.3]);
      K.trees(ctx, ld, tp, 0.15);

      // context: road and neighbours
      const cx = ctx.group(null, { context: true });
      ctx.box(cx, 220, 0.05, 10, 0xffffff, [0, 0.025, 65], { map: K.asph(ctx, 44, 2), rough: 1, edges: false });
      ctx.box(cx, 220, 0.06, 0.15, 0xe8d36a, [0, 0.03, 65], { edges: false });
      ctx.box(cx, 30, 6, 22, 0xd9d4ca, [88, 3, 18], { edgeOpacity: 0.15 }); ctx.box(cx, 60, 8, 30, 0xdcdfe1, [-100, 4, 10], { edgeOpacity: 0.15 });
      for (let i = 0; i < 7; i++) { const x = -60 + i * 20; ctx.box(cx, 11, 3.2, 9, 0xe6e1d6, [x, 1.6, -48], { edgeOpacity: 0.15 }); ctx.box(cx, 11.6, 0.3, 9.6, 0x6d6158, [x, 3.35, -48], { edges: false }); }

      const wat = K.water(ctx, -52, 52, -34, 74);
      const lab = ctx.label('Retail site', [0, 15, 32], { sub: '~1.6 acres · Zone X (shaded) sample site' });
      ctx.onUpdate((v) => {
        const d = +v.flood || 0; wat.set(d); bl.sprite.visible = d < 0.005;
        if (d > 0.005) lab.set('Water ' + d.toFixed(2) + ' m above the lot', d < FL ? 'Floor clear by ' + (FL - d).toFixed(2) + ' m' : 'Floor flooded by ' + (d - FL).toFixed(2) + ' m', d < FL ? '#2f97b5' : '#d9675e');
        else lab.set('Retail site', '~1.6 acres · Zone X (shaded) sample site');
      });
    },
  };
})();
