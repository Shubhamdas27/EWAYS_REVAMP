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
        boxShadow: "0 25px 50px -12px rgba(0, 86, 179, 0.25)",
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
      className="service-card group bg-white/80 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden relative"
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0056b3]/5 via-transparent to-[#ff7e2b]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <div className="p-6 md:p-8 relative z-10">
        <div 
          ref={iconRef}
          className="mb-6 p-4 bg-gradient-to-br from-blue-50 to-blue-100 inline-block rounded-xl shadow-md"
        >
          {icon}
        </div>
        
        <div ref={contentRef} className="space-y-4">
          <h3 className="text-xl font-bold mb-3 text-gray-800 group-hover:text-[#0056b3] transition-colors duration-300">
            {title}
          </h3>
          <p className="text-gray-600 mb-6 leading-relaxed">
            {description}
          </p>
          <a 
            href="#contact" 
            className="inline-flex items-center text-[#0056b3] font-semibold hover:text-[#004494] transition-all duration-300 group/link"
          >
            <span className="relative">
              Learn More
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#0056b3] group-hover/link:w-full transition-all duration-300"></span>
            </span>
            <ArrowRight size={16} className="ml-2 group-hover/link:translate-x-2 transition-transform duration-300" />
          </a>
        </div>
      </div>
      
      {/* Decorative corner element */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[#0056b3]/10 to-transparent rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </div>
  );
};

export default ServiceCard;