import { gsap, ScrollTrigger } from './index';
import { initTechConnections } from './techConnections';

const TOTAL_FRAMES = 240;

// Scene transitions use dur=0.8, trans=0.12 → transitions at 0.8, 1.8, 2.8
// Timeline extended with a 1.5-unit dwell so Scene 3 stays visible for ~170vh of scroll
// Total timeline duration ≈ 4.42 units
// With 600vh hero (500vh scroll): 1 unit ≈ 113vh scroll travel

export const initHeroScroll = () => {
  const wrapper  = document.querySelector<HTMLElement>('[data-hero-scroll]');
  const viewport = wrapper?.querySelector<HTMLElement>('.hero-scroll__viewport');
  const canvas   = wrapper?.querySelector<HTMLCanvasElement>('[data-hero-canvas]');
  if (!wrapper || !viewport || !canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const frameBase   = canvas.dataset.frameBase ?? '';
  const scenes      = wrapper.querySelectorAll<HTMLElement>('.hero-scene');
  const dots        = wrapper.querySelectorAll<HTMLElement>('.scene-nav__dot');
  const totalScenes = scenes.length;

  // ── Frame store ────────────────────────────────────────────────────────────
  const frameImages: (HTMLImageElement | null)[] = new Array(TOTAL_FRAMES).fill(null);
  let currentFrameIndex = 0;
  let rafId: number | null = null;

  const pad = (n: number) => String(n + 1).padStart(3, '0');

  const loadFrame = (i: number) => {
    const img = new Image();
    img.src = `${frameBase}ezgif-frame-${pad(i)}.jpg`;
    img.onload = () => {
      frameImages[i] = img;
    };
  };

  // Load first 60 immediately; rest staggered to avoid blocking the main thread
  for (let i = 0; i < TOTAL_FRAMES; i++) {
    if (i < 60) {
      loadFrame(i);
    } else {
      setTimeout(() => loadFrame(i), (i - 60) * 5);
    }
  }

  // ── Canvas ──────────────────────────────────────────────────────────────────
  const setCanvasSize = () => {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    drawFrame(currentFrameIndex);
  };

  const drawFrame = (index: number) => {
    const img = frameImages[Math.max(0, Math.min(index, TOTAL_FRAMES - 1))];
    if (!img || img.naturalWidth === 0) return;

    const cw = canvas.width, ch = canvas.height;
    const ir = img.naturalWidth / img.naturalHeight;
    const cr = cw / ch;

    let sx = 0, sy = 0, sw = img.naturalWidth, sh = img.naturalHeight;
    if (ir > cr) { sw = img.naturalHeight * cr; sx = (img.naturalWidth - sw) / 2; }
    else         { sh = img.naturalWidth / cr;  sy = (img.naturalHeight - sh) / 2; }

    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, cw, ch);
  };

  const scheduleDrawFrame = (index: number) => {
    if (rafId !== null) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => { drawFrame(index); rafId = null; });
  };

  setCanvasSize();
  window.addEventListener('resize', setCanvasSize, { passive: true });

  // ── Initial scene state ────────────────────────────────────────────────────
  // Scene 0 starts visible (CSS handles it); GSAP confirms via set
  gsap.set(scenes[0], { opacity: 1, y: 0, pointerEvents: 'auto' });
  for (let i = 1; i < totalScenes; i++) {
    gsap.set(scenes[i], { opacity: 0, y: 30, pointerEvents: 'none' });
  }

  // ── Master scrubbed timeline ───────────────────────────────────────────────
  //
  // Transition map:
  //   0.80 → scene 0 fades, scene 1 enters
  //   1.80 → scene 1 fades, scene 2 enters
  //   2.80 → scene 2 fades, scene 3 enters
  //   2.92 → scene 3 fully visible  (dwell begins)
  //   4.42 → timeline ends  (scene 3 held for 1.5 units = ~170vh)
  //
  const DUR   = 0.80;
  const TRANS = 0.12;
  const AI_DWELL = 1.5; // extra dwell for the AI scene

  // Hero animation occupies the first 500vh of scroll (wrapper is now 1600vh)
  // Panels (About / Stack / Experience / Projects) take over after that.
  const heroScrollHeight = window.innerHeight * 5; // 500vh in pixels

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: wrapper,
      start:   'top top',
      end:     () => `+=${heroScrollHeight}`,
      scrub:   0.6,
      onUpdate(self) {
        const frame = Math.round(self.progress * (TOTAL_FRAMES - 1));
        if (frame !== currentFrameIndex) {
          currentFrameIndex = frame;
          scheduleDrawFrame(frame);
        }
        updateDots(self.progress);
      },
    },
  });

  for (let i = 0; i < totalScenes - 1; i++) {
    const tOut = i * 1 + DUR;
    tl.to(scenes[i],
      { opacity: 0, y: -22, duration: TRANS, pointerEvents: 'none' },
      tOut
    );
    tl.fromTo(scenes[i + 1],
      { opacity: 0, y: 28 },
      { opacity: 1, y: 0, duration: TRANS, pointerEvents: 'auto' },
      tOut
    );
  }

  // Dwell: extend timeline so Scene 3 stays pinned on screen for a while
  const lastTransitionEnd = (totalScenes - 2) * 1 + DUR + TRANS; // ~2.92
  tl.to({}, { duration: AI_DWELL }, lastTransitionEnd);

  // ── Per-scene sub-animations ───────────────────────────────────────────────
  // Total timeline ≈ lastTransitionEnd + AI_DWELL = 4.42
  // Scene N starts at scroll progress: tOut/totalDuration
  const timelineDuration = lastTransitionEnd + AI_DWELL;

  // Scene 1 tech items — enter from different directions based on column
  ScrollTrigger.create({
    trigger: wrapper,
    start: () => `+=${heroScrollHeight * (DUR / timelineDuration) * 0.85}`,
    once:  true,
    onEnter() {
      const techItems = wrapper.querySelectorAll<HTMLElement>('[data-tech-item]');
      gsap.fromTo(techItems,
        { opacity: 0, scale: 0.75, y: () => gsap.utils.random(10, 25) },
        {
          opacity: 1, scale: 1, y: 0,
          stagger: { amount: 0.6, from: 'random' },
          duration: 0.55,
          ease: 'back.out(1.6)',
        }
      );
      const header = wrapper.querySelector('[data-s1-header]');
      if (header) gsap.fromTo(header,
        { opacity: 0, x: -30 },
        { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' }
      );

      // Tech connection web — fire after stagger settles
      const drawConnections = initTechConnections(wrapper);
      if (drawConnections) setTimeout(drawConnections, 750);
    },
  });

  // Scene 2 business cards — scatter in from corners + number counting
  const scene2Start = (1 + DUR) / timelineDuration;
  ScrollTrigger.create({
    trigger: wrapper,
    start: () => `+=${heroScrollHeight * scene2Start * 0.9}`,
    once:  true,
    onEnter() {
      const s2Header = wrapper.querySelector('[data-s2-header]');
      if (s2Header) gsap.fromTo(s2Header,
        { opacity: 0, y: -24 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }
      );

      const cards = wrapper.querySelectorAll<HTMLElement>('[data-biz-card]');
      const origins = [
        { x: -60, y: -30 },
        { x:  60, y: -30 },
        { x: -40, y:  50 },
        { x:  40, y:  50 },
      ];
      cards.forEach((card, i) => {
        gsap.fromTo(card,
          { opacity: 0, x: origins[i].x, y: origins[i].y, scale: 0.9 },
          { opacity: 1, x: 0, y: 0, scale: 1, duration: 0.8, ease: 'back.out(1.2)', delay: 0.1 + i * 0.12 }
        );
      });

      // Animate counting numbers on each metric
      const metricDefs = [
        { prefix: '–', to: 65, suffix: '%' },
        { prefix: '+', to: 40, suffix: '%' },
        { prefix: '',  to: 3,  suffix: '× faster', from: 1 },
        { prefix: '',  to: 360, suffix: '°' },
      ];
      cards.forEach((card, i) => {
        const def = metricDefs[i];
        if (!def) return;
        const el = card.querySelector<HTMLElement>('.biz-card__metric');
        if (!el) return;
        const counter = { v: def.from ?? 0 };
        gsap.to(counter, {
          v: def.to,
          duration: 1.4,
          ease: 'power3.out',
          delay: 0.3 + i * 0.12,
          onUpdate() {
            const n = Math.round(counter.v);
            el.textContent = `${def.prefix} ${n}${def.suffix}`;
          },
        });
      });

      // SVG chart elements — rise up with fade
      const svgEls = wrapper.querySelectorAll<SVGElement>('.biz-card__svg > *');
      gsap.fromTo(svgEls,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, stagger: 0.04, duration: 0.6, ease: 'power2.out', delay: 0.4 }
      );
    },
  });

  // Scene 3 AI — tools slide from left, skills from right, header from right
  const scene3Start = (2 + DUR) / timelineDuration;
  ScrollTrigger.create({
    trigger: wrapper,
    start: () => `+=${heroScrollHeight * scene3Start * 0.9}`,
    once:  true,
    onEnter() {
      const s3Header = wrapper.querySelector('[data-s3-header]');
      if (s3Header) gsap.fromTo(s3Header,
        { opacity: 0, x: 40 },
        { opacity: 1, x: 0, duration: 0.75, ease: 'power3.out' }
      );

      gsap.fromTo(wrapper.querySelectorAll('[data-ai-item]'),
        { opacity: 0, x: -30 },
        { opacity: 1, x: 0, stagger: 0.08, duration: 0.6, ease: 'power3.out', delay: 0.15 }
      );

      gsap.fromTo(wrapper.querySelectorAll('[data-ai-skill]'),
        { opacity: 0, x: 30 },
        { opacity: 1, x: 0, stagger: 0.06, duration: 0.55, ease: 'power3.out', delay: 0.2 }
      );
    },
  });

  // ── Nav dot clicks ─────────────────────────────────────────────────────────
  dots.forEach(dot => {
    const idx = Number(dot.dataset.sceneDot ?? 0);
    dot.addEventListener('click', () => {
      const sceneStarts = [0, DUR, 1 + DUR, 2 + DUR];
      const prog = sceneStarts[idx] / timelineDuration;
      const targetScroll = wrapper.offsetTop + prog * heroScrollHeight;
      window.scrollTo({ top: targetScroll, behavior: 'smooth' });
    });
  });

  function updateDots(progress: number) {
    // Map progress back to active scene
    const tlPos = progress * timelineDuration;
    let active = 0;
    for (let i = totalScenes - 1; i >= 0; i--) {
      if (tlPos >= (i === 0 ? 0 : (i - 1) * 1 + DUR + TRANS)) {
        active = i; break;
      }
    }
    dots.forEach((d, i) => d.classList.toggle('active', i === active));
  }
};
