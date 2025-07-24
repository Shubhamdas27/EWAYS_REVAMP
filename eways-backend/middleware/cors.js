/**
 * CORS Middleware
 * Cross-Origin Resource Sharing configuration
 * 
 * @author Eways Team
 */

const cors = require('cors');

/**
 * CORS configuration for different environments
 */
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      process.env.FRONTEND_URL || 'http://localhost:3000',
      'https://eways.in',
      'https://www.eways.in',
      'http://localhost:3000',  // React Create React App
      'http://localhost:3001',  // Alternative React port
      'http://localhost:5173',  // Vite React dev server
      'http://localhost:5174',  // Alternative Vite port
      'http://127.0.0.1:3000',  // IPv4 localhost
      'http://127.0.0.1:3001',  // IPv4 alternative
      'http://127.0.0.1:5173',  // IPv4 Vite
      'https://localhost:3000', // HTTPS React dev
      'https://localhost:5173'  // HTTPS Vite dev
    ];
    
    // Add subdomain support for projects
    const isSubdomain = /^https?:\/\/[\w-]+\.eways\.in$/.test(origin);
    
    if (allowedOrigins.includes(origin) || isSubdomain) {
      callback(null, true);
    } else {
      console.log(`CORS blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  
  methods: [
    'GET',
    'POST',
    'PUT',
    'DELETE',
    'PATCH',
    'OPTIONS'
  ],
  
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'X-API-Key',
    'Accept',
    'Origin',
    'Access-Control-Request-Method',
    'Access-Control-Request-Headers'
  ],
  
  exposedHeaders: [
    'X-Total-Count',
    'X-Page-Count',
    'X-Current-Page',
    'X-Per-Page'
  ],
  
  credentials: true, // Allow cookies and authorization headers
  
  optionsSuccessStatus: 200, // Some legacy browsers (IE11, various SmartTVs) choke on 204
  
  maxAge: 86400 // Cache preflight response for 24 hours
};

/**
 * Development CORS configuration (more permissive)
 */
const devCorsOptions = {
  origin: true, // Allow all origins in development
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: '*',
  credentials: true,
  optionsSuccessStatus: 200
};

/**
 * Get CORS configuration based on environment
 */
const getCorsConfig = () => {
  if (process.env.NODE_ENV === 'development') {
    return devCorsOptions;
  }
  return corsOptions;
};

/**
 * Custom CORS error handler
 */
const corsErrorHandler = (err, req, res, next) => {
  if (err.message && err.message.includes('CORS')) {
    return res.status(403).json({
      success: false,
      message: 'CORS policy violation',
      error: 'Origin not allowed by CORS policy'
    });
  }
  next(err);
};

/**
 * Dynamic CORS for subdomain projects
 */
const dynamicCors = (req, res, next) => {
  const origin = req.headers.origin;
  
  // Check if it's a project subdomain request
  if (origin && /^https?:\/\/[\w-]+\.eways\.in$/.test(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, X-API-Key');
    
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }
  }
  
  next();
};

/**
 * Security headers middleware
 */
const securityHeaders = (req, res, next) => {
  // Prevent clickjacking
  res.header('X-Frame-Options', 'DENY');
  
  // Prevent MIME type sniffing
  res.header('X-Content-Type-Options', 'nosniff');
  
  // XSS Protection
  res.header('X-XSS-Protection', '1; mode=block');
  
  // Referrer Policy
  res.header('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Content Security Policy
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self' https:",
    "connect-src 'self' https:",
    "frame-ancestors 'none'"
  ].join('; ');
  
  res.header('Content-Security-Policy', csp);
  
  next();
};

/**
 * API rate limiting headers
 */
const rateLimitHeaders = (req, res, next) => {
  // Add rate limit info to headers (if available from rate limiting middleware)
  if (req.rateLimit) {
    res.header('X-RateLimit-Limit', req.rateLimit.limit);
    res.header('X-RateLimit-Remaining', req.rateLimit.remaining);
    res.header('X-RateLimit-Reset', req.rateLimit.reset);
  }
  
  next();
};

/**
 * Request origin logger for debugging
 */
const logOrigin = (req, res, next) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`Request from origin: ${req.headers.origin || 'No origin'}`);
    console.log(`Request to: ${req.method} ${req.originalUrl}`);
  }
  next();
};

module.exports = cors(getCorsConfig());
