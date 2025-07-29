/**
 * Analytics Routes
 * Handle analytics data and reporting
 * 
 * @author Eways Team
 */

const express = require('express');
const Analytics = require('../models/Analytics');
const Contact = require('../models/Contact');
const Project = require('../models/Project');

const { authenticateToken, requirePermission, optionalAuth } = require('../middleware/auth');
const { validateDateRange, validatePagination } = require('../middleware/validation');

const router = express.Router();

/**
 * @route GET /api/analytics/overview
 * @desc Get analytics overview
 * @access Private (Admin with can_view_analytics permission)
 */
router.get(
  '/overview',
  authenticateToken,
  requirePermission('can_view_analytics'),
  validateDateRange,
  async (req, res) => {
    try {
      const { days = 30 } = req.query;
      
      const analyticsData = await Analytics.getSummary(parseInt(days));
      const contactAnalytics = await Contact.getAnalytics(parseInt(days));
      
      // Get project performance
      const topProjects = await Project.find({
        status: 'active',
        visibility: { $in: ['public', 'featured'] }
      })
      .sort({ 'analytics_data.total_views': -1 })
      .limit(10)
      .select('project_name subdomain analytics_data.total_views analytics_data.unique_views');
      
      res.status(200).json({
        success: true,
        data: {
          summary: analyticsData,
          contacts: contactAnalytics,
          topProjects
        }
      });
    } catch (error) {
      console.error('Get analytics overview error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch analytics overview',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

/**
 * @route GET /api/analytics/daily
 * @desc Get daily analytics data
 * @access Private (Admin with can_view_analytics permission)
 */
router.get(
  '/daily',
  authenticateToken,
  requirePermission('can_view_analytics'),
  validateDateRange,
  async (req, res) => {
    try {
      const { startDate, endDate, days = 30 } = req.query;
      
      let start, end;
      
      if (startDate && endDate) {
        start = new Date(startDate);
        end = new Date(endDate);
      } else {
        end = new Date();
        start = new Date();
        start.setDate(start.getDate() - parseInt(days));
      }
      
      const dailyData = await Analytics.getForDateRange(start, end, 'daily');
      
      res.status(200).json({
        success: true,
        data: {
          dailyAnalytics: dailyData,
          dateRange: {
            start: start.toISOString(),
            end: end.toISOString(),
            days: Math.ceil((end - start) / (1000 * 60 * 60 * 24))
          }
        }
      });
    } catch (error) {
      console.error('Get daily analytics error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch daily analytics',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

/**
 * @route GET /api/analytics/traffic
 * @desc Get traffic analytics
 * @access Private (Admin with can_view_analytics permission)
 */
router.get(
  '/traffic',
  authenticateToken,
  requirePermission('can_view_analytics'),
  validateDateRange,
  async (req, res) => {
    try {
      const { days = 30 } = req.query;
      
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - parseInt(days));
      
      const trafficData = await Analytics.aggregate([
        {
          $match: {
            date: { $gte: startDate, $lte: endDate },
            type: 'daily'
          }
        },
        {
          $group: {
            _id: null,
            totalViews: { $sum: '$page_views.total' },
            uniqueViews: { $sum: '$page_views.unique' },
            directTraffic: { $sum: '$traffic_sources.direct' },
            searchTraffic: { $sum: '$traffic_sources.search_engines.total' },
            socialTraffic: { $sum: '$traffic_sources.social_media.total' },
            referralTraffic: { $sum: '$traffic_sources.referrals.total' }
          }
        }
      ]);
      
      // Get top content
      const topContent = await Analytics.getTopContent(parseInt(days), 10);
      
      res.status(200).json({
        success: true,
        data: {
          traffic: trafficData[0] || {},
          topContent
        }
      });
    } catch (error) {
      console.error('Get traffic analytics error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch traffic analytics',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

/**
 * @route GET /api/analytics/demographics
 * @desc Get user demographics analytics
 * @access Private (Admin with can_view_analytics permission)
 */
router.get(
  '/demographics',
  authenticateToken,
  requirePermission('can_view_analytics'),
  validateDateRange,
  async (req, res) => {
    try {
      const { days = 30 } = req.query;
      
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - parseInt(days));
      
      const demographics = await Analytics.aggregate([
        {
          $match: {
            date: { $gte: startDate, $lte: endDate },
            type: 'daily'
          }
        },
        {
          $group: {
            _id: null,
            countries: { $push: '$user_demographics.countries' },
            devices: {
              $push: {
                desktop: '$user_demographics.devices.desktop',
                mobile: '$user_demographics.devices.mobile',
                tablet: '$user_demographics.devices.tablet'
              }
            },
            browsers: { $push: '$user_demographics.browsers' },
            operatingSystems: { $push: '$user_demographics.operating_systems' }
          }
        }
      ]);
      
      res.status(200).json({
        success: true,
        data: demographics[0] || {}
      });
    } catch (error) {
      console.error('Get demographics analytics error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch demographics analytics',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

/**
 * @route POST /api/analytics/track
 * @desc Track custom event
 * @access Public (with optional authentication)
 */
router.post('/track', optionalAuth, async (req, res) => {
  try {
    const { event, category, value, page, userAgent, country } = req.body;
    
    if (!event || !category) {
      return res.status(400).json({
        success: false,
        message: 'Event name and category are required'
      });
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Update or create analytics record for today
    const analytics = await Analytics.updateDailyAnalytics(today, {});
    
    // Add custom event
    await analytics.addCustomEvent(event, category, value);
    
    // If page is provided, add page view
    if (page) {
      await analytics.addPageView(page, true);
    }
    
    res.status(200).json({
      success: true,
      message: 'Event tracked successfully'
    });
  } catch (error) {
    console.error('Track event error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to track event',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route GET /api/analytics/export
 * @desc Export analytics data
 * @access Private (Admin with can_view_analytics permission)
 */
router.get(
  '/export',
  authenticateToken,
  requirePermission('can_view_analytics'),
  validateDateRange,
  async (req, res) => {
    try {
      const { format = 'json', type = 'overview', days = 30 } = req.query;
      
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - parseInt(days));
      
      let data;
      
      switch (type) {
        case 'daily':
          data = await Analytics.getForDateRange(startDate, endDate, 'daily');
          break;
        case 'contacts':
          data = await Contact.find({
            createdAt: { $gte: startDate, $lte: endDate }
          }).lean();
          break;
        case 'projects':
          data = await Project.find({}).select('project_name subdomain analytics_data').lean();
          break;
        default:
          data = await Analytics.getSummary(parseInt(days));
      }
      
      const exportData = {
        type,
        dateRange: {
          start: startDate.toISOString(),
          end: endDate.toISOString()
        },
        exportedAt: new Date().toISOString(),
        data
      };
      
      if (format === 'csv' && Array.isArray(data)) {
        const { Parser } = require('json2csv');
        const parser = new Parser();
        const csv = parser.parse(data);
        
        res.header('Content-Type', 'text/csv');
        res.attachment(`analytics-${type}-${new Date().toISOString().split('T')[0]}.csv`);
        res.send(csv);
      } else {
        res.header('Content-Type', 'application/json');
        res.attachment(`analytics-${type}-${new Date().toISOString().split('T')[0]}.json`);
        res.json(exportData);
      }
      
      // Log activity
      if (req.admin) {
        req.admin.logActivity(
          'analytics_export',
          'analytics',
          null,
          req.ip,
          req.get('User-Agent')
        );
      }
    } catch (error) {
      console.error('Export analytics error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to export analytics data',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

/**
 * @route GET /api/analytics/realtime
 * @desc Get real-time analytics data
 * @access Private (Admin with can_view_analytics permission)
 */
router.get(
  '/realtime',
  authenticateToken,
  requirePermission('can_view_analytics'),
  async (req, res) => {
    try {
      const last24Hours = new Date();
      last24Hours.setHours(last24Hours.getHours() - 24);
      
      const [recentContacts, recentProjectViews, currentOnline] = await Promise.all([
        Contact.find({
          createdAt: { $gte: last24Hours }
        }).countDocuments(),
        
        Project.aggregate([
          {
            $match: {
              'analytics_data.last_viewed': { $gte: last24Hours }
            }
          },
          {
            $group: {
              _id: null,
              totalViews: { $sum: '$analytics_data.total_views' }
            }
          }
        ]),
        
        // This would typically come from a real-time tracking system
        // For now, return a simulated value
        Math.floor(Math.random() * 50) + 10
      ]);
      
      res.status(200).json({
        success: true,
        data: {
          last24Hours: {
            contacts: recentContacts,
            projectViews: recentProjectViews[0]?.totalViews || 0,
            estimatedOnline: currentOnline
          },
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Get realtime analytics error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch real-time analytics',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

module.exports = router;
