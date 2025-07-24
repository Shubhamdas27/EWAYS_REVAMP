import { useState, useEffect } from 'react';
import Header from './components/Header/Header';
import Hero from './components/Hero/Hero';
import Services from './components/Services/Services';
import About from './components/About/About';
import Mission from './components/Mission/Mission';
import Testimonials from './components/Testimonials/Testimonials';
import Career from './components/Career/Career';
import Contact from './components/Contact/Contact';
import Footer from './components/Footer/Footer';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Simulate loading and add smooth scroll behavior
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    
    // Enhanced smooth scrolling for anchor links
    document.documentElement.style.scrollBehavior = 'smooth';
    
    return () => clearTimeout(timer);
  }, []);

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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-[#0056b3] font-medium">Loading Eways...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans">
      <Header isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
      <main className={`smooth-transition ${isMenuOpen ? 'pt-16 lg:pt-0' : ''}`}>
        <section id="home">
          <Hero />
        </section>
        <section id="about">
          <About />
        </section>
        <section id="mission">
          <Mission />
        </section>
        <section id="services">
          <Services />
        </section>
        <section id="career">
          <Career />
        </section>
        <section id="testimonials">
          <Testimonials />
        </section>
        <section id="contact">
          <Contact />
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default App;