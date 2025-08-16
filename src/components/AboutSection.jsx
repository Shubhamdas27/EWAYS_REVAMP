import React from 'react'
import { motion } from 'motion/react'
import Title from './Title'

const AboutSection = () => {
  const aboutData = [
    {
      title: "Our Mission",
      content: "Breaking Barriers, Building Bonds",
      icon: "🎯",
      description: "We help you to setup your own brand to take participate in building 'NAYA BHARAT'."
    },
    {
      title: "Our Vision", 
      content: "To foster growth by helping organizations with entrepreneurial potential and realize their aspirations.",
      icon: "👁️",
      description: "Empowering businesses to achieve their dreams and contribute to nation building."
    },
    {
      title: "Our Goal",
      content: "To create sustainable long-term growth, to deliver superior returns to partners and contribute to the nation building.",
      icon: "🚀",
      description: "Building a stronger future through technology and innovation."
    }
  ]

  const coreValues = [
    {
      title: "Customer Focus",
      description: "Our success is based upon our partners focus. We listen to, and connect with, partners and treat them with dignity and respect.",
      icon: "🎯"
    },
    {
      title: "Challenger Spirit", 
      description: "When faced with challenges and opportunities, we do not say 'Cannot' but ask 'Why not?'. We are tenacious and we compete fairly.",
      icon: "⚡"
    },
    {
      title: "Teamwork",
      description: "By working as one team with shared goals, we believe we can achieve great things. We value ideas and contributions from everyone.",
      icon: "🤝"
    },
    {
      title: "Integrity",
      description: "We are honest in our dealings, taking responsibility and being accountable for our actions with highest ethical standards.",
      icon: "💎"
    },
    {
      title: "Personal Excellence",
      description: "We are committed to doing and being the best. We seek continuous improvement and take pride in what we do.",
      icon: "🌟"
    },
    {
      title: "Innovation",
      description: "We believe that the world is a better place when technology is used to help people and businesses communicate effortlessly.",
      icon: "💡"
    }
  ]

  return (
    <motion.div 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      transition={{ staggerChildren: 0.2 }}
      id='about-section'
      className='flex flex-col items-center gap-7 px-4 sm:px-12 lg:px-24 xl:px-40 pt-30 text-gray-700 dark:text-white bg-gray-50 dark:bg-gray-800/30 py-20'
    >
      <Title 
        title='About EWAYS Services' 
        desc='A start-up venture put in place by young professional minds with experience from business market and analyses of user needs.'
      />

      {/* Company Description */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className='max-w-4xl text-center mb-10'
      >
        <p className='text-sm sm:text-base opacity-80 leading-relaxed mb-6'>
          EWAYS Services Private Ltd is a start-up venture which provides leading edge solutions and services in different domains. 
          The company robustly believes in customer satisfaction through keen support, excellence service, management and reliability.
        </p>
        <p className='text-sm sm:text-base opacity-80 leading-relaxed'>
          EWAYS Services Private Ltd provides an end to end technology solution which enables every individual who have dreams 
          for their own platform. We manage your platform including website designing, Mobile App development, and customize product development.
        </p>
      </motion.div>

      {/* Mission, Vision, Goal */}
      <div className='grid sm:grid-cols-1 lg:grid-cols-3 gap-8 w-full max-w-6xl mb-16'>
        {aboutData.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            viewport={{ once: true }}
            className='bg-white dark:bg-gray-900 p-8 rounded-xl shadow-lg text-center hover:shadow-xl transition-all duration-300'
          >
            <div className='text-4xl mb-4'>{item.icon}</div>
            <h3 className='text-xl font-bold mb-4 text-primary dark:text-blue-400'>{item.title}</h3>
            <p className='text-sm font-medium mb-3 italic'>"{item.content}"</p>
            <p className='text-sm opacity-70'>{item.description}</p>
          </motion.div>
        ))}
      </div>

      {/* Core Values */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className='w-full max-w-6xl'
      >
        <h3 className='text-2xl font-bold text-center mb-4'>Core Values</h3>
        <p className='text-center text-sm opacity-70 mb-10 max-w-3xl mx-auto'>
          ESPL Core Values underpin desire to create a unity of purpose across the verticals. 
          Reflect common aspiration to foster a performance-based culture that is open and innovative.
        </p>
        
        <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-6'>
          {coreValues.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
              className='bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300'
            >
              <div className='flex items-center gap-3 mb-3'>
                <span className='text-2xl'>{value.icon}</span>
                <h4 className='font-semibold text-lg'>{value.title}</h4>
              </div>
              <p className='text-sm opacity-80 leading-relaxed'>{value.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Why Choose Us */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        viewport={{ once: true }}
        className='bg-primary/10 dark:bg-primary/20 p-8 rounded-xl text-center max-w-4xl mt-16'
      >
        <h3 className='text-2xl font-bold mb-4 text-primary dark:text-blue-400'>Why Choose Us</h3>
        <p className='text-lg font-medium mb-4'>We help you to setup your own brand to take participate in building 'NAYA BHARAT'.</p>
        <p className='text-sm opacity-80'>
          We make communication easier, faster and more reliable for customers, while delivering value to our partners.
        </p>
      </motion.div>
    </motion.div>
  )
}

export default AboutSection
