import { gsap, ScrollTrigger } from './index';

/**
 * Entrance loader sequence:
 *   "dev" slides up → "suzarte" follows → line sweeps → tag fades →
 *   pause → loader panel slides off → onComplete()
 */
export const initEntranceAnimation = (onComplete?: () => void) => {
  const loader    = document.getElementById('entrance-loader');

  if (!loader) {
    onComplete?.();
    return;
  }

  const devEl     = loader.querySelector<HTMLElement>('.e-loader__dev');
  const suzarteEl = loader.querySelector<HTMLElement>('.e-loader__suzarte');
  const lineEl    = loader.querySelector<HTMLElement>('.e-loader__line');
  const tagEl     = loader.querySelector<HTMLElement>('.e-loader__tag');

  const tl = gsap.timeline({
    defaults: { ease: 'power3.out' },
    onComplete: () => {
      loader.style.display = 'none';
      onComplete?.();
    },
  });

  // Phase 1 — logo elements reveal
  tl.to(devEl,     { y: '0%',    duration: 0.65 }, 0.15)
    .to(suzarteEl, { y: '0%',    duration: 0.65 }, 0.3)
    .to(lineEl,    { width: 280, duration: 0.55, ease: 'power2.inOut' }, 0.6)
    .to(tagEl,     { opacity: 1, duration: 0.4  }, 0.85)

  // Phase 2 — hold
    .to({}, { duration: 0.55 })

  // Phase 3 — slide the entire loader up
    .to(loader, {
      yPercent: -100,
      duration: 0.75,
      ease: 'power3.inOut',
    });

  return tl;
};

/**
 * Hero entrance animation — animates Scene 0 elements after the loader exits
 */
export const initHeroAnimation = () => {
  const scene0 = document.querySelector<HTMLElement>('.hero-scene--0');
  if (!scene0) return;

  const meta      = scene0.querySelector('.hero__meta');
  const nameFirst = scene0.querySelector<HTMLElement>('.hero__title-first');
  const nameLast  = scene0.querySelector<HTMLElement>('.hero__title-last');
  const subtitle  = scene0.querySelector('.hero__subtitle');
  const social    = scene0.querySelector('.hero__social');
  const actions   = scene0.querySelector('.hero__actions');
  const right     = scene0.querySelector('.hero__right');

  // Elements were already set to opacity:0 in app.ts before loader started,
  // so no gsap.set needed here — just animate them in.
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  if (meta)      tl.to(meta,      { opacity: 1, y: 0, duration: 0.6 }, 0.05);
  if (nameFirst) tl.to(nameFirst, { opacity: 1, y: 0, duration: 0.6 }, 0.15);
  if (nameLast)  tl.to(nameLast,  { opacity: 1, y: 0, duration: 0.9, ease: 'power4.out' }, 0.25);
  if (subtitle)  tl.to(subtitle,  { opacity: 1, y: 0, duration: 0.7 }, '-=0.5');
  if (social)    tl.to(social,    { opacity: 1, y: 0, duration: 0.6 }, '-=0.5');
  if (actions)   tl.to(actions,   { opacity: 1, y: 0, duration: 0.6 }, '-=0.45');
  if (right)     tl.to(right,     { opacity: 1, x: 0, duration: 0.9 }, 0.3);

  return tl;
};

/**
 * Scroll reveal for elements with [data-scroll-reveal]
 */
export const initScrollReveal = () => {
  const elements = document.querySelectorAll('[data-scroll-reveal]');

  elements.forEach(el => {
    gsap.fromTo(
      el,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      }
    );
  });
};

/**
 * Skill bar proficiency animation on scroll
 */
export const initSkillBars = () => {
  const bars = document.querySelectorAll<HTMLElement>('.skills__bar-fill');

  bars.forEach(bar => {
    const target = bar.dataset.proficiency ?? bar.style.getPropertyValue('--proficiency') ?? '0%';
    bar.style.setProperty('--proficiency', '0%');

    ScrollTrigger.create({
      trigger: bar,
      start: 'top 90%',
      once: true,
      onEnter: () => {
        gsap.to(bar, {
          '--proficiency': target,
          duration: 1.4,
          ease: 'power3.out',
        } as gsap.TweenVars);
      },
    });
  });
};
