# Guia Three.js - Portfolio Juan Benjamin

**Objetivo:** Elementos 3D sutis, elegantes e performáticos que complementam o design sem competir com ele

---

## 📚 Setup e Instalação

```bash
npm install three @types/three
```

---

## 🎬 1. Sistema de Cenas Base

### Scene Manager Class

```typescript
// src/scripts/three/SceneManager.ts
import * as THREE from 'three';

export interface SceneConfig {
  antialias?: boolean;
  alpha?: boolean;
  pixelRatio?: number;
  backgroundColor?: number;
}

export class SceneManager {
  protected container: HTMLElement;
  protected scene: THREE.Scene;
  protected camera: THREE.PerspectiveCamera;
  protected renderer: THREE.WebGLRenderer;
  protected animationId: number | null = null;
  protected clock: THREE.Clock;
  
  constructor(selector: string, config: SceneConfig = {}) {
    const element = document.querySelector(selector);
    if (!element) {
      throw new Error(`Element "${selector}" not found`);
    }
    
    this.container = element as HTMLElement;
    this.clock = new THREE.Clock();
    
    // Setup
    this.scene = new THREE.Scene();
    if (config.backgroundColor !== undefined) {
      this.scene.background = new THREE.Color(config.backgroundColor);
    }
    
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.container.clientWidth / this.container.clientHeight,
      0.1,
      1000
    );
    
    this.renderer = new THREE.WebGLRenderer({
      antialias: config.antialias !== false,
      alpha: config.alpha !== false,
      powerPreference: 'high-performance',
    });
    
    this.setupRenderer(config.pixelRatio);
  }
  
  private setupRenderer(pixelRatio?: number) {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(
      pixelRatio || Math.min(window.devicePixelRatio, 2)
    );
    
    this.container.appendChild(this.renderer.domElement);
  }
  
  protected handleResize = () => {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  };
  
  protected animate = () => {
    this.animationId = requestAnimationFrame(this.animate);
    
    const delta = this.clock.getDelta();
    const elapsed = this.clock.getElapsedTime();
    
    this.update(delta, elapsed);
    this.render();
  };
  
  protected update(delta: number, elapsed: number) {
    // Override in child classes
  }
  
  protected render() {
    this.renderer.render(this.scene, this.camera);
  }
  
  start() {
    window.addEventListener('resize', this.handleResize);
    this.animate();
  }
  
  dispose() {
    window.removeEventListener('resize', this.handleResize);
    
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    
    // Dispose geometries, materials, textures
    this.scene.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.geometry.dispose();
        
        if (Array.isArray(object.material)) {
          object.material.forEach((m) => m.dispose());
        } else {
          object.material.dispose();
        }
      }
    });
    
    this.renderer.dispose();
    this.container.removeChild(this.renderer.domElement);
  }
}
```

---

## 🌌 2. Hero Particle System (Coffee Dust)

```typescript
// src/scripts/three/scenes/HeroParticleScene.ts
import * as THREE from 'three';
import { SceneManager } from '../SceneManager';

export class HeroParticleScene extends SceneManager {
  private particles!: THREE.Points;
  private particleCount = 3000; // Menos partículas, mais elegante
  private mouse = new THREE.Vector2();

  constructor(selector: string) {
    super(selector, {
      alpha: true,
      antialias: true,
    });

    this.init();
  }

  private init() {
    this.setupCamera();
    this.createParticles();
    this.setupMouseTracking();
    this.start();
  }

  private setupCamera() {
    this.camera.position.z = 5;
  }

  private createParticles() {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(this.particleCount * 3);
    const colors    = new Float32Array(this.particleCount * 3);
    const sizes     = new Float32Array(this.particleCount);

    // Coffee warm palette — partículas sutis
    const colorPalette = [
      new THREE.Color(0xc07840), // caramel
      new THREE.Color(0xd4a878), // latte
      new THREE.Color(0xe8d5ba), // oat
      new THREE.Color(0xf5ede0), // cream
    ];

    for (let i = 0; i < this.particleCount; i++) {
      const i3 = i * 3;

      // Distribuição em esfera solta
      const radius = Math.random() * 5 + 1;
      const theta  = Math.random() * Math.PI * 2;
      const phi    = Math.acos(2 * Math.random() - 1);

      positions[i3]     = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);

      // Cor aleatória da paleta quente
      const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      colors[i3]     = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;

      // Tamanho variado para profundidade
      sizes[i] = Math.random() * 2 + 0.5;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color',    new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('aSize',    new THREE.BufferAttribute(sizes, 1));

    // Shader limpo — círculos suaves, sem glow neon
    const material = new THREE.ShaderMaterial({
      vertexShader: `
        attribute float aSize;
        attribute vec3 color;
        varying vec3 vColor;
        varying float vAlpha;

        void main() {
          vColor = color;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = aSize * (280.0 / -mvPosition.z);
          gl_Position  = projectionMatrix * mvPosition;

          // Alpha por distância — partículas distantes mais transparentes
          vAlpha = 0.4 + 0.6 * (1.0 - abs(position.z) / 6.0);
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vAlpha;

        void main() {
          float dist = distance(gl_PointCoord, vec2(0.5));
          float alpha = smoothstep(0.5, 0.1, dist) * vAlpha;

          gl_FragColor = vec4(vColor, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
    });

    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
  }

  private setupMouseTracking() {
    window.addEventListener('mousemove', (event) => {
      this.mouse.x = (event.clientX / window.innerWidth)  * 2 - 1;
      this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    });
  }

  protected update(_delta: number, elapsed: number) {
    // Rotação lenta e suave
    this.particles.rotation.y  = elapsed * 0.04;
    this.particles.rotation.x  = Math.sin(elapsed * 0.15) * 0.1;

    // Influência sutil do mouse
    this.particles.rotation.x += this.mouse.y * 0.005;
    this.particles.rotation.y += this.mouse.x * 0.005;
  }
}
```

---

## 🎨 3. Formas Geométricas Flutuantes (Minimalista)

```typescript
// src/scripts/three/scenes/FloatingObjectsScene.ts
import * as THREE from 'three';
import { SceneManager } from '../SceneManager';

export class FloatingObjectsScene extends SceneManager {
  private objects: THREE.Mesh[] = [];

  constructor(selector: string) {
    super(selector, {
      alpha: true,      // Transparente — fundo do CSS fica visível
      antialias: true,
    });

    this.init();
  }

  private init() {
    this.setupCamera();
    this.createGeometricForms();
    this.addLights();
    this.start();
  }

  private setupCamera() {
    this.camera.position.z = 10;
  }

  private createGeometricForms() {
    // Formas simples, material refinado — wireframe ou low-poly
    const shapes = [
      { geometry: new THREE.IcosahedronGeometry(1.2, 0), opacity: 0.6 },
      { geometry: new THREE.OctahedronGeometry(0.9, 0),  opacity: 0.5 },
      { geometry: new THREE.TetrahedronGeometry(1.0, 0), opacity: 0.4 },
      { geometry: new THREE.IcosahedronGeometry(0.7, 1), opacity: 0.35 },
    ];

    shapes.forEach((shape, index) => {
      // Material: wireframe com cor caramel/latte
      const material = new THREE.MeshBasicMaterial({
        color: index % 2 === 0 ? 0xc07840 : 0xd4a878, // caramel / latte
        wireframe: true,
        transparent: true,
        opacity: shape.opacity,
      });

      const mesh = new THREE.Mesh(shape.geometry, material);

      // Posição dispersa
      const angle  = (index / shapes.length) * Math.PI * 2;
      const radius = 3 + index * 0.5;
      mesh.position.x = Math.cos(angle) * radius;
      mesh.position.y = (Math.random() - 0.5) * 3;
      mesh.position.z = (Math.random() - 0.5) * 2;

      // Rotação inicial aleatória
      mesh.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );

      this.scene.add(mesh);
      this.objects.push(mesh);
    });
  }

  private addLights() {
    const ambientLight = new THREE.AmbientLight(0xf5ede0, 0.8); // cream
    this.scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xc07840, 0.5, 20); // caramel
    pointLight.position.set(3, 3, 3);
    this.scene.add(pointLight);
  }

  protected update(_delta: number, elapsed: number) {
    this.objects.forEach((mesh, index) => {
      // Flutuação suave — amplitudes e fases diferentes
      mesh.position.y += Math.sin(elapsed * 0.4 + index * 1.2) * 0.004;

      // Rotação lenta
      mesh.rotation.x += 0.002 * (index % 2 === 0 ? 1 : -1);
      mesh.rotation.y += 0.003;
    });
  }
}
```

---

## ⚡ 4. Displacement Plane (Superfície Líquida)

```typescript
// src/scripts/three/scenes/DisplacementPlaneScene.ts
// Substitui o glitch — superfície com ondulação suave, elegante
import * as THREE from 'three';
import { SceneManager } from '../SceneManager';

export class DisplacementPlaneScene extends SceneManager {
  private plane!: THREE.Mesh;

  constructor(selector: string, texturePath?: string) {
    super(selector, { alpha: true });
    this.loadAndInit(texturePath);
  }

  private async loadAndInit(texturePath?: string) {
    this.setupCamera();

    let texture: THREE.Texture | null = null;
    if (texturePath) {
      const loader = new THREE.TextureLoader();
      texture = await loader.loadAsync(texturePath);
    }

    this.createDisplacementPlane(texture);
    this.start();
  }

  private setupCamera() {
    this.camera.position.z = 2;
  }

  private createDisplacementPlane(texture: THREE.Texture | null) {
    const geometry = new THREE.PlaneGeometry(2, 2, 128, 128);

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTexture:    { value: texture },
        uTime:       { value: 0 },
        uStrength:   { value: 0.08 },    // Ondulação sutil
        uColorA:     { value: new THREE.Color(0x1c0f0a) }, // espresso
        uColorB:     { value: new THREE.Color(0xc07840) }, // caramel
        uHasTexture: { value: texture ? 1.0 : 0.0 },
      },
      vertexShader: `
        uniform float uTime;
        uniform float uStrength;
        varying vec2 vUv;
        varying float vDisplace;

        void main() {
          vUv = uv;

          vec3 pos = position;
          float wave1 = sin(pos.x * 2.5 + uTime * 0.6) * uStrength;
          float wave2 = sin(pos.y * 2.0 + uTime * 0.5) * uStrength * 0.7;
          float wave3 = cos((pos.x + pos.y) * 1.5 + uTime * 0.4) * uStrength * 0.4;

          pos.z = wave1 + wave2 + wave3;
          vDisplace = pos.z / uStrength;

          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D uTexture;
        uniform vec3 uColorA;
        uniform vec3 uColorB;
        uniform float uHasTexture;
        varying vec2 vUv;
        varying float vDisplace;

        void main() {
          // Com textura: leve tint warm sobre ela
          if (uHasTexture > 0.5) {
            vec4 tex = texture2D(uTexture, vUv);
            vec3 warm = mix(tex.rgb, uColorB, 0.08 + vDisplace * 0.06);
            gl_FragColor = vec4(warm, tex.a);
          } else {
            // Sem textura: gradiente de profundidade coffee
            vec3 color = mix(uColorA, uColorB, vDisplace * 0.5 + 0.5);
            gl_FragColor = vec4(color, 0.85);
          }
        }
      `,
      transparent: true,
    });

    this.plane = new THREE.Mesh(geometry, material);
    this.scene.add(this.plane);
  }

  protected update(_delta: number, elapsed: number) {
    if (this.plane?.material instanceof THREE.ShaderMaterial) {
      this.plane.material.uniforms.uTime.value = elapsed;
    }
  }
}
```

---

## 🌊 5. Animated Background Mesh

```typescript
// src/scripts/three/scenes/WaveMeshScene.ts
import * as THREE from 'three';
import { SceneManager } from '../SceneManager';

export class WaveMeshScene extends SceneManager {
  private mesh!: THREE.Mesh;
  
  constructor(selector: string) {
    super(selector, {
      backgroundColor: 0x1c0f0a, // espresso
    });

    this.init();
  }
  
  private init() {
    this.setupCamera();
    this.createWaveMesh();
    this.addLights();
    this.start();
  }
  
  private setupCamera() {
    this.camera.position.set(0, 5, 10);
    this.camera.lookAt(0, 0, 0);
  }
  
  private createWaveMesh() {
    const geometry = new THREE.PlaneGeometry(20, 20, 100, 100);
    
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColorA: { value: new THREE.Color(0x5c3317) }, // medium-roast
        uColorB: { value: new THREE.Color(0xd4a878) }, // latte
      },
      vertexShader: `
        uniform float uTime;
        varying vec2 vUv;
        varying float vWave;
        
        void main() {
          vUv = uv;
          
          vec3 pos = position;
          float wave = sin(pos.x * 0.5 + uTime) * 0.5;
          wave += sin(pos.y * 0.5 + uTime * 0.8) * 0.3;
          
          pos.z = wave;
          vWave = wave;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uColorA;
        uniform vec3 uColorB;
        varying vec2 vUv;
        varying float vWave;
        
        void main() {
          vec3 color = mix(uColorA, uColorB, vWave + 0.5);
          gl_FragColor = vec4(color, 1.0);
        }
      `,
      wireframe: true,
    });
    
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.rotation.x = -Math.PI / 4;
    this.scene.add(this.mesh);
  }
  
  private addLights() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);
  }
  
  protected update(delta: number, elapsed: number) {
    if (this.mesh && this.mesh.material instanceof THREE.ShaderMaterial) {
      this.mesh.material.uniforms.uTime.value = elapsed;
    }
  }
}
```

---

## 🎯 6. Integration com Astro

### Astro Component Wrapper

```astro
---
// src/components/three/ThreeScene.astro
export interface Props {
  sceneType: 'particles' | 'floating' | 'displacement' | 'wave';
  id: string;
}

const { sceneType, id } = Astro.props;
---

<div 
  id={id}
  data-three-scene={sceneType}
  class="three-canvas"
>
  <canvas></canvas>
</div>

<script define:vars={{ sceneType, id }}>
  // Dynamic import based on scene type
  const initScene = async () => {
    let SceneClass;
    
    switch (sceneType) {
      case 'particles':
        const { HeroParticleScene } = await import(
          '@/scripts/three/scenes/HeroParticleScene'
        );
        SceneClass = HeroParticleScene;
        break;
      case 'floating':
        const { FloatingObjectsScene } = await import(
          '@/scripts/three/scenes/FloatingObjectsScene'
        );
        SceneClass = FloatingObjectsScene;
        break;
      case 'displacement':
        const { DisplacementPlaneScene } = await import(
          '@/scripts/three/scenes/DisplacementPlaneScene'
        );
        SceneClass = DisplacementPlaneScene;
        break;
    }
    
    if (SceneClass) {
      const scene = new SceneClass(`#${id}`);
      
      // Cleanup on Barba page leave
      window.addEventListener('barba:leave', () => {
        scene.dispose();
      });
    }
  };
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScene);
  } else {
    initScene();
  }
</script>

<style lang="scss">
  .three-canvas {
    position: absolute;
    inset: 0;
    z-index: -1;
    
    canvas {
      display: block;
      width: 100%;
      height: 100%;
    }
  }
</style>
```

### Usage Example

```astro
---
// src/pages/index.astro
import ThreeScene from '@/components/three/ThreeScene.astro';
---

<section class="hero">
  <ThreeScene sceneType="particles" id="hero-scene" />
  
  <div class="hero__content">
    <h1>Juan Benjamin</h1>
  </div>
</section>
```

---

## ⚡ 7. Performance Optimization

### Lazy Loading

```typescript
// src/scripts/three/utils/lazyLoad.ts
export const lazyLoadScene = async (
  selector: string,
  SceneClass: any
) => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const scene = new SceneClass(selector);
          observer.disconnect();
        }
      });
    },
    {
      rootMargin: '100px',
    }
  );
  
  const element = document.querySelector(selector);
  if (element) {
    observer.observe(element);
  }
};
```

### Adaptive Quality

```typescript
export const getAdaptiveQuality = () => {
  const isMobile = window.innerWidth < 768;
  const isLowEnd = navigator.hardwareConcurrency <= 4;
  
  return {
    particleCount: isMobile ? 1000 : isLowEnd ? 3000 : 5000,
    pixelRatio: isMobile ? 1 : Math.min(window.devicePixelRatio, 2),
    antialias: !isMobile,
    shadowMap: !isMobile && !isLowEnd,
  };
};
```

---

## 📋 Checklist Three.js

- [ ] Dispose geometries, materials, textures
- [ ] cancelAnimationFrame em dispose()
- [ ] Pixel ratio limitado a 2
- [ ] Lazy loading para cenas não críticas
- [ ] Adaptive quality baseado em device
- [ ] Frustum culling ativado
- [ ] Level of Detail (LOD) se aplicável
- [ ] Memory leaks verificados

Este guia cobre toda a implementação Three.js necessária para criar efeitos visuais incríveis no portfolio!
