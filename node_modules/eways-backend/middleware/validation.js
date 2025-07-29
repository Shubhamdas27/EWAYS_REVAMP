/**
 * Validation Middleware
 * Input validation and error handling for API requests
 * 
 * @author Eways Team
 */

const { body, param, query, validationResult } = require('express-validator');
const mongoose = require('mongoose');

/**
 * Handle validation errors
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => ({
      field: error.path || error.param,
      message: error.msg,
      value: error.value
    }));

    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errorMessages
    });
  }
  
  next();
};

/**
 * Validation rules for contact form submission
 */
const validateContactSubmission = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name can only contain letters and spaces'),
  
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail()
    .isLength({ max: 255 })
    .withMessage('Email cannot exceed 255 characters'),
  
  body('phone')
    .optional()
    .trim()
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),
  
  body('subject')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Subject must be between 5 and 200 characters'),
  
  body('message')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Message must be between 10 and 2000 characters'),
  
  handleValidationErrors
];

/**
 * Validation rules for project creation/update
 */
const validateProject = [
  body('project_name')
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('Project name must be between 3 and 200 characters'),
  
  body('subdomain')
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('Subdomain must be between 3 and 50 characters')
    .matches(/^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/)
    .withMessage('Subdomain must contain only lowercase letters, numbers, and hyphens'),
  
  body('description')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  
  body('short_description')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Short description cannot exceed 200 characters'),
  
  body('tech_stack')
    .optional()
    .isArray()
    .withMessage('Tech stack must be an array'),
  
  body('tech_stack.*')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Each technology name must be between 1 and 50 characters'),
  
  body('category')
    .optional()
    .isIn(['web-development', 'mobile-app', 'desktop-app', 'api', 'database', 'devops', 'other'])
    .withMessage('Invalid project category'),
  
  body('github_url')
    .optional()
    .isURL()
    .withMessage('Please provide a valid GitHub URL')
    .custom(value => {
      if (value && !value.includes('github.com')) {
        throw new Error('URL must be a GitHub repository');
      }
      return true;
    }),
  
  body('live_url')
    .optional()
    .isURL()
    .withMessage('Please provide a valid live URL'),
  
  body('demo_url')
    .optional()
    .isURL()
    .withMessage('Please provide a valid demo URL'),
  
  body('status')
    .optional()
    .isIn(['active', 'inactive', 'maintenance', 'archived'])
    .withMessage('Invalid project status'),
  
  body('visibility')
    .optional()
    .isIn(['public', 'private', 'featured'])
    .withMessage('Invalid project visibility'),
  
  body('priority')
    .optional()
    .isInt({ min: 1, max: 10 })
    .withMessage('Priority must be a number between 1 and 10'),
  
  handleValidationErrors
];

/**
 * Validation rules for admin creation/update
 */
const validateAdmin = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('Username must be between 3 and 50 characters')
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage('Username can only contain letters, numbers, underscores, and hyphens'),
  
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  
  body('firstName')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('First name cannot exceed 50 characters'),
  
  body('lastName')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Last name cannot exceed 50 characters'),
  
  body('role')
    .optional()
    .isIn(['super_admin', 'admin', 'moderator', 'viewer'])
    .withMessage('Invalid admin role'),
  
  handleValidationErrors
];

/**
 * Validation rules for admin login
 */
const validateLogin = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username or email is required'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  
  handleValidationErrors
];

/**
 * Validation rules for password change
 */
const validatePasswordChange = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('New password must contain at least one lowercase letter, one uppercase letter, and one number'),
  
  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Password confirmation does not match new password');
      }
      return true;
    }),
  
  handleValidationErrors
];

/**
 * Validation rules for MongoDB ObjectId parameters
 */
const validateObjectId = (paramName) => [
  param(paramName)
    .custom(value => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error(`Invalid ${paramName} format`);
      }
      return true;
    }),
  
  handleValidationErrors
];

/**
 * Validation rules for pagination query parameters
 */
const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  
  query('sort')
    .optional()
    .isIn(['asc', 'desc', '1', '-1'])
    .withMessage('Sort must be asc, desc, 1, or -1'),
  
  query('sortBy')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('SortBy field name is invalid'),
  
  handleValidationErrors
];

/**
 * Validation rules for date range queries
 */
const validateDateRange = [
  query('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid ISO 8601 date'),
  
  query('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid ISO 8601 date')
    .custom((value, { req }) => {
      if (value && req.query.startDate && new Date(value) < new Date(req.query.startDate)) {
        throw new Error('End date must be after start date');
      }
      return true;
    }),
  
  handleValidationErrors
];

/**
 * Validation rules for search queries
 */
const validateSearch = [
  query('q')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Search query must be between 1 and 100 characters'),
  
  query('category')
    .optional()
    .isIn(['web-development', 'mobile-app', 'desktop-app', 'api', 'database', 'devops', 'other'])
    .withMessage('Invalid search category'),
  
  query('tags')
    .optional()
    .custom(value => {
      if (typeof value === 'string') {
        return true; // Single tag
      }
      if (Array.isArray(value)) {
        return value.every(tag => typeof tag === 'string' && tag.length <= 30);
      }
      throw new Error('Tags must be a string or array of strings');
    }),
  
  handleValidationErrors
];

/**
 * Validation rules for file uploads
 */
const validateFileUpload = [
  body('caption')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Caption cannot exceed 200 characters'),
  
  body('isMain')
    .optional()
    .isBoolean()
    .withMessage('isMain must be a boolean value'),
  
  handleValidationErrors
];

/**
 * Sanitize HTML content to prevent XSS
 * @param {string} content - Content to sanitize
 * @returns {string} Sanitized content
 */
const sanitizeHtml = (content) => {
  if (typeof content !== 'string') return content;
  
  return content
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

/**
 * Middleware to sanitize request body
 */
const sanitizeInput = (req, res, next) => {
  const sanitizeObject = (obj) => {
    for (const key in obj) {
      if (typeof obj[key] === 'string') {
        obj[key] = sanitizeHtml(obj[key]);
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        sanitizeObject(obj[key]);
      }
    }
  };
  
  if (req.body && typeof req.body === 'object') {
    sanitizeObject(req.body);
  }
  
  next();
};

/**
 * Global error handler
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  console.error(err);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = { message, statusCode: 404 };
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `Duplicate value for ${field} field`;
    error = { message, statusCode: 400 };
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = { message, statusCode: 400 };
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token';
    error = { message, statusCode: 401 };
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired';
    error = { message, statusCode: 401 };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

/**
 * Handle 404 not found
 */
const notFound = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
};

module.exports = {
  handleValidationErrors,
  validateContactSubmission,
  validateProject,
  validateAdmin,
  validateLogin,
  validatePasswordChange,
  validateObjectId,
  validatePagination,
  validateDateRange,
  validateSearch,
  validateFileUpload,
  sanitizeInput,
  errorHandler,
  notFound
};
