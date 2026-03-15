import * as THREE from 'three';

/**
 * Transparent Three.js particle overlay for the hero viewport.
 * Renders 1 800 coffee-coloured "space" particles on a transparent WebGL canvas
 * positioned between the frame canvas and the dark overlay.
 *
 * Mouse movement slowly rotates the particle field for a parallax depth effect.
 */
export const initHeroParticles = (container: HTMLElement | null) => {
  if (!container || typeof window === 'undefined') return;

  const W = window.innerWidth;
  const H = window.innerHeight;

  // ── Scene setup ────────────────────────────────────────────────────────────
  const scene    = new THREE.Scene();
  const camera   = new THREE.PerspectiveCamera(65, W / H, 0.1, 1000);
  camera.position.set(0, 0, 60);

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: 'low-power' });
  renderer.setSize(W, H);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setClearColor(0x000000, 0); // fully transparent background

  const glCanvas = renderer.domElement;
  glCanvas.style.cssText = 'position:absolute;inset:0;z-index:1;pointer-events:none;';
  container.appendChild(glCanvas);

  // ── Particles ──────────────────────────────────────────────────────────────
  const COUNT = 1_800;
  const positions = new Float32Array(COUNT * 3);
  const colors    = new Float32Array(COUNT * 3);
  const sizes     = new Float32Array(COUNT);

  // Coffee palette: cream stars + caramel glows + amber accents
  const palette = [
    new THREE.Color(0xf5ede0), // cream
    new THREE.Color(0xf5ede0), // cream (double weight)
    new THREE.Color(0xe8d5ba), // oat
    new THREE.Color(0xc07840), // caramel
    new THREE.Color(0xd4a878), // latte
    new THREE.Color(0xd4922a), // amber
  ];

  for (let i = 0; i < COUNT; i++) {
    const i3 = i * 3;
    // Spread in a wide ellipsoidal cloud
    positions[i3]     = (Math.random() - 0.5) * 220;
    positions[i3 + 1] = (Math.random() - 0.5) * 140;
    positions[i3 + 2] = (Math.random() - 0.5) * 120;

    const c = palette[Math.floor(Math.random() * palette.length)];
    colors[i3]     = c.r;
    colors[i3 + 1] = c.g;
    colors[i3 + 2] = c.b;

    sizes[i] = Math.random() * 2.2 + 0.4;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('color',    new THREE.BufferAttribute(colors, 3));
  geo.setAttribute('size',     new THREE.BufferAttribute(sizes, 1));

  const mat = new THREE.PointsMaterial({
    size:           1.6,
    vertexColors:   true,
    transparent:    true,
    opacity:        0.18,
    sizeAttenuation:true,
    depthWrite:     false,
  });

  const particles = new THREE.Points(geo, mat);
  scene.add(particles);

  // ── Floating dust rings (decorative) ──────────────────────────────────────
  // A thin torus that slowly rotates to give a "black-hole accretion disc" feel
  const ringGeo = new THREE.TorusGeometry(28, 0.25, 4, 90);
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0xc07840,
    transparent: true,
    opacity: 0.08,
    wireframe: false,
  });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = Math.PI / 2.4;
  scene.add(ring);

  // ── Mouse tracking ─────────────────────────────────────────────────────────
  let targetRotX = 0, targetRotY = 0;
  let currentRotX = 0, currentRotY = 0;

  const onMouseMove = (e: MouseEvent) => {
    targetRotY = (e.clientX / window.innerWidth  - 0.5) * 0.35;
    targetRotX = (e.clientY / window.innerHeight - 0.5) * 0.22;
  };
  window.addEventListener('mousemove', onMouseMove, { passive: true });

  // ── Render loop ────────────────────────────────────────────────────────────
  let animId: number;
  let isVisible = true;

  const animate = () => {
    animId = requestAnimationFrame(animate);
    if (!isVisible) return;

    // Smooth mouse-driven rotation
    currentRotX += (targetRotX - currentRotX) * 0.03;
    currentRotY += (targetRotY - currentRotY) * 0.03;

    particles.rotation.x = currentRotX;
    particles.rotation.y = currentRotY + performance.now() * 0.000035; // slow drift
    particles.rotation.z += 0.00015;

    ring.rotation.z += 0.0004;

    renderer.render(scene, camera);
  };
  animate();

  // ── Resize ─────────────────────────────────────────────────────────────────
  const onResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };
  window.addEventListener('resize', onResize, { passive: true });

  // ── Pause when hero not visible ────────────────────────────────────────────
  const heroWrapper = document.querySelector('[data-hero-scroll]');
  if (heroWrapper) {
    new IntersectionObserver(
      entries => { isVisible = entries[0].isIntersecting; },
      { threshold: 0.01 }
    ).observe(heroWrapper);
  }

  // ── Cleanup ────────────────────────────────────────────────────────────────
  return () => {
    cancelAnimationFrame(animId);
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('resize', onResize);
    geo.dispose(); mat.dispose();
    ringGeo.dispose(); ringMat.dispose();
    renderer.dispose();
    glCanvas.remove();
  };
};
