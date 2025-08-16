import React from 'react'
import { motion } from 'motion/react'
import Title from './Title'
import assets from '../assets/assets'

const WhyChooseUs = () => {
  const features = [
    {
      title: "24/7 Support",
      description: "Round-the-clock technical support to ensure your business never stops running.",
      icon: "⏰"
    },
    {
      title: "Expert Team",
      description: "Certified professionals with years of experience in enterprise solutions.",
      icon: "👥"
    },
    {
      title: "Proven Results",
      description: "Track record of successful digital transformations across industries.",
      icon: "📈"
    },
    {
      title: "Scalable Solutions",
      description: "Future-ready technology solutions that grow with your business.",
      icon: "🚀"
    }
  ]

  return (
    <motion.div 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      transition={{ staggerChildren: 0.2 }}
      id='why-choose-us'
      className='flex flex-col items-center gap-7 px-4 sm:px-12 lg:px-24 xl:px-40 pt-30 text-gray-700 dark:text-white'
    >
      <Title 
        title='Why Choose Eways Services?' 
        desc='We combine technical expertise with business acumen to deliver solutions that drive real results for your organization.'
      />
      
      <div className='grid sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl'>
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className='flex flex-col items-center text-center p-6 rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105'
          >
            <div className='text-4xl mb-4'>{feature.icon}</div>
            <h3 className='text-lg font-semibold mb-3'>{feature.title}</h3>
            <p className='text-sm opacity-70 leading-relaxed'>{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

export default WhyChooseUs
