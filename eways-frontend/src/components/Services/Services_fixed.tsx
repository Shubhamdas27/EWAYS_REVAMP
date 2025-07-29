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

  return (
    <section className="section-padding bg-gradient-to-br from-gray-50 to-blue-50 relative">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="section-title">Our Services</h2>
          <p className="section-subtitle max-w-3xl mx-auto">
            Comprehensive IT solutions designed to accelerate your business growth and digital transformation journey.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div
              key={service.id}
              className="group transform transition-all duration-500 hover:shadow-2xl hover:-translate-y-2"
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
