import { gsap, ScrollTrigger } from './index';

/**
 * Stage panel transitions — inside the 2300vh hero-scroll wrapper.
 *
 * Uses explicit "top+=${px} top" format for ScrollTrigger start/end
 * so positions are absolute scroll values (matching heroScroll.ts pattern).
 *
 * Scroll map (1 unit = window.innerHeight):
 *   0–5      Hero scenes (heroScroll.ts)
 *   5–7      About: clip-path inset reveal (2VH range)
 *   7–10     About dwell
 *   10–12    Stack: circle clip-path (2VH range)
 *   12–15    Stack dwell
 *   15–17    EXPERIÊNCIA text-mask zoom (2VH range)
 *   16.5–17.5 Exp-word fades out (1VH range)
 *   17.5–19  Experience dwell
 *   19–20.5  Project 0: polygon wipe (1.5VH range)
 *   20.5–22  Project 1: ellipse reveal (1.5VH range)
 */
export const initStageTransitions = () => {
  const wrapper = document.querySelector<HTMLElement>('[data-hero-scroll]');
  if (!wrapper) return;

  const VH = window.innerHeight;

  // Absolute scroll position: "top+=${px} top" means scrollY = px
  const at = (vhUnits: number) => `top+=${Math.round(VH * vhUnits)} top`;

  const aboutPanel    = wrapper.querySelector<HTMLElement>('.stage-panel--about');
  const stackPanel    = wrapper.querySelector<HTMLElement>('.stage-panel--stack');
  const expWord       = wrapper.querySelector<HTMLElement>('[data-exp-word]');
  const expWordText   = expWord?.querySelector<HTMLElement>('.stage-exp-word__text');
  const expPanel      = wrapper.querySelector<HTMLElement>('.stage-panel--experience');
  const projectPanels = Array.from(
    wrapper.querySelectorAll<HTMLElement>('.stage-panel--project')
  );

  // DEBUG
  console.log('[Stage] VH =', VH, '| wrapper h =', wrapper.scrollHeight);
  console.log('[Stage] panels found:', {
    about: !!aboutPanel, stack: !!stackPanel, exp: !!expPanel,
    expWord: !!expWord, projects: projectPanels.length,
  });

  // ── Initial GSAP states ────────────────────────────────────────────────────
  if (aboutPanel) gsap.set(aboutPanel, { clipPath: 'inset(100% 0 0 0)', pointerEvents: 'none' });
  if (stackPanel) gsap.set(stackPanel, { clipPath: 'circle(0% at 50% 50%)', pointerEvents: 'none' });
  if (expWord)    gsap.set(expWord, { opacity: 0 });
  if (expWordText) {
    gsap.set(expWordText, {
      xPercent: -50,
      yPercent: -50,
      scale: 6,
      transformOrigin: '50% 50%',
    });
  }
  if (expPanel) gsap.set(expPanel, { opacity: 0, pointerEvents: 'none' });
  projectPanels.forEach(p => gsap.set(p, { opacity: 0, pointerEvents: 'none' }));

  // ── ABOUT: clip-path inset from bottom (5VH → 7VH) ──────────────────────
  if (aboutPanel) {
    gsap.to(aboutPanel, {
      clipPath: 'inset(0% 0 0 0)',
      ease: 'power2.out',
      scrollTrigger: {
        trigger: wrapper,
        start: at(5),
        end:   at(7),
        scrub: 1.2,
        markers: true, // DEBUG
        onEnter:     () => gsap.set(aboutPanel, { pointerEvents: 'auto' }),
        onLeaveBack: () => gsap.set(aboutPanel, { pointerEvents: 'none' }),
      },
    });
  }

  // ── STACK: circle reveal from centre (10VH → 12VH) ───────────────────────
  if (stackPanel) {
    gsap.to(stackPanel, {
      clipPath: 'circle(150% at 50% 50%)',
      ease: 'power2.out',
      scrollTrigger: {
        trigger: wrapper,
        start: at(10),
        end:   at(12),
        scrub: 1.2,
        onEnter:     () => gsap.set(stackPanel, { pointerEvents: 'auto' }),
        onLeaveBack: () => gsap.set(stackPanel, { pointerEvents: 'none' }),
      },
    });
  }

  // ── EXPERIÊNCIA TEXT-MASK REVEAL ────────────────────────────────────────────
  // Phase 1: snap experience panel visible at 14.8VH
  if (expPanel) {
    ScrollTrigger.create({
      trigger: wrapper,
      start: at(14.8),
      end:   at(15),
      onEnter:     () => gsap.set(expPanel, { opacity: 1, pointerEvents: 'auto' }),
      onLeaveBack: () => gsap.set(expPanel, { opacity: 0, pointerEvents: 'none' }),
    });
  }

  // Phase 2: exp-word overlay fades in (15VH → 15.4VH)
  if (expWord) {
    gsap.to(expWord, {
      opacity: 1,
      ease: 'power2.in',
      scrollTrigger: {
        trigger: wrapper,
        start: at(15),
        end:   at(15.4),
        scrub: 0.8,
      },
    });

    // Phase 4: overlay fades out (16.5VH → 17.5VH)
    gsap.to(expWord, {
      opacity: 0,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: wrapper,
        start: at(16.5),
        end:   at(17.5),
        scrub: 1,
      },
    });
  }

  // Phase 3: word text zooms scale(6) → scale(1) (15VH → 17VH)
  if (expWordText) {
    gsap.to(expWordText, {
      scale: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: wrapper,
        start: at(15),
        end:   at(17),
        scrub: 1.2,
      },
    });
  }

  // ── PROJECTS: varied clip-path reveals ─────────────────────────────────────
  const PROJ_START  = 19;
  const PROJ_STRIDE = 1.5;

  const projectClips: { from: string; to: string }[] = [
    { from: 'polygon(0 0, 0 0, 0 0, 0 0)',   to: 'polygon(0 0, 200% 0, 200% 200%, 0 200%)' },
    { from: 'ellipse(0% 0% at 50% 50%)',       to: 'ellipse(150% 150% at 50% 50%)' },
  ];

  projectPanels.forEach((panel, i) => {
    const t0   = PROJ_START + i * PROJ_STRIDE;
    const bg   = panel.querySelector<HTMLElement>('[data-proj-bg]');
    const content = panel.querySelector<HTMLElement>('[data-proj-content]');
    const clip = projectClips[i];

    // Panel opacity snaps on
    gsap.to(panel, {
      opacity: 1,
      scrollTrigger: {
        trigger: wrapper,
        start: at(t0),
        end:   at(t0 + 0.2),
        scrub: 0.8,
        onEnter:     () => gsap.set(panel, { pointerEvents: 'auto' }),
        onLeaveBack: () => gsap.set(panel, { opacity: 0, pointerEvents: 'none' }),
      },
    });

    // Background revealed via clip-path
    if (bg && clip) {
      gsap.set(bg, { clipPath: clip.from });
      gsap.to(bg, {
        clipPath: clip.to,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: wrapper,
          start: at(t0),
          end:   at(t0 + 0.8),
          scrub: 1.2,
        },
      });
    } else if (bg) {
      gsap.set(bg, { clipPath: 'inset(100% 0 0 0)' });
      gsap.to(bg, {
        clipPath: 'inset(0% 0 0 0)',
        ease: 'power2.out',
        scrollTrigger: {
          trigger: wrapper,
          start: at(t0),
          end:   at(t0 + 0.8),
          scrub: 1.2,
        },
      });
    }

    // Content fades + slides up
    if (content) {
      gsap.set(content, { opacity: 0, y: 50 });
      gsap.to(content, {
        opacity: 1,
        y: 0,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: wrapper,
          start: at(t0 + 0.5),
          end:   at(t0 + 1.2),
          scrub: 1.2,
        },
      });
    }
  });

  // ── Nav scroll targets ──────────────────────────────────────────────────────
  const NAV_TARGETS: Record<string, number> = {
    about:      Math.round(VH * 6),
    stack:      Math.round(VH * 11),
    experience: Math.round(VH * 16),
    projects:   Math.round(VH * 19.5),
  };

  document.querySelectorAll<HTMLAnchorElement>('[data-nav-target]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const key = link.dataset.navTarget;
      if (key && NAV_TARGETS[key] !== undefined) {
        window.scrollTo({ top: NAV_TARGETS[key], behavior: 'smooth' });
      }
    });
  });
};
