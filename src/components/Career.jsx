import React, { useState } from 'react'
import Title from './Title'
import { motion } from 'motion/react'
import toast from 'react-hot-toast'
import assets from '../assets/assets'

const Career = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    position: '',
    applicationType: '',
    experience: '',
    location: '',
    expectedSalary: '',
    resume: null,
    coverLetter: ''
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleFileChange = (e) => {
    setFormData(prev => ({
      ...prev,
      resume: e.target.files[0]
    }))
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    
    // Basic validation
    if (!formData.fullName || !formData.email || !formData.phone || !formData.position || !formData.applicationType) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      // Here you would typically send the form data to your backend
      toast.success('Application submitted successfully! We will get back to you soon.')
      
      // Reset form
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        position: '',
        applicationType: '',
        experience: '',
        location: '',
        expectedSalary: '',
        resume: null,
        coverLetter: ''
      })
      
      // Reset file input
      const fileInput = document.getElementById('resume')
      if (fileInput) fileInput.value = ''
      
    } catch (error) {
      toast.error('Error submitting application. Please try again.')
    }
  }

  const positions = [
    'Software Developer',
    'Cloud Architect',
    'Business Analyst',
    'DevOps Engineer',
    'Digital Marketing Specialist',
    'Project Manager',
    'UI/UX Designer',
    'Data Analyst',
    'Quality Assurance Engineer',
    'Sales Executive',
    'HR Executive',
    'Other'
  ]

  return (
    <motion.div 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      transition={{ staggerChildren: 0.2 }}
      id='careers'
      className='flex flex-col items-center gap-7 px-4 sm:px-12 lg:px-24 xl:px-40 pt-30 text-gray-800 dark:text-white'
    >
      <Title 
        title='Join Our Team' 
        desc='Build your career with us and be part of innovative technology solutions that transform businesses worldwide.'
      />

      <div className='w-full max-w-6xl space-y-10'>
        {/* Why Work With Us */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className='text-center mb-10'
        >
          <h3 className='text-xl font-semibold mb-4'>Why Work With Us?</h3>
          <div className='grid sm:grid-cols-3 gap-6 text-sm'>
            <div className='p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20'>
              <h4 className='font-medium mb-2'>🚀 Innovation First</h4>
              <p className='opacity-70'>Work with cutting-edge technologies and innovative solutions</p>
            </div>
            <div className='p-4 rounded-lg bg-green-50 dark:bg-green-900/20'>
              <h4 className='font-medium mb-2'>🌱 Growth Opportunities</h4>
              <p className='opacity-70'>Continuous learning and career advancement programs</p>
            </div>
            <div className='p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20'>
              <h4 className='font-medium mb-2'>🤝 Great Culture</h4>
              <p className='opacity-70'>Collaborative environment with work-life balance</p>
            </div>
          </div>
        </motion.div>

        {/* Application Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className='bg-white dark:bg-gray-900 rounded-xl p-8 shadow-lg'
        >
          <h3 className='text-2xl font-semibold text-center mb-8'>Apply for a Position</h3>
          
          <form onSubmit={onSubmit} className='space-y-6'>
            {/* Personal Information */}
            <div className='grid sm:grid-cols-2 gap-6'>
              <div>
                <label className='block text-sm font-medium mb-2'>Full Name *</label>
                <div className='flex pl-3 rounded-lg border border-gray-300 dark:border-gray-600'>
                  <img src={assets.person_icon} alt="" className='w-5 h-5 my-auto' />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder='Enter your full name'
                    className='w-full p-3 text-sm outline-none bg-transparent'
                    required
                  />
                </div>
              </div>

              <div>
                <label className='block text-sm font-medium mb-2'>Email Address *</label>
                <div className='flex pl-3 rounded-lg border border-gray-300 dark:border-gray-600'>
                  <img src={assets.email_icon} alt="" className='w-5 h-5 my-auto' />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder='Enter your email'
                    className='w-full p-3 text-sm outline-none bg-transparent'
                    required
                  />
                </div>
              </div>
            </div>

            <div className='grid sm:grid-cols-2 gap-6'>
              <div>
                <label className='block text-sm font-medium mb-2'>Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder='Enter your phone number'
                  className='w-full p-3 text-sm outline-none rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent'
                  required
                />
              </div>

              <div>
                <label className='block text-sm font-medium mb-2'>Preferred Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder='e.g. Delhi, Mumbai, Remote'
                  className='w-full p-3 text-sm outline-none rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent'
                />
              </div>
            </div>

            {/* Application Details */}
            <div className='grid sm:grid-cols-2 gap-6'>
              <div>
                <label className='block text-sm font-medium mb-2'>Application Type *</label>
                <select
                  name="applicationType"
                  value={formData.applicationType}
                  onChange={handleInputChange}
                  className='w-full p-3 text-sm outline-none rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent'
                  required
                >
                  <option value="">Select Application Type</option>
                  <option value="job">Job Application</option>
                  <option value="internship">Internship Application</option>
                  <option value="freelance">Freelance/Contract</option>
                </select>
              </div>

              <div>
                <label className='block text-sm font-medium mb-2'>Position/Role *</label>
                <select
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  className='w-full p-3 text-sm outline-none rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent'
                  required
                >
                  <option value="">Select Position</option>
                  {positions.map((pos, index) => (
                    <option key={index} value={pos}>{pos}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className='grid sm:grid-cols-2 gap-6'>
              <div>
                <label className='block text-sm font-medium mb-2'>Experience Level</label>
                <select
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  className='w-full p-3 text-sm outline-none rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent'
                >
                  <option value="">Select Experience</option>
                  <option value="fresher">Fresher (0 years)</option>
                  <option value="1-2">1-2 years</option>
                  <option value="3-5">3-5 years</option>
                  <option value="6-10">6-10 years</option>
                  <option value="10+">10+ years</option>
                </select>
              </div>

              <div>
                <label className='block text-sm font-medium mb-2'>Expected Salary (LPA)</label>
                <input
                  type="text"
                  name="expectedSalary"
                  value={formData.expectedSalary}
                  onChange={handleInputChange}
                  placeholder='e.g. 5-8 LPA or Negotiable'
                  className='w-full p-3 text-sm outline-none rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent'
                />
              </div>
            </div>

            {/* Resume Upload */}
            <div>
              <label className='block text-sm font-medium mb-2'>Upload Resume/CV *</label>
              <input
                type="file"
                id="resume"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx"
                className='w-full p-3 text-sm outline-none rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-primary file:text-white hover:file:bg-primary/90'
                required
              />
              <p className='text-xs opacity-60 mt-1'>Accepted formats: PDF, DOC, DOCX (Max 5MB)</p>
            </div>

            {/* Cover Letter */}
            <div>
              <label className='block text-sm font-medium mb-2'>Cover Letter / Why do you want to join us?</label>
              <textarea
                name="coverLetter"
                value={formData.coverLetter}
                onChange={handleInputChange}
                rows={5}
                placeholder='Tell us about yourself, your skills, and why you want to join Eways Services...'
                className='w-full p-3 text-sm outline-none rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent'
              />
            </div>

            <div className='text-center'>
              <button
                type="submit"
                className='bg-primary text-white px-8 py-3 rounded-full text-sm hover:bg-primary/90 transition-all hover:scale-105 flex items-center gap-2 mx-auto'
              >
                Submit Application
                <img src={assets.arrow_icon} alt="" className='w-4' />
              </button>
            </div>
          </form>
        </motion.div>

        {/* Additional Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          className='grid sm:grid-cols-2 gap-8'
        >
          <div className='bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl'>
            <h4 className='text-lg font-semibold mb-4'>📋 Application Process</h4>
            <ul className='space-y-2 text-sm opacity-80'>
              <li>• Submit your application with resume</li>
              <li>• Initial screening and review</li>
              <li>• Technical/HR interview rounds</li>
              <li>• Final interview with management</li>
              <li>• Offer and onboarding process</li>
            </ul>
          </div>

          <div className='bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl'>
            <h4 className='text-lg font-semibold mb-4'>💼 What We Offer</h4>
            <ul className='space-y-2 text-sm opacity-80'>
              <li>• Competitive salary and benefits</li>
              <li>• Flexible working arrangements</li>
              <li>• Learning and development opportunities</li>
              <li>• Health insurance and wellness programs</li>
              <li>• Performance-based incentives</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default Career
