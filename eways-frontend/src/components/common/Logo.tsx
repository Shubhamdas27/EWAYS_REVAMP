import React from 'react';
import { Layout } from 'lucide-react';

const Logo: React.FC = () => {
  return (
    <a href="#" className="flex items-center">
      <Layout className="text-[#0056b3] mr-2" size={32} />
      <div>
        <h1 className="font-bold text-xl text-[#0056b3] leading-none">EWAYS</h1>
        <p className="text-xs text-gray-600 leading-none">SERVICES PRIVATE LIMITED</p>
      </div>
    </a>
  );
};

export default Logo;