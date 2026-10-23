/* Geometry: complete 2.8 MW geared DFIG wind turbine — foundation, tower and internals, nacelle drivetrain, rotor hub,
   full 62 m blades with internal structure, pad-mount transformer, grounding and civil works. y = up, z = rotor axis (upwind +). Metres. */
(function () {
  const R = window.SubsystemModels = window.SubsystemModels || {};
  const smooth = (t) => { t = Math.max(0, Math.min(1, t)); return t * t * (3 - 2 * t); };
  const TOP = 86.6;
  R['wind-turbine'] = {
    env: 'prairie',
    caps: { subsurface: true, internals: true },
    connections: { power: ['tw_cable', 'nc_cables', 'el_lv', 'el_mv'], ground: ['gd_ring', 'gd_rods', 'lp_conductor', 'lp_band', 'lp_transfer', 'lp_air'], comms: [] },
    camera: { theta: 0.95, phi: 1.43, r: 300, target: [0, 76, 0] },
    thumbView: { theta: 0.95, phi: 1.08, per: { foundation: { ghost: ['fd_pedestal', 'fd_footing'] }, hub: { ghost: ['hb_spinner'] }, tw_access: { box: [[-5.2, 0, -2.4], [2.4, 5, 2.4]], ghost: [] }, blade: { box: [[-4, TOP + 2, 0], [4, TOP + 40, 6]] }, lps: { box: [[-3, TOP - 2, -9], [3, TOP + 12, 8]] }, tower: { box: [[-2.4, 0, -2.4], [2.4, 26, 2.4]] }, cv_road: { box: [[40, 0, -8], [70, 0.2, 8]] } } },
    controls: [
      { id: 'pitch', label: 'Blade pitch', min: 0, max: 90, step: 1, value: 4, unit: '°', presets: [{ label: 'Operating 0°', v: 0 }, { label: 'Feathered 90°', v: 90 }] },
      { id: 'rpm', label: 'Rotor speed', min: 0, max: 14, step: 0.5, value: 0, unit: ' rpm', presets: [{ label: 'Parked', v: 0 }, { label: 'Cut-in 6', v: 6 }, { label: 'Rated 14', v: 14 }] },
    ],
    build(ctx) {
      const T = ctx.T, PI = Math.PI, M = (x, y, z, r, s) => ctx.mat4([x, y, z], r, s);
      const C = { cast: 0xc2c7cb, gear: 0x8b949b, gen: 0x7e8990, shaft: 0xb3b8bc, brg: 0xd0d4d7, yaw: 0xa6adb3, teeth: 0x88909a, cal: 0x6d767d, motor: 0x5e666e, cab: 0xe5e6e3, frame: 0x9aa1a8, cover: 0xeceeed, blade: 0xf0f1ef, cu: 0xb67a4c, dark: 0x3d4349, tower: 0xe8eae9, conc: 0xc9c5bc, grate: 0xa3aaaf, pm: 0x6e8270 };
      const AX = [PI / 2, 0, 0];
      ctx.ground({ x0: -17, x1: 17, z0: -17, z1: 17, depth: 5 });
      const gravelTex = (rx, rz) => { const t = ctx.texture(256, 256, (c, w, h) => { c.fillStyle = '#b8b1a2'; c.fillRect(0, 0, w, h); for (let i = 0; i < 5000; i++) { c.fillStyle = ['#a59e8f', '#c9c2b3', '#9a9385', '#d3cdbf', '#8e887c'][i % 5]; c.fillRect(Math.random() * w, Math.random() * h, 2, 2); } }); t.wrapS = t.wrapT = T.RepeatWrapping; t.repeat.set(rx, rz); return t; };

      // ================= foundation =================
      const ft = ctx.group(null, { node: 'fd_footing', shell: true });
      ctx.cyl(ft, 9, 9, 1.2, C.conc, [0, -3.4, 0], { seg: 8, rough: 0.9 });
      ctx.cyl(ft, 3.4, 9, 1.0, C.conc, [0, -2.3, 0], { seg: 8, rough: 0.9 });
      ctx.cyl(ctx.group(null, { node: 'fd_pedestal', shell: true }), 3.3, 3.3, 1.99, C.conc, [0, -0.805, 0], { seg: 48, rough: 0.9 });
      const an = ctx.group(null, { node: 'fd_anchor' });
      const bolts = [...ctx.polar(72, 1.95, 0, (a, x, y, z) => M(x, -1.575, z)), ...ctx.polar(72, 2.35, 0, (a, x, y, z) => M(x, -1.575, z))];
      ctx.instanced(an, new T.CylinderGeometry(0.025, 0.025, 4.05, 8), 0x7d858c, bolts, { metal: 0.4 });
      ctx.ring(an, 1.85, 2.45, 0.05, 0x8d949a, [0, -3.6, 0], { metal: 0.3 });
      ctx.instanced(an, new T.CylinderGeometry(0.05, 0.05, 0.07, 6), 0x5c646b, [...ctx.polar(72, 1.95, 0.39, (a, x, y, z) => M(x, y, z)), ...ctx.polar(72, 2.35, 0.39, (a, x, y, z) => M(x, y, z))]);
      ctx.ring(ctx.group(null, { node: 'fd_grout' }), 1.8, 2.55, 0.06, 0x9e9a92, [0, 0.22, 0]);

      // ================= tower =================
      const rAt = (y) => 2.15 - 0.6 * (y - 0.25) / (TOP - 0.37);
      const joints = [0.25, 22.5, 50.5, TOP - 0.12];
      const sh = ctx.group(null, { node: 'tw_shell', shell: true });
      for (let i = 0; i < 3; i++) { const a = joints[i], b = joints[i + 1]; ctx.cyl(sh, rAt(b), rAt(a), b - a, C.tower, [0, (a + b) / 2, 0], { open: true, seg: 56, side: T.DoubleSide, rough: 0.55 }); }
      ctx.box(sh, 0.1, 2.2, 1.0, 0x9aa1a8, [-rAt(2.4) - 0.02, 2.4, 0]);
      const fl = ctx.group(null, { node: 'tw_flange' });
      joints.forEach((y) => { const r = rAt(y); ctx.ring(fl, r - 0.22, r + 0.01, 0.2, 0xb9bec2, [0, y, 0], { metal: 0.3 }); });
      ctx.instanced(fl, new T.CylinderGeometry(0.022, 0.022, 0.36, 6), 0x6f777e, joints.flatMap((y) => ctx.polar(96, rAt(y) - 0.11, y, (a, x, yy, z) => M(x, yy, z))));
      const pl = ctx.group(null, { node: 'tw_platform' });
      [1.3, 21.4, 49.4, TOP - 1.6].forEach((y) => ctx.ring(pl, 0.5, rAt(y) - 0.04, 0.06, C.grate, [0, y, 0], { seg: 40 }));
      const ld = ctx.group(null, { node: 'tw_ladder' });
      [-0.2, 0.2].forEach((x) => ctx.rod(ld, [x, 1.3, -1.2], [x, TOP - 1.0, -1.2], 0.022, 0xc9cdd0, { seg: 6, edges: false, metal: 0.4 }));
      const rungs = []; for (let y = 1.6; y < TOP - 1.2; y += 0.3) rungs.push(M(0, y, -1.2));
      ctx.instanced(ld, new T.BoxGeometry(0.4, 0.025, 0.025), 0xc9cdd0, rungs, { metal: 0.4 });
      ctx.rod(ld, [0, 1.3, -1.12], [0, TOP - 1.0, -1.12], 0.006, 0x3d4349, { seg: 4, edges: false });
      const lf = ctx.group(null, { node: 'tw_lift' });
      ctx.box(lf, 0.85, 1.25, 0.8, 0xd7a93d, [-0.75, 34, 0.75]);
      ctx.box(lf, 0.5, 0.28, 0.4, C.motor, [-0.75, 34.78, 0.75]);
      [-0.32, 0.32].forEach((dz) => ctx.rod(lf, [-0.75, 1.3, 0.75 + dz], [-0.75, TOP - 1.6, 0.75 + dz], 0.008, 0x60686f, { seg: 4, edges: false }));
      const cb = ctx.group(null, { node: 'tw_cable' });
      [[0.14, 0.14], [-0.14, 0.14], [0.14, -0.14], [-0.14, -0.14]].forEach(([x, z]) => {
        ctx.rod(cb, [x, 2.6, z], [x, TOP - 7, z], 0.04, 0x2b2f33, { seg: 8, edges: false });
        ctx.tube(cb, [[x, TOP - 7, z], [x * 3, TOP - 5.5, z * 3 + 0.5], [x * 2, TOP - 3, z * 2 + 0.3], [x, TOP + 0.6, z]], 0.04, 0x2b2f33);
      });
      const st = ctx.group(null, { node: 'tw_door' });
      ctx.box(st, 1.4, 0.08, 1.6, C.grate, [-2.95, 1.25, 0]);
      for (let i = 0; i < 5; i++) ctx.box(st, 0.3, 0.05, 1.0, C.grate, [-3.8 - i * 0.28, 1.0 - i * 0.24, 0]);
      [-0.8, 0.8].forEach((dz) => ctx.rod(st, [-3.65, 2.3, dz], [-2.3, 2.3, dz], 0.02, 0xc9a640, { seg: 6, edges: false }));
      const bc = ctx.group(null, { node: 'el_basecab', explode: [0, 2.2, 0] });
      [-0.55, 0.55].forEach((z) => { ctx.box(bc, 0.6, 2.0, 1.0, C.cab, [1.25, 2.33, z]); ctx.box(bc, 0.012, 1.8, 0.85, 0xd0d3d1, [0.944, 2.33, z]); });

      // ================= electrical infrastructure =================
      const pmx = -8.2, pmz = 5;
      ctx.box(ctx.group(null, { node: 'pm_pad', explode: [0, -0.6, 0] }), 3.6, 0.25, 3.2, C.conc, [pmx, 0.075, pmz], { rough: 0.9 });
      const pt = ctx.group(null, { node: 'pm_tank', explode: [0, 2.2, 0] });
      ctx.box(pt, 1.9, 1.7, 1.7, C.pm, [pmx - 0.35, 1.05, pmz]);
      ctx.box(pt, 2.0, 0.07, 1.8, 0x647766, [pmx - 0.35, 1.93, pmz]);
      const fins = []; for (let z = pmz - 0.7; z <= pmz + 0.71; z += 0.1) fins.push(M(pmx - 1.48, 1.0, z));
      ctx.instanced(ctx.group(null, { node: 'pm_rad', explode: [-1.4, 2.2, 0] }), new T.BoxGeometry(0.36, 1.3, 0.025), C.pm, fins, { edges: true, edgeOpacity: 0.18 });
      const pc = ctx.group(null, { node: 'pm_cab', explode: [1.6, 0.6, 0] });
      ctx.box(pc, 0.9, 1.5, 1.8, C.pm, [pmx + 1.05, 0.95, pmz]);
      [-0.45, 0.45].forEach((dz) => ctx.box(pc, 0.012, 1.3, 0.8, 0x7a8e7c, [pmx + 1.506, 0.95, pmz + dz]));
      const lv = ctx.group(null, { node: 'el_lv' });
      [-0.12, 0, 0.12].forEach((d) => ctx.polyRod(lv, [[0.4 + d, 1.3, 0.6], [0.4 + d, -1.0, 0.6], [pmx + 1.0, -1.0, pmz - 0.5 + d], [pmx + 1.0, 0.25, pmz - 0.5 + d]], 0.045, 0x2b2f33));
      const mv = ctx.group(null, { node: 'el_mv' });
      [-0.1, 0, 0.1].forEach((d) => ctx.polyRod(mv, [[pmx + 1.0, 0.25, pmz + 0.5 + d], [pmx + 1.0, -1.2, pmz + 0.5 + d], [-16.9, -1.2, pmz + 0.5 + d]], 0.035, 0x24282c));
      ctx.ring(ctx.group(null, { node: 'gd_ring' }), 10.0, 10.03, 0.03, C.cu, [0, -0.8, 0], { seg: 64, metal: 0.5, edges: false });
      ctx.instanced(ctx.group(null, { node: 'gd_rods' }), new T.CylinderGeometry(0.014, 0.014, 3, 8), C.cu, ctx.polar(8, 10, -2.3, (a, x, y, z) => M(x, y, z)), { metal: 0.5 });

      // ================= civil =================
      const cp = ctx.group(null, { node: 'cv_cranepad' });
      ctx.box(cp, 30, 0.12, 20, 0xffffff, [27.5, 0.06, 0], { map: gravelTex(8, 5), rough: 1, edgeOpacity: 0.15 });
      ctx.mesh(cp, ctx.ringGeo(3.32, 7, 0.06, 48), 0xffffff, { pos: [0, 0.03, 0], map: gravelTex(3, 3), rough: 1, edges: false });
      ctx.box(ctx.group(null, { node: 'cv_road' }), 320, 0.1, 6, 0xffffff, [202.5, 0.05, 0], { map: gravelTex(80, 2), rough: 1, edgeOpacity: 0.12 });

      // ================= nacelle (at tower top) =================
      const top = ctx.group(null, { pos: [0, TOP, 0], explode: [0, 7, 0] });
      ctx.ring(ctx.group(top, { node: 'yb_disc', explode: [0, -1.0, 0] }), 1.55, 2.05, 0.05, C.yaw, [0, 0.025, 0], { metal: 0.3 });
      const yb = ctx.group(top, { node: 'yawbrg', explode: [0, -1.8, 0] });
      ctx.ring(yb, 1.35, 1.78, 0.24, C.yaw, [0, 0.17, 0], { metal: 0.25 });
      ctx.instanced(yb, new T.BoxGeometry(0.06, 0.2, 0.045), C.teeth, ctx.polar(104, 1.32, 0.17, (a, x, y, z) => M(x, y, z, [0, -a, 0])));
      for (let k = 0; k < 8; k++) {
        const a = PI / 8 + (k * PI) / 4, c = Math.cos(a), s = Math.sin(a);
        const g = ctx.group(top, { node: 'yb_caliper', explode: [c * 0.8, -0.6, s * 0.8] });
        ctx.box(g, 0.34, 0.3, 0.26, C.cal, [c * 1.92, 0.03, s * 1.92], { rot: [0, -a, 0] });
        ctx.box(g, 0.18, 0.36, 0.2, C.frame, [c * 1.82, 0.36, s * 1.82], { rot: [0, -a, 0] });
      }
      for (let k = 0; k < 4; k++) {
        const a = PI / 4 + (k * PI) / 2, x = Math.cos(a) * 1.12, z = Math.sin(a) * 1.12;
        const g = ctx.group(top, { node: 'yawdrv', explode: [Math.cos(a) * 0.5, 2.2, Math.sin(a) * 0.5] });
        ctx.cyl(g, 0.15, 0.15, 0.18, C.teeth, [x, 0.17, z], { seg: 14, flat: true });
        ctx.cyl(g, 0.17, 0.17, 1.1, C.gear, [x, 0.81, z]);
        ctx.cyl(g, 0.24, 0.24, 0.05, C.gear, [x, 1.335, z]);
        ctx.cyl(g, 0.15, 0.15, 0.5, C.motor, [x, 1.61, z]);
        ctx.cyl(g, 0.12, 0.12, 0.08, C.dark, [x, 1.9, z]);
      }
      const bp = ctx.group(top, { node: 'bedplate' });
      ctx.box(bp, 3.0, 1.0, 3.2, C.cast, [0, 0.8, 0]);
      ctx.box(bp, 2.0, 0.8, 1.2, C.cast, [0, 0.9, 2.2]);
      ctx.box(bp, 1.8, 0.35, 1.0, C.cast, [0, 1.42, 2.6]);
      [-1.38, 1.38].forEach((x) => ctx.box(bp, 0.45, 0.28, 0.6, C.cast, [x, 1.43, 0]));
      const rf = ctx.group(top, { node: 'rearframe', explode: [0, -0.7, -0.6] });
      [-1.05, 1.05].forEach((x) => ctx.box(rf, 0.22, 0.36, 6.4, C.frame, [x, 1.32, -4.8], { metal: 0.15 }));
      [-3.2, -5.6, -7.8].forEach((z) => ctx.box(rf, 1.88, 0.22, 0.18, C.frame, [0, 1.3, z]));
      [[-3.9, 0.39, 1.695], [-5.2, 0.28, 1.64]].forEach(([z, h, y]) => [-0.5, 0.5].forEach((x) => ctx.box(rf, 0.3, h, 0.36, C.frame, [x, y, z])));
      const cv = ctx.group(top, { node: 'cover', shell: true, explode: [0, 6.5, 0] });
      {
        const w = 2.0, h = 4.05, r = 0.7, s = new T.Shape();
        s.moveTo(-w + r, 0); s.lineTo(w - r, 0); s.quadraticCurveTo(w, 0, w, r); s.lineTo(w, h - r); s.quadraticCurveTo(w, h, w - r, h);
        s.lineTo(-w + r, h); s.quadraticCurveTo(-w, h, -w, h - r); s.lineTo(-w, r); s.quadraticCurveTo(-w, 0, -w + r, 0);
        const g = new T.ExtrudeGeometry(s, { depth: 10.4, bevelEnabled: false, curveSegments: 10 }); g.translate(0, 0, -8.1);
        ctx.mesh(cv, g, C.cover, { side: T.DoubleSide, rough: 0.6 });
        ctx.box(cv, 1.0, 0.05, 1.2, 0xdfe2e1, [0, 4.07, -2.4]);
      }
      const cr = ctx.group(top, { node: 'crane', explode: [0, 4.4, 0] });
      ctx.box(cr, 0.16, 0.22, 6.2, C.frame, [-1.0, 3.78, -4.8]);
      ctx.box(cr, 0.34, 0.24, 0.42, 0x6f777e, [-1.0, 3.55, -6.9]);
      ctx.rod(cr, [-1.0, 3.43, -6.9], [-1.0, 3.05, -6.9], 0.012, C.dark, { seg: 6 });
      const cnv = ctx.group(top, { node: 'converter', explode: [2.4, 1.0, 0] });
      ctx.box(cnv, 0.8, 2.0, 1.9, C.cab, [1.25, 2.5, -6.95]);
      [-6.32, -6.95, -7.58].forEach((z) => ctx.box(cnv, 0.012, 1.84, 0.58, 0xd3d5d2, [0.845, 2.5, z]));
      const ctl = ctx.group(top, { node: 'controller', explode: [-2.4, 1.0, 0] });
      ctx.box(ctl, 0.6, 1.5, 1.2, C.cab, [-1.3, 2.25, -6.6]);
      ctx.box(ctl, 0.012, 1.36, 1.08, 0xd3d5d2, [-0.995, 2.25, -6.6]);
      const hy = ctx.group(top, { node: 'hydraulic', explode: [-2.0, 0.8, 0.6] });
      ctx.box(hy, 0.55, 0.5, 0.7, 0x737b82, [-1.15, 1.55, 1.0]);
      [-0.15, 0.15].forEach((dx) => ctx.cyl(hy, 0.09, 0.09, 0.45, 0x5a6168, [-1.15 + dx, 2.03, 1.22], { seg: 16 }));
      const co = ctx.group(top, { node: 'cooling', explode: [0, 8.0, 0] });
      const finT = ctx.texture(256, 128, (c, w, h) => { c.fillStyle = '#c9ced2'; c.fillRect(0, 0, w, h); c.fillStyle = '#9aa1a7'; for (let y = 0; y < h; y += 4) c.fillRect(0, y, w, 1); });
      ctx.box(co, 2.7, 1.3, 0.16, 0xffffff, [0, 4.85, -6.3], { map: finT });
      [-1.42, 1.42].forEach((x) => ctx.box(co, 0.1, 1.45, 0.26, C.frame, [x, 4.78, -6.3]));
      ctx.box(co, 2.94, 0.08, 0.26, C.frame, [0, 5.54, -6.3]);
      const met = ctx.group(top, { node: 'met', explode: [0, 8.6, 0] });
      ctx.rod(met, [0, 4.05, -7.7], [0, 5.6, -7.7], 0.04, C.frame, { seg: 10 });
      ctx.rod(met, [-0.7, 5.6, -7.7], [0.7, 5.6, -7.7], 0.03, C.frame, { seg: 10 });
      const an2 = ctx.group(met, { node: 'me_anemo' });
      ctx.rod(an2, [-0.7, 5.6, -7.7], [-0.7, 5.82, -7.7], 0.014, C.dark, { seg: 8 });
      ctx.cyl(an2, 0.03, 0.03, 0.04, C.dark, [-0.7, 5.84, -7.7], { seg: 12 });
      for (let i = 0; i < 3; i++) {
        const a = (i * 2 * PI) / 3, x = -0.7 + Math.cos(a) * 0.13, z = -7.7 + Math.sin(a) * 0.13;
        ctx.rod(an2, [-0.7, 5.84, -7.7], [x, 5.84, z], 0.006, C.dark, { seg: 6, edges: false });
        ctx.mesh(an2, new T.SphereGeometry(0.045, 16, 10, 0, PI * 2, 0, PI / 2), 0x4b5258, { pos: [x, 5.84, z], rot: [0, 0, PI / 2 + a], side: T.DoubleSide, edges: false });
      }
      const vn = ctx.group(met, { node: 'me_vane' });
      ctx.rod(vn, [0.7, 5.6, -7.7], [0.7, 5.82, -7.7], 0.014, C.dark, { seg: 8 });
      ctx.rod(vn, [0.7, 5.84, -7.45], [0.7, 5.84, -7.95], 0.012, C.dark, { seg: 8 });
      ctx.box(vn, 0.01, 0.14, 0.2, 0x4b5258, [0.7, 5.88, -7.92]);
      ctx.rod(ctx.group(met, { node: 'lp_air' }), [0, 5.6, -7.7], [0, 6.7, -7.7], 0.014, C.cu, { r2: 0.018, seg: 8, metal: 0.5, rough: 0.4 });

      const nc = ctx.group(top, { node: 'nc_cables', explode: [0, 3.0, 0] });
      [-0.1, 0, 0.1].forEach((d) => {
        ctx.tube(nc, [[0.95, 3.05, -4.05 + d], [1.05, 3.6, -4.8 + d], [1.2, 3.62, -5.9 + d], [1.2, 3.5, -6.1 + d]], 0.035, 0x2b2f33, { segs: 24 });
        ctx.tube(nc, [[0.9 + d, 1.6, -6.2], [0.6 + d, 1.56, -3.0], [0.25 + d, 1.42, -0.5], [0.14 + d, 0.7, 0.14]], 0.04, 0x2b2f33, { segs: 30 });
      });
      [-0.12, 0, 0.12].forEach((d) => ctx.cyl(lv, 0.06, 0.06, 0.3, 0x8d949a, [pmx + 1.0, 0.1, pmz - 0.5 + d], { seg: 12, edges: false }));

      // drivetrain (5° tilt)
      const dt = ctx.group(top, { pos: [0, 2.4, 0], rot: [-5 * PI / 180, 0, 0] });
      const sf = ctx.group(dt, { node: 'ms_shaft', explode: [0, 1.2, 1.6] });
      ctx.cyl(sf, 0.36, 0.36, 3.0, C.shaft, [0, 0, 1.9], { rot: AX, metal: 0.35, rough: 0.4 });
      ctx.cyl(sf, 0.85, 0.85, 0.14, C.shaft, [0, 0, 3.33], { rot: AX, metal: 0.35, rough: 0.4, seg: 48 });
      const lk = ctx.group(dt, { node: 'ms_lock', explode: [0, 1.2, 1.6] });
      ctx.cyl(lk, 0.92, 0.92, 0.1, C.gear, [0, 0, 0.85], { rot: AX, seg: 48 });
      ctx.instanced(lk, new T.CylinderGeometry(0.06, 0.06, 0.12, 12), C.dark, ctx.polar(12, 0.75, 0, (a, x, y, z) => M(x, z, 0.85, AX)));
      [-0.75, 0.75].forEach((x) => ctx.box(lk, 0.22, 0.5, 0.3, C.motor, [x, -0.95, 0.85]));
      const mh = ctx.group(dt, { node: 'mb_housing', explode: [0, 2.0, 0.6] });
      ctx.cyl(mh, 0.72, 0.72, 0.8, C.cast, [0, 0, 2.6], { rot: AX, seg: 40 });
      ctx.box(mh, 1.7, 0.75, 0.9, C.cast, [0, -0.6, 2.6]);
      ctx.box(mh, 2.1, 0.12, 0.9, C.cast, [0, -0.92, 2.6]);
      ctx.ring(ctx.group(dt, { node: 'mb_bearing', explode: [0, 2.7, 0.6] }), 0.36, 0.62, 0.9, C.brg, [0, 0, 2.6], { rot: AX, metal: 0.4, rough: 0.35 });
      const gp = ctx.group(dt, { node: 'gb_planet', explode: [0, 2.6, 0.5] });
      ctx.cyl(gp, 1.05, 1.05, 1.1, C.gear, [0, 0, 0], { rot: AX, seg: 48 });
      ctx.cyl(gp, 0.7, 0.8, 0.2, C.gear, [0, 0, 0.6], { rot: AX, seg: 40 });
      [-0.3, 0.3].forEach((z) => ctx.ring(gp, 1.04, 1.12, 0.08, 0x7d868d, [0, 0, z], { rot: AX }));
      const ps = ctx.group(dt, { node: 'gb_parallel', explode: [0, 2.6, -0.2] });
      ctx.box(ps, 1.6, 2.0, 1.4, C.gear, [0, 0.3, -1.25]);
      ctx.box(ps, 0.9, 0.06, 0.7, 0x7d868d, [0, 1.33, -1.25]);
      ctx.cyl(ps, 0.25, 0.25, 0.2, C.gear, [0, 0.75, -2.02], { rot: AX });
      [-1, 1].forEach((s) => {
        const g = ctx.group(dt, { node: 'gb_arms', explode: [s * 0.9, 2.6, 0.5] });
        ctx.box(g, 0.5, 0.55, 0.6, C.gear, [s * 1.25, -0.2, 0]);
        ctx.cyl(g, 0.17, 0.17, 0.42, 0x2f3438, [s * 1.38, -0.62, 0], { seg: 20 });
      });
      const lu = ctx.group(dt, { node: 'gb_lube', explode: [1.2, 2.2, 0] });
      ctx.box(lu, 0.36, 0.5, 0.6, 0x6b737a, [1.0, -0.45, -1.3]);
      ctx.cyl(lu, 0.09, 0.09, 0.35, 0x4a5157, [1.0, 0.0, -1.05], { seg: 16 });
      ctx.cyl(ctx.group(dt, { node: 'hs_disc', explode: [0, 3.6, -0.9] }), 0.42, 0.42, 0.05, 0xa3a9ae, [0, 0.75, -2.2], { rot: AX, metal: 0.45, rough: 0.35, seg: 40 });
      ctx.box(ctx.group(dt, { node: 'hs_caliper', explode: [0.5, 3.6, -0.9] }), 0.18, 0.26, 0.16, C.cal, [0.3, 1.05, -2.2], { rot: [0, 0, -PI / 4] });
      const cpl = ctx.group(dt, { node: 'hs_coupling', explode: [0, 2.2, -1.3] });
      ctx.cyl(cpl, 0.13, 0.13, 1.0, C.shaft, [0, 0.75, -2.85], { rot: AX, metal: 0.35 });
      [-2.4, -3.3].forEach((z) => ctx.cyl(cpl, 0.26, 0.26, 0.08, C.shaft, [0, 0.75, z], { rot: AX, metal: 0.35 }));
      ctx.cyl(cpl, 0.17, 0.17, 0.2, C.dark, [0, 0.75, -2.85], { rot: AX });
      const gs = ctx.group(dt, { node: 'gn_stator', explode: [0, 2.6, -2.4] });
      ctx.cyl(gs, 0.7, 0.7, 2.2, C.gen, [0, 0.75, -4.55], { rot: AX, seg: 40 });
      [-3.45, -5.65].forEach((z) => ctx.cyl(gs, 0.6, 0.6, 0.12, C.gen, [0, 0.75, z], { rot: AX, seg: 40 }));
      ctx.instanced(gs, new T.BoxGeometry(0.07, 0.025, 1.9), 0x74808a, ctx.polar(18, 0.73, 0, (a) => M(Math.cos(a) * 0.73, 0.75 + Math.sin(a) * 0.73, -4.55, [0, 0, a])));
      [-3.9, -5.2].forEach((z) => [-0.5, 0.5].forEach((x) => ctx.box(gs, 0.3, 0.3, 0.4, C.gen, [x, -0.02, z])));
      ctx.box(gs, 0.36, 0.34, 0.5, 0x6c767e, [0.8, 0.95, -4.0]);
      const sl = ctx.group(dt, { node: 'gn_slip', explode: [0, 2.6, -3.2] });
      ctx.cyl(sl, 0.34, 0.34, 0.5, 0x6c767e, [0, 0.75, -5.95], { rot: AX });
      ctx.cyl(sl, 0.2, 0.2, 0.08, C.dark, [0, 0.75, -6.24], { rot: AX });
      const gc = ctx.group(dt, { node: 'gn_cooler', explode: [0, 3.6, -2.4] });
      ctx.box(gc, 1.1, 0.34, 1.7, 0x9aa2a8, [0, 1.62, -4.4]);
      [-4.9, -3.9].forEach((z) => ctx.cyl(gc, 0.2, 0.2, 0.06, C.dark, [0, 1.8, z], { seg: 20 }));

      // ================= rotor =================
      const rotor = ctx.group(dt, { pos: [0, 0, 4.6], explode: [0, 0.6, 4.5] });
      const hc = ctx.group(rotor, { node: 'hb_casting', shell: true });
      const sg = new T.SphereGeometry(1.4, 40, 28); sg.scale(1, 1, 0.92);
      ctx.mesh(hc, sg, C.cast, { edges: false });
      ctx.cyl(hc, 0.85, 0.85, 0.3, C.cast, [0, 0, -1.22], { rot: AX, seg: 40 });
      ctx.ring(hc, 0.45, 0.62, 0.1, C.cast, [0, 0, 1.24], { rot: AX });
      const sp = ctx.group(rotor, { node: 'hb_spinner', shell: true, explode: [0, 0, 3.2] });
      {
        const pts = [[0.05, 2.7], [0.55, 2.55], [1.1, 2.15], [1.6, 1.5], [1.95, 0.7], [2.12, -0.1], [2.15, -0.9], [2.05, -1.55]].map(([r, z]) => new T.Vector2(r, z));
        const g = new T.LatheGeometry(pts, 56); g.rotateX(PI / 2);
        ctx.mesh(sp, g, 0xe9ebea, { side: T.DoubleSide, rough: 0.55, edgeAngle: 40 });
      }
      // blade section: chord/thickness/twist/prebend along span r (0–62 m), circle→airfoil blend
      const BL = 62, R0 = 1.15, Y0 = 1.62;
      const sec = (r) => {
        const s = smooth((r - 1.5) / 11.5);
        const c = r < 13 ? 2.3 + 1.6 * smooth(r / 13) : 3.9 - 3.48 * Math.pow((r - 13) / 49, 0.85);
        const tr = r < 13 ? 1 - 0.62 * s : 0.38 - 0.2 * ((r - 13) / 49);
        const tw = ((r < 13 ? 13 : 13 * (1 - (r - 13) / 49)) * PI) / 180;
        return { s, c, tr, tw, pb: 3.2 * Math.pow(r / BL, 2.2) };
      };
      const yt = (x, tr) => 5 * tr * (0.2969 * Math.sqrt(Math.max(x, 0)) - 0.126 * x - 0.3516 * x * x + 0.2843 * x ** 3 - 0.1036 * x ** 4);
      const cam = (x) => 0.025 * (x < 0.4 ? (0.8 * x - x * x) / 0.16 : (0.2 + 0.8 * x - x * x) / 0.36);
      const pt2 = (r, phi, k = 1) => {
        const S = sec(r), xn = 0.5 * (1 + Math.cos(phi)), up = Math.sin(phi) >= 0;
        const t = yt(xn, S.tr) * S.c, cm = cam(xn) * S.c * S.s;
        const ax = -(xn - 0.3) * S.c, az = -(cm + (up ? t : -t));
        const cx = -R0 * Math.cos(phi), cz = -R0 * Math.sin(phi);
        const x = (cx + (ax - cx) * S.s) * k, z = (cz + (az - cz) * S.s) * k;
        const ct = Math.cos(-S.tw), st = Math.sin(-S.tw);
        return new T.Vector3(x * ct + z * st, Y0 + r, -x * st + z * ct + S.pb);
      };
      const patch = (r0, r1, nr, phis, k, tipClose) => {
        const pos = [], idx = [], w = phis.length;
        for (let j = 0; j <= nr; j++) {
          const r = r0 + ((r1 - r0) * j) / nr, kk = tipClose && j === nr ? 0.08 : k;
          phis.forEach((ph) => { const p = pt2(r, ph, kk); pos.push(p.x, p.y, p.z); });
        }
        for (let j = 0; j < nr; j++) for (let i = 0; i < w - 1; i++) { const a = j * w + i, b = a + w; idx.push(a, b, a + 1, b, b + 1, a + 1); }
        const g = new T.BufferGeometry(); g.setAttribute('position', new T.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals(); return g;
      };
      const ring = []; for (let i = 0; i <= 56; i++) ring.push((i / 56) * PI * 2);
      const rootG = patch(0, 4, 6, ring, 1), shellG = patch(4, BL, 44, ring, 1, true);
      const lepPh = []; for (let i = -4; i <= 4; i++) lepPh.push(PI + i * 0.09);
      const lepG = patch(36, 61.6, 18, lepPh, 1.006);
      const sparW = (r) => 0.7 - 0.45 * (r / BL);
      const stations = []; for (let r = 3; r <= 60; r += 1.5) stations.push(r);
      const phiAt = (r, off, upper) => { const S = sec(r), xn = Math.min(0.98, Math.max(0.02, 0.3 + off / S.c)); const p = Math.acos(2 * xn - 1); return upper ? p : PI * 2 - p; };
      const pitchGroups = [];
      [90, 210, 330].forEach((deg) => {
        const th = (deg * PI) / 180, c = Math.cos(th), s = Math.sin(th);
        const seat = ctx.group(rotor, { node: 'hb_casting', shell: true, rot: [0, 0, th - PI / 2] });
        ctx.ring(seat, 1.0, 1.25, 0.3, C.cast, [0, 1.2, 0]);
        const bg = ctx.group(rotor, { rot: [0, 0, th - PI / 2], explode: [c * 2.4, s * 2.4, 0] });
        const cone = ctx.group(bg, { rot: [ctx.deg(3), 0, 0] });
        ctx.ring(ctx.group(cone, { node: 'pt_bearing' }), 1.0, 1.3, 0.26, C.brg, [0, 1.48, 0], { metal: 0.35, rough: 0.4 });
        const pg = ctx.group(cone, {}); pitchGroups.push(pg);
        ctx.instanced(ctx.group(pg, { node: 'pt_bearing' }), new T.BoxGeometry(0.06, 0.2, 0.04), C.teeth, ctx.polar(80, 0.97, 1.48, (a, x, y, z) => M(x, y, z, [0, -a, 0])));
        const bl = ctx.group(pg, { explode: [0, 1.6, 0] });
        ctx.mesh(ctx.group(bl, { node: 'bl_root' }), rootG, C.blade, { side: T.DoubleSide, rough: 0.5 });
        ctx.mesh(ctx.group(bl, { node: 'bl_shell', shell: true }), shellG, C.blade, { side: T.DoubleSide, rough: 0.5, edgeAngle: 35 });
        ctx.mesh(ctx.group(bl, { node: 'bl_lep' }), lepG, 0xd4d8db, { side: T.DoubleSide, rough: 0.35, edges: false });
        const spar = ctx.group(bl, { node: 'bl_spar' }), web = ctx.group(bl, { node: 'bl_web' });
        [true, false].forEach((upper) => ctx.ribbon(spar, stations.map((r) => pt2(r, phiAt(r, -sparW(r) / 2, upper), 0.95)), stations.map((r) => pt2(r, phiAt(r, sparW(r) / 2, upper), 0.95)), 0x6b737a, { edgeOpacity: 0.25 }));
        const webSt = stations.filter((r) => r >= 4 && r <= 57);
        [-0.4, 0.4].forEach((f) => ctx.ribbon(web, webSt.map((r) => pt2(r, phiAt(r, f * sparW(r), true), 0.94)), webSt.map((r) => pt2(r, phiAt(r, f * sparW(r), false), 0.94)), 0xd8d2c0, { edgeOpacity: 0.2 }));
        const dc = webSt.map((r) => pt2(r, phiAt(r, -0.4 * sparW(r), true), 0.6).lerp(pt2(r, phiAt(r, -0.4 * sparW(r), false), 0.6), 0.5));
        ctx.tube(ctx.group(bl, { node: 'lp_conductor' }), [...dc, pt2(61.2, PI, 0.5)], 0.03, C.cu, { metal: 0.5, segs: 90 });
        ctx.ring(ctx.group(bl, { node: 'lp_band' }), 1.15, 1.19, 0.1, C.cu, [0, Y0 + 0.8, 0], { metal: 0.5, rough: 0.4 });
        const rc = ctx.group(bl, { node: 'lp_receptor' });
        [55, 58.5, 61].forEach((r) => [PI * 0.62, PI * 1.38].forEach((ph) => ctx.cyl(rc, 0.05, 0.05, 0.035, 0x8e959b, pt2(r, ph, 1.0).toArray(), { rot: AX, metal: 0.5, seg: 14 })));
        const bo = ctx.group(pg, { node: 'bl_bolts', explode: [0, 0.9, 0] });
        ctx.instanced(bo, new T.CylinderGeometry(0.018, 0.018, 0.62, 8), 0x7d858c, ctx.polar(64, 1.08, 1.5, (a, x, y, z) => M(x, y, z)));
        ctx.instanced(bo, new T.CylinderGeometry(0.034, 0.034, 0.06, 6), 0x5c646b, ctx.polar(64, 1.08, 1.21, (a, x, y, z) => M(x, y, z)));
        const pd = ctx.group(cone, { node: 'pt_drive', explode: [0.35, -0.5, 0] });
        ctx.cyl(pd, 0.1, 0.1, 0.16, C.teeth, [0.84, 1.48, 0], { seg: 12, flat: true });
        ctx.cyl(pd, 0.12, 0.12, 0.54, C.gear, [0.84, 1.13, 0], { seg: 24 });
        ctx.cyl(pd, 0.17, 0.17, 0.04, C.gear, [0.84, 0.86, 0], { seg: 24 });
        ctx.cyl(pd, 0.15, 0.15, 0.48, C.motor, [0.84, 0.6, 0], { seg: 24 });
        ctx.cyl(pd, 0.1, 0.1, 0.1, C.dark, [0.84, 0.31, 0], { seg: 16 });
        ctx.box(ctx.group(cone, { node: 'pt_cabinet', explode: [-0.5, -0.4, 0.5] }), 0.42, 0.55, 0.26, C.cab, [-0.55, 0.55, 0.55]);
        ctx.box(ctx.group(cone, { node: 'pt_backup', explode: [-0.5, -0.4, -0.5] }), 0.36, 0.45, 0.24, 0x8e979e, [-0.55, 0.55, -0.42]);
        const lt = ctx.group(cone, { node: 'lp_transfer' });
        ctx.rod(lt, [0, 1.62, 1.3], [0, 2.42, 1.3], 0.025, C.frame, { seg: 8 });
        ctx.box(lt, 0.1, 0.12, 0.14, C.cu, [0, 2.42, 1.24], { metal: 0.4 });
      });

      ctx.onUpdate((v) => { pitchGroups.forEach((g) => { g.rotation.y = -ctx.deg(v.pitch); }); });
      ctx.onFrame((dt, v) => { if (v.rpm > 0) rotor.rotation.z -= (v.rpm * 2 * PI / 60) * dt; });
    },
  };
})();
