import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollToPlugin, ScrollTrigger);

export const smoothScrollTo = (target: string | Element, offset = 80) => {
  let targetElement: Element | null = null;
  
  if (typeof target === 'string') {
    targetElement = document.querySelector(target);
  } else {
    targetElement = target;
  }
  
  if (!targetElement) {
    console.warn('Target element not found for smooth scroll');
    return;
  }
  
  gsap.to(window, {
    duration: 1.2,
    scrollTo: { y: targetElement, offsetY: offset },
    ease: "power2.inOut"
  });
};

export class SmoothScrollManager {
  private isDestroyed = false;

  init() {
    console.log('Initializing smooth scroll manager...');
    
    // Setup navigation links only
    this.handleNavigationLinks();
    this.initScrollAnimations();
    
    console.log('Smooth scroll manager initialized');
    return true;
  }

  private handleNavigationLinks() {
    // Handle smooth scroll for anchor links
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a[href^="#"]') as HTMLAnchorElement;
      
      if (link) {
        e.preventDefault();
        const targetId = link.getAttribute('href')?.substring(1);
        if (targetId) {
          console.log('Scrolling to:', targetId);
          this.scrollToElement(targetId);
        }
      }
    });
  }

  private initScrollAnimations() {
    // Enhanced scroll-triggered animations
    gsap.utils.toArray('.animate-on-scroll').forEach((element: any) => {
      gsap.fromTo(element, 
        {
          opacity: 0,
          y: 50,
          scale: 0.9
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: element,
            start: "top 85%",
            end: "bottom 15%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });
  }

  scrollToElement(elementId: string, offset: number = -80) {
    const target = document.getElementById(elementId);
    if (target) {
      console.log('Found target element:', elementId);
      smoothScrollTo(target, Math.abs(offset));
    } else {
      console.warn('Target element not found:', elementId);
    }
  }

  scrollToTop() {
    gsap.to(window, {
      duration: 1.5,
      scrollTo: { y: 0 },
      ease: "power3.inOut"
    });
  }

  destroy() {
    this.isDestroyed = true;
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  }
}
