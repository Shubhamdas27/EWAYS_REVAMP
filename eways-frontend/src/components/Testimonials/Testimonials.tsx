import React, { useState, useEffect } from 'react';
import TestimonialCard from './TestimonialCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Testimonials: React.FC = () => {
  const testimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      position: 'CEO, TechFirm Inc.',
      content: 'EWAYS Services provided exceptional IT consultancy that transformed our operations. Their team\'s expertise and professionalism exceeded our expectations at every step.',
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
    },
    {
      id: 2,
      name: 'Mark Williams',
      position: 'CTO, Global Solutions',
      content: 'The API integration solutions delivered by EWAYS were exactly what we needed. They understood our requirements perfectly and delivered a seamless solution on time and within budget.',
      image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
    },
    {
      id: 3,
      name: 'Priya Sharma',
      position: 'Director, Innovate Tech',
      content: 'Working with EWAYS on our digital transformation journey has been a game-changer. Their expertise and commitment to excellence make them a trusted technology partner.',
      image: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg',
    },
    {
      id: 4,
      name: 'David Chen',
      position: 'Manager, Horizon Solutions',
      content: 'The manpower services provided by EWAYS helped us scale our development team quickly with highly skilled professionals who integrated seamlessly with our existing team.',
      image: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg',
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayCount, setDisplayCount] = useState(1);

  const updateDisplayCount = () => {
    if (window.innerWidth >= 1024) {
      setDisplayCount(3);
    } else if (window.innerWidth >= 768) {
      setDisplayCount(2);
    } else {
      setDisplayCount(1);
    }
  };

  useEffect(() => {
    updateDisplayCount();
    window.addEventListener('resize', updateDisplayCount);
    
    return () => {
      window.removeEventListener('resize', updateDisplayCount);
    };
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      (prevIndex + 1) % (testimonials.length - displayCount + 1)
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - displayCount : prevIndex - 1
    );
  };

  return (
    <section id="partners" className="section-padding bg-gray-50 relative">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="section-title">Client Testimonials</h2>
          <p className="section-subtitle">What our clients say about working with us</p>
        </div>
        
        <div className="relative">
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * (100 / displayCount)}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div 
                  key={testimonial.id} 
                  className="flex-shrink-0 px-4" 
                  style={{ width: `${100 / displayCount}%` }}
                >
                  <TestimonialCard
                    name={testimonial.name}
                    position={testimonial.position}
                    content={testimonial.content}
                    image={testimonial.image}
                  />
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-center mt-8 space-x-4">
            <button 
              onClick={prevSlide}
              className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-gray-600 hover:text-[#0056b3] transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={nextSlide}
              className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-gray-600 hover:text-[#0056b3] transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;