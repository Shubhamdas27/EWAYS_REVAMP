import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollToPlugin);

export const smoothScrollTo = (target: string | Element, offset = 80) => {
  gsap.to(window, {
    duration: 1.5,
    scrollTo: { y: target, offsetY: offset },
    ease: "power3.inOut"
  });
};

export const initSmoothScroll = () => {
  // Enhanced smooth scrolling for the entire page
  const lenis = new (window as any).Lenis({
    duration: 1.2,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
  });

  function raf(time: number) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);
};
