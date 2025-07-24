import { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';

const Hero: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  };

  return (
    <section id="home" className="relative bg-gradient-to-br from-gray-50 to-blue-50 pt-28 pb-20 md:pt-32 md:pb-28 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-[#0056b3]/10 to-transparent z-0"></div>
      
      {/* Animated background elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-[#0056b3]/20 rounded-full animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-16 h-16 bg-[#ff7e2b]/30 rounded-full animate-bounce"></div>
      
      <div className="container-custom relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 leading-tight">
              IT Solutions <br />
              <span className="text-[#0056b3] inline-block transform hover:scale-105 transition-transform duration-300">
                That Drive Growth
              </span>
            </h1>
            <p className="text-lg text-gray-700 mb-8 max-w-lg leading-relaxed">
              Delivering innovative IT services and solutions to empower businesses of all sizes. 
              From consultancy to implementation, we're your trusted technology partner.
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => scrollToSection('#services')} 
                className="btn btn-primary group"
              >
                Explore Services 
                <ChevronRight size={18} className="inline ml-1 group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={() => scrollToSection('#contact')} 
                className="btn btn-outline"
              >
                Contact Us
              </button>
            </div>
          </div>
          
          <div className={`relative hidden md:block transition-all duration-1200 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            <div className="relative z-10 rounded-lg overflow-hidden shadow-2xl hover:shadow-3xl transition-shadow duration-500">
              <img 
                src="https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg" 
                alt="IT Professionals working together" 
                className="w-full h-auto object-cover rounded-lg transform hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#ff7e2b] rounded-lg z-0 animate-pulse"></div>
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-[#0056b3] rounded-lg z-0 animate-pulse"></div>
          </div>
        </div>
      </div>
      
      {/* Wave divider */}
      <div className="absolute bottom-0 w-full h-16 bg-white" style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 0)' }}></div>
    </section>
  );
};

export default Hero;