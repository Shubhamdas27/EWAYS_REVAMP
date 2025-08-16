import React from 'react'
import Title from './Title'
import assets from '../assets/assets'
import toast from 'react-hot-toast'
import {motion} from 'motion/react'

const ContactUs = () => {

    const onSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);

        // ------- Enter your Web3Forms key below -----
        formData.append("access_key", "--- Enter Web3Forms key ---");

        try {
            const response = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            body: formData
            });

            const data = await response.json();

            if (data.success) {
            toast.success('Thank you for your submission!')
            event.target.reset();
            } else {
            toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
        
    }

  return (
    <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true }}
    transition={{ staggerChildren: 0.2 }}
    id='contact-us' className='flex flex-col items-center gap-7 px-4 sm:px-12 lg:px-24 xl:px-40 pt-30 text-gray-700 dark:text-white'>
      <Title title='Contact Us' desc='We are here to help you. Get in touch with our expert team for any queries or support.'/>

      {/* Contact Information */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        viewport={{ once: true }}
        className='grid sm:grid-cols-3 gap-8 w-full max-w-4xl mb-10'
      >
        <div className='text-center p-6 rounded-xl bg-white dark:bg-gray-900 shadow-lg'>
          <div className='text-3xl mb-4'>📍</div>
          <h3 className='font-semibold mb-3'>Our Address</h3>
          <p className='text-sm opacity-70'>
            F-124, E.V.Nagar, Kalyanvas<br/>
            East Delhi, New Delhi - 110091<br/>
            India
          </p>
        </div>
        
        <div className='text-center p-6 rounded-xl bg-white dark:bg-gray-900 shadow-lg'>
          <div className='text-3xl mb-4'>📞</div>
          <h3 className='font-semibold mb-3'>Call Us</h3>
          <p className='text-sm opacity-70'>
            +91-955-5568-955<br/>
            (Monday to Saturday)
          </p>
        </div>
        
        <div className='text-center p-6 rounded-xl bg-white dark:bg-gray-900 shadow-lg'>
          <div className='text-3xl mb-4'>✉️</div>
          <h3 className='font-semibold mb-3'>Email Us</h3>
          <p className='text-sm opacity-70'>
            support@ewaysservices.com
          </p>
        </div>
      </motion.div>

      <motion.form 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        viewport={{ once: true }}
      onSubmit={onSubmit} className='grid sm:grid-cols-2 gap-3 sm:gap-5 max-w-2xl w-full'>

        <div>
            <p className='mb-2 text-sm font-medium'>Your name</p>
            <div className='flex pl-3 rounded-lg border border-gray-300 dark:border-gray-600'>
                <img src={assets.person_icon} alt="" />
                <input name="name" type="text" placeholder='Enter your name' className='w-full p-3 text-sm outline-none' required/>
            </div>
        </div>

        <div>
            <p className='mb-2 text-sm font-medium'>Email id</p>
            <div className='flex pl-3 rounded-lg border border-gray-300 dark:border-gray-600'>
                <img src={assets.email_icon} alt="" />
                <input name="email" type="email" placeholder='Enter your email' className='w-full p-3 text-sm outline-none' required/>
            </div>
        </div>

        <div className='sm:col-span-2'>
            <p className='mb-2 text-sm font-medium'>Message</p>
            <textarea name="message" rows={8} placeholder='Enter your message' className='w-full p-3 text-sm outline-none rounded-lg border border-gray-300 dark:border-gray-600' required/>
        </div>

        <button type="submit" className='w-max flex gap-2 bg-primary text-white text-sm px-10 py-3 rounded-full cursor-pointer hover:scale-103 transition-all'>
            Submit <img src={assets.arrow_icon} alt="" className='w-4'/>
        </button>

      </motion.form>

      {/* Company Values */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        viewport={{ once: true }}
        className='grid sm:grid-cols-3 gap-6 w-full max-w-4xl mt-16'
      >
        <div className='text-center p-4'>
          <h4 className='font-semibold mb-2 text-primary'>🛡️ Trust & Safety</h4>
          <p className='text-sm opacity-70'>We believe in providing a reliable and secure system to our customers.</p>
        </div>
        
        <div className='text-center p-4'>
          <h4 className='font-semibold mb-2 text-primary'>🤝 Customer Satisfaction</h4>
          <p className='text-sm opacity-70'>Breaking Barriers, Building Bonds with our valued customers.</p>
        </div>
        
        <div className='text-center p-4'>
          <h4 className='font-semibold mb-2 text-primary'>💰 Value for Money</h4>
          <p className='text-sm opacity-70'>Pay as you go model with competitive pricing for all our services.</p>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default ContactUs
