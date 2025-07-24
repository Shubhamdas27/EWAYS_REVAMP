/**
 * Admin Controller
 * Handle admin authentication and management
 * 
 * @author Eways Team
 */

const Admin = require('../models/Admin');
const Contact = require('../models/Contact');
const Project = require('../models/Project');
const Analytics = require('../models/Analytics');
const { sendEmail, emailTemplates } = require('../config/email');

/**
 * Admin login
 * @route POST /api/admin/login
 * @access Public
 */
const login = async (req, res) => {
  try {
    const { username, password, rememberMe } = req.body;
    const clientIp = req.ip || req.connection.remoteAddress;
    
    // Simple hardcoded admin for demo purposes
    const defaultAdmin = {
      username: 'admin@eways.in',
      email: 'admin@eways.in',
      password: 'admin123',
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      status: 'active'
    };
    
    // Check credentials against default admin
    if ((username === defaultAdmin.username || username === defaultAdmin.email) && 
        password === defaultAdmin.password) {
      
      // Simple token generation (for demo)
      const token = Buffer.from(`${username}:${Date.now()}`).toString('base64');
      
      // Create admin response object
      const adminResponse = {
        _id: 'admin-001',
        username: defaultAdmin.username,
        email: defaultAdmin.email,
        firstName: defaultAdmin.firstName,
        lastName: defaultAdmin.lastName,
        role: defaultAdmin.role,
        status: defaultAdmin.status,
        lastLogin: new Date(),
        createdAt: new Date('2024-01-01')
      };
      
      console.log(`✅ Admin login successful: ${username} from IP: ${clientIp}`);
      
      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          admin: adminResponse,
          token: token,
          refreshToken: rememberMe ? token + '-refresh' : undefined
        }
      });
      
    } else {
      console.log(`❌ Failed login attempt: ${username} from IP: ${clientIp}`);
      
      return res.status(401).json({
        success: false,
        message: 'Invalid login credentials'
      });
    }
    
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Admin logout
 * @route POST /api/admin/logout
 * @access Private
 */
const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    // Revoke refresh token if provided
    if (refreshToken) {
      await req.admin.revokeRefreshToken(refreshToken);
    }
    
    // Log activity
    req.admin.logActivity(
      'logout',
      'auth',
      null,
      req.ip,
      req.get('User-Agent')
    );
    
    // Clear cookies
    res.clearCookie('token');
    res.clearCookie('refreshToken');
    
    res.status(200).json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    console.error('Admin logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Logout failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Refresh token
 * @route POST /api/admin/refresh
 * @access Public
 */
const refreshToken = async (req, res) => {
  try {
    // Revoke old refresh token
    await req.admin.revokeRefreshToken(req.refreshToken);
    
    // Generate new tokens
    const newToken = req.admin.getSignedJwtToken();
    const newRefreshToken = req.admin.generateRefreshToken(
      req.get('User-Agent'),
      req.ip
    );
    
    await req.admin.save();
    
    res.status(200).json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        token: newToken,
        refreshToken: newRefreshToken
      }
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({
      success: false,
      message: 'Token refresh failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get admin profile
 * @route GET /api/admin/profile
 * @access Private
 */
const getProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id);
    
    res.status(200).json({
      success: true,
      data: admin
    });
  } catch (error) {
    console.error('Get admin profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Update admin profile
 * @route PUT /api/admin/profile
 * @access Private
 */
const updateProfile = async (req, res) => {
  try {
    const allowedFields = [
      'firstName',
      'lastName',
      'profile.bio',
      'profile.phone',
      'profile.timezone',
      'profile.preferences.email_notifications',
      'profile.preferences.dashboard_layout',
      'profile.preferences.theme'
    ];
    
    const updateData = {};
    
    // Filter allowed fields
    Object.keys(req.body).forEach(key => {
      if (allowedFields.includes(key)) {
        updateData[key] = req.body[key];
      }
    });
    
    const admin = await Admin.findByIdAndUpdate(
      req.admin._id,
      updateData,
      { new: true, runValidators: true }
    );
    
    // Log activity
    req.admin.logActivity(
      'profile_update',
      'admin',
      req.admin._id,
      req.ip,
      req.get('User-Agent')
    );
    
    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: admin
    });
  } catch (error) {
    console.error('Update admin profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Change password
 * @route PUT /api/admin/change-password
 * @access Private
 */
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    // Get admin with password
    const admin = await Admin.findById(req.admin._id).select('+password');
    
    // Verify current password
    const isMatch = await admin.matchPassword(currentPassword);
    
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }
    
    // Update password
    admin.password = newPassword;
    await admin.save();
    
    // Log activity
    admin.logActivity(
      'password_change',
      'admin',
      admin._id,
      req.ip,
      req.get('User-Agent')
    );
    
    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to change password',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get dashboard analytics
 * @route GET /api/admin/dashboard
 * @access Private
 */
const getDashboard = async (req, res) => {
  try {
    // Simple dashboard data for demo
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    // Get basic counts from database
    let contactsCount = 0;
    let projectsCount = 0;
    let recentContacts = [];
    
    try {
      // Try to get contact count
      contactsCount = await Contact.countDocuments({});
      
      // Get recent contacts
      recentContacts = await Contact.find({})
        .sort({ createdAt: -1 })
        .limit(5)
        .select('name email subject createdAt status')
        .lean();
        
    } catch (err) {
      console.log('Note: Contact collection not available, using mock data');
      contactsCount = 25; // Mock data
      recentContacts = [
        { name: 'Shubham Sharma', email: 'shubham@example.com', subject: 'Web Development', createdAt: new Date(), status: 'new' },
        { name: 'Jane Smith', email: 'jane@example.com', subject: 'SEO Services', createdAt: new Date(), status: 'replied' }
      ];
    }
    
    try {
      // Try to get project count
      projectsCount = await Project.countDocuments({});
    } catch (err) {
      console.log('Note: Project collection not available, using mock data');
      projectsCount = 12; // Mock data
    }
    
    // Create dashboard response
    const dashboard = {
      overview: {
        contacts: {
          total: contactsCount,
          new: Math.floor(contactsCount * 0.3), // 30% are new
          replied: Math.floor(contactsCount * 0.6), // 60% replied
          responseRate: 85 // 85% response rate
        },
        projects: {
          total: projectsCount,
          active: Math.floor(projectsCount * 0.8), // 80% active
          featured: Math.floor(projectsCount * 0.3), // 30% featured
          totalViews: projectsCount * 150, // Average 150 views per project
          uniqueViews: projectsCount * 120 // Average 120 unique views
        },
        analytics: {
          pageViews: 15420,
          uniqueVisitors: 8930,
          avgSessionDuration: 245, // seconds
          apiRequests: 2840
        }
      },
      charts: {
        dailyStats: [
          { date: '2025-07-20', pageViews: 450, uniqueViews: 320, contacts: 5, projectVisits: 85 },
          { date: '2025-07-21', pageViews: 380, uniqueViews: 290, contacts: 3, projectVisits: 72 },
          { date: '2025-07-22', pageViews: 520, uniqueViews: 410, contacts: 8, projectVisits: 95 },
          { date: '2025-07-23', pageViews: 610, uniqueViews: 480, contacts: 6, projectVisits: 110 },
          { date: '2025-07-24', pageViews: 480, uniqueViews: 360, contacts: 4, projectVisits: 88 }
        ],
        topProjects: [
          { project_name: 'E-commerce Platform', subdomain: 'ecommerce', total_views: 1250, unique_views: 980 },
          { project_name: 'Corporate Website', subdomain: 'corporate', total_views: 890, unique_views: 720 },
          { project_name: 'Mobile App Landing', subdomain: 'mobile', total_views: 760, unique_views: 650 }
        ]
      },
      recent: {
        contacts: recentContacts,
        activity: [
          { action: 'login', type: 'auth', timestamp: new Date(), ip_address: req.ip },
          { action: 'dashboard_view', type: 'admin', timestamp: new Date(), ip_address: req.ip },
          { action: 'contact_reply', type: 'contact', timestamp: new Date(Date.now() - 3600000), ip_address: req.ip }
        ]
      }
    };
    
    console.log('✅ Dashboard data fetched successfully');
    
    res.status(200).json({
      success: true,
      data: dashboard
    });
    
  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard data',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get system statistics
 * @route GET /api/admin/stats
 * @access Private
 */
const getStats = async (req, res) => {
  try {
    const [
      adminStats,
      contactStats,
      projectStats,
      systemInfo
    ] = await Promise.all([
      Admin.getStats(),
      Contact.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            today: {
              $sum: {
                $cond: [
                  { $gte: ['$createdAt', new Date(new Date().setHours(0, 0, 0, 0))] },
                  1,
                  0
                ]
              }
            },
            thisWeek: {
              $sum: {
                $cond: [
                  { $gte: ['$createdAt', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)] },
                  1,
                  0
                ]
              }
            },
            thisMonth: {
              $sum: {
                $cond: [
                  { $gte: ['$createdAt', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)] },
                  1,
                  0
                ]
              }
            }
          }
        }
      ]),
      Project.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            active: { $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] } },
            featured: { $sum: { $cond: [{ $eq: ['$visibility', 'featured'] }, 1, 0] } },
            totalViews: { $sum: '$analytics_data.total_views' }
          }
        }
      ]),
      {
        nodeVersion: process.version,
        platform: process.platform,
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage(),
        environment: process.env.NODE_ENV
      }
    ]);
    
    res.status(200).json({
      success: true,
      data: {
        admins: adminStats,
        contacts: contactStats[0] || { total: 0, today: 0, thisWeek: 0, thisMonth: 0 },
        projects: projectStats[0] || { total: 0, active: 0, featured: 0, totalViews: 0 },
        system: systemInfo
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Create database backup
 * @route POST /api/admin/backup
 * @access Private (Super Admin)
 */
const createBackup = async (req, res) => {
  try {
    const backupData = {
      timestamp: new Date(),
      version: '1.0.0',
      data: {
        contacts: await Contact.find({}).lean(),
        projects: await Project.find({}).lean(),
        admins: await Admin.find({}).select('-password -security.two_factor_secret -security.recovery_codes').lean(),
        analytics: await Analytics.find({}).lean()
      }
    };
    
    // Log activity
    req.admin.logActivity(
      'backup_create',
      'system',
      null,
      req.ip,
      req.get('User-Agent')
    );
    
    res.status(200)
      .header('Content-Type', 'application/json')
      .attachment(`eways-backup-${new Date().toISOString().split('T')[0]}.json`)
      .json(backupData);
  } catch (error) {
    console.error('Create backup error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create backup',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get admin activity log
 * @route GET /api/admin/activity
 * @access Private
 */
const getActivity = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    
    const admin = await Admin.findById(req.admin._id);
    
    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const endIndex = startIndex + parseInt(limit);
    
    const activities = admin.activity_log.slice(startIndex, endIndex);
    const total = admin.activity_log.length;
    const totalPages = Math.ceil(total / parseInt(limit));
    
    res.status(200).json({
      success: true,
      data: {
        activities,
        pagination: {
          current: parseInt(page),
          total: totalPages,
          count: activities.length,
          totalCount: total,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Get activity error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch activity log',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
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
};
