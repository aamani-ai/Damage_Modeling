/* Building level: 12,000 sq ft one-story, five-bay neighbourhood retail — masonry bearing walls, steel girder and storefront beam,
   open-web joists, steel deck, single-ply roof, rooftop units, storefront and canopy, tenant interiors. x = length, z = depth
   (+z = front, facing the parking lot), y = up. y = 0 is the parking lot, the lowest adjacent grade. Metres. */
(function () {
  const R = window.SubsystemModels = window.SubsystemModels || {};
  const HL = 30.5, HD = 9.15, FL = 0.2, YR = 4.82, YF = 5.2, BAYS = [-24.4, -12.2, 0, 12.2, 24.4];
  const deckY = (z) => YR + ((z + HD) / (2 * HD)) * (YF - YR), AR = -Math.atan((YF - YR) / (2 * HD));
  R['re-retail'] = {
    env: 'prairie', caps: { subsurface: true, internals: true },
    connections: { power: ['rc_elec', 'rc_light'], ground: [], comms: [] },
    camera: { theta: 0.5, phi: 1.1, r: 92, target: [0, 2.4, 3] },
    thumbView: { theta: 0.55, phi: 1.02 },
    controls: [{ id: 'flood', label: 'Flood depth above parking lot', min: 0, max: 1.2, step: 0.05, value: 0, unit: ' m', presets: [{ label: 'Off', v: 0 }, { label: 'Floor', v: 0.2 }, { label: '100-yr', v: 0.35 }, { label: '500-yr', v: 0.6 }] }],
    build(ctx) {
      const K = window.REKit, T = ctx.T, M = (x, y, z, r, s) => ctx.mat4([x, y, z], r, s), G = (node, o) => ctx.group(null, { node, ...(o || {}) });
      const I = (g, geo, col, list, o) => (list.length ? ctx.instanced(g, geo, col, list, { edges: false, ...(o || {}) }) : null), r = K.rnd(21);
      const C = { steel: 0x8e979e, conc: 0xc9c5bc, dry: 0xebe8e1, sprk: 0xc0392b, glass: 0x4f6b7c, alu: 0xa3aaaf };
      const cmu = (rx, ry) => K.tex(ctx, 128, 64, (c, w, h) => { c.fillStyle = '#d6cfbf'; c.fillRect(0, 0, w, h); c.fillStyle = '#bfb7a6'; c.fillRect(0, 0, w, 3); c.fillRect(0, 32, w, 3); c.fillRect(0, 0, 3, 32); c.fillRect(64, 0, 3, 32); c.fillRect(32, 32, 3, 32); c.fillRect(96, 32, 3, 32); }, rx, ry);
      ctx.ground({ x0: -46, x1: 46, z0: -29, z1: 38, depth: 2.5 });

      const cx = ctx.group(null, { context: true });
      ctx.box(cx, 92, 0.04, 25, 0xffffff, [0, 0.02, 25.4], { map: K.stalls(ctx, 34, 1), rough: 1, edges: false });
      ctx.box(cx, 92, 0.04, 19.4, 0xffffff, [0, 0.02, -19.1], { map: K.asph(ctx, 18, 4), rough: 1, edges: false });
      ctx.box(cx, 62, 0.15, 3.65, 0xffffff, [0, 0.075, HD + 1.83], { map: K.conc(ctx, 20, 1, true), rough: 0.9, edgeOpacity: 0.2 });
      K.cars(ctx, cx, [-22, -16.6, -13.9, -5.8, 2.3, 5, 13.1, 21.2].map((x) => [x, 17, 0]).concat([[-10, 32, 0], [8, 32, 0], [16, 32, 0]]));

      // foundation & floor
      const ftg = G('rc_ftg');
      ctx.box(ftg, 61.4, 0.3, 0.7, C.conc, [0, -0.7, -HD + 0.1]); [-1, 1].forEach((sx) => ctx.box(ftg, 0.7, 0.3, 18.6, C.conc, [sx * (HL - 0.1), -0.7, 0]));
      ctx.box(ftg, 61.2, 0.7, 0.2, 0xb9b3a6, [0, -0.2, -HD + 0.1]); [-1, 1].forEach((sx) => ctx.box(ftg, 0.2, 0.7, 18.3, 0xb9b3a6, [sx * (HL - 0.1), -0.2, 0]));
      const cf = []; [-18.3, -6.1, 6.1, 18.3].forEach((x) => cf.push(M(x, -0.6, 0))); for (let x = -HL + 0.4; x <= HL; x += 6.1) cf.push(M(x, -0.6, HD - 0.2));
      I(ftg, new T.BoxGeometry(1.5, 0.4, 1.5), C.conc, cf, { edges: true, edgeOpacity: 0.25 });
      ctx.box(G('rc_slab'), 61, 0.13 + FL, 18.3, 0xffffff, [0, (FL - 0.13) / 2 + 0.065 - 0.065, 0], { map: K.conc(ctx, 13, 4, true, '#d3d0c9'), rough: 0.85, edgeOpacity: 0.2 });

      // structure
      const cm = G('rc_cmu', { shell: true, explode: [0, 0, -6] }), cmS = G('rc_cmu', { shell: true });
      ctx.box(cm, 61, YR + 0.8 - FL, 0.2, 0xffffff, [0, (YR + 0.8 + FL) / 2, -HD + 0.1], { map: cmu(38, 13.5) });
      const sw = new T.Shape(); sw.moveTo(-HD, FL); sw.lineTo(HD, FL); sw.lineTo(HD, YF + 0.8); sw.lineTo(-HD, YR + 0.8); sw.lineTo(-HD, FL);
      [-1, 1].forEach((sx) => { const geo = new T.ExtrudeGeometry(sw, { depth: 0.2, bevelEnabled: false }); geo.rotateY(-Math.PI / 2); const g = ctx.group(cmS, { explode: [sx * 6, 0, 0] }); ctx.mesh(g, geo, 0xffffff, { pos: [sx > 0 ? HL : -HL + 0.2, 0, 0], map: cmu(1.25, 2.5) }); });
      const stl = G('rc_steel'), sc = [];
      ctx.box(stl, 61, 0.45, 0.2, C.steel, [0, deckY(0) - 0.45 - 0.24, 0], { metal: 0.35 });
      [-18.3, -6.1, 6.1, 18.3].forEach((x) => { const h = deckY(0) - 0.9 - FL; sc.push(M(x, FL + h / 2, 0, null, [1, h, 1])); });
      ctx.box(stl, 61, 0.4, 0.2, C.steel, [0, YF - 0.45 - 0.2, HD - 0.15], { metal: 0.35 });
      for (let x = -HL + 0.4; x <= HL; x += 6.1) { const h = YF - 0.85 - FL; sc.push(M(x, FL + h / 2, HD - 0.15, null, [1, h, 1])); }
      I(stl, new T.BoxGeometry(0.16, 1, 0.16), C.steel, sc, { metal: 0.35 });
      const jo = G('rc_joists'), ch = [], wb = [];
      for (let x = -HL + 0.8; x < HL - 0.4; x += 1.52) [[-HD + 0.2, -0.1], [0.1, HD - 0.3]].forEach(([z0, z1]) => {
        const zc = (z0 + z1) / 2, len = z1 - z0; ch.push(M(x, deckY(zc) - 0.05, zc, [AR, 0, 0], [1, 1, len])); ch.push(M(x, deckY(zc) - 0.45, zc, [AR, 0, 0], [1, 1, len * 0.94]));
        for (let k = 0; k < 6; k++) { const z = z0 + (k + 0.5) * (len / 6); wb.push(M(x, deckY(z) - 0.25, z, [k % 2 ? 0.75 : -0.75, 0, 0])); }
      });
      I(jo, new T.BoxGeometry(0.1, 0.06, 1), 0x8f989f, ch, { metal: 0.35 }); I(jo, new T.BoxGeometry(0.03, 0.55, 0.03), 0x8f989f, wb, { metal: 0.35 });
      const deckTex = K.tex(ctx, 64, 64, (c, w, h) => { c.fillStyle = '#aab0b5'; c.fillRect(0, 0, w, h); c.fillStyle = '#8b9297'; c.fillRect(0, 0, w, 10); }, 1, 122);
      ctx.box(G('rc_deck', { shell: true, explode: [0, 4, 0] }), 61, 0.04, 18.3, 0xffffff, [0, (YF + YR) / 2 - 0.02, 0], { rot: [AR, 0, 0], map: deckTex, metal: 0.4, edgeOpacity: 0.2 });

      // roof
      ctx.box(G('rc_rins', { shell: true, explode: [0, 7, 0] }), 61, 0.1, 18.3, 0xd8c79c, [0, (YF + YR) / 2 + 0.05, 0], { rot: [AR, 0, 0], rough: 0.9, edgeOpacity: 0.2 });
      const memTex = K.tex(ctx, 64, 64, (c, w, h) => { c.fillStyle = '#f2f3ef'; c.fillRect(0, 0, w, h); c.fillStyle = '#d7d9d4'; c.fillRect(0, 0, w, 2); c.fillStyle = 'rgba(0,0,0,0.05)'; for (let x = 0; x < w; x += 8) c.fillRect(x, 0, 1, h); }, 1, 6);
      ctx.box(G('rc_memb', { shell: true, explode: [0, 10, 0] }), 61, 0.015, 18.3, 0xffffff, [0, (YF + YR) / 2 + 0.11, 0], { rot: [AR, 0, 0], map: memTex, rough: 0.6, edgeOpacity: 0.2 });
      const cp = G('rc_coping');
      ctx.box(cp, 61.4, 0.07, 0.36, 0x8c949a, [0, YR + 0.84, -HD + 0.1], { metal: 0.4, edges: false });
      [-1, 1].forEach((sx) => ctx.box(cp, 0.36, 0.07, 18.4, 0x8c949a, [sx * (HL - 0.1), (YR + YF) / 2 + 0.84, 0], { rot: [AR, 0, 0], metal: 0.4, edges: false }));
      ctx.box(cp, 61.8, 0.1, 0.55, 0x8c949a, [0, 7.36, HD + 0.2], { metal: 0.4, edges: false });
      const dr = G('rc_drains'), dl = [];
      [-22, -8, 8, 22].forEach((x) => dl.push(M(x, deckY(-7.6) + 0.14, -7.6)));
      I(dr, new T.CylinderGeometry(0.18, 0.18, 0.06, 12), 0x2b2f33, dl);
      [-15, 15].forEach((x) => { ctx.box(dr, 0.5, 0.25, 0.4, 0x6d757b, [x, YR + 0.3, -HD - 0.1]); ctx.box(dr, 0.5, 0.5, 0.35, 0x8c949a, [x, YR + 0.05, -HD - 0.4]); ctx.rod(dr, [x, YR - 0.2, -HD - 0.4], [x, 0.1, -HD - 0.4], 0.07, 0x8c949a, { edges: false, seg: 8 }); });
      const ht = G('rc_hatch');
      ctx.box(ht, 0.9, 0.4, 0.9, 0x6d757b, [-27, deckY(-5) + 0.32, -5]); ctx.box(ht, 52, 0.02, 0.7, 0x9aa0a4, [0, deckY(-3.5) + 0.13, -3.5], { rot: [AR, 0, 0], edges: false });

      // walls & openings
      const st = G('rc_store'), mu = [], mh = [];
      BAYS.forEach((bx) => { ctx.box(st, 9.6, 3.0, 0.03, C.glass, [bx + 1.2, FL + 1.55, HD - 0.03], { metal: 0.45, rough: 0.12, opacity: 0.72, edges: false }); ctx.box(st, 11.9, 0.8, 0.03, C.glass, [bx, FL + 3.55, HD - 0.03], { metal: 0.45, rough: 0.12, opacity: 0.72, edges: false }); for (let k = 0; k <= 8; k++) mu.push(M(bx - 6 + k * 1.5, FL + 2.0, HD - 0.03)); });
      [FL + 0.04, FL + 3.12, FL + 3.98].forEach((y) => mh.push(M(0, y, HD - 0.03)));
      I(st, new T.BoxGeometry(0.07, 4.0, 0.13), C.alu, mu, { metal: 0.55 }); I(st, new T.BoxGeometry(61, 0.08, 0.13), C.alu, mh, { metal: 0.55 });
      const en = G('rc_entry');
      BAYS.forEach((bx) => { ctx.box(en, 1.0, 2.2, 0.05, 0x2f3d46, [bx - 4.6, FL + 1.1, HD], { metal: 0.5, rough: 0.15 }); ctx.box(en, 0.6, 0.05, 0.05, C.alu, [bx - 4.6, FL + 1.05, HD + 0.06], { edges: false }); });
      const fc = G('rc_facade', { explode: [0, 0, 5] });
      const eifs = K.tex(ctx, 64, 64, (c, w, h) => { c.fillStyle = '#d9cdb5'; c.fillRect(0, 0, w, h); for (let i = 0; i < 300; i++) { c.fillStyle = i % 2 ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.05)'; c.fillRect((i * 37) % w, (i * 53) % h, 2, 2); } }, 20, 1);
      ctx.box(fc, 61.6, 3.0, 0.35, 0xffffff, [0, 5.8, HD + 0.2], { map: eifs, edgeOpacity: 0.2 }); ctx.box(fc, 61.8, 0.3, 0.55, 0xc8bba1, [0, 7.15, HD + 0.25], { edges: false });
      const signC = ['#2f6fb8', '#b5452f', '#2f7d4f', '#6b4e9b', '#c78a1f'];
      BAYS.forEach((bx, i) => { const t = ctx.texture(256, 48, (c, w, h) => { c.fillStyle = '#f5f2ea'; c.fillRect(0, 0, w, h); c.fillStyle = signC[i]; for (let k = 0; k < 7; k++) c.fillRect(20 + k * 32, 10, 22, 28); }); ctx.box(fc, 6, 0.9, 0.12, 0xffffff, [bx, 5.7, HD + 0.44], { map: t, edges: false }); });
      const can = G('rc_canopy', { explode: [0, 0, 4] });
      ctx.box(can, 61.4, 0.35, 2.44, 0x7d858b, [0, 4.15, HD + 1.42], { metal: 0.3 }); ctx.box(can, 61.4, 0.02, 2.4, 0xe9e7e1, [0, 3.97, HD + 1.42], { edges: false });
      for (let x = -HL + 0.6; x <= HL; x += 6.1) ctx.rod(can, [x, 6.6, HD + 0.4], [x, 4.3, HD + 2.5], 0.03, 0x6d757b, { edges: false, seg: 6 });
      const sd = G('rc_sdoor'), sdl = [];
      BAYS.forEach((bx) => sdl.push(M(bx + 3, FL + 1.07, -HD - 0.05)));
      I(sd, new T.BoxGeometry(0.95, 2.15, 0.07), 0x6f7e89, sdl, { edges: true, edgeOpacity: 0.3 });
      const ao = G('rc_ao_shield'), aop = [];
      ctx.box(ao, 61, 0.6, 0.08, 0xa9b1b8, [0, 0.45, HD + 0.45], { metal: 0.5, edgeOpacity: 0.35 });
      for (let x = -HL; x <= HL + 0.1; x += 3.05) aop.push(M(x, 0.47, HD + 0.45));
      BAYS.forEach((bx) => aop.push(M(bx + 3, FL + 0.3, -HD - 0.2, null, [12, 0.95, 0.5])));
      I(ao, new T.BoxGeometry(0.1, 0.66, 0.16), 0x6d757b, aop, { metal: 0.4 });

      // fixed services
      const el = G('rc_elec');
      ctx.box(el, 3.0, 1.4, 0.3, 0x9ea5aa, [-26.5, 1.7, -HD - 0.15], { metal: 0.3 }); ctx.box(el, 0.6, 0.9, 0.25, 0x7d858b, [-24.4, 1.75, -HD - 0.15]);
      ctx.rod(el, [-26.5, 2.4, -HD - 0.15], [-26.5, YR + 0.4, -HD - 0.15], 0.06, 0x7d858b, { edges: false });
      const tp = []; BAYS.forEach((bx) => tp.push(M(bx + 4.5, 1.7, -HD + 0.3))); I(el, new T.BoxGeometry(0.5, 1.0, 0.15), 0x9ea5aa, tp, { edges: true, edgeOpacity: 0.3 });
      const lt = G('rc_light'), tr = [], dn = [], wp = [];
      BAYS.forEach((bx) => { for (let i = -1; i <= 1; i++) for (let j = 0; j < 4; j++) tr.push(M(bx + i * 3.6, 3.37, -3.5 + j * 3.4)); });
      for (let x = -HL + 1.5; x < HL; x += 3.05) dn.push(M(x, 3.95, HD + 1.42));
      BAYS.forEach((bx) => wp.push(M(bx - 2, 3.4, -HD - 0.15)));
      I(lt, new T.BoxGeometry(0.6, 0.04, 1.2), 0xf6f6f1, tr); I(lt, new T.CylinderGeometry(0.1, 0.1, 0.05, 10), 0xf6f6f1, dn); I(lt, new T.BoxGeometry(0.4, 0.3, 0.2), 0x5f676d, wp);
      const ru = G('rc_rtu', { explode: [0, 6, 0] }), straps = [];
      BAYS.forEach((bx, i) => { const y = deckY(-1) + 0.13; ctx.box(ru, 2.2, 0.4, 1.3, 0x7d858b, [bx, y + 0.2, -1], { edges: false }); ctx.box(ru, 2.5, 1.15, 1.55, 0xd3d7d9, [bx, y + 0.97, -1], { metal: 0.25 }); ctx.cyl(ru, 0.45, 0.45, 0.05, 0x3d4349, [bx + 0.6, y + 1.57, -1], { seg: 18, edges: false }); if (i !== 1 && i !== 3) [-1, 1].forEach((s) => straps.push([bx + s * 1.3, y, -1])); });
      straps.forEach(([x, y, z]) => ctx.rod(ru, [x, y + 0.05, z - 0.8], [x, y + 1.5, z], 0.025, 0x2b2f33, { edges: false, seg: 5 }));
      const du = G('rc_duct'), dfs = [];
      BAYS.forEach((bx) => { ctx.box(du, 0.9, deckY(-1) - 3.9, 0.7, 0xbfc5c9, [bx, (deckY(-1) + 3.9) / 2, -1], { metal: 0.45 }); ctx.box(du, 0.7, 0.4, 13, 0xbfc5c9, [bx + 1.2, 3.95, 1.5], { metal: 0.45 }); [-3, 1.5, 6].forEach((z) => dfs.push(M(bx + 1.2, 3.39, z))); });
      I(du, new T.BoxGeometry(0.6, 0.03, 0.6), 0xd9dcde, dfs);
      const pl = G('rc_plumb'), wh = [], fd = [];
      BAYS.forEach((bx) => { wh.push(M(bx + 5.2, FL + 0.7, -8.4)); fd.push(M(bx + 3, FL + 0.005, -6.5)); });
      I(pl, new T.CylinderGeometry(0.28, 0.28, 1.4, 14), 0xeceeee, wh); I(pl, new T.BoxGeometry(0.3, 0.01, 0.3), 0x2b2f33, fd);
      ctx.polyRod(pl, [[-28, 1.2, -HD - 0.12], [-28, deckY(-6.5) + 0.45, -HD - 0.12], [-28, deckY(-6.5) + 0.45, -6.5], [26, deckY(-6.5) + 0.45, -6.5]], 0.04, 0xe0b02a);
      BAYS.forEach((bx) => ctx.rod(pl, [bx, deckY(-6.5) + 0.45, -6.5], [bx, deckY(-1.8) + 0.5, -1.8], 0.03, 0xe0b02a, { edges: false, seg: 6 }));
      const sp = G('rc_spr', { explode: [0, 2, 0] }), bl = [], hd = [];
      [-7.5, -4.5, -1.5, 1.5, 4.5, 7.5].forEach((z) => { const y = deckY(z) - 0.6; bl.push(M(0, y, z, [0, 0, Math.PI / 2])); for (let x = -HL + 1.5; x < HL; x += 3.05) hd.push(M(x, y - 0.1, z)); });
      I(sp, new T.CylinderGeometry(0.03, 0.03, 60, 6), C.sprk, bl); I(sp, new T.CylinderGeometry(0.04, 0.025, 0.1, 6), 0xd9c27a, hd, { metal: 0.6 });
      ctx.rod(sp, [-29.6, FL, -8.6], [-29.6, deckY(-8.6) - 0.6, -8.6], 0.08, C.sprk, { edges: false, seg: 10 }); ctx.rod(sp, [-29.6, deckY(-7.5) - 0.6, -8.6], [-29.6, deckY(7.5) - 0.6, 7.5], 0.06, C.sprk, { edges: false, seg: 10 });
      ctx.box(sp, 0.35, 0.3, 0.25, 0xb83a2f, [-HL - 0.15, 1.0, -6]);

      // interior construction
      const dm = G('rc_demise');
      [-18.3, -6.1, 6.1, 18.3].forEach((x) => ctx.box(dm, 0.15, deckY(0) - FL, 18.0, C.dry, [x, (deckY(0) + FL) / 2, 0]));
      const ceilTex = K.tex(ctx, 64, 64, (c, w, h) => { c.fillStyle = '#f4f4f1'; c.fillRect(0, 0, w, h); c.fillStyle = '#c9cbc8'; c.fillRect(0, 0, w, 2); c.fillRect(0, 0, 2, h); c.fillRect(0, 32, w, 1); }, 10, 11);
      const ce = G('rc_ceil', { shell: true, explode: [0, 2.5, 0] }); BAYS.forEach((bx) => ctx.box(ce, 11.95, 0.03, 13.6, 0xffffff, [bx, 3.4, 2.2], { map: ceilTex, edges: false }));
      const flc = [0xb8b2a7, 0x8c8f93, 0xc9c1b3, 0x7b8591, 0xa9a49b], ff = G('rc_floorfin'); BAYS.forEach((bx, i) => ctx.box(ff, 11.95, 0.012, 17.9, flc[i], [bx, FL + 0.006, 0], { edges: false }));
      const rr = G('rc_rest');
      BAYS.forEach((bx) => { ctx.box(rr, 8.5, 3.2, 0.12, C.dry, [bx - 1.6, FL + 1.6, -5.4]); ctx.box(rr, 0.1, 3.0, 3.6, C.dry, [bx + 3.6, FL + 1.5, -7.25]); ctx.box(rr, 0.45, 0.8, 0.7, 0xf4f4f2, [bx + 4.6, FL + 0.4, -8.4 + 1.4]); ctx.box(rr, 0.6, 0.85, 0.5, 0xf4f4f2, [bx + 5.4, FL + 0.43, -6.2]); });

      // tenant fit-out & stock
      const ti = G('rc_ti');
      ctx.box(ti, 6, 1.0, 0.8, 0x9b8a74, [-12.2, FL + 0.5, -3.6]); ctx.box(ti, 5, 1.0, 0.8, 0x9b8a74, [12.2, FL + 0.5, 1.5]);
      [[-14.5, 3], [-11, 3], [-14.5, 6], [-11, 6]].forEach(([x, z]) => ctx.box(ti, 1.0, 0.75, 1.0, 0x8a7a64, [x, FL + 0.375, z]));
      const sk = G('rc_stock'), sh = [], shC = [], tone = [0xd9dbdc, 0xc0392b, 0x2f6fb8, 0xe0b02a, 0x2f7d4f, 0xb98d5b];
      [-24.4, 0, 24.4].forEach((bx) => [-3, -0.5, 2, 4.5].forEach((dx, k) => { sh.push(M(bx + dx, FL + 0.9, 2.0, null, [1, 1, 1])); shC.push(0xd9dbdc); [0.4, 1.0, 1.5].forEach((h) => { sh.push(M(bx + dx, FL + h, 2.0, null, [1.05, 0.18, 0.98])); shC.push(tone[1 + Math.floor(r() * 5)]); }); }));
      K.colorize(I(sk, new T.BoxGeometry(1.0, 1.8, 6.5), 0xffffff, sh), shC);

      const lab = ctx.label('Neighbourhood retail', [0, 9.6, 0], { sub: '12,000 sq ft · five tenants' });
      const wat = K.water(ctx, -46, 46, -29, 38);
      ctx.onUpdate((v) => {
        const d = +v.flood || 0; wat.set(d);
        if (d > 0.005) lab.set('Water ' + d.toFixed(2) + ' m above the lot', d < FL ? (FL - d).toFixed(2) + ' m below the floor' : (d - FL).toFixed(2) + ' m over the floor', d < FL ? '#2f97b5' : '#d9675e');
        else lab.set('Neighbourhood retail', '12,000 sq ft · five tenants');
      });
    },
  };
})();
