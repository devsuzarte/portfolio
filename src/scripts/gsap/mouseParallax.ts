import gsap from 'gsap';

/**
 * Mouse parallax for the hero section.
 *
 * Elements with [data-parallax="N"] move proportionally to mouse position:
 *   N > 0 → moves WITH the mouse (foreground)
 *   N < 0 → moves AGAINST the mouse (background depth)
 *   |N|   → magnitude (1 = ~18px max travel, 2 = ~36px, etc.)
 */

let cleanupFn: (() => void) | null = null;

export const initMouseParallax = () => {
  // Clean up any previous instance (e.g. after Barba navigation)
  cleanupFn?.();

  const heroViewport = document.querySelector<HTMLElement>('.hero-scroll__viewport');
  if (!heroViewport) return;

  let targetX = 0, targetY = 0;
  let currentX = 0, currentY = 0;
  let isHeroVisible = true;
  let rafId: number;
  let destroyed = false;

  const onMouseMove = (e: MouseEvent) => {
    if (!isHeroVisible) return;
    targetX = (e.clientX / window.innerWidth  - 0.5) * 2;
    targetY = (e.clientY / window.innerHeight - 0.5) * 2;
  };

  window.addEventListener('mousemove', onMouseMove, { passive: true });

  // Gyroscope fallback for touch devices
  const onDeviceOrientation = (e: DeviceOrientationEvent) => {
    if (!isHeroVisible) return;
    targetX = Math.max(-1, Math.min(1, (e.gamma ?? 0) / 20));
    targetY = Math.max(-1, Math.min(1, (e.beta  ?? 0) / 30 - 1));
  };
  window.addEventListener('deviceorientation', onDeviceOrientation, { passive: true });

  const tick = () => {
    if (destroyed) return;
    rafId = requestAnimationFrame(tick);

    // Smooth lerp (exponential decay)
    currentX += (targetX - currentX) * 0.045;
    currentY += (targetY - currentY) * 0.045;

    // Apply to every data-parallax element currently in DOM
    const layers = heroViewport.querySelectorAll<HTMLElement>('[data-parallax]');
    layers.forEach(el => {
      const depth = parseFloat(el.dataset.parallax ?? '1');
      const mx = currentX * depth * 18;
      const my = currentY * depth * 12;
      gsap.set(el, { x: mx, y: my, force3D: true });
    });
  };
  tick();

  // Pause animation when hero is scrolled out of view (perf)
  let obs: IntersectionObserver | null = null;
  const heroWrapper = document.querySelector<HTMLElement>('[data-hero-scroll]');
  if (heroWrapper) {
    obs = new IntersectionObserver(
      entries => { isHeroVisible = entries[0].isIntersecting; },
      { threshold: 0.01 }
    );
    obs.observe(heroWrapper);
  }

  cleanupFn = () => {
    destroyed = true;
    cancelAnimationFrame(rafId);
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('deviceorientation', onDeviceOrientation);
    obs?.disconnect();
    cleanupFn = null;
  };
};
