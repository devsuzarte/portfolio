import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flip } from 'gsap/Flip';

gsap.registerPlugin(ScrollTrigger, Flip);

gsap.config({
  autoSleep: 60,
  force3D: true,
  nullTargetWarn: false,
});

gsap.defaults({
  ease: 'power2.out',
  duration: 0.8,
});

export { gsap, ScrollTrigger, Flip };
