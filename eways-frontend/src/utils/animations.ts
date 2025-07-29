import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { TextPlugin } from 'gsap/TextPlugin';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, TextPlugin);

// Advanced animation utilities
export class AnimationUtils {
  // Initialize global animations
  static initGlobalAnimations() {
    // Magnetic buttons effect
    this.initMagneticElements();
    
    // Reveal animations for sections
    this.initRevealAnimations();
    
    // Parallax backgrounds
    this.initParallaxElements();
    
    // Floating elements
    this.initFloatingElements();
    
    // Text reveal animations
    this.initTextRevealAnimations();
  }

  // Magnetic hover effect for buttons and cards
  static initMagneticElements() {
    const magneticElements = document.querySelectorAll('.magnetic');
    
    magneticElements.forEach((element) => {
      const handleMouseMove = (e: Event) => {
        const mouseEvent = e as MouseEvent;
        const rect = element.getBoundingClientRect();
        const x = mouseEvent.clientX - rect.left - rect.width / 2;
        const y = mouseEvent.clientY - rect.top - rect.height / 2;
        
        gsap.to(element, {
          x: x * 0.3,
          y: y * 0.3,
          duration: 0.3,
          ease: "power2.out"
        });
      };
      
      const handleMouseLeave = () => {
        gsap.to(element, {
          x: 0,
          y: 0,
          duration: 0.5,
          ease: "elastic.out(1, 0.3)"
        });
      };
      
      element.addEventListener('mousemove', handleMouseMove);
      element.addEventListener('mouseleave', handleMouseLeave);
    });
  }

  // Advanced reveal animations
  static initRevealAnimations() {
    const revealElements = document.querySelectorAll('.reveal');
    
    revealElements.forEach((element) => {
      gsap.fromTo(element, 
        {
          opacity: 0,
          y: 100,
          scale: 0.9,
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

  // Parallax backgrounds and elements
  static initParallaxElements() {
    const parallaxElements = document.querySelectorAll('.parallax');
    
    parallaxElements.forEach((element) => {
      const speed = element.getAttribute('data-speed') || '0.5';
      
      gsap.to(element, {
        yPercent: -50 * parseFloat(speed),
        ease: "none",
        scrollTrigger: {
          trigger: element,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
          invalidateOnRefresh: true
        }
      });
    });
  }

  // Floating elements animation
  static initFloatingElements() {
    const floatingElements = document.querySelectorAll('.floating');
    
    floatingElements.forEach((element, index) => {
      gsap.to(element, {
        y: "+=20",
        duration: 2 + (index * 0.1),
        ease: "power1.inOut",
        yoyo: true,
        repeat: -1
      });
    });
  }

  // Text reveal with split text effect
  static initTextRevealAnimations() {
    const textElements = document.querySelectorAll('.text-reveal');
    
    textElements.forEach((element) => {
      const text = element.textContent || '';
      const chars = text.split('');
      
      element.innerHTML = chars.map(char => 
        char === ' ' ? ' ' : `<span class="char">${char}</span>`
      ).join('');
      
      const chars_spans = element.querySelectorAll('.char');
      
      gsap.fromTo(chars_spans, 
        {
          opacity: 0,
          y: 50,
          rotationX: -90
        },
        {
          opacity: 1,
          y: 0,
          rotationX: 0,
          duration: 0.05,
          stagger: 0.02,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: element,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });
  }

  // Morphing background shapes
  static createMorphingShapes(container: HTMLElement) {
    const shapes = [];
    const numShapes = 5;
    
    for (let i = 0; i < numShapes; i++) {
      const shape = document.createElement('div');
      shape.className = 'morphing-shape absolute rounded-full opacity-10';
      shape.style.background = `linear-gradient(45deg, #0056b3, #37b6ff)`;
      shape.style.width = `${Math.random() * 300 + 100}px`;
      shape.style.height = shape.style.width;
      shape.style.left = `${Math.random() * 100}%`;
      shape.style.top = `${Math.random() * 100}%`;
      
      container.appendChild(shape);
      shapes.push(shape);
      
      // Animate shapes
      gsap.to(shape, {
        x: `+=${Math.random() * 200 - 100}`,
        y: `+=${Math.random() * 200 - 100}`,
        scale: Math.random() * 0.5 + 0.8,
        duration: Math.random() * 10 + 5,
        ease: "none",
        repeat: -1,
        yoyo: true
      });
    }
    
    return shapes;
  }

  // Particle system
  static createParticleSystem(container: HTMLElement, count: number = 50) {
    const particles = [];
    
    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle absolute w-1 h-1 bg-blue-400 rounded-full opacity-20';
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      
      container.appendChild(particle);
      particles.push(particle);
      
      // Animate particles
      gsap.to(particle, {
        y: `-=${Math.random() * 100 + 50}`,
        x: `+=${Math.random() * 50 - 25}`,
        opacity: 0,
        duration: Math.random() * 3 + 2,
        ease: "power1.out",
        repeat: -1,
        delay: Math.random() * 2
      });
    }
    
    return particles;
  }

  // Stagger animation for elements
  static staggerReveal(selector: string, delay: number = 0) {
    const elements = document.querySelectorAll(selector);
    
    gsap.fromTo(elements,
      {
        opacity: 0,
        y: 60,
        scale: 0.9
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        stagger: 0.1,
        delay,
        ease: "power3.out",
        scrollTrigger: {
          trigger: elements[0],
          start: "top 85%",
          toggleActions: "play none none reverse"
        }
      }
    );
  }

  // Card hover animations
  static initCardAnimations() {
    const cards = document.querySelectorAll('.animated-card');
    
    cards.forEach((card) => {
      const handleMouseEnter = () => {
        gsap.to(card, {
          y: -10,
          scale: 1.02,
          duration: 0.3,
          ease: "power2.out"
        });
        
        gsap.to(card.querySelector('.card-bg'), {
          scale: 1.1,
          duration: 0.3,
          ease: "power2.out"
        });
      };
      
      const handleMouseLeave = () => {
        gsap.to(card, {
          y: 0,
          scale: 1,
          duration: 0.3,
          ease: "power2.out"
        });
        
        gsap.to(card.querySelector('.card-bg'), {
          scale: 1,
          duration: 0.3,
          ease: "power2.out"
        });
      };
      
      card.addEventListener('mouseenter', handleMouseEnter);
      card.addEventListener('mouseleave', handleMouseLeave);
    });
  }

  // Smooth scroll with Lenis
  static initSmoothScroll() {
    // This will be implemented with Lenis in the main App component
    return true;
  }

  // Cleanup function
  static cleanup() {
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  }
}

// Export individual animation functions
export const createRevealAnimation = (element: HTMLElement, options = {}) => {
  return gsap.fromTo(element,
    {
      opacity: 0,
      y: 50,
      ...options
    },
    {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: element,
        start: "top 85%",
        toggleActions: "play none none reverse"
      }
    }
  );
};

export const createStaggerAnimation = (elements: NodeListOf<Element>, options = {}) => {
  return gsap.fromTo(elements,
    {
      opacity: 0,
      y: 30,
      ...options
    },
    {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: elements[0],
        start: "top 85%",
        toggleActions: "play none none reverse"
      }
    }
  );
};
