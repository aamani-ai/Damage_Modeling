/* Geometry: one 1P single-axis tracker block — a full 90-module row (detailed) with neighbor rows, combiner box,
   DC feeders, MV power station skid, met station, grounding and civil works. x = row axis (N–S), y = up, z = E–W. Metres. */
(function () {
  const R = window.SubsystemModels = window.SubsystemModels || {};
  const H = 1.5, P = 1.159, HALF = 45;
  const modX = []; for (let i = 0; i < HALF; i++) { const x = 0.927 + i * P; modX.push(x, -x); }
  const seams = []; for (let k = 0; k <= HALF; k++) { const x = 0.3475 + k * P; seams.push(x, -x); }
  const pileX = [0]; for (let k = 0; k < 7; k++) { const x = 5.5 + k * 7.6; pileX.push(x, -x); }
  const brgX = pileX.slice(1), ROWS = [-12, -6, 6, 12];
  const near = { box: [[-3.4, 0.2, -1.3], [3.4, 2.1, 1.3]] };
  R['pv-tracker'] = {
    env: 'scrub',
    caps: { subsurface: true },
    connections: { power: ['pv_leads', 'hn_cable', 'dc_feeder', 'mv_cable', 'ac_bus', 'hv_leads'], ground: ['gr_cond', 'gr_rods', 'gr_jumper'], comms: ['scada_fiber'] },
    camera: { theta: 0.58, phi: 1.13, r: 30, target: [0, 1.1, 0] },
    thumbView: { theta: 0.62, phi: 1.0, per: { pv_module: near, pv_harness: near, tt: { box: [[-11, 0.8, -1], [11, 2.2, 1]] }, mt: near, br: { box: [[4.6, 0.6, -0.6], [6.4, 1.9, 0.6]] }, fd: { box: [[-6, -2.7, -0.6], [6, 1.4, 0.6]] }, gr_cond: { box: [[44, -1.2, -2.5], [84, 0.4, 4]] }, gr_rods: { box: [[64, -3.2, -2.5], [85, 0, 3.5]] }, gr_jumper: { box: [[4.6, 0.9, -0.4], [6.4, 1.9, 0.5]] }, dc_feeder: { box: [[53, -1.2, -1], [71, 1.8, 4]] }, mv_cable: { box: [[78, -1.4, -1.2], [92, 1.4, 0.6]] }, pr_fence: { box: [[80, 0, -34], [92, 2.6, -22]] }, pr_road: { box: [[57, 0, -10], [65, 0.2, 10]] } } },
    controls: [{ id: 'tilt', label: 'Tracker angle', min: -60, max: 60, step: 1, value: 30, unit: '°', presets: [{ label: 'Morning −45°', v: -45 }, { label: 'Flat 0°', v: 0 }, { label: 'Afternoon 45°', v: 45 }, { label: 'Max 60°', v: 60 }] }],
    build(ctx) {
      const T = ctx.T, PI = Math.PI;
      const M = (x, y, z, r, s) => ctx.mat4([x, y, z], r, s);
      const C = { galv: 0xb7bdc3, steel: 0xa1a8af, alu: 0xd0d4d8, glass: 0xa8bfd1, encap: 0xf4f4f0, rglass: 0xc9d5de, jbox: 0x353a3f, cable: 0x2b2e31, conn: 0x464b50, uhmw: 0xf0ede2, motor: 0x5f676f, tcu: 0xe8e9e6, pile: 0x9ba2a9, panel: 0x2a3a50, cab: 0xe4e6e3, cab2: 0xd5d9d7, tank: 0x98a1a7, conc: 0xc9c5bc, cu: 0xb67a4c, dark: 0x3d4349, fiber: 0xc8843f };
      ctx.ground({ x0: -58, x1: 92, z0: -16, z1: 16, depth: 3.4 });
      const cellTex = ctx.texture(480, 1024, (c, w, h) => {
        c.fillStyle = '#d6dce2'; c.fillRect(0, 0, w, h);
        const mx = 10, my = 12, gap = 4, mid = 16, cw = (w - 2 * mx - 5 * gap) / 6, ch = (h - 2 * my - 22 * gap - mid) / 24;
        for (let col = 0; col < 6; col++) for (let row = 0; row < 24; row++) {
          const x = mx + col * (cw + gap), y = my + row * (ch + gap) + (row >= 12 ? mid : 0);
          c.fillStyle = '#1f2d40'; c.fillRect(x, y, cw, ch);
          c.fillStyle = 'rgba(150,170,200,0.32)'; for (let b = 1; b <= 11; b++) c.fillRect(x + (b * cw) / 12, y, 1, ch);
        }
      });
      const rots = [];

      // ================= main row: rotating assembly =================
      const rot = ctx.group(null, { pos: [0, H, 0], explode: [0, 0.9, 0] }); rots.push(rot);
      ctx.box(ctx.group(rot, { node: 'tt_tube' }), 105.6, 0.127, 0.127, C.galv, [0, 0, 0], { metal: 0.25, rough: 0.5 });
      const splX = [-39.7, -24.5, -9.3, 9.3, 24.5, 39.7], spl = ctx.group(rot, { node: 'tt_splice' });
      ctx.instanced(spl, new T.BoxGeometry(0.46, 0.155, 0.155), C.steel, splX.map((x) => M(x, 0, 0)), { edges: true });
      ctx.instanced(spl, new T.CylinderGeometry(0.012, 0.012, 0.2, 6), 0x8d949a, splX.flatMap((x) => [M(x - 0.14, 0, 0, [PI / 2, 0, 0]), M(x + 0.14, 0, 0, [PI / 2, 0, 0])]));
      ctx.instanced(ctx.group(rot, { node: 'mt_rail', explode: [0, 0.16, 0] }), new T.BoxGeometry(0.06, 0.045, 2.12), C.galv, seams.map((x) => M(x, 0.086, 0)), { edges: true, metal: 0.2 });
      ctx.instanced(ctx.group(rot, { node: 'mt_clamp' }), new T.BoxGeometry(0.07, 0.17, 0.17), C.steel, seams.map((x) => M(x, 0, 0)), { edges: true });
      const cab = ctx.group(rot, { node: 'hn_cable', explode: [0, -0.34, 0] });
      [-0.028, 0.028].forEach((z) => ctx.rod(cab, [-52.6, -0.088, z], [52.6, -0.088, z], 0.0065, C.cable, { seg: 8, edges: false }));
      ctx.instanced(ctx.group(rot, { node: 'hn_clip', explode: [0, -0.26, 0] }), new T.BoxGeometry(0.02, 0.026, 0.09), 0x7d848a, seams.map((x) => M(x + 0.08, -0.08, 0)));
      ctx.box(ctx.group(rot, { node: 'ct_incl', explode: [0, 0.2, -0.3] }), 0.07, 0.05, 0.04, 0x40464c, [0.24, 0, -0.084]);
      const y0 = 0.1085;
      const layer = (node, ex, geo, color, mats, o) => ctx.instanced(ctx.group(rot, { node, explode: [0, ex, 0] }), geo, color, mats, o);
      layer('pv_frame', 0.34, new T.BoxGeometry(0.035, 0.035, 2.382), C.alu, modX.flatMap((x) => [M(x - 0.5495, y0 + 0.0175, 0), M(x + 0.5495, y0 + 0.0175, 0)]), { edges: true, metal: 0.3, rough: 0.45 });
      layer('pv_frame', 0.34, new T.BoxGeometry(1.064, 0.035, 0.035), C.alu, modX.flatMap((x) => [M(x, y0 + 0.0175, -1.1735), M(x, y0 + 0.0175, 1.1735)]), { edges: true, metal: 0.3, rough: 0.45 });
      const lam = new T.BoxGeometry(1.1, 0.002, 2.35), thin = new T.BoxGeometry(1.1, 0.0008, 2.35);
      layer('pv_rglass', 0.42, lam, C.rglass, modX.map((x) => M(x, y0 + 0.024, 0)), { opacity: 0.55, rough: 0.2 });
      layer('pv_encap', 0.54, thin, C.encap, modX.map((x) => M(x, y0 + 0.0256, 0)), { opacity: 0.2, rough: 0.6 });
      layer('pv_cells', 0.66, thin, 0xffffff, modX.map((x) => M(x, y0 + 0.027, 0)), { map: cellTex, rough: 0.35, metal: 0.1 });
      layer('pv_encap', 0.78, thin, C.encap, modX.map((x) => M(x, y0 + 0.0284, 0)), { opacity: 0.12, rough: 0.6 });
      layer('pv_fglass', 0.92, lam, C.glass, modX.map((x) => M(x, y0 + 0.0302, 0)), { opacity: 0.26, rough: 0.1, metal: 0.1, edges: true, edgeOpacity: 0.18 });
      layer('pv_jbox', 0.14, new T.BoxGeometry(0.075, 0.016, 0.05), C.jbox, modX.flatMap((x) => [-0.32, 0, 0.32].map((d) => M(x + d, y0 + 0.0145, 1.08))));
      const leadG = new T.CylinderGeometry(0.0035, 0.0035, 0.28, 6); leadG.rotateZ(PI / 2);
      const connG = new T.CylinderGeometry(0.011, 0.011, 0.07, 10); connG.rotateZ(PI / 2);
      layer('pv_leads', 0.04, leadG, C.cable, modX.flatMap((x) => [M(x - 0.46, y0 + 0.007, 1.08), M(x + 0.46, y0 + 0.007, 1.08)]));
      layer('pv_leads', 0.04, connG, C.conn, modX.flatMap((x) => [M(x - 0.595, y0 + 0.007, 1.08), M(x + 0.595, y0 + 0.007, 1.08)]));

      // ================= main row: static structure =================
      const pileTop = (x) => (x === 0 ? H - 0.3 : H - 0.24);
      const fd = ctx.group(null, { node: 'fd' });
      const pm = (x, dz, z) => { const h = pileTop(x) + 2.7; return M(x, -2.7 + h / 2, z + dz, null, [1, h, 1]); };
      ctx.instanced(fd, new T.BoxGeometry(0.1, 1, 0.006), C.pile, pileX.flatMap((x) => [pm(x, -0.0725, 0), pm(x, 0.0725, 0)]), { edges: true, metal: 0.2 });
      ctx.instanced(fd, new T.BoxGeometry(0.0045, 1, 0.139), C.pile, pileX.map((x) => pm(x, 0, 0)), { metal: 0.2 });
      const ringR = (x) => M(x, H, 0, [0, 0, PI / 2]);
      const bh = ctx.group(null, { node: 'br_housing', explode: [0, 0.45, 0] });
      ctx.instanced(bh, ctx.ringGeo(0.098, 0.152, 0.09, 28), C.galv, brgX.map(ringR), { edges: true, metal: 0.2 });
      ctx.instanced(bh, new T.BoxGeometry(0.12, 0.13, 0.2), C.galv, brgX.map((x) => M(x, H - 0.175, 0)), { edges: true });
      ctx.instanced(ctx.group(null, { node: 'br_bushing', explode: [0, 0.62, 0] }), ctx.ringGeo(0.09, 0.098, 0.11, 28), C.uhmw, brgX.map(ringR), { edges: true });
      const sg = ctx.group(null, { node: 'sd_gear', explode: [0, 0.45, 0.9] });
      ctx.ring(sg, 0.075, 0.24, 0.17, 0x8f979e, [0, H, 0], { rot: [0, 0, PI / 2], metal: 0.25 });
      ctx.cyl(sg, 0.062, 0.062, 0.44, 0x868e95, [0, H - 0.2, 0], { rot: [PI / 2, 0, 0], metal: 0.25 });
      ctx.box(sg, 0.22, 0.12, 0.3, C.galv, [0, H - 0.3, 0], { metal: 0.2 });
      const mo = ctx.group(null, { node: 'sd_motor', explode: [0, 0.45, 1.3] });
      ctx.cyl(mo, 0.056, 0.056, 0.2, C.motor, [0, H - 0.2, 0.32], { rot: [PI / 2, 0, 0] });
      ctx.cyl(mo, 0.04, 0.04, 0.04, 0x3c4248, [0, H - 0.2, 0.44], { rot: [PI / 2, 0, 0] });
      const dampers = [-13.1, -5.5, 5.5, 13.1].map((x) => {
        const sgn = Math.sign(x), xd = x + 0.15 * sgn;
        const g = ctx.group(null, { node: 'dr_damper', explode: [0, 0, 0.6] });
        ctx.box(g, 0.2, 0.07, 0.06, C.galv, [x + 0.08 * sgn, 0.42, 0.09]);
        ctx.box(g, 0.06, 0.07, 0.24, C.galv, [xd, 0.42, 0.2]);
        const body = ctx.rod(g, [0, 0, 0], [0, 1, 0], 0.034, 0x50585f, { seg: 16 });
        const piston = ctx.rod(g, [0, 0, 0], [0, 1, 0], 0.014, 0xdfe2e5, { seg: 12, metal: 0.6, rough: 0.25 });
        ctx.box(ctx.group(rot, { node: 'dr_damper' }), 0.03, 0.34, 0.05, C.galv, [xd, -0.17, 0]);
        return { g, body, piston, A: new T.Vector3(xd, 0.42, 0.3), B0: new T.Vector3(xd, -0.32, 0) };
      });
      const tcu = ctx.group(null, { node: 'ct_tcu', explode: [0, 0, -0.9] });
      ctx.box(tcu, 0.08, 1.25, 0.08, C.galv, [0, 0.625, -1.8]);
      ctx.box(tcu, 0.3, 0.38, 0.15, C.tcu, [0, 0.95, -1.71]);
      ctx.box(tcu, 0.24, 0.04, 0.02, 0xc6c9c5, [0, 0.95, -1.63]);
      ctx.rod(tcu, [0.11, 1.14, -1.71], [0.11, 1.44, -1.71], 0.008, 0x2f3438, { seg: 6 });
      ctx.rod(tcu, [0, 0.02, -1.76], [0, 0.02, -0.1], 0.012, C.cable, { seg: 6, edges: false });
      const pw = ctx.group(null, { node: 'ct_power', explode: [0, 0.6, -0.9] });
      ctx.box(pw, 0.46, 0.02, 0.36, C.panel, [0, 1.38, -1.86], { rot: [-0.52, 0, 0], rough: 0.3 });
      ctx.box(pw, 0.22, 0.16, 0.12, 0x6c7379, [0, 0.62, -1.71]);
      ctx.polyRod(ctx.group(null, { node: 'hn_cable' }), [[52.62, 1.41, 0], [52.62, 0.3, 0], [54.2, 0.3, 2.4], [54.6, 0.8, 2.75]], 0.012, C.cable);

      // ================= add-on: overhead hail netting (hidden unless switched on) =================
      const hnG = ctx.group(null, { node: 'ao_hailnet', explode: [0, 1.2, 0] }), hnY = H + 2.6, hnZ = 3.2;
      ctx.instanced(hnG, new T.CylinderGeometry(0.05, 0.06, hnY + 0.6, 8), C.galv, [-52.8, -26.4, 0, 26.4, 52.8].flatMap((x) => [M(x, (hnY - 0.6) / 2, -hnZ), M(x, (hnY - 0.6) / 2, hnZ)]), { edges: true, metal: 0.2 });
      ctx.instanced(hnG, new T.CylinderGeometry(0.016, 0.016, 106, 5), 0x3a4046, [-hnZ, hnZ].map((z) => M(0, hnY, z, [0, 0, PI / 2])));
      const hnL = []; for (let z = -hnZ + 0.4; z < hnZ - 0.2; z += 0.4) hnL.push(M(0, hnY, z, [0, 0, PI / 2]));
      ctx.instanced(hnG, new T.CylinderGeometry(0.005, 0.005, 106, 3), 0x4a5157, hnL);
      const hnC = []; for (let x = -53; x <= 53; x += 0.8) hnC.push(M(x, hnY, 0, [PI / 2, 0, 0]));
      ctx.instanced(hnG, new T.CylinderGeometry(0.005, 0.005, hnZ * 2, 3), 0x4a5157, hnC);

      // ================= neighbor rows (context) =================
      const nbLam = new T.BoxGeometry(1.134, 0.035, 2.382), nbPile = new T.BoxGeometry(0.1, 1, 0.15), nbRing = ctx.ringGeo(0.098, 0.152, 0.09, 20);
      ROWS.forEach((z) => {
        const g = ctx.group(null, { rep: true, pos: [0, H, z] }); rots.push(g);
        ctx.box(ctx.group(g, { node: 'tt_tube' }), 105.6, 0.127, 0.127, C.galv, [0, 0, 0], { edgeOpacity: 0.2 });
        ctx.instanced(ctx.group(g, { node: 'pv_module' }), nbLam, 0xffffff, modX.map((x) => M(x, 0.126, 0)), { map: cellTex, rough: 0.35, edges: true, edgeOpacity: 0.22 });
        const s = ctx.group(null, { context: true });
        ctx.instanced(s, nbPile, C.pile, pileX.map((x) => pm(x, 0, z)), { edges: true, edgeOpacity: 0.2 });
        ctx.instanced(s, nbRing, C.galv, brgX.map((x) => M(x, H, z, [0, 0, PI / 2])));
        ctx.cyl(s, 0.24, 0.24, 0.17, 0x8f979e, [0, H, z], { rot: [0, 0, PI / 2] });
      });

      // ================= electrical collection =================
      const cbx = 54.6, cbz = 3.0;
      const ce = ctx.group(null, { node: 'cb_enc', shell: true });
      ctx.box(ce, 0.28, 0.9, 0.8, 0xdfe1df, [cbx, 1.25, cbz]);
      ctx.box(ce, 0.012, 0.8, 0.7, 0xd0d3d1, [cbx + 0.146, 1.25, cbz]);
      ctx.box(ctx.group(null, { node: 'cb_enc' }), 0.08, 1.7, 0.08, C.galv, [cbx - 0.2, 0.85, cbz]);
      const fz = []; for (let i = 0; i < 6; i++) fz.push(cbz - 0.32 + i * 0.085);
      ctx.instanced(ctx.group(null, { node: 'cb_fuse', explode: [0.5, 0, 0] }), new T.CylinderGeometry(0.014, 0.014, 0.08, 10), 0x30353a, [1.42, 1.22].flatMap((y) => fz.map((z) => M(cbx, y, z))));
      const dsc = ctx.group(null, { node: 'cb_disc', explode: [0.6, 0, 0.2] });
      ctx.box(dsc, 0.12, 0.2, 0.14, 0x4a5157, [cbx, 1.3, cbz + 0.27]);
      ctx.box(dsc, 0.05, 0.12, 0.03, 0x2b2f33, [cbx + 0.17, 1.3, cbz + 0.27]);
      ctx.box(ctx.group(null, { node: 'cb_spd', explode: [0.5, -0.2, 0] }), 0.1, 0.12, 0.08, 0x6d757c, [cbx, 0.96, cbz - 0.2]);
      const fe = ctx.group(null, { node: 'dc_feeder' });
      [-0.08, 0.08].forEach((dz) => ctx.polyRod(fe, [[cbx, 0.8, cbz + dz], [cbx, -0.9, cbz + dz], [69.2 + dz, -0.9, cbz + dz], [69.2 + dz, -0.9, -0.3], [69.2 + dz, 1.06, -0.3]], 0.025, C.dark));
      const mv = ctx.group(null, { node: 'mv_cable' });
      [-0.08, 0, 0.08].forEach((dz) => ctx.polyRod(mv, [[79.6 + dz, 1.06, -0.5], [79.6 + dz, -1.1, -0.5], [91.9, -1.1, -0.5 + dz]], 0.028, 0x24282c));

      // ================= power conversion skid =================
      const sk = ctx.group(null, { node: 'sk_base' });
      ctx.instanced(sk, new T.CylinderGeometry(0.3, 0.3, 2.35, 20), C.conc, [68.8, 72.4, 76, 79.6, 81.9].flatMap((x) => [M(x, -0.425, -1.1), M(x, -0.425, 1.1)]), { edges: true, rough: 0.9 });
      ctx.box(sk, 14.2, 0.3, 3.0, 0x7d858c, [75.2, 0.9, -0.1], { metal: 0.2 });
      ctx.box(sk, 14.2, 0.05, 1.1, 0xa3aaaf, [75.2, 1.02, 1.95]);
      const posts = []; for (let x = 68.3; x <= 82.2; x += 1.55) posts.push(M(x, 1.58, 2.46));
      ctx.instanced(sk, new T.CylinderGeometry(0.02, 0.02, 1.05, 8), 0xc9a640, posts);
      [2.1, 1.6].forEach((y) => ctx.rod(sk, [68.3, y, 2.46], [82.2, y, 2.46], 0.02, 0xc9a640, { seg: 8, edges: false }));
      for (let i = 0; i < 4; i++) ctx.box(sk, 0.3, 0.05, 1.0, 0xa3aaaf, [82.6 + i * 0.28, 0.82 - i * 0.26, 1.95]);
      const ic = ctx.group(null, { node: 'inv_cab', explode: [0, 2.0, 0] });
      ctx.box(ic, 3.6, 2.3, 1.5, C.cab, [71.6, 2.2, -0.35]);
      [-1.0, 1.0].forEach((dx) => ctx.box(ic, 0.012, 2.1, 1.3, 0xd0d3d1, [71.6 + dx * 1.806, 2.2, -0.35]));
      const idc = ctx.group(null, { node: 'inv_dc', explode: [-1.4, 2.0, 0] });
      ctx.box(idc, 1.1, 2.3, 1.5, C.cab2, [69.2, 2.2, -0.35]);
      ctx.box(idc, 0.9, 1.9, 0.012, 0xc8ccca, [69.2, 2.2, 0.406]);
      const louver = ctx.texture(128, 128, (c, w, h) => { c.fillStyle = '#c9cdcb'; c.fillRect(0, 0, w, h); c.fillStyle = '#8e9593'; for (let y = 4; y < h; y += 9) c.fillRect(6, y, w - 12, 4); });
      const cool = ctx.group(null, { node: 'inv_cool', explode: [0, 3.4, 0.6] });
      [70.4, 71.6, 72.8].forEach((x) => ctx.box(cool, 0.9, 1.2, 0.03, 0xffffff, [x, 2.45, 0.415], { map: louver }));
      [70.9, 72.3].forEach((x) => { ctx.box(cool, 1.0, 0.35, 1.0, 0xd3d7d5, [x, 3.53, -0.35]); ctx.cyl(cool, 0.34, 0.34, 0.05, 0x5b6268, [x, 3.73, -0.35], { seg: 28 }); });
      ctx.box(ctx.group(null, { node: 'mvt_bund', explode: [0, -0.4, 0] }), 3.4, 0.22, 2.6, 0x8a9399, [76.2, 1.16, -0.35], { metal: 0.2 });
      const tk = ctx.group(null, { node: 'mvt_tank', explode: [0, 1.6, 0] });
      ctx.box(tk, 2.0, 1.9, 1.4, C.tank, [76.2, 2.22, -0.35], { metal: 0.15 });
      ctx.box(tk, 2.1, 0.08, 1.5, 0x8d969c, [76.2, 3.21, -0.35]);
      const fins = []; for (let z = -0.95; z <= 0.26; z += 0.08) fins.push(M(75.02, 2.2, z), M(77.38, 2.2, z));
      ctx.instanced(ctx.group(null, { node: 'mvt_rad', explode: [0, 1.6, 0] }), new T.BoxGeometry(0.36, 1.5, 0.022), 0x9aa3a9, fins, { edges: true, edgeOpacity: 0.18 });
      const bu = ctx.group(null, { node: 'mvt_bush', explode: [0, 3.0, 0] }), bz = [-0.75, -0.35, 0.05];
      bz.forEach((z) => { ctx.cyl(bu, 0.045, 0.05, 0.52, 0x8e5a3c, [76.8, 3.5, z], { seg: 14 }); ctx.cyl(bu, 0.035, 0.035, 0.42, 0x8e5a3c, [75.7, 3.46, z], { seg: 12 }); });
      ctx.instanced(bu, new T.CylinderGeometry(0.09, 0.09, 0.02, 16), 0x8e5a3c, bz.flatMap((z) => [3.34, 3.44, 3.54, 3.64].map((y) => M(76.8, y, z))));
      ctx.instanced(bu, new T.CylinderGeometry(0.065, 0.065, 0.018, 14), 0x8e5a3c, bz.flatMap((z) => [3.34, 3.44, 3.54].map((y) => M(75.7, y, z))));
      const rmu = ctx.group(null, { node: 'rmu', explode: [0, 2.0, 0] });
      ctx.box(rmu, 1.6, 2.0, 1.2, C.cab, [79.6, 2.05, -0.5]);
      [-0.4, 0.4].forEach((dx) => ctx.box(rmu, 0.7, 1.7, 0.012, 0xd0d3d1, [79.6 + dx, 2.1, 0.106]));
      ctx.box(rmu, 0.2, 0.12, 0.015, 0x4f565c, [79.2, 2.6, 0.115]);
      ctx.box(ctx.group(null, { node: 'aux', explode: [1.2, 1.6, 0] }), 0.8, 1.6, 0.9, C.cab2, [81.3, 1.85, -0.6]);
      ctx.box(ctx.group(null, { node: 'scada_cab', explode: [1.2, 1.6, 0.4] }), 0.7, 1.7, 0.5, C.cab, [81.3, 1.9, 0.75]);

      // ================= skid interconnections =================
      const bus = ctx.group(null, { node: 'ac_bus', explode: [0, 2.8, 0.5] });
      ctx.box(bus, 1.9, 0.35, 0.55, 0x9aa1a7, [74.35, 2.95, -0.35], { metal: 0.2 });
      [74.0, 74.75].forEach((x) => ctx.box(bus, 0.08, 1.72, 0.08, C.galv, [x, 1.95, -0.35]));
      const hv = ctx.group(null, { node: 'hv_leads', explode: [0, 3.4, 0] });
      [-0.75, -0.35, 0.05].forEach((z, i) => ctx.tube(hv, [[76.8, 3.78, z], [77.5, 4.0, z], [78.7, 3.75, -0.62 + i * 0.12], [79.25, 3.06, -0.62 + i * 0.12]], 0.03, 0x24282c, { segs: 30 }));
      ctx.box(hv, 0.9, 0.04, 0.5, 0x8d949a, [79.35, 3.06, -0.5]);
      [[cbx, cbz - 0.08], [cbx, cbz + 0.08]].forEach(([x, z]) => ctx.cyl(fe, 0.045, 0.045, 0.85, 0x8d949a, [x, 0.38, z], { seg: 12, edges: false }));
      [[69.12, -0.3], [69.28, -0.3]].forEach(([x, z]) => ctx.cyl(fe, 0.045, 0.045, 1.08, 0x8d949a, [x, 0.5, z], { seg: 12, edges: false }));
      ctx.cyl(mv, 0.08, 0.08, 1.08, 0x8d949a, [79.6, 0.5, -0.5], { seg: 14, edges: false });

      // ================= grounding =================
      const gc = ctx.group(null, { node: 'gr_cond' });
      ctx.rod(gc, [-52.6, -0.75, 0.45], [52.6, -0.75, 0.45], 0.012, C.cu, { seg: 6, edges: false, metal: 0.5 });
      ctx.polyRod(gc, [[52.6, -0.75, 0.45], [cbx, -0.75, 3.3], [67.6, -0.75, 3.3], [67.6, -0.75, -1.9], [82.8, -0.75, -1.9], [82.8, -0.75, 2.6], [67.6, -0.75, 2.6]], 0.012, C.cu, { metal: 0.5 });
      ctx.instanced(ctx.group(null, { node: 'gr_rods' }), new T.CylinderGeometry(0.012, 0.012, 2.4, 8), C.cu, [[-52.6, 0.45], [52.6, 0.45], [cbx, 3.3], [67.6, -1.9], [82.8, -1.9], [82.8, 2.6], [67.6, 2.6]].map(([x, z]) => M(x, -1.95, z)), { metal: 0.5 });
      ctx.instanced(ctx.group(null, { node: 'gr_jumper' }), new T.BoxGeometry(0.03, 0.16, 0.025), C.cu, brgX.map((x) => M(x + 0.085, H - 0.1, 0.07)), { metal: 0.45 });

      // ================= monitoring =================
      const mx = 66.5, mz = 9;
      const met = ctx.group(null, { node: 'wx' });
      ctx.box(met, 0.5, 0.06, 0.5, C.conc, [mx, 0.03, mz]);
      ctx.rod(met, [mx, 0, mz], [mx, 3.2, mz], 0.035, C.galv, { seg: 12 });
      ctx.rod(met, [mx - 0.7, 2.6, mz], [mx + 0.7, 2.6, mz], 0.02, C.galv, { seg: 8 });
      const pyr = ctx.group(met, { node: 'me_pyr' });
      ctx.cyl(pyr, 0.07, 0.07, 0.05, 0xd9dcdf, [mx, 3.25, mz], { seg: 20 });
      ctx.mesh(pyr, new T.SphereGeometry(0.028, 16, 8, 0, PI * 2, 0, PI / 2), 0xcfe0ea, { pos: [mx, 3.275, mz], opacity: 0.6, rough: 0.1, edges: false });
      ctx.box(pyr, 0.34, 0.012, 0.2, C.galv, [mx - 0.7, 2.7, mz], { rot: [0, 0, 0.52] });
      ctx.cyl(pyr, 0.05, 0.05, 0.04, 0xd9dcdf, [mx - 0.76, 2.69, mz], { rot: [0, 0, 0.52], seg: 16 });
      ctx.box(pyr, 0.12, 0.018, 0.12, C.panel, [mx - 0.6, 2.75, mz], { rot: [0, 0, 0.52] });
      const wnd = ctx.group(met, { node: 'me_wind' });
      ctx.rod(wnd, [mx + 0.7, 2.6, mz], [mx + 0.7, 2.86, mz], 0.015, C.galv, { seg: 8 });
      ctx.cyl(wnd, 0.04, 0.04, 0.12, 0xd9dcdf, [mx + 0.7, 2.92, mz], { seg: 14 });
      for (let i = 0; i < 3; i++) { const a = (i * 2 * PI) / 3; ctx.rod(wnd, [mx + 0.7, 2.98, mz], [mx + 0.7 + Math.cos(a) * 0.08, 3.08, mz + Math.sin(a) * 0.08], 0.006, 0xd9dcdf, { seg: 6, edges: false }); }
      ctx.cyl(wnd, 0.075, 0.075, 0.015, 0xd9dcdf, [mx + 0.7, 3.09, mz], { seg: 18 });
      const lg = ctx.group(met, { node: 'me_logger' });
      ctx.box(lg, 0.4, 0.5, 0.2, C.tcu, [mx, 1.3, mz - 0.14]);
      ctx.box(lg, 0.45, 0.02, 0.35, C.panel, [mx, 2.1, mz - 0.18], { rot: [-0.6, 0, 0] });
      ctx.rod(lg, [mx + 0.15, 1.55, mz - 0.14], [mx + 0.15, 1.85, mz - 0.14], 0.007, C.dark, { seg: 6 });
      const fb = ctx.group(null, { node: 'scada_fiber' });
      ctx.polyRod(fb, [[81.3, 1.06, 0.75], [81.3, -1.0, 0.75], [91.9, -1.0, 0.75]], 0.012, C.fiber);
      ctx.polyRod(fb, [[mx, 1.05, mz - 0.14], [mx, -0.6, mz - 0.14], [mx, -0.6, 3.0], [81.0, -0.95, 3.0], [81.0, -0.95, 0.75]], 0.012, C.fiber);

      // ================= civil =================
      const gravel = ctx.texture(256, 256, (c, w, h) => { c.fillStyle = '#b8b1a2'; c.fillRect(0, 0, w, h); for (let i = 0; i < 5000; i++) { c.fillStyle = ['#a59e8f', '#c9c2b3', '#9a9385', '#d3cdbf', '#8e887c'][i % 5]; c.fillRect(Math.random() * w, Math.random() * h, 2, 2); } });
      gravel.wrapS = gravel.wrapT = T.RepeatWrapping; gravel.repeat.set(2, 40);
      ctx.box(ctx.group(null, { node: 'pr_road' }), 6, 0.1, 120, 0xffffff, [61, 0.05, 0], { map: gravel, rough: 1, edgeOpacity: 0.15 });
      const fn = ctx.group(null, { node: 'pr_fence' });
      const fp = []; for (let z = -32; z <= 40; z += 3) fp.push(M(90, 1.15, z)); for (let x = -60; x < 90; x += 3) if (x < 57 || x > 65) fp.push(M(x, 1.15, -32));
      ctx.instanced(fn, new T.CylinderGeometry(0.03, 0.03, 2.3, 8), C.galv, fp, { metal: 0.3 });
      const link = (len) => { const t = ctx.texture(64, 64, (c, w, h) => { c.strokeStyle = 'rgba(150,156,160,1)'; c.lineWidth = 3; c.beginPath(); c.moveTo(0, 0); c.lineTo(w, h); c.moveTo(w, 0); c.lineTo(0, h); c.stroke(); }); t.wrapS = t.wrapT = T.RepeatWrapping; t.repeat.set(len / 0.15, 2.0 / 0.15); return t; };
      const fab = (len, pos, ry) => ctx.mesh(fn, new T.PlaneGeometry(len, 2.0), 0xffffff, { pos, rot: [0, ry, 0], map: link(len), side: T.DoubleSide, alphaTest: 0.3, edges: false, shadow: false });
      fab(72, [90, 1.05, 4], PI / 2); fab(117, [-1.5, 1.05, -32], 0); fab(25, [77.5, 1.05, -32], 0);
      [[90, 90, -32, 40], [-60, 57, -32, -32], [65, 90, -32, -32]].forEach(([xa, xb, za, zb]) => [2.15, 2.3].forEach((y) => ctx.rod(fn, [xa, y, za], [xb, y, zb], 0.006, 0x6f777e, { seg: 4, edges: false })));
      [[57, 61], [61, 65]].forEach(([a, b]) => { ctx.box(fn, b - a, 0.05, 0.05, C.galv, [(a + b) / 2, 1.9, -32]); ctx.box(fn, b - a, 0.05, 0.05, C.galv, [(a + b) / 2, 0.15, -32]); ctx.box(fn, 0.05, 1.8, 0.05, C.galv, [b - 0.05, 1.03, -32]); });

      ctx.onUpdate((v) => {
        const a = ctx.deg(v.tilt);
        rots.forEach((g) => { g.rotation.x = a; g.updateMatrixWorld(true); });
        dampers.forEach((d) => {
          d.g.updateMatrixWorld(true);
          const B = d.g.worldToLocal(rot.localToWorld(d.B0.clone()));
          const Pm = d.A.clone().lerp(B, 0.58);
          ctx.aimRod(d.body, d.A.toArray(), Pm.toArray());
          ctx.aimRod(d.piston, Pm.toArray(), B.toArray());
        });
      });
    },
  };
})();
