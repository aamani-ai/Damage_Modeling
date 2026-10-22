/* Plant level: wind farm — turbines on three 34.5 kV feeders, collector substation with revenue meter, gen-tie on H-frames, POI switchyard. */
(function () {
  const R = window.SubsystemModels = window.SubsystemModels || {};
  R['wind-farm'] = {
    env: 'region', caps: {},
    connections: { power: ['wf_feeders', 'wsub_mvbus', 'wsub_bus', 'wgt_cond', 'wpoi_bus', 'wpoi_lines'], ground: ['wsub_grid'], comms: [] },
    camera: { theta: 0.35, phi: 1.22, r: 2100, target: [200, 60, 0] },
    build(ctx) {
      const K = window.HVKit, rotors = [], flows = [];
      const strings = [[[-700, -420], [-330, -440], [40, -430], [410, -420]], [[-880, 0], [-500, 20], [-120, 10], [260, 0]], [[-640, 430], [-260, 440]]];
      const sub = K.collectorSub(ctx, 'w', 900, 60), poi = K.switchyard(ctx, 'w', 1650, 80);
      const fd = ctx.group(null, { node: 'wf_feeders' }), rd = ctx.group(null, { node: 'wf_roads' }), gt = K.gravel(ctx, 1, 60);
      const road = (a, b) => { const dx = b[0] - a[0], dz = b[1] - a[1]; ctx.box(rd, Math.hypot(dx, dz), 0.1, 6, 0xffffff, [(a[0] + b[0]) / 2, 0.05, (a[1] + b[1]) / 2], { rot: [0, -Math.atan2(dz, dx), 0], map: gt, rough: 1, edges: false }); };
      strings.forEach((s, i) => {
        const pads = s.map(([x, z]) => K.turbine(ctx, x, z, rotors, { node: 'wf_wtg', pad: 'wf_pads', yaw: 0.35 }));
        const last = pads[pads.length - 1];
        const route = [...pads.map((p) => [p[0], 0.2, p[2]]), [last[0] + 140, 0.2, last[2]], [sub.mvIn[0] - 40, 0.2, sub.mvIn[2] + (i - 1) * 8], [sub.mvIn[0], 0.2, sub.mvIn[2] + (i - 1) * 1.2]];
        ctx.polyRod(fd, route, 0.4, 0x2b2f33);
        flows.push(ctx.flowPath(route.map((q) => [q[0], 3, q[2]]), { size: 2.6, spacing: 30, speed: 70 }));
        for (let k = 0; k < s.length - 1; k++) road([s[k][0], s[k][1] + 14], [s[k + 1][0], s[k + 1][1] + 14]);
        road([s[s.length - 1][0], s[s.length - 1][1] + 14], [sub.mvIn[0] - 10, sub.mvIn[2] + 30]);
      });
      const tie = K.genTie(ctx, 'w', sub.gantry, poi.in, 3);
      const tf = ctx.flowPath(tie, { size: 1.8, spacing: 24, speed: 120 });
      const out = [K.txLine(ctx, 'wpoi_lines', [1674, 72], [3900, -900], { skipStart: true }), K.txLine(ctx, 'wpoi_lines', [1674, 88], [3700, 1500], { skipStart: true })].map((p) => ctx.flowPath(p, { size: 7, spacing: 110, speed: 260 }));
      const farm = ctx.label('Wind farm', [-230, 190, 0], { sub: '10 of 54 turbines shown' });
      ctx.onFrame((dt, v, s) => {
        if (!s) return;
        const w = (s.rpm * 2 * Math.PI) / 60;
        rotors.forEach((r) => { r.rotation.z -= w * dt; });
        const rate = s.wind / 151.2, col = s.wCurt > 0.5 ? 0xf0b43c : 0xffa94d;
        flows.forEach((f, i) => f.set(rate * (i === 2 ? 0.6 : 1), col)); tf.set(rate, col); out.forEach((f) => f.set(rate * 0.8, K.flowColor(s.loading.L2)));
        farm.set('Wind farm · ' + s.wind.toFixed(0) + ' MW', s.wCurt > 0.5 ? 'Curtailed ' + s.wCurt.toFixed(0) + ' MW · line limit' : '10 of 54 turbines shown', s.wCurt > 0.5 ? '#f0b43c' : '#3cc97a');
        sub.label.set('Collector substation · meter', (s.wind * 0.985).toFixed(0) + ' MW metered');
        poi.label.set('POI · pricing node', '$' + s.price.wind.toFixed(2) + '/MWh', s.price.wind < 0 ? '#e0604f' : '#3cc97a');
      });
    },
  };
})();
