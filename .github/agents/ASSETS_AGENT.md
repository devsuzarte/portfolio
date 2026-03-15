# ASSETS_AGENT - Guia de Assets para Código

**Para Claude/IA:** Este documento explica a estrutura de assets do projeto e como utilizá-los no código.

---

## 📂 Estrutura de Assets

```
public/assets/
├── images/
│   ├── hero/
│   │   ├── background.webp          # 1920x1080, otimizado
│   │   ├── background-mobile.webp   # 768x1024, mobile
│   │   └── profile.webp             # 500x500, foto perfil
│   ├── about/
│   │   └── pattern-grain.svg        # Grain texture sutil
│   ├── projects/
│   │   ├── project-1-thumb.webp     # 800x600
│   │   ├── project-1-full.webp      # 1920x1080
│   │   └── ...
│   └── blog/
│       └── post-covers/
│
├── videos/
│   ├── hero-particles.mp4           # Loop 10s, 1920x1080
│   └── scroll-sequence.mp4          # Para converter em frames
│
├── frames/                          # Sequências de imagens
│   ├── scroll-animation-1/
│   │   ├── frame_0001.webp         # 1920px width
│   │   ├── frame_0002.webp
│   │   ├── ...
│   │   └── frame_0030.webp         # 30 frames total
│   └── scroll-animation-2/
│
├── models/                          # Modelos 3D
│   ├── laptop.glb                   # < 500KB, low poly
│   ├── particles-sphere.glb         # Geometria custom
│   └── logo-3d.gltf                 # Com texturas
│
├── icons/
│   ├── tech/                        # SVG ícones
│   │   ├── react.svg
│   │   ├── nodejs.svg
│   │   ├── typescript.svg
│   │   ├── astro.svg
│   │   └── ...
│   └── ui/
│       ├── arrow.svg
│       ├── close.svg
│       └── menu.svg
│
└── patterns/                        # SVG backgrounds
    ├── grain-noise.svg             # Grain overlay elegante
    ├── subtle-dots.svg             # Dots minimalistas
    └── line-texture.svg            # Linhas finas decorativas
```

---

## 🖼️ 1. USAR IMAGENS (Astro Image Component)

### Padrão Básico:

```astro
---
import { Image } from 'astro:assets';
import heroBackground from '@/assets/images/hero/background.webp';
---

<Image 
  src={heroBackground}
  alt="Hero background"
  format="webp"
  quality={85}
  loading="eager"
  decoding="async"
  class="hero__background"
/>
```

### Responsive com Picture:

```astro
---
import { Picture } from 'astro:assets';
import bgDesktop from '@/assets/images/hero/background.webp';
import bgMobile from '@/assets/images/hero/background-mobile.webp';
---

<Picture
  src={bgDesktop}
  widths={[768, 1920]}
  sizes="(max-width: 768px) 768px, 1920px"
  formats={['avif', 'webp']}
  alt="Hero background"
  loading="eager"
/>
```

### Background via CSS:

```astro
<div class="hero" data-bg="/assets/images/hero/background.webp"></div>

<script>
  // Lazy load background
  const hero = document.querySelector('.hero');
  const bg = hero?.getAttribute('data-bg');
  
  if (bg) {
    const img = new Image();
    img.src = bg;
    img.onload = () => {
      hero.style.backgroundImage = `url(${bg})`;
    };
  }
</script>

<style>
  .hero {
    background-size: cover;
    background-position: center;
  }
</style>
```

---

## 🎬 2. SCROLL-BASED FRAME ANIMATION (Canvas)

### Setup Completo:

```typescript
// scripts/frameAnimation.ts

interface FrameSequenceConfig {
  frameCount: number;           // Total de frames
  folder: string;               // Caminho pasta
  prefix: string;               // Prefixo dos arquivos
  extension: 'webp' | 'jpg';    // Formato
  scrollStart?: number;         // Scroll start (default: 0)
  scrollEnd?: number;           // Scroll end (default: document height)
}

export class FrameSequence {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private frames: HTMLImageElement[] = [];
  private config: FrameSequenceConfig;
  private currentFrame: number = 0;
  private imagesLoaded: number = 0;
  
  constructor(canvas: HTMLCanvasElement, config: FrameSequenceConfig) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.config = config;
    
    this.setupCanvas();
    this.preloadFrames();
    this.initScrollListener();
  }
  
  private setupCanvas() {
    const setCanvasSize = () => {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    };
    
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);
  }
  
  private preloadFrames() {
    const { frameCount, folder, prefix, extension } = this.config;
    
    for (let i = 1; i <= frameCount; i++) {
      const img = new Image();
      const frameNum = String(i).padStart(4, '0'); // 0001, 0002, etc
      
      img.src = `/assets/frames/${folder}/${prefix}_${frameNum}.${extension}`;
      
      img.onload = () => {
        this.imagesLoaded++;
        
        // Quando todas carregarem, desenhar primeiro frame
        if (this.imagesLoaded === frameCount) {
          this.renderFrame(0);
        }
      };
      
      this.frames.push(img);
    }
  }
  
  private initScrollListener() {
    window.addEventListener('scroll', () => {
      const { scrollStart = 0, scrollEnd = document.body.scrollHeight } = this.config;
      
      const scrollTop = window.scrollY;
      const scrollRange = scrollEnd - scrollStart;
      const scrollProgress = Math.max(0, Math.min(1, 
        (scrollTop - scrollStart) / scrollRange
      ));
      
      const frameIndex = Math.floor(scrollProgress * (this.frames.length - 1));
      
      if (frameIndex !== this.currentFrame) {
        this.currentFrame = frameIndex;
        this.renderFrame(frameIndex);
      }
    });
  }
  
  private renderFrame(index: number) {
    const img = this.frames[index];
    if (!img || !img.complete) return;
    
    const { canvas, ctx } = this;
    
    // Calcular aspect ratio
    const scale = Math.max(
      canvas.width / img.width,
      canvas.height / img.height
    );
    
    const x = (canvas.width / 2) - (img.width / 2) * scale;
    const y = (canvas.height / 2) - (img.height / 2) * scale;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
  }
  
  public dispose() {
    window.removeEventListener('scroll', this.initScrollListener);
    this.frames = [];
  }
}
```

### Uso no Astro Component:

```astro
---
// components/ScrollFrameAnimation.astro
---

<canvas id="scroll-canvas" class="scroll-canvas"></canvas>

<script>
  import { FrameSequence } from '@/scripts/frameAnimation';
  
  const canvas = document.getElementById('scroll-canvas') as HTMLCanvasElement;
  
  if (canvas) {
    const sequence = new FrameSequence(canvas, {
      frameCount: 30,                          // 30 frames
      folder: 'scroll-animation-1',            // Pasta
      prefix: 'frame',                         // frame_0001.webp
      extension: 'webp',
      scrollStart: 0,                          // Começa no topo
      scrollEnd: window.innerHeight * 2,       // 2x viewport height
    });
    
    // Cleanup em page transition
    window.addEventListener('barba:leave', () => {
      sequence.dispose();
    });
  }
</script>

<style>
  .scroll-canvas {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
  }
</style>
```

---

## 🎥 3. BACKGROUND VÍDEO

### HTML5 Video (Autoplay Loop):

```astro
<div class="hero">
  <video 
    class="hero__video"
    autoplay 
    loop 
    muted 
    playsinline
    poster="/assets/images/hero/video-poster.webp"
  >
    <source src="/assets/videos/hero-particles.mp4" type="video/mp4">
    <source src="/assets/videos/hero-particles.webm" type="video/webm">
  </video>
  
  <div class="hero__content">
    <!-- Content over video -->
  </div>
</div>

<style lang="scss">
  .hero {
    position: relative;
    width: 100%;
    height: 100vh;
    overflow: hidden;
    
    &__video {
      position: absolute;
      top: 50%;
      left: 50%;
      min-width: 100%;
      min-height: 100%;
      width: auto;
      height: auto;
      transform: translate(-50%, -50%);
      z-index: -1;
      object-fit: cover;
    }
    
    &__content {
      position: relative;
      z-index: 1;
    }
  }
</style>
```

### Com Controles de Performance:

```typescript
// scripts/videoOptimizer.ts

export const initVideoOptimization = () => {
  const videos = document.querySelectorAll('video[data-optimize]');
  
  videos.forEach((video) => {
    const videoEl = video as HTMLVideoElement;
    
    // Pausar quando fora da viewport
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        videoEl.play();
      } else {
        videoEl.pause();
      }
    }, { threshold: 0.25 });
    
    observer.observe(videoEl);
    
    // Pausar em mobile se preferir reduced motion
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    
    if (prefersReducedMotion) {
      videoEl.pause();
      videoEl.style.display = 'none';
    }
  });
};
```

---

## 🎭 4. MODELOS 3D (GLB/GLTF com Three.js)

### Carregar Modelo GLB:

```typescript
// scripts/three/ModelLoader.ts

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';

export class ModelLoader {
  private loader: GLTFLoader;
  
  constructor() {
    this.loader = new GLTFLoader();
    
    // Draco loader para modelos comprimidos
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/draco/');
    this.loader.setDRACOLoader(dracoLoader);
  }
  
  async load(url: string): Promise<THREE.Group> {
    return new Promise((resolve, reject) => {
      this.loader.load(
        url,
        (gltf) => {
          resolve(gltf.scene);
        },
        (progress) => {
          const percent = (progress.loaded / progress.total) * 100;
          console.log(`Loading model: ${percent.toFixed(0)}%`);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }
}
```

### Usar Modelo em Cena:

```typescript
// scripts/three/LaptopScene.ts

import * as THREE from 'three';
import { SceneManager } from './SceneManager';
import { ModelLoader } from './ModelLoader';

export class LaptopScene extends SceneManager {
  private model?: THREE.Group;
  
  async init() {
    this.setupCamera();
    this.setupLights();
    await this.loadModel();
    this.start();
  }
  
  private async loadModel() {
    const loader = new ModelLoader();
    
    try {
      this.model = await loader.load('/assets/models/laptop.glb');
      
      // Posicionar modelo
      this.model.position.set(0, 0, 0);
      this.model.scale.set(1, 1, 1);
      
      this.scene.add(this.model);
      
    } catch (error) {
      console.error('Error loading model:', error);
    }
  }
  
  private setupLights() {
    // Ambient light
    const ambient = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambient);
    
    // Directional light (simula sol)
    const directional = new THREE.DirectionalLight(0xffffff, 0.8);
    directional.position.set(5, 10, 5);
    this.scene.add(directional);
  }
  
  protected update(delta: number, elapsed: number) {
    // Animar modelo
    if (this.model) {
      this.model.rotation.y += delta * 0.5; // Rotação suave
    }
  }
  
  dispose() {
    // Dispose do modelo
    if (this.model) {
      this.model.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          if (Array.isArray(object.material)) {
            object.material.forEach(m => m.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
    }
    
    super.dispose();
  }
}
```

---

## 🎨 5. SVG ICONS & PATTERNS

### SVG como Component:

```astro
---
// components/icons/ReactIcon.astro
interface Props {
  size?: number;
  color?: string;
  class?: string;
}

const { size = 24, color = 'currentColor', class: className = '' } = Astro.props;
---

<svg 
  width={size} 
  height={size} 
  viewBox="0 0 24 24" 
  fill="none"
  class={className}
  aria-label="React icon"
>
  <path 
    d="M12 10.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" 
    fill={color}
  />
  <!-- ... resto do SVG -->
</svg>
```

### SVG Inline (Para Performance):

```astro
---
// Importar SVG raw
import reactIconRaw from '@/assets/icons/tech/react.svg?raw';
---

<div set:html={reactIconRaw} class="icon"></div>

<style>
  .icon :global(svg) {
    width: 48px;
    height: 48px;
    fill: var(--caramel);
  }
</style>
```

### SVG Pattern como Background:

```astro
<div class="section section--grain">
  <svg class="section__pattern" aria-hidden="true">
    <defs>
      <filter id="grain">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.85"
          numOctaves="4"
          stitchTiles="stitch"
        />
        <feColorMatrix type="saturate" values="0"/>
      </filter>
    </defs>
    <rect width="100%" height="100%" filter="url(#grain)" opacity="0.04"/>
  </svg>
  
  <div class="section__content">
    <!-- Content -->
  </div>
</div>

<style lang="scss">
  .section {
    position: relative;
    
    &__pattern {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 0;
      pointer-events: none;
    }
    
    &__content {
      position: relative;
      z-index: 1;
    }
  }
</style>
```

---

## 📦 6. ASSET PRELOADING

### Preload Critical Assets:

```astro
---
// layouts/BaseLayout.astro
---
<head>
  <!-- Preload hero background -->
  <link 
    rel="preload" 
    href="/assets/images/hero/background.webp" 
    as="image"
    type="image/webp"
  >
  
  <!-- Preload 3D model -->
  <link 
    rel="preload" 
    href="/assets/models/laptop.glb" 
    as="fetch"
    crossorigin
  >
  
  <!-- Preload primeiro frame -->
  <link 
    rel="preload" 
    href="/assets/frames/scroll-animation-1/frame_0001.webp" 
    as="image"
  >
</head>
```

---

## 🎯 7. ASSET REGISTRY (Para Agente Saber o Que Existe)

Crie um arquivo `src/config/assets.ts`:

```typescript
// src/config/assets.ts

export const ASSETS = {
  images: {
    hero: {
      background: '/assets/images/hero/background.webp',
      backgroundMobile: '/assets/images/hero/background-mobile.webp',
      profile: '/assets/images/hero/profile.webp',
    },
    about: {
      patternGrain: '/assets/patterns/grain-noise.svg',
    },
    projects: {
      project1Thumb: '/assets/images/projects/project-1-thumb.webp',
      project1Full: '/assets/images/projects/project-1-full.webp',
    },
  },
  
  videos: {
    heroParticles: '/assets/videos/hero-particles.mp4',
  },
  
  frames: {
    scrollAnimation1: {
      folder: 'scroll-animation-1',
      prefix: 'frame',
      count: 30,
      extension: 'webp',
    },
  },
  
  models: {
    laptop: '/assets/models/laptop.glb',
    particlesSphere: '/assets/models/particles-sphere.glb',
  },
  
  icons: {
    tech: {
      react: '/assets/icons/tech/react.svg',
      nodejs: '/assets/icons/tech/nodejs.svg',
      typescript: '/assets/icons/tech/typescript.svg',
    },
  },
} as const;

export type Assets = typeof ASSETS;
```

### Usar no Código:

```astro
---
import { ASSETS } from '@/config/assets';
import { Image } from 'astro:assets';
---

<Image 
  src={ASSETS.images.hero.background} 
  alt="Hero background"
/>
```

---

## ✅ CHECKLIST PARA AGENTE DE CÓDIGO

Quando criar código que usa assets, sempre:

- [ ] Usar `ASSETS` registry (não hardcode paths)
- [ ] Usar Astro Image component (otimização automática)
- [ ] Lazy load assets não críticos
- [ ] Preload assets críticos (hero, above fold)
- [ ] Adicionar alt text em imagens
- [ ] Dispose modelos 3D em unmount
- [ ] Pausar vídeos fora da viewport
- [ ] Respeitar prefers-reduced-motion
- [ ] Fornecer fallbacks (poster para vídeo)
- [ ] Comprimir antes de commitar (< 500KB por asset)

---

**Este guia garante que o agente de código saiba exatamente onde encontrar e como usar cada tipo de asset! 🎯**
