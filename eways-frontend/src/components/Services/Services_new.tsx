import React, { useEffect, useRef } from 'react';
import ServiceCard from './ServiceCard';
import { 
  FileCode, Users, GraduationCap, DollarSign, 
  Code, Link, Building
} from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Services: React.FC = () => {
  const servicesRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  const services = [
    {
      id: 1,
      title: 'Consultancy Services',
      description: 'Expert IT consultancy to transform your business strategy and operations with tailored technology solutions.',
      icon: <FileCode size={40} className="text-[#0056b3]" />,
    },
    {
      id: 2,
      title: 'Digital Pathshala',
      description: 'Comprehensive digital learning solutions to empower your workforce with cutting-edge skills and knowledge.',
      icon: <GraduationCap size={40} className="text-[#0056b3]" />,
    },
    {
      id: 3,
      title: 'Manpower Services',
      description: 'Access to skilled IT professionals to strengthen your team and achieve your business objectives.',
      icon: <Users size={40} className="text-[#0056b3]" />,
    },
    {
      id: 4,
      title: 'Financial Solutions',
      description: 'Innovative financial technology solutions to streamline your financial processes and enhance decision-making.',
      icon: <DollarSign size={40} className="text-[#0056b3]" />,
    },
    {
      id: 5,
      title: 'API Solutions',
      description: 'Custom API development and integration services to connect your systems and create seamless workflows.',
      icon: <Code size={40} className="text-[#0056b3]" />,
    },
    {
      id: 6,
      title: 'Third Party Integration',
      description: 'Seamless integration of third-party services and platforms to enhance your existing systems.',
      icon: <Link size={40} className="text-[#0056b3]" />,
    },
    {
      id: 7,
      title: 'Residential Societies Services',
      description: 'Specialized technology solutions for residential societies to improve management and resident experience.',
      icon: <Building size={40} className="text-[#0056b3]" />,
    }
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Enhanced title animation
      if (titleRef.current?.children) {
        gsap.fromTo(Array.from(titleRef.current.children),
          {
            y: 100,
            opacity: 0,
            scale: 0.8,
            rotationX: -90
          },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            rotationX: 0,
            duration: 1.2,
            stagger: 0.2,
            ease: "back.out(1.7)",
            scrollTrigger: {
              trigger: titleRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse"
            }
          }
        );
      }

      // Enhanced cards animation
      cardsRef.current.forEach((card, index) => {
        if (card) {
          gsap.fromTo(card,
            {
              y: 80,
              opacity: 0,
              scale: 0.8,
              rotationY: index % 2 === 0 ? -15 : 15
            },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              rotationY: 0,
              duration: 1,
              delay: index * 0.1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: card,
                start: "top 85%",
                toggleActions: "play none none reverse"
              }
            }
          );
        }
      });

      // Floating background shapes
      const shapes = servicesRef.current?.querySelectorAll('.floating-shape');
      shapes?.forEach((shape, index) => {
        gsap.to(shape, {
          y: index % 2 === 0 ? -30 : 30,
          x: index % 3 === 0 ? 20 : -20,
          rotation: index % 2 === 0 ? 360 : -360,
          duration: 8 + index * 2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        });
      });

    }, servicesRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={servicesRef} className="section-padding bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
      {/* Enhanced background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="floating-shape absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-blue-200 to-blue-100 rounded-full opacity-30 blur-xl"></div>
        <div className="floating-shape absolute bottom-32 right-16 w-40 h-40 bg-gradient-to-br from-orange-200 to-orange-100 rounded-full opacity-25 blur-xl"></div>
        <div className="floating-shape absolute top-1/2 left-1/4 w-24 h-24 bg-gradient-to-br from-purple-200 to-purple-100 rounded-full opacity-20 blur-lg"></div>
        <div className="floating-shape absolute bottom-1/4 right-1/3 w-20 h-20 bg-gradient-to-br from-green-200 to-green-100 rounded-full opacity-25 blur-lg"></div>
      </div>

      <div className="container-custom relative z-10">
        <div ref={titleRef} className="text-center mb-16 stagger-container">
          <h2 className="section-title text-gradient">Our Services</h2>
          <p className="section-subtitle max-w-3xl mx-auto">
            Comprehensive IT solutions designed to accelerate your business growth and digital transformation journey.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={service.id}
              ref={(el) => cardsRef.current[index] = el}
              className="magnetic animated-card group transform transition-all duration-500 hover:shadow-2xl"
            >
              <ServiceCard
                title={service.title}
                description={service.description}
                icon={service.icon}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
