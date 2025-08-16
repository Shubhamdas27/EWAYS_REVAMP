import React from 'react'
import assets from '../assets/assets'
import Title from './Title'
import ServiceCard from './ServiceCard'
import {motion} from 'motion/react'

const Services = () => {

    const servicesData = [
        {
          title: 'Consultancy Services',
          description: 'We Eways Services Pvt Ltd provides you end to end solutions in multiple segment of IT services to introduce your own brand in business world.',
          icon: assets.content_icon
        },
        {
          title: 'Digital Pathshala',
          description: 'Educational solution designed to help students, teachers, parents and the school administrative staff to use school data in a more organized manner.',
          icon: assets.marketing_icon
        },
        {
            title: 'Manpower Services',
            description: 'We provide skilled-unskilled, technical-non technical resource to join the chain for transforming nation "Naya Bharat".',
            icon: assets.ads_icon,
        },
        {
            title: 'Financial Solutions',
            description: 'Ecommerce brings an end to end financial solution which enables every segment of merchant from small to large to manage their ecommerce portal.',
            icon: assets.social_icon,
        },
        {
            title: 'API Solutions',
            description: 'Are you looking for your own service based platform? If the answer is "yes", then come to the right place ESPL.',
            icon: assets.content_icon,
        },
        {
            title: 'Third Party Integration',
            description: 'We Eways Services are one of the most prominent Third Party API Integration Company that offer excellent website design, web development.',
            icon: assets.marketing_icon,
        },
    ]

  return (
    <motion.div 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      transition={{ staggerChildren: 0.2 }}
      
    id='services' className='relative flex flex-col items-center gap-7 px-4 sm:px-12 lg:px-24 xl:px-40 pt-30 text-gray-700 dark:text-white'>
        
        <img src={assets.bgImage2} alt="" className='absolute -top-110 -left-70 -z-1 dark:hidden'/>

    <Title title='Our Services' desc='Comprehensive technology solutions designed to accelerate your business growth and digital transformation journey.'/>

    <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-6'>
        {servicesData.map((service, index)=>(
            <ServiceCard key={index} service={service} index={index}/>
        ))}
    </div>

    </motion.div>
  )
}

export default Services
