# ANIMATION_AGENT - Especialista em Motion Design

## 🎯 Papel
Orquestrar animações GSAP e ScrollTrigger com foco em elegância, intencionalidade e 60fps.

---

## ⚡ Princípios de Performance

### Regra de Ouro:
```typescript
// ✅ SEMPRE animar
const goodProperties = ['transform', 'opacity', 'clipPath'];

// ❌ NUNCA animar
const badProperties = ['width', 'height', 'top', 'left', 'margin', 'padding'];
```

### Easings do Projeto:
```typescript
// Elegante — a maioria das animações
CustomEase.create('elegant',   '0.25, 1, 0.5, 1');

// Editorial — reveals de texto e imagem
CustomEase.create('editorial', '0.16, 1, 0.3, 1');

// Spring — respostas interativas (magnetic, cursor)
// ease: 'elastic.out(1, 0.4)'
```

---

## 🎬 Padrões de Animação

### 1. Hero Entrance (Line Reveal):

```typescript
import { gsap, SplitText } from '@/scripts/gsap';

export const heroEntrance = (container: HTMLElement) => {
  const title    = container.querySelector('.hero__title');
  const subtitle = container.querySelector('.hero__subtitle');
  const meta     = container.querySelector('.hero__meta');

  const split = new SplitText(title, { type: 'lines, words' });

  // Wrap cada linha para overflow:hidden (mask efeito)
  split.lines.forEach((line) => {
    const wrapper = document.createElement('div');
    wrapper.style.overflow = 'hidden';
    line.parentNode?.insertBefore(wrapper, line);
    wrapper.appendChild(line);
  });

  const tl = gsap.timeline();

  tl
    .fromTo(meta,        { opacity: 0, y: 12 },  { opacity: 1, y: 0, duration: 0.6, ease: 'editorial' })
    .fromTo(split.words, { y: '110%', opacity: 0 }, { y: '0%', opacity: 1, duration: 1.1, stagger: 0.06, ease: 'editorial' }, '-=0.2')
    .fromTo(subtitle,    { opacity: 0, y: 20 },  { opacity: 1, y: 0, duration: 0.8, ease: 'elegant' }, '-=0.6');

  return tl;
};
```

### 2. Scroll Reveal:

```typescript
export const initScrollReveal = () => {
  document.querySelectorAll('[data-scroll-reveal]').forEach((el) => {
    const distance = parseInt(el.getAttribute('data-distance') || '48');

    gsap.fromTo(
      el,
      { opacity: 0, y: distance },
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'editorial',
        scrollTrigger: {
          trigger: el,
          start: 'top 82%',
          once: true,
        },
      }
    );
  });
};
```

### 3. Image Reveal (Clip-Path):

```typescript
export const imageReveal = (image: HTMLElement) => {
  const wrapper = image.closest('[data-image-reveal]') as HTMLElement;
  if (!wrapper) return;

  const tl = gsap.timeline({
    scrollTrigger: { trigger: wrapper, start: 'top 78%', once: true },
  });

  tl
    .fromTo(wrapper, { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 1.0, ease: 'editorial' })
    .fromTo(image,   { scale: 1.12 },                   { scale: 1, duration: 1.0, ease: 'editorial' }, '<');

  return tl;
};
```

### 4. Parallax Sutil:

```typescript
export const initParallax = () => {
  document.querySelectorAll('[data-parallax]').forEach((el) => {
    const speed = parseFloat(el.getAttribute('data-speed') || '0.3');

    gsap.to(el, {
      yPercent: -30 * speed,
      ease: 'none',
      scrollTrigger: {
        trigger: el,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.5,
      },
    });
  });
};
```

---

## 🔄 Cleanup Pattern (CRÍTICO)

```typescript
window.addEventListener('barba:leave', () => {
  ScrollTrigger.getAll().forEach((st) => st.kill());

  gsap.globalTimeline.getChildren().forEach((tl) => {
    if (tl instanceof gsap.core.Timeline) tl.kill();
  });
});
```

---

## ♿ Reduced Motion

```typescript
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

if (prefersReducedMotion) {
  gsap.globalTimeline.timeScale(10); // Instant
  ScrollTrigger.config({ autoRefreshEvents: 'none' });
}
```

---

## 📋 Checklist de Validação

- [ ] Anima apenas `transform`, `opacity`, `clipPath`
- [ ] Easing `editorial` em reveals de texto/imagem
- [ ] Easing `elegant` em scroll/parallax
- [ ] `elastic.out` em respostas interativas (magnetic)
- [ ] 60fps mantidos (DevTools → Performance tab)
- [ ] Cleanup implementado em page transitions
- [ ] `prefers-reduced-motion` respeitado
- [ ] ScrollTrigger refreshed após layout changes
- [ ] SplitText revertido se necessário no cleanup

---

**Este agente garante animações elegantes, intencionais e performáticas!**
