# 🌟 Eways Services - Professional IT Solutions Website

<div align="center">
  <img src="src/assets/eways_logo.jpg" alt="Eways Services Logo" width="120"/>
  
  [![React](https://img.shields.io/badge/React-19.1.0-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
  [![Vite](https://img.shields.io/badge/Vite-6.0.3-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.11-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  [![Framer Motion](https://img.shields.io/badge/Framer_Motion-12.23.12-0055FF?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)
</div>

## 📋 Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Components](#components)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

**Eways Services** is a modern, responsive website built for EWAYS Services Private Ltd, showcasing their comprehensive IT solutions and services. The website features a sleek design with smooth animations, dark/light theme toggle, and an intuitive user experience.

## ✨ Features

### � **Modern Design**
- Clean and professional UI/UX
- Responsive design for all devices
- Smooth animations powered by Framer Motion
- Dark/Light theme toggle with system preference detection

### � **Core Sections**
- **Hero Section**: Compelling introduction with call-to-action
- **Services**: Horizontal scrolling showcase of 7+ service categories
- **About Us**: Company mission, vision, and values
- **Why Choose Us**: Key differentiators and benefits
- **Career Portal**: Interactive job application form with file upload
- **Contact**: Multiple contact methods and location details

### � **User Experience**
- Interactive animations and micro-interactions
- Horizontal scrolling service cards
- Mobile-first responsive design
- Fast loading with Vite optimization
- Toast notifications for user feedback

### 🔧 **Technical Features**
- React 19 with modern hooks
- Tailwind CSS for styling
- ESLint for code quality
- Hot reload development environment
- Optimized production builds
## � Tech Stack

| Technology | Purpose | Version |
|------------|---------|---------|
| **React** | Frontend Framework | 19.1.0 |
| **Vite** | Build Tool & Dev Server | 6.0.3 |
| **Tailwind CSS** | Styling Framework | 4.1.11 |
| **Framer Motion** | Animation Library | 12.23.12 |
| **React Hot Toast** | Notifications | 2.5.2 |
| **ESLint** | Code Linting | 9.18.0 |

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Shubhamdas27/Eways_Revamp.git
   cd Eways_Revamp
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open in browser**
   ```
   http://localhost:5173
   ```

### Available Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v18.0.0 or higher)
- **npm** or **yarn** package manager
- **Git** for version control

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Shubhamdas27/Agency.Ai.git
   cd Agency.Ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to see the application running.

### Build for Production

```bash
# Create optimized production build
npm run build

# Preview production build locally
npm run preview

# Lint code
npm run lint
```

## 📁 Project Structure

```
Agency.AI/
├── 📁 public/                    # Static assets
│   └── favicon.ico
├── 📁 src/                       # Source code
│   ├── 📁 assets/               # Images, icons, and static files
│   │   ├── 🖼️ hero_img.png
│   │   ├── 🔗 logo.svg
│   │   ├── 🌙 moon_icon.svg
│   │   └── ☀️ sun_icon.svg
│   ├── 📁 components/           # Reusable React components
│   │   ├── 🧭 Navbar.jsx
│   │   ├── 🦸 Hero.jsx
│   │   ├── 🏢 Services.jsx
│   │   ├── 👥 Teams.jsx
│   │   ├── 📧 ContactUs.jsx
│   │   └── 🔄 ThemeToggleBtn.jsx
│   ├── 📄 App.jsx               # Main application component
│   ├── 🎨 index.css             # Global styles
│   └── 🚀 main.jsx              # Application entry point
├── ⚙️ vite.config.js            # Vite configuration
├── 🎯 eslint.config.js          # ESLint configuration
├── 📦 package.json              # Dependencies and scripts
└── 📖 README.md                 # Project documentation
```

## 🎨 Components

### 🧭 Navigation (`Navbar.jsx`)
- Responsive navigation with mobile menu
- Theme toggle integration
- Smooth scroll navigation
- Logo and branding

### 🦸 Hero Section (`Hero.jsx`)
- Eye-catching landing area
- Call-to-action buttons
- Animated hero image
- Compelling headline and description

### 🏢 Services (`Services.jsx`)
- Service cards with icons
- Hover effects and animations
- Detailed service descriptions
- Modern grid layout

### 👥 Team (`Teams.jsx`)
- Team member profiles
- Professional photos
- Role and expertise display
- Social media links

### 📧 Contact (`ContactUs.jsx`)
- Contact form with validation
- Toast notifications
- Multiple contact methods
- Map integration ready

### 🔄 Theme Toggle (`ThemeToggleBtn.jsx`)
- Dark/Light mode switcher
- Smooth transition animations
- Persistent theme storage
- System preference detection

## 🌙 Theme Support

The application supports both light and dark themes with:

- **Automatic Detection** - Respects system preferences
- **Manual Toggle** - Easy switching via theme button
- **Persistent Storage** - Remembers user preference
- **Smooth Transitions** - Animated theme changes
- **Component Consistency** - All components support both themes

### Theme Implementation
```jsx
// Theme state management
const [theme, setTheme] = useState(
  localStorage.getItem('theme') || 'light'
);

// Toggle function
const toggleTheme = () => {
  const newTheme = theme === 'light' ? 'dark' : 'light';
  setTheme(newTheme);
  localStorage.setItem('theme', newTheme);
};
```

## 📱 Responsive Design

**Mobile First Approach** with breakpoints:
- 📱 **Mobile**: 320px - 768px
- 📟 **Tablet**: 768px - 1024px
- 💻 **Desktop**: 1024px+
- 🖥️ **Large Screens**: 1440px+

**Key Responsive Features:**
- Flexible grid layouts
- Responsive typography
- Optimized images
- Touch-friendly interfaces
- Adaptive navigation

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
# API Configuration (if needed)
VITE_API_URL=your_api_url_here
VITE_CONTACT_EMAIL=contact@youragency.com

# Analytics (optional)
VITE_GA_TRACKING_ID=your_google_analytics_id
```

### Tailwind Configuration
Customize themes and colors in `tailwind.config.js`:

```javascript
module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          900: '#1e3a8a',
        }
      }
    }
  }
}
```

## 📈 Performance

**Optimization Features:**
- ⚡ **Vite Hot Reloading** - Instant development feedback
- 🗜️ **Code Splitting** - Lazy loading for optimal bundle size
- 🖼️ **Image Optimization** - Compressed assets for faster loading
- 📦 **Tree Shaking** - Elimination of unused code
- 🎯 **Minification** - Reduced file sizes in production

**Performance Metrics:**
- Lighthouse Score: 95+
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Cumulative Layout Shift: < 0.1

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### 📝 Contributing Guidelines
- Follow existing code style
- Add comments for complex logic
- Update documentation as needed
- Test on multiple devices
- Ensure accessibility compliance

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2025 Shubham Das

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

## 👨‍💻 Author

<div align="center">

**Shubham Das**

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Shubhamdas27)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/shubhamdas27)
[![Portfolio](https://img.shields.io/badge/Portfolio-FF5722?style=for-the-badge&logo=google-chrome&logoColor=white)](https://shubhamdas.dev)

</div>

---

<div align="center">

**⭐ Star this repository if you found it helpful!**

Made with ❤️ by [Shubham Das](https://github.com/Shubhamdas27)

</div>