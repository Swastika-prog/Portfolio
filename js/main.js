/* =====================================================
   Swastika Khatua — AI/ML Engineer Portfolio
   Plexus background · Three.js neural globe · reveals
   ===================================================== */

/* ---------- scroll reveals ---------- */
(function initReveals() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      en.target.classList.add('in');
      io.unobserve(en.target);
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.rv').forEach((el) => io.observe(el));
})();

/* ---------- full-page 2D plexus background ---------- */
(function startPlexus() {
  const canvas = document.getElementById('plexus');
  const ctx = canvas.getContext('2d');
  const DPR = Math.min(window.devicePixelRatio || 1, 2);
  let W = 0, H = 0, pts = [];

  function resize() {
    W = window.innerWidth;
    H = window.innerHeight;
    if (!W || !H) { setTimeout(resize, 150); return; }
    canvas.width = W * DPR;
    canvas.height = H * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    const count = Math.min(110, Math.round(W * H / 16000));
    pts = Array.from({ length: count }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
      r: 1 + Math.random() * 1.6
    }));
  }
  resize();
  window.addEventListener('resize', resize);
  window.addEventListener('load', resize);

  function tick() {
    requestAnimationFrame(tick);
    ctx.clearRect(0, 0, W, H);
    for (const p of pts) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
    }
    ctx.lineWidth = 0.7;
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 15000) {
          const a = (1 - d2 / 15000) * 0.34;
          ctx.strokeStyle = 'rgba(59,130,246,' + a.toFixed(3) + ')';
          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.stroke();
        }
      }
    }
    for (const p of pts) {
      ctx.fillStyle = 'rgba(96,165,250,.8)';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  requestAnimationFrame(tick);
})();

/* ---------- Three.js neural globe (hero, top right) ---------- */
(function startGlobe() {
  const GLOBE_COLOR = '#3B82F6';

  function boot() {
    if (!window.THREE) { setTimeout(boot, 120); return; }
    const canvas = document.getElementById('globe');
    const THREE = window.THREE;
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, 2, 0.1, 100);
    camera.position.z = 7.5;

    const group = new THREE.Group();
    scene.add(group);

    // neural sphere: fibonacci-distributed points
    const N = 220;
    const positions = new Float32Array(N * 3);
    const pts = [];
    const R = 3.1;
    for (let i = 0; i < N; i++) {
      const phi = Math.acos(1 - 2 * (i + 0.5) / N);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const x = R * Math.sin(phi) * Math.cos(theta);
      const y = R * Math.sin(phi) * Math.sin(theta) * 0.85;
      const z = R * Math.cos(phi);
      positions[i * 3] = x; positions[i * 3 + 1] = y; positions[i * 3 + 2] = z;
      pts.push(new THREE.Vector3(x, y, z));
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    group.add(new THREE.Points(geo, new THREE.PointsMaterial({
      color: GLOBE_COLOR, size: 0.055, transparent: true, opacity: 0.9
    })));

    // connections between near neighbors
    const linePos = [];
    for (let i = 0; i < N; i++) {
      for (let j = i + 1; j < N; j++) {
        if (pts[i].distanceTo(pts[j]) < 0.95) {
          linePos.push(pts[i].x, pts[i].y, pts[i].z, pts[j].x, pts[j].y, pts[j].z);
        }
      }
    }
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(linePos), 3));
    group.add(new THREE.LineSegments(lineGeo, new THREE.LineBasicMaterial({
      color: GLOBE_COLOR, transparent: true, opacity: 0.16
    })));

    // inner wireframe core
    const core = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.15, 1),
      new THREE.MeshBasicMaterial({ color: GLOBE_COLOR, wireframe: true, transparent: true, opacity: 0.25 })
    );
    group.add(core);

    group.position.x = 4.6;
    group.position.y = 1.4;
    group.scale.setScalar(0.8);

    const mouse = { x: 0, y: 0 };
    const hero = canvas.parentElement;
    hero.addEventListener('mousemove', (e) => {
      const r = hero.getBoundingClientRect();
      mouse.x = ((e.clientX - r.left) / r.width - 0.5) * 2;
      mouse.y = ((e.clientY - r.top) / r.height - 0.5) * 2;
    });

    function resize() {
      const r = canvas.getBoundingClientRect();
      if (!r.width || !r.height) { setTimeout(resize, 150); return; }
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      renderer.setSize(r.width, r.height, false);
      renderer.setPixelRatio(dpr);
      camera.aspect = r.width / Math.max(1, r.height);
      camera.updateProjectionMatrix();
    }
    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('load', resize);

    let visible = true;
    new IntersectionObserver((es) => { visible = es[0].isIntersecting; }).observe(canvas);

    function animate(t) {
      requestAnimationFrame(animate);
      if (!visible) return;
      group.rotation.y = t * 0.00012 + mouse.x * 0.25;
      group.rotation.x = Math.sin(t * 0.00008) * 0.15 + mouse.y * 0.18;
      core.rotation.y = -t * 0.0004;
      core.rotation.z = t * 0.0002;
      renderer.render(scene, camera);
    }
    requestAnimationFrame(animate);
  }
  boot();
})();
