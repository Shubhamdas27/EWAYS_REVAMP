import React, { useState, useEffect } from 'react';
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
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    // Disable body scroll when menu is open on mobile
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMenuOpen]);

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-3' : 'bg-transparent py-5'}`}>
      <div className="container-custom flex justify-between items-center">
        <Logo />
        
        {/* Mobile Menu Button */}
        <button 
          className="lg:hidden text-gray-800 focus:outline-none" 
          onClick={toggleMenu}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        
        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-8">
          <NavLinks isMobile={false} />
          <a href="#contact" className="btn btn-primary">
            Get a Quote <ChevronRight size={16} className="inline ml-1" />
          </a>
        </nav>
        
        {/* Mobile Navigation */}
        <div className={`fixed inset-0 bg-white z-40 lg:hidden transition-transform duration-300 transform ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'} pt-20`}>
          <nav className="container-custom flex flex-col space-y-6 mt-8">
            <NavLinks isMobile={true} onClick={toggleMenu} />
            <a 
              href="#contact" 
              className="btn btn-primary w-full text-center mt-4"
              onClick={toggleMenu}
            >
              Get a Quote <ChevronRight size={16} className="inline ml-1" />
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
};

interface NavLinksProps {
  isMobile: boolean;
  onClick?: () => void;
}

const NavLinks: React.FC<NavLinksProps> = ({ isMobile, onClick }) => {
  const links = [
    { name: 'Home', href: '#home' },
    { name: 'About Us', href: '#about' },
    { name: 'Services', href: '#services' },
    { name: 'Career', href: '#career' },
    { name: 'Partners', href: '#partners' },
    { name: 'Contact Us', href: '#contact' },
  ];

  return (
    <>
      {links.map((link) => (
        <a
          key={link.name}
          href={link.href}
          className={`${
            isMobile 
              ? 'text-xl py-4 border-b border-gray-200' 
              : 'font-medium text-gray-700 hover:text-[#0056b3] transition-colors'
          }`}
          onClick={onClick}
        >
          {link.name}
        </a>
      ))}
    </>
  );
};

export default Header;