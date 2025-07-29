import { useEffect, useRef } from 'react';
import { ChevronRight } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Hero: React.FC = () => {
  const heroRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const bgElementsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero entrance animations
      const tl = gsap.timeline();
      
      // Animate title words separately - optimized
      if (titleRef.current) {
        const words = titleRef.current.querySelectorAll('.word');
        tl.from(words, {
          opacity: 0,
          y: 50, // Reduced from 100 to 50
          duration: 0.5, // Reduced from 0.8 to 0.5
          stagger: 0.1, // Reduced from 0.2 to 0.1
          ease: "power3.out"
        });
      }

      // Animate subtitle
      tl.from(subtitleRef.current, {
        opacity: 0,
        y: 30, // Reduced from 50 to 30
        duration: 0.5, // Reduced from 0.8 to 0.5
        ease: "power2.out"
      }, "-=0.3"); // Reduced overlap

      // Animate buttons - faster with proper reset
      if (buttonsRef.current) {
        const buttons = Array.from(buttonsRef.current.children);
        
        // Set initial state
        gsap.set(buttons, {
          opacity: 0,
          y: 20,
          scale: 1,
          clearProps: "transform" // Clear any existing transforms
        });
        
        tl.to(buttons, {
          opacity: 1,
          y: 0,
          duration: 0.4,
          stagger: 0.1,
          ease: "back.out(1.7)",
          clearProps: "transform", // Clear transforms after animation
          onComplete: () => {
            // Ensure buttons are properly reset for CSS hover effects
            gsap.set(buttons, {
              clearProps: "all"
            });
          }
        }, "-=0.3");
      }

      // Animate image container
      tl.from(imageRef.current, {
        opacity: 0,
        x: 100,
        scale: 0.8,
        duration: 1,
        ease: "power2.out"
      }, "-=0.8");

      // Floating background elements
      gsap.set(bgElementsRef.current, { scale: 0 });
      tl.to(bgElementsRef.current, {
        scale: 1,
        duration: 1,
        stagger: 0.3,
        ease: "elastic.out(1, 0.3)"
      }, "-=1");

      // Continuous floating animation
      bgElementsRef.current.forEach((el, index) => {
        gsap.to(el, {
          y: index % 2 === 0 ? -20 : 20,
          rotation: index % 2 === 0 ? 5 : -5,
          duration: 3 + index,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        });
      });

      // Image hover effects
      if (imageRef.current) {
        const img = imageRef.current.querySelector('img');
        const decorElements = imageRef.current.querySelectorAll('.decor-element');
        
        gsap.set(decorElements, { scale: 1 });
        
        imageRef.current.addEventListener('mouseenter', () => {
          gsap.to(img, { scale: 1.05, duration: 0.5, ease: "power2.out" });
          gsap.to(decorElements, { scale: 1.1, rotation: 5, duration: 0.5, ease: "power2.out" });
        });
        
        imageRef.current.addEventListener('mouseleave', () => {
          gsap.to(img, { scale: 1, duration: 0.5, ease: "power2.out" });
          gsap.to(decorElements, { scale: 1, rotation: 0, duration: 0.5, ease: "power2.out" });
        });
      }

      // Parallax effect for background elements
      ScrollTrigger.create({
        trigger: heroRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          bgElementsRef.current.forEach((el, index) => {
            const speed = (index + 1) * 0.5;
            gsap.set(el, { y: progress * 100 * speed });
          });
        }
      });

    }, heroRef);

    return () => ctx.revert();
  }, []);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      gsap.to(window, {
        duration: 1.5,
        scrollTo: { y: element, offsetY: 80 },
        ease: "power3.inOut"
      });
    }
  };

  return (
    <section ref={heroRef} id="home" className="relative bg-gradient-to-br from-[#faf5f0] via-white to-[#f7fafc] pt-28 pb-20 md:pt-32 md:pb-28 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-[#1a365d]/10 via-transparent to-[#553c9a]/5 z-0"></div>
      
      {/* Royal animated background elements */}
      <div 
        ref={(el) => el && (bgElementsRef.current[0] = el)}
        className="absolute top-20 left-16 w-32 h-32 bg-gradient-to-br from-[#d4af37]/30 to-[#553c9a]/20 rounded-full blur-2xl"
      ></div>
      <div 
        ref={(el) => el && (bgElementsRef.current[1] = el)}
        className="absolute bottom-32 right-24 w-24 h-24 bg-gradient-to-br from-[#1e2a4a]/40 to-[#1a365d]/20 rounded-full blur-xl"
      ></div>
      <div 
        ref={(el) => el && (bgElementsRef.current[2] = el)}
        className="absolute top-40 right-16 w-20 h-20 bg-gradient-to-br from-[#553c9a]/30 to-[#d4af37]/15 rounded-full blur-xl"
      ></div>
      <div 
        ref={(el) => el && (bgElementsRef.current[3] = el)}
        className="absolute bottom-20 left-20 w-16 h-16 bg-gradient-to-br from-[#1a365d]/25 to-transparent rounded-full blur-lg"
      ></div>
      
      <div className="container-custom relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 ref={titleRef} className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight playfair-font">
              <span className="word block text-[#1e2a4a]">Royal IT Solutions</span>
              <span className="word block bg-gradient-to-r from-[#1a365d] via-[#553c9a] to-[#d4af37] bg-clip-text text-transparent">
                That Crown Your Success
              </span>
            </h1>
            <p ref={subtitleRef} className="text-lg text-gray-700 max-w-lg leading-relaxed">
              Experience the royalty of premium IT services and solutions. We empower businesses with 
              regal technology implementations and unparalleled excellence in every service.
            </p>
            <div ref={buttonsRef} className="flex flex-wrap gap-4">
              <button 
                onClick={() => {
                  const servicesElement = document.querySelector('#services');
                  if (servicesElement) {
                    servicesElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  } else {
                    window.location.href = '/services';
                  }
                }} 
                className="btn btn-primary group relative overflow-hidden"
              >
                <span className="relative z-10">Explore Royal Services</span>
                <ChevronRight size={18} className="inline ml-1 group-hover:translate-x-1 transition-transform relative z-10" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#553c9a] to-[#1e2a4a] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
              </button>
              <button 
                onClick={() => {
                  const contactElement = document.querySelector('#contact');
                  if (contactElement) {
                    contactElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  } else {
                    window.location.href = '/contact';
                  }
                }} 
                className="btn btn-outline group relative overflow-hidden"
              >
                <span className="relative z-10">Connect With Royalty</span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#1a365d] to-[#553c9a] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
              </button>
            </div>
          </div>
          
          <div ref={imageRef} className="relative hidden md:block">
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500">
              <img 
                src="https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg" 
                alt="IT Professionals working together" 
                className="w-full h-auto object-cover rounded-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-[#0056b3]/20 via-transparent to-[#ff7e2b]/10 rounded-2xl"></div>
            </div>
            <div className="decor-element absolute -bottom-8 -right-8 w-40 h-40 bg-gradient-to-br from-[#ff7e2b] to-[#ff7e2b]/70 rounded-2xl z-0 blur-sm"></div>
            <div className="decor-element absolute -top-8 -left-8 w-32 h-32 bg-gradient-to-br from-[#0056b3] to-[#0056b3]/70 rounded-2xl z-0 blur-sm"></div>
            <div className="decor-element absolute top-1/2 -right-4 w-8 h-8 bg-[#37b6ff] rounded-full z-20"></div>
            <div className="decor-element absolute bottom-1/4 -left-4 w-6 h-6 bg-[#ff7e2b] rounded-full z-20"></div>
          </div>
        </div>
      </div>
      
      {/* Enhanced wave divider */}
      <div className="absolute bottom-0 w-full h-20 bg-white wave-divider opacity-90"></div>
      <div className="absolute bottom-0 w-full h-16 bg-gradient-to-t from-white to-transparent"></div>
    </section>
  );
};

export default Hero;