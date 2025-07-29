import { useState, useEffect, useCallback } from 'react';
import { gsap } from 'gsap';
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

gsap.registerPlugin(ScrollTrigger);

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, []);

  // Fast initialization
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      
      // Quick page entrance animation
      const mainElement = document.querySelector("main");
      if (mainElement) {
        gsap.fromTo(mainElement, 
          { opacity: 0 }, 
          { opacity: 1, duration: 0.3, ease: "power2.out" }
        );
      }
    }, 500);

    // Fast animations setup
    const setupAnimations = () => {
      const revealElements = document.querySelectorAll('.reveal-up');
      revealElements.forEach((element, index) => {
        gsap.fromTo(element, 
          {
            opacity: 0,
            y: 20
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            delay: index * 0.03,
            ease: "power2.out",
            scrollTrigger: {
              trigger: element,
              start: "top 90%",
              toggleActions: "play none none reverse"
            }
          }
        );
      });
    };

    setTimeout(setupAnimations, 600);

    return () => {
      clearTimeout(timer);
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMenuOpen && !(event.target as Element).closest('.mobile-menu')) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isMenuOpen]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="loading-spinner w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium">Loading EWAYS...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <Header isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
      
      <main>
        <section id="home">
          <Hero />
        </section>
        
        <section id="about" className="reveal-up">
          <About />
        </section>
        
        <section id="services" className="reveal-up">
          <Services />
        </section>
        
        <section className="reveal-up">
          <Mission />
        </section>
        
        <section className="reveal-up">
          <Testimonials />
        </section>
        
        <section id="career" className="reveal-up">
          <Career />
        </section>
        
        <section id="contact" className="reveal-up">
          <Contact />
        </section>
      </main>
      
      <Footer />
    </div>
  );
}

export default App;
