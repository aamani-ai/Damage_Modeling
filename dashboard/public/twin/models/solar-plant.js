/* Plant level: solar plant — six tracker blocks with MV power stations, 34.5 kV feeders, collector substation, gen-tie, POI switchyard. */
(function () {
  const R = window.SubsystemModels = window.SubsystemModels || {};
  R['solar-plant'] = {
    env: 'scrub', caps: {},
    connections: { power: ['pp_feeders', 'ssub_mvbus', 'ssub_bus', 'sgt_cond', 'spoi_bus', 'spoi_lines'], ground: ['ssub_grid'], comms: [] },
    camera: { theta: 0.35, phi: 1.08, r: 880, target: [260, 0, 0] },
    build(ctx) {
      const K = window.HVKit, T = ctx.T, tex = K.cellTex(ctx, 105), tilts = [], flows = [];
      const sub = K.collectorSub(ctx, 's', 380, 0), poi = K.switchyard(ctx, 's', 900, 10);
      const sk = ctx.group(null, { node: 'pp_skids' }), fd = ctx.group(null, { node: 'pp_feeders' }), rd = ctx.group(null, { node: 'pp_roads' }), gt = K.gravel(ctx, 1, 40);
      const blocks = []; [-150, 0, 150].forEach((x) => [-58, 58].forEach((z) => blocks.push([x, z])));
      blocks.forEach(([x, z], i) => {
        tilts.push(K.solarBlock(ctx, x, z, 12, 105, 6, tex, { node: 'pp_arrays' }));
        const sx = x + 64;
        ctx.box(sk, 13, 0.3, 3, 0x7d858c, [sx, 0.9, z]); ctx.box(sk, 4, 2.3, 1.5, 0xe4e6e3, [sx - 3, 2.2, z]); ctx.box(sk, 2, 1.9, 1.4, 0x98a1a7, [sx + 1.5, 2.0, z]); ctx.box(sk, 1.6, 2.0, 1.2, 0xe4e6e3, [sx + 4.4, 2.0, z]);
        const route = [[sx + 5, 0.2, z], [sx + 12, 0.2, z], [sx + 12, 0.2, z > 0 ? 8 + i : -8 - i], [sub.mvIn[0], 0.2, sub.mvIn[2] + (z > 0 ? 1 : -1) * (0.6 + 0.4 * (i % 3))]];
        ctx.polyRod(fd, route, 0.25, 0x2b2f33);
        flows.push(ctx.flowPath(route.map((q) => [q[0], 2.2, q[2]]), { size: 1.4, spacing: 12, speed: 40 }));
      });
      [[-230, 0, 470, 8], [74, 0, 8, 210], [224, 0, 8, 210], [-76, 0, 8, 210]].forEach(([x, z, w, d]) => ctx.box(rd, w, 0.1, d, 0xffffff, [x + w / 2, 0.05, z], { map: gt, rough: 1, edges: false }));
      K.fence(ctx, ctx.group(null, { node: 'pp_fence' }), -235, 300, -118, 118);
      const tie = K.genTie(ctx, 's', sub.gantry, poi.in, 3);
      const tf = ctx.flowPath(tie, { size: 1.6, spacing: 22, speed: 110 });
      const out = [K.txLine(ctx, 'spoi_lines', [924, 2], [3000, -1200], { skipStart: true }), K.txLine(ctx, 'spoi_lines', [924, 18], [2900, 1300], { skipStart: true })].map((p) => ctx.flowPath(p, { size: 7, spacing: 110, speed: 240 }));
      const plant = ctx.label('Solar plant', [0, 60, 0], { sub: '6 of 23 blocks shown' });
      let lastTilt = null;
      ctx.onFrame((dt, v, s) => {
        if (!s) return;
        if (lastTilt === null || Math.abs(lastTilt - s.tilt) > 0.4) { lastTilt = s.tilt; tilts.forEach((f) => f(s.tilt)); }
        const rate = s.solar / 100, col = s.sCurt > 0.5 ? 0xf0b43c : 0xffa94d;
        flows.forEach((f) => f.set(rate, col)); tf.set(rate, col); out.forEach((f) => f.set(rate * 0.8, K.flowColor(s.loading.L1)));
        plant.set('Solar plant · ' + s.solar.toFixed(0) + ' MW', s.sCurt > 0.5 ? 'Curtailed ' + s.sCurt.toFixed(0) + ' MW · line limit' : s.scf > 0 ? 'Trackers at ' + s.tilt.toFixed(0) + '°' : 'Night · trackers stowed flat', s.sCurt > 0.5 ? '#f0b43c' : '#3cc97a');
        sub.label.set('Collector substation · meter', (s.solar * 0.985).toFixed(0) + ' MW metered');
        poi.label.set('POI · pricing node', '$' + s.price.solar.toFixed(2) + '/MWh', s.price.solar < 0 ? '#e0604f' : '#3cc97a');
      });
    },
  };
})();
