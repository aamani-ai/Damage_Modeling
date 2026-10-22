/* <subsystem-viewer> — portable, data-driven 3D subsystem explorer. Requires window.THREE (r147).
   Geometry builders register on window.SubsystemModels[id] = { build(ctx), env?, controls?, camera?, caps?, thumbView? }.
   API:  load(modelId, { parents, labels })   select(id)   setModes({ isolate, fade, internals, subsurface, explode })
         setHidden(ids[])   setTint({ nodeId: 0xRRGGBB } | null)   setControl(id, value)   frame(id?)   reset()
         thumbnails(ids[], w, h) -> { id: dataURL }
   Events (bubbling): sv-ready · sv-loaded { modelId, controls, caps } · sv-select { id } */
(function () {
  const waitFor = (c) => new Promise((r) => { (function p() { c() ? r() : setTimeout(p, 50); })(); });
  const NEUTRAL = 0xdde0e3, SEL = 0x3cc97a, EDGE = 0x262c31;
  const ENV = {
    prairie: { zenith: 0x6f9cc8, horizon: 0xdde4e8, haze: 0xd6dee2, base: '#8f9466', spots: ['#868d5c', '#9c9c6e', '#7b8655', '#a5a277', '#8a8f60', '#b1aa80'], hills: [0x7f8c72, 0x9aa592], tile: 36 },
    scrub: { zenith: 0x7ea6cc, horizon: 0xe4e4de, haze: 0xdfe0da, base: '#c4b896', spots: ['#bcaf8c', '#cdc2a3', '#b5a986', '#9d9670', '#8b8c62', '#d4cab0'], hills: [0xa99f86, 0xbdb6a2], tile: 28 },
    region: { zenith: 0x86a9c9, horizon: 0xe2e6e7, haze: 0xdde2e1, base: '#a6aa8c', fields: ['#9da582', '#b1b190', '#a4ac88', '#bfb895', '#8f9a77', '#b7b69d', '#a9b090', '#c4bfa3', '#9aa07f'], edge: '#6e7a5c', spots: ['#9da582'], hills: [0x9ea78f, 0xb5baa9], tile: 9600, fog: [1.6, 12] },
  };
  const texCache = {};
  function fieldTexture(T, cfg, key) {
    const N = 2048, C = 128, c = document.createElement('canvas'); c.width = c.height = N;
    const g = c.getContext('2d'); let sd = 11; const rnd = () => (sd = (sd * 16807) % 2147483647) / 2147483647;
    g.fillStyle = cfg.base; g.fillRect(0, 0, N, N);
    for (let y = 0; y < N; y += C) for (let x = 0; x < N; x += C) {
      const vert = rnd() < 0.5, k = 1 + Math.floor(rnd() * 3), w = C / k;
      for (let i = 0; i < k; i++) {
        const fx = vert ? x + i * w : x, fy = vert ? y : y + i * w, fw = vert ? w : C, fh = vert ? C : w;
        g.globalAlpha = 1; g.fillStyle = cfg.fields[Math.floor(rnd() * cfg.fields.length)]; g.fillRect(fx, fy, fw, fh);
        if (rnd() < 0.5) { g.globalAlpha = 0.06; g.fillStyle = '#20251a'; for (let r = 2; r < (vert ? fw : fh); r += 5) { if (vert) g.fillRect(fx + r, fy, 1.2, fh); else g.fillRect(fx, fy + r, fw, 1.2); } }
      }
    }
    g.fillStyle = cfg.edge;
    for (let i = 0; i <= N; i += C) for (let j = 0; j < N; j += C) { g.globalAlpha = 0.5; if (rnd() < 0.35) g.fillRect(i - 1.5, j, 3, C); if (rnd() < 0.35) g.fillRect(j, i - 1.5, C, 3); }
    for (let i = 0; i < 70; i++) { const x = 40 + rnd() * (N - 80), y = 40 + rnd() * (N - 80), r = 6 + rnd() * 16; g.globalAlpha = 0.5; g.beginPath(); g.ellipse(x, y, r, r * (0.6 + rnd() * 0.4), rnd() * 3, 0, 7); g.fill(); }
    for (let i = 0; i < 30000; i++) { g.globalAlpha = 0.07; g.fillStyle = i % 2 ? '#ffffff' : '#000000'; g.fillRect(rnd() * N, rnd() * N, 2, 2); }
    g.globalAlpha = 1;
    const t = new T.CanvasTexture(c); t.wrapS = t.wrapT = T.RepeatWrapping; t.anisotropy = 8;
    return (texCache[key] = t);
  }
  function groundTexture(T, cfg, key) {
    if (texCache[key]) return texCache[key];
    if (cfg.fields) return fieldTexture(T, cfg, key);
    const N = 1024, c = document.createElement('canvas'); c.width = c.height = N;
    const g = c.getContext('2d');
    g.fillStyle = cfg.base; g.fillRect(0, 0, N, N);
    const wrap = (fn, x, y, r) => { for (const dx of [-N, 0, N]) for (const dy of [-N, 0, N]) if (x + dx > -r && x + dx < N + r && y + dy > -r && y + dy < N + r) fn(x + dx, y + dy); };
    for (let i = 0; i < 90; i++) {
      const r = 40 + Math.random() * 150, x = Math.random() * N, y = Math.random() * N;
      g.globalAlpha = 0.22; g.fillStyle = cfg.spots[i % cfg.spots.length];
      wrap((px, py) => { g.beginPath(); g.ellipse(px, py, r, r * (0.5 + Math.random() * 0.5), Math.random() * 3, 0, 7); g.fill(); }, x, y, r);
    }
    for (let i = 0; i < 16000; i++) {
      const s = 0.8 + Math.random() * 2.2, x = Math.random() * N, y = Math.random() * N;
      g.globalAlpha = 0.25 + Math.random() * 0.35; g.fillStyle = cfg.spots[i % cfg.spots.length];
      wrap((px, py) => g.fillRect(px, py, s, s), x, y, 3);
    }
    g.globalAlpha = 1;
    const t = new T.CanvasTexture(c); t.wrapS = t.wrapT = T.RepeatWrapping; t.anisotropy = 8;
    return (texCache[key] = t);
  }
  function worldUV(geo, tile) {
    const p = geo.attributes.position, uv = new Float32Array(p.count * 2);
    for (let i = 0; i < p.count; i++) { uv[i * 2] = p.getX(i) / tile; uv[i * 2 + 1] = p.getZ(i) / tile; }
    geo.setAttribute('uv', new geo.attributes.position.constructor(uv, 2));
  }

  class SubsystemViewer extends HTMLElement {
    connectedCallback() {
      if (this._started) return; this._started = true;
      Object.assign(this.style, { display: 'block', width: '100%', height: '100%', position: 'relative', overflow: 'hidden' });
      this._st = { sel: null, hover: null, isolate: false, fade: false, internals: false, subsurface: false, explode: 0, hidden: new Set(), tint: null };
      this._ex = 0; this._meshes = []; this._pick = []; this._exGroups = []; this._updaters = []; this._framers = []; this._flows = []; this._fx = [];
      this._init();
    }
    disconnectedCallback() { this._dead = true; cancelAnimationFrame(this._raf); if (this._ro) this._ro.disconnect(); }

    async _init() {
      await waitFor(() => window.THREE);
      const T = this._T = window.THREE;
      const scene = this._scene = new T.Scene(); scene.background = new T.Color(0xdde4e8);
      this._cam = new T.PerspectiveCamera(32, 2, 0.05, 40000);
      const rd = this._rd = new T.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true, logarithmicDepthBuffer: true });
      rd.setPixelRatio(Math.min(devicePixelRatio, 2));
      rd.shadowMap.enabled = true; rd.shadowMap.type = T.PCFSoftShadowMap;
      rd.domElement.style.display = 'block'; rd.domElement.style.outline = 'none';
      this.appendChild(rd.domElement);
      this._hemi = new T.HemisphereLight(0xe2ebf3, 0x8c8768, 0.64); scene.add(this._hemi);
      this._sun = new T.Vector3(0.52, 0.78, 0.34).normalize();
      const key = this._key = new T.DirectionalLight(0xfff3e0, 0.88);
      key.castShadow = true; key.shadow.mapSize.set(2048, 2048); key.shadow.bias = -0.0003; key.shadow.normalBias = 0.03;
      scene.add(key, key.target);
      const fill = this._fill = new T.DirectionalLight(0xdfe8f0, 0.22); fill.position.set(-1, 0.4, -0.8); scene.add(fill);
      this._root = new T.Group(); scene.add(this._root);
      this._envG = new T.Group(); scene.add(this._envG);
      const tip = this._tip = document.createElement('div');
      Object.assign(tip.style, { position: 'absolute', pointerEvents: 'none', display: 'none', padding: '5px 9px', borderRadius: '6px', border: '1px solid var(--border, #e5e5e5)', background: 'rgba(255,255,255,0.96)', boxShadow: '0 8px 20px rgba(0,0,0,0.10)', font: '500 12px/1.35 Inter, system-ui, sans-serif', color: '#1c1c1c', whiteSpace: 'nowrap', zIndex: 3 });
      this.appendChild(tip);
      this._sph = { theta: 0.7, phi: 1.1, r: 20 }; this._sphT = { ...this._sph };
      this._tgt = new T.Vector3(); this._tgtT = new T.Vector3();
      this._ray = new T.Raycaster(); this._ptr = new T.Vector2();
      this._bind(rd.domElement);
      this._ro = new ResizeObserver(() => this._resize()); this._ro.observe(this); this._resize();
      const loop = () => { if (this._dead) return; this._tick(); this._raf = requestAnimationFrame(loop); };
      loop();
      this._ready = true;
      this.dispatchEvent(new CustomEvent('sv-ready', { bubbles: true, composed: true }));
      if (this._pending) { const p = this._pending; this._pending = null; this.load(p[0], p[1]); }
    }

    _resize() {
      if (!this._rd) return;
      const w = this.clientWidth, h = this.clientHeight;
      if (w < 10 || h < 10) return;
      this._rd.setSize(w, h); this._cam.aspect = w / h; this._cam.updateProjectionMatrix();
    }

    // ---------- model loading ----------
    async load(modelId, opts) {
      if (!this._ready) { this._pending = [modelId, opts]; return; }
      const tok = this._tok = (this._tok || 0) + 1;
      await waitFor(() => window.SubsystemModels && window.SubsystemModels[modelId]);
      if (tok !== this._tok) return;
      const T = this._T, M = window.SubsystemModels[modelId];
      this._clear();
      this._model = M; this._loaded = false; this._hole = null;
      this._parents = (opts && opts.parents) || {}; this._labels = (opts && opts.labels) || {};
      const envKey = M.env || 'prairie'; this._envCfg = ENV[envKey]; this._envTex = groundTexture(T, this._envCfg, envKey);
      M.build(this._ctx());
      this._root.updateMatrixWorld(true);
      this._register();
      this._ctl = {}; this._ctlT = {};
      (M.controls || []).forEach((c) => { this._ctl[c.id] = this._ctlT[c.id] = c.value; });
      this._updaters.forEach((f) => f(this._ctl));
      this._root.updateMatrixWorld(true);
      const box = new T.Box3();
      this._meshes.forEach((m) => { if (!m.userData.isGround) box.expandByObject(m); });
      const sph = this._bounds = box.getBoundingSphere(new T.Sphere());
      this._buildEnv(sph);
      this._lastH = undefined; if (this._sim) this._daylight(this._sim.h);
      const cm = M.camera || {};
      const vf = this._cam.fov * Math.PI / 180, hf = 2 * Math.atan(Math.tan(vf / 2) * this._cam.aspect);
      const fit = sph.radius / Math.sin(Math.min(vf, hf) / 2);
      this._home = { theta: cm.theta ?? 0.7, phi: cm.phi ?? 1.1, r: cm.r ?? fit * (cm.zoom ?? 0.95), target: cm.target ? new T.Vector3(...cm.target) : sph.center.clone() };
      this._st.sel = null; this._st.hover = null; this._st.hidden = new Set(); this._st.tint = null;
      this._ex = this._st.explode = 0;
      this._shadowKey = null;
      this.reset(true);
      this._apply();
      this._loaded = true;
      this.dispatchEvent(new CustomEvent('sv-loaded', { bubbles: true, composed: true, detail: { modelId, controls: M.controls || [], caps: M.caps || {}, connections: M.connections || {} } }));
    }

    _clear() {
      const dispose = (root) => root.traverse((o) => {
        if (o.geometry) o.geometry.dispose();
        if (o.material) [].concat(o.material).forEach((m) => { if (m.map && !m.map.userData.shared) m.map.dispose(); m.dispose(); });
      });
      dispose(this._root); this._root.clear(); dispose(this._envG); this._envG.clear();
      this._meshes = []; this._pick = []; this._exGroups = []; this._updaters = []; this._framers = []; this._flows = []; this._fx = [];
    }

    _buildEnv(sph) {
      const T = this._T, cfg = this._envCfg, R = Math.max(sph.radius, 12), G = this._envG;
      this._scene.background = new T.Color(cfg.horizon);
      const fg = cfg.fog || [3.2, 26]; this._scene.fog = new T.Fog(cfg.haze, R * fg[0], R * fg[1]);
      const SR = this._skyR = Math.max(20000, R * 16); this._cam.far = SR * 1.6; this._cam.updateProjectionMatrix();
      const sky = new T.SphereGeometry(SR, 32, 20), col = [], c1 = new T.Color(cfg.horizon), c2 = new T.Color(cfg.zenith), c = new T.Color();
      const p = sky.attributes.position;
      for (let i = 0; i < p.count; i++) { const t = Math.max(0, p.getY(i) / SR); c.copy(c1).lerp(c2, Math.pow(t, 0.5)); col.push(c.r, c.g, c.b); }
      sky.setAttribute('color', new T.Float32BufferAttribute(col, 3));
      const skyM = new T.Mesh(sky, new T.MeshBasicMaterial({ vertexColors: true, side: T.BackSide, fog: false, depthWrite: false }));
      skyM.renderOrder = -10; G.add(skyM); this._envSky = sky;
      const S = Math.max(16000, R * 12), sh = new T.Shape(); sh.moveTo(-S, -S); sh.lineTo(S, -S); sh.lineTo(S, S); sh.lineTo(-S, S); sh.lineTo(-S, -S);
      if (this._hole) { const h = this._hole, hp = new T.Path(); hp.moveTo(h.x0, -h.z0); hp.lineTo(h.x0, -h.z1); hp.lineTo(h.x1, -h.z1); hp.lineTo(h.x1, -h.z0); hp.lineTo(h.x0, -h.z0); sh.holes.push(hp); }
      const gg = new T.ShapeGeometry(sh); gg.rotateX(-Math.PI / 2); worldUV(gg, cfg.tile);
      const ground = new T.Mesh(gg, new T.MeshStandardMaterial({ map: this._envTex, roughness: 1, metalness: 0 }));
      ground.receiveShadow = true; G.add(ground);
      cfg.hills.forEach((hc, k) => {
        const n = 120, rad = Math.max(R * (9 + k * 5), 420 + k * 260), pos = [], idx = [];
        const seed = k * 1.7 + 0.4;
        for (let i = 0; i <= n; i++) {
          const a = (i / n) * Math.PI * 2;
          const h = rad * (0.028 + 0.022 * Math.sin(a * 3 + seed) + 0.016 * Math.sin(a * 7 + seed * 2) + 0.009 * Math.sin(a * 17 + seed * 3)) * (1.4 - k * 0.3);
          const r = rad * (1 + 0.06 * Math.sin(a * 5 + seed));
          pos.push(Math.cos(a) * r, -3, Math.sin(a) * r, Math.cos(a) * r, Math.max(2, h), Math.sin(a) * r);
          if (i < n) { const b = i * 2; idx.push(b, b + 2, b + 1, b + 1, b + 2, b + 3); }
        }
        const hg = new T.BufferGeometry(); hg.setAttribute('position', new T.Float32BufferAttribute(pos, 3)); hg.setIndex(idx);
        G.add(new T.Mesh(hg, new T.MeshBasicMaterial({ color: hc, side: T.DoubleSide })));
      });
    }

    _ctx() {
      const T = this._T, self = this, edgeCache = new Map();
      const add = (parent, o) => { (parent || self._root).add(o); return o; };
      const edgeLines = (eg, o) => { const e = new T.LineSegments(eg, new T.LineBasicMaterial({ color: EDGE, transparent: true, opacity: o.edgeOpacity ?? 0.3 })); e.raycast = () => {}; e.userData.isEdge = true; return e; };
      const ctx = {
        T, root: this._root,
        group(parent, o = {}) {
          const g = new T.Group();
          if (o.node) g.userData.node = o.node;
          if (o.shell) g.userData.shell = true;
          if (o.context) g.userData.context = true;
          if (o.rep) g.userData.rep = true;
          if (o.pos) g.position.set(...o.pos);
          if (o.rot) g.rotation.set(...o.rot);
          if (o.explode) { g.userData.ex = new T.Vector3(...o.explode); g.userData.base = g.position.clone(); self._exGroups.push(g); }
          return add(parent, g);
        },
        mesh(parent, geo, color, o = {}) {
          const mat = new T.MeshStandardMaterial({ color, roughness: o.rough ?? 0.74, metalness: o.metal ?? 0.06, transparent: (o.opacity ?? 1) < 1, opacity: o.opacity ?? 1, side: o.side || T.FrontSide, map: o.map || null, flatShading: !!o.flat, alphaTest: o.alphaTest || 0 });
          const m = new T.Mesh(geo, mat);
          if (o.pos) m.position.set(...o.pos);
          if (o.rot) m.rotation.set(...o.rot);
          if (o.node) m.userData.node = o.node;
          m.castShadow = o.shadow !== false; m.receiveShadow = true;
          if (o.edges !== false) {
            let eg = edgeCache.get(geo.uuid);
            if (!eg) { eg = new T.EdgesGeometry(geo, o.edgeAngle ?? 28); edgeCache.set(geo.uuid, eg); }
            const e = edgeLines(eg, o); m.add(e); m.userData.edge = e; m.userData.edgeBase = o.edgeOpacity ?? 0.3;
          }
          return add(parent, m);
        },
        box(parent, w, h, d, color, pos, o = {}) { return ctx.mesh(parent, new T.BoxGeometry(w, h, d), color, { ...o, pos }); },
        cyl(parent, r1, r2, h, color, pos, o = {}) { return ctx.mesh(parent, new T.CylinderGeometry(r1, r2, h, o.seg || 32, 1, !!o.open), color, { ...o, pos }); },
        rod(parent, a, b, r, color, o = {}) {
          const A = new T.Vector3(...a), B = new T.Vector3(...b);
          const m = ctx.mesh(parent, new T.CylinderGeometry(r, o.r2 ?? r, A.distanceTo(B), o.seg || 16), color, o);
          m.position.copy(A).add(B).multiplyScalar(0.5);
          m.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), B.clone().sub(A).normalize());
          return m;
        },
        polyRod(parent, pts, r, color, o = {}) { for (let i = 0; i < pts.length - 1; i++) ctx.rod(parent, pts[i], pts[i + 1], r, color, { seg: 10, edges: false, ...o }); },
        aimRod(m, a, b) {
          const A = new T.Vector3(...a), B = new T.Vector3(...b), len = A.distanceTo(B);
          m.position.copy(A).add(B).multiplyScalar(0.5);
          m.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), B.clone().sub(A).normalize());
          m.scale.set(1, len / (m.userData.len0 || (m.userData.len0 = m.geometry.parameters.height)), 1);
        },
        ring(parent, rIn, rOut, h, color, pos, o = {}) { return ctx.mesh(parent, ctx.ringGeo(rIn, rOut, h, o.seg), color, { ...o, pos }); },
        ringGeo(rIn, rOut, h, seg) {
          const s = new T.Shape(); s.absarc(0, 0, rOut, 0, Math.PI * 2, false);
          const hole = new T.Path(); hole.absarc(0, 0, rIn, 0, Math.PI * 2, true); s.holes.push(hole);
          const g = new T.ExtrudeGeometry(s, { depth: h, bevelEnabled: false, curveSegments: seg || 48 });
          g.rotateX(-Math.PI / 2); g.translate(0, -h / 2, 0); return g;
        },
        ribbon(parent, A, B, color, o = {}) {
          const pos = [], idx = [];
          A.forEach((a, i) => { pos.push(a.x, a.y, a.z, B[i].x, B[i].y, B[i].z); if (i < A.length - 1) { const k = i * 2; idx.push(k, k + 2, k + 1, k + 1, k + 2, k + 3); } });
          const g = new T.BufferGeometry(); g.setAttribute('position', new T.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals();
          return ctx.mesh(parent, g, color, { side: T.DoubleSide, ...o });
        },
        tube(parent, pts, r, color, o = {}) {
          const curve = new T.CatmullRomCurve3(pts.map((p) => (p.isVector3 ? p : new T.Vector3(...p))), false, 'catmullrom', o.tension ?? 0.1);
          return ctx.mesh(parent, new T.TubeGeometry(curve, o.segs || pts.length * 6, r, o.radial || 8, false), color, { edges: false, ...o });
        },
        instanced(parent, geo, color, matrices, o = {}) {
          const mat = new T.MeshStandardMaterial({ color, roughness: o.rough ?? 0.6, metalness: o.metal ?? 0.15, map: o.map || null, transparent: (o.opacity ?? 1) < 1, opacity: o.opacity ?? 1, side: o.side || T.FrontSide });
          const m = new T.InstancedMesh(geo, mat, matrices.length);
          matrices.forEach((mx, i) => m.setMatrixAt(i, mx));
          m.castShadow = o.shadow !== false; m.receiveShadow = true;
          if (o.node) m.userData.node = o.node;
          if (o.edges) {
            const eg = new T.EdgesGeometry(geo, o.edgeAngle ?? 28), src = eg.attributes.position, out = new Float32Array(src.count * 3 * matrices.length), v = new T.Vector3();
            matrices.forEach((mx, k) => { for (let i = 0; i < src.count; i++) { v.fromBufferAttribute(src, i).applyMatrix4(mx); out.set([v.x, v.y, v.z], (k * src.count + i) * 3); } });
            const lg = new T.BufferGeometry(); lg.setAttribute('position', new T.BufferAttribute(out, 3)); eg.dispose();
            const e = edgeLines(lg, o); m.add(e); m.userData.edge = e; m.userData.edgeBase = o.edgeOpacity ?? 0.3;
          }
          return add(parent, m);
        },
        polar(n, r, y, fn) { const out = []; for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2; out.push(fn(a, Math.cos(a) * r, y, Math.sin(a) * r, i)); } return out; },
        mat4(pos, rot, scl) { const m = new T.Matrix4(); m.compose(new T.Vector3(...pos), new T.Quaternion().setFromEuler(new T.Euler(...(rot || [0, 0, 0]))), new T.Vector3(...(scl || [1, 1, 1]))); return m; },
        texture(w, h, draw) { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); const t = new T.CanvasTexture(c); t.anisotropy = 8; return t; },
        // soil section box flush with the terrain; the environment ground gets a matching hole
        ground(o = {}) {
          const x0 = o.x0, x1 = o.x1, z0 = o.z0, z1 = o.z1, d = o.depth || 3, sx = x1 - x0, sz = z1 - z0;
          self._hole = { x0, x1, z0, z1 };
          const g = ctx.group(null, {}); g.userData.ground = true;
          const tg = new T.PlaneGeometry(sx, sz); tg.rotateX(-Math.PI / 2); tg.translate((x0 + x1) / 2, 0, (z0 + z1) / 2); worldUV(tg, self._envCfg.tile);
          self._envTex.userData.shared = true;
          const top = new T.Mesh(tg, new T.MeshStandardMaterial({ map: self._envTex, roughness: 1, transparent: true }));
          top.receiveShadow = true; g.add(top);
          const soil = ctx.texture(256, 256, (c, w, h) => { c.fillStyle = '#b9a98a'; c.fillRect(0, 0, w, h); for (let i = 0; i < 2600; i++) { c.fillStyle = ['#a8987a', '#c6b797', '#9d8e72', '#cfc2a6'][i % 4]; c.fillRect(Math.random() * w, Math.random() * h, 2, 2); } c.fillStyle = 'rgba(120,100,70,0.25)'; c.fillRect(0, 0, w, 18); });
          const bm = new T.MeshStandardMaterial({ map: soil, roughness: 1, transparent: true, side: T.DoubleSide });
          const body = new T.Mesh(new T.BoxGeometry(sx, d, sz), bm);
          body.position.set((x0 + x1) / 2, -d / 2 - 0.004, (z0 + z1) / 2); g.add(body);
          const e = new T.LineSegments(new T.EdgesGeometry(body.geometry), new T.LineBasicMaterial({ color: 0x5c533f, transparent: true, opacity: 0.5 }));
          e.raycast = () => {}; e.userData.isEdge = true; body.add(e); body.userData.gEdge = e;
          return g;
        },
        flowPath(pts, o = {}) {
          const P = pts.map((p) => (p.isVector3 ? p.clone() : new T.Vector3(...p))), L = [0];
          for (let i = 1; i < P.length; i++) L.push(L[i - 1] + P[i].distanceTo(P[i - 1]));
          const total = L[L.length - 1], n = Math.max(2, Math.min(o.max || 140, Math.floor(total / (o.spacing || total / 30))));
          const mat = new T.MeshBasicMaterial({ color: o.color ?? 0xffa94d, transparent: true, opacity: 0.95, depthWrite: false });
          const m = new T.InstancedMesh(new T.SphereGeometry(o.size || 0.3, 10, 8), mat, n);
          m.userData.fx = true; m.frustumCulled = false; m.renderOrder = 6; m.raycast = () => {};
          add(o.parent, m);
          const f = { m, P, L, n, sp: total / n, phase: 0, rate: 0, speed: o.speed || total / 8, v: new T.Vector3(), mx: new T.Matrix4() };
          self._flows.push(f);
          return { set(rate, color) { f.rate = rate; if (color != null) mat.color.setHex(color); }, mesh: m };
        },
        label(text, pos, o = {}) {
          const c = document.createElement('canvas'); c.width = 512; c.height = 128;
          const tex = new T.CanvasTexture(c); tex.anisotropy = 4;
          const sp = new T.Sprite(new T.SpriteMaterial({ map: tex, depthTest: false, depthWrite: false, transparent: true, sizeAttenuation: false }));
          sp.position.set(...pos); sp.center.set(0.5, 0); const k = o.scale || 1; sp.scale.set(0.15 * k, 0.0375 * k, 1);
          sp.renderOrder = 20; sp.userData.fx = true; sp.raycast = () => {}; add(o.parent, sp); self._fx.push(sp);
          let last = '';
          const h = {
            sprite: sp,
            set(t1, t2, accent) {
              const key = t1 + '|' + (t2 || '') + '|' + (accent || ''); if (key === last) return; last = key;
              const g = c.getContext('2d'); g.clearRect(0, 0, 512, 128);
              g.font = '600 38px Inter, system-ui, sans-serif'; const w1 = g.measureText(t1).width; g.font = '500 30px Inter, system-ui, sans-serif'; const w2 = t2 ? g.measureText(t2).width : 0;
              const W = Math.min(508, Math.max(w1, w2) + (accent ? 62 : 36)), H = t2 ? 112 : 66, x0 = (512 - W) / 2, y0 = 128 - H - 2;
              g.fillStyle = 'rgba(255,255,255,0.94)'; g.strokeStyle = 'rgba(0,0,0,0.14)'; g.lineWidth = 2;
              g.beginPath(); g.roundRect ? g.roundRect(x0, y0, W, H, 14) : g.rect(x0, y0, W, H); g.fill(); g.stroke();
              let tx = x0 + 18; if (accent) { g.fillStyle = accent; g.beginPath(); g.arc(x0 + 26, y0 + 33, 9, 0, 7); g.fill(); tx = x0 + 46; }
              g.fillStyle = '#1c1c1c'; g.font = '600 38px Inter, system-ui, sans-serif'; g.textBaseline = 'middle'; g.fillText(t1, tx, y0 + 34);
              if (t2) { g.fillStyle = '#5b6168'; g.font = '500 30px Inter, system-ui, sans-serif'; g.fillText(t2, tx, y0 + 80); }
              tex.needsUpdate = true;
            },
          };
          h.set(text, o.sub, o.accent);
          return h;
        },
        onUpdate(fn) { self._updaters.push(fn); },
        onFrame(fn) { self._framers.push(fn); },
        deg: (d) => d * Math.PI / 180,
      };
      return ctx;
    }

    _register() {
      this._root.traverse((o) => {
        if (!o.isMesh || o.userData.isEdge || o.userData.fx) return;
        let n = o, node = null, shell = false, context = false, ground = false, rp = false;
        while (n && n !== this._root) {
          if (!node && n.userData.node) node = n.userData.node;
          if (n.userData.shell) shell = true;
          if (n.userData.context) context = true;
          if (n.userData.ground) ground = true;
          if (n.userData.rep) rp = true;
          n = n.parent;
        }
        const u = o.userData;
        u.leaf = node; u.isRep = rp; u.isShell = shell; u.isGround = ground; u.isCtx = context || (!node && !ground);
        const chain = []; let c = node; while (c && chain.length < 12) { chain.push(c); c = this._parents[c]; }
        u.chain = chain; u.cast = o.castShadow;
        if (!ground) u.b = { color: o.material.color.getHex(), opacity: o.material.opacity, transparent: o.material.transparent, map: o.material.map || null };
        this._meshes.push(o);
        if (!u.isCtx && !ground) this._pick.push(o);
      });
    }

    // ---------- state ----------
    select(id) {
      this._st.sel = id || null; this._autoGhost = new Set();
      const box = id && this._box(id, false);
      if (box && !this._meshes.some((m) => m.userData.isShell && m.userData.chain.includes(id))) {
        const c = box.getCenter(new this._T.Vector3()), b = new this._T.Box3();
        for (const m of this._meshes) { const u = m.userData; if (u.isShell && !this._autoGhost.has(u.leaf) && b.setFromObject(m).containsPoint(c)) this._autoGhost.add(u.leaf); }
      }
      this._apply();
    }
    setModes(m) { Object.assign(this._st, m); this._apply(); }
    setHidden(ids) { this._st.hidden = new Set(ids || []); this._apply(); }
    setTint(map) { this._st.tint = map || null; this._apply(); }
    setControl(id, v) { if (this._ctlT) this._ctlT[id] = v; }
    setSim(s) { this._sim = s; if (s && this._envSky && !this._studio) this._daylight(s.h); }
    setWater(h) {
      const T = this._T; if (!T || !this._scene) return;
      if (h == null) { if (this._water) { this._water.visible = false; this._needs = true; } return; }
      if (!this._water) {
        const w = this._water = new T.Mesh(new T.PlaneGeometry(1, 1), new T.MeshStandardMaterial({ color: 0x4f86a8, transparent: true, opacity: 0.42, roughness: 0.2, metalness: 0, depthWrite: false }));
        w.rotation.x = -Math.PI / 2; w.renderOrder = 3; this._scene.add(w);
      }
      this._water.scale.set(8000, 8000, 1); this._water.position.y = h; this._water.visible = true; this._needs = true;
    }
    // ---------- event weather: hail, rain, freezing rain, snow, lightning, storm light ----------
    setWeather(w) {
      this._wx = w || null; const dk = w ? w.dark || 0 : 0;
      if (Math.abs((this._dark || 0) - dk) > 0.02) { this._dark = dk; this._lastH = undefined; if (this._sim && this._envSky && !this._studio) this._daylight(this._sim.h); }
    }
    _wxInit() {
      const T = this._T, g = this._wxG = new T.Group(); this._scene.add(g);
      const mk = (n, geo, mat) => { const m = new T.InstancedMesh(geo, mat, n); m.frustumCulled = false; m.count = 0; m.castShadow = false; m.receiveShadow = false; m.raycast = () => {}; m.userData.fx = true; g.add(m); return m; };
      const ice = new T.MeshStandardMaterial({ color: 0xf3f8fc, roughness: 0.28, metalness: 0, emissive: 0x3a4148 });
      const NH = 1800, NG = 2600, NS = 1800, NR = 3200, rnd = (a) => { for (let i = 0; i < a.length; i += 3) { a[i] = Math.random() * 2 - 1; a[i + 1] = Math.random(); a[i + 2] = Math.random() * 2 - 1; } return a; };
      this._wh = { m: mk(NH, new T.IcosahedronGeometry(1, 1), ice), n: NH, p: rnd(new Float32Array(NH * 3)) };
      this._wg = { m: mk(NG, new T.IcosahedronGeometry(1, 1), ice), n: NG, p: new Float32Array(NG * 4), k: 0, c: 0 };
      this._ws = { m: mk(NS, new T.IcosahedronGeometry(1, 0), new T.MeshBasicMaterial({ color: 0xffffff })), n: NS, p: rnd(new Float32Array(NS * 3)) };
      const ra = new Float32Array(NR * 6), rg = new T.BufferGeometry(); rg.setAttribute('position', new T.BufferAttribute(ra, 3)); rg.setDrawRange(0, 0);
      const rl = new T.LineSegments(rg, new T.LineBasicMaterial({ color: 0x9fb2c4, transparent: true, opacity: 0.5, depthWrite: false })); rl.frustumCulled = false; rl.raycast = () => {}; g.add(rl);
      this._wr = { l: rl, n: NR, p: rnd(new Float32Array(NR * 3)), a: ra };
      this._wM = new T.Matrix4(); this._wQ = new T.Quaternion(); this._wV = new T.Vector3(); this._wS = new T.Vector3();
    }
    _wxStep(dt) {
      const w = this._wx; if (!w && !this._wxG) return; if (!this._wxG) this._wxInit();
      this._wxG.visible = !this._studio; if (this._studio) return;
      const s = this._sph, c = this._tgt, M = this._wM, Q = this._wQ, V = this._wV, S = this._wS, rnd = () => Math.random() * 2 - 1;
      const R = Math.max(6, Math.min(s.r * 0.9, 900)), HH = R * 1.1, wind = w ? ((w.gust || 0) / 100) * (w.dir || 1) : 0;
      const map = (p, i, rg) => (rg ? V.set(rg[0] + (p[i] * 0.5 + 0.5) * (rg[1] - rg[0]), p[i + 1] * rg[4], rg[2] + (p[i + 2] * 0.5 + 0.5) * (rg[3] - rg[2])) : V.set(c.x + p[i] * R, p[i + 1] * HH, c.z + p[i + 2] * R));
      const span = (rg) => (rg ? [(rg[1] - rg[0]) / 2, rg[4]] : [R, HH]);
      // hail: falls fast, lands and lies on the ground until it melts
      const H = this._wh, G = this._wg, hreg = w && (w.hailRegion || w.region), hn = w && w.hail > 0 ? Math.round(H.n * Math.min(1, w.hail)) : 0;
      const hr = w && w.hailIn ? (hreg ? Math.max(1.5, Math.min(w.size || 6, R * 0.006)) : Math.max(w.hailIn * 0.0127, R * 0.0035)) : 0, gt = w && !hreg ? w.ground || 0 : 0;
      const land = (x, z) => { const j = G.k * 4; G.p[j] = x; G.p[j + 1] = hr * 0.5; G.p[j + 2] = z; G.p[j + 3] = hr * (0.7 + Math.random() * 0.5); G.k = (G.k + 1) % G.n; G.c = Math.min(G.n, G.c + 1); };
      if (gt <= 0.001 && G.c) { G.c = 0; G.k = 0; }
      for (let i = 0; i < hn; i++) {
        const j = i * 3; H.p[j + 1] -= dt * 0.95; H.p[j] += dt * wind * 0.3;
        if (H.p[j + 1] < 0) { if (gt > 0 && Math.random() < 0.55) { map(H.p, j, hreg); land(V.x, V.z); } H.p[j + 1] += 1; H.p[j] = rnd(); H.p[j + 2] = rnd(); }
        if (H.p[j] > 1) H.p[j] -= 2; else if (H.p[j] < -1) H.p[j] += 2;
        map(H.p, j, hreg); S.set(hr, hr, hr); M.compose(V, Q, S); H.m.setMatrixAt(i, M);
      }
      H.m.count = hn; if (hn) H.m.instanceMatrix.needsUpdate = true;
      if (!hn && gt > 0.001 && hr && G.c < G.n * 0.5) while (G.c < G.n * 0.5) { const a = Math.random() * Math.PI * 2, rr = Math.sqrt(Math.random()); land(hreg ? hreg[0] + Math.random() * (hreg[1] - hreg[0]) : c.x + Math.cos(a) * rr * R, hreg ? hreg[2] + Math.random() * (hreg[3] - hreg[2]) : c.z + Math.sin(a) * rr * R); }
      const gs = Math.min(1, gt * 1.15);
      for (let i = 0; i < G.c; i++) { const j = i * 4, r = G.p[j + 3] * gs; V.set(G.p[j], G.p[j + 1] * gs, G.p[j + 2]); S.set(r, r * 0.62, r); M.compose(V, Q, S); G.m.setMatrixAt(i, M); }
      G.m.count = gs > 0.01 ? G.c : 0; if (G.m.count) G.m.instanceMatrix.needsUpdate = true;
      // snow: slow, drifting
      const SN = this._ws, sn = w && w.snow > 0 ? Math.round(SN.n * Math.min(1, w.snow)) : 0, sreg = w && w.region, sr = sreg ? (w.size || 6) * 0.7 : R * 0.0028, tt = performance.now() / 1000;
      for (let i = 0; i < sn; i++) {
        const j = i * 3; SN.p[j + 1] -= dt * 0.11; SN.p[j] += dt * (wind * 0.12 + 0.03 * Math.sin(tt * 1.3 + i));
        if (SN.p[j + 1] < 0) { SN.p[j + 1] += 1; SN.p[j] = rnd(); SN.p[j + 2] = rnd(); }
        if (SN.p[j] > 1) SN.p[j] -= 2; else if (SN.p[j] < -1) SN.p[j] += 2;
        map(SN.p, j, sreg); S.set(sr, sr, sr); M.compose(V, Q, S); SN.m.setMatrixAt(i, M);
      }
      SN.m.count = sn; if (sn) SN.m.instanceMatrix.needsUpdate = true;
      // rain and freezing rain: streaks slanted by the wind
      const RN = this._wr, rreg = w && w.region, rn = w && w.rain > 0 ? Math.round(RN.n * Math.min(1, w.rain)) : 0, [sx, sy] = span(rreg), vy = 2.4, vx = wind * 0.9;
      const len = rreg ? rreg[4] * 0.12 : R * 0.07, dxw = vx * 0.4 * sx, dyw = vy * sy, nn = Math.hypot(dxw, dyw) || 1, ox = (dxw / nn) * len, oy = (dyw / nn) * len, a = RN.a;
      for (let i = 0; i < rn; i++) {
        const j = i * 3; RN.p[j + 1] -= dt * vy; RN.p[j] += dt * vx * 0.4;
        if (RN.p[j + 1] < 0) { RN.p[j + 1] += 1; RN.p[j] = rnd(); RN.p[j + 2] = rnd(); }
        if (RN.p[j] > 1) RN.p[j] -= 2; else if (RN.p[j] < -1) RN.p[j] += 2;
        map(RN.p, j, rreg); const k = i * 6; a[k] = V.x; a[k + 1] = V.y; a[k + 2] = V.z; a[k + 3] = V.x - ox; a[k + 4] = V.y + oy; a[k + 5] = V.z;
      }
      RN.l.geometry.setDrawRange(0, rn * 2); if (rn) RN.l.geometry.attributes.position.needsUpdate = true;
      RN.l.material.color.setHex(w && w.freezing ? 0xdbe9f4 : 0x9fb2c4); RN.l.material.opacity = w && w.freezing ? 0.62 : 0.5;
      // lightning
      if (w && w.lightning && (this._flT || 0) <= 0 && Math.random() < dt * 0.45) this._flT = 0.12 + Math.random() * 0.1;
      if (this._flT > 0) { this._flT -= dt; this._hemi.intensity = (this._hemiBase ?? this._hemi.intensity) + (this._flT > 0 ? 1.3 : 0); }
    }
    setStudio(on) {
      on = !!on; if (!!this._studio === on) return; this._studio = on;
      this._envG.visible = !on;
      if (on) { this._fogSaved = this._scene.fog; this._scene.fog = null; } else if (this._fogSaved) { this._scene.fog = this._fogSaved; this._fogSaved = null; }
      this._lastH = undefined; if (this._envSky) this._daylight(on ? 12 : this._sim ? this._sim.h : 12);
      this._shadowKey = null; this._apply();
    }
    _daylight(h) {
      if (this._lastH !== undefined && Math.abs(this._lastH - h) < 0.04) return;
      this._lastH = h;
      const T = this._T, cfg = this._envCfg, el = Math.sin((Math.PI * (h - 6)) / 12), cl = (x) => Math.max(0, Math.min(1, x));
      const day = cl(el * 2.4 + 0.15), dusk = el > -0.3 ? cl(1 - Math.abs(el - 0.05) * 3.5) : 0, az = (Math.PI * (h - 6)) / 12;
      this._sun.set(0.32, Math.max(0.07, el), Math.cos(az)).normalize();
      const C = (a) => new T.Color(a), mix = (a, b, t) => C(a).lerp(C(b), t);
      const zen = mix(0x16233a, cfg.zenith, day), hor = mix(0x34445c, cfg.horizon, day).lerp(C(0xf0b88e), dusk * 0.55);
      this._key.intensity = 0.16 + 0.74 * day; this._key.color.copy(mix(0x9fb4d8, 0xfff3e0, day).lerp(C(0xffb27a), dusk * 0.6));
      this._hemi.intensity = 0.3 + 0.36 * day; this._hemi.color.copy(mix(0x8fa3c4, 0xe2ebf3, day));
      const dk = this._studio ? 0 : this._dark || 0; if (dk) { zen.lerp(C(0x3c444e), dk * 0.75); hor.lerp(C(0x656d76), dk * 0.75); this._key.intensity *= 1 - 0.62 * dk; this._hemi.intensity *= 1 - 0.28 * dk; } this._hemiBase = this._hemi.intensity;
      const p = this._envSky.attributes.position, col = this._envSky.attributes.color, c = new T.Color();
      for (let i = 0; i < p.count; i++) { const t = Math.max(0, p.getY(i) / (this._skyR || 20000)); c.copy(hor).lerp(zen, Math.pow(t, 0.5)); col.setXYZ(i, c.r, c.g, c.b); }
      col.needsUpdate = true;
      this._scene.background = this._studio ? new T.Color(0xf1f2f3) : hor.clone(); if (this._scene.fog) this._scene.fog.color.copy(hor).lerp(C(cfg.haze), 0.4 * day);
      this._shadowKey = null;
    }

    _apply() {
      if (this._thumbing) return;
      const s = this._st;
      const fxOn = !(s.isolate && s.sel);
      this._selHasMain = !!(s.isolate && s.sel && this._meshes.some((m) => !m.userData.isRep && !m.userData.isCtx && m.userData.chain && m.userData.chain.includes(s.sel)));
      (this._fx || []).forEach((o) => { o.visible = fxOn && !o.userData.keepHidden; }); (this._flows || []).forEach((f) => { f.m.visible = fxOn; });
      for (const m of this._meshes) {
        const u = m.userData;
        if (u.isGround) {
          const op = s.subsurface ? 0.16 : 1;
          [].concat(m.material).forEach((mt) => { mt.opacity = op; mt.depthWrite = op === 1; });
          if (u.gEdge) u.gEdge.visible = s.subsurface;
          m.visible = !this._studio; m.castShadow = false; continue;
        }
        const mat = m.material, b = u.b;
        const inSel = !!s.sel && u.chain.includes(s.sel);
        const inHov = !inSel && !!s.hover && u.chain.includes(s.hover);
        let vis = true, op = b.opacity, ghost = false;
        if (s.hidden.size && u.chain.some((c) => s.hidden.has(c))) vis = false;
        if (s.isolate && s.sel && (!inSel || (u.isRep && this._selHasMain))) vis = false;
        if ((s.internals || (this._autoGhost && this._autoGhost.has(u.leaf))) && u.isShell && !inSel) { op = 0.07; ghost = true; }
        if (s.fade && s.sel && !inSel) { op = Math.min(op, 0.1); ghost = true; }
        m.visible = vis;
        const tinted = !!s.tint && !u.isCtx;
        mat.color.setHex(tinted ? (s.tint[u.leaf] ?? NEUTRAL) : b.color);
        const wantMap = tinted ? null : b.map;
        if (mat.map !== wantMap) { mat.map = wantMap; mat.needsUpdate = true; }
        mat.opacity = op; mat.transparent = op < 1 || b.transparent; mat.depthWrite = !ghost;
        const hs = inSel && !this._studio; mat.emissive.setHex(hs || inHov ? SEL : 0); mat.emissiveIntensity = hs ? 0.42 : inHov ? 0.16 : 0;
        u.ghost = ghost; m.castShadow = !ghost && u.cast;
        if (u.edge) {
          const em = u.edge.material;
          em.opacity = ghost ? (u.isShell ? 0.2 : 0.05) : hs ? 0.55 : u.edgeBase;
          em.color.setHex(hs ? 0x167a42 : EDGE);
        }
      }
    }

    // ---------- camera ----------
    reset(instant) {
      if (!this._home) return;
      const h = this._home;
      Object.assign(this._sphT, { theta: h.theta, phi: h.phi, r: h.r }); this._tgtT.copy(h.target);
      if (instant) { Object.assign(this._sph, this._sphT); this._tgt.copy(this._tgtT); }
    }
    _box(id, onlyVisible) {
      const T = this._T, box = new T.Box3(), v = new T.Vector3(), mx = new T.Matrix4(); let any = false;
      const noRep = id && this._meshes.some((m) => !m.userData.isRep && !m.userData.isCtx && m.userData.chain && m.userData.chain.includes(id));
      for (const m of this._meshes) {
        const u = m.userData;
        if (u.isGround || u.isCtx || (noRep && u.isRep) || (onlyVisible && !m.visible)) continue;
        if (id && !u.chain.includes(id)) continue;
        if (m.isInstancedMesh) {
          if (!m.geometry.boundingSphere) m.geometry.computeBoundingSphere();
          const r0 = m.geometry.boundingSphere.radius;
          for (let i = 0; i < m.count; i++) { m.getMatrixAt(i, mx); v.setFromMatrixPosition(mx).applyMatrix4(m.matrixWorld); box.expandByPoint(v.clone().addScalar(r0)); box.expandByPoint(v.addScalar(-r0)); }
        } else box.expandByObject(m);
        any = true;
      }
      return any ? box : null;
    }
    setPaused(p) { this._paused = !!p; }
    frame(id) {
      const T = this._T, box = this._box(id, true); if (!box) return;
      const inst = this._meshes.filter((m) => m.isInstancedMesh && m.visible && !m.userData.isCtx && (!id || m.userData.chain.includes(id)));
      if (inst.length) {
        let r0 = 0; inst.forEach((m) => { if (!m.geometry.boundingSphere) m.geometry.computeBoundingSphere(); r0 = Math.max(r0, m.geometry.boundingSphere.radius); });
        if (box.getSize(new T.Vector3()).length() > r0 * 14) {
          const ref = this._lastPoint && box.clone().expandByScalar(1).containsPoint(this._lastPoint) ? this._lastPoint : this._tgtT.clone();
          let best = null, bd = Infinity; const mx = new T.Matrix4(), q = new T.Vector3();
          inst.forEach((m) => { for (let i = 0; i < m.count; i++) { m.getMatrixAt(i, mx); q.setFromMatrixPosition(mx).applyMatrix4(m.matrixWorld); const d = q.distanceToSquared(ref); if (d < bd) { bd = d; best = q.clone(); } } });
          if (best) { const fv = (this._cam.fov * Math.PI) / 180; this._tgtT.copy(best); this._sphT.r = Math.max(r0 * 3.2, 0.8) / Math.sin(fv / 2); return; }
        }
      }
      const sph = box.getBoundingSphere(new T.Sphere());
      const fov = this._cam.fov * Math.PI / 180, hf = 2 * Math.atan(Math.tan(fov / 2) * this._cam.aspect);
      const r = Math.max(sph.radius, 0.2) / Math.sin(Math.min(fov, hf) / 2);
      this._tgtT.copy(sph.center); this._sphT.r = r * 1.05;
    }

    _tick() {
      const now = performance.now(), dt = Math.min(0.25, ((now - (this._last || now)) / 1000) || 0.016); this._last = now;
      const k = 1 - Math.exp(-dt * 9), ke = 1 - Math.exp(-dt * 5.5), kc = 1 - Math.exp(-dt * 7);
      const s = this._sph, t = this._sphT;
      s.theta += (t.theta - s.theta) * k; s.phi += (t.phi - s.phi) * k; s.r += (t.r - s.r) * k;
      this._tgt.lerp(this._tgtT, k);
      const ex = this._st.explode; let moved = false;
      if (this._ex !== ex) {
        this._ex += (ex - this._ex) * ke; if (Math.abs(ex - this._ex) < 0.001) this._ex = ex;
        for (const g of this._exGroups) g.position.copy(g.userData.base).addScaledVector(g.userData.ex, this._ex);
        moved = true;
      }
      if (this._ctlT) {
        let ch = moved;
        for (const id in this._ctlT) {
          const d = this._ctlT[id] - this._ctl[id];
          if (d !== 0) { this._ctl[id] = Math.abs(d) < 0.05 ? this._ctlT[id] : this._ctl[id] + d * kc; ch = true; }
        }
        if (ch) this._updaters.forEach((f) => f(this._ctl));
        if (this._framers.length) this._framers.forEach((f) => f(dt, this._ctl, this._sim || null)); // pause freezes the clock and flows, not the rotor
      }
      for (const f of this._flows || []) {
        const on = f.rate > 0.01 && f.m.visible;
        if (on && !this._paused) f.phase = (f.phase + dt * f.speed * Math.min(1.6, 0.35 + f.rate)) % f.sp;
        let seg = 1;
        for (let i = 0; i < f.n; i++) {
          const d = i * f.sp + f.phase;
          while (seg < f.L.length - 1 && f.L[seg] < d) seg++;
          const a = f.P[seg - 1], b = f.P[seg], t = (d - f.L[seg - 1]) / Math.max(1e-6, f.L[seg] - f.L[seg - 1]);
          f.v.lerpVectors(a, b, Math.min(1, Math.max(0, t)));
          const sc = on ? 0.7 + 0.5 * Math.min(1, f.rate) : 0.0001;
          f.mx.makeScale(sc, sc, sc).setPosition(f.v); f.m.setMatrixAt(i, f.mx);
        }
        f.m.instanceMatrix.needsUpdate = true;
      }
      this._wxStep(dt);
      // shadow frustum follows the view so close-ups stay crisp
      const sk = Math.round(Math.log(s.r) * 6) + ':' + Math.round(this._tgt.x / (s.r * 0.15)) + ':' + Math.round(this._tgt.y / (s.r * 0.15)) + ':' + Math.round(this._tgt.z / (s.r * 0.15));
      if (sk !== this._shadowKey && this._bounds) {
        this._shadowKey = sk;
        const L = Math.min(Math.max(s.r * 0.75, 3), this._bounds.radius * 1.3), c = this._tgt;
        this._key.position.copy(c).addScaledVector(this._sun, L * 4); this._key.target.position.copy(c);
        Object.assign(this._key.shadow.camera, { left: -L, right: L, top: L, bottom: -L, near: L * 0.5, far: L * 9 });
        this._key.shadow.camera.updateProjectionMatrix();
      }
      const cam = this._cam, g = this._tgt;
      cam.position.set(g.x + s.r * Math.sin(s.phi) * Math.sin(s.theta), g.y + s.r * Math.cos(s.phi), g.z + s.r * Math.sin(s.phi) * Math.cos(s.theta));
      if (cam.position.y < 0.4) cam.position.y = 0.4;
      cam.lookAt(g);
      if (this.clientWidth > 10) this._rd.render(this._scene, cam);
    }

    // ---------- input ----------
    _hit(e) {
      const r = this._rd.domElement.getBoundingClientRect();
      this._ptr.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
      this._ray.setFromCamera(this._ptr, this._cam);
      const hits = this._ray.intersectObjects(this._pick, false);
      for (const h of hits) { const u = h.object.userData; if (h.object.visible && !u.ghost) { this._lastPoint = h.point.clone(); return h.object; } }
      return null;
    }
    _targetFor(chain) {
      const sel = this._st.sel, i = sel ? chain.indexOf(sel) : -1;
      if (i === 0) return chain[0];
      if (i > 0) return chain[i - 1];
      return chain[Math.max(0, chain.length - 3)];
    }
    _bind(el) {
      let drag = null, space = false;
      el.addEventListener('contextmenu', (e) => e.preventDefault());
      window.addEventListener('keydown', (e) => { if (e.code === 'Space' && e.target === document.body) space = true; });
      window.addEventListener('keyup', (e) => { if (e.code === 'Space') space = false; });
      el.addEventListener('pointerdown', (e) => {
        el.setPointerCapture(e.pointerId);
        drag = { x: e.clientX, y: e.clientY, sx: e.clientX, sy: e.clientY, pan: e.button === 2 || e.shiftKey || space, moved: false };
      });
      el.addEventListener('pointermove', (e) => {
        if (drag) {
          const dx = e.clientX - drag.x, dy = e.clientY - drag.y; drag.x = e.clientX; drag.y = e.clientY;
          if (Math.abs(e.clientX - drag.sx) + Math.abs(e.clientY - drag.sy) > 4) drag.moved = true;
          if (drag.pan) {
            const T = this._T, cam = this._cam, k = this._sphT.r * 0.0016;
            const right = new T.Vector3().setFromMatrixColumn(cam.matrix, 0), up = new T.Vector3().setFromMatrixColumn(cam.matrix, 1);
            this._tgtT.addScaledVector(right, -dx * k).addScaledVector(up, dy * k);
          } else {
            this._sphT.theta -= dx * 0.006;
            this._sphT.phi = Math.min(Math.PI - 0.08, Math.max(0.08, this._sphT.phi - dy * 0.006));
          }
          if (drag.moved) { this._tip.style.display = 'none'; return; }
        }
        const o = this._hit(e);
        const id = o ? this._targetFor(o.userData.chain) : null;
        if (id !== this._st.hover) { this._st.hover = id; this._apply(); }
        el.style.cursor = id ? 'pointer' : drag ? 'grabbing' : 'grab';
        if (id) {
          const r = this.getBoundingClientRect(), L = this._labels[id] || {};
          this._tip.innerHTML = '<div>' + (L.name || id) + '</div>' + (L.sub ? '<div style="color:#737373;font-weight:400">' + L.sub + '</div>' : '');
          this._tip.style.display = 'block';
          this._tip.style.left = Math.min(e.clientX - r.left + 14, r.width - 200) + 'px';
          this._tip.style.top = (e.clientY - r.top + 16) + 'px';
        } else this._tip.style.display = 'none';
      });
      el.addEventListener('pointerleave', () => { this._tip.style.display = 'none'; if (this._st.hover) { this._st.hover = null; this._apply(); } });
      el.addEventListener('pointerup', (e) => {
        const d = drag; drag = null;
        if (!d || d.moved || e.button !== 0) return;
        const o = this._hit(e);
        const id = o ? this._targetFor(o.userData.chain) : null;
        this.dispatchEvent(new CustomEvent('sv-select', { bubbles: true, composed: true, detail: { id } }));
      });
      el.addEventListener('dblclick', (e) => {
        const o = this._hit(e); if (!o) return;
        const id = this._st.sel && o.userData.chain.includes(this._st.sel) ? this._st.sel : this._targetFor(o.userData.chain);
        this.frame(id);
      });
      el.addEventListener('wheel', (e) => {
        e.preventDefault();
        const T = this._T, f = Math.exp(Math.max(-60, Math.min(60, e.deltaY)) * 0.0022);
        const B = this._bounds ? this._bounds.radius : 5, minR = Math.max(0.3, B * 0.004), maxR = B * 10;
        const nr = Math.min(maxR, Math.max(minR, this._sphT.r * f)), a = nr / this._sphT.r;
        const r = el.getBoundingClientRect();
        this._ptr.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
        this._ray.setFromCamera(this._ptr, this._cam);
        const n = new T.Vector3().subVectors(this._cam.position, this._tgt).normalize();
        const p = new T.Vector3();
        if (this._ray.ray.intersectPlane(new T.Plane().setFromNormalAndCoplanarPoint(n, this._tgtT), p)) this._tgtT.lerp(p, 1 - a);
        this._sphT.r = nr;
      }, { passive: false });
    }

    // ---------- thumbnails ----------
    async thumbnails(ids, w = 320, h = 200) {
      await waitFor(() => this._loaded);
      const T = this._T;
      if (!this._trd) { this._trd = new T.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true, logarithmicDepthBuffer: true }); this._trd.shadowMap.enabled = true; this._trd.shadowMap.type = T.PCFSoftShadowMap; }
      const rd = this._trd; rd.setPixelRatio(2); rd.setSize(w, h, false);
      const cam = new T.PerspectiveCamera(28, w / h, 0.05, 40000);
      const bg = this._scene.background, fog = this._scene.fog, out = {};
      this._thumbing = true; this._scene.background = null; this._scene.fog = null; this._envG.visible = false;
      (this._fx || []).forEach((o) => { o.visible = false; }); (this._flows || []).forEach((f) => { f.m.visible = false; });
      const tv = (this._model && this._model.thumbView) || {}, keyPos = this._key.position.clone(), keyTgt = this._key.target.position.clone(), sc = this._key.shadow.camera, scb = [sc.left, sc.right, sc.top, sc.bottom, sc.near, sc.far];
      for (const id of ids) {
        const pv = (tv.per && tv.per[id]) || {};
        const box = pv.box ? new T.Box3(new T.Vector3(...pv.box[0]), new T.Vector3(...pv.box[1])) : this._box(id, false); if (!box) continue;
        for (const m of this._meshes) {
          const u = m.userData, on = !u.isGround && !u.isCtx && u.chain.includes(id);
          m.visible = on; if (!on) continue;
          const gh = (pv.ghost || tv.ghost || []).includes(u.leaf) && u.leaf !== id;
          const mat = m.material; mat.color.setHex(u.b.color); mat.opacity = gh ? 0.14 : u.b.opacity; mat.transparent = gh || u.b.transparent; mat.depthWrite = !gh; mat.emissive.setHex(0);
          if (mat.map !== u.b.map) { mat.map = u.b.map; mat.needsUpdate = true; }
          if (u.edge) { u.edge.material.opacity = u.edgeBase; u.edge.material.color.setHex(EDGE); }
        }
        const sp = box.getBoundingSphere(new T.Sphere()), c = sp.center;
        const r = Math.max(sp.radius, 0.05) / Math.sin((28 * Math.PI / 180) / 2) * 0.86;
        const th = pv.theta ?? tv.theta ?? this._home.theta, ph = pv.phi ?? tv.phi ?? 1.05;
        cam.position.set(c.x + r * Math.sin(ph) * Math.sin(th), c.y + r * Math.cos(ph), c.z + r * Math.sin(ph) * Math.cos(th));
        cam.lookAt(c);
        const L = sp.radius * 1.2;
        this._key.position.copy(c).addScaledVector(this._sun, L * 4); this._key.target.position.copy(c);
        Object.assign(sc, { left: -L, right: L, top: L, bottom: -L, near: L * 0.5, far: L * 9 }); sc.updateProjectionMatrix();
        rd.render(this._scene, cam);
        out[id] = rd.domElement.toDataURL('image/png');
      }
      this._key.position.copy(keyPos); this._key.target.position.copy(keyTgt);
      [sc.left, sc.right, sc.top, sc.bottom, sc.near, sc.far] = scb; sc.updateProjectionMatrix();
      this._scene.background = bg; this._scene.fog = fog; this._envG.visible = true;
      this._thumbing = false; this._apply();
      return out;
    }
  }
  if (!customElements.get('subsystem-viewer')) customElements.define('subsystem-viewer', SubsystemViewer);
})();
