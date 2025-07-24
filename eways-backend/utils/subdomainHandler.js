/**
 * Subdomain Handler Utility
 * Handle dynamic subdomain routing for projects
 * 
 * @author Eways Team
 */

const Project = require('../models/Project');
const Analytics = require('../models/Analytics');

/**
 * Extract subdomain from hostname
 * @param {string} hostname - Request hostname
 * @returns {string|null} Subdomain or null
 */
const extractSubdomain = (hostname) => {
  if (!hostname) return null;
  
  // Remove port if present
  const cleanHostname = hostname.split(':')[0];
  
  // Split hostname into parts
  const parts = cleanHostname.split('.');
  
  // For development (localhost), return null
  if (cleanHostname === 'localhost' || cleanHostname === '127.0.0.1') {
    return null;
  }
  
  // For production domains like subdomain.eways.in
  if (parts.length >= 3) {
    const possibleSubdomain = parts[0];
    const domain = parts.slice(1).join('.');
    
    // Check if it's our main domain
    if (domain === 'eways.in' || domain === 'localhost') {
      // Exclude www and api subdomains
      if (possibleSubdomain !== 'www' && possibleSubdomain !== 'api') {
        return possibleSubdomain;
      }
    }
  }
  
  return null;
};

/**
 * Middleware to handle subdomain routing
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const subdomainHandler = async (req, res, next) => {
  try {
    const hostname = req.get('Host');
    const subdomain = extractSubdomain(hostname);
    
    // If no subdomain, continue with normal routing
    if (!subdomain) {
      return next();
    }
    
    // Check if subdomain matches a project
    const project = await Project.findOne({
      subdomain,
      status: 'active',
      visibility: { $in: ['public', 'featured'] }
    }).select('project_name subdomain live_url demo_url status analytics_data');
    
    if (!project) {
      // Subdomain not found, return 404
      return res.status(404).json({
        success: false,
        message: 'Project not found',
        subdomain
      });
    }
    
    // Add project info to request
    req.project = project;
    req.subdomain = subdomain;
    
    // For subdomain requests, handle differently based on the path
    if (req.path === '/' || req.path === '') {
      // Root subdomain request - redirect to project or return project info
      return handleSubdomainRoot(req, res, project);
    }
    
    // For API requests on subdomains, continue to API routes
    if (req.path.startsWith('/api/')) {
      return next();
    }
    
    // For other paths, handle as project resources
    return handleSubdomainResource(req, res, project);
    
  } catch (error) {
    console.error('Subdomain handler error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Handle root subdomain requests
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Object} project - Project object
 */
const handleSubdomainRoot = async (req, res, project) => {
  try {
    const clientIp = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('User-Agent');
    
    // Check if this is a unique view
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayHistory = project.analytics_data.view_history.find(
      h => h.date.getTime() === today.getTime()
    );
    
    const isUniqueView = !todayHistory || !todayHistory.unique_views;
    
    // Increment view count (async)
    project.incrementViews(isUniqueView).catch(err => {
      console.error('Failed to increment project views:', err.message);
    });
    
    // Update analytics (async)
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
    
    // If project has a live URL, redirect to it
    if (project.live_url) {
      return res.redirect(302, project.live_url);
    }
    
    // If project has a demo URL, redirect to it
    if (project.demo_url) {
      return res.redirect(302, project.demo_url);
    }
    
    // Otherwise, return project information as JSON
    const projectData = project.toObject();
    delete projectData.analytics_data.view_history; // Remove for privacy
    
    return res.status(200).json({
      success: true,
      message: `Welcome to ${project.project_name}`,
      data: projectData,
      meta: {
        subdomain: project.subdomain,
        type: 'project_subdomain',
        timestamp: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('Handle subdomain root error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to handle subdomain request'
    });
  }
};

/**
 * Handle subdomain resource requests
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Object} project - Project object
 */
const handleSubdomainResource = (req, res, project) => {
  // For non-root paths on subdomains, return project info with requested path
  return res.status(200).json({
    success: true,
    message: `Resource request for ${project.project_name}`,
    data: {
      project: {
        name: project.project_name,
        subdomain: project.subdomain,
        live_url: project.live_url,
        demo_url: project.demo_url
      },
      requestedPath: req.path,
      suggestion: project.live_url 
        ? `Visit the live project at: ${project.live_url}${req.path}`
        : `This is a subdomain for ${project.project_name}. Visit the main site for more information.`
    },
    meta: {
      subdomain: project.subdomain,
      type: 'project_resource',
      timestamp: new Date().toISOString()
    }
  });
};

/**
 * Validate subdomain format
 * @param {string} subdomain - Subdomain to validate
 * @returns {boolean} Validation result
 */
const validateSubdomain = (subdomain) => {
  if (!subdomain || typeof subdomain !== 'string') {
    return false;
  }
  
  // Check length
  if (subdomain.length < 3 || subdomain.length > 50) {
    return false;
  }
  
  // Check format: only lowercase letters, numbers, and hyphens
  const subdomainRegex = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/;
  
  if (!subdomainRegex.test(subdomain)) {
    return false;
  }
  
  // Check for reserved subdomains
  const reservedSubdomains = [
    'www', 'api', 'admin', 'mail', 'ftp', 'blog', 'shop', 
    'app', 'cdn', 'static', 'assets', 'img', 'images',
    'js', 'css', 'files', 'download', 'uploads', 'media'
  ];
  
  if (reservedSubdomains.includes(subdomain)) {
    return false;
  }
  
  return true;
};

/**
 * Generate unique subdomain suggestion
 * @param {string} baseName - Base name for subdomain
 * @returns {Promise<string>} Unique subdomain
 */
const generateUniqueSubdomain = async (baseName) => {
  // Clean and format base name
  let cleanName = baseName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  
  // Ensure minimum length
  if (cleanName.length < 3) {
    cleanName = `project-${cleanName}`;
  }
  
  // Ensure maximum length
  if (cleanName.length > 45) {
    cleanName = cleanName.substring(0, 45);
  }
  
  // Check if base name is available
  let subdomain = cleanName;
  let counter = 1;
  
  while (true) {
    const existing = await Project.findOne({ subdomain });
    
    if (!existing && validateSubdomain(subdomain)) {
      return subdomain;
    }
    
    // Try with counter
    subdomain = `${cleanName}-${counter}`;
    counter++;
    
    // Prevent infinite loop
    if (counter > 1000) {
      subdomain = `${cleanName}-${Date.now()}`;
      break;
    }
  }
  
  return subdomain;
};

/**
 * Get subdomain info for debugging
 * @param {Object} req - Express request object
 * @returns {Object} Subdomain info
 */
const getSubdomainInfo = (req) => {
  const hostname = req.get('Host');
  const subdomain = extractSubdomain(hostname);
  
  return {
    hostname,
    subdomain,
    isSubdomainRequest: !!subdomain,
    path: req.path,
    method: req.method,
    userAgent: req.get('User-Agent'),
    ip: req.ip
  };
};

/**
 * Middleware to add CORS headers for subdomain requests
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const subdomainCors = (req, res, next) => {
  const hostname = req.get('Host');
  const subdomain = extractSubdomain(hostname);
  
  if (subdomain) {
    // Add specific CORS headers for subdomain requests
    res.header('Access-Control-Allow-Origin', `https://${hostname}`);
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }
  }
  
  next();
};

module.exports = {
  subdomainHandler,
  extractSubdomain,
  validateSubdomain,
  generateUniqueSubdomain,
  getSubdomainInfo,
  subdomainCors
};
