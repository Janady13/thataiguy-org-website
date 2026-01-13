/* Three.js scene: double-helix of agent nodes */
(() => {
  const canvas = document.getElementById('scene');
  if (!canvas || !window.THREE) return;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
  camera.position.set(0, 0, 16);

  const resize = () => {
    const w = canvas.clientWidth; const h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h || 1; camera.updateProjectionMatrix();
  };
  window.addEventListener('resize', resize, { passive: true });
  resize();

  // Lights
  scene.add(new THREE.AmbientLight(0xffffff, 0.5));
  const dir = new THREE.DirectionalLight(0x88ccff, 1.2);
  dir.position.set(3, 4, 2);
  scene.add(dir);

  // Helix geometry
  const group = new THREE.Group();
  scene.add(group);
  const agents = 88;
  const radius = 4.0; const turns = 3.0; const height = 10.0;
  const materialA = new THREE.MeshStandardMaterial({ color: 0x6ee7ff, roughness: 0.25, metalness: 0.6 });
  const materialB = new THREE.MeshStandardMaterial({ color: 0x8b5cf6, roughness: 0.25, metalness: 0.6 });
  const geo = new THREE.SphereGeometry(0.14, 20, 20);

  for (let i = 0; i < agents; i++) {
    const t = i / agents; // 0..1
    const a = t * turns * Math.PI * 2;
    const y = (t - 0.5) * height;
    const x1 = Math.cos(a) * radius, z1 = Math.sin(a) * radius;
    const x2 = Math.cos(a + Math.PI) * radius, z2 = Math.sin(a + Math.PI) * radius;
    const m1 = new THREE.Mesh(geo, materialA);
    const m2 = new THREE.Mesh(geo, materialB);
    m1.position.set(x1, y, z1); m2.position.set(x2, y, z2);
    group.add(m1, m2);
  }

  // Thin connecting rails
  const railMat = new THREE.MeshBasicMaterial({ color: 0x5eead4, transparent: true, opacity: 0.2 });
  const cylGeo = new THREE.CylinderGeometry(0.02, 0.02, height, 16);
  const r1 = new THREE.Mesh(cylGeo, railMat); r1.position.set(radius, 0, 0); r1.rotation.z = Math.PI / 2;
  const r2 = new THREE.Mesh(cylGeo, railMat); r2.position.set(-radius, 0, 0); r2.rotation.z = Math.PI / 2;
  group.add(r1, r2);

  const clock = new THREE.Clock();
  function tick() {
    const t = clock.getElapsedTime();
    group.rotation.y = t * 0.25;
    dir.position.x = Math.cos(t * 0.5) * 6;
    dir.position.z = Math.sin(t * 0.5) * 6;
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }
  tick();
})();

