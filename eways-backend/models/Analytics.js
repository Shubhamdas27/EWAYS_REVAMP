/**
 * Analytics Model
 * MongoDB schema for analytics and tracking data
 * 
 * @author Eways Team
 */

const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: ['daily', 'weekly', 'monthly'],
    default: 'daily',
    index: true
  },
  
  // Page analytics
  page_views: {
    total: { type: Number, default: 0 },
    unique: { type: Number, default: 0 },
    pages: [{
      path: String,
      views: Number,
      unique_views: Number,
      avg_time_on_page: Number, // in seconds
      bounce_rate: Number // percentage
    }]
  },
  
  // Contact form analytics
  contact_submissions: {
    total: { type: Number, default: 0 },
    successful: { type: Number, default: 0 },
    spam_filtered: { type: Number, default: 0 },
    response_rate: { type: Number, default: 0 }, // percentage
    avg_response_time: { type: Number, default: 0 }, // in hours
    by_subject: [{
      subject: String,
      count: Number
    }]
  },
  
  // Project analytics
  project_visits: {
    total: { type: Number, default: 0 },
    unique: { type: Number, default: 0 },
    by_project: [{
      project_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
      },
      project_name: String,
      subdomain: String,
      views: Number,
      unique_views: Number,
      avg_time_spent: Number
    }]
  },
  
  // User demographics
  user_demographics: {
    countries: [{
      code: String, // ISO country code
      name: String,
      count: Number,
      percentage: Number
    }],
    devices: {
      desktop: { type: Number, default: 0 },
      mobile: { type: Number, default: 0 },
      tablet: { type: Number, default: 0 }
    },
    browsers: [{
      name: String,
      version: String,
      count: Number,
      percentage: Number
    }],
    operating_systems: [{
      name: String,
      version: String,
      count: Number,
      percentage: Number
    }]
  },
  
  // Traffic sources
  traffic_sources: {
    direct: { type: Number, default: 0 },
    search_engines: {
      total: { type: Number, default: 0 },
      engines: [{
        name: String, // google, bing, yahoo, etc.
        count: Number,
        percentage: Number
      }]
    },
    social_media: {
      total: { type: Number, default: 0 },
      platforms: [{
        name: String, // facebook, twitter, linkedin, etc.
        count: Number,
        percentage: Number
      }]
    },
    referrals: {
      total: { type: Number, default: 0 },
      sites: [{
        domain: String,
        count: Number,
        percentage: Number
      }]
    },
    campaigns: [{
      name: String,
      source: String,
      medium: String,
      visits: Number,
      conversions: Number
    }]
  },
  
  // Performance metrics
  performance: {
    avg_page_load_time: Number, // in milliseconds
    avg_server_response_time: Number, // in milliseconds
    error_rate: Number, // percentage
    uptime_percentage: Number,
    total_errors: Number,
    error_types: [{
      type: String, // 404, 500, etc.
      count: Number
    }]
  },
  
  // API usage analytics
  api_usage: {
    total_requests: { type: Number, default: 0 },
    successful_requests: { type: Number, default: 0 },
    failed_requests: { type: Number, default: 0 },
    endpoints: [{
      path: String,
      method: String,
      requests: Number,
      avg_response_time: Number,
      error_rate: Number
    }],
    rate_limited_requests: { type: Number, default: 0 }
  },
  
  // Search analytics
  search_data: {
    total_searches: { type: Number, default: 0 },
    unique_searches: { type: Number, default: 0 },
    top_keywords: [{
      keyword: String,
      count: Number,
      result_clicks: Number
    }],
    no_results_searches: [{
      keyword: String,
      count: Number
    }]
  },
  
  // Business metrics
  business_metrics: {
    leads_generated: { type: Number, default: 0 },
    conversion_rate: { type: Number, default: 0 }, // percentage
    avg_session_duration: Number, // in minutes
    pages_per_session: Number,
    new_vs_returning: {
      new_visitors: { type: Number, default: 0 },
      returning_visitors: { type: Number, default: 0 }
    }
  },
  
  // Custom events
  custom_events: [{
    event_name: String,
    event_category: String,
    count: Number,
    unique_count: Number,
    value: Number // optional numeric value
  }],
  
  // Data quality indicators
  data_quality: {
    total_sessions: Number,
    valid_sessions: Number,
    bot_traffic_filtered: Number,
    data_completeness: Number // percentage
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Compound indexes for better query performance
analyticsSchema.index({ date: -1, type: 1 });
analyticsSchema.index({ type: 1, date: -1 });
analyticsSchema.index({ 'project_visits.by_project.project_id': 1 });

// Virtual for formatted date
analyticsSchema.virtual('formatted_date').get(function() {
  return this.date.toISOString().split('T')[0];
});

// Virtual for total visitors
analyticsSchema.virtual('total_visitors').get(function() {
  return this.page_views.unique || 0;
});

// Virtual for bounce rate
analyticsSchema.virtual('overall_bounce_rate').get(function() {
  if (!this.page_views.pages || this.page_views.pages.length === 0) return 0;
  
  const totalBounceRate = this.page_views.pages.reduce((sum, page) => {
    return sum + (page.bounce_rate || 0);
  }, 0);
  
  return Math.round(totalBounceRate / this.page_views.pages.length);
});

// Virtual for conversion rate
analyticsSchema.virtual('contact_conversion_rate').get(function() {
  if (this.page_views.unique === 0) return 0;
  return Math.round((this.contact_submissions.total / this.page_views.unique) * 100);
});

// Static method to get analytics for date range
analyticsSchema.statics.getForDateRange = function(startDate, endDate, type = 'daily') {
  return this.find({
    date: { $gte: startDate, $lte: endDate },
    type: type
  }).sort({ date: -1 });
};

// Static method to get summary analytics
analyticsSchema.statics.getSummary = async function(days = 30) {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  const analytics = await this.aggregate([
    {
      $match: {
        date: { $gte: startDate, $lte: endDate },
        type: 'daily'
      }
    },
    {
      $group: {
        _id: null,
        total_page_views: { $sum: '$page_views.total' },
        unique_page_views: { $sum: '$page_views.unique' },
        total_contact_submissions: { $sum: '$contact_submissions.total' },
        total_project_visits: { $sum: '$project_visits.total' },
        avg_response_time: { $avg: '$contact_submissions.avg_response_time' },
        total_api_requests: { $sum: '$api_usage.total_requests' },
        avg_session_duration: { $avg: '$business_metrics.avg_session_duration' }
      }
    }
  ]);
  
  return analytics[0] || {};
};

// Static method to get top performing content
analyticsSchema.statics.getTopContent = async function(days = 7, limit = 10) {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  const result = await this.aggregate([
    {
      $match: {
        date: { $gte: startDate, $lte: endDate },
        type: 'daily'
      }
    },
    { $unwind: '$page_views.pages' },
    {
      $group: {
        _id: '$page_views.pages.path',
        total_views: { $sum: '$page_views.pages.views' },
        unique_views: { $sum: '$page_views.pages.unique_views' },
        avg_time_on_page: { $avg: '$page_views.pages.avg_time_on_page' },
        avg_bounce_rate: { $avg: '$page_views.pages.bounce_rate' }
      }
    },
    { $sort: { total_views: -1 } },
    { $limit: limit }
  ]);
  
  return result;
};

// Static method to create or update daily analytics
analyticsSchema.statics.updateDailyAnalytics = async function(date, updateData) {
  const dateObj = new Date(date);
  dateObj.setHours(0, 0, 0, 0);
  
  return await this.findOneAndUpdate(
    { date: dateObj, type: 'daily' },
    { $set: updateData },
    { 
      upsert: true, 
      new: true,
      setDefaultsOnInsert: true 
    }
  );
};

// Instance method to add page view
analyticsSchema.methods.addPageView = function(path, isUnique = false, timeOnPage = 0) {
  this.page_views.total += 1;
  if (isUnique) this.page_views.unique += 1;
  
  // Find or create page entry
  let pageEntry = this.page_views.pages.find(p => p.path === path);
  if (!pageEntry) {
    pageEntry = { path, views: 0, unique_views: 0, avg_time_on_page: 0, bounce_rate: 0 };
    this.page_views.pages.push(pageEntry);
  }
  
  pageEntry.views += 1;
  if (isUnique) pageEntry.unique_views += 1;
  
  // Update average time on page
  if (timeOnPage > 0) {
    pageEntry.avg_time_on_page = (pageEntry.avg_time_on_page + timeOnPage) / 2;
  }
  
  return this.save();
};

// Instance method to add contact submission
analyticsSchema.methods.addContactSubmission = function(isSuccessful = true, isSpam = false) {
  this.contact_submissions.total += 1;
  if (isSuccessful) this.contact_submissions.successful += 1;
  if (isSpam) this.contact_submissions.spam_filtered += 1;
  
  return this.save();
};

// Instance method to add project visit
analyticsSchema.methods.addProjectVisit = function(projectData, isUnique = false, timeSpent = 0) {
  this.project_visits.total += 1;
  if (isUnique) this.project_visits.unique += 1;
  
  // Find or create project entry
  let projectEntry = this.project_visits.by_project.find(
    p => p.project_id.toString() === projectData.project_id.toString()
  );
  
  if (!projectEntry) {
    projectEntry = {
      project_id: projectData.project_id,
      project_name: projectData.project_name,
      subdomain: projectData.subdomain,
      views: 0,
      unique_views: 0,
      avg_time_spent: 0
    };
    this.project_visits.by_project.push(projectEntry);
  }
  
  projectEntry.views += 1;
  if (isUnique) projectEntry.unique_views += 1;
  
  if (timeSpent > 0) {
    projectEntry.avg_time_spent = (projectEntry.avg_time_spent + timeSpent) / 2;
  }
  
  return this.save();
};

// Instance method to add custom event
analyticsSchema.methods.addCustomEvent = function(eventName, category, value = null) {
  let eventEntry = this.custom_events.find(
    e => e.event_name === eventName && e.event_category === category
  );
  
  if (!eventEntry) {
    eventEntry = {
      event_name: eventName,
      event_category: category,
      count: 0,
      unique_count: 0,
      value: 0
    };
    this.custom_events.push(eventEntry);
  }
  
  eventEntry.count += 1;
  if (value !== null) {
    eventEntry.value = (eventEntry.value + value) / 2;
  }
  
  return this.save();
};

module.exports = mongoose.model('Analytics', analyticsSchema);
