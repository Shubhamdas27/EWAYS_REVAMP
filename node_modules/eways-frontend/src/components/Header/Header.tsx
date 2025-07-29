import { useState, useEffect, useCallback, useMemo } from 'react';
import { Menu, X } from 'lucide-react';
import Logo from '../common/Logo';

interface HeaderProps {
  isMenuOpen: boolean;
  toggleMenu: () => void;
}

const Header: React.FC<HeaderProps> = ({ isMenuOpen, toggleMenu }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Memoized navigation items
  const navItems = useMemo(() => [
    { href: '#home', label: 'Home' },
    { href: '#about', label: 'About' },
    { href: '#services', label: 'Services' },
    { href: '#career', label: 'Career' },
    { href: '#contact', label: 'Contact' }
  ], []);

  // Optimized scroll handler with requestAnimationFrame
  const handleScroll = useCallback(() => {
    requestAnimationFrame(() => {
      const scrolled = window.scrollY > 50;
      setIsScrolled(scrolled);
      
      const progress = Math.min(window.scrollY / (document.documentElement.scrollHeight - window.innerHeight), 1);
      setScrollProgress(progress);
    });
  }, []);

  useEffect(() => {
    let ticking = false;
    
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });
    return () => window.removeEventListener('scroll', throttledScroll);
  }, [handleScroll]);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : 'auto';
    return () => { document.body.style.overflow = 'auto'; };
  }, [isMenuOpen]);

  // Fast and optimized scroll to section
  const scrollToSection = useCallback((href: string) => {
    const elementId = href.substring(1);
    
    // Close mobile menu immediately
    if (isMenuOpen) {
      toggleMenu();
    }
    
    // Fast scroll implementation
    const performScroll = () => {
      const element = document.getElementById(elementId);
      
      if (element) {
        const headerHeight = 80;
        const elementPosition = element.offsetTop - headerHeight;
        
        // Use the fastest method
        window.scrollTo({
          top: elementPosition,
          behavior: 'smooth'
        });
      } else {
        // Quick fallback
        const targetElement = document.querySelector(href);
        if (targetElement) {
          targetElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
          });
        }
      }
    };

    // Minimal delay for better UX
    const delay = isMenuOpen ? 150 : 0;
    setTimeout(performScroll, delay);
  }, [isMenuOpen, toggleMenu]);

  return (
    <>
      {/* Scroll progress indicator */}
      <div 
        className="scroll-progress"
        style={{ transform: `scaleX(${scrollProgress})` }}
      />
      
      <header 
        className={`fixed w-full z-40 transition-all duration-300 ${
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
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => scrollToSection(item.href)}
                className="text-gray-700 hover:text-[#0056b3] transition-all duration-200 font-medium relative group"
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#0056b3] to-[#37b6ff] transition-all duration-200 group-hover:w-full"></span>
              </button>
            ))}
          </nav>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden fixed inset-0 bg-white/95 backdrop-blur-lg transition-all duration-300 ${
          isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}>
          <div className="flex flex-col items-center justify-center h-full space-y-8">
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => scrollToSection(item.href)}
                className="text-2xl font-medium text-gray-700 hover:text-[#0056b3] transition-all duration-200"
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
