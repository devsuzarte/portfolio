# Arquitetura do Projeto - Portfolio Juan Benjamin

**Stack:** Astro 4.x + Barba.js + GSAP + Three.js + Tailwind CSS

---

## 📂 Estrutura de Diretórios

```
portfolio-juan-benjamin/
├── .github/
│   └── workflows/
│       └── deploy.yml                 # CI/CD automatizado
│
├── public/
│   ├── assets/
│   │   ├── images/                    # Imagens estáticas
│   │   ├── models/                    # Modelos 3D (.glb, .gltf)
│   │   ├── videos/                    # Vídeos de background
│   │   └── fonts/                     # Fontes customizadas
│   ├── favicon.svg
│   └── robots.txt
│
├── src/
│   ├── components/
│   │   ├── animations/
│   │   │   ├── EntranceAnimation.astro
│   │   │   ├── ScrollReveal.astro
│   │   │   └── PageTransition.astro
│   │   │
│   │   ├── three/
│   │   │   ├── Scene3D.astro         # Wrapper Astro para Three.js
│   │   │   └── ParticleBackground.astro
│   │   │
│   │   ├── ui/
│   │   │   ├── Button.astro
│   │   │   ├── Card.astro
│   │   │   ├── Modal.astro
│   │   │   └── Divider.astro         # Linha divisória elegante
│   │   │
│   │   ├── navigation/
│   │   │   ├── Header.astro
│   │   │   ├── Footer.astro
│   │   │   └── MobileMenu.astro
│   │   │
│   │   └── sections/
│   │       ├── Hero.astro
│   │       ├── About.astro
│   │       ├── Skills.astro
│   │       ├── Experience.astro
│   │       ├── Projects.astro
│   │       ├── Blog.astro
│   │       └── Contact.astro
│   │
│   ├── layouts/
│   │   ├── BaseLayout.astro          # Layout base com Barba container
│   │   ├── PageLayout.astro          # Layout para páginas internas
│   │   └── BlogLayout.astro          # Layout para posts
│   │
│   ├── pages/
│   │   ├── index.astro               # Homepage
│   │   ├── about.astro
│   │   ├── projects/
│   │   │   ├── index.astro
│   │   │   └── [slug].astro          # Project detail pages
│   │   ├── blog/
│   │   │   ├── index.astro
│   │   │   └── [slug].astro
│   │   └── contact.astro
│   │
│   ├── scripts/
│   │   ├── barba/
│   │   │   ├── index.ts              # Barba.js setup
│   │   │   ├── transitions.ts        # Transições customizadas
│   │   │   └── hooks.ts              # Lifecycle hooks
│   │   │
│   │   ├── gsap/
│   │   │   ├── index.ts              # GSAP config e plugins
│   │   │   ├── scrollTrigger.ts      # ScrollTrigger animations
│   │   │   ├── entranceAnimations.ts
│   │   │   └── flipTransitions.ts
│   │   │
│   │   ├── three/
│   │   │   ├── scenes/
│   │   │   │   ├── heroScene.ts
│   │   │   │   └── particleScene.ts
│   │   │   ├── shaders/
│   │   │   │   ├── displacementShader.glsl
│   │   │   │   └── waveShader.glsl
│   │   │   └── utils/
│   │   │       ├── loaders.ts
│   │   │       └── helpers.ts
│   │   │
│   │   └── utils/
│   │       ├── themeSwitch.ts        # Tema switcher
│   │       ├── smoothScroll.ts       # Lenis config
│   │       └── performance.ts        # Performance helpers
│   │
│   ├── styles/
│   │   ├── global.scss               # Estilos globais
│   │   ├── tokens.scss               # Design tokens (coffee scale)
│   │   ├── themes/
│   │   │   ├── dark.scss             # Tema escuro (espresso)
│   │   │   ├── light.scss            # Tema claro (fog/cream)
│   │   │   ├── warm.scss             # Tema quente (dark-roast)
│   │   │   └── index.scss
│   │   │
│   │   └── components/
│   │       ├── buttons.scss
│   │       ├── cards.scss
│   │       └── effects.scss          # Grain, underline, shadow
│   │
│   ├── content/
│   │   ├── config.ts                 # Content collections config
│   │   ├── projects/
│   │   │   └── *.md                  # Markdown projects
│   │   └── blog/
│   │       └── *.md                  # Blog posts
│   │
│   └── env.d.ts
│
├── astro.config.mjs                  # Astro configuration
├── tailwind.config.cjs               # Tailwind config
├── tsconfig.json
├── package.json
└── README.md
```

---

## 🏗️ Arquitetura de Componentes

### Astro Components

```astro
---
// src/components/sections/Hero.astro
import { Image } from 'astro:assets';

interface Props {
  theme?: 'dark' | 'light' | 'warm';
}

const { theme = 'dark' } = Astro.props;
---

<section 
  data-theme={theme}
  data-barba="container"
  data-barba-namespace="home"
  class="hero"
  data-scroll-section
>
  <div class="hero__content" data-entrance-animation>
    <span class="hero__meta">Full Stack Developer</span>
    <h1 class="hero__title">
      Juan Benjamin
    </h1>
    <p class="hero__subtitle">
      Fullstack Developer
    </p>
  </div>
  
  <!-- Three.js Canvas Container -->
  <div id="hero-canvas" class="hero__canvas"></div>
</section>

<script>
  import { initHeroAnimation } from '@/scripts/gsap/entranceAnimations';
  import { HeroScene } from '@/scripts/three/scenes/heroScene';
  
  // Entrance animation
  initHeroAnimation();
  
  // Three.js scene
  const heroScene = new HeroScene('#hero-canvas');
  heroScene.init();
</script>

<style lang="scss">
  @import '@/styles/tokens.scss';
  
  .hero {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
    
    &__canvas {
      position: absolute;
      inset: 0;
      z-index: -1;
    }
  }
</style>
```

---

## 🔄 Barba.js Integration

### Setup Principal

```typescript
// src/scripts/barba/index.ts
import barba from '@barba/core';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Import transitions
import { fadeTransition } from './transitions';
import { initSmoothScroll } from '../utils/smoothScroll';

// Initialize Barba
export const initBarba = () => {
  barba.init({
    debug: import.meta.env.DEV,
    
    transitions: [fadeTransition],
    
    views: [
      {
        namespace: 'home',
        beforeEnter(data) {
          // Init home-specific animations
          import('../gsap/entranceAnimations').then((module) => {
            module.initHeroAnimation();
          });
        },
        afterLeave() {
          // Cleanup
          ScrollTrigger.getAll().forEach((st) => st.kill());
        },
      },
      {
        namespace: 'projects',
        beforeEnter() {
          // Init projects grid animations
        },
      },
    ],
  });
  
  // Initialize smooth scroll
  initSmoothScroll();
};

// Auto-init quando DOM estiver pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initBarba);
} else {
  initBarba();
}
```

### Transições Customizadas

```typescript
// src/scripts/barba/transitions.ts
import gsap from 'gsap';
import type { ITransitionData } from '@barba/core/dist/core/src/defs';

export const fadeTransition = {
  name: 'fade-transition',
  
  async leave(data: ITransitionData) {
    const done = this.async();
    
    const tl = gsap.timeline({
      onComplete: done,
    });
    
    // Animate out
    tl.to(data.current.container, {
      opacity: 0,
      y: -50,
      duration: 0.4,
      ease: 'power2.in',
    });
    
    return tl;
  },
  
  async enter(data: ITransitionData) {
    const done = this.async();
    
    // Reset scroll position
    window.scrollTo(0, 0);
    
    const tl = gsap.timeline({
      onComplete: done,
    });
    
    // Animate in
    tl.fromTo(
      data.next.container,
      {
        opacity: 0,
        y: 50,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
      }
    );
    
    return tl;
  },
};

// Slide transition — cortina elegante
export const slideTransition = {
  name: 'slide-transition',

  async leave(data: ITransitionData) {
    const done = this.async();

    const overlay = document.createElement('div');
    overlay.className = 'slide-overlay';
    overlay.style.cssText = `
      position: fixed; inset: 0; z-index: 9999;
      background: #1c0f0a;
      transform: scaleY(0);
      transform-origin: bottom;
    `;
    document.body.appendChild(overlay);

    const tl = gsap.timeline({
      onComplete: () => { done(); },
    });

    tl.to(overlay, {
      scaleY: 1,
      duration: 0.45,
      ease: '0.16, 1, 0.3, 1',
    });

    return tl;
  },

  async enter(data: ITransitionData) {
    const done = this.async();
    const overlay = document.querySelector('.slide-overlay') as HTMLElement;

    window.scrollTo(0, 0);

    const tl = gsap.timeline({ onComplete: done });

    tl
      .set(data.next.container, { opacity: 1 })
      .to(overlay, {
        scaleY: 0,
        transformOrigin: 'top',
        duration: 0.45,
        ease: '0.16, 1, 0.3, 1',
        onComplete: () => overlay?.remove(),
      });

    return tl;
  },
};
```

---

## 🎬 GSAP Animations System

### Entrance Animations

```typescript
// src/scripts/gsap/entranceAnimations.ts
import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(SplitText);

export const initHeroAnimation = () => {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  
  const title = hero.querySelector('.hero__title');
  const subtitle = hero.querySelector('.hero__subtitle');
  
  const tl = gsap.timeline({
    defaults: { ease: '0.16, 1, 0.3, 1' },
  });
  
  // Split text — line reveal editorial
  const split = new SplitText(title, { type: 'lines, words' });
  split.lines.forEach((line) => {
    const wrap = document.createElement('div');
    wrap.style.overflow = 'hidden';
    line.parentNode?.insertBefore(wrap, line);
    wrap.appendChild(line);
  });

  tl.fromTo(
    split.words,
    { y: '110%', opacity: 0 },
    { y: '0%', opacity: 1, stagger: 0.06, duration: 1.1 }
  ).fromTo(
    subtitle,
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.8 },
    '-=0.6'
  );
  
  return tl;
};

// Scroll reveal animation
export const initScrollReveal = () => {
  const elements = document.querySelectorAll('[data-scroll-reveal]');
  
  elements.forEach((element) => {
    gsap.fromTo(
      element,
      {
        opacity: 0,
        y: 100,
      },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        scrollTrigger: {
          trigger: element,
          start: 'top 80%',
          end: 'top 20%',
          toggleActions: 'play none none reverse',
        },
      }
    );
  });
};
```

---

## 🌌 Three.js Scene Management

```typescript
// src/scripts/three/scenes/heroScene.ts
import * as THREE from 'three';
import { gsap } from 'gsap';

export class HeroScene {
  private container: HTMLElement;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private particles: THREE.Points;
  private animationId: number | null = null;
  
  constructor(selector: string) {
    const element = document.querySelector(selector);
    if (!element) throw new Error(`Element ${selector} not found`);
    this.container = element as HTMLElement;
    
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    
    this.particles = new THREE.Points();
  }
  
  init() {
    this.setupRenderer();
    this.setupCamera();
    this.createParticles();
    this.addLights();
    this.animate();
    this.handleResize();
  }
  
  private setupRenderer() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.container.appendChild(this.renderer.domElement);
  }
  
  private setupCamera() {
    this.camera.position.z = 5;
  }
  
  private createParticles() {
    const geometry = new THREE.BufferGeometry();
    const count = 5000;
    const positions = new Float32Array(count * 3);
    
    for (let i = 0; i < count * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 10;
    }
    
    geometry.setAttribute(
      'position',
      new THREE.BufferAttribute(positions, 3)
    );
    
    const material = new THREE.PointsMaterial({
      size: 0.02,
      color: 0x00f5ff,
      transparent: true,
      opacity: 0.8,
    });
    
    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
  }
  
  private addLights() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);
  }
  
  private animate = () => {
    this.animationId = requestAnimationFrame(this.animate);
    
    // Rotate particles
    this.particles.rotation.y += 0.001;
    this.particles.rotation.x += 0.0005;
    
    this.renderer.render(this.scene, this.camera);
  };
  
  private handleResize() {
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }
  
  dispose() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    
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
  }
}
```

---

## 🎨 Smooth Scroll com Lenis

```typescript
// src/scripts/utils/smoothScroll.ts
import Lenis from '@studio-freight/lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export const initSmoothScroll = () => {
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 2,
  });
  
  // Integrate with GSAP ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update);
  
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  
  gsap.ticker.lagSmoothing(0);
  
  return lenis;
};
```

---

## 📦 Content Collections

```typescript
// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const projectsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    image: z.string(),
    tags: z.array(z.string()),
    github: z.string().url().optional(),
    demo: z.string().url().optional(),
    featured: z.boolean().default(false),
    pubDate: z.date(),
  }),
});

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    author: z.string().default('Juan Benjamin'),
    image: z.string(),
    tags: z.array(z.string()),
  }),
});

export const collections = {
  projects: projectsCollection,
  blog: blogCollection,
};
```

---

## ⚙️ Astro Config

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://juanbenjamin.dev',
  integrations: [
    tailwind(),
    sitemap(),
  ],
  vite: {
    ssr: {
      noExternal: ['three', 'gsap', '@barba/core'],
    },
  },
  build: {
    inlineStylesheets: 'auto',
  },
});
```

---

## 🚀 Performance Optimization

1. **Code Splitting** - Componentes pesados em dynamic imports
2. **Image Optimization** - Astro:assets para imagens responsivas
3. **Critical CSS** - Inline para above-the-fold
4. **Lazy Loading** - Three.js scenes carregadas on-demand
5. **Service Worker** - Cache estratégico para assets

---

## 🎯 Fluxo de Navegação

```
Homepage (dark theme — espresso background)
    ↓
User clicks "About"
    ↓
Barba intercepts navigation
    ↓
GSAP leave animation — cortina espresso sobe (scaleY)
    ↓
Fetch new page content
    ↓
Swap containers
    ↓
GSAP enter animation — cortina desce, página revela
    ↓
Initialize page-specific scripts
    ↓
Smooth scroll ready
```

---

## 📊 Métricas de Performance

**Targets:**
- Lighthouse Performance: > 95
- First Contentful Paint: < 1.2s
- Time to Interactive: < 2.5s
- Cumulative Layout Shift: < 0.1

Esta arquitetura garante uma experiência fluida, performática e visualmente impactante.
