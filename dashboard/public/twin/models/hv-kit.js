/* HVKit — reusable balance-of-plant and grid geometry for the plant and grid levels: collector substation, POI switchyard,
   gen-tie H-frames, lattice transmission lines, simplified turbines and tracker blocks. Node ids are prefixed per plant. Metres. */
window.HVKit = (function () {
  const PI = Math.PI;
  const C = { steel: 0xa9b0b6, galv: 0xb7bdc3, conc: 0xc9c5bc, tank: 0x8f999f, porc: 0x8e5a3c, cab: 0xe4e6e3, dark: 0x3d4349, wire: 0x4f565c, tower: 0xe8eae9, blade: 0xf0f1ef };
  const cache = new WeakMap();
  const get = (T, k, mk) => { let c = cache.get(T); if (!c) cache.set(T, (c = {})); return c[k] || (c[k] = mk()); };
  function gravel(ctx, rx, rz) {
    const t = ctx.texture(256, 256, (c, w, h) => { c.fillStyle = '#b8b1a2'; c.fillRect(0, 0, w, h); for (let i = 0; i < 5000; i++) { c.fillStyle = ['#a59e8f', '#c9c2b3', '#9a9385', '#d3cdbf', '#8e887c'][i % 5]; c.fillRect(Math.random() * w, Math.random() * h, 2, 2); } });
    t.wrapS = t.wrapT = ctx.T.RepeatWrapping; t.repeat.set(rx, rz); return t;
  }
  function fence(ctx, parent, x0, x1, z0, z1) {
    const T = ctx.T, posts = [];
    for (let x = x0; x <= x1 + 0.01; x += 4) posts.push(ctx.mat4([x, 1.2, z0]), ctx.mat4([x, 1.2, z1]));
    for (let z = z0 + 4; z < z1; z += 4) posts.push(ctx.mat4([x0, 1.2, z]), ctx.mat4([x1, 1.2, z]));
    ctx.instanced(parent, new T.CylinderGeometry(0.04, 0.04, 2.4, 6), C.galv, posts, { metal: 0.3 });
    const link = (len) => { const t = ctx.texture(64, 64, (c, w, h) => { c.strokeStyle = 'rgba(150,156,160,1)'; c.lineWidth = 3; c.beginPath(); c.moveTo(0, 0); c.lineTo(w, h); c.moveTo(w, 0); c.lineTo(0, h); c.stroke(); }); t.wrapS = t.wrapT = T.RepeatWrapping; t.repeat.set(len / 0.15, 2.2 / 0.15); return t; };
    [[x1 - x0, [(x0 + x1) / 2, 1.1, z0], 0], [x1 - x0, [(x0 + x1) / 2, 1.1, z1], 0], [z1 - z0, [x0, 1.1, (z0 + z1) / 2], PI / 2], [z1 - z0, [x1, 1.1, (z0 + z1) / 2], PI / 2]].forEach(([len, pos, ry]) =>
      ctx.mesh(parent, new T.PlaneGeometry(len, 2.2), 0xffffff, { pos, rot: [0, ry, 0], map: link(len), side: T.DoubleSide, alphaTest: 0.3, edges: false, shadow: false }));
  }
  function insulator(ctx, parent, x, y, z, h, r, color) {
    const T = ctx.T;
    ctx.cyl(parent, r * 0.45, r * 0.5, h, color || C.porc, [x, y + h / 2, z], { seg: 12, edges: false });
    const n = Math.max(3, Math.round(h / 0.28)), m = [];
    for (let i = 0; i < n; i++) m.push(ctx.mat4([x, y + 0.15 + (i * (h - 0.3)) / (n - 1), z]));
    ctx.instanced(parent, get(T, 'shed' + r, () => new T.CylinderGeometry(r, r, 0.05, 14)), color || C.porc, m);
  }
  function deadTank(ctx, parent, x, y, z, along) {
    const rot = along === 'x' ? [0, 0, PI / 2] : [PI / 2, 0, 0];
    ctx.cyl(parent, 0.5, 0.5, 3.0, 0x9aa3a9, [x, y, z], { rot, seg: 20, metal: 0.25 });
    [-1, 1].forEach((s) => { const dx = along === 'x' ? s * 1.1 : 0, dz = along === 'x' ? 0 : s * 1.1; insulator(ctx, parent, x + dx, y + 0.4, z + dz, 2.6, 0.24); });
    ctx.box(parent, along === 'x' ? 3.0 : 1.0, y - 0.5, along === 'x' ? 1.0 : 3.0, C.galv, [x, (y - 0.5) / 2, z], { edgeOpacity: 0.2 });
  }
  function house(ctx, parent, x, z, w, d) {
    ctx.box(parent, w, 3.6, d, 0xd9d6cf, [x, 1.8, z]);
    ctx.box(parent, w + 0.4, 0.25, d + 0.4, 0x8d949a, [x, 3.72, z]);
    ctx.box(parent, 1.0, 2.1, 0.05, 0x6f777e, [x - w / 4, 1.05, z + d / 2 + 0.03]);
  }
  function yard(ctx, parent, x, z, w, d) {
    ctx.box(parent, w, 0.12, d, 0xffffff, [x, 0.06, z], { map: gravel(ctx, w / 6, d / 6), rough: 1, edgeOpacity: 0.12 });
    fence(ctx, parent, x - w / 2, x + w / 2, z - d / 2, z + d / 2);
  }
  // ---------------- collector substation (34.5 → 345 kV) ----------------
  function collectorSub(ctx, p, x, z) {
    const T = ctx.T, g = (n, ex) => ctx.group(null, { node: p + n, explode: ex });
    yard(ctx, g('sub_yard'), x, z, 66, 42);
    const gg = g('sub_grid'); for (let i = -3; i <= 3; i++) { ctx.rod(gg, [x - 31, -0.5, z + i * 6], [x + 31, -0.5, z + i * 6], 0.03, 0xb67a4c, { seg: 4, edges: false }); }
    for (let i = -5; i <= 5; i++) ctx.rod(gg, [x + i * 6, -0.5, z - 19], [x + i * 6, -0.5, z + 19], 0.03, 0xb67a4c, { seg: 4, edges: false });
    house(ctx, g('sub_house', [0, 3, 0]), x - 24, z - 13, 10, 6);
    const mv = g('sub_mvbus', [0, 3, 0]);
    ctx.box(mv, 14, 3, 3, C.cab, [x - 20, 1.6, z + 7]);
    for (let i = 0; i < 6; i++) ctx.box(mv, 2.1, 2.6, 0.04, 0xd0d3d1, [x - 26.2 + i * 2.35, 1.6, z + 8.53]);
    const mpt = g('sub_mpt', [0, 6, 0]);
    ctx.box(mpt, 12, 0.5, 9, C.conc, [x - 2, 0.25, z], { rough: 0.9 });
    ctx.box(mpt, 7, 4.5, 4.2, C.tank, [x - 2, 2.75, z], { metal: 0.15 });
    const fins = []; for (let fx = -3; fx <= 3.01; fx += 0.4) fins.push(ctx.mat4([x - 2 + fx, 2.7, z - 2.65]), ctx.mat4([x - 2 + fx, 2.7, z + 2.65]));
    ctx.instanced(mpt, new T.BoxGeometry(0.05, 3.4, 1.1), 0x98a1a7, fins, { edges: true, edgeOpacity: 0.15 });
    ctx.cyl(mpt, 0.6, 0.6, 4.5, 0x98a1a7, [x - 2, 6.0, z - 1.4], { rot: [0, 0, PI / 2], seg: 20 });
    [-1.3, 0, 1.3].forEach((dz) => { insulator(ctx, mpt, x + 0.6, 5.0, z + dz, 3.4, 0.4); insulator(ctx, mpt, x - 4.4, 5.0, z + dz, 1.1, 0.2); });
    const bkr = g('sub_bkr', [0, 5, 0]); [-2.5, 0, 2.5].forEach((dz) => deadTank(ctx, bkr, x + 12, 2.8, z + dz, 'x'));
    const ds = g('sub_disc', [0, 5, 0]);
    [6.5, 17.5].forEach((dx) => [-2.5, 0, 2.5].forEach((dz) => { ctx.box(ds, 0.3, 4.2, 0.3, C.galv, [x + dx, 2.1, z + dz]); insulator(ctx, ds, x + dx, 4.2, z + dz, 1.8, 0.22); ctx.box(ds, 2.4, 0.08, 0.08, 0xc9cdd0, [x + dx, 6.1, z + dz], { metal: 0.5 }); }));
    const mt = g('sub_meter', [0, 4, 0]);
    [-2.5, 0, 2.5].forEach((dz) => { ctx.box(mt, 0.35, 3.2, 0.35, C.galv, [x + 22, 1.6, z + dz]); insulator(ctx, mt, x + 22, 3.2, z + dz, 2.0, 0.34, 0x8e5a3c); });
    ctx.box(mt, 1.0, 1.6, 0.6, C.cab, [x + 22, 0.92, z + 6]);
    const bus = g('sub_bus', [0, 8, 0]);
    [-2.5, 0, 2.5].forEach((dz) => { ctx.rod(bus, [x + 0.6, 8.4, z + dz * 0.52 + (dz ? 0 : 0)], [x + 6.5, 7.0, z + dz], 0.06, 0xc9cdd0, { seg: 8, edges: false, metal: 0.5 }); ctx.rod(bus, [x + 6.5, 7.0, z + dz], [x + 28, 7.0, z + dz], 0.09, 0xc9cdd0, { seg: 10, edges: false, metal: 0.5 }); });
    [-5, 5].forEach((dz) => ctx.box(bus, 0.7, 16, 0.7, C.steel, [x + 28, 8, z + dz], { metal: 0.25 }));
    ctx.box(bus, 0.7, 0.9, 11, C.steel, [x + 28, 15.6, z], { metal: 0.25 });
    [-2.5, 0, 2.5].forEach((dz) => insulator(ctx, bus, x + 28, 12.4, z + dz, 2.8, 0.18));
    const lm = g('sub_lm'); [[-31, -19], [31, 19], [-31, 19], [31, -19]].forEach(([dx, dz]) => ctx.cyl(lm, 0.12, 0.35, 24, C.steel, [x + dx, 12, z + dz], { seg: 10 }));
    const lab = ctx.label('Collector substation', [x, 26, z], { sub: '34.5 → 345 kV' });
    return { gantry: [-2.5, 0, 2.5].map((dz) => [x + 28, 12.2, z + dz]), mvIn: [x - 27, 1.5, z + 7], meter: [x + 22, 6, z], label: lab };
  }
  // ---------------- POI switchyard (transmission owner) ----------------
  function switchyard(ctx, p, x, z) {
    const g = (n, ex) => ctx.group(null, { node: p + n, explode: ex });
    yard(ctx, g('poi_yard'), x, z, 56, 44);
    house(ctx, g('poi_ctrl', [0, 3, 0]), x - 18, z - 15, 9, 5);
    const bk = g('poi_bkr', [0, 5, 0]);
    [[-10, -8], [10, -8], [-10, 8], [10, 8]].forEach(([dx, dz]) => deadTank(ctx, bk, x + dx, 2.8, z + dz, dx === -10 || dx === 10 ? 'z' : 'x'));
    const bus = g('poi_bus', [0, 8, 0]), Y = 7.2, sq = [[-12, -10], [12, -10], [12, 10], [-12, 10], [-12, -10]];
    for (let i = 0; i < 4; i++) ctx.rod(bus, [x + sq[i][0], Y, z + sq[i][1]], [x + sq[i + 1][0], Y, z + sq[i + 1][1]], 0.1, 0xc9cdd0, { seg: 10, edges: false, metal: 0.5 });
    sq.slice(0, 4).forEach(([dx, dz]) => { ctx.box(bus, 0.4, Y - 1.6, 0.4, C.galv, [x + dx, (Y - 1.6) / 2, z + dz]); insulator(ctx, bus, x + dx, Y - 1.6, z + dz, 1.5, 0.2); });
    const gants = [[-24, 0], [24, -8], [24, 8]];
    gants.forEach(([dx, dz]) => { [-4, 4].forEach((o) => ctx.box(bus, 0.6, 15, 0.6, C.steel, [x + dx, 7.5, z + dz + o], { metal: 0.25 })); ctx.box(bus, 0.6, 0.8, 9, C.steel, [x + dx, 14.8, z + dz], { metal: 0.25 }); ctx.rod(bus, [x + dx, 12, z + dz], [x + dx * 0.5, Y, z + dz * 0.8], 0.06, 0xc9cdd0, { seg: 6, edges: false }); });
    const lab = ctx.label('POI switchyard', [x, 24, z], { sub: 'Transmission owner' });
    return { in: [-2, 0, 2].map((d) => [x - 24, 12.4, z + d]), out: [[x + 24, 12.4, z - 8], [x + 24, 12.4, z + 8]], label: lab, top: [x, 30, z] };
  }
  // ---------------- gen-tie on H-frames ----------------
  function hframe(ctx, parent, x, z, ang) {
    const c = Math.cos(ang), s = Math.sin(ang), at = (u, y) => [x - s * u, y, z + c * u];
    [-4.5, 4.5].forEach((u) => ctx.cyl(parent, 0.32, 0.45, 24, 0x8d8576, at(u, 12), { seg: 10 }));
    const arm = ctx.box(parent, 0.5, 0.6, 14, 0x7d858c, at(0, 22.4)); arm.rotation.y = -ang;
    [-5, 0, 5].forEach((u) => ctx.cyl(parent, 0.12, 0.12, 2.2, C.porc, at(u, 21), { seg: 8, edges: false }));
    return [-5, 0, 5].map((u) => at(u, 19.8));
  }
  function sagPts(a, b, dip, n) { const out = []; for (let i = 0; i <= n; i++) { const t = i / n; out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t - dip * 4 * t * (1 - t), a[2] + (b[2] - a[2]) * t]); } return out; }
  function genTie(ctx, p, A, B, spans) {
    const st = ctx.group(null, { node: p + 'gt_struct' }), cd = ctx.group(null, { node: p + 'gt_cond' });
    const dx = B[0][0] - A[0][0], dz = B[0][2] - A[0][2], ang = Math.atan2(dz, dx);
    const pts = [A]; for (let i = 1; i < spans; i++) { const t = i / spans; pts.push(hframe(ctx, st, A[1][0] + dx * t, A[1][2] + dz * t, ang)); } pts.push(B);
    const paths = [[], [], []];
    for (let k = 0; k < pts.length - 1; k++) for (let ph = 0; ph < 3; ph++) { const seg = sagPts(pts[k][ph], pts[k + 1][ph], 2.5, 10); paths[ph].push(...(k ? seg.slice(1) : seg)); }
    paths.forEach((pp) => ctx.tube(cd, pp, 0.06, C.wire, { segs: pp.length * 2 }));
    return paths[1];
  }
  // ---------------- lattice transmission line ----------------
  function latticeGeo(T) {
    return get(T, 'lattice', () => {
      const parts = [], rod = (a, b, r) => { const A = new T.Vector3(...a), B = new T.Vector3(...b), g = new T.CylinderGeometry(r, r, A.distanceTo(B), 5, 1, true); const m = new T.Matrix4().compose(A.clone().add(B).multiplyScalar(0.5), new T.Quaternion().setFromUnitVectors(new T.Vector3(0, 1, 0), B.clone().sub(A).normalize()), new T.Vector3(1, 1, 1)); g.applyMatrix4(m); parts.push(g); };
      const w = (y) => 4.2 - (3.0 * y) / 36, L = [0, 7, 14, 21, 28, 33, 38];
      for (const [sx, sz] of [[1, 1], [1, -1], [-1, 1], [-1, -1]]) for (let i = 0; i < L.length - 1; i++) rod([sx * w(L[i]), L[i], sz * w(L[i])], [sx * w(L[i + 1]), L[i + 1], sz * w(L[i + 1])], 0.14);
      for (let i = 0; i < L.length - 1; i++) { const a = w(L[i]), b = w(L[i + 1]); [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([fx, fz]) => { if (fx) { rod([fx * a, L[i], -a], [fx * b, L[i + 1], b], 0.07); rod([fx * a, L[i], a], [fx * b, L[i + 1], -b], 0.07); } else { rod([-a, L[i], fz * a], [b, L[i + 1], fz * b], 0.07); rod([a, L[i], fz * a], [-b, L[i + 1], fz * b], 0.07); } }); }
      [[28, 9], [33, 7]].forEach(([y, s]) => { rod([0, y, -s], [0, y, s], 0.12); rod([0, y + 1.6, -1.6], [0, y, -s], 0.08); rod([0, y + 1.6, 1.6], [0, y, s], 0.08); });
      rod([0, 38, 0], [0, 41, 0], 0.1);
      const pos = [], nrm = []; parts.forEach((g) => { const n = g.toNonIndexed(); pos.push(...n.attributes.position.array); nrm.push(...n.attributes.normal.array); g.dispose(); n.dispose(); });
      const out = new T.BufferGeometry(); out.setAttribute('position', new T.Float32BufferAttribute(pos, 3)); out.setAttribute('normal', new T.Float32BufferAttribute(nrm, 3)); return out;
    });
  }
  function txLine(ctx, node, A, B, o = {}) {
    const T = ctx.T, g = ctx.group(null, { node }), dx = B[0] - A[0], dz = B[1] - A[1], len = Math.hypot(dx, dz), ang = Math.atan2(dz, dx);
    const n = Math.max(1, Math.round(len / (o.span || 420))), tw = [];
    for (let i = 0; i <= n; i++) { const t = i / n; tw.push([A[0] + dx * t, A[1] + dz * t]); }
    const inner = tw.slice(o.skipStart ? 1 : 0, o.skipEnd ? -1 : undefined);
    ctx.instanced(g, latticeGeo(T), 0xaab1b7, inner.map(([x, z]) => ctx.mat4([x, 0, z], [0, -ang + PI / 2, 0])), { metal: 0.3, rough: 0.5, shadow: true });
    const c = Math.cos(ang), s = Math.sin(ang), arm = (x, z, u, y) => [x - s * u, y, z + c * u];
    const phases = [[-8.5, 27.4], [8.5, 27.4], [0, 32.4]], lineMat = new T.LineBasicMaterial({ color: 0x59606a, transparent: true, opacity: 0.85 });
    let mid = [];
    phases.forEach(([u, y], k) => {
      const pts = [];
      for (let i = 0; i < tw.length - 1; i++) { const seg = sagPts(arm(tw[i][0], tw[i][1], u, y), arm(tw[i + 1][0], tw[i + 1][1], u, y), Math.min(14, len / n / 40), 12); pts.push(...(i ? seg.slice(1) : seg)); }
      const geo = new T.BufferGeometry().setFromPoints(pts.map((q) => new T.Vector3(...q)));
      const line = new T.Line(geo, lineMat); line.userData.fx = true; line.raycast = () => {}; ctx.root.add(line);
      if (k === 2) mid = pts;
    });
    return mid;
  }
  // ---------------- simplified turbine ----------------
  function bladeGeo(T) {
    return get(T, 'blade', () => {
      const g = new T.BoxGeometry(1, 62, 0.28, 1, 12, 1), p = g.attributes.position;
      for (let i = 0; i < p.count; i++) { const y = p.getY(i) + 31, t = y / 62, w = t < 0.2 ? 2.3 + (3.9 - 2.3) * (t / 0.2) : 3.9 - 3.4 * ((t - 0.2) / 0.8); p.setX(i, p.getX(i) * w); p.setZ(i, p.getZ(i) * (t < 0.1 ? 8 : 1.6 - t)); p.setY(i, y + 1.4); }
      g.computeVertexNormals(); return g;
    });
  }
  function turbine(ctx, x, z, rotors, o) {
    const T = ctx.T, g = ctx.group(null, { node: o.node, pos: [x, 0, z], rot: [0, o.yaw || 0, 0] });
    ctx.mesh(g, get(T, 'twr', () => new T.CylinderGeometry(1.55, 2.15, 86.6, 20)), C.tower, { pos: [0, 43.3, 0], rough: 0.55 });
    ctx.mesh(g, get(T, 'nac', () => new T.BoxGeometry(4, 4, 11)), 0xeceeed, { pos: [0, 88.6, -2.2] });
    const rot = ctx.group(g, { pos: [0, 89.2, 4.2] });
    ctx.mesh(rot, get(T, 'hub', () => new T.SphereGeometry(1.7, 16, 12)), 0xe9ebea, { edges: false });
    for (let k = 0; k < 3; k++) ctx.mesh(rot, bladeGeo(T), C.blade, { rot: [0.05, 0, (k * 2 * PI) / 3], rough: 0.5, edgeAngle: 40 });
    rot.rotation.z = Math.random() * PI;
    rotors.push(rot);
    if (o.pad) ctx.box(ctx.group(null, { node: o.pad }), 2.2, 1.8, 1.9, 0x6e8270, [x - 8, 0.9, z + 5]);
    ctx.mesh(ctx.group(null, { node: o.found || o.node }), get(T, 'ped', () => new T.CylinderGeometry(3.3, 3.3, 0.4, 24)), C.conc, { pos: [x, 0.2, z], rough: 0.9 });
    return [x - 8, 1.0, z + 5];
  }
  // ---------------- tracker block (instanced rows; tilt follows the sun) ----------------
  function solarBlock(ctx, x, z, rows, len, pitch, tex, o) {
    const T = ctx.T, g = ctx.group(null, { node: o.node }), N = [];
    for (let r = 0; r < rows; r++) N.push([x, z - ((rows - 1) * pitch) / 2 + r * pitch]);
    const geo = get(T, 'row' + len, () => new T.BoxGeometry(len, 0.05, 2.38));
    const panels = ctx.instanced(g, geo, 0xffffff, N.map(([px, pz]) => ctx.mat4([px, 1.6, pz])), { map: tex, rough: 0.35, metal: 0.1 });
    ctx.instanced(g, get(T, 'tube' + len, () => new T.BoxGeometry(len, 0.13, 0.13)), 0xb7bdc3, N.map(([px, pz]) => ctx.mat4([px, 1.5, pz])));
    const piles = []; N.forEach(([px, pz]) => { for (let k = -3; k <= 3; k++) piles.push(ctx.mat4([px + (k * len) / 7, 0.7, pz])); });
    ctx.instanced(g, get(T, 'pile', () => new T.BoxGeometry(0.12, 1.4, 0.15)), 0x9ba2a9, piles);
    const m = new T.Matrix4();
    return (deg) => { N.forEach(([px, pz], i) => { m.compose(new T.Vector3(px, 1.6, pz), new T.Quaternion().setFromEuler(new T.Euler((deg * PI) / 180, 0, 0)), new T.Vector3(1, 1, 1)); panels.setMatrixAt(i, m); }); panels.instanceMatrix.needsUpdate = true; };
  }
  function cellTex(ctx, len) {
    const t = ctx.texture(128, 256, (c, w, h) => { c.fillStyle = '#cfd6dd'; c.fillRect(0, 0, w, h); for (let col = 0; col < 2; col++) for (let row = 0; row < 8; row++) { c.fillStyle = '#22314a'; c.fillRect(4 + col * 62, 4 + row * 31.5, 58, 28); } });
    t.wrapS = t.wrapT = ctx.T.RepeatWrapping; t.repeat.set(1, len / 2.3); t.rotation = PI / 2; t.center.set(0.5, 0.5); return t;
  }
  function flowColor(load) { return load > 0.98 ? 0xe0604f : load > 0.8 ? 0xf0b43c : 0x3cc97a; }
  return { collectorSub, switchyard, genTie, txLine, turbine, solarBlock, cellTex, gravel, fence, house, flowColor, sagPts };
})();
