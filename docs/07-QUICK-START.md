# Quick Start Guide - Portfolio Juan Benjamin

**De 0 a Deploy em Produção**

---

## 🚀 Início Rápido (15 minutos)

### 1. Setup Inicial

```bash
# Criar projeto Astro
npm create astro@latest portfolio-juan-benjamin

# Escolher:
# - Template: Empty
# - TypeScript: Yes (strict)
# - Dependencies: Yes
# - Git: Yes

cd portfolio-juan-benjamin
```

### 2. Instalar Dependências

```bash
# Core dependencies
npm install gsap three @barba/core @studio-freight/lenis

# Types
npm install -D @types/three

# Astro integrations
npx astro add tailwind
```

### 3. Estrutura Base

```bash
# Criar estrutura de pastas
mkdir -p src/{components/{animations,three,ui,navigation,sections},layouts,scripts/{gsap,three,barba,utils},styles/{themes,components},content/{projects,blog,experience,skills}}

# Criar arquivos base
touch src/scripts/gsap/index.ts
touch src/scripts/three/SceneManager.ts
touch src/scripts/barba/index.ts
touch src/styles/global.scss
touch src/styles/tokens.scss
```

---

## 📝 Configuração Inicial

### astro.config.mjs

```javascript
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://juanbenjamin.dev',
  integrations: [tailwind()],
  vite: {
    ssr: {
      noExternal: ['three', 'gsap', '@barba/core'],
    },
  },
});
```

### tsconfig.json

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@layouts/*": ["src/layouts/*"],
      "@scripts/*": ["src/scripts/*"],
      "@styles/*": ["src/styles/*"]
    }
  }
}
```

### package.json scripts

```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro check && astro build",
    "preview": "astro preview",
    "lint": "eslint . --ext .ts,.astro",
    "type-check": "astro check",
    "optimize:images": "node scripts/optimize-images.js"
  }
}
```

---

## 🎨 Design Tokens Setup

### src/styles/tokens.scss

```scss
// ☕ Coffee Scale
$espresso:     #1c0f0a;
$dark-roast:   #2e1a12;
$medium-roast: #5c3317;
$sienna:       #8b4513;

$caramel:      #c07840;
$amber:        #d4922a;
$latte:        #d4a878;

$oat:          #e8d5ba;
$cream:        #f5ede0;
$fog:          #f9f6f1;

$ink:          #1a1410;
$charcoal:     #3d2b1f;
$muted:        #8a6d5c;

$sage:         #6b7c72;
$slate:        #5a6470;

// Typography
$font-display: 'Cormorant Garamond', Georgia, serif;
$font-sans:    'DM Sans', system-ui, sans-serif;
$font-body:    'Inter', system-ui, sans-serif;
$font-code:    'JetBrains Mono', monospace;

// Export as CSS custom properties
:root {
  --espresso:     #{$espresso};
  --dark-roast:   #{$dark-roast};
  --caramel:      #{$caramel};
  --amber:        #{$amber};
  --latte:        #{$latte};
  --cream:        #{$cream};
  --fog:          #{$fog};
  --ink:          #{$ink};
  --muted:        #{$muted};

  --font-display: #{$font-display};
  --font-sans:    #{$font-sans};
  --font-body:    #{$font-body};
  --font-code:    #{$font-code};
}
```

---

## 🏗️ Layout Base

### src/layouts/BaseLayout.astro

```astro
---
interface Props {
  title: string;
  description: string;
}

const { title, description } = Astro.props;
---

<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content={description} />
  <title>{title}</title>
  
  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
    rel="stylesheet"
  />
  
  <!-- Global Styles -->
  <link rel="stylesheet" href="/src/styles/global.scss" />
</head>

<body>
  <!-- Barba wrapper -->
  <div data-barba="wrapper">
    <div data-barba="container">
      <slot />
    </div>
  </div>
  
  <!-- Init scripts -->
  <script>
    import '@/scripts/app.ts';
  </script>
</body>
</html>
```

---

## 🎬 GSAP Setup

### src/scripts/gsap/index.ts

```typescript
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { Flip } from 'gsap/Flip';

gsap.registerPlugin(ScrollTrigger, SplitText, Flip);

gsap.config({
  autoSleep: 60,
  force3D: true,
  nullTargetWarn: false,
});

CustomEase.create('elegant',   '0.25, 1, 0.5, 1');
CustomEase.create('editorial', '0.16, 1, 0.3, 1');

gsap.defaults({
  ease: 'elegant',
  duration: 0.8,
});

export { gsap, ScrollTrigger, SplitText, Flip };
```

---

## 🌐 Barba.js Setup

### src/scripts/barba/index.ts

```typescript
import barba from '@barba/core';
import { gsap } from '@/scripts/gsap';

export const initBarba = () => {
  barba.init({
    debug: false,
    
    transitions: [{
      name: 'default-transition',
      
      async leave(data) {
        const done = this.async();
        
        gsap.to(data.current.container, {
          opacity: 0,
          duration: 0.4,
          onComplete: done,
        });
      },
      
      async enter(data) {
        const done = this.async();
        
        window.scrollTo(0, 0);
        
        gsap.from(data.next.container, {
          opacity: 0,
          duration: 0.6,
          onComplete: done,
        });
      },
    }],
  });
};
```

---

## 🎯 Main App Script

### src/scripts/app.ts

```typescript
import { initBarba } from './barba';
import { gsap, ScrollTrigger } from './gsap';

// Init on load
const init = () => {
  console.log('🚀 Portfolio Juan Benjamin initialized');
  
  // Init Barba for page transitions
  initBarba();
  
  // Refresh ScrollTrigger
  ScrollTrigger.refresh();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Cleanup on page leave
window.addEventListener('barba:leave', () => {
  ScrollTrigger.getAll().forEach(st => st.kill());
});
```

---

## 🏠 Homepage Example

### src/pages/index.astro

```astro
---
import BaseLayout from '@/layouts/BaseLayout.astro';
import Hero from '@/components/sections/Hero.astro';
---

<BaseLayout
  title="Juan Benjamin - Full Stack Developer"
  description="Portfolio de Juan Benjamin Almeida Suzarte, desenvolvedor full stack especializado em React, Node.js e TypeScript"
>
  <main data-barba-namespace="home">
    <Hero />
    
    <section data-theme="light" class="about" data-scroll-reveal>
      <h2>Sobre Mim</h2>
      <p>Desenvolvedor Full Stack focado em experiências web de alto padrão.</p>
    </section>
  </main>
</BaseLayout>

<style lang="scss">
  @import '@/styles/tokens.scss';

  .about {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 6rem 2rem;

    &[data-theme="light"] {
      background: $fog;
      color: $ink;
    }

    h2 {
      font-family: $font-display;
      font-weight: 600;
      font-size: clamp(2.5rem, 5vw, 4rem);
      margin-bottom: 1.5rem;
    }
  }
</style>
```

---

## 🎨 Hero Component

### src/components/sections/Hero.astro

```astro
---
// Hero com Three.js particles
---

<section
  class="hero"
  data-theme="dark"
  data-hero
>
  <div id="hero-canvas" class="hero__canvas"></div>

  <div class="hero__content">
    <span class="hero__meta">Full Stack Developer</span>
    <h1 class="hero__title">
      Juan Benjamin
    </h1>
    <p class="hero__subtitle">
      Criando experiências web de alto padrão
    </p>
    <a href="/projects" class="btn-primary" data-magnetic>
      Ver Projetos →
    </a>
  </div>
</section>

<script>
  import { HeroParticleScene } from '@/scripts/three/scenes/HeroParticleScene';
  import { gsap, SplitText } from '@/scripts/gsap';
  
  // Three.js scene
  const scene = new HeroParticleScene('#hero-canvas');
  
  // Title animation — line reveal elegante
  import { initHeroAnimation } from '@/scripts/gsap/entranceAnimations';
  initHeroAnimation();
  
  // Cleanup
  window.addEventListener('barba:leave', () => {
    scene.dispose();
  });
</script>

<style lang="scss">
  @import '@/styles/tokens.scss';

  .hero {
    position: relative;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    background: $espresso;

    &__canvas {
      position: absolute;
      inset: 0;
      z-index: 0;
    }

    &__content {
      position: relative;
      z-index: 1;
      text-align: left;
      max-width: 800px;
      padding: 0 2rem;
    }

    &__meta {
      display: block;
      font-family: $font-sans;
      font-size: 0.875rem;
      font-weight: 400;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: $latte;
      margin-bottom: 1.5rem;
      opacity: 0; // Animado por GSAP
    }

    &__title {
      font-family: $font-display;
      font-weight: 300;
      font-style: italic;
      font-size: clamp(3.5rem, 10vw, 7rem);
      line-height: 0.95;
      letter-spacing: -0.02em;
      color: $cream;
      margin-bottom: 1.5rem;
    }

    &__subtitle {
      font-family: $font-body;
      font-size: clamp(1rem, 2vw, 1.2rem);
      color: $oat;
      opacity: 0.75;
      margin-bottom: 3rem;
      max-width: 400px;
    }
  }

  .btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.875rem 2rem;
    background: $caramel;
    color: $cream;
    text-decoration: none;
    font-family: $font-sans;
    font-size: 0.875rem;
    font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    border-radius: 2px;
    transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);

    &:hover {
      background: $amber;
      transform: translateY(-2px);
      box-shadow: 0 8px 32px rgba($caramel, 0.25);
    }
  }
</style>
```

---

## 📦 Content Example

### src/content/projects/example.md

```markdown
---
title: "Meu Primeiro Projeto"
description: "Um projeto incrível com React e Node.js"
thumbnail: "/images/project-thumb.jpg"
tags: ["React", "Node.js", "TypeScript"]
tech: ["React", "Node.js", "PostgreSQL"]
featured: true
status: "completed"
category: "fullstack"
startDate: 2024-01-01
pubDate: 2024-06-01
theme: "dark"
---

## Descrição

Este é um projeto exemplo...
```

---

## 🚀 Development Workflow

### 1. Start Dev Server

```bash
npm run dev
```

Acesse: http://localhost:4321

### 2. Criar Nova Página

```bash
# Criar about.astro
touch src/pages/about.astro
```

```astro
---
import BaseLayout from '@/layouts/BaseLayout.astro';
---

<BaseLayout title="About" description="Sobre mim">
  <main data-barba-namespace="about">
    <h1>Sobre Juan Benjamin</h1>
  </main>
</BaseLayout>
```

### 3. Adicionar Novo Projeto

```bash
# Criar arquivo markdown
touch src/content/projects/novo-projeto.md
```

### 4. Deploy

```bash
# Build
npm run build

# Deploy para Vercel
vercel --prod
```

---

## 🐛 Troubleshooting

### GSAP não funciona

```typescript
// Verificar se plugins estão registrados
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
```

### Three.js cena preta

```typescript
// Verificar se camera position está definida
this.camera.position.z = 5;
```

### Barba não detecta páginas

```astro
<!-- Verificar se tem data-barba="container" -->
<div data-barba="container">
  <!-- content -->
</div>
```

### Build falha

```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm install
```

---

## ✅ Checklist Primeiro Deploy

- [ ] Configurar variáveis de ambiente
- [ ] Otimizar imagens
- [ ] Testar todas as páginas
- [ ] Verificar responsividade
- [ ] Lighthouse score > 90
- [ ] Meta tags SEO
- [ ] Analytics configurado
- [ ] Custom domain
- [ ] SSL ativo

---

## 📚 Próximos Passos

1. **Adicionar mais seções** (Skills, Experience, Contact)
2. **Implementar blog** com Content Collections
3. **Adicionar animações** com GSAP
4. **Criar efeitos 3D** com Three.js
5. **Otimizar performance** (target 95+ Lighthouse)
6. **Setup CI/CD** com GitHub Actions

---

## 🎓 Recursos de Aprendizado

- [Astro Docs](https://docs.astro.build)
- [GSAP Docs](https://greensock.com/docs/)
- [Three.js Fundamentals](https://threejs.org/manual/)
- [Barba.js Guide](https://barba.js.org/docs/)

---

**Pronto! Agora você tem uma base sólida para criar um portfolio incrível! 🚀**

Dúvidas? Consulte os outros arquivos MD para detalhes específicos de cada área.
