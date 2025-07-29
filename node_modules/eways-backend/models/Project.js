/**
 * Project Model
 * MongoDB schema for project management
 * 
 * @author Eways Team
 */

const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  project_name: {
    type: String,
    required: [true, 'Project name is required'],
    trim: true,
    maxlength: [200, 'Project name cannot exceed 200 characters'],
    unique: true
  },
  subdomain: {
    type: String,
    required: [true, 'Subdomain is required'],
    trim: true,
    lowercase: true,
    unique: true,
    match: [
      /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/,
      'Subdomain must contain only lowercase letters, numbers, and hyphens'
    ],
    maxlength: [50, 'Subdomain cannot exceed 50 characters']
  },
  description: {
    type: String,
    required: [true, 'Project description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  short_description: {
    type: String,
    trim: true,
    maxlength: [200, 'Short description cannot exceed 200 characters']
  },
  tech_stack: [{
    type: String,
    trim: true,
    maxlength: [50, 'Technology name cannot exceed 50 characters']
  }],
  category: {
    type: String,
    enum: ['web-development', 'mobile-app', 'desktop-app', 'api', 'database', 'devops', 'other'],
    default: 'web-development'
  },
  github_url: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        return !v || /^https:\/\/github\.com\/[\w-]+\/[\w.-]+$/.test(v);
      },
      message: 'Please provide a valid GitHub URL'
    }
  },
  live_url: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        return !v || /^https?:\/\/.+/.test(v);
      },
      message: 'Please provide a valid URL'
    }
  },
  demo_url: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        return !v || /^https?:\/\/.+/.test(v);
      },
      message: 'Please provide a valid demo URL'
    }
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'maintenance', 'archived'],
    default: 'active'
  },
  visibility: {
    type: String,
    enum: ['public', 'private', 'featured'],
    default: 'public'
  },
  priority: {
    type: Number,
    min: 1,
    max: 10,
    default: 5
  },
  images: [{
    filename: String,
    originalName: String,
    path: String,
    size: Number,
    mimetype: String,
    caption: String,
    isMain: {
      type: Boolean,
      default: false
    }
  }],
  features: [{
    title: {
      type: String,
      required: true,
      maxlength: [100, 'Feature title cannot exceed 100 characters']
    },
    description: {
      type: String,
      maxlength: [500, 'Feature description cannot exceed 500 characters']
    },
    isCompleted: {
      type: Boolean,
      default: false
    }
  }],
  tags: [{
    type: String,
    trim: true,
    maxlength: [30, 'Tag cannot exceed 30 characters']
  }],
  client_info: {
    name: String,
    company: String,
    email: String,
    phone: String
  },
  project_timeline: {
    start_date: Date,
    end_date: Date,
    estimated_hours: Number,
    actual_hours: Number
  },
  admin_notes: {
    type: String,
    maxlength: [2000, 'Admin notes cannot exceed 2000 characters']
  },
  analytics_data: {
    total_views: {
      type: Number,
      default: 0
    },
    unique_views: {
      type: Number,
      default: 0
    },
    last_viewed: Date,
    view_history: [{
      date: Date,
      views: Number,
      unique_views: Number
    }]
  },
  seo_data: {
    meta_title: String,
    meta_description: String,
    keywords: [String],
    og_image: String
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  },
  updated_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance (only for non-unique fields)
projectSchema.index({ status: 1 });
projectSchema.index({ visibility: 1 });
projectSchema.index({ category: 1 });
projectSchema.index({ priority: -1 });
projectSchema.index({ 'analytics_data.total_views': -1 });
projectSchema.index({ createdAt: -1 });

// Virtual for project URL
projectSchema.virtual('project_url').get(function() {
  const baseUrl = process.env.FRONTEND_URL || 'https://eways.in';
  return `${baseUrl}/projects/${this.subdomain}`;
});

// Virtual for main image
projectSchema.virtual('main_image').get(function() {
  const mainImg = this.images.find(img => img.isMain);
  return mainImg || this.images[0] || null;
});

// Virtual for project duration
projectSchema.virtual('duration').get(function() {
  if (!this.project_timeline.start_date || !this.project_timeline.end_date) {
    return null;
  }
  
  const start = new Date(this.project_timeline.start_date);
  const end = new Date(this.project_timeline.end_date);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 30) return `${diffDays} days`;
  
  const months = Math.floor(diffDays / 30);
  const remainingDays = diffDays % 30;
  
  if (remainingDays === 0) return `${months} month${months > 1 ? 's' : ''}`;
  return `${months} month${months > 1 ? 's' : ''} ${remainingDays} day${remainingDays > 1 ? 's' : ''}`;
});

// Virtual for completion percentage
projectSchema.virtual('completion_percentage').get(function() {
  if (!this.features || this.features.length === 0) return 0;
  
  const completedFeatures = this.features.filter(feature => feature.isCompleted).length;
  return Math.round((completedFeatures / this.features.length) * 100);
});

// Pre-save middleware to ensure only one main image
projectSchema.pre('save', function(next) {
  if (this.images && this.images.length > 0) {
    const mainImages = this.images.filter(img => img.isMain);
    if (mainImages.length > 1) {
      // Keep only the first main image
      this.images.forEach((img, index) => {
        if (index > 0) img.isMain = false;
      });
    } else if (mainImages.length === 0) {
      // Set first image as main if no main image is set
      this.images[0].isMain = true;
    }
  }
  
  // Auto-generate meta title if not provided
  if (!this.seo_data.meta_title) {
    this.seo_data.meta_title = `${this.project_name} - Eways Project`;
  }
  
  // Auto-generate meta description if not provided
  if (!this.seo_data.meta_description && this.short_description) {
    this.seo_data.meta_description = this.short_description;
  }
  
  next();
});

// Static method to get active projects
projectSchema.statics.getActive = function() {
  return this.find({ status: 'active', visibility: { $in: ['public', 'featured'] } })
    .sort({ priority: -1, createdAt: -1 });
};

// Static method to get featured projects
projectSchema.statics.getFeatured = function() {
  return this.find({ status: 'active', visibility: 'featured' })
    .sort({ priority: -1, 'analytics_data.total_views': -1 });
};

// Static method to get projects by category
projectSchema.statics.getByCategory = function(category) {
  return this.find({ 
    category, 
    status: 'active', 
    visibility: { $in: ['public', 'featured'] } 
  }).sort({ priority: -1, createdAt: -1 });
};

// Static method to search projects
projectSchema.statics.search = function(query) {
  const searchRegex = new RegExp(query, 'i');
  return this.find({
    $and: [
      { status: 'active' },
      { visibility: { $in: ['public', 'featured'] } },
      {
        $or: [
          { project_name: searchRegex },
          { description: searchRegex },
          { tech_stack: { $in: [searchRegex] } },
          { tags: { $in: [searchRegex] } }
        ]
      }
    ]
  }).sort({ priority: -1, 'analytics_data.total_views': -1 });
};

// Instance method to increment view count
projectSchema.methods.incrementViews = function(isUnique = false) {
  this.analytics_data.total_views += 1;
  if (isUnique) {
    this.analytics_data.unique_views += 1;
  }
  this.analytics_data.last_viewed = new Date();
  
  // Update daily view history
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const todayHistory = this.analytics_data.view_history.find(
    h => h.date.getTime() === today.getTime()
  );
  
  if (todayHistory) {
    todayHistory.views += 1;
    if (isUnique) todayHistory.unique_views += 1;
  } else {
    this.analytics_data.view_history.push({
      date: today,
      views: 1,
      unique_views: isUnique ? 1 : 0
    });
  }
  
  // Keep only last 90 days of history
  this.analytics_data.view_history = this.analytics_data.view_history
    .sort((a, b) => b.date - a.date)
    .slice(0, 90);
  
  return this.save();
};

// Instance method to add feature
projectSchema.methods.addFeature = function(featureData) {
  this.features.push(featureData);
  return this.save();
};

// Instance method to update feature status
projectSchema.methods.updateFeatureStatus = function(featureId, isCompleted) {
  const feature = this.features.id(featureId);
  if (feature) {
    feature.isCompleted = isCompleted;
    return this.save();
  }
  throw new Error('Feature not found');
};

module.exports = mongoose.model('Project', projectSchema);
