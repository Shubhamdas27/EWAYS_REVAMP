/**
 * Contact Model
 * MongoDB schema for contact form submissions
 * 
 * @author Eways Team
 */

const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email address'
    ]
  },
  phone: {
    type: String,
    trim: true,
    maxlength: [20, 'Phone number cannot exceed 20 characters'],
    match: [
      /^[\+]?[1-9][\d]{0,15}$/,
      'Please provide a valid phone number'
    ]
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true,
    maxlength: [200, 'Subject cannot exceed 200 characters']
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true,
    maxlength: [2000, 'Message cannot exceed 2000 characters']
  },
  status: {
    type: String,
    enum: ['new', 'read', 'replied', 'archived'],
    default: 'new'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  ip_address: {
    type: String,
    default: null
  },
  user_agent: {
    type: String,
    default: null
  },
  source: {
    type: String,
    default: 'website'
  },
  resume_path: {
    type: String,
    default: null
  },
  tags: [{
    type: String,
    trim: true
  }],
  admin_notes: {
    type: String,
    maxlength: [1000, 'Admin notes cannot exceed 1000 characters']
  },
  replied_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    default: null
  },
  replied_at: {
    type: Date,
    default: null
  },
  is_spam: {
    type: Boolean,
    default: false
  },
  spam_score: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
contactSchema.index({ email: 1 });
contactSchema.index({ status: 1 });
contactSchema.index({ createdAt: -1 });
contactSchema.index({ priority: 1, status: 1 });
contactSchema.index({ is_spam: 1 });

// Virtual for time since submission
contactSchema.virtual('timeAgo').get(function() {
  const now = new Date();
  const diff = now - this.createdAt;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return 'Just now';
});

// Virtual for response time (if replied)
contactSchema.virtual('responseTime').get(function() {
  if (!this.replied_at) return null;
  
  const diff = this.replied_at - this.createdAt;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days} day${days > 1 ? 's' : ''}`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
  return 'Less than an hour';
});

// Pre-save middleware to detect potential spam
contactSchema.pre('save', function(next) {
  // Simple spam detection logic
  let spamScore = 0;
  
  // Check for suspicious patterns
  const suspiciousWords = ['viagra', 'casino', 'lottery', 'winner', 'congratulations', 'click here'];
  const messageText = this.message.toLowerCase();
  
  suspiciousWords.forEach(word => {
    if (messageText.includes(word)) spamScore += 20;
  });
  
  // Check for excessive links
  const linkCount = (this.message.match(/http[s]?:\/\//g) || []).length;
  if (linkCount > 2) spamScore += 30;
  
  // Check for excessive capitalization
  const capsRatio = (this.message.match(/[A-Z]/g) || []).length / this.message.length;
  if (capsRatio > 0.5) spamScore += 15;
  
  this.spam_score = Math.min(spamScore, 100);
  this.is_spam = spamScore >= 60;
  
  next();
});

// Static method to get contacts by status
contactSchema.statics.getByStatus = function(status) {
  return this.find({ status }).sort({ createdAt: -1 });
};

// Static method to get recent contacts
contactSchema.statics.getRecent = function(limit = 10) {
  return this.find({ is_spam: false })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('replied_by', 'username email');
};

// Static method to get analytics data
contactSchema.statics.getAnalytics = async function(days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  const analytics = await this.aggregate([
    { $match: { createdAt: { $gte: startDate } } },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        new: { $sum: { $cond: [{ $eq: ['$status', 'new'] }, 1, 0] } },
        read: { $sum: { $cond: [{ $eq: ['$status', 'read'] }, 1, 0] } },
        replied: { $sum: { $cond: [{ $eq: ['$status', 'replied'] }, 1, 0] } },
        spam: { $sum: { $cond: ['$is_spam', 1, 0] } },
        avgResponseTime: { $avg: { $subtract: ['$replied_at', '$createdAt'] } }
      }
    }
  ]);
  
  return analytics[0] || {
    total: 0,
    new: 0,
    read: 0,
    replied: 0,
    spam: 0,
    avgResponseTime: 0
  };
};

// Instance method to mark as read
contactSchema.methods.markAsRead = function() {
  this.status = 'read';
  return this.save();
};

// Instance method to mark as replied
contactSchema.methods.markAsReplied = function(adminId) {
  this.status = 'replied';
  this.replied_by = adminId;
  this.replied_at = new Date();
  return this.save();
};

module.exports = mongoose.model('Contact', contactSchema);
