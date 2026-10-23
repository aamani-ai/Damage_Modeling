/* Asset level: one 5 MW / 20 MWh BESS block — four liquid-cooled LFP enclosures with rack frames, modules (terminals, busbars,
   handles), coolant risers and headers, rack BMS, DC cabling and fire safety; a PCS skid with power stacks, capacitors and filter
   inductors, an MV transformer with core and windings, and an RMU with vacuum interrupters. Metres. */
(function () {
  const R = window.SubsystemModels = window.SubsystemModels || {};
  R['bess-block'] = {
    env: 'scrub', caps: { subsurface: true, internals: true },
    connections: { power: ['bc_dc', 'bc_mv', 'be_dccab'], ground: ['bg_grid'], comms: ['bk_fiber'] },
    camera: { theta: 0.72, phi: 1.12, r: 42, target: [0, 1.4, -2] },
    thumbView: { theta: 0.7, phi: 1.05 },
    build(ctx) {
      const K = window.HVKit, T = ctx.T, M = (x, y, z) => ctx.mat4([x, y, z]), G = (node, o) => ctx.group(null, { node, ...(o || {}) });
      const I = (g, geo, col, list, o) => list.length && ctx.instanced(g, geo, col, list, { edges: false, ...(o || {}) });
      const Y0 = 0.3, Z = 2.0, X = [-10.2, -3.4, 3.4, 10.2], FL = Y0 + 0.14;
      const C = { enc: 0xe6e8e6, frame: 0x8e959a, mod: 0x3b4855, plate: 0x5d6b76, rack: 0x9aa1a8, bms: 0x2f3438, cab: 0xe4e6e3, conc: 0xc9c5bc, dark: 0x3d4349, cu: 0xc27a42, sup: 0x2f6fb8, ret: 0x7fb6dc, red: 0xc0453a, hv: 0xe07b2a, alu: 0xb9bfc5 };
      const tex = (draw, w, h) => ctx.texture(w || 128, h || 256, draw);
      const panel = (c, w, h) => { c.fillStyle = '#e4e6e4'; c.fillRect(0, 0, w, h); c.strokeStyle = '#b5b9b7'; c.lineWidth = 3; c.strokeRect(5, 5, w - 10, h - 10); c.strokeStyle = '#cdd0ce'; c.lineWidth = 2; c.strokeRect(14, 18, w - 28, h - 36); c.fillStyle = '#8d9396'; c.fillRect(w - 24, h * 0.42, 7, 46); c.fillStyle = '#5b6266'; c.fillRect(w - 26, h * 0.42 + 18, 11, 9); };
      const slots = (c, w, h, top) => { c.fillStyle = '#b1b6b5'; for (let y = top; y < h - 22; y += 7) c.fillRect(24, y, w - 48, 3); };
      const doorTex = tex((c, w, h) => { panel(c, w, h); c.fillStyle = '#f2c230'; c.beginPath(); c.moveTo(w / 2, 34); c.lineTo(w / 2 + 14, 58); c.lineTo(w / 2 - 14, 58); c.closePath(); c.fill(); c.fillStyle = '#2b2b2b'; c.fillRect(w / 2 - 1.5, 41, 3, 9); c.fillRect(w / 2 - 1.5, 52, 3, 3); c.fillStyle = '#f6f6f4'; c.fillRect(30, 66, w - 60, 16); c.fillStyle = '#a3a8ab'; for (let i = 0; i < 3; i++) c.fillRect(34, 69 + i * 4, w - 68, 1.5); slots(c, w, h, h - 72); });
      const cabTex = tex((c, w, h) => { panel(c, w, h); c.fillStyle = '#26323b'; c.fillRect(30, 40, w - 64, 34); c.fillStyle = '#3cc97a'; c.fillRect(36, 84, 8, 8); c.fillStyle = '#f0b43c'; c.fillRect(50, 84, 8, 8); slots(c, w, h, h - 80); });
      const brkTex = tex((c, w, h) => { c.fillStyle = '#d9dbd8'; c.fillRect(0, 0, w, h); c.strokeStyle = '#a9adab'; c.lineWidth = 3; c.strokeRect(4, 4, w - 8, h - 8); for (let r = 0; r < 3; r++) for (let i = 0; i < 4; i++) { c.fillStyle = '#3a4045'; c.fillRect(14 + i * 26, 28 + r * 50, 20, 36); c.fillStyle = '#eceeeb'; c.fillRect(19 + i * 26, 38 + r * 50, 10, 9); } c.fillStyle = '#f2c230'; c.fillRect(w / 2 - 22, h - 92, 44, 52); c.fillStyle = '#c0392b'; c.fillRect(w / 2 - 6, h - 84, 12, 36); });
      const mimicTex = tex((c, w, h) => { c.fillStyle = '#dfe1de'; c.fillRect(0, 0, w, h); c.strokeStyle = '#b5b9b7'; c.lineWidth = 3; c.strokeRect(5, 5, w - 10, h - 10); c.strokeStyle = '#2a6fb0'; c.lineWidth = 4; c.beginPath(); c.moveTo(18, 50); c.lineTo(w - 18, 50); [34, 64, 94].forEach((x) => { c.moveTo(x, 50); c.lineTo(x, 150); }); c.stroke(); c.fillStyle = '#2fae64'; [34, 64, 94].forEach((x) => { c.beginPath(); c.arc(x, 100, 8, 0, 7); c.fill(); }); c.fillStyle = '#5b6266'; [34, 64, 94].forEach((x) => c.fillRect(x - 7, 190, 14, 22)); });
      const louver = tex((c, w, h) => { c.fillStyle = '#c9cdcb'; c.fillRect(0, 0, w, h); c.fillStyle = '#8e9593'; for (let y = 4; y < h; y += 9) c.fillRect(6, y, w - 12, 4); }, 128, 128);

      ctx.ground({ x0: -18, x1: 18, z0: -13, z1: 9, depth: 2.5 });
      const yd = G('bv_yard');
      ctx.box(yd, 36, 0.1, 22, 0xffffff, [0, 0.05, -2], { map: K.gravel(ctx, 6, 4), rough: 1, edgeOpacity: 0.12 });
      K.fence(ctx, yd, -17.5, 17.5, -12.5, 8.5);
      const fd = G('bs_found');
      X.forEach((x) => ctx.box(fd, 6.4, 0.3, 2.8, C.conc, [x, 0.15, Z], { rough: 0.9 }));

      // enclosures: shell + doors ghost with internals; frame keeps the outline
      const base = G('be_enc'), shell = G('be_enc', { shell: true, explode: [0, 4.5, 0] }), frame = G('be_enc', { explode: [0, 4.5, 0] });
      const fire = G('be_fire'), fireX = G('be_fire', { explode: [0, 4.5, 0] }), vent = G('be_vent', { explode: [0, 5.6, 0] });
      const hv = G('be_hvac', { explode: [-1.4, 0, 0] }), cool = G('be_hvac'), dcc = G('be_dccab', { explode: [1.2, 0, 0] }), dcw = G('be_dccab'), trays = G('be_racks');
      X.forEach((x) => {
        ctx.box(base, 6.06, 0.14, 2.44, 0x50565b, [x, Y0 + 0.07, Z], { metal: 0.3 });
        ctx.box(shell, 6.0, 2.74, 2.4, C.enc, [x, FL + 1.37, Z], { side: T.DoubleSide, rough: 0.6 });
        [-2.2, -0.75, 0.75, 2.2].forEach((dx) => [-1, 1].forEach((sd) => ctx.box(shell, 1.38, 2.5, 0.02, 0xffffff, [x + dx, FL + 1.33, Z + sd * 1.211], { map: doorTex, edges: false })));
        [[-3.0, -1.2], [-3.0, 1.2], [3.0, -1.2], [3.0, 1.2]].forEach(([dx, dz]) => ctx.box(frame, 0.1, 2.78, 0.1, C.frame, [x + dx, FL + 1.37, Z + dz], { metal: 0.3, edges: false }));
        [-1.2, 1.2].forEach((dz) => ctx.box(frame, 6.1, 0.1, 0.1, C.frame, [x, FL + 2.74, Z + dz], { metal: 0.3, edges: false }));
        [-3.0, 3.0].forEach((dx) => ctx.box(frame, 0.1, 0.1, 2.5, C.frame, [x + dx, FL + 2.74, Z], { metal: 0.3, edges: false }));
        ctx.box(fireX, 0.06, 0.5, 0.4, C.red, [x + 3.04, FL + 1.2, Z + 0.7]);
        ctx.cyl(fireX, 0.08, 0.08, 0.16, 0xf0b43c, [x + 2.6, FL + 2.82, Z + 0.9], { seg: 10, edges: false });
        ctx.rod(fire, [x - 2.8, 3.06, Z], [x + 2.3, 3.06, Z], 0.025, C.red, { seg: 8, edges: false });
        for (let i = 0; i < 5; i++) ctx.cyl(fire, 0.025, 0.035, 0.08, C.alu, [x - 2.4 + i * 1.1, 3.0, Z], { seg: 8, edges: false });
        [-1.5, 1.5].forEach((dx) => { ctx.box(fire, 0.14, 0.06, 0.14, 0xe9eae7, [x + dx, 3.12, Z + 0.35], { edges: false }); ctx.cyl(fire, 0.04, 0.04, 0.1, 0xb9bec2, [x + dx + 0.4, 3.12, Z - 0.35], { seg: 8, edges: false }); });
        [-1.5, 1.5].forEach((dx) => { ctx.box(vent, 1.2, 0.05, 1.0, 0xd5d8d6, [x + dx, 3.205, Z]); ctx.box(vent, 1.2, 0.04, 0.05, 0x7d858c, [x + dx, 3.25, Z - 0.5], { edges: false }); });
        ctx.box(hv, 0.6, 1.8, 1.9, 0xffffff, [x - 3.33, FL + 1.0, Z], { map: louver });
        [-0.48, 0.48].forEach((dz) => { ctx.cyl(hv, 0.36, 0.36, 0.04, 0x4f565c, [x - 3.645, FL + 1.25, Z + dz], { rot: [0, 0, Math.PI / 2], seg: 24 }); ctx.cyl(hv, 0.09, 0.09, 0.06, 0x2b3035, [x - 3.66, FL + 1.25, Z + dz], { rot: [0, 0, Math.PI / 2], seg: 12, edges: false }); });
        ctx.box(dcc, 0.6, 2.2, 1.6, 0xd9dbd8, [x + 2.68, FL + 1.1, Z]);
        ctx.box(dcc, 0.012, 2.0, 1.4, 0xffffff, [x + 2.986, FL + 1.1, Z], { map: brkTex, edges: false });
        [-1, 1].forEach((sd) => {
          const zc = Z + sd * 0.7, rz = zc - sd * 0.36;
          ctx.box(trays, 4.9, 0.03, 0.34, 0xa9afb4, [x - 0.2, 2.96, zc], { edges: false });
          [-0.06, 0.06].forEach((o) => ctx.polyRod(dcw, [[x - 2.5, 2.99, zc + o], [x + 2.2, 2.99, zc + o], [x + 2.5, 2.99, Z + sd * 0.4 + o], [x + 2.5, 2.64, Z + sd * 0.4 + o]], 0.022, C.hv));
          ctx.rod(cool, [x - 3.05, 0.52, rz], [x + 1.9, 0.52, rz], 0.028, C.sup, { seg: 10, edges: false });
          ctx.rod(cool, [x - 3.05, 2.62, rz], [x + 1.9, 2.62, rz], 0.028, C.ret, { seg: 10, edges: false });
        });
      });

      // racks and modules (instanced)
      const S = { a: { body: [], plate: [], tp: [], tn: [], hdl: [], lbl: [], bus: [] }, b: { body: [], plate: [], tp: [], tn: [], hdl: [], lbl: [], bus: [] } };
      const up = [], slab = [], bmu = [], led = [], scr = [], rs = [], rr = [], drop = [];
      X.forEach((x) => [-1, 1].forEach((sd) => {
        const zc = Z + sd * 0.7, fz = zc + sd * 0.335, rz = zc - sd * 0.36, P = S[sd < 0 ? 'a' : 'b'];
        for (let j = 0; j <= 9; j++) { const sx = x - 2.62 + j * 0.52; up.push(M(sx, 1.56, zc + sd * 0.33), M(sx, 1.56, zc - sd * 0.33)); }
        slab.push(M(x - 0.28, 0.47, zc), M(x - 0.28, 2.66, zc));
        for (let i = 0; i < 9; i++) {
          const cx = x - 2.36 + i * 0.52;
          bmu.push(M(cx, 2.76, zc + sd * 0.14)); led.push(M(cx - 0.08, 2.76, zc + sd * 0.293)); scr.push(M(cx + 0.09, 2.77, zc + sd * 0.293));
          rs.push(M(cx - 0.07, 1.57, rz)); rr.push(M(cx + 0.07, 1.57, rz)); drop.push(M(cx + 0.17, 2.8, fz + sd * 0.03));
          for (let k = 0; k < 8; k++) {
            const y = 0.62 + k * 0.27;
            P.body.push(M(cx, y, zc)); P.plate.push(M(cx, y, fz));
            P.tp.push(M(cx + 0.17, y + 0.055, fz + sd * 0.014)); P.tn.push(M(cx - 0.17, y + 0.055, fz + sd * 0.014));
            P.hdl.push(M(cx, y - 0.065, fz + sd * 0.016)); P.lbl.push(M(cx - 0.03, y + 0.03, fz + sd * 0.008));
            if (k < 7) P.bus.push(M(cx + (k % 2 ? 0.17 : -0.17), y + 0.19, fz + sd * 0.026));
          }
        }
      }));
      const rk = G('be_racks');
      I(rk, new T.BoxGeometry(0.035, 2.3, 0.035), C.rack, up, { metal: 0.3 });
      I(rk, new T.BoxGeometry(4.72, 0.05, 0.7), 0x7d858c, slab, { metal: 0.3 });
      [['a', [0, 0, -0.9]], ['b', [0, 0, 0.9]]].forEach(([k, ex]) => {
        const g = G('be_modules', { explode: ex }), P = S[k];
        I(g, new T.BoxGeometry(0.46, 0.22, 0.64), C.mod, P.body, { edges: true, edgeOpacity: 0.18 });
        I(g, new T.BoxGeometry(0.44, 0.2, 0.012), C.plate, P.plate);
        I(g, new T.BoxGeometry(0.035, 0.035, 0.02), 0xc0392b, P.tp);
        I(g, new T.BoxGeometry(0.035, 0.035, 0.02), 0x1f2326, P.tn);
        I(g, new T.BoxGeometry(0.16, 0.016, 0.016), 0xa7adb3, P.hdl, { metal: 0.4 });
        I(g, new T.BoxGeometry(0.13, 0.05, 0.004), 0xeceeea, P.lbl);
        I(g, new T.BoxGeometry(0.03, 0.29, 0.006), C.cu, P.bus, { metal: 0.6 });
      });
      const bm = G('be_bms', { explode: [0, 0.7, 0] });
      I(bm, new T.BoxGeometry(0.42, 0.12, 0.3), C.bms, bmu, { edges: true, edgeOpacity: 0.2 });
      I(bm, new T.BoxGeometry(0.16, 0.014, 0.006), 0x35d07f, led);
      I(bm, new T.BoxGeometry(0.08, 0.05, 0.006), 0x1c2a33, scr);
      I(cool, new T.CylinderGeometry(0.015, 0.015, 2.1, 8), C.sup, rs);
      I(cool, new T.CylinderGeometry(0.015, 0.015, 2.1, 8), C.ret, rr);
      I(dcw, new T.CylinderGeometry(0.012, 0.012, 0.36, 6), C.hv, drop);

      // PCS skid
      const SZ = -7, sk = G('bp_skid');
      ctx.instanced(sk, new T.CylinderGeometry(0.3, 0.3, 2.0, 18), C.conc, [-5, -1.5, 2, 5].flatMap((x) => [M(x, -0.25, SZ - 0.9), M(x, -0.25, SZ + 0.9)]), { edges: true });
      ctx.box(sk, 12.5, 0.3, 2.6, 0x7d858c, [0, 0.9, SZ], { metal: 0.2 });
      const pS = G('bp_pcs', { shell: true, explode: [0, 2.6, 0] }), pI = G('bp_pcs');
      ctx.box(pS, 4.2, 2.3, 1.5, C.cab, [-3.2, 2.2, SZ], { side: T.DoubleSide });
      [-4.55, -3.2, -1.85].forEach((x) => {
        ctx.box(pS, 1.2, 2.1, 0.02, 0xffffff, [x, 2.2, SZ + 0.761], { map: cabTex, edges: false });
        ctx.box(pS, 1.0, 1.0, 0.02, 0xffffff, [x, 2.4, SZ - 0.761], { map: louver, edges: false });
        ctx.cyl(pS, 0.3, 0.3, 0.12, 0x4f565c, [x, 3.41, SZ], { seg: 24 });
        ctx.cyl(pS, 0.08, 0.08, 0.14, 0x2b3035, [x, 3.42, SZ], { seg: 12, edges: false });
      });
      const fins = [], caps = [];
      [-4.6, -3.75, -2.9].forEach((x) => {
        ctx.box(pI, 0.7, 1.3, 0.9, 0x3b4249, [x, 2.15, SZ - 0.1]);
        for (let i = 0; i < 16; i++) fins.push(M(x - 0.3 + i * 0.04, 3.02, SZ - 0.1));
        for (let c = 0; c < 4; c++) [-0.15, 0.15].forEach((dz) => caps.push(M(x - 0.24 + c * 0.16, 1.24, SZ - 0.1 + dz)));
        ctx.box(pI, 0.6, 0.06, 0.06, C.cu, [x, 1.44, SZ + 0.38], { metal: 0.6, edges: false });
      });
      I(pI, new T.BoxGeometry(0.012, 0.4, 0.8), C.alu, fins, { metal: 0.5 });
      I(pI, new T.CylinderGeometry(0.055, 0.055, 0.24, 14), 0x8fa6bf, caps);
      [1.55, 2.2, 2.85].forEach((y) => { ctx.cyl(pI, 0.17, 0.17, 0.3, 0xb8743c, [-1.6, y, SZ - 0.1], { rot: [Math.PI / 2, 0, 0], seg: 22 }); ctx.box(pI, 0.1, 0.46, 0.5, 0x5d646b, [-1.6, y, SZ - 0.1], { edges: false }); });
      [-4.95, -4.85].forEach((x) => ctx.box(pI, 0.04, 1.8, 0.02, C.cu, [x, 2.0, SZ - 0.62], { metal: 0.6, edges: false }));
      ctx.box(pI, 0.4, 0.5, 0.04, 0x2f6a4c, [-2.25, 2.75, SZ + 0.55], { edges: false });
      ctx.box(pI, 1.3, 0.24, 0.34, 0x8a9198, [-0.45, 3.05, SZ], { metal: 0.3 });
      const mS = G('bp_mvt', { shell: true, explode: [0, 2.6, 0] }), mI = G('bp_mvt');
      ctx.box(mS, 2.0, 1.9, 1.4, 0x98a1a7, [1.2, 2.0, SZ], { metal: 0.15, side: T.DoubleSide });
      [-0.4, 0, 0.4].forEach((dz) => { ctx.cyl(mS, 0.05, 0.06, 0.45, 0x8e5a3c, [1.6, 3.18, SZ + dz], { seg: 10 }); ctx.cyl(mS, 0.035, 0.045, 0.3, 0x8e5a3c, [0.7, 3.1, SZ + dz], { seg: 10 }); });
      const rf = []; for (let z = -0.6; z <= 0.61; z += 0.1) rf.push(M(0.02, 2.0, SZ + z), M(2.38, 2.0, SZ + z));
      ctx.instanced(mI, new T.BoxGeometry(0.36, 1.5, 0.022), 0x9aa3a9, rf, { edges: true, edgeOpacity: 0.15 });
      [0.6, 1.2, 1.8].forEach((x) => { ctx.box(mI, 0.16, 1.3, 0.16, 0x6b7279, [x, 2.0, SZ], { edges: false }); ctx.cyl(mI, 0.2, 0.2, 1.08, 0xc98a4b, [x, 2.0, SZ], { seg: 28 }); ctx.cyl(mI, 0.27, 0.27, 0.86, 0xa5622d, [x, 2.0, SZ], { seg: 28 }); });
      [1.36, 2.64].forEach((y) => ctx.box(mI, 1.5, 0.16, 0.16, 0x6b7279, [1.2, y, SZ], { edges: false }));
      const rS = G('bp_rmu', { shell: true, explode: [0, 2.4, 0] }), rI = G('bp_rmu');
      ctx.box(rS, 1.4, 2.0, 1.1, C.cab, [3.9, 2.05, SZ], { side: T.DoubleSide });
      ctx.box(rS, 1.2, 1.8, 0.02, 0xffffff, [3.9, 2.05, SZ + 0.561], { map: mimicTex, edges: false });
      [3.6, 3.9, 4.2].forEach((x) => { ctx.cyl(rI, 0.07, 0.07, 0.32, 0xe9e3cf, [x, 2.35, SZ], { seg: 16 }); ctx.cyl(rI, 0.05, 0.06, 0.36, 0x222629, [x, 1.42, SZ], { seg: 12 }); ctx.rod(rI, [x, 2.51, SZ], [x, 2.75, SZ], 0.02, C.cu, { seg: 6, edges: false }); ctx.rod(rI, [x, 1.6, SZ], [x, 2.19, SZ], 0.02, C.cu, { seg: 6, edges: false }); });
      ctx.box(rI, 1.0, 0.04, 0.06, C.cu, [3.9, 2.77, SZ], { metal: 0.6, edges: false });
      const ax = G('bp_aux', { explode: [1.4, 1.6, 0] });
      ctx.box(ax, 0.8, 1.5, 0.8, 0xd5d9d7, [5.5, 1.8, SZ - 0.2]); ctx.box(ax, 0.7, 1.3, 0.02, 0xffffff, [5.5, 1.8, SZ + 0.211], { map: cabTex, edges: false });
      const em = G('bk_ems', { explode: [-1.4, 1.6, 0] });
      ctx.box(em, 0.7, 1.8, 0.5, C.cab, [-5.9, 1.95, SZ + 0.6]); ctx.box(em, 0.6, 1.6, 0.02, 0xffffff, [-5.9, 1.95, SZ + 0.861], { map: cabTex, edges: false });

      // buried cabling; flows reverse with charge/discharge
      const dc = G('bc_dc'), mv = G('bc_mv'), fb = G('bk_fiber');
      const dcRoutes = X.map((x, i) => [[x + 2.68, FL, Z - 0.6], [x + 2.68, -0.8, Z - 0.6], [x + 2.68, -0.8, -3.8 - i * 0.25], [-3.2 + (i - 1.5) * 0.3, -0.8, -3.8 - i * 0.25], [-3.2 + (i - 1.5) * 0.3, -0.8, SZ + 0.4], [-3.2 + (i - 1.5) * 0.3, 1.05, SZ + 0.4]]);
      dcRoutes.forEach((r) => ctx.polyRod(dc, r, 0.035, C.dark));
      const mvRoute = [[3.9, 1.05, SZ], [3.9, -1.0, SZ], [17.9, -1.0, SZ]];
      ctx.polyRod(mv, mvRoute, 0.045, 0x24282c);
      X.forEach((x) => ctx.polyRod(fb, [[-5.9, 1.05, SZ + 0.6], [-5.9, -0.6, SZ + 0.6], [x, -0.6, -1.5], [x, -0.6, Z - 0.9], [x, FL, Z - 0.9]], 0.012, 0xc8843f));
      const lift = (r) => r.map(([x, y, z]) => [x, y + 0.25, z]);
      const out = dcRoutes.map((r) => ctx.flowPath(lift(r), { size: 0.09, spacing: 0.7, speed: 2.4 })).concat([ctx.flowPath(lift(mvRoute), { size: 0.11, spacing: 0.7, speed: 3 })]);
      const inn = dcRoutes.map((r) => ctx.flowPath(lift(r).reverse(), { size: 0.09, spacing: 0.7, speed: 2.4 })).concat([ctx.flowPath(lift(mvRoute).reverse(), { size: 0.11, spacing: 0.7, speed: 3 })]);
      const gg = G('bg_grid');
      for (let i = -3; i <= 3; i++) ctx.rod(gg, [-17, -0.6, i * 3 - 2], [17, -0.6, i * 3 - 2], 0.02, 0xb67a4c, { seg: 4, edges: false });
      for (let i = -5; i <= 5; i++) ctx.rod(gg, [i * 3.3, -0.6, -12], [i * 3.3, -0.6, 8], 0.02, 0xb67a4c, { seg: 4, edges: false });
      const lab = ctx.label('BESS block', [0, 7.5, Z], { sub: '5 MW / 20 MWh' });
      ctx.onFrame((dt, v, s) => {
        if (!s) return;
        const b = s.bess, r = Math.abs(b.P) / 100;
        out.forEach((f) => f.set(b.P > 0 ? r : 0, 0xffa94d)); inn.forEach((f) => f.set(b.P < 0 ? r : 0, 0x2f97b5));
        lab.set('BESS block · SOC ' + (b.soc * 100).toFixed(0) + '%', b.mode + (b.P ? ' · ' + Math.abs(b.P / 20).toFixed(1) + ' MW' : ''), b.P > 0 ? '#e0974a' : b.P < 0 ? '#2f97b5' : '#9aa1a7');
      });
    },
  };
})();
