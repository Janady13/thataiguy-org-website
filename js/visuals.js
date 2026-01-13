/* ============================================
   THAT AI GUY - Advanced 3D Visualizations
   ============================================ */

(() => {
  if (!window.THREE) return;

  // Main Scene
  const canvas = document.getElementById('scene');
  if (canvas) initMainScene(canvas);

  function initMainScene(canvas) {
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
    camera.position.set(0, 0, 18);

    const resize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h || 1;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', resize, { passive: true });
    resize();

    // Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    const dir = new THREE.DirectionalLight(0x00f5d4, 1.2);
    dir.position.set(5, 5, 5);
    scene.add(dir);

    const purpleLight = new THREE.PointLight(0x7b61ff, 0.8, 25);
    purpleLight.position.set(-6, 4, 3);
    scene.add(purpleLight);

    const pinkLight = new THREE.PointLight(0xff6b6b, 0.6, 20);
    pinkLight.position.set(6, -4, 3);
    scene.add(pinkLight);

    // Main group
    const group = new THREE.Group();
    scene.add(group);

    // DNA Helix parameters
    const agents = 100;
    const radius = 4.0;
    const turns = 3.5;
    const height = 12.0;

    // Materials
    const materialA = new THREE.MeshStandardMaterial({
      color: 0x00f5d4,
      roughness: 0.2,
      metalness: 0.7,
      emissive: 0x00f5d4,
      emissiveIntensity: 0.05
    });

    const materialB = new THREE.MeshStandardMaterial({
      color: 0x7b61ff,
      roughness: 0.2,
      metalness: 0.7,
      emissive: 0x7b61ff,
      emissiveIntensity: 0.05
    });

    const basePairColors = [0xff6b6b, 0x00e676, 0x4f8cff, 0xffc107];

    const geo = new THREE.SphereGeometry(0.16, 20, 20);
    const smallGeo = new THREE.SphereGeometry(0.08, 12, 12);

    const nodesA = [];
    const nodesB = [];

    // Create helix
    for (let i = 0; i < agents; i++) {
      const t = i / agents;
      const a = t * turns * Math.PI * 2;
      const y = (t - 0.5) * height;

      const x1 = Math.cos(a) * radius;
      const z1 = Math.sin(a) * radius;
      const x2 = Math.cos(a + Math.PI) * radius;
      const z2 = Math.sin(a + Math.PI) * radius;

      const m1 = new THREE.Mesh(geo, materialA);
      const m2 = new THREE.Mesh(geo, materialB);
      m1.position.set(x1, y, z1);
      m2.position.set(x2, y, z2);
      group.add(m1, m2);
      nodesA.push(m1);
      nodesB.push(m2);

      // Base pairs
      if (i % 4 === 0) {
        const bpMat = new THREE.MeshStandardMaterial({
          color: basePairColors[i % 4],
          roughness: 0.3,
          metalness: 0.5
        });
        for (let j = 1; j < 5; j++) {
          const lerpT = j / 5;
          const bp = new THREE.Mesh(smallGeo, bpMat);
          bp.position.set(
            x1 + (x2 - x1) * lerpT,
            y,
            z1 + (z2 - z1) * lerpT
          );
          bp.scale.setScalar(0.6 + Math.sin(lerpT * Math.PI) * 0.4);
          group.add(bp);
        }
      }
    }

    // Backbone rails
    const createCurve = (offset) => {
      const pts = [];
      for (let i = 0; i <= 80; i++) {
        const t = i / 80;
        const a = t * turns * Math.PI * 2 + offset;
        const y = (t - 0.5) * height;
        pts.push(new THREE.Vector3(Math.cos(a) * radius, y, Math.sin(a) * radius));
      }
      return new THREE.CatmullRomCurve3(pts);
    };

    const tubeMat = new THREE.MeshStandardMaterial({
      color: 0x00f5d4,
      transparent: true,
      opacity: 0.3,
      roughness: 0.4
    });

    const tube1 = new THREE.Mesh(new THREE.TubeGeometry(createCurve(0), 150, 0.03, 8, false), tubeMat);
    const tube2 = new THREE.Mesh(new THREE.TubeGeometry(createCurve(Math.PI), 150, 0.03, 8, false), tubeMat.clone());
    tube2.material.color.set(0x7b61ff);
    group.add(tube1, tube2);

    // Particles
    const particleCount = 300;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const pColors = [new THREE.Color(0x00f5d4), new THREE.Color(0x7b61ff), new THREE.Color(0xff6b6b)];

    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 8 + Math.random() * 10;
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
      const c = pColors[Math.floor(Math.random() * 3)];
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.06,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Animation
    const clock = new THREE.Clock();

    function tick() {
      const t = clock.getElapsedTime();

      group.rotation.y = t * 0.15;
      group.position.y = Math.sin(t * 0.4) * 0.3;

      dir.position.x = Math.cos(t * 0.3) * 8;
      dir.position.z = Math.sin(t * 0.3) * 8;

      purpleLight.position.x = Math.sin(t * 0.4) * 8;
      pinkLight.position.z = Math.cos(t * 0.35) * 8;

      // Pulse nodes
      nodesA.forEach((n, i) => n.scale.setScalar(1 + Math.sin(t * 2 + i * 0.1) * 0.08));
      nodesB.forEach((n, i) => n.scale.setScalar(1 + Math.sin(t * 2 + i * 0.1 + Math.PI) * 0.08));

      // Animate particles
      const pos = particleGeo.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        pos[i * 3 + 1] += Math.sin(t + i) * 0.002;
      }
      particleGeo.attributes.position.needsUpdate = true;
      particles.rotation.y = t * 0.02;

      renderer.render(scene, camera);
      requestAnimationFrame(tick);
    }

    tick();
  }

  // Mini scenes for science sections
  const miniCanvases = [
    { id: 'dna-canvas', type: 'dna' },
    { id: 'rna-canvas', type: 'rna' },
    { id: 'chromo-canvas', type: 'chromo' },
    { id: 'contact-canvas', type: 'network' }
  ];

  miniCanvases.forEach(({ id, type }) => {
    const canvas = document.getElementById(id);
    if (canvas) initMiniScene(canvas, type);
  });

  function initMiniScene(canvas, type) {
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    camera.position.z = 10;

    const resize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (w && h) {
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      }
    };

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();

    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const light = new THREE.DirectionalLight(0x00f5d4, 1);
    light.position.set(3, 3, 5);
    scene.add(light);

    const group = new THREE.Group();
    scene.add(group);

    if (type === 'dna') createDNA(group);
    else if (type === 'rna') createRNA(group);
    else if (type === 'chromo') createChromo(group);
    else if (type === 'network') createNetwork(group);

    const clock = new THREE.Clock();

    function animate() {
      const t = clock.getElapsedTime();
      group.rotation.y = t * 0.3;
      group.rotation.x = Math.sin(t * 0.2) * 0.1;
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }

    animate();
  }

  function createDNA(group) {
    const mat1 = new THREE.MeshStandardMaterial({ color: 0x00f5d4, roughness: 0.3, metalness: 0.6 });
    const mat2 = new THREE.MeshStandardMaterial({ color: 0x7b61ff, roughness: 0.3, metalness: 0.6 });
    const geo = new THREE.SphereGeometry(0.2, 16, 16);

    for (let i = 0; i < 30; i++) {
      const t = i / 30;
      const a = t * Math.PI * 4;
      const y = (t - 0.5) * 8;
      const m1 = new THREE.Mesh(geo, mat1);
      const m2 = new THREE.Mesh(geo, mat2);
      m1.position.set(Math.cos(a) * 2, y, Math.sin(a) * 2);
      m2.position.set(Math.cos(a + Math.PI) * 2, y, Math.sin(a + Math.PI) * 2);
      group.add(m1, m2);
    }
  }

  function createRNA(group) {
    const mat = new THREE.MeshStandardMaterial({ color: 0x00e676, roughness: 0.3, metalness: 0.6 });
    const geo = new THREE.SphereGeometry(0.15, 16, 16);

    for (let i = 0; i < 40; i++) {
      const t = i / 40;
      const a = t * Math.PI * 3;
      const wobble = Math.sin(t * Math.PI * 4) * 0.5;
      const y = (t - 0.5) * 8;
      const m = new THREE.Mesh(geo, mat);
      m.position.set(Math.cos(a) * (1.5 + wobble), y, Math.sin(a) * (1.5 + wobble));
      group.add(m);
    }
  }

  function createChromo(group) {
    const mat = new THREE.MeshStandardMaterial({ color: 0xff6b6b, roughness: 0.3, metalness: 0.6 });
    const geo = new THREE.SphereGeometry(0.2, 16, 16);

    for (let i = 0; i < 25; i++) {
      const t = i / 25;
      const y = (t - 0.5) * 6;
      const spread = Math.abs(y) * 0.4;
      const m1 = new THREE.Mesh(geo, mat);
      const m2 = new THREE.Mesh(geo, mat);
      m1.position.set(-spread - 0.3, y, 0);
      m2.position.set(spread + 0.3, y, 0);
      group.add(m1, m2);
    }
  }

  function createNetwork(group) {
    const mat = new THREE.MeshStandardMaterial({ color: 0x00f5d4, roughness: 0.3, metalness: 0.6 });
    const lineMat = new THREE.LineBasicMaterial({ color: 0x7b61ff, transparent: true, opacity: 0.3 });
    const geo = new THREE.SphereGeometry(0.25, 16, 16);
    const nodes = [];

    for (let i = 0; i < 15; i++) {
      const m = new THREE.Mesh(geo, mat);
      m.position.set((Math.random() - 0.5) * 6, (Math.random() - 0.5) * 6, (Math.random() - 0.5) * 6);
      group.add(m);
      nodes.push(m.position);
    }

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (nodes[i].distanceTo(nodes[j]) < 4) {
          const lineGeo = new THREE.BufferGeometry().setFromPoints([nodes[i], nodes[j]]);
          group.add(new THREE.Line(lineGeo, lineMat));
        }
      }
    }
  }

  // Particle background
  const particlesBg = document.getElementById('particles-bg');
  if (particlesBg) initParticlesBg(particlesBg);

  function initParticlesBg(canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    const colors = ['rgba(0,245,212,0.4)', 'rgba(123,97,255,0.4)', 'rgba(255,107,107,0.3)'];

    class Particle {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.pulse = Math.random() * Math.PI * 2;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.pulse += 0.02;
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
      }
      draw() {
        const opacity = 0.3 + Math.sin(this.pulse) * 0.3;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color.replace('0.4)', `${opacity})`).replace('0.3)', `${opacity})`);
        ctx.fill();
      }
    }

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particles = [];
      const count = Math.min(Math.floor((canvas.width * canvas.height) / 20000), 100);
      for (let i = 0; i < count; i++) particles.push(new Particle());
    }

    function drawLines() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0,245,212,${(1 - dist / 150) * 0.1})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawLines();
      particles.forEach(p => { p.update(); p.draw(); });
      requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resize);
    resize();
    animate();
  }
})();
