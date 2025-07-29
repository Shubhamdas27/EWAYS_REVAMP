# Eways Backend

A complete Node.js/Express.js backend for the Eways website with MongoDB integration, designed for production deployment on platforms like Render or Heroku.

## 🚀 Features

- **Contact Management**: Handle contact form submissions with spam detection and auto-reply
- **Project Management**: Create and manage projects with subdomain support
- **Admin System**: Role-based authentication with JWT tokens
- **Analytics**: Comprehensive tracking and reporting system
- **Email Integration**: Nodemailer with multiple service support
- **File Uploads**: Multer integration for project images
- **Security**: Helmet, CORS, rate limiting, and input validation
- **Subdomain Routing**: Dynamic subdomain handling for projects
- **Database**: MongoDB with Mongoose ODM
- **Logging**: Winston for application logging

## 📋 Prerequisites

- Node.js 18+ 
- MongoDB (local or Atlas)
- Gmail/SMTP account for email service

## 🛠️ Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Shubhamdas27/EWAYS_REVAMP.git
   cd EWAYS_REVAMP/eways-backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/eways
   JWT_SECRET=your-super-secret-jwt-key
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   FRONTEND_URL=http://localhost:3000
   ADMIN_EMAIL=admin@eways.in
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

## 🌐 API Endpoints

### Public Endpoints

- `GET /health` - Health check
- `GET /api/status` - API status
- `POST /api/contact/submit` - Submit contact form
- `GET /api/projects` - Get all projects
- `GET /api/projects/:subdomain` - Get project by subdomain
- `GET /api/projects/categories` - Get project categories

### Admin Endpoints (Protected)

#### Authentication
- `POST /api/admin/login` - Admin login
- `POST /api/admin/logout` - Admin logout
- `POST /api/admin/refresh` - Refresh token
- `GET /api/admin/profile` - Get admin profile
- `PUT /api/admin/profile` - Update admin profile
- `PUT /api/admin/change-password` - Change password

#### Dashboard & Analytics
- `GET /api/admin/dashboard` - Dashboard overview
- `GET /api/admin/stats` - System statistics
- `GET /api/analytics/overview` - Analytics overview
- `GET /api/analytics/daily` - Daily analytics
- `GET /api/analytics/traffic` - Traffic analytics

#### Contact Management
- `GET /api/contact/messages` - Get all messages
- `GET /api/contact/messages/:id` - Get single message
- `PUT /api/contact/messages/:id/status` - Update message status
- `DELETE /api/contact/messages/:id` - Delete message
- `PUT /api/contact/messages/bulk` - Bulk update messages
- `GET /api/contact/export` - Export contacts

#### Project Management
- `POST /api/projects` - Create project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `POST /api/projects/:id/images` - Upload images
- `DELETE /api/projects/:id/images/:imageId` - Delete image

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment (development/production) | development |
| `PORT` | Server port | 5000 |
| `MONGODB_URI` | MongoDB connection string | mongodb://localhost:27017/eways |
| `JWT_SECRET` | JWT secret key | Required |
| `JWT_EXPIRE` | JWT expiration time | 7d |
| `EMAIL_SERVICE` | Email service provider | gmail |
| `EMAIL_USER` | Email username | Required |
| `EMAIL_PASS` | Email password/app password | Required |
| `FRONTEND_URL` | Frontend application URL | http://localhost:3000 |
| `ADMIN_EMAIL` | Default admin email | admin@eways.in |

### Admin Roles & Permissions

- **Super Admin**: Full access to all features
- **Admin**: Can manage projects and contacts
- **Moderator**: Can create/edit projects and manage contacts
- **Viewer**: Read-only access to analytics

## 🚀 Deployment

### Render Deployment

1. **Connect your repository to Render**
2. **Set environment variables:**
   - All variables from `.env.example`
   - Use MongoDB Atlas for production database
3. **Build settings:**
   - Build Command: `npm install`
   - Start Command: `npm start`

### Heroku Deployment

1. **Install Heroku CLI and login:**
   ```bash
   heroku login
   ```

2. **Create Heroku app:**
   ```bash
   heroku create eways-backend
   ```

3. **Set environment variables:**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set MONGODB_URI=your-mongodb-atlas-uri
   heroku config:set JWT_SECRET=your-jwt-secret
   # ... set all other environment variables
   ```

4. **Deploy:**
   ```bash
   git push heroku main
   ```

### MongoDB Atlas Setup

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Create database user
4. Whitelist IP addresses (0.0.0.0/0 for all IPs in production)
5. Get connection string and update `MONGODB_URI`

### Email Configuration

#### Gmail Setup
1. Enable 2-factor authentication
2. Generate app password
3. Use app password in `EMAIL_PASS`

#### SendGrid Setup (Alternative)
```env
EMAIL_SERVICE=sendgrid
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASS=your-sendgrid-api-key
```

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs with salt rounds
- **Rate Limiting**: Prevent abuse and brute force attacks
- **Input Validation**: Express-validator for all inputs
- **CORS**: Configurable cross-origin resource sharing
- **Helmet**: Security headers
- **Sanitization**: XSS protection through input sanitization

## 📊 Analytics Features

- **Page Views**: Track page visits and unique visitors
- **Contact Analytics**: Monitor form submissions and response rates
- **Project Analytics**: Track project views and engagement
- **Traffic Sources**: Monitor referrals, search engines, social media
- **User Demographics**: Track browsers, devices, countries
- **Real-time Data**: Live analytics dashboard
- **Export Options**: CSV and JSON export capabilities

## 🔄 Subdomain Handling

The backend supports dynamic subdomain routing for projects:

- `project1.eways.in` → Redirects to project's live URL or returns project info
- Automatic view tracking for subdomain visits
- Analytics integration for subdomain traffic

## 📝 Logging

Winston logging is configured with:
- Console output for development
- File rotation for production
- Error tracking and request logging
- Activity logging for admin actions

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## 📈 Performance

- **Database Indexing**: Optimized MongoDB indexes
- **Connection Pooling**: MongoDB connection pooling
- **Compression**: Response compression middleware
- **Caching**: Strategic caching for analytics data
- **Rate Limiting**: Prevent resource abuse

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**
   - Check `MONGODB_URI` format
   - Verify network access to MongoDB
   - Check authentication credentials

2. **Email Sending Failed**
   - Verify `EMAIL_USER` and `EMAIL_PASS`
   - Check Gmail app password setup
   - Verify SMTP configuration

3. **JWT Token Issues**
   - Ensure `JWT_SECRET` is set
   - Check token expiration settings
   - Verify CORS configuration

### Debug Mode

Enable debug logging:
```env
NODE_ENV=development
LOG_LEVEL=debug
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support, email [admin@eways.in](mailto:admin@eways.in) or create an issue in the repository.

## 🔗 Links

- [Frontend Repository](https://github.com/Shubhamdas27/EWAYS_REVAMP)
- [Live Website](https://eways.in)
- [API Documentation](https://api.eways.in/api/status)

---

**Built with ❤️ by the Eways Team**
