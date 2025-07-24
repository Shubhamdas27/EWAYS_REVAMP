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
      
      // Animate title words separately
      if (titleRef.current) {
        const words = titleRef.current.querySelectorAll('.word');
        tl.from(words, {
          opacity: 0,
          y: 100,
          duration: 0.8,
          stagger: 0.2,
          ease: "power3.out"
        });
      }

      // Animate subtitle
      tl.from(subtitleRef.current, {
        opacity: 0,
        y: 50,
        duration: 0.8,
        ease: "power2.out"
      }, "-=0.4");

      // Animate buttons
      if (buttonsRef.current) {
        tl.from(Array.from(buttonsRef.current.children), {
          opacity: 0,
          y: 30,
          duration: 0.6,
          stagger: 0.2,
          ease: "back.out(1.7)"
        }, "-=0.4");
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
    <section ref={heroRef} id="home" className="relative bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 pt-28 pb-20 md:pt-32 md:pb-28 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-[#0056b3]/10 via-transparent to-[#ff7e2b]/5 z-0"></div>
      
      {/* Enhanced animated background elements */}
      <div 
        ref={(el) => el && (bgElementsRef.current[0] = el)}
        className="absolute top-20 left-16 w-24 h-24 bg-gradient-to-br from-[#0056b3]/30 to-[#0056b3]/10 rounded-full blur-sm"
      ></div>
      <div 
        ref={(el) => el && (bgElementsRef.current[1] = el)}
        className="absolute bottom-32 right-24 w-20 h-20 bg-gradient-to-br from-[#ff7e2b]/40 to-[#ff7e2b]/10 rounded-full blur-sm"
      ></div>
      <div 
        ref={(el) => el && (bgElementsRef.current[2] = el)}
        className="absolute top-40 right-16 w-16 h-16 bg-gradient-to-br from-[#37b6ff]/30 to-[#37b6ff]/10 rounded-full blur-sm"
      ></div>
      <div 
        ref={(el) => el && (bgElementsRef.current[3] = el)}
        className="absolute bottom-20 left-20 w-12 h-12 bg-gradient-to-br from-[#0056b3]/20 to-transparent rounded-full blur-sm"
      ></div>
      
      <div className="container-custom relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 ref={titleRef} className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              <span className="word block">IT Solutions</span>
              <span className="word block text-[#0056b3] bg-gradient-to-r from-[#0056b3] to-[#37b6ff] bg-clip-text text-transparent">
                That Drive Growth
              </span>
            </h1>
            <p ref={subtitleRef} className="text-lg text-gray-700 max-w-lg leading-relaxed">
              Delivering innovative IT services and solutions to empower businesses of all sizes. 
              From consultancy to implementation, we're your trusted technology partner.
            </p>
            <div ref={buttonsRef} className="flex flex-wrap gap-4">
              <button 
                onClick={() => scrollToSection('#services')} 
                className="btn btn-primary group relative overflow-hidden"
              >
                <span className="relative z-10">Explore Services</span>
                <ChevronRight size={18} className="inline ml-1 group-hover:translate-x-1 transition-transform relative z-10" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#004494] to-[#0056b3] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
              </button>
              <button 
                onClick={() => scrollToSection('#contact')} 
                className="btn btn-outline group relative overflow-hidden"
              >
                <span className="relative z-10">Contact Us</span>
                <div className="absolute inset-0 bg-[#0056b3] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
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