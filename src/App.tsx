import React, { useState } from 'react';
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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans">
      <Header isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
      <main className={isMenuOpen ? 'pt-16 lg:pt-0' : ''}>
        <Hero />
        <Services />
        <About />
        <Mission />
        <Career />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default App;