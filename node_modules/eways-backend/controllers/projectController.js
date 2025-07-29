/**
 * Project Controller
 * Handle project management and display
 * 
 * @author Eways Team
 */

const Project = require('../models/Project');
const Analytics = require('../models/Analytics');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

/**
 * Multer configuration for file uploads
 */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/projects/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: fileFilter
});

/**
 * Get all active projects
 * @route GET /api/projects
 * @access Public
 */
const getProjects = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      tags,
      search,
      sortBy = 'priority',
      sort = 'desc',
      featured
    } = req.query;
    
    // Build filter object
    const filter = {
      status: 'active',
      visibility: { $in: ['public', 'featured'] }
    };
    
    if (category) {
      filter.category = category;
    }
    
    if (tags) {
      const tagArray = Array.isArray(tags) ? tags : [tags];
      filter.tags = { $in: tagArray };
    }
    
    if (featured === 'true') {
      filter.visibility = 'featured';
    }
    
    if (search) {
      filter.$or = [
        { project_name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { short_description: { $regex: search, $options: 'i' } },
        { tech_stack: { $in: [new RegExp(search, 'i')] } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }
    
    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOrder = sort === 'desc' ? -1 : 1;
    const sortObj = { [sortBy]: sortOrder };
    
    // Execute query with pagination
    const [projects, total] = await Promise.all([
      Project.find(filter)
        .select('-admin_notes -analytics_data.view_history')
        .populate('created_by', 'username')
        .sort(sortObj)
        .skip(skip)
        .limit(parseInt(limit)),
      Project.countDocuments(filter)
    ]);
    
    // Calculate pagination info
    const totalPages = Math.ceil(total / parseInt(limit));
    const hasNext = page < totalPages;
    const hasPrev = page > 1;
    
    res.status(200).json({
      success: true,
      data: {
        projects,
        pagination: {
          current: parseInt(page),
          total: totalPages,
          count: projects.length,
          totalCount: total,
          hasNext,
          hasPrev
        }
      }
    });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch projects',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get single project by subdomain
 * @route GET /api/projects/:subdomain
 * @access Public
 */
const getProjectBySubdomain = async (req, res) => {
  try {
    const { subdomain } = req.params;
    const clientIp = req.ip || req.connection.remoteAddress;
    
    const project = await Project.findOne({
      subdomain,
      status: 'active',
      visibility: { $in: ['public', 'featured'] }
    })
    .select('-admin_notes')
    .populate('created_by', 'username fullName');
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }
    
    // Check if this is a unique view (simple IP-based check)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayHistory = project.analytics_data.view_history.find(
      h => h.date.getTime() === today.getTime()
    );
    
    const isUniqueView = !todayHistory || !todayHistory.unique_views;
    
    // Increment view count (async, don't wait)
    project.incrementViews(isUniqueView).catch(err => {
      console.error('Failed to increment project views:', err.message);
    });
    
    // Update analytics (async, don't wait)
    Analytics.updateDailyAnalytics(today, {
      $inc: {
        'project_visits.total': 1,
        'project_visits.unique': isUniqueView ? 1 : 0
      }
    }).then(async (analytics) => {
      await analytics.addProjectVisit({
        project_id: project._id,
        project_name: project.project_name,
        subdomain: project.subdomain
      }, isUniqueView);
    }).catch(err => {
      console.error('Failed to update project analytics:', err.message);
    });
    
    // Remove view history from response for privacy
    const projectData = project.toObject();
    if (projectData.analytics_data) {
      delete projectData.analytics_data.view_history;
    }
    
    res.status(200).json({
      success: true,
      data: projectData
    });
  } catch (error) {
    console.error('Get project by subdomain error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch project',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Create new project (Admin only)
 * @route POST /api/projects
 * @access Private (Admin)
 */
const createProject = async (req, res) => {
  try {
    const projectData = {
      ...req.body,
      created_by: req.admin._id,
      updated_by: req.admin._id
    };
    
    // Check if subdomain already exists
    const existingProject = await Project.findOne({ subdomain: projectData.subdomain });
    if (existingProject) {
      return res.status(400).json({
        success: false,
        message: 'Subdomain already exists'
      });
    }
    
    const project = new Project(projectData);
    await project.save();
    
    // Populate for response
    await project.populate('created_by', 'username fullName');
    
    // Log activity
    req.admin.logActivity(
      'project_create',
      'project',
      project._id,
      req.ip,
      req.get('User-Agent')
    );
    
    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: project
    });
  } catch (error) {
    console.error('Create project error:', error);
    
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json({
        success: false,
        message: `${field} already exists`
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to create project',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Update project (Admin only)
 * @route PUT /api/projects/:id
 * @access Private (Admin)
 */
const updateProject = async (req, res) => {
  try {
    const updateData = {
      ...req.body,
      updated_by: req.admin._id
    };
    
    // Remove fields that shouldn't be updated directly
    delete updateData.analytics_data;
    delete updateData.created_by;
    delete updateData.createdAt;
    
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('created_by updated_by', 'username fullName');
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }
    
    // Log activity
    req.admin.logActivity(
      'project_update',
      'project',
      project._id,
      req.ip,
      req.get('User-Agent')
    );
    
    res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      data: project
    });
  } catch (error) {
    console.error('Update project error:', error);
    
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json({
        success: false,
        message: `${field} already exists`
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to update project',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Delete project (Admin only)
 * @route DELETE /api/projects/:id
 * @access Private (Admin)
 */
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }
    
    // Delete associated files
    if (project.images && project.images.length > 0) {
      for (const image of project.images) {
        if (image.path) {
          try {
            await fs.unlink(image.path);
          } catch (err) {
            console.warn(`Failed to delete file: ${image.path}`, err.message);
          }
        }
      }
    }
    
    await Project.findByIdAndDelete(req.params.id);
    
    // Log activity
    req.admin.logActivity(
      'project_delete',
      'project',
      req.params.id,
      req.ip,
      req.get('User-Agent')
    );
    
    res.status(200).json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete project',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Upload project images (Admin only)
 * @route POST /api/projects/:id/images
 * @access Private (Admin)
 */
const uploadProjectImages = async (req, res) => {
  try {
    const uploadFiles = upload.array('images', 10);
    
    uploadFiles(req, res, async (err) => {
      if (err) {
        return res.status(400).json({
          success: false,
          message: err.message
        });
      }
      
      const project = await Project.findById(req.params.id);
      
      if (!project) {
        // Clean up uploaded files
        if (req.files) {
          for (const file of req.files) {
            await fs.unlink(file.path).catch(() => {});
          }
        }
        
        return res.status(404).json({
          success: false,
          message: 'Project not found'
        });
      }
      
      // Process uploaded files
      const newImages = req.files.map((file, index) => ({
        filename: file.filename,
        originalName: file.originalname,
        path: file.path,
        size: file.size,
        mimetype: file.mimetype,
        caption: req.body.captions ? req.body.captions[index] : '',
        isMain: project.images.length === 0 && index === 0 // First image of empty project becomes main
      }));
      
      project.images.push(...newImages);
      project.updated_by = req.admin._id;
      
      await project.save();
      
      // Log activity
      req.admin.logActivity(
        'project_images_upload',
        'project',
        project._id,
        req.ip,
        req.get('User-Agent')
      );
      
      res.status(200).json({
        success: true,
        message: 'Images uploaded successfully',
        data: {
          uploadedImages: newImages,
          totalImages: project.images.length
        }
      });
    });
  } catch (error) {
    console.error('Upload project images error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload images',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Delete project image (Admin only)
 * @route DELETE /api/projects/:id/images/:imageId
 * @access Private (Admin)
 */
const deleteProjectImage = async (req, res) => {
  try {
    const { id, imageId } = req.params;
    
    const project = await Project.findById(id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }
    
    const imageIndex = project.images.findIndex(img => img._id.toString() === imageId);
    
    if (imageIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Image not found'
      });
    }
    
    const image = project.images[imageIndex];
    
    // Delete file from filesystem
    if (image.path) {
      try {
        await fs.unlink(image.path);
      } catch (err) {
        console.warn(`Failed to delete file: ${image.path}`, err.message);
      }
    }
    
    // Remove image from project
    project.images.splice(imageIndex, 1);
    
    // If deleted image was main image, set another as main
    if (image.isMain && project.images.length > 0) {
      project.images[0].isMain = true;
    }
    
    project.updated_by = req.admin._id;
    await project.save();
    
    // Log activity
    req.admin.logActivity(
      'project_image_delete',
      'project',
      project._id,
      req.ip,
      req.get('User-Agent')
    );
    
    res.status(200).json({
      success: true,
      message: 'Image deleted successfully'
    });
  } catch (error) {
    console.error('Delete project image error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete image',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get project categories
 * @route GET /api/projects/categories
 * @access Public
 */
const getProjectCategories = async (req, res) => {
  try {
    const categories = await Project.aggregate([
      {
        $match: {
          status: 'active',
          visibility: { $in: ['public', 'featured'] }
        }
      },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);
    
    const allCategories = [
      'web-development',
      'mobile-app',
      'desktop-app',
      'api',
      'database',
      'devops',
      'other'
    ];
    
    const result = allCategories.map(cat => {
      const found = categories.find(c => c._id === cat);
      return {
        name: cat,
        count: found ? found.count : 0,
        label: cat.split('-').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ')
      };
    });
    
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Get project categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get project analytics (Admin only)
 * @route GET /api/projects/:id/analytics
 * @access Private (Admin)
 */
const getProjectAnalytics = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }
    
    // Get view history for last 30 days
    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);
    
    const viewHistory = project.analytics_data.view_history
      .filter(h => h.date >= last30Days)
      .sort((a, b) => a.date - b.date);
    
    // Calculate growth rate
    const currentViews = project.analytics_data.total_views;
    const last30DaysViews = viewHistory.reduce((sum, h) => sum + h.views, 0);
    
    res.status(200).json({
      success: true,
      data: {
        totalViews: project.analytics_data.total_views,
        uniqueViews: project.analytics_data.unique_views,
        lastViewed: project.analytics_data.last_viewed,
        viewHistory,
        last30DaysViews,
        averageDailyViews: Math.round(last30DaysViews / 30),
        conversionRate: project.analytics_data.unique_views > 0 
          ? Math.round((currentViews / project.analytics_data.unique_views) * 100)
          : 0
      }
    });
  } catch (error) {
    console.error('Get project analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch project analytics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  getProjects,
  getProjectBySubdomain,
  createProject,
  updateProject,
  deleteProject,
  uploadProjectImages,
  deleteProjectImage,
  getProjectCategories,
  getProjectAnalytics
};
