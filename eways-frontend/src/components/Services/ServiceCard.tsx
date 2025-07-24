import React from 'react';
import { ArrowRight } from 'lucide-react';

interface ServiceCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ title, description, icon }) => {
  return (
    <div className="service-card group">
      <div className="p-6 md:p-8">
        <div className="mb-6 p-4 bg-blue-50 inline-block rounded-lg">
          {icon}
        </div>
        <h3 className="text-xl font-semibold mb-3 text-gray-800">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        <a 
          href="#contact" 
          className="inline-flex items-center text-[#0056b3] font-medium hover:text-[#004494] transition-colors"
        >
          Read More <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
        </a>
      </div>
    </div>
  );
};

export default ServiceCard;