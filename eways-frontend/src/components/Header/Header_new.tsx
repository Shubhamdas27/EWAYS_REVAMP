import { useState, useEffect, useRef } from 'react';
import { Menu, X, ChevronRight } from 'lucide-react';
import Logo from '../common/Logo';
import { gsap } from 'gsap';

interface HeaderProps {
  isMenuOpen: boolean;
  toggleMenu: () => void;
}

const Header: React.FC<HeaderProps> = ({ isMenuOpen, toggleMenu }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 50;
      setIsScrolled(scrolled);
      
      // Update scroll progress
      const scrollProgress = Math.min(window.scrollY / (document.body.scrollHeight - window.innerHeight), 1);
      const progressBar = document.querySelector('.scroll-progress') as HTMLElement;
      if (progressBar) {
        gsap.set(progressBar, { scaleX: scrollProgress });
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : 'auto';
    return () => { document.body.style.overflow = 'auto'; };
  }, [isMenuOpen]);

  useEffect(() => {
    // Header entrance animation
    if (headerRef.current) {
      gsap.fromTo(headerRef.current, 
        { y: -100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.2 }
      );
    }

    // Navigation items animation
    if (navRef.current) {
      const navItems = navRef.current.querySelectorAll('.nav-item');
      gsap.fromTo(navItems,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power2.out", delay: 0.8 }
      );
    }
  }, []);

  // Enhanced smooth scroll to section
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      gsap.to(window, {
        duration: 1.5,
        scrollTo: { y: element, offsetY: 80 },
        ease: "power3.inOut"
      });
    }
    if (isMenuOpen) toggleMenu();
  };

  return (
    <>
      {/* Scroll progress indicator */}
      <div className="scroll-progress fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-[#0056b3] to-[#37b6ff] z-50 origin-left scale-x-0"></div>
      
      <header 
        ref={headerRef}
        className={`fixed w-full z-40 transition-all duration-500 ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-md shadow-lg py-3 border-b border-blue-100' 
            : 'bg-transparent py-5'
        }`}
      >
        <div className="container-custom flex justify-between items-center">
          <Logo />
          
          <button 
            className="lg:hidden text-gray-800 focus:outline-none hover:scale-110 transition-transform magnetic" 
            onClick={toggleMenu}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Desktop Navigation */}
          <nav ref={navRef} className="hidden lg:flex space-x-8">
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
                className="nav-item text-gray-700 hover:text-[#0056b3] transition-all duration-300 font-medium relative group magnetic"
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#0056b3] to-[#37b6ff] transition-all duration-300 group-hover:w-full"></span>
              </button>
            ))}
          </nav>
        </div>

        {/* Enhanced Mobile Menu */}
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
            ].map((item, index) => (
              <button
                key={item.href}
                onClick={() => scrollToSection(item.href)}
                className={`text-2xl font-medium text-gray-700 hover:text-[#0056b3] transition-all duration-300 transform ${
                  isMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                } delay-${index * 100}`}
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
