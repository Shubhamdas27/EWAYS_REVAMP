/**
 * Admin Model
 * MongoDB schema for admin user management
 * 
 * @author Eways Team
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters long'],
    maxlength: [50, 'Username cannot exceed 50 characters'],
    match: [
      /^[a-zA-Z0-9_-]+$/,
      'Username can only contain letters, numbers, underscores, and hyphens'
    ]
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email address'
    ]
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
    select: false // Don't include password in queries by default
  },
  firstName: {
    type: String,
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  role: {
    type: String,
    enum: ['super_admin', 'admin', 'moderator', 'viewer'],
    default: 'admin'
  },
  permissions: {
    can_create_projects: {
      type: Boolean,
      default: true
    },
    can_edit_projects: {
      type: Boolean,
      default: true
    },
    can_delete_projects: {
      type: Boolean,
      default: false
    },
    can_manage_contacts: {
      type: Boolean,
      default: true
    },
    can_view_analytics: {
      type: Boolean,
      default: true
    },
    can_manage_users: {
      type: Boolean,
      default: false
    },
    can_backup_data: {
      type: Boolean,
      default: false
    },
    can_access_logs: {
      type: Boolean,
      default: false
    }
  },
  profile: {
    avatar: String,
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot exceed 500 characters']
    },
    phone: String,
    timezone: {
      type: String,
      default: 'UTC'
    },
    preferences: {
      email_notifications: {
        type: Boolean,
        default: true
      },
      dashboard_layout: {
        type: String,
        enum: ['grid', 'list'],
        default: 'grid'
      },
      theme: {
        type: String,
        enum: ['light', 'dark', 'auto'],
        default: 'light'
      }
    }
  },
  security: {
    last_login: Date,
    last_login_ip: String,
    failed_login_attempts: {
      type: Number,
      default: 0
    },
    account_locked_until: Date,
    password_changed_at: Date,
    two_factor_enabled: {
      type: Boolean,
      default: false
    },
    two_factor_secret: String,
    recovery_codes: [String]
  },
  session: {
    refresh_tokens: [{
      token: String,
      created_at: Date,
      expires_at: Date,
      user_agent: String,
      ip_address: String
    }],
    active_sessions: {
      type: Number,
      default: 0
    }
  },
  activity_log: [{
    action: String,
    resource: String,
    resource_id: String,
    ip_address: String,
    user_agent: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  }
}, {
  timestamps: true,
  toJSON: { 
    virtuals: true,
    transform: function(doc, ret) {
      delete ret.password;
      delete ret.security.two_factor_secret;
      delete ret.security.recovery_codes;
      delete ret.session.refresh_tokens;
      return ret;
    }
  },
  toObject: { virtuals: true }
});

// Indexes for better query performance (only for non-unique fields)
adminSchema.index({ role: 1 });
adminSchema.index({ status: 1 });
adminSchema.index({ 'security.last_login': -1 });

// Virtual for full name
adminSchema.virtual('fullName').get(function() {
  if (this.firstName && this.lastName) {
    return `${this.firstName} ${this.lastName}`;
  }
  return this.firstName || this.lastName || this.username;
});

// Virtual for account age
adminSchema.virtual('accountAge').get(function() {
  const now = new Date();
  const created = new Date(this.createdAt);
  const diffTime = Math.abs(now - created);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 30) return `${diffDays} days`;
  
  const months = Math.floor(diffDays / 30);
  const years = Math.floor(months / 12);
  
  if (years > 0) {
    const remainingMonths = months % 12;
    return remainingMonths > 0 ? `${years}y ${remainingMonths}m` : `${years} year${years > 1 ? 's' : ''}`;
  }
  
  return `${months} month${months > 1 ? 's' : ''}`;
});

// Virtual for last login time ago
adminSchema.virtual('lastLoginAgo').get(function() {
  if (!this.security.last_login) return 'Never';
  
  const now = new Date();
  const lastLogin = new Date(this.security.last_login);
  const diffTime = Math.abs(now - lastLogin);
  const diffMinutes = Math.floor(diffTime / (1000 * 60));
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffMinutes > 0) return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
  return 'Just now';
});

// Pre-save middleware to hash password
adminSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();
  
  try {
    // Hash password with cost of 12
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12;
    this.password = await bcrypt.hash(this.password, saltRounds);
    this.security.password_changed_at = new Date();
    next();
  } catch (error) {
    next(error);
  }
});

// Pre-save middleware to set permissions based on role
adminSchema.pre('save', function(next) {
  if (!this.isModified('role')) return next();
  
  // Set default permissions based on role
  switch (this.role) {
    case 'super_admin':
      this.permissions = {
        can_create_projects: true,
        can_edit_projects: true,
        can_delete_projects: true,
        can_manage_contacts: true,
        can_view_analytics: true,
        can_manage_users: true,
        can_backup_data: true,
        can_access_logs: true
      };
      break;
    case 'admin':
      this.permissions = {
        can_create_projects: true,
        can_edit_projects: true,
        can_delete_projects: true,
        can_manage_contacts: true,
        can_view_analytics: true,
        can_manage_users: false,
        can_backup_data: false,
        can_access_logs: false
      };
      break;
    case 'moderator':
      this.permissions = {
        can_create_projects: true,
        can_edit_projects: true,
        can_delete_projects: false,
        can_manage_contacts: true,
        can_view_analytics: true,
        can_manage_users: false,
        can_backup_data: false,
        can_access_logs: false
      };
      break;
    case 'viewer':
      this.permissions = {
        can_create_projects: false,
        can_edit_projects: false,
        can_delete_projects: false,
        can_manage_contacts: false,
        can_view_analytics: true,
        can_manage_users: false,
        can_backup_data: false,
        can_access_logs: false
      };
      break;
  }
  
  next();
});

// Instance method to compare password
adminSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Instance method to generate JWT token
adminSchema.methods.getSignedJwtToken = function() {
  return jwt.sign(
    { 
      id: this._id,
      username: this.username,
      email: this.email,
      role: this.role
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

// Instance method to generate refresh token
adminSchema.methods.generateRefreshToken = function(userAgent, ipAddress) {
  const refreshToken = jwt.sign(
    { id: this._id, type: 'refresh' },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
  
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);
  
  this.session.refresh_tokens.push({
    token: refreshToken,
    created_at: new Date(),
    expires_at: expiresAt,
    user_agent: userAgent,
    ip_address: ipAddress
  });
  
  // Keep only last 5 refresh tokens
  this.session.refresh_tokens = this.session.refresh_tokens
    .sort((a, b) => b.created_at - a.created_at)
    .slice(0, 5);
  
  return refreshToken;
};

// Instance method to revoke refresh token
adminSchema.methods.revokeRefreshToken = function(token) {
  this.session.refresh_tokens = this.session.refresh_tokens.filter(
    t => t.token !== token
  );
  return this.save();
};

// Instance method to log activity
adminSchema.methods.logActivity = function(action, resource, resourceId, ipAddress, userAgent) {
  this.activity_log.unshift({
    action,
    resource,
    resource_id: resourceId,
    ip_address: ipAddress,
    user_agent: userAgent,
    timestamp: new Date()
  });
  
  // Keep only last 100 activity logs
  this.activity_log = this.activity_log.slice(0, 100);
  
  return this.save();
};

// Instance method to update last login
adminSchema.methods.updateLastLogin = function(ipAddress) {
  this.security.last_login = new Date();
  this.security.last_login_ip = ipAddress;
  this.security.failed_login_attempts = 0;
  this.security.account_locked_until = undefined;
  return this.save();
};

// Instance method to increment failed login attempts
adminSchema.methods.incrementFailedLoginAttempts = function() {
  this.security.failed_login_attempts += 1;
  
  // Lock account after 5 failed attempts for 30 minutes
  if (this.security.failed_login_attempts >= 5) {
    const lockUntil = new Date();
    lockUntil.setMinutes(lockUntil.getMinutes() + 30);
    this.security.account_locked_until = lockUntil;
  }
  
  return this.save();
};

// Instance method to check if account is locked
adminSchema.methods.isAccountLocked = function() {
  return this.security.account_locked_until && 
         this.security.account_locked_until > new Date();
};

// Static method to create default admin
adminSchema.statics.createDefaultAdmin = async function() {
  const existingAdmin = await this.findOne({ role: 'super_admin' });
  if (existingAdmin) return existingAdmin;
  
  const defaultAdmin = new this({
    username: 'admin',
    email: process.env.ADMIN_EMAIL || 'admin@eways.in',
    password: process.env.DEFAULT_ADMIN_PASSWORD || 'admin123',
    firstName: 'Super',
    lastName: 'Admin',
    role: 'super_admin'
  });
  
  return await defaultAdmin.save();
};

// Static method to get admin statistics
adminSchema.statics.getStats = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        active: { $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] } },
        super_admins: { $sum: { $cond: [{ $eq: ['$role', 'super_admin'] }, 1, 0] } },
        admins: { $sum: { $cond: [{ $eq: ['$role', 'admin'] }, 1, 0] } },
        moderators: { $sum: { $cond: [{ $eq: ['$role', 'moderator'] }, 1, 0] } },
        viewers: { $sum: { $cond: [{ $eq: ['$role', 'viewer'] }, 1, 0] } }
      }
    }
  ]);
  
  return stats[0] || {
    total: 0,
    active: 0,
    super_admins: 0,
    admins: 0,
    moderators: 0,
    viewers: 0
  };
};

module.exports = mongoose.model('Admin', adminSchema);
