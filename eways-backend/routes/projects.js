/**
 * Projects Routes
 * Handle project management and display
 * 
 * @author Eways Team
 */

const express = require('express');
const {
  getProjects,
  getProjectBySubdomain,
  createProject,
  updateProject,
  deleteProject,
  uploadProjectImages,
  deleteProjectImage,
  getProjectCategories,
  getProjectAnalytics
} = require('../controllers/projectController');

const { authenticateToken, requirePermission, optionalAuth } = require('../middleware/auth');
const {
  validateProject,
  validateObjectId,
  validatePagination,
  validateSearch,
  validateFileUpload
} = require('../middleware/validation');

const router = express.Router();

/**
 * @route GET /api/projects/categories
 * @desc Get project categories with counts
 * @access Public
 */
router.get('/categories', getProjectCategories);

/**
 * @route GET /api/projects
 * @desc Get all active projects (with pagination and filtering)
 * @access Public
 */
router.get(
  '/',
  validatePagination,
  validateSearch,
  optionalAuth,
  getProjects
);

/**
 * @route GET /api/projects/:subdomain
 * @desc Get single project by subdomain
 * @access Public
 */
router.get(
  '/:subdomain',
  optionalAuth,
  getProjectBySubdomain
);

/**
 * @route POST /api/projects
 * @desc Create new project
 * @access Private (Admin with can_create_projects permission)
 */
router.post(
  '/',
  authenticateToken,
  requirePermission('can_create_projects'),
  validateProject,
  createProject
);

/**
 * @route PUT /api/projects/:id
 * @desc Update project
 * @access Private (Admin with can_edit_projects permission)
 */
router.put(
  '/:id',
  authenticateToken,
  requirePermission('can_edit_projects'),
  validateObjectId('id'),
  validateProject,
  updateProject
);

/**
 * @route DELETE /api/projects/:id
 * @desc Delete project
 * @access Private (Admin with can_delete_projects permission)
 */
router.delete(
  '/:id',
  authenticateToken,
  requirePermission('can_delete_projects'),
  validateObjectId('id'),
  deleteProject
);

/**
 * @route POST /api/projects/:id/images
 * @desc Upload project images
 * @access Private (Admin with can_edit_projects permission)
 */
router.post(
  '/:id/images',
  authenticateToken,
  requirePermission('can_edit_projects'),
  validateObjectId('id'),
  validateFileUpload,
  uploadProjectImages
);

/**
 * @route DELETE /api/projects/:id/images/:imageId
 * @desc Delete project image
 * @access Private (Admin with can_edit_projects permission)
 */
router.delete(
  '/:id/images/:imageId',
  authenticateToken,
  requirePermission('can_edit_projects'),
  validateObjectId('id'),
  validateObjectId('imageId'),
  deleteProjectImage
);

/**
 * @route GET /api/projects/:id/analytics
 * @desc Get project analytics
 * @access Private (Admin with can_view_analytics permission)
 */
router.get(
  '/:id/analytics',
  authenticateToken,
  requirePermission('can_view_analytics'),
  validateObjectId('id'),
  getProjectAnalytics
);

module.exports = router;
