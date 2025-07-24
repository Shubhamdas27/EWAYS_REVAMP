import { useState, useEffect } from 'react';
import { Menu, X, ChevronRight } from 'lucide-react';
import Logo from '../common/Logo';

interface HeaderProps {
  isMenuOpen: boolean;
  toggleMenu: () => void;
}

const Header: React.FC<HeaderProps> = ({ isMenuOpen, toggleMenu }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : 'auto';
    return () => { document.body.style.overflow = 'auto'; };
  }, [isMenuOpen]);

  // Smooth scroll to section
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start',
        inline: 'nearest' 
      });
    }
    if (isMenuOpen) toggleMenu();
  };

  return (
    <header className={`fixed w-full z-50 transition-all duration-500 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg py-3' : 'bg-transparent py-5'}`}>
      <div className="container-custom flex justify-between items-center">
        <Logo />
        
        <button 
          className="lg:hidden text-gray-800 focus:outline-none hover:scale-110 transition-transform" 
          onClick={toggleMenu}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        
        <nav className="hidden lg:flex items-center space-x-8">
          <NavLinks isMobile={false} onLinkClick={scrollToSection} />
          <button 
            onClick={() => scrollToSection('#contact')} 
            className="btn btn-primary"
          >
            Get a Quote <ChevronRight size={16} className="inline ml-1" />
          </button>
        </nav>
        
        <div className={`fixed inset-0 bg-white/95 backdrop-blur-md z-40 lg:hidden transition-all duration-500 transform ${isMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'} pt-20`}>
          <nav className="container-custom flex flex-col space-y-6 mt-8">
            <NavLinks isMobile={true} onLinkClick={scrollToSection} />
            <button 
              onClick={() => scrollToSection('#contact')} 
              className="btn btn-primary w-full text-center mt-4"
            >
              Get a Quote <ChevronRight size={16} className="inline ml-1" />
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

interface NavLinksProps {
  isMobile: boolean;
  onLinkClick: (href: string) => void;
}

const NavLinks: React.FC<NavLinksProps> = ({ isMobile, onLinkClick }) => {
  const links = [
    { name: 'Home', href: '#home' },
    { name: 'About Us', href: '#about' },
    { name: 'Mission', href: '#mission' },
    { name: 'Services', href: '#services' },
    { name: 'Career', href: '#career' },
    { name: 'Contact Us', href: '#contact' },
  ];

  return (
    <>
      {links.map((link) => (
        <button
          key={link.name}
          onClick={() => onLinkClick(link.href)}
          className={`nav-link ${
            isMobile 
              ? 'text-xl py-4 border-b border-gray-200 text-left w-full hover:text-[#0056b3] hover:border-[#0056b3]' 
              : 'font-medium text-gray-700 hover:text-[#0056b3] transition-colors'
          }`}
        >
          {link.name}
        </button>
      ))}
    </>
  );
};

export default Header;