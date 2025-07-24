/**
 * Contact Routes
 * Handle contact form submissions and management
 * 
 * @author Eways Team
 */

const express = require('express');
const {
  submitContact,
  getMessages,
  getMessage,
  updateMessageStatus,
  deleteMessage,
  bulkUpdateMessages,
  getContactAnalytics,
  exportContacts,
  upload
} = require('../controllers/contactController');

const { authenticateToken, requirePermission } = require('../middleware/auth');
const {
  validateContactSubmission,
  validateObjectId,
  validatePagination,
  validateDateRange
} = require('../middleware/validation');

const router = express.Router();

/**
 * @route POST /api/contact/submit
 * @desc Submit contact form
 * @access Public
 */
router.post('/submit', validateContactSubmission, submitContact);

/**
 * @route POST /api/contact
 * @desc Submit contact form or career application (with file upload)
 * @access Public
 */
router.post('/', upload.single('resume'), submitContact);

/**
 * @route GET /api/contact/messages
 * @desc Get all contact messages (with pagination and filtering)
 * @access Private (Admin with can_manage_contacts permission)
 */
router.get(
  '/messages',
  authenticateToken,
  requirePermission('can_manage_contacts'),
  validatePagination,
  getMessages
);

/**
 * @route GET /api/contact/messages/:id
 * @desc Get single contact message
 * @access Private (Admin with can_manage_contacts permission)
 */
router.get(
  '/messages/:id',
  authenticateToken,
  requirePermission('can_manage_contacts'),
  validateObjectId('id'),
  getMessage
);

/**
 * @route PUT /api/contact/messages/:id/status
 * @desc Update message status
 * @access Private (Admin with can_manage_contacts permission)
 */
router.put(
  '/messages/:id/status',
  authenticateToken,
  requirePermission('can_manage_contacts'),
  validateObjectId('id'),
  updateMessageStatus
);

/**
 * @route DELETE /api/contact/messages/:id
 * @desc Delete contact message
 * @access Private (Admin with can_manage_contacts permission)
 */
router.delete(
  '/messages/:id',
  authenticateToken,
  requirePermission('can_manage_contacts'),
  validateObjectId('id'),
  deleteMessage
);

/**
 * @route PUT /api/contact/messages/bulk
 * @desc Bulk update messages
 * @access Private (Admin with can_manage_contacts permission)
 */
router.put(
  '/messages/bulk',
  authenticateToken,
  requirePermission('can_manage_contacts'),
  bulkUpdateMessages
);

/**
 * @route GET /api/contact/analytics
 * @desc Get contact analytics
 * @access Private (Admin with can_view_analytics permission)
 */
router.get(
  '/analytics',
  authenticateToken,
  requirePermission('can_view_analytics'),
  getContactAnalytics
);

/**
 * @route GET /api/contact/export
 * @desc Export contacts to CSV/JSON
 * @access Private (Admin with can_manage_contacts permission)
 */
router.get(
  '/export',
  authenticateToken,
  requirePermission('can_manage_contacts'),
  validateDateRange,
  exportContacts
);

module.exports = router;
