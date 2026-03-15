import Lenis from '@studio-freight/lenis';
import { gsap, ScrollTrigger } from '../gsap/index';

let lenisInstance: Lenis | null = null;

export const initSmoothScroll = (): Lenis => {
  lenisInstance = new Lenis({
    duration: 0.0,
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: false,
    wheelMultiplier: 1,
    touchMultiplier: 1,
  });

  // Integrar com GSAP ScrollTrigger
  lenisInstance.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time: number) => {
    lenisInstance?.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  return lenisInstance;
};

export const getLenis = (): Lenis | null => lenisInstance;

export const destroySmoothScroll = () => {
  lenisInstance?.destroy();
  lenisInstance = null;
};
