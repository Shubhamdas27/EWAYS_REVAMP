import React, { useRef, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { gsap } from 'gsap';

interface ServiceCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ title, description, icon }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    const iconEl = iconRef.current;
    const content = contentRef.current;

    if (!card || !iconEl || !content) return;

    // Hover animations
    const handleMouseEnter = () => {
      gsap.to(card, {
        y: -15,
        scale: 1.03,
        boxShadow: "0 25px 50px -12px rgba(26, 54, 93, 0.25)",
        duration: 0.4,
        ease: "power2.out"
      });

      gsap.to(iconEl, {
        scale: 1.1,
        rotation: 5,
        duration: 0.3,
        ease: "back.out(1.7)"
      });

      gsap.to(content?.children || [], {
        y: -5,
        duration: 0.3,
        stagger: 0.05,
        ease: "power2.out"
      });
    };

    const handleMouseLeave = () => {
      gsap.to(card, {
        y: 0,
        scale: 1,
        boxShadow: "0 10px 25px -3px rgba(0, 0, 0, 0.1)",
        duration: 0.4,
        ease: "power2.out"
      });

      gsap.to(iconEl, {
        scale: 1,
        rotation: 0,
        duration: 0.3,
        ease: "back.out(1.7)"
      });

      gsap.to(content?.children || [], {
        y: 0,
        duration: 0.3,
        stagger: 0.05,
        ease: "power2.out"
      });
    };

    card.addEventListener('mouseenter', handleMouseEnter);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mouseenter', handleMouseEnter);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div 
      ref={cardRef}
      className="service-card group bg-white/95 backdrop-blur-sm border border-[#d4af37]/20 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden relative"
    >
      {/* Royal gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a365d]/5 via-[#553c9a]/3 to-[#d4af37]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <div className="p-6 md:p-8 relative z-10">
        <div 
          ref={iconRef}
          className="mb-6 p-4 bg-gradient-to-br from-[#faf5f0] to-[#d4af37]/10 inline-block rounded-xl shadow-md border border-[#d4af37]/20"
        >
          {icon}
        </div>
        
        <div ref={contentRef} className="space-y-4">
          <h3 className="text-xl font-bold mb-3 text-[#1e2a4a] group-hover:text-[#553c9a] transition-colors duration-300 playfair-font">
            {title}
          </h3>
          <p className="text-gray-600 mb-6 leading-relaxed">
            {description}
          </p>
          <a 
            href="#contact" 
            className="inline-flex items-center text-[#1a365d] font-semibold hover:text-[#553c9a] transition-all duration-300 group/link"
          >
            <span className="relative">
              Learn More
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#1a365d] to-[#553c9a] group-hover/link:w-full transition-all duration-300"></span>
            </span>
            <ArrowRight size={16} className="ml-2 group-hover/link:translate-x-2 transition-transform duration-300" />
          </a>
        </div>
      </div>
      
      {/* Royal decorative corner element */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[#d4af37]/10 to-[#553c9a]/5 rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </div>
  );
};

export default ServiceCard;