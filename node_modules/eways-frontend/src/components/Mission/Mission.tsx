import React from 'react';
import { Target, Eye, Heart } from 'lucide-react';

const Mission: React.FC = () => {
  return (
    <section className="section-padding bg-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#0056b3]/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#ff7e2b]/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
      
      <div className="container-custom relative z-10">
        <div className="text-center mb-16">
          <h2 className="section-title">Our Commitment</h2>
          <p className="section-subtitle">Guided by our mission, vision, and core values</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gray-50 rounded-lg p-8 text-center hover:shadow-lg transition-shadow">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#0056b3] rounded-full mb-4">
              <Target size={28} className="text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-800">Our Mission</h3>
            <p className="text-gray-600">
              To empower businesses with innovative technology solutions that drive growth, 
              efficiency, and competitive advantage in an ever-evolving digital landscape.
            </p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-8 text-center hover:shadow-lg transition-shadow">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#0056b3] rounded-full mb-4">
              <Eye size={28} className="text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-800">Our Vision</h3>
            <p className="text-gray-600">
              To be the most trusted technology partner for businesses worldwide, 
              known for our expertise, innovation, and commitment to client success.
            </p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-8 text-center hover:shadow-lg transition-shadow">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#0056b3] rounded-full mb-4">
              <Heart size={28} className="text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-800">Our Values</h3>
            <p className="text-gray-600">
              Integrity, excellence, innovation, collaboration, and client-centricity 
              form the foundation of everything we do at EWAYS SERVICES.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Mission;