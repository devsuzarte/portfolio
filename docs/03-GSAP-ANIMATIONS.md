# Guia de Animações GSAP - Portfolio Juan Benjamin

**Objetivo:** Animações elegantes, intencionais e performáticas — movimento que serve ao conteúdo

---

## 📚 Setup e Configuração

### Instalação

```bash
npm install gsap @studio-freight/lenis
```

### Imports e Registro de Plugins

```typescript
// src/scripts/gsap/index.ts
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { SplitText } from 'gsap/SplitText';
import { Flip } from 'gsap/Flip';
import { CustomEase } from 'gsap/CustomEase';

gsap.registerPlugin(
  ScrollTrigger,
  ScrollSmoother,
  SplitText,
  Flip,
  CustomEase
);

// Easings customizados — elegantes
CustomEase.create('elegant', '0.25, 1, 0.5, 1');
CustomEase.create('editorial', '0.16, 1, 0.3, 1');

gsap.config({
  autoSleep: 60,
  force3D: true,
  nullTargetWarn: false,
});

gsap.defaults({
  ease: 'elegant',
  duration: 0.8,
});

export { gsap, ScrollTrigger, ScrollSmoother, SplitText, Flip, CustomEase };
```

---

## 🎬 1. Animações de Entrada (Entrance Animations)

### Hero Section — Entrada Tipográfica

```typescript
// src/scripts/gsap/entranceAnimations.ts
import { gsap, SplitText } from './index';

export const initHeroAnimation = () => {
  const hero = document.querySelector('[data-hero]');
  if (!hero) return;

  const title    = hero.querySelector('.hero__title');
  const subtitle = hero.querySelector('.hero__subtitle');
  const cta      = hero.querySelector('.hero__cta');
  const meta     = hero.querySelector('.hero__meta');

  const tl = gsap.timeline({
    defaults: { ease: 'editorial' },
  });

  // Split text — animação por linha, não por caractere aleatório
  const split = new SplitText(title, {
    type: 'lines, words',
    linesClass: 'line',
  });

  // Container de cada linha recebe overflow:hidden para mask
  split.lines.forEach((line) => {
    (line as HTMLElement).style.overflow = 'hidden';
  });

  tl
    // Meta / eyebrow (cargo, label)
    .fromTo(
      meta,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.6 }
    )
    // Título — cada palavra sobe do baseline com stagger sutil
    .fromTo(
      split.words,
      { y: '110%', opacity: 0 },
      {
        y: '0%',
        opacity: 1,
        duration: 1.1,
        stagger: 0.06,
      },
      '-=0.2'
    )
    // Subtítulo
    .fromTo(
      subtitle,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8 },
      '-=0.6'
    )
    // CTA
    .fromTo(
      cta,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.6 },
      '-=0.4'
    );

  return tl;
};
```

### Stagger Fade In (Cards, Itens de Lista)

```typescript
export const staggerFadeIn = (
  elements: HTMLElement[] | NodeListOf<Element>,
  options: {
    stagger?: number;
    delay?: number;
    direction?: 'up' | 'down' | 'left' | 'right';
    distance?: number;
  } = {}
) => {
  const { stagger = 0.12, delay = 0, direction = 'up', distance = 40 } = options;

  const from: Record<string, number | string> = { opacity: 0 };
  if (direction === 'up')    from.y = distance;
  if (direction === 'down')  from.y = -distance;
  if (direction === 'left')  from.x = -distance;
  if (direction === 'right') from.x = distance;

  return gsap.fromTo(
    elements,
    from,
    {
      opacity: 1,
      x: 0,
      y: 0,
      duration: 0.9,
      stagger,
      delay,
      ease: 'editorial',
    }
  );
};
```

### Line Reveal (Headings de Seção)

```typescript
// Reveal de heading com máscara de linha — efeito editorial
export const lineReveal = (element: HTMLElement) => {
  const split = new SplitText(element, { type: 'lines' });

  split.lines.forEach((line) => {
    const wrapper = document.createElement('div');
    wrapper.style.overflow = 'hidden';
    wrapper.style.display = 'block';
    line.parentNode?.insertBefore(wrapper, line);
    wrapper.appendChild(line);
  });

  return gsap.fromTo(
    split.lines,
    { y: '105%' },
    {
      y: '0%',
      duration: 1,
      stagger: 0.08,
      ease: 'editorial',
      scrollTrigger: {
        trigger: element,
        start: 'top 80%',
        once: true,
      },
    }
  );
};
```

---

## 📜 2. Scroll Animations (ScrollTrigger)

### Scroll Reveal Genérico

```typescript
// src/scripts/gsap/scrollAnimations.ts
import { gsap, ScrollTrigger } from './index';

export const initScrollReveal = () => {
  const elements = document.querySelectorAll('[data-scroll-reveal]');

  elements.forEach((element) => {
    const direction = element.getAttribute('data-direction') || 'up';
    const distance  = parseInt(element.getAttribute('data-distance') || '48');

    const from: Record<string, number | string> = { opacity: 0 };
    if (direction === 'up')    from.y = distance;
    if (direction === 'down')  from.y = -distance;
    if (direction === 'left')  from.x = -distance;
    if (direction === 'right') from.x = distance;

    gsap.fromTo(
      element,
      from,
      {
        opacity: 1,
        x: 0,
        y: 0,
        duration: 0.9,
        ease: 'editorial',
        scrollTrigger: {
          trigger: element,
          start: 'top 82%',
          toggleActions: 'play none none none',
          once: true,
        },
      }
    );
  });
};
```

### Parallax Sutil

```typescript
export const initParallax = () => {
  const elements = document.querySelectorAll('[data-parallax]');

  elements.forEach((element) => {
    const speed = parseFloat(element.getAttribute('data-speed') || '0.3');

    gsap.to(element, {
      yPercent: -30 * speed,
      ease: 'none',
      scrollTrigger: {
        trigger: element,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.5,
      },
    });
  });
};
```

### Seção Pinada com Animação

```typescript
export const createPinnedSection = (trigger: string, content: string) => {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger,
      start: 'top top',
      end: 'bottom bottom',
      pin: content,
      scrub: 1.2,
      anticipatePin: 1,
    },
  });

  tl.fromTo(
    `${content} .pinned__content`,
    { opacity: 1, y: 0 },
    { opacity: 0, y: -30, duration: 1 }
  );

  return tl;
};
```

### Scroll Horizontal

```typescript
export const createHorizontalScroll = (container: HTMLElement) => {
  const sections = container.querySelectorAll('.horizontal-section');
  const totalWidth = Array.from(sections).reduce(
    (acc, s) => acc + (s as HTMLElement).offsetWidth,
    0
  );

  gsap.to(sections, {
    xPercent: -100 * (sections.length - 1),
    ease: 'none',
    scrollTrigger: {
      trigger: container,
      pin: true,
      scrub: 1,
      snap: 1 / (sections.length - 1),
      end: () => `+=${totalWidth}`,
    },
  });
};
```

### Counter com ScrollTrigger

```typescript
export const animateCounter = (element: HTMLElement) => {
  const target   = parseInt(element.getAttribute('data-target') || '0');
  const duration = parseFloat(element.getAttribute('data-duration') || '1.8');
  const counter  = { value: 0 };

  gsap.to(counter, {
    value: target,
    duration,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: element,
      start: 'top 80%',
      once: true,
    },
    onUpdate: () => {
      element.textContent = Math.floor(counter.value).toString();
    },
  });
};
```

---

## 🔀 3. Page Transitions (FLIP)

### FLIP Transition Genérico

```typescript
// src/scripts/gsap/flipTransitions.ts
import { Flip } from './index';

export const createFlipTransition = (
  elements: HTMLElement[],
  callback: () => void
) => {
  const state = Flip.getState(elements);
  callback();

  return Flip.from(state, {
    duration: 0.9,
    ease: 'editorial',
    absolute: true,
    scale: true,
    stagger: 0.04,
  });
};
```

### Card → Detail Transition

```typescript
export const cardToDetailTransition = (
  card: HTMLElement,
  detailContainer: HTMLElement
) => {
  const cardImage = card.querySelector('img');
  const cardTitle = card.querySelector('.card__title');
  const state = Flip.getState([cardImage, cardTitle]);

  detailContainer.appendChild(cardImage!.cloneNode(true));
  detailContainer.appendChild(cardTitle!.cloneNode(true));

  return Flip.from(state, {
    duration: 1.1,
    ease: 'editorial',
    scale: true,
    absolute: true,
    onComplete: () => {
      (card as HTMLElement).style.opacity = '0';
    },
  });
};
```

---

## 🎨 4. Efeitos Interativos

### Botão Magnético

```typescript
// src/scripts/gsap/effects.ts
export const initMagneticButtons = () => {
  const buttons = document.querySelectorAll('[data-magnetic]');

  buttons.forEach((button) => {
    const btn = button as HTMLElement;

    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      gsap.to(btn, {
        x: x * 0.25,
        y: y * 0.25,
        duration: 0.4,
        ease: 'power2.out',
      });
    });

    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: 'elastic.out(1, 0.4)',
      });
    });
  });
};
```

### Cursor Follower Elegante

```typescript
export const initCustomCursor = () => {
  const cursor = document.createElement('div');
  cursor.className = 'custom-cursor';
  document.body.appendChild(cursor);

  let mouseX = 0;
  let mouseY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Follower suave com lag elegante
  gsap.ticker.add(() => {
    gsap.set(cursor, { x: mouseX, y: mouseY });
  });

  // Estado em hover de links/buttons
  document.querySelectorAll('a, button, [data-cursor-hover]').forEach((el) => {
    el.addEventListener('mouseenter', () => {
      gsap.to(cursor, { scale: 2.5, duration: 0.3, ease: 'power2.out' });
    });
    el.addEventListener('mouseleave', () => {
      gsap.to(cursor, { scale: 1, duration: 0.4, ease: 'elastic.out(1, 0.4)' });
    });
  });
};
```

### Reveal de Imagem com Clip

```typescript
// Revela imagem com cortina que abre — elegante
export const imageReveal = (image: HTMLElement) => {
  const wrapper = image.closest('[data-image-reveal]') as HTMLElement;
  if (!wrapper) return;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: wrapper,
      start: 'top 78%',
      once: true,
    },
  });

  tl
    .fromTo(
      wrapper,
      { clipPath: 'inset(0 100% 0 0)' },
      { clipPath: 'inset(0 0% 0 0)', duration: 1.0, ease: 'editorial' }
    )
    .fromTo(
      image,
      { scale: 1.12 },
      { scale: 1, duration: 1.0, ease: 'editorial' },
      '<'
    );

  return tl;
};
```

---

## 🔧 5. Utilitários e Helpers

### Cleanup

```typescript
// src/scripts/gsap/utils.ts
export const killAllScrollTriggers = () => {
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
};

export const resetGSAP = () => {
  killAllScrollTriggers();
  ScrollTrigger.refresh();
};
```

### Performance

```typescript
export const optimizeForPerformance = () => {
  // Reduz no mobile
  if (window.innerWidth < 768) {
    gsap.config({ force3D: false });
  }

  // Respeita prefers-reduced-motion
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  if (prefersReducedMotion) {
    gsap.globalTimeline.timeScale(10); // acelera tudo pra parecer instantâneo
    ScrollTrigger.config({ autoRefreshEvents: 'none' });
  }
};
```

---

## 📋 6. Uso em Astro Components

```astro
---
// src/components/AnimatedSection.astro
interface Props {
  theme?: 'dark' | 'light' | 'warm';
}
const { theme = 'dark' } = Astro.props;
---

<section
  data-theme={theme}
  data-scroll-reveal
  data-direction="up"
  data-distance="48"
  class="section"
>
  <h2 data-line-reveal>Título da Seção</h2>
  <p data-fade-in>Conteúdo aqui.</p>
</section>

<script>
  import { initScrollReveal } from '@/scripts/gsap/scrollAnimations';
  import { lineReveal } from '@/scripts/gsap/entranceAnimations';

  initScrollReveal();

  document.querySelectorAll('[data-line-reveal]').forEach((el) => {
    lineReveal(el as HTMLElement);
  });

  window.addEventListener('barba:leave', () => {
    ScrollTrigger.getAll().forEach((st) => st.kill());
  });
</script>
```

---

## 🎯 Checklist de Performance

- [ ] Animar apenas `transform` e `opacity`
- [ ] Force3D ativado para hardware acceleration
- [ ] ScrollTrigger limpo em page transitions
- [ ] Timelines destruídos no cleanup
- [ ] Stagger values ≤ 0.15s (não lento demais)
- [ ] `prefers-reduced-motion` respeitado
- [ ] 60fps em todas as animações (DevTools → Performance)
- [ ] Will-change removido após animação concluída

---

## 🚀 Inicialização Global

```typescript
// src/scripts/app.ts
import { initHeroAnimation }             from './gsap/entranceAnimations';
import { initScrollReveal, initParallax } from './gsap/scrollAnimations';
import { initMagneticButtons, initCustomCursor, imageReveal } from './gsap/effects';
import { optimizeForPerformance }        from './gsap/utils';

export const initAnimations = () => {
  optimizeForPerformance();
  initHeroAnimation();
  initScrollReveal();
  initParallax();
  initMagneticButtons();
  initCustomCursor();

  // Image reveals
  document.querySelectorAll('[data-image-reveal] img').forEach((img) => {
    imageReveal(img as HTMLElement);
  });
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAnimations);
} else {
  initAnimations();
}
```
