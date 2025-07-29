import React, { useEffect, useRef } from 'react';
import ContactForm from './ContactForm';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Contact: React.FC = () => {
  const contactRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  const contactInfo = [
    {
      id: 1,
      icon: <MapPin size={20} className="text-[#0056b3]" />,
      title: 'Our Location',
      details: '123 Tech Park, Business District, City, Country - 123456',
    },
    {
      id: 2,
      icon: <Phone size={20} className="text-[#0056b3]" />,
      title: 'Call Us',
      details: '9123456780',
    },
    {
      id: 3,
      icon: <Mail size={20} className="text-[#0056b3]" />,
      title: 'Email Us',
      details: 'info@ewaysservices.com',
    },
    {
      id: 4,
      icon: <Clock size={20} className="text-[#0056b3]" />,
      title: 'Business Hours',
      details: 'Monday - Friday: 9:00 AM - 6:00 PM',
    }
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation
      gsap.fromTo(titleRef.current?.children || [],
        {
          y: 80,
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

      // Contact info animation
      gsap.fromTo(infoRef.current,
        {
          x: -100,
          opacity: 0
        },
        {
          x: 0,
          opacity: 1,
          duration: 1.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: infoRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Form animation
      gsap.fromTo(formRef.current,
        {
          x: 100,
          opacity: 0
        },
        {
          x: 0,
          opacity: 1,
          duration: 1.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: formRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Contact cards animation
      cardsRef.current.forEach((card, index) => {
        if (card) {
          gsap.fromTo(card,
            {
              y: 60,
              opacity: 0,
              scale: 0.9
            },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              duration: 0.8,
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
            gsap.to(card, { 
              y: -8, 
              scale: 1.05,
              boxShadow: "0 20px 40px -10px rgba(0, 86, 179, 0.3)",
              duration: 0.3, 
              ease: "power2.out" 
            });
          });
          
          card.addEventListener('mouseleave', () => {
            gsap.to(card, { 
              y: 0, 
              scale: 1,
              boxShadow: "0 4px 15px -3px rgba(0, 0, 0, 0.1)",
              duration: 0.3, 
              ease: "power2.out" 
            });
          });
        }
      });

    }, contactRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={contactRef} id="contact" className="section-padding bg-gradient-to-br from-gray-50 to-blue-50/30 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-20 right-10 w-64 h-64 bg-gradient-to-br from-[#0056b3]/5 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-10 w-48 h-48 bg-gradient-to-br from-[#ff7e2b]/5 to-transparent rounded-full blur-3xl"></div>
      
      <div className="container-custom relative z-10">
        <div ref={titleRef} className="text-center mb-16 space-y-4">
          <h2 className="section-title bg-gradient-to-r from-[#0056b3] to-[#37b6ff] bg-clip-text text-transparent">Get in Touch</h2>
          <p className="section-subtitle text-gray-600 max-w-2xl mx-auto">Reach out to us for any inquiries or to discuss your project. We're here to help you succeed.</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-16">
          <div ref={infoRef}>
            <h3 className="text-2xl font-bold mb-8 text-gray-800">Contact Information</h3>
            <div className="space-y-6 mb-10">
              {contactInfo.map((info, index) => (
                <div 
                  key={info.id} 
                  ref={(el) => el && (cardsRef.current[index] = el)}
                  className="flex items-start p-4 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100"
                >
                  <div className="mt-1 mr-4 p-2 bg-[#0056b3]/10 rounded-lg">{info.icon}</div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">{info.title}</h4>
                    <p className="text-gray-600">{info.details}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-gray-100">
              <h4 className="font-bold text-gray-800 mb-4 text-lg">Connect With Us</h4>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Follow us on social media to stay updated with our latest news, 
                insights, and technology trends.
              </p>
              <div className="flex space-x-4">
                <a href="#" 
                   title="Follow us on Facebook" 
                   aria-label="Follow EWAYS on Facebook"
                   className="w-12 h-12 bg-gradient-to-br from-[#0056b3] to-[#004494] rounded-xl flex items-center justify-center text-white hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </a>
                <a href="#" 
                   title="Follow us on Instagram" 
                   aria-label="Follow EWAYS on Instagram"
                   className="w-12 h-12 bg-gradient-to-br from-[#0056b3] to-[#004494] rounded-xl flex items-center justify-center text-white hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>
                <a href="#" 
                   title="Connect with us on LinkedIn" 
                   aria-label="Connect with EWAYS on LinkedIn"
                   className="w-12 h-12 bg-gradient-to-br from-[#0056b3] to-[#004494] rounded-xl flex items-center justify-center text-white hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect x="2" y="9" width="4" height="12"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                </a>
                <a href="#" 
                   title="Follow us on Twitter" 
                   aria-label="Follow EWAYS on Twitter"
                   className="w-12 h-12 bg-gradient-to-br from-[#0056b3] to-[#004494] rounded-xl flex items-center justify-center text-white hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          
          <div ref={formRef}>
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;