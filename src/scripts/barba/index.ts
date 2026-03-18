import barba from '@barba/core';
import { ScrollTrigger } from '../gsap/index';
import { slideTransition } from './transitions';
import { initScrollReveal, initHeroAnimation, initSkillBars } from '../gsap/entranceAnimations';

const killAllTriggers = () => {
  ScrollTrigger.getAll().forEach(st => st.kill());
};

const reinitPage = () => {
  window.scrollTo(0, 0);
  killAllTriggers();
  // Small delay to let new DOM settle before creating new triggers
  requestAnimationFrame(() => {
    initScrollReveal();
    initSkillBars();
    ScrollTrigger.refresh();
  });
};

export const initBarba = () => {
  barba.init({
    debug: false,
    transitions: [slideTransition],
    views: [
      {
        namespace: 'home',
        afterEnter() {
          initHeroAnimation();
          reinitPage();
        },
        afterLeave: killAllTriggers,
      },
      {
        namespace: 'projects',
        afterEnter() { reinitPage(); },
        afterLeave: killAllTriggers,
      },
      {
        namespace: 'blog',
        afterEnter() { reinitPage(); },
        afterLeave: killAllTriggers,
      },
      {
        namespace: 'contact',
        afterEnter() { reinitPage(); },
        afterLeave: killAllTriggers,
      },
      {
        namespace: 'not-found',
        afterEnter() { reinitPage(); },
        afterLeave: killAllTriggers,
      },
    ],
  });
};
