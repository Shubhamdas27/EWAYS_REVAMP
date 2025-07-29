/**
 * Contact Controller
 * Handle contact form submissions and management
 * 
 * @author Eways Team
 */

const Contact = require('../models/Contact');
const Analytics = require('../models/Analytics');
const { sendEmail, emailTemplates } = require('../config/email');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'resume-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    // Allow only specific file types
    const allowedTypes = /pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only PDF, DOC, and DOCX files are allowed'));
    }
  }
});

/**
 * Submit contact form (handles both regular contact and career applications)
 * @route POST /api/contact
 * @access Public
 */
const submitContact = async (req, res) => {
  try {
    // Handle both contact form and career application
    const { 
      name, 
      email, 
      phone, 
      subject, 
      message,
      // Career-specific fields
      fullName,
      position,
      jobType,
      experience,
      education,
      skills,
      portfolio,
      coverLetter
    } = req.body;
    
    // Get client information
    const ip_address = req.ip || req.connection.remoteAddress;
    const user_agent = req.get('User-Agent');
    
    // Determine if this is a career application or regular contact
    const isCareerApplication = fullName || position || experience;
    
    let contactData;
    
    if (isCareerApplication) {
      // Career application
      contactData = {
        name: fullName || name,
        email,
        phone,
        subject: `Career Application - ${position || 'General Application'}`,
        message: `
CAREER APPLICATION
==================

Position: ${position || 'Not specified'}
Job Type: ${jobType || 'Full-time'}

EXPERIENCE:
${experience || 'Not provided'}

EDUCATION:
${education || 'Not provided'}

SKILLS:
${skills || 'Not provided'}

PORTFOLIO: ${portfolio || 'Not provided'}

COVER LETTER:
${coverLetter || 'Not provided'}
        `,
        ip_address,
        user_agent,
        source: 'career',
        // Add file path if resume uploaded
        resume_path: req.file ? req.file.path : null
      };
    } else {
      // Regular contact form
      contactData = {
        name,
        email,
        phone,
        subject,
        message,
        ip_address,
        user_agent,
        source: 'website'
      };
    }
    
    // Create contact entry
    const contact = new Contact(contactData);
    await contact.save();
    
    // Send notification email to admin (async, don't wait for completion)
    if (!contact.is_spam) {
      sendEmail({
        to: process.env.ADMIN_EMAIL,
        ...emailTemplates.contactNotification({
          ...contact.toObject(),
          ip_address,
          user_agent
        })
      }).catch(err => {
        console.error('Failed to send admin notification email:', err.message);
      });
      
      // Send auto-reply to user (async, don't wait for completion)
      sendEmail({
        to: email,
        ...emailTemplates.contactAutoReply(contact.toObject())
      }).catch(err => {
        console.error('Failed to send auto-reply email:', err.message);
      });
    }
    
    // Update analytics
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    Analytics.updateDailyAnalytics(today, {
      $inc: {
        'contact_submissions.total': 1,
        'contact_submissions.successful': contact.is_spam ? 0 : 1,
        'contact_submissions.spam_filtered': contact.is_spam ? 1 : 0
      }
    }).catch(err => {
      console.error('Failed to update analytics:', err.message);
    });
    
    res.status(201).json({
      success: true,
      message: 'Thank you for your message! We will get back to you soon.',
      data: {
        id: contact._id,
        status: contact.status,
        timestamp: contact.createdAt
      }
    });
  } catch (error) {
    console.error('Contact submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit contact form. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get all contact messages (Admin only)
 * @route GET /api/contact/messages
 * @access Private (Admin)
 */
const getMessages = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      priority,
      search,
      sortBy = 'createdAt',
      sort = 'desc'
    } = req.query;
    
    // Build filter object
    const filter = {};
    
    if (status) {
      filter.status = status;
    }
    
    if (priority) {
      filter.priority = priority;
    }
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOrder = sort === 'desc' ? -1 : 1;
    const sortObj = { [sortBy]: sortOrder };
    
    // Execute query with pagination
    const [messages, total] = await Promise.all([
      Contact.find(filter)
        .populate('replied_by', 'username email')
        .sort(sortObj)
        .skip(skip)
        .limit(parseInt(limit)),
      Contact.countDocuments(filter)
    ]);
    
    // Calculate pagination info
    const totalPages = Math.ceil(total / parseInt(limit));
    const hasNext = page < totalPages;
    const hasPrev = page > 1;
    
    // Get status counts for dashboard
    const statusCounts = await Contact.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
    
    res.status(200).json({
      success: true,
      data: {
        messages,
        pagination: {
          current: parseInt(page),
          total: totalPages,
          count: messages.length,
          totalCount: total,
          hasNext,
          hasPrev
        },
        statusCounts: statusCounts.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {})
      }
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch messages',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get single contact message
 * @route GET /api/contact/messages/:id
 * @access Private (Admin)
 */
const getMessage = async (req, res) => {
  try {
    const message = await Contact.findById(req.params.id)
      .populate('replied_by', 'username email fullName');
    
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }
    
    // Mark as read if not already read
    if (message.status === 'new') {
      message.status = 'read';
      await message.save();
      
      // Log activity
      req.admin.logActivity(
        'contact_read',
        'contact',
        message._id,
        req.ip,
        req.get('User-Agent')
      );
    }
    
    res.status(200).json({
      success: true,
      data: message
    });
  } catch (error) {
    console.error('Get message error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch message',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Update message status
 * @route PUT /api/contact/messages/:id/status
 * @access Private (Admin)
 */
const updateMessageStatus = async (req, res) => {
  try {
    const { status, priority, admin_notes } = req.body;
    
    const message = await Contact.findById(req.params.id);
    
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }
    
    // Update message
    if (status) message.status = status;
    if (priority) message.priority = priority;
    if (admin_notes !== undefined) message.admin_notes = admin_notes;
    
    // Mark as replied if status is replied
    if (status === 'replied') {
      message.replied_by = req.admin._id;
      message.replied_at = new Date();
    }
    
    await message.save();
    
    // Log activity
    req.admin.logActivity(
      'contact_update',
      'contact',
      message._id,
      req.ip,
      req.get('User-Agent')
    );
    
    // Populate for response
    await message.populate('replied_by', 'username email fullName');
    
    res.status(200).json({
      success: true,
      message: 'Message updated successfully',
      data: message
    });
  } catch (error) {
    console.error('Update message status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update message status',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Delete contact message
 * @route DELETE /api/contact/messages/:id
 * @access Private (Admin)
 */
const deleteMessage = async (req, res) => {
  try {
    const message = await Contact.findById(req.params.id);
    
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }
    
    await Contact.findByIdAndDelete(req.params.id);
    
    // Log activity
    req.admin.logActivity(
      'contact_delete',
      'contact',
      req.params.id,
      req.ip,
      req.get('User-Agent')
    );
    
    res.status(200).json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete message',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Bulk update messages
 * @route PUT /api/contact/messages/bulk
 * @access Private (Admin)
 */
const bulkUpdateMessages = async (req, res) => {
  try {
    const { messageIds, action, value } = req.body;
    
    if (!messageIds || !Array.isArray(messageIds) || messageIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Message IDs are required'
      });
    }
    
    let updateOperation = {};
    
    switch (action) {
      case 'status':
        updateOperation.status = value;
        if (value === 'replied') {
          updateOperation.replied_by = req.admin._id;
          updateOperation.replied_at = new Date();
        }
        break;
      case 'priority':
        updateOperation.priority = value;
        break;
      case 'archive':
        updateOperation.status = 'archived';
        break;
      case 'spam':
        updateOperation.is_spam = true;
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid bulk action'
        });
    }
    
    const result = await Contact.updateMany(
      { _id: { $in: messageIds } },
      { $set: updateOperation }
    );
    
    // Log activity
    req.admin.logActivity(
      'contact_bulk_update',
      'contact',
      messageIds.join(','),
      req.ip,
      req.get('User-Agent')
    );
    
    res.status(200).json({
      success: true,
      message: `Successfully updated ${result.modifiedCount} messages`,
      data: {
        matchedCount: result.matchedCount,
        modifiedCount: result.modifiedCount
      }
    });
  } catch (error) {
    console.error('Bulk update messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update messages',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get contact analytics
 * @route GET /api/contact/analytics
 * @access Private (Admin)
 */
const getContactAnalytics = async (req, res) => {
  try {
    const { days = 30 } = req.query;
    
    // Get analytics data
    const analytics = await Contact.getAnalytics(parseInt(days));
    
    // Get recent messages
    const recentMessages = await Contact.getRecent(5);
    
    // Get hourly distribution (last 24 hours)
    const last24Hours = new Date();
    last24Hours.setHours(last24Hours.getHours() - 24);
    
    const hourlyData = await Contact.aggregate([
      {
        $match: {
          createdAt: { $gte: last24Hours }
        }
      },
      {
        $group: {
          _id: { $hour: '$createdAt' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);
    
    // Get top subjects
    const topSubjects = await Contact.aggregate([
      {
        $group: {
          _id: '$subject',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 10
      }
    ]);
    
    res.status(200).json({
      success: true,
      data: {
        summary: analytics,
        recentMessages,
        hourlyDistribution: hourlyData,
        topSubjects
      }
    });
  } catch (error) {
    console.error('Get contact analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contact analytics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Export contacts to CSV
 * @route GET /api/contact/export
 * @access Private (Admin)
 */
const exportContacts = async (req, res) => {
  try {
    const { format = 'csv', status, startDate, endDate } = req.query;
    
    // Build filter
    const filter = {};
    if (status) filter.status = status;
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }
    
    const contacts = await Contact.find(filter)
      .populate('replied_by', 'username')
      .sort({ createdAt: -1 });
    
    if (format === 'csv') {
      const { Parser } = require('json2csv');
      
      const fields = [
        'name',
        'email',
        'phone',
        'subject',
        'message',
        'status',
        'priority',
        'createdAt',
        'replied_by.username',
        'replied_at',
        'ip_address',
        'is_spam',
        'spam_score'
      ];
      
      const parser = new Parser({ fields });
      const csv = parser.parse(contacts);
      
      res.header('Content-Type', 'text/csv');
      res.attachment(`contacts-${new Date().toISOString().split('T')[0]}.csv`);
      res.send(csv);
    } else {
      res.header('Content-Type', 'application/json');
      res.attachment(`contacts-${new Date().toISOString().split('T')[0]}.json`);
      res.json(contacts);
    }
    
    // Log activity
    req.admin.logActivity(
      'contact_export',
      'contact',
      null,
      req.ip,
      req.get('User-Agent')
    );
  } catch (error) {
    console.error('Export contacts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export contacts',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  submitContact,
  getMessages,
  getMessage,
  updateMessageStatus,
  deleteMessage,
  bulkUpdateMessages,
  getContactAnalytics,
  exportContacts,
  upload // Export multer upload middleware
};
