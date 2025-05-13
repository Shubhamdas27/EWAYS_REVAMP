import React, { useState } from 'react';
import { Upload, Briefcase, GraduationCap } from 'lucide-react';

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  position: string;
  jobType: 'internship' | 'fulltime';
  experience: string;
  education: string;
  skills: string;
  portfolio: string;
  coverLetter: string;
}

interface FormErrors {
  [key: string]: string;
}

const Career: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    position: '',
    jobType: 'fulltime',
    experience: '',
    education: '',
    skills: '',
    portfolio: '',
    coverLetter: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const positions = [
    'Software Developer',
    'UI/UX Designer',
    'Project Manager',
    'Business Analyst',
    'Quality Assurance Engineer',
    'DevOps Engineer',
    'Data Scientist',
    'Technical Writer',
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[0-9+\-\s()]{10,15}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!formData.position) {
      newErrors.position = 'Please select a position';
    }

    if (!formData.experience.trim()) {
      newErrors.experience = 'Experience details are required';
    }

    if (!formData.education.trim()) {
      newErrors.education = 'Education details are required';
    }

    if (!formData.skills.trim()) {
      newErrors.skills = 'Skills are required';
    }

    if (!formData.coverLetter.trim()) {
      newErrors.coverLetter = 'Cover letter is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);

      // Simulate form submission
      setTimeout(() => {
        setIsSubmitting(false);
        setSubmitSuccess(true);
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          position: '',
          jobType: 'fulltime',
          experience: '',
          education: '',
          skills: '',
          portfolio: '',
          coverLetter: '',
        });

        setTimeout(() => {
          setSubmitSuccess(false);
        }, 5000);
      }, 1500);
    }
  };

  return (
    <section id="career" className="section-padding bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="section-title">Career Opportunities</h2>
          <p className="section-subtitle">Join our team and be part of something great</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <Briefcase className="text-[#0056b3]" size={24} />
              </div>
              <h3 className="text-xl font-semibold">Full-time Positions</h3>
            </div>
            <p className="text-gray-600">
              Launch your career with us and work on cutting-edge technology projects
              while growing professionally in a supportive environment.
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <GraduationCap className="text-[#0056b3]" size={24} />
              </div>
              <h3 className="text-xl font-semibold">Internships</h3>
            </div>
            <p className="text-gray-600">
              Gain valuable industry experience through our internship program. Learn
              from experts and work on real-world projects.
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <Upload className="text-[#0056b3]" size={24} />
              </div>
              <h3 className="text-xl font-semibold">How to Apply</h3>
            </div>
            <p className="text-gray-600">
              Fill out the application form below with your details and our HR team
              will get back to you within 2-3 business days.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg p-8 shadow-md">
          <h3 className="text-2xl font-semibold mb-6">Application Form</h3>

          {submitSuccess && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
              Thank you for your application! We will review it and get back to you soon.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0056b3] ${
                    errors.fullName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="John Doe"
                />
                {errors.fullName && <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0056b3] ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="john@example.com"
                />
                {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0056b3] ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="+91 98765 43210"
                />
                {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
              </div>

              <div>
                <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">
                  Position <span className="text-red-500">*</span>
                </label>
                <select
                  id="position"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0056b3] ${
                    errors.position ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select a position</option>
                  {positions.map((pos) => (
                    <option key={pos} value={pos}>
                      {pos}
                    </option>
                  ))}
                </select>
                {errors.position && <p className="mt-1 text-sm text-red-500">{errors.position}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Type <span className="text-red-500">*</span>
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="jobType"
                      value="fulltime"
                      checked={formData.jobType === 'fulltime'}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    Full-time
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="jobType"
                      value="internship"
                      checked={formData.jobType === 'internship'}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    Internship
                  </label>
                </div>
              </div>

              <div>
                <label htmlFor="portfolio" className="block text-sm font-medium text-gray-700 mb-1">
                  Portfolio URL
                </label>
                <input
                  type="url"
                  id="portfolio"
                  name="portfolio"
                  value={formData.portfolio}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0056b3]"
                  placeholder="https://your-portfolio.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="education" className="block text-sm font-medium text-gray-700 mb-1">
                Education <span className="text-red-500">*</span>
              </label>
              <textarea
                id="education"
                name="education"
                value={formData.education}
                onChange={handleChange}
                rows={3}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0056b3] ${
                  errors.education ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="List your educational qualifications, including degree, institution, and graduation year"
              ></textarea>
              {errors.education && <p className="mt-1 text-sm text-red-500">{errors.education}</p>}
            </div>

            <div>
              <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
                Experience <span className="text-red-500">*</span>
              </label>
              <textarea
                id="experience"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                rows={3}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0056b3] ${
                  errors.experience ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Describe your relevant work experience, including company names, roles, and duration"
              ></textarea>
              {errors.experience && <p className="mt-1 text-sm text-red-500">{errors.experience}</p>}
            </div>

            <div>
              <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-1">
                Skills <span className="text-red-500">*</span>
              </label>
              <textarea
                id="skills"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                rows={3}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0056b3] ${
                  errors.skills ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="List your technical skills, tools, and technologies you're proficient in"
              ></textarea>
              {errors.skills && <p className="mt-1 text-sm text-red-500">{errors.skills}</p>}
            </div>

            <div>
              <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700 mb-1">
                Cover Letter <span className="text-red-500">*</span>
              </label>
              <textarea
                id="coverLetter"
                name="coverLetter"
                value={formData.coverLetter}
                onChange={handleChange}
                rows={5}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0056b3] ${
                  errors.coverLetter ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Tell us why you're interested in this position and what makes you a great fit"
              ></textarea>
              {errors.coverLetter && (
                <p className="mt-1 text-sm text-red-500">{errors.coverLetter}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full md:w-auto btn btn-primary flex items-center justify-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </>
              ) : (
                'Submit Application'
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Career;