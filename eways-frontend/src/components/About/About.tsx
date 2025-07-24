import React, { useEffect, useRef } from 'react';
import { CheckCircle, Award, TrendingUp, Clock } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const About: React.FC = () => {
  const aboutRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  const benefits = [
    {
      id: 1,
      title: 'Expertise & Experience',
      description: 'Over 10 years of industry experience with certified experts',
      icon: <Award size={20} className="text-[#0056b3]" />,
    },
    {
      id: 2,
      title: 'Innovative Solutions',
      description: 'Cutting-edge technologies and forward-thinking approaches',
      icon: <TrendingUp size={20} className="text-[#0056b3]" />,
    },
    {
      id: 3,
      title: 'Customer-Centric',
      description: 'Tailored solutions designed around your specific needs',
      icon: <CheckCircle size={20} className="text-[#0056b3]" />,
    },
    {
      id: 4,
      title: 'Timely Delivery',
      description: 'Committed to delivering solutions on schedule, every time',
      icon: <Clock size={20} className="text-[#0056b3]" />,
    },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Image animation on scroll
      gsap.fromTo(imageRef.current, 
        {
          x: -100,
          opacity: 0,
          scale: 0.8
        },
        {
          x: 0,
          opacity: 1,
          scale: 1,
          duration: 1.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: aboutRef.current,
            start: "top 70%",
            end: "bottom 30%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Content animation
      gsap.fromTo(contentRef.current?.children || [], 
        {
          y: 50,
          opacity: 0
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: contentRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Cards animation
      cardsRef.current.forEach((card, index) => {
        if (card) {
          gsap.fromTo(card,
            {
              y: 100,
              opacity: 0,
              scale: 0.8
            },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              duration: 0.6,
              delay: index * 0.1,
              ease: "back.out(1.7)",
              scrollTrigger: {
                trigger: card,
                start: "top 85%",
                toggleActions: "play none none reverse"
              }
            }
          );

          // Hover effect
          card.addEventListener('mouseenter', () => {
            gsap.to(card, { y: -10, scale: 1.05, duration: 0.3, ease: "power2.out" });
          });
          
          card.addEventListener('mouseleave', () => {
            gsap.to(card, { y: 0, scale: 1, duration: 0.3, ease: "power2.out" });
          });
        }
      });

      // Parallax effect for decorative elements
      const decorElements = aboutRef.current?.querySelectorAll('.decor-element');
      decorElements?.forEach((el, index) => {
        gsap.to(el, {
          yPercent: index % 2 === 0 ? -50 : 50,
          ease: "none",
          scrollTrigger: {
            trigger: aboutRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1
          }
        });
      });

    }, aboutRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={aboutRef} id="about" className="section-padding bg-gradient-to-br from-gray-50 to-blue-50/30 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="decor-element absolute top-20 right-10 w-32 h-32 bg-gradient-to-br from-[#0056b3]/10 to-transparent rounded-full blur-xl"></div>
      <div className="decor-element absolute bottom-20 left-10 w-24 h-24 bg-gradient-to-br from-[#ff7e2b]/10 to-transparent rounded-full blur-xl"></div>
      
      <div className="container-custom relative z-10">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div ref={imageRef} className="relative">
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg" 
                alt="EWAYS team collaborating" 
                className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-[#0056b3]/20 via-transparent to-[#ff7e2b]/10"></div>
            </div>
            <div className="decor-element absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-br from-[#0056b3] to-[#0056b3]/70 rounded-2xl z-0 blur-sm"></div>
            <div className="decor-element absolute -top-6 -left-6 w-40 h-40 bg-gradient-to-br from-[#ff7e2b] to-[#ff7e2b]/70 rounded-2xl z-0 blur-sm"></div>
          </div>
          
          <div ref={contentRef} className="space-y-6">
            <h2 className="section-title bg-gradient-to-r from-[#0056b3] to-[#37b6ff] bg-clip-text text-transparent">About Us</h2>
            <p className="text-gray-700 text-lg leading-relaxed">
              EWAYS SERVICES PRIVATE LIMITED is a leading IT solutions provider committed to delivering 
              innovative technology services that empower businesses to achieve their goals. 
              With a team of experienced professionals and a customer-centric approach, 
              we strive to exceed expectations in every project we undertake.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Our mission is to bridge the gap between business challenges and technology solutions, 
              ensuring our clients stay ahead in today's competitive landscape.
            </p>
            
            <div>
              <h3 className="text-2xl font-semibold mb-6 text-gray-800">Why Choose Us</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {benefits.map((benefit, index) => (
                  <div 
                    key={benefit.id} 
                    ref={(el) => el && (cardsRef.current[index] = el)}
                    className="flex items-start p-4 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
                  >
                    <div className="mr-4 mt-1 p-2 bg-[#0056b3]/10 rounded-lg">{benefit.icon}</div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">{benefit.title}</h4>
                      <p className="text-sm text-gray-600 leading-relaxed">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;