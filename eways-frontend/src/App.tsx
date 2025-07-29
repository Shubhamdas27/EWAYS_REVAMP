import { useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Header from './components/Header/Header';
import Hero from './components/Hero/Hero';
import Services from './components/Services/Services';
import About from './components/About/About';
import Mission from './components/Mission/Mission';
import Testimonials from './components/Testimonials/Testimonials';
import Career from './components/Career/Career';
import Contact from './components/Contact/Contact';
import Footer from './components/Footer/Footer';
import { AnimationUtils } from './utils/animations';
import { SmoothScrollManager } from './utils/smoothScroll';

gsap.registerPlugin(ScrollToPlugin, ScrollTrigger);

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [smoothScrollManager] = useState(() => new SmoothScrollManager());

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Initialize GSAP and smooth scroll behavior
  useEffect(() => {
    // Reduce loading time for better UX
    const timer = setTimeout(() => {
      setIsLoading(false);
      
      // Immediate page entrance animation
      const mainElement = document.querySelector("main");
      if (mainElement) {
        gsap.fromTo(mainElement, 
          { opacity: 0, y: 20 }, 
          { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" } // Further reduced duration
        );
      }
    }, 800); // Reduced from 1500ms to 800ms

    // Initialize smooth scroll immediately
    const initSmoothScroll = () => {
      try {
        smoothScrollManager.init();
        console.log('Smooth scroll initialized successfully');
        
        // Quick test of navigation elements
        const sections = ['home', 'about', 'services', 'career', 'contact'];
        sections.forEach(id => {
          const element = document.getElementById(id);
          if (!element) console.warn(`Section ${id} not found`);
        });
        
      } catch (error) {
        console.error('Smooth scroll initialization failed:', error);
      }
    };

    // Start smooth scroll immediately, no delay
    initSmoothScroll();
    
    // Simple reveal animations with error checking - optimized for speed
    setTimeout(() => {
      const revealElements = document.querySelectorAll('.reveal-up');
      revealElements.forEach((element, index) => {
        gsap.fromTo(element, 
          {
            opacity: 0,
            y: 30 // Reduced from 50 to 30
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.5, // Reduced from 0.8 to 0.5
            delay: index * 0.05, // Reduced from 0.1 to 0.05
            ease: "power2.out",
            scrollTrigger: {
              trigger: element,
              start: "top 90%",
              toggleActions: "play none none reverse"
            }
          }
        );
      });
    }, 1200); // Reduced from 2500ms to 1200ms

    // Refresh ScrollTrigger on resize
    const handleResize = () => {
      ScrollTrigger.refresh();
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
      smoothScrollManager.destroy();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [smoothScrollManager]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMenuOpen && !(event.target as Element).closest('.mobile-menu')) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMenuOpen]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-600 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white font-medium text-lg">Loading Eways...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans">
      {/* Scroll progress indicator */}
      <div className="scroll-progress fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-[#0056b3] to-[#37b6ff] z-50 origin-left scale-x-0"></div>
      
      <Header isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
      
      <main className={`transition-all duration-300 ${isMenuOpen ? 'pt-16 lg:pt-0' : ''}`}>
        <section id="home" className="reveal-up">
          <Hero />
        </section>
        
        <section id="about" className="reveal-up">
          <About />
        </section>
        
        <section id="mission" className="reveal-up">
          <Mission />
        </section>
        
        <section id="services" className="reveal-up">
          <Services />
        </section>
        
        <section id="career" className="reveal-up">
          <Career />
        </section>
        
        <section id="testimonials" className="reveal-up">
          <Testimonials />
        </section>
        
        <section id="contact" className="reveal-up">
          <Contact />
        </section>
      </main>
      
      <Footer />

      {/* Simple scroll to top button */}
      <button
        onClick={() => smoothScrollManager.scrollToTop()}
        className="fixed bottom-8 right-8 w-12 h-12 bg-[#0056b3] text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 z-50"
        aria-label="Scroll to top"
      >
        <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
    </div>
  );
}

export default App;