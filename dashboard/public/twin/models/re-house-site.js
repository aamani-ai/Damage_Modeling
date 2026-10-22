/* Site level: 100 x 120 ft suburban lot with the house as one item, driveway, walks and patio, privacy fence and shed,
   a mature oak, lot drainage to a rear swale and creek, overhead service from the rear easement, water, sewer and gas from the street.
   Same axes as the building twin: y = 0 is the lowest adjacent grade, +z faces the street. Metres. */
(function () {
  const R = window.SubsystemModels = window.SubsystemModels || {};
  const X0 = -9.15, X1 = 9.15, HZ = 4.575, GX = 15.85, GZ = -2.125, P = 0.5, OH = 0.45, PL = 2.74;
  const LX0 = -11.9, LX1 = 18.6, LZ0 = -24.4, LZ1 = 12.2;
  R['re-house-site'] = {
    env: 'prairie', caps: { subsurface: true },
    connections: { power: ['rsr_pole'], ground: [], comms: [] },
    camera: { theta: 0.55, phi: 1.0, r: 92, target: [3, 0, -4] },
    controls: [{ id: 'flood', label: 'Flood depth above lowest adjacent grade', min: 0, max: 1.5, step: 0.05, value: 0, unit: ' m', presets: [{ label: 'Off', v: 0 }, { label: 'Floor', v: 0.3 }, { label: '100-yr', v: 0.6 }, { label: '500-yr', v: 0.9 }] }],
    build(ctx) {
      const K = window.REKit, T = ctx.T, M = (x, y, z, r, s) => ctx.mat4([x, y, z], r, s), G = (node, o) => ctx.group(null, { node, ...(o || {}) });
      const I = (g, geo, col, list, o) => (list.length ? ctx.instanced(g, geo, col, list, { edges: false, ...(o || {}) }) : null), r = K.rnd(17);
      ctx.ground({ x0: -50, x1: 60, z0: -42, z1: 40, depth: 2.5 });
      const A = Math.atan(P), RR = PL + HZ * P, GC = (GZ + HZ) / 2, GH = (HZ - GZ) / 2, GR = PL + GH * P;
      const house = (g, ox, oz, flip, cols) => {
        const sg = flip ? -1 : 1, X = (x) => ox + sg * x, Z = (z) => oz + sg * z;
        ctx.box(g, X1 - X0, PL - 0.1, 2 * HZ, cols[0], [X(0), (PL + 0.1) / 2, Z(0)], { edgeOpacity: 0.2 });
        ctx.box(g, GX - X1, PL - 0.1, HZ - GZ, cols[0], [X((X1 + GX) / 2), (PL + 0.1) / 2, Z(GC)], { edgeOpacity: 0.2 });
        [[0, X1 - X0 + 2 * OH, 0, HZ, RR], [(X1 + GX + OH) / 2, GX - X1 + OH, GC, GH, GR]].forEach(([xc, wx, zc, half, ridge]) => [-1, 1].forEach((s) => { const hz = half + OH, len = hz / Math.cos(A); ctx.box(g, wx, 0.05, len, cols[1], [X(xc), ridge - (hz / 2) * P + 0.05, Z(zc + s * hz / 2)], { rot: [sg * s * A, 0, 0], edgeOpacity: 0.15 }); }));
        const sh = new T.Shape(); sh.moveTo(-HZ, PL); sh.lineTo(HZ, PL); sh.lineTo(0, RR); sh.lineTo(-HZ, PL);
        const geo = new T.ExtrudeGeometry(sh, { depth: X1 - X0, bevelEnabled: false }); geo.rotateY(-Math.PI / 2); ctx.mesh(g, geo, cols[0], { pos: [X(X1), 0, Z(0)], rot: flip ? [0, Math.PI, 0] : undefined });
        return { X, Z };
      };

      // building
      const b = G('rsr_bldg'), hh = house(b, 0, 0, false, [0xc9cdbd, 0x6a6460]);
      ctx.box(b, 4.9, 2.13, 0.04, 0xeceae4, [12.45, 0.2 + 1.07, HZ + 0.03]); ctx.box(b, 0.9, 2.03, 0.05, 0x7b3b2e, [2.55, 0.3 + 1.02, HZ + 0.03]);
      [[-7.4, 1.2], [-3.8, 1.2], [0, 2.4], [6.55, 1.5]].forEach(([x, w]) => ctx.box(b, w, 1.2, 0.04, 0x4f6b7c, [x, 1.8, HZ + 0.03], { metal: 0.4, edges: false }));
      [[-7.05, 1.5], [1.0, 1.2], [4.5, 1.8]].forEach(([x, w]) => ctx.box(b, w, 1.1, 0.04, 0x4f6b7c, [x, 1.8, -HZ - 0.03], { metal: 0.4, edges: false }));
      ctx.box(b, 0.75, 0.8, 0.75, 0xd3d7d9, [7.8, 0.5, -HZ - 1.0]);
      ctx.box(b, 0.3, 0.45, 0.12, 0x9ea5aa, [14.6, 1.6, GZ - 0.08]); ctx.rod(b, [14.6, 1.83, GZ - 0.12], [14.6, 3.7, GZ - 0.12], 0.03, 0x8e979e, { edges: false });
      const bl = ctx.label('House', [3, 8, 0], { sub: '1,800 sq ft' });

      // other structures
      const dv = G('rsr_drive');
      ctx.box(dv, 5.7, 0.1, LZ1 + 3.0 - HZ, 0xffffff, [12.5, 0.05, (HZ + LZ1 + 3.0) / 2], { map: K.conc(ctx, 2, 4, true), rough: 0.9, edgeOpacity: 0.15 });
      ctx.box(dv, 1.2, 0.12, 2.6, 0xffffff, [2.55, 0.06, HZ + 1.3], { map: K.conc(ctx, 1, 1), rough: 0.9, edgeOpacity: 0.15 });
      ctx.box(dv, 7.1, 0.1, 1.2, 0xffffff, [6.1, 0.05, HZ + 3.2], { map: K.conc(ctx, 3, 1), rough: 0.9, edges: false });
      ctx.box(dv, 3.6, 0.1, 3.4, 0xffffff, [4.5, 0.05, -HZ - 1.7], { map: K.conc(ctx, 2, 2, true), rough: 0.9, edgeOpacity: 0.15 });
      const fe = G('rsr_fence'), posts = [];
      const boards = K.tex(ctx, 64, 64, (c, w, h) => { c.fillStyle = '#a88b64'; c.fillRect(0, 0, w, h); c.fillStyle = 'rgba(60,40,20,0.3)'; for (let x = 0; x < w; x += 8) c.fillRect(x, 0, 1, h); }, 1, 1);
      const run = (a, b) => { const dx = b[0] - a[0], dz = b[1] - a[1], L = Math.hypot(dx, dz), n = Math.max(1, Math.round(L / 2.44)); const t = boards.clone(); t.needsUpdate = true; t.wrapS = t.wrapT = T.RepeatWrapping; t.repeat.set(L / 0.6, 1);
        ctx.box(fe, L, 1.8, 0.04, 0xffffff, [(a[0] + b[0]) / 2, 0.95, (a[1] + b[1]) / 2], { rot: [0, -Math.atan2(dz, dx), 0], map: t, rough: 0.95, edgeOpacity: 0.15 });
        for (let i = 0; i <= n; i++) posts.push(M(a[0] + (dx * i) / n, 0.95, a[1] + (dz * i) / n)); };
      [[[X0, -2.0], [LX0 + 0.3, -2.0]], [[LX0 + 0.3, -2.0], [LX0 + 0.3, LZ0 + 0.3]], [[LX0 + 0.3, LZ0 + 0.3], [LX1 - 0.3, LZ0 + 0.3]], [[LX1 - 0.3, LZ0 + 0.3], [LX1 - 0.3, GZ]], [[LX1 - 0.3, GZ], [GX + 1.2, GZ]]].forEach(([a, b]) => run(a, b));
      I(fe, new T.BoxGeometry(0.09, 1.95, 0.09), 0x8a7050, posts);
      const sd = G('rsr_shed');
      ctx.box(sd, 3.0, 2.0, 3.6, 0xb7a68a, [-8.2, 1.05, -20.6], { edgeOpacity: 0.2 }); ctx.box(sd, 1.2, 1.8, 0.04, 0x8a7050, [-8.2, 0.95, -18.78]);
      [-1, 1].forEach((s) => ctx.box(sd, 3.4, 0.05, 2.1, 0x6a6460, [-8.2 + s * 0.8, 2.45, -20.6], { rot: [0, 0, -s * 0.48], edgeOpacity: 0.15 }));

      // landscape
      const ln = G('rsr_lawn');
      ctx.box(ln, LX1 - LX0 - 0.6, 0.02, LZ1 - HZ - 0.4, 0x86a05a, [(LX0 + LX1) / 2, 0.01, (HZ + LZ1) / 2 + 0.2], { rough: 1, edges: false });
      ctx.box(ln, LX1 - LX0 - 0.6, 0.02, -2.0 - LZ0 - 2.4, 0x82a058, [(LX0 + LX1) / 2, 0.01, (-2.0 + LZ0) / 2 - 0.6], { rough: 1, edges: false });
      const shr = []; for (let x = -8.5; x < 8.5; x += 1.3) if (Math.abs(x - 2.55) > 1) shr.push([x, HZ + 0.8, 0.28 + r() * 0.08]);
      K.trees(ctx, ln, shr, -0.2);
      const tg = G('rsr_trees'); K.trees(ctx, tg, [[-3, -9.8, 2.5], [-6, -19, 1.2], [12, -19.5, 1.3], [-4, 14.3, 1.5], [10, 14.3, 1.4]], 0);
      const dn = G('rsr_swale');
      ctx.box(dn, LX1 - LX0, 0.02, 2.4, 0x6f8f4c, [(LX0 + LX1) / 2, 0.015, LZ0 + 1.6], { rough: 1, edges: false });
      ctx.cyl(dn, 0.3, 0.3, 6, 0x9aa0a4, [LX0 + 3, -0.1, LZ0 - 3], { seg: 14, rot: [Math.PI / 2, 0, 0], metal: 0.4 });

      // utilities
      const pl = G('rsr_pole');
      ctx.cyl(pl, 0.14, 0.17, 10, 0x6b5440, [14.6, 5, LZ0 - 0.6], { seg: 10 }); ctx.box(pl, 2.4, 0.12, 0.12, 0x6b5440, [14.6, 9.4, LZ0 - 0.6]);
      ctx.cyl(pl, 0.3, 0.3, 0.8, 0x8e979e, [14.6, 8.2, LZ0 - 0.3], { seg: 14, metal: 0.3 });
      ctx.rod(pl, [14.6, 8.9, LZ0 - 0.4], [14.6, 3.7, GZ - 0.15], 0.02, 0x1f2326, { edges: false });
      ctx.rod(pl, [-60, 9.4, LZ0 - 0.6], [80, 9.4, LZ0 - 0.6], 0.015, 0x1f2326, { edges: false });
      const wt = G('rsr_water');
      ctx.box(wt, 0.5, 0.04, 0.4, 0x2b2f33, [-1.0, 0.03, LZ1 + 2.0]); ctx.polyRod(wt, [[-1.0, -1.0, LZ1 + 2.0], [-1.0, -0.6, HZ + 0.9], [-1.0, -0.25, HZ + 0.9]], 0.03, 0x3f7fc0);
      ctx.polyRod(wt, [[-40, -1.4, LZ1 + 6.5], [60, -1.4, LZ1 + 6.5]], 0.12, 0x3f7fc0); ctx.polyRod(wt, [[-1.0, -1.0, LZ1 + 2.0], [-1.0, -1.4, LZ1 + 6.5]], 0.03, 0x3f7fc0);
      const sw = G('rsr_sewer');
      ctx.polyRod(sw, [[-3.4, -0.6, HZ + 1.8], [-3.4, -1.2, LZ1 + 5], [-3.4, -1.9, LZ1 + 8.0]], 0.06, 0x7a5a3a); ctx.polyRod(sw, [[-40, -1.9, LZ1 + 8.0], [60, -1.9, LZ1 + 8.0]], 0.2, 0x7a5a3a);
      ctx.cyl(sw, 0.06, 0.06, 0.6, 0x2b2f33, [-3.4, -0.3, HZ + 0.6], { seg: 10 });
      const gs = G('rsr_gas');
      ctx.box(gs, 0.4, 0.5, 0.3, 0xe0b02a, [GX + 0.25, 0.7, 2.6], { metal: 0.3 }); ctx.polyRod(gs, [[GX + 0.3, 0.45, 2.6], [GX + 0.6, -0.8, 2.6], [GX + 0.6, -0.8, LZ1 + 5.5], [GX + 0.6, -1.1, LZ1 + 5.5]], 0.025, 0xe0b02a);
      ctx.polyRod(gs, [[-40, -1.1, LZ1 + 5.5], [60, -1.1, LZ1 + 5.5]], 0.08, 0xe0b02a);

      // context: sidewalk, parkway, street, neighbours, creek
      const cx = ctx.group(null, { context: true });
      ctx.box(cx, 110, 0.1, 1.2, 0xffffff, [5, 0.05, LZ1 + 0.6], { map: K.conc(ctx, 60, 1, true), rough: 0.9, edges: false });
      ctx.box(cx, 110, 0.03, 1.8, 0x86a05a, [5, 0.015, LZ1 + 2.1], { rough: 1, edges: false });
      ctx.box(cx, 110, 0.04, 8.6, 0xffffff, [5, 0.0, LZ1 + 7.3], { map: K.asph(ctx, 22, 2), rough: 1, edges: false });
      ctx.box(cx, 110, 0.15, 0.15, 0xd9d6cf, [5, 0.07, LZ1 + 3.0], { edges: false });
      house(cx, -32, 0, false, [0xd8d2c4, 0x5d5a57]); house(cx, 38, 0, false, [0xc4ccd2, 0x6f6a64]); house(cx, 3, 34, true, [0xd3c8b6, 0x5f5b58]); house(cx, -29, 34, true, [0xc9cdbd, 0x6a6460]);
      ctx.box(cx, 110, 0.03, 4.5, 0x4f86a8, [5, 0.02, LZ0 - 8.5], { opacity: 0.8, rough: 0.2, edges: false });
      ctx.box(cx, 110, 0.02, 3.5, 0x6f8a4a, [5, 0.01, LZ0 - 4.5], { rough: 1, edges: false });
      const tl = []; for (let x = -45; x < 58; x += 6 + r() * 4) tl.push([x, LZ0 - 13 - r() * 4, 1.2 + r() * 0.8]);
      K.trees(ctx, cx, tl, 0);

      const wat = K.water(ctx, -50, 60, -42, 40);
      const lab = ctx.label('Residential lot', [3, 16, -4], { sub: '0.28 acre · Zone AE sample site' });
      ctx.onUpdate((v) => {
        const d = +v.flood || 0; wat.set(d); bl.sprite.visible = d < 0.005;
        if (d > 0.005) lab.set('Water ' + d.toFixed(2) + ' m above grade', d < 0.3 ? 'Floor clear by ' + (0.3 - d).toFixed(2) + ' m' : 'Floor flooded by ' + (d - 0.3).toFixed(2) + ' m', d < 0.3 ? '#2f97b5' : '#d9675e');
        else lab.set('Residential lot', '0.28 acre · Zone AE sample site');
      });
    },
  };
})();
