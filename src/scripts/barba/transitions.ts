import { gsap } from '../gsap/index';

const SVG_LOGO_URL = '/assets/svg/devsuzarte.svg';

/**
 * Page transition using the devsuzarte SVG logo as a mask.
 *
 * Leave: espresso overlay slides up, then the logo mask appears at center
 * Enter: logo mask scales out revealing the new page, overlay fades
 */
export const slideTransition = {
  name: 'slide-transition',

  async leave({ current }: { current: { container: HTMLElement } }) {
    const done = (this as any).async();

    // Create overlay
    const overlay = document.createElement('div');
    overlay.setAttribute('data-barba-overlay', '');
    overlay.style.cssText = [
      'position: fixed',
      'inset: 0',
      'z-index: 9999',
      'background: #1c0f0a',
      'transform: scaleY(0)',
      'transform-origin: bottom',
    ].join(';');

    // SVG logo centered in overlay
    const logo = document.createElement('div');
    logo.style.cssText = [
      'position: absolute',
      'top: 50%',
      'left: 50%',
      'transform: translate(-50%, -50%) scale(0.6)',
      'width: 280px',
      'height: 50px',
      `background: url('${SVG_LOGO_URL}') center / contain no-repeat`,
      'opacity: 0',
      'filter: brightness(0) invert(1)',
    ].join(';');
    logo.setAttribute('data-barba-logo', '');
    overlay.appendChild(logo);

    document.body.appendChild(overlay);

    const tl = gsap.timeline({ onComplete: done });
    tl.to(overlay, { scaleY: 1, duration: 0.4, ease: 'power3.inOut' })
      .to(logo, {
        opacity: 1,
        scale: 1,
        duration: 0.35,
        ease: 'back.out(1.4)',
      }, '-=0.1');

    return tl;
  },

  async enter({ next }: { next: { container: HTMLElement } }) {
    const done = (this as any).async();
    const overlay = document.querySelector('[data-barba-overlay]') as HTMLElement | null;
    const logo = document.querySelector('[data-barba-logo]') as HTMLElement | null;

    window.scrollTo(0, 0);

    const tl = gsap.timeline({ onComplete: done });
    tl
      .set(next.container, { opacity: 1 })
      .to(logo, {
        opacity: 0,
        scale: 1.3,
        duration: 0.25,
        ease: 'power2.in',
      })
      .to(overlay, {
        scaleY: 0,
        transformOrigin: 'top',
        duration: 0.4,
        ease: 'power3.inOut',
        onComplete: () => overlay?.remove(),
      }, '-=0.1');

    return tl;
  },
};
