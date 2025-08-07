# EWAYS - Modern Business Solutions Platform

A comprehensive business solutions platform built with React, TypeScript, and modern web technologies.

## 🚀 Features

- **Modern React Frontend** with TypeScript
- **Responsive Design** optimized for all devices
- **Smooth Animations** powered by GSAP
- **Admin Panel** for content management
- **Contact Management** system
- **Career Portal** with application handling
- **Testimonials** and portfolio showcase

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **GSAP** for animations
- **Lucide React** for icons

### Backend
- **Node.js** with Express
- **MongoDB** for database
- **JWT** authentication
- **Multer** for file uploads
- **Nodemailer** for email services

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB

### Frontend Setup
```bash
cd eways-frontend
npm install
npm run dev
```

### Backend Setup
```bash
cd eways-backend
npm install
npm start
```

## 🔧 Configuration

### Environment Variables

Create `.env` file in frontend directory:
```bash
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Eways
VITE_APP_VERSION=1.0.0
```

For production, use `.env.production`:
```bash
VITE_API_URL=https://your-backend-api-url.com/api
VITE_APP_NAME=Eways
VITE_APP_VERSION=1.0.0
```

## 🚀 Deployment

### Using Vercel (Recommended)
```bash
npm install -g vercel
npm run build
vercel --prod
```

### Using Deploy Script
```bash
./deploy.ps1
```

## 📝 Available Scripts

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Backend
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

## 🎨 Components Structure

```
src/
├── components/
│   ├── Header/         # Navigation header
│   ├── Hero/          # Landing hero section
│   ├── Services/      # Services showcase
│   ├── About/         # About section
│   ├── Mission/       # Mission statement
│   ├── Career/        # Career opportunities
│   ├── Contact/       # Contact form
│   ├── Footer/        # Site footer
│   ├── AdminLogin/    # Admin authentication
│   └── TestAdminPanel/ # Admin dashboard
├── utils/
│   ├── animations.ts  # GSAP animation utilities
│   ├── api.ts        # API integration
│   └── smoothScroll.ts # Smooth scrolling
└── styles/
    └── index.css     # Global styles
```

## 🔧 Key Features Explained

### Navigation System
- **Smooth scrolling** between sections
- **Mobile-responsive** hamburger menu
- **Progress indicator** showing scroll position

### Animation System
- **GSAP-powered** smooth animations
- **Scroll-triggered** animations
- **Performance optimized** with proper cleanup

### Admin Panel
- **JWT-based** authentication
- **File upload** capabilities
- **Content management** system

## 🐛 Troubleshooting

### Common Issues

1. **Navigation not working**
   - Check if all sections have proper IDs
   - Ensure smooth scroll is initialized
   - Check console for errors

2. **Build failures**
   - Clear node_modules and reinstall
   - Check TypeScript configurations
   - Verify all imports are correct

3. **Animation issues**
   - Ensure GSAP is properly loaded
   - Check scroll trigger setup
   - Verify element selectors

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support and questions:
- Email: support@eways.com
- Phone: +1 (555) 123-4567

---

**Built with ❤️ by the EWAYS Team**
