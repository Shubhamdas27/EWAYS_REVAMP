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
  const cardsRef = useRef<HTMLDivElement[]>([]);

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
      // Title animation
      gsap.fromTo(titleRef.current?.children || [],
        {
          y: 100,
          opacity: 0
        },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Cards staggered animation
      cardsRef.current.forEach((card, index) => {
        if (card) {
          gsap.fromTo(card,
            {
              y: 150,
              opacity: 0,
              scale: 0.8,
              rotation: -5
            },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              rotation: 0,
              duration: 1.2,
              delay: index * 0.15,
              ease: "back.out(1.7)",
              scrollTrigger: {
                trigger: card,
                start: "top 90%",
                toggleActions: "play none none reverse"
              }
            }
          );
        }
      });

      // Background elements animation
      const bgElements = servicesRef.current?.querySelectorAll('.bg-element');
      bgElements?.forEach((el, index) => {
        gsap.fromTo(el,
          {
            scale: 0,
            rotation: 0
          },
          {
            scale: 1,
            rotation: index % 2 === 0 ? 360 : -360,
            duration: 2,
            delay: 0.5,
            ease: "power2.out",
            scrollTrigger: {
              trigger: servicesRef.current,
              start: "top 70%",
              toggleActions: "play none none reverse"
            }
          }
        );

        // Continuous floating animation
        gsap.to(el, {
          y: index % 2 === 0 ? -30 : 30,
          rotation: index % 2 === 0 ? 10 : -10,
          duration: 4 + index,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: index * 0.5
        });
      });

    }, servicesRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={servicesRef} id="services" className="section-padding bg-gradient-to-br from-white via-blue-50/20 to-gray-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="bg-element absolute top-20 left-10 w-40 h-40 bg-gradient-to-br from-[#0056b3]/5 to-transparent rounded-full blur-2xl"></div>
      <div className="bg-element absolute bottom-20 right-10 w-32 h-32 bg-gradient-to-br from-[#ff7e2b]/5 to-transparent rounded-full blur-2xl"></div>
      <div className="bg-element absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-[#37b6ff]/3 to-transparent rounded-full blur-3xl"></div>
      
      <div className="container-custom relative z-10">
        <div ref={titleRef} className="text-center mb-16 space-y-4">
          <h2 className="section-title bg-gradient-to-r from-[#0056b3] to-[#37b6ff] bg-clip-text text-transparent">Our Services</h2>
          <p className="section-subtitle text-gray-600 max-w-2xl mx-auto">Comprehensive IT solutions tailored to your business needs with cutting-edge technology and expert implementation</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={service.id}
              ref={(el) => el && (cardsRef.current[index] = el)}
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