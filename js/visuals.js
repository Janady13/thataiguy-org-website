/* ============================================
   THE HIVE AGI - Advanced 3D Visualizations
   Scientific Double-Helix with Neural Networks
   ============================================ */

(() => {
  if (!window.THREE) return;

  // ============================================
  // MAIN HERO SCENE - DNA Double Helix
  // ============================================
  const mainCanvas = document.getElementById('scene');
  if (mainCanvas) {
    initMainScene(mainCanvas);
  }

  function initMainScene(canvas) {
    // Renderer setup with high quality settings
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
    camera.position.set(0, 0, 20);

    // Resize handler
    const resize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h || 1;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', resize, { passive: true });
    resize();

    // Enhanced Lighting System
    const ambientLight = new THREE.AmbientLight(0x404060, 0.4);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0x88ccff, 1.5);
    mainLight.position.set(5, 5, 5);
    scene.add(mainLight);

    const purpleLight = new THREE.PointLight(0x8b5cf6, 1.0, 30);
    purpleLight.position.set(-8, 3, 5);
    scene.add(purpleLight);

    const cyanLight = new THREE.PointLight(0x06b6d4, 1.0, 30);
    cyanLight.position.set(8, -3, 5);
    scene.add(cyanLight);

    // Create main group for all objects
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // ============================================
    // DNA DOUBLE HELIX STRUCTURE
    // ============================================
    const helixGroup = new THREE.Group();
    mainGroup.add(helixGroup);

    // Helix parameters based on B-DNA geometry
    const agents = 120;
    const radius = 4.0;
    const turns = 4.0;
    const height = 14.0;
    const basePairSpacing = 0.34; // nm in real DNA

    // Materials for the two strands (complementary colors)
    const strandAMaterial = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,  // Cyan
      roughness: 0.2,
      metalness: 0.7,
      emissive: 0x06b6d4,
      emissiveIntensity: 0.1
    });

    const strandBMaterial = new THREE.MeshStandardMaterial({
      color: 0x8b5cf6,  // Purple
      roughness: 0.2,
      metalness: 0.7,
      emissive: 0x8b5cf6,
      emissiveIntensity: 0.1
    });

    // Base pair materials (A-T = red-green, G-C = blue-yellow)
    const basePairMaterials = [
      new THREE.MeshStandardMaterial({ color: 0xec4899, roughness: 0.3, metalness: 0.5 }), // A
      new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.3, metalness: 0.5 }), // T
      new THREE.MeshStandardMaterial({ color: 0x3b82f6, roughness: 0.3, metalness: 0.5 }), // G
      new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.3, metalness: 0.5 }), // C
    ];

    // Node geometry
    const nodeGeometry = new THREE.SphereGeometry(0.18, 24, 24);
    const smallNodeGeometry = new THREE.SphereGeometry(0.12, 16, 16);

    // Create helix strands
    const strand1Nodes = [];
    const strand2Nodes = [];

    for (let i = 0; i < agents; i++) {
      const t = i / agents;
      const angle = t * turns * Math.PI * 2;
      const y = (t - 0.5) * height;

      // Strand 1 position
      const x1 = Math.cos(angle) * radius;
      const z1 = Math.sin(angle) * radius;

      // Strand 2 position (180° offset - complementary strand)
      const x2 = Math.cos(angle + Math.PI) * radius;
      const z2 = Math.sin(angle + Math.PI) * radius;

      // Create strand 1 node
      const node1 = new THREE.Mesh(nodeGeometry, strandAMaterial);
      node1.position.set(x1, y, z1);
      helixGroup.add(node1);
      strand1Nodes.push(node1);

      // Create strand 2 node
      const node2 = new THREE.Mesh(nodeGeometry, strandBMaterial);
      node2.position.set(x2, y, z2);
      helixGroup.add(node2);
      strand2Nodes.push(node2);

      // Create base pair connections (every 3rd node)
      if (i % 3 === 0) {
        const basePairMat = basePairMaterials[i % 4];

        // Calculate midpoint and create connection
        const midX = (x1 + x2) / 2;
        const midZ = (z1 + z2) / 2;

        // Create base pair as small spheres along the connection
        const connectionPoints = 5;
        for (let j = 1; j < connectionPoints; j++) {
          const lerpT = j / connectionPoints;
          const bpX = x1 + (x2 - x1) * lerpT;
          const bpZ = z1 + (z2 - z1) * lerpT;

          const basePair = new THREE.Mesh(smallNodeGeometry, basePairMat);
          basePair.position.set(bpX, y, bpZ);
          basePair.scale.setScalar(0.6 + Math.sin(lerpT * Math.PI) * 0.4);
          helixGroup.add(basePair);
        }
      }
    }

    // Create backbone tubes for both strands
    const tubeRadius = 0.05;
    const tubeMaterial = new THREE.MeshStandardMaterial({
      color: 0x5eead4,
      roughness: 0.4,
      metalness: 0.3,
      transparent: true,
      opacity: 0.6
    });

    // Create curve points for tubes
    function createHelixCurve(offset) {
      const points = [];
      for (let i = 0; i <= 100; i++) {
        const t = i / 100;
        const angle = t * turns * Math.PI * 2 + offset;
        const y = (t - 0.5) * height;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        points.push(new THREE.Vector3(x, y, z));
      }
      return new THREE.CatmullRomCurve3(points);
    }

    const curve1 = createHelixCurve(0);
    const curve2 = createHelixCurve(Math.PI);

    const tubeGeometry1 = new THREE.TubeGeometry(curve1, 200, tubeRadius, 8, false);
    const tubeGeometry2 = new THREE.TubeGeometry(curve2, 200, tubeRadius, 8, false);

    const tube1 = new THREE.Mesh(tubeGeometry1, tubeMaterial);
    const tube2 = new THREE.Mesh(tubeGeometry2, tubeMaterial);
    helixGroup.add(tube1, tube2);

    // ============================================
    // PARTICLE SYSTEM - Floating Data Points
    // ============================================
    const particleCount = 500;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleSizes = new Float32Array(particleCount);
    const particleColors = new Float32Array(particleCount * 3);

    const colorCyan = new THREE.Color(0x06b6d4);
    const colorPurple = new THREE.Color(0x8b5cf6);
    const colorPink = new THREE.Color(0xec4899);

    for (let i = 0; i < particleCount; i++) {
      // Distribute particles in a sphere around the helix
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 8 + Math.random() * 12;

      particlePositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      particlePositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.6;
      particlePositions[i * 3 + 2] = r * Math.cos(phi);

      particleSizes[i] = Math.random() * 2 + 0.5;

      // Random color from palette
      const colorChoice = Math.random();
      let color;
      if (colorChoice < 0.33) color = colorCyan;
      else if (colorChoice < 0.66) color = colorPurple;
      else color = colorPink;

      particleColors[i * 3] = color.r;
      particleColors[i * 3 + 1] = color.g;
      particleColors[i * 3 + 2] = color.b;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeometry.setAttribute('size', new THREE.BufferAttribute(particleSizes, 1));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.08,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true
    });

    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    mainGroup.add(particleSystem);

    // ============================================
    // NEURAL NETWORK CONNECTIONS
    // ============================================
    const connectionGroup = new THREE.Group();
    mainGroup.add(connectionGroup);

    const connectionMaterial = new THREE.LineBasicMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.15,
      blending: THREE.AdditiveBlending
    });

    // Create random connections between helix nodes
    for (let i = 0; i < 30; i++) {
      const idx1 = Math.floor(Math.random() * strand1Nodes.length);
      const idx2 = Math.floor(Math.random() * strand2Nodes.length);

      const points = [
        strand1Nodes[idx1].position.clone(),
        strand2Nodes[idx2].position.clone()
      ];

      const connectionGeometry = new THREE.BufferGeometry().setFromPoints(points);
      const connection = new THREE.Line(connectionGeometry, connectionMaterial);
      connectionGroup.add(connection);
    }

    // ============================================
    // ANIMATION LOOP
    // ============================================
    const clock = new THREE.Clock();
    let animationId;

    function animate() {
      const elapsed = clock.getElapsedTime();

      // Rotate main helix
      helixGroup.rotation.y = elapsed * 0.15;

      // Gentle oscillation
      helixGroup.position.y = Math.sin(elapsed * 0.5) * 0.3;

      // Animate lights
      purpleLight.position.x = Math.sin(elapsed * 0.3) * 10;
      purpleLight.position.z = Math.cos(elapsed * 0.3) * 10;
      cyanLight.position.x = Math.cos(elapsed * 0.4) * 10;
      cyanLight.position.z = Math.sin(elapsed * 0.4) * 10;

      // Animate particles
      const positions = particleGeometry.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        positions[i3 + 1] += Math.sin(elapsed + i) * 0.002;
      }
      particleGeometry.attributes.position.needsUpdate = true;

      // Rotate particle system slowly
      particleSystem.rotation.y = elapsed * 0.02;

      // Pulse helix nodes
      strand1Nodes.forEach((node, idx) => {
        const scale = 1 + Math.sin(elapsed * 2 + idx * 0.1) * 0.1;
        node.scale.setScalar(scale);
      });

      strand2Nodes.forEach((node, idx) => {
        const scale = 1 + Math.sin(elapsed * 2 + idx * 0.1 + Math.PI) * 0.1;
        node.scale.setScalar(scale);
      });

      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
    }

    animate();

    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
      cancelAnimationFrame(animationId);
      renderer.dispose();
    });
  }

  // ============================================
  // DNA SECTION CANVAS
  // ============================================
  const dnaCanvas = document.getElementById('dna-canvas');
  if (dnaCanvas) {
    initMiniScene(dnaCanvas, 'dna');
  }

  // ============================================
  // RNA SECTION CANVAS
  // ============================================
  const rnaCanvas = document.getElementById('rna-canvas');
  if (rnaCanvas) {
    initMiniScene(rnaCanvas, 'rna');
  }

  // ============================================
  // CHROMOSOME SECTION CANVAS
  // ============================================
  const chromoCanvas = document.getElementById('chromo-canvas');
  if (chromoCanvas) {
    initMiniScene(chromoCanvas, 'chromo');
  }

  // ============================================
  // CONTACT SECTION CANVAS
  // ============================================
  const contactCanvas = document.getElementById('contact-canvas');
  if (contactCanvas) {
    initMiniScene(contactCanvas, 'network');
  }

  // ============================================
  // MINI SCENE FACTORY
  // ============================================
  function initMiniScene(canvas, type) {
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true
    });
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

    // Lighting
    scene.add(new THREE.AmbientLight(0x404060, 0.5));
    const light = new THREE.DirectionalLight(0x88ccff, 1.2);
    light.position.set(3, 3, 5);
    scene.add(light);

    const group = new THREE.Group();
    scene.add(group);

    // Create visualization based on type
    if (type === 'dna') {
      createDNAVisualization(group);
    } else if (type === 'rna') {
      createRNAVisualization(group);
    } else if (type === 'chromo') {
      createChromosomeVisualization(group);
    } else if (type === 'network') {
      createNetworkVisualization(group);
    }

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

  // DNA Mini Visualization
  function createDNAVisualization(group) {
    const mat1 = new THREE.MeshStandardMaterial({ color: 0x06b6d4, roughness: 0.3, metalness: 0.6 });
    const mat2 = new THREE.MeshStandardMaterial({ color: 0x8b5cf6, roughness: 0.3, metalness: 0.6 });
    const geo = new THREE.SphereGeometry(0.2, 16, 16);

    for (let i = 0; i < 30; i++) {
      const t = i / 30;
      const angle = t * Math.PI * 4;
      const y = (t - 0.5) * 8;

      const m1 = new THREE.Mesh(geo, mat1);
      m1.position.set(Math.cos(angle) * 2, y, Math.sin(angle) * 2);
      group.add(m1);

      const m2 = new THREE.Mesh(geo, mat2);
      m2.position.set(Math.cos(angle + Math.PI) * 2, y, Math.sin(angle + Math.PI) * 2);
      group.add(m2);
    }
  }

  // RNA Mini Visualization (single strand with loops)
  function createRNAVisualization(group) {
    const mat = new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.3, metalness: 0.6 });
    const geo = new THREE.SphereGeometry(0.15, 16, 16);

    for (let i = 0; i < 40; i++) {
      const t = i / 40;
      const angle = t * Math.PI * 3;
      const wobble = Math.sin(t * Math.PI * 4) * 0.5;
      const y = (t - 0.5) * 8;

      const m = new THREE.Mesh(geo, mat);
      m.position.set(
        Math.cos(angle) * (1.5 + wobble),
        y,
        Math.sin(angle) * (1.5 + wobble)
      );
      group.add(m);
    }
  }

  // Chromosome Mini Visualization (X-shape)
  function createChromosomeVisualization(group) {
    const mat = new THREE.MeshStandardMaterial({ color: 0xec4899, roughness: 0.3, metalness: 0.6 });
    const geo = new THREE.SphereGeometry(0.2, 16, 16);

    // Create X-shaped chromosome
    for (let i = 0; i < 25; i++) {
      const t = i / 25;
      const y = (t - 0.5) * 6;
      const spread = Math.abs(y) * 0.4;

      // Left arm
      const m1 = new THREE.Mesh(geo, mat);
      m1.position.set(-spread - 0.3, y, 0);
      group.add(m1);

      // Right arm
      const m2 = new THREE.Mesh(geo, mat);
      m2.position.set(spread + 0.3, y, 0);
      group.add(m2);
    }
  }

  // Network Mini Visualization
  function createNetworkVisualization(group) {
    const mat = new THREE.MeshStandardMaterial({ color: 0x06b6d4, roughness: 0.3, metalness: 0.6 });
    const geo = new THREE.SphereGeometry(0.25, 16, 16);
    const lineMat = new THREE.LineBasicMaterial({ color: 0x8b5cf6, transparent: true, opacity: 0.3 });

    const nodes = [];

    // Create nodes in 3D space
    for (let i = 0; i < 15; i++) {
      const m = new THREE.Mesh(geo, mat);
      m.position.set(
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 6
      );
      group.add(m);
      nodes.push(m.position);
    }

    // Create connections
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (nodes[i].distanceTo(nodes[j]) < 4) {
          const lineGeo = new THREE.BufferGeometry().setFromPoints([nodes[i], nodes[j]]);
          const line = new THREE.Line(lineGeo, lineMat);
          group.add(line);
        }
      }
    }
  }

})();
