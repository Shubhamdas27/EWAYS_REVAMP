import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import Logo from '../common/Logo';
import { smoothScrollTo } from '../../utils/smoothScroll';

interface HeaderProps {
  isMenuOpen: boolean;
  toggleMenu: () => void;
}

const Header: React.FC<HeaderProps> = ({ isMenuOpen, toggleMenu }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Debug function to check if all sections exist
  useEffect(() => {
    const checkSections = () => {
      const sections = ['home', 'about', 'services', 'career', 'contact'];
      sections.forEach(sectionId => {
        const element = document.getElementById(sectionId);
        console.log(`Section ${sectionId}:`, element ? 'Found' : 'Missing');
      });
    };
    
    // Check sections after component mount
    setTimeout(checkSections, 1000);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 50;
      setIsScrolled(scrolled);
      
      // Update scroll progress
      const progress = Math.min(window.scrollY / (document.documentElement.scrollHeight - window.innerHeight), 1);
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : 'auto';
    return () => { document.body.style.overflow = 'auto'; };
  }, [isMenuOpen]);

  // Enhanced smooth scroll to section with multiple fallbacks
  const scrollToSection = (href: string) => {
    console.log('Attempting to scroll to:', href);
    const elementId = href.substring(1);
    
    // Close mobile menu first
    if (isMenuOpen) {
      toggleMenu();
    }
    
    // Function to perform the actual scroll
    const performScroll = () => {
      const element = document.getElementById(elementId);
      
      if (element) {
        console.log('Element found, scrolling...');
        
        // Method 1: Calculate position and use native scroll
        const headerHeight = 80;
        const elementPosition = element.offsetTop - headerHeight;
        
        // Use multiple scroll methods for reliability
        try {
          // Primary method: Native smooth scroll
          window.scrollTo({
            top: elementPosition,
            behavior: 'smooth'
          });
          
          // Backup method: GSAP scroll
          setTimeout(() => {
            smoothScrollTo(element, headerHeight);
          }, 100);
          
        } catch (error) {
          console.warn('Primary scroll methods failed, using fallback');
          // Final fallback: scrollIntoView
          element.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
          });
        }
      } else {
        console.warn('Element not found:', elementId);
        
        // Try alternative selectors
        const targetElement = document.querySelector(href) || 
                             document.querySelector(`[data-section="${elementId}"]`) ||
                             document.querySelector(`section[id="${elementId}"]`);
        
        if (targetElement) {
          targetElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
          });
        } else {
          console.error('No element found for:', href);
        }
      }
    };
    
    // Wait for menu to close if it was open, then scroll
    const delay = isMenuOpen ? 350 : 0;
    setTimeout(performScroll, delay);
  };

  return (
    <>
      {/* Scroll progress indicator */}
      <div 
        className="scroll-progress"
        style={{transform: `scaleX(${scrollProgress})`}}
      ></div>
      
      <header 
        className={`fixed w-full z-40 transition-all duration-500 ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-md shadow-lg py-3 border-b border-blue-100' 
            : 'bg-transparent py-5'
        }`}
      >
        <div className="container-custom flex justify-between items-center">
          <Logo />
          
          <button 
            className="lg:hidden text-gray-800 focus:outline-none hover:scale-110 transition-transform" 
            onClick={toggleMenu}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-8">
            {[
              { href: '#home', label: 'Home' },
              { href: '#about', label: 'About' },
              { href: '#services', label: 'Services' },
              { href: '#career', label: 'Career' },
              { href: '#contact', label: 'Contact' }
            ].map((item) => (
              <button
                key={item.href}
                onClick={() => scrollToSection(item.href)}
                className="text-gray-700 hover:text-[#0056b3] transition-all duration-300 font-medium relative group"
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#0056b3] to-[#37b6ff] transition-all duration-300 group-hover:w-full"></span>
              </button>
            ))}
          </nav>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden fixed inset-0 bg-white/95 backdrop-blur-lg transition-all duration-500 ${
          isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}>
          <div className="flex flex-col items-center justify-center h-full space-y-8">
            {[
              { href: '#home', label: 'Home' },
              { href: '#about', label: 'About' },
              { href: '#services', label: 'Services' },
              { href: '#career', label: 'Career' },
              { href: '#contact', label: 'Contact' }
            ].map((item) => (
              <button
                key={item.href}
                onClick={() => scrollToSection(item.href)}
                className="text-2xl font-medium text-gray-700 hover:text-[#0056b3] transition-all duration-300"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
