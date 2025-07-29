/**
 * Authentication Middleware
 * JWT token verification and admin authentication
 * 
 * @author Eways Team
 */

const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

/**
 * Verify JWT token and authenticate user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const authenticateToken = async (req, res, next) => {
  let token;

  // Check for token in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get admin from database (excluding password)
      const admin = await Admin.findById(decoded.id).select('-password');

      if (!admin) {
        return res.status(401).json({
          success: false,
          message: 'Not authorized, admin not found'
        });
      }

      // Check if admin account is active
      if (admin.status !== 'active') {
        return res.status(401).json({
          success: false,
          message: 'Account is inactive or suspended'
        });
      }

      // Check if account is locked
      if (admin.isAccountLocked()) {
        return res.status(401).json({
          success: false,
          message: 'Account is temporarily locked due to failed login attempts'
        });
      }

      // Add admin to request object
      req.admin = admin;
      req.adminId = admin._id;

      // Log the API access
      admin.logActivity(
        'api_access',
        req.originalUrl,
        null,
        req.ip,
        req.get('User-Agent')
      );

      next();
    } catch (error) {
      console.error('Token verification error:', error.message);
      
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Token expired, please login again'
        });
      }
      
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({
          success: false,
          message: 'Invalid token'
        });
      }

      return res.status(401).json({
        success: false,
        message: 'Not authorized, token failed'
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token provided'
    });
  }
};

/**
 * Check if admin has specific permission
 * @param {string} permission - Permission to check
 * @returns {Function} Middleware function
 */
const requirePermission = (permission) => {
  return (req, res, next) => {
    if (!req.admin) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Super admin has all permissions
    if (req.admin.role === 'super_admin') {
      return next();
    }

    // Check if admin has the required permission
    if (!req.admin.permissions[permission]) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required permission: ${permission}`
      });
    }

    next();
  };
};

/**
 * Check if admin has specific role
 * @param {...string} roles - Allowed roles
 * @returns {Function} Middleware function
 */
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.admin) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!roles.includes(req.admin.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required role: ${roles.join(' or ')}`
      });
    }

    next();
  };
};

/**
 * Optional authentication - doesn't fail if no token
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const optionalAuth = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const admin = await Admin.findById(decoded.id).select('-password');

      if (admin && admin.status === 'active' && !admin.isAccountLocked()) {
        req.admin = admin;
        req.adminId = admin._id;
      }
    } catch (error) {
      // Silently fail for optional auth
      console.log('Optional auth failed:', error.message);
    }
  }

  next();
};

/**
 * Refresh token validation
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const validateRefreshToken = async (req, res, next) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({
      success: false,
      message: 'Refresh token is required'
    });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);

    if (decoded.type !== 'refresh') {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token type'
      });
    }

    const admin = await Admin.findById(decoded.id);

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Admin not found'
      });
    }

    // Check if refresh token exists in admin's session
    const tokenExists = admin.session.refresh_tokens.some(
      t => t.token === refreshToken && new Date() < t.expires_at
    );

    if (!tokenExists) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired refresh token'
      });
    }

    req.admin = admin;
    req.refreshToken = refreshToken;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid refresh token'
    });
  }
};

/**
 * Rate limiting for sensitive operations
 * @param {number} maxAttempts - Maximum attempts allowed
 * @param {number} windowMs - Time window in milliseconds
 * @param {string} keyGenerator - Function to generate rate limit key
 * @returns {Function} Middleware function
 */
const sensitiveOperationLimit = (maxAttempts = 5, windowMs = 15 * 60 * 1000) => {
  const attempts = new Map();

  return (req, res, next) => {
    const key = req.ip + (req.admin ? req.admin._id : '');
    const now = Date.now();

    // Clean up old entries
    for (const [k, v] of attempts) {
      if (now - v.firstAttempt > windowMs) {
        attempts.delete(k);
      }
    }

    const userAttempts = attempts.get(key);

    if (userAttempts) {
      if (userAttempts.count >= maxAttempts) {
        return res.status(429).json({
          success: false,
          message: 'Too many attempts, please try again later',
          retryAfter: Math.ceil((userAttempts.firstAttempt + windowMs - now) / 1000)
        });
      }
      userAttempts.count++;
    } else {
      attempts.set(key, { count: 1, firstAttempt: now });
    }

    // Clear attempts on successful operation
    req.clearRateLimit = () => attempts.delete(key);

    next();
  };
};

/**
 * API key authentication for external services
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const authenticateApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'] || req.query.apiKey;

  if (!apiKey) {
    return res.status(401).json({
      success: false,
      message: 'API key is required'
    });
  }

  // For now, use a simple API key check
  // In production, store API keys in database with proper hashing
  const validApiKey = process.env.API_KEY;

  if (!validApiKey || apiKey !== validApiKey) {
    return res.status(401).json({
      success: false,
      message: 'Invalid API key'
    });
  }

  next();
};

module.exports = {
  authenticateToken,
  requirePermission,
  requireRole,
  optionalAuth,
  validateRefreshToken,
  sensitiveOperationLimit,
  authenticateApiKey
};
