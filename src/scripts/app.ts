import gsap from 'gsap';
import { initEntranceAnimation, initHeroAnimation, initScrollReveal, initSkillBars } from './gsap/entranceAnimations';
import { initHeroScroll } from './gsap/heroScroll';
import { initMouseParallax } from './gsap/mouseParallax';
import { initBarba } from './barba/index';

// Cover-fit draw helper used for the immediate frame-0 paint
const coverFitDraw = (canvas: HTMLCanvasElement, img: HTMLImageElement) => {
  const ctx = canvas.getContext('2d');
  if (!ctx || img.naturalWidth === 0) return;
  const cw = canvas.width, ch = canvas.height;
  const ir = img.naturalWidth / img.naturalHeight, cr = cw / ch;
  let sx = 0, sy = 0, sw = img.naturalWidth, sh = img.naturalHeight;
  if (ir > cr) { sw = img.naturalHeight * cr; sx = (img.naturalWidth - sw) / 2; }
  else         { sh = img.naturalWidth / cr;  sy = (img.naturalHeight - sh) / 2; }
  ctx.clearRect(0, 0, cw, ch);
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, cw, ch);
};

const init = async () => {
  // ── STEP 1: Set scene-0 hero elements invisible BEFORE entrance starts ──────
  // This prevents the "flash → disappear → animate in" glitch.
  const scene0 = document.querySelector<HTMLElement>('.hero-scene--0');
  if (scene0) {
    const els = ['.hero__meta', '.hero__subtitle', '.hero__social', '.hero__actions']
      .map(s => scene0.querySelector(s))
      .filter(Boolean);
    const right = scene0.querySelector('.hero__right');
    const nameFirst = scene0.querySelector<HTMLElement>('.hero__title-first');
    const nameLast  = scene0.querySelector<HTMLElement>('.hero__title-last');
    gsap.set(els, { opacity: 0, y: 22 });
    if (right)     gsap.set(right, { opacity: 0, x: 32 });
    if (nameFirst) gsap.set(nameFirst, { opacity: 0, y: 30 });
    if (nameLast)  gsap.set(nameLast,  { opacity: 0, y: 50 });
  }

  // ── STEP 2: Paint frame 0 to canvas immediately ──────────────────────────
  // CSS background-image on the viewport already handles the static fallback,
  // but we also draw to the canvas so it's pixel-exact on load.
  const heroCanvas = document.querySelector<HTMLCanvasElement>('[data-hero-canvas]');
  if (heroCanvas) {
    heroCanvas.width  = window.innerWidth;
    heroCanvas.height = window.innerHeight;
    const img0 = new Image();
    img0.onload = () => coverFitDraw(heroCanvas, img0);
    img0.src = `${heroCanvas.dataset.frameBase ?? ''}ezgif-frame-001.jpg`;
  }

  // ── STEP 3: Generic scroll reveals ──────────────────────────────────────
  try { initScrollReveal(); initSkillBars(); }
  catch (err) { console.warn('[GSAP] Scroll reveal failed:', err); }

  // ── STEP 4: Entrance loader → then hero if present ──────────────────────
  const hasHero = !!document.querySelector('[data-hero-scroll]');
  try {
    initEntranceAnimation(() => {
      if (!hasHero) return;
      try { initHeroScroll(); }    catch (e) { console.warn('[HeroScroll]', e); }
      try { initHeroAnimation(); } catch (_) { /* silent */ }
    });
  } catch (err) {
    console.warn('[Entrance] failed:', err);
    if (hasHero) {
      try { initHeroScroll(); }    catch (_) {}
      try { initHeroAnimation(); } catch (_) {}
    }
  }

  if (hasHero) {
    // Mouse parallax + Three.js overlay
    try { initMouseParallax(); } catch (_) {}
    try {
      const viewport = document.querySelector<HTMLElement>('.hero-scroll__viewport');
      if (viewport) {
        import('./three/HeroParticleOverlay').then(m =>
          m.initHeroParticles(viewport)
        ).catch(() => {});
      }
    } catch (_) {}
  }

  // ── STEP 5: Nav smooth scroll ─────────────────────────────────────────
  const NAV_ID_MAP: Record<string, string> = { stack: 'skills' };
  const HEADER_OFFSET = 80;
  document.querySelectorAll<HTMLAnchorElement>('[data-nav-target]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const target = link.dataset.navTarget ?? '';
      const id = NAV_ID_MAP[target] ?? target;
      const el = document.getElementById(id);
      if (!el) return;
      const top = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // ── STEP 6: Barba page transitions ───────────────────────────────────
  try { initBarba(); } catch (err) { console.warn('[Barba]', err); }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
