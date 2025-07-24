/**
 * Admin Routes
 * Handle admin authentication and management
 * 
 * @author Eways Team
 */

const express = require('express');
const {
  login,
  logout,
  refreshToken,
  getProfile,
  updateProfile,
  changePassword,
  getDashboard,
  getStats,
  createBackup,
  getActivity
} = require('../controllers/adminController');

const {
  authenticateToken,
  requireRole,
  requirePermission,
  validateRefreshToken,
  sensitiveOperationLimit
} = require('../middleware/auth');

const {
  validateLogin,
  validatePasswordChange,
  validatePagination
} = require('../middleware/validation');

const router = express.Router();

/**
 * @route POST /api/admin/login
 * @desc Admin login
 * @access Public
 */
router.post(
  '/login',
  sensitiveOperationLimit(5, 15 * 60 * 1000), // 5 attempts per 15 minutes
  validateLogin,
  login
);

/**
 * @route POST /api/admin/logout
 * @desc Admin logout
 * @access Private
 */
router.post('/logout', authenticateToken, logout);

/**
 * @route POST /api/admin/refresh
 * @desc Refresh JWT token
 * @access Public (with valid refresh token)
 */
router.post('/refresh', validateRefreshToken, refreshToken);

/**
 * @route GET /api/admin/profile
 * @desc Get admin profile
 * @access Private
 */
router.get('/profile', authenticateToken, getProfile);

/**
 * @route PUT /api/admin/profile
 * @desc Update admin profile
 * @access Private
 */
router.put('/profile', authenticateToken, updateProfile);

/**
 * @route PUT /api/admin/change-password
 * @desc Change admin password
 * @access Private
 */
router.put(
  '/change-password',
  authenticateToken,
  sensitiveOperationLimit(3, 30 * 60 * 1000), // 3 attempts per 30 minutes
  validatePasswordChange,
  changePassword
);

/**
 * @route GET /api/admin/dashboard
 * @desc Get dashboard analytics and overview
 * @access Private (Admin with can_view_analytics permission)
 */
router.get(
  '/dashboard',
  authenticateToken,
  requirePermission('can_view_analytics'),
  getDashboard
);

/**
 * @route GET /api/admin/stats
 * @desc Get system statistics
 * @access Private (Admin with can_view_analytics permission)
 */
router.get(
  '/stats',
  authenticateToken,
  requirePermission('can_view_analytics'),
  getStats
);

/**
 * @route POST /api/admin/backup
 * @desc Create database backup
 * @access Private (Super Admin or Admin with can_backup_data permission)
 */
router.post(
  '/backup',
  authenticateToken,
  requirePermission('can_backup_data'),
  sensitiveOperationLimit(2, 60 * 60 * 1000), // 2 attempts per hour
  createBackup
);

/**
 * @route GET /api/admin/activity
 * @desc Get admin activity log
 * @access Private
 */
router.get(
  '/activity',
  authenticateToken,
  validatePagination,
  getActivity
);

module.exports = router;
