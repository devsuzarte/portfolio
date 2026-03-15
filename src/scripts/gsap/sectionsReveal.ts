import { gsap, ScrollTrigger } from './index';

/**
 * "Same-screen" section reveal system.
 *
 * About section: slides up from below, covering/transitioning over the hero.
 *
 * All [data-reveal-section] sections:
 *  1. Gentle slide-up entrance (scrubbed)
 *  2. Pin while [data-reveal-item] children stagger in
 *  3. Unpin → normal scroll continues
 */
export const initSectionsReveal = () => {

  // ── About: dramatic slide-up from below ─────────────────────────────────
  // The About section physically rises from outside the viewport as the user
  // scrolls past the hero, creating a "slide" transition feeling.
  const about = document.querySelector<HTMLElement>('#about');
  if (about) {
    gsap.fromTo(about,
      { yPercent: 18, opacity: 0 },
      {
        yPercent: 0,
        opacity: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: about,
          start:   'top 100%', // as soon as bottom of viewport touches About top
          end:     'top 15%',  // when About's top is 15% from top of viewport
          scrub:   0.8,
        },
      }
    );
  }

  // ── All reveal sections: enter + pin ────────────────────────────────────
  const sections = document.querySelectorAll<HTMLElement>('[data-reveal-section]');
  if (!sections.length) return;

  sections.forEach(section => {
    const items = section.querySelectorAll<HTMLElement>('[data-reveal-item]');
    if (!items.length) return;

    // Initial state
    gsap.set(items, { opacity: 0, y: 40 });

    // Pin + stagger items in as user scrolls through
    const tl = gsap.timeline();
    tl.to(items, {
      opacity: 1,
      y: 0,
      stagger: 0.18,
      duration: 0.8,
      ease: 'power3.out',
    });

    ScrollTrigger.create({
      trigger:    section,
      start:      'top top',
      end:        `+=${Math.max(items.length * 140, 520)}`,
      pin:        true,
      pinSpacing: true,
      scrub:      0.5,
      animation:  tl,
    });
  });
};
