import React, { useState } from 'react'
import assets from '../assets/assets'
import ThemeToggleBtn from './ThemeToggleBtn'
import { motion } from "motion/react"

const Navbar = ({theme, setTheme}) => {

    const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <motion.div
    initial={{opacity: 0, y: -50}}
    animate={{ opacity: 1, y: 0 }}
    transition={{duration: 0.6, ease: 'easeOut'}}
    className='flex justify-between items-center px-4 sm:px-12 lg:px-24 xl:px-40 py-3 sticky top-0 z-20 backdrop-blur-xl font-medium bg-white/80 dark:bg-gray-900/80 border-b border-gray-200/20 dark:border-gray-700/20 shadow-sm'>
      
        {/* Logo Section */}
        <div className='flex items-center'>
            <img src={theme === 'dark' ? assets.logo_dark : assets.logo} className='w-7 sm:w-10 transition-all duration-300 hover:scale-105' alt='Eways Services'/>
        </div>

        {/* Navigation Links */}
        <div className={`text-gray-700 dark:text-white sm:text-sm font-medium ${!sidebarOpen ? 'max-sm:w-0 overflow-hidden' : 'max-sm:w-60 max-sm:pl-10'} max-sm:fixed top-0 bottom-0 right-0 max-sm:min-h-screen max-sm:h-full max-sm:flex-col max-sm:bg-gradient-to-b max-sm:from-primary max-sm:to-blue-600 max-sm:text-white max-sm:pt-20 flex sm:items-center gap-6 transition-all duration-300 sm:ml-28`}>

            <img src={assets.close_icon} alt="" className='w-5 absolute right-4 top-4 sm:hidden hover:scale-110 transition-transform' onClick={()=> setSidebarOpen(false)}/>

            <a onClick={()=>setSidebarOpen(false)} href="#" className='hover:text-primary dark:hover:text-blue-400 transition-all duration-300 relative group'>
                Home
                <span className='absolute -bottom-1 left-0 w-0 h-0.5 bg-primary dark:bg-blue-400 group-hover:w-full transition-all duration-300'></span>
            </a>
            <a onClick={()=>setSidebarOpen(false)} href="#services" className='hover:text-primary dark:hover:text-blue-400 transition-all duration-300 relative group'>
                Services
                <span className='absolute -bottom-1 left-0 w-0 h-0.5 bg-primary dark:bg-blue-400 group-hover:w-full transition-all duration-300'></span>
            </a>
            <a onClick={()=>setSidebarOpen(false)} href="#about-section" className='hover:text-primary dark:hover:text-blue-400 transition-all duration-300 relative group'>
                About
                <span className='absolute -bottom-1 left-0 w-0 h-0.5 bg-primary dark:bg-blue-400 group-hover:w-full transition-all duration-300'></span>
            </a>
            <a onClick={()=>setSidebarOpen(false)} href="#careers" className='hover:text-primary dark:hover:text-blue-400 transition-all duration-300 relative group'>
                Careers
                <span className='absolute -bottom-1 left-0 w-0 h-0.5 bg-primary dark:bg-blue-400 group-hover:w-full transition-all duration-300'></span>
            </a>
            <a onClick={()=>setSidebarOpen(false)} href="#contact-us" className='hover:text-primary dark:hover:text-blue-400 transition-all duration-300 relative group'>
                Contact
                <span className='absolute -bottom-1 left-0 w-0 h-0.5 bg-primary dark:bg-blue-400 group-hover:w-full transition-all duration-300'></span>
            </a>
        </div>

        {/* Right Section - Theme Toggle & CTA */}
        <div className='flex items-center gap-3 sm:gap-4'>

            <ThemeToggleBtn theme={theme} setTheme={setTheme}/>

            <img src={theme === 'dark' ? assets.menu_icon_dark : assets.menu_icon} alt="" onClick={()=> setSidebarOpen(true)} className='w-8 sm:hidden hover:scale-110 transition-transform cursor-pointer'/>

            <a href="#contact-us" className='text-sm max-sm:hidden flex items-center gap-2 bg-gradient-to-r from-primary to-blue-600 text-white px-6 py-2.5 rounded-full cursor-pointer hover:scale-105 hover:shadow-lg transition-all duration-300 font-semibold'>
                Connect <img src={assets.arrow_icon} width={14} alt="" className='transition-transform group-hover:translate-x-1' />
            </a>
        </div>

    </motion.div>
  )
}

export default Navbar
