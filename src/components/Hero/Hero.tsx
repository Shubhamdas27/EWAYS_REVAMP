import React from 'react';
import { ChevronRight } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section id="home" className="relative bg-gray-50 pt-28 pb-20 md:pt-32 md:pb-28">
      <div className="absolute inset-0 bg-gradient-to-r from-[#0056b3]/10 to-transparent z-0"></div>
      
      <div className="container-custom relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
              IT Solutions <br />
              <span className="text-[#0056b3]">That Drive Growth</span>
            </h1>
            <p className="text-lg text-gray-700 mb-8 max-w-lg">
              Delivering innovative IT services and solutions to empower businesses of all sizes. 
              From consultancy to implementation, we're your trusted technology partner.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#services" className="btn btn-primary">
                Explore Services <ChevronRight size={18} className="inline ml-1" />
              </a>
              <a href="#contact" className="btn btn-outline">
                Contact Us
              </a>
            </div>
          </div>
          
          <div className="relative hidden md:block">
            <div className="relative z-10 rounded-lg overflow-hidden shadow-2xl">
              <img 
                src="https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg" 
                alt="IT Professionals working together" 
                className="w-full h-auto object-cover rounded-lg"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#ff7e2b] rounded-lg z-0"></div>
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-[#0056b3] rounded-lg z-0"></div>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 w-full h-16 bg-white" style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 0)' }}></div>
    </section>
  );
};

export default Hero;