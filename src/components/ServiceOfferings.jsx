import React from 'react'
import { motion } from 'motion/react'
import Title from './Title'

const ServiceOfferings = () => {
  const serviceCategories = [
    {
      category: "Consultancy Services",
      services: [
        "End-to-end IT Solutions",
        "Strategic Business Planning",
        "Market Entry & Creation",
        "Brand Development"
      ]
    },
    {
      category: "Digital Pathshala",
      services: [
        "Educational Management System", 
        "Student Data Organization",
        "Virtual Audio & Video Classes",
        "Digital Class Room Solutions"
      ]
    },
    {
      category: "Manpower Services",
      services: [
        "Skilled & Unskilled Resources",
        "Technical Workforce",
        "Nation Building Programs",
        "Naya Bharat Initiative"
      ]
    },
    {
      category: "Financial Solutions",
      services: [
        "E-commerce Portal Management",
        "Payment Gateway Integration",
        "Business Financial Planning",
        "Merchant Solutions"
      ]
    },
    {
      category: "API Solutions",
      services: [
        "Travel & Insurance APIs",
        "Service-based Platforms",
        "Online Presence Development",
        "Custom API Integration"
      ]
    },
    {
      category: "Third Party Integration",
      services: [
        "Website Design & Development",
        "Mobile App Development",
        "API Integration Services",
        "Custom Integration Solutions"
      ]
    },
    {
      category: "Residential Societies Services",
      services: [
        "Society Management Platform",
        "RWA/Apartment Management",
        "Transparency & Communication",
        "Committee Management"
      ]
    }
  ]

  return (
    <motion.div 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      transition={{ staggerChildren: 0.2 }}
      id='service-offerings'
      className='flex flex-col items-center gap-7 px-4 sm:px-12 lg:px-24 xl:px-40 pt-30 text-gray-700 dark:text-white bg-gray-50 dark:bg-gray-800/50 py-20'
    >
      <Title 
        title='Complete Service Portfolio' 
        desc='Comprehensive technology solutions covering every aspect of your digital transformation journey.'
      />
      
      {/* Horizontal Scrolling Container */}
      <div className='w-full max-w-7xl overflow-hidden'>
        <div className='flex gap-6 overflow-x-auto scrollbar-hide horizontal-scroll pb-4'>
          {serviceCategories.map((category, categoryIndex) => (
            <motion.div
              key={categoryIndex}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
              viewport={{ once: true }}
              className='flex-shrink-0 w-80 bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:scale-105'
            >
              <h3 className='text-lg font-bold mb-6 text-primary dark:text-blue-400 border-b border-gray-200 dark:border-gray-700 pb-3'>
                {category.category}
              </h3>
              <ul className='space-y-3'>
                {category.services.map((service, serviceIndex) => (
                  <motion.li
                    key={serviceIndex}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: (categoryIndex * 0.1) + (serviceIndex * 0.05) }}
                    viewport={{ once: true }}
                    className='text-sm text-gray-600 dark:text-gray-300 flex items-start'
                  >
                    <span className='text-primary dark:text-blue-400 mr-2 font-bold'>•</span>
                    {service}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
        
        {/* Scroll Indicator */}
        <div className='flex justify-center mt-6'>
          <div className='flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 animate-pulse'>
            <span>←</span>
            <span>Scroll horizontally to see more services</span>
            <span>→</span>
          </div>
        </div>
      </div>

      {/* Custom CSS for hiding scrollbar */}
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </motion.div>
  )
}

export default ServiceOfferings
