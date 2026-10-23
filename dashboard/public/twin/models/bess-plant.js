/* Plant level: 100 MW / 400 MWh standalone BESS — ten of twenty 5 MW blocks, 34.5 kV feeders, collector substation, short gen-tie, POI. */
(function () {
  const R = window.SubsystemModels = window.SubsystemModels || {};
  R['bess-plant'] = {
    env: 'scrub', caps: {},
    connections: { power: ['bpl_feeders', 'bsub_mvbus', 'bsub_bus', 'bgt_cond', 'bpoi_bus', 'bpoi_lines'], ground: ['bsub_grid'], comms: [] },
    camera: { theta: 0.42, phi: 1.1, r: 520, target: [150, 0, 0] },
    build(ctx) {
      const K = window.HVKit, T = ctx.T, M = (x, y, z) => ctx.mat4([x, y, z]);
      const sub = K.collectorSub(ctx, 'b', 170, 0), poi = K.switchyard(ctx, 'b', 420, 10);
      const enc = [], hv = [], sk = [], seam = [], vent = [], base = [], fan = [], pfan = [], mvt = [], fdr = ctx.group(null, { node: 'bpl_feeders' }), outF = [], inF = [];
      [-70, -38, -6, 26, 58].forEach((x, i) => [-24, 26].forEach((z, j) => {
        [-10.2, -3.4, 3.4, 10.2].forEach((dx) => { enc.push(M(x + dx, 1.75, z)); hv.push(M(x + dx - 3.33, 1.55, z)); base.push(M(x + dx, 0.38, z)); fan.push(M(x + dx - 3.645, 1.75, z)); vent.push(M(x + dx - 1.5, 3.23, z), M(x + dx + 1.5, 3.23, z)); [-1.45, 0, 1.45].forEach((o) => [-1, 1].forEach((sd) => seam.push(M(x + dx + o, 1.75, z + sd * 1.225)))); });
        sk.push(M(x, 1.6, z - 9)); mvt.push(M(x + 1.2, 1.65, z - 9)); [-4.55, -3.2, -1.85].forEach((o) => pfan.push(M(x + o, 2.86, z - 9)));
        const route = [[x + 6, 0.2, z - 9], [x + 14, 0.2, z - 9], [x + 14, 0.2, (j ? 4 : -4) - i * 0.6], [sub.mvIn[0], 0.2, sub.mvIn[2] + (j ? 1 : -1) * (0.5 + i * 0.3)]];
        ctx.polyRod(fdr, route, 0.25, 0x2b2f33);
        const up = route.map(([a, , c]) => [a, 2, c]);
        outF.push(ctx.flowPath(up, { size: 1.0, spacing: 8, speed: 30 })); inF.push(ctx.flowPath(up.slice().reverse(), { size: 1.0, spacing: 8, speed: 30 }));
      }));
      ctx.instanced(ctx.group(null, { node: 'bpl_enc' }), new T.BoxGeometry(6.06, 2.9, 2.44), 0xe6e8e6, enc, { edges: true, edgeOpacity: 0.3 });
      ctx.instanced(ctx.group(null, { node: 'bpl_enc' }), new T.BoxGeometry(0.6, 1.8, 1.9), 0xc9cdd0, hv);
      const ge = ctx.group(null, { node: 'bpl_enc' }), gs = ctx.group(null, { node: 'bpl_skids' });
      ctx.instanced(ge, new T.BoxGeometry(6.12, 0.16, 2.5), 0x50565b, base);
      ctx.instanced(ge, new T.BoxGeometry(0.05, 2.5, 0.02), 0xb3b8b6, seam);
      ctx.instanced(ge, new T.BoxGeometry(1.2, 0.06, 1.0), 0xd2d5d3, vent);
      ctx.instanced(ge, new T.CylinderGeometry(0.42, 0.42, 0.05, 20).rotateZ(Math.PI / 2), 0x4f565c, fan);
      ctx.instanced(gs, new T.BoxGeometry(2.2, 2.5, 2.8), 0x98a1a7, mvt, { edges: true, edgeOpacity: 0.25 });
      ctx.instanced(gs, new T.CylinderGeometry(0.28, 0.28, 0.12, 18), 0x4f565c, pfan);
      ctx.instanced(ctx.group(null, { node: 'bpl_skids' }), new T.BoxGeometry(12.5, 2.4, 2.6), 0xd9dcda, sk, { edges: true, edgeOpacity: 0.3 });
      const yd = ctx.group(null, { node: 'bpl_yard' });
      ctx.box(yd, 175, 0.1, 92, 0xffffff, [-6, 0.05, 0], { map: K.gravel(ctx, 30, 16), rough: 1, edges: false });
      K.fence(ctx, yd, -94, 82, -46, 46);
      const tie = K.genTie(ctx, 'b', sub.gantry, poi.in, 2);
      const tO = ctx.flowPath(tie, { size: 1.4, spacing: 14, speed: 60 }), tI = ctx.flowPath(tie.slice().reverse(), { size: 1.4, spacing: 14, speed: 60 });
      K.txLine(ctx, 'bpoi_lines', [444, 10], [2400, -900], { skipStart: true }); K.txLine(ctx, 'bpoi_lines', [444, 18], [2300, 1100], { skipStart: true });
      const lab = ctx.label('BESS plant', [-6, 40, 0], { sub: '10 of 20 blocks shown' });
      ctx.onFrame((dt, v, s) => {
        if (!s) return;
        const b = s.bess, r = Math.abs(b.P) / 100;
        outF.forEach((f) => f.set(b.P > 0 ? r : 0, 0xffa94d)); inF.forEach((f) => f.set(b.P < 0 ? r : 0, 0x2f97b5));
        tO.set(b.P > 0 ? r : 0, 0xffa94d); tI.set(b.P < 0 ? r : 0, 0x2f97b5);
        lab.set('BESS · SOC ' + (b.soc * 100).toFixed(0) + '% · ' + b.energy.toFixed(0) + ' MWh', b.mode + (b.P ? ' · ' + Math.abs(b.P).toFixed(0) + ' MW' : ''), b.P > 0 ? '#e0974a' : b.P < 0 ? '#2f97b5' : '#9aa1a7');
        sub.label.set('Collector substation · meter', (b.P >= 0 ? 'Export ' : 'Import ') + Math.abs(b.P * 0.985).toFixed(0) + ' MW');
        poi.label.set('POI · pricing node', '$' + s.price.bess.toFixed(2) + '/MWh', '#3cc97a');
      });
    },
  };
})();
