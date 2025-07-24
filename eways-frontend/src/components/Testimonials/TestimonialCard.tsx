import React from 'react';
import { Quote } from 'lucide-react';

interface TestimonialCardProps {
  name: string;
  position: string;
  content: string;
  image: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ name, position, content, image }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 md:p-8 h-full flex flex-col">
      <div className="mb-6">
        <Quote size={36} className="text-[#0056b3]/20" />
      </div>
      <p className="text-gray-600 italic mb-6 flex-grow">{content}</p>
      <div className="flex items-center">
        <img 
          src={image} 
          alt={name} 
          className="w-12 h-12 rounded-full object-cover mr-4"
        />
        <div>
          <h4 className="font-semibold text-gray-800">{name}</h4>
          <p className="text-sm text-gray-500">{position}</p>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;