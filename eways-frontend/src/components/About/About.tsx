import React from 'react';
import { CheckCircle, Award, TrendingUp, Clock } from 'lucide-react';

const About: React.FC = () => {
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

  return (
    <section id="about" className="section-padding bg-gray-50">
      <div className="container-custom">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="relative z-10">
              <img 
                src="https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg" 
                alt="EWAYS team collaborating" 
                className="rounded-lg shadow-xl w-full h-auto object-cover"
              />
            </div>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-[#0056b3] rounded-lg z-0"></div>
            <div className="absolute -top-4 -left-4 w-32 h-32 bg-[#ff7e2b] rounded-lg z-0"></div>
          </div>
          
          <div>
            <h2 className="section-title">About Us</h2>
            <p className="text-gray-600 mb-6">
              EWAYS SERVICES PRIVATE LIMITED is a leading IT solutions provider committed to delivering 
              innovative technology services that empower businesses to achieve their goals. 
              With a team of experienced professionals and a customer-centric approach, 
              we strive to exceed expectations in every project we undertake.
            </p>
            <p className="text-gray-600 mb-8">
              Our mission is to bridge the gap between business challenges and technology solutions, 
              ensuring our clients stay ahead in today's competitive landscape.
            </p>
            
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Why Choose Us</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {benefits.map((benefit) => (
                <div key={benefit.id} className="flex items-start">
                  <div className="mr-3 mt-1">{benefit.icon}</div>
                  <div>
                    <h4 className="font-medium text-gray-800">{benefit.title}</h4>
                    <p className="text-sm text-gray-600">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;