import React from 'react';
import ServiceCard from './ServiceCard';
import { 
  FileCode, Users, GraduationCap, DollarSign, 
  Code, Link, Building
} from 'lucide-react';

const Services: React.FC = () => {
  const services = [
    {
      id: 1,
      title: 'Consultancy Services',
      description: 'Expert IT consultancy to transform your business strategy and operations with tailored technology solutions.',
      icon: <FileCode size={40} className="text-[#1a365d]" />,
    },
    {
      id: 2,
      title: 'Digital Pathshala',
      description: 'Comprehensive digital learning solutions to empower your workforce with cutting-edge skills and knowledge.',
      icon: <GraduationCap size={40} className="text-[#553c9a]" />,
    },
    {
      id: 3,
      title: 'Manpower Services',
      description: 'Access to skilled IT professionals to strengthen your team and achieve your business objectives.',
      icon: <Users size={40} className="text-[#1e2a4a]" />,
    },
    {
      id: 4,
      title: 'Financial Solutions',
      description: 'Innovative financial technology solutions to streamline your financial processes and enhance decision-making.',
      icon: <DollarSign size={40} className="text-[#d4af37]" />,
    },
    {
      id: 5,
      title: 'API Solutions',
      description: 'Custom API development and integration services to connect your systems and create seamless workflows.',
      icon: <Code size={40} className="text-[#553c9a]" />,
    },
    {
      id: 6,
      title: 'Third Party Integration',
      description: 'Seamless integration of third-party services and platforms to enhance your existing systems.',
      icon: <Link size={40} className="text-[#1a365d]" />,
    },
    {
      id: 7,
      title: 'Residential Societies Services',
      description: 'Specialized technology solutions for residential societies to improve management and resident experience.',
      icon: <Building size={40} className="text-[#1e2a4a]" />,
    }
  ];

  return (
    <section id="services" className="section-padding bg-gradient-to-br from-[#faf5f0] via-white to-[#faf5f0] relative overflow-hidden">
      {/* Royal decorative elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-[#d4af37]/20 to-[#553c9a]/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-[#553c9a]/20 to-[#1e2a4a]/20 rounded-full blur-3xl"></div>
      
      <div className="container-custom relative z-10">
        <div className="text-center mb-16 animate-on-scroll">
          <h2 className="section-title royal-heading">Our Royal Services</h2>
          <p className="section-subtitle max-w-3xl mx-auto">
            Comprehensive IT solutions designed to accelerate your business growth and digital transformation journey with royal excellence.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div
              key={service.id}
              className="group transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 animate-on-scroll stagger-item"
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
