import * as THREE from 'three';

export class HeroParticleScene {
  private container: HTMLElement;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private group: THREE.Group;
  private animationId: number | null = null;
  private mouse = { x: 0, y: 0 };
  private clock = 0;

  constructor(selector: string) {
    const el = document.querySelector<HTMLElement>(selector);
    if (!el) throw new Error(`[HeroParticleScene] Element "${selector}" not found`);
    this.container = el;

    this.scene    = new THREE.Scene();
    this.camera   = new THREE.PerspectiveCamera(60, this.aspect, 0.1, 100);
    this.renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    this.group    = new THREE.Group();

    this.init();
  }

  private get aspect() {
    return this.container.clientWidth / this.container.clientHeight || 1;
  }

  private init() {
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    this.renderer.setClearColor(0x000000, 0);
    this.container.appendChild(this.renderer.domElement);

    this.camera.position.z = 5;

    this.createConstellation();
    this.scene.add(this.group);

    window.addEventListener('resize', this.onResize);
    window.addEventListener('mousemove', this.onMouseMove);

    this.animate();
  }

  private createConstellation() {
    const NODE_COUNT  = 130;
    const CONNECT_DIST = 1.7;
    const SPREAD_X    = 6.0;
    const SPREAD_Y    = 3.5;
    const SPREAD_Z    = 4.0;

    // Coffee palette (r, g, b normalized)
    const palette: [number, number, number][] = [
      [0.75, 0.47, 0.25],  // caramel  #c07840
      [0.75, 0.47, 0.25],  // caramel  (weighted)
      [0.83, 0.66, 0.47],  // latte    #d4a878
      [0.91, 0.84, 0.73],  // oat      #e8d5ba
      [0.90, 0.74, 0.54],  // warm cream
    ];

    // Generate positions
    const positions: THREE.Vector3[] = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      positions.push(new THREE.Vector3(
        (Math.random() - 0.5) * SPREAD_X,
        (Math.random() - 0.5) * SPREAD_Y,
        (Math.random() - 0.5) * SPREAD_Z,
      ));
    }

    // ── Nodes ──
    const nodePos    = new Float32Array(NODE_COUNT * 3);
    const nodeColors = new Float32Array(NODE_COUNT * 3);

    for (let i = 0; i < NODE_COUNT; i++) {
      nodePos[i * 3]     = positions[i].x;
      nodePos[i * 3 + 1] = positions[i].y;
      nodePos[i * 3 + 2] = positions[i].z;

      const c = palette[Math.floor(Math.random() * palette.length)];
      const brightness = Math.random() < 0.12 ? 1.2 : (Math.random() < 0.3 ? 0.9 : 0.6);
      nodeColors[i * 3]     = Math.min(c[0] * brightness, 1);
      nodeColors[i * 3 + 1] = Math.min(c[1] * brightness, 1);
      nodeColors[i * 3 + 2] = Math.min(c[2] * brightness, 1);
    }

    const nodeGeo = new THREE.BufferGeometry();
    nodeGeo.setAttribute('position', new THREE.BufferAttribute(nodePos, 3));
    nodeGeo.setAttribute('color',    new THREE.BufferAttribute(nodeColors, 3));

    const nodeMat = new THREE.PointsMaterial({
      size:            0.05,
      vertexColors:    true,
      transparent:     true,
      opacity:         0.9,
      sizeAttenuation: true,
      depthWrite:      false,
    });

    this.group.add(new THREE.Points(nodeGeo, nodeMat));

    // ── Connection lines ──
    const linePos: number[]    = [];
    const lineColors: number[] = [];

    for (let i = 0; i < NODE_COUNT; i++) {
      for (let j = i + 1; j < NODE_COUNT; j++) {
        const dist = positions[i].distanceTo(positions[j]);
        if (dist >= CONNECT_DIST) continue;

        // Alpha falloff: closer = more visible
        const t = 1 - dist / CONNECT_DIST;
        const r = 0.50 * t;
        const g = 0.30 * t;
        const b = 0.14 * t;

        linePos.push(
          positions[i].x, positions[i].y, positions[i].z,
          positions[j].x, positions[j].y, positions[j].z,
        );
        lineColors.push(r, g, b, r, g, b);
      }
    }

    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(linePos), 3));
    lineGeo.setAttribute('color',    new THREE.BufferAttribute(new Float32Array(lineColors), 3));

    const lineMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent:  true,
      opacity:      0.4,
      depthWrite:   false,
    });

    this.group.add(new THREE.LineSegments(lineGeo, lineMat));

    // ── Distant background stars (faint, tiny) ──
    const STAR_COUNT  = 300;
    const starPos     = new Float32Array(STAR_COUNT * 3);
    const starColors  = new Float32Array(STAR_COUNT * 3);

    for (let i = 0; i < STAR_COUNT; i++) {
      starPos[i * 3]     = (Math.random() - 0.5) * 18;
      starPos[i * 3 + 1] = (Math.random() - 0.5) * 14;
      starPos[i * 3 + 2] = (Math.random() - 0.5) * 10 - 3; // push behind

      const dim = 0.15 + Math.random() * 0.2;
      starColors[i * 3]     = dim * 0.9;
      starColors[i * 3 + 1] = dim * 0.65;
      starColors[i * 3 + 2] = dim * 0.35;
    }

    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    starGeo.setAttribute('color',    new THREE.BufferAttribute(starColors, 3));

    const starMat = new THREE.PointsMaterial({
      size:            0.02,
      vertexColors:    true,
      transparent:     true,
      opacity:         0.7,
      sizeAttenuation: true,
      depthWrite:      false,
    });

    // Stars don't rotate with constellation — add directly to scene
    this.scene.add(new THREE.Points(starGeo, starMat));
  }

  private animate = () => {
    this.animationId = requestAnimationFrame(this.animate);

    this.clock += 0.0005;

    const targetX = this.mouse.y * 0.18;
    const targetY = this.clock + this.mouse.x * 0.18;

    this.group.rotation.x += (targetX - this.group.rotation.x) * 0.025;
    this.group.rotation.y += (targetY - this.group.rotation.y) * 0.025;

    this.renderer.render(this.scene, this.camera);
  };

  private onResize = () => {
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    this.camera.aspect = w / h || 1;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  };

  private onMouseMove = (e: MouseEvent) => {
    this.mouse.x = (e.clientX / window.innerWidth  - 0.5) * 2;
    this.mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
  };

  dispose() {
    if (this.animationId !== null) cancelAnimationFrame(this.animationId);
    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('mousemove', this.onMouseMove);

    this.scene.traverse(obj => {
      if ((obj as THREE.Points | THREE.LineSegments).geometry) {
        (obj as THREE.Points | THREE.LineSegments).geometry.dispose();
      }
      if ((obj as THREE.Points | THREE.LineSegments).material) {
        ((obj as THREE.Points | THREE.LineSegments).material as THREE.Material).dispose();
      }
    });

    this.renderer.dispose();
    this.renderer.domElement.remove();
  }
}
