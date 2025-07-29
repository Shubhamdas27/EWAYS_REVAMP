/**
 * Email Service Utility
 * Advanced email handling and template management
 * 
 * @author Eways Team
 */

const nodemailer = require('nodemailer');
const { emailTemplates } = require('../config/email');

/**
 * Enhanced email service class
 */
class EmailService {
  constructor() {
    this.transporter = null;
    this.isConfigured = false;
    this.initializeTransporter();
  }

  /**
   * Initialize email transporter
   */
  initializeTransporter() {
    try {
      const config = {
        service: process.env.EMAIL_SERVICE || 'gmail',
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.EMAIL_PORT) || 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
        tls: {
          rejectUnauthorized: false
        }
      };

      this.transporter = nodemailer.createTransporter(config);
      this.isConfigured = true;
      
      // Verify connection
      this.verifyConnection();
    } catch (error) {
      console.error('Failed to initialize email transporter:', error.message);
      this.isConfigured = false;
    }
  }

  /**
   * Verify email connection
   */
  async verifyConnection() {
    try {
      await this.transporter.verify();
      console.log('✅ Email service is ready');
    } catch (error) {
      console.error('❌ Email service verification failed:', error.message);
      this.isConfigured = false;
    }
  }

  /**
   * Send email with retry mechanism
   * @param {Object} emailOptions - Email options
   * @param {number} maxRetries - Maximum retry attempts
   * @returns {Promise} Send result
   */
  async sendEmail(emailOptions, maxRetries = 3) {
    if (!this.isConfigured) {
      throw new Error('Email service is not properly configured');
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: emailOptions.to,
      subject: emailOptions.subject,
      html: emailOptions.html,
      text: emailOptions.text,
      attachments: emailOptions.attachments,
      ...emailOptions
    };

    let lastError;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const result = await this.transporter.sendMail(mailOptions);
        
        console.log(`✅ Email sent successfully (attempt ${attempt}):`, result.messageId);
        
        return {
          success: true,
          messageId: result.messageId,
          response: result.response,
          attempt
        };
      } catch (error) {
        lastError = error;
        console.error(`❌ Email sending failed (attempt ${attempt}):`, error.message);
        
        if (attempt < maxRetries) {
          // Wait before retry (exponential backoff)
          const delay = Math.pow(2, attempt) * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    throw new Error(`Failed to send email after ${maxRetries} attempts: ${lastError.message}`);
  }

  /**
   * Send contact form notification
   * @param {Object} contactData - Contact form data
   * @returns {Promise} Send result
   */
  async sendContactNotification(contactData) {
    const template = emailTemplates.contactNotification(contactData);
    
    return await this.sendEmail({
      to: process.env.ADMIN_EMAIL,
      subject: template.subject,
      html: template.html,
      priority: 'high'
    });
  }

  /**
   * Send contact auto-reply
   * @param {Object} contactData - Contact form data
   * @returns {Promise} Send result
   */
  async sendContactAutoReply(contactData) {
    const template = emailTemplates.contactAutoReply(contactData);
    
    return await this.sendEmail({
      to: contactData.email,
      subject: template.subject,
      html: template.html
    });
  }

  /**
   * Send admin login notification
   * @param {Object} adminData - Admin login data
   * @returns {Promise} Send result
   */
  async sendLoginNotification(adminData) {
    const template = emailTemplates.adminLoginNotification(adminData);
    
    return await this.sendEmail({
      to: adminData.email,
      subject: template.subject,
      html: template.html
    });
  }

  /**
   * Send custom email with template
   * @param {string} templateName - Template name
   * @param {Object} data - Template data
   * @param {Object} options - Email options
   * @returns {Promise} Send result
   */
  async sendTemplateEmail(templateName, data, options) {
    if (!emailTemplates[templateName]) {
      throw new Error(`Email template '${templateName}' not found`);
    }

    const template = emailTemplates[templateName](data);
    
    return await this.sendEmail({
      to: options.to,
      subject: template.subject,
      html: template.html,
      ...options
    });
  }

  /**
   * Send bulk emails
   * @param {Array} emailList - List of email objects
   * @param {Object} options - Bulk email options
   * @returns {Promise} Bulk send results
   */
  async sendBulkEmails(emailList, options = {}) {
    const results = [];
    const { concurrency = 5, delay = 1000 } = options;

    // Process emails in batches to avoid overwhelming the SMTP server
    for (let i = 0; i < emailList.length; i += concurrency) {
      const batch = emailList.slice(i, i + concurrency);
      
      const batchPromises = batch.map(async (emailData, index) => {
        try {
          // Add delay between emails in the same batch
          if (index > 0) {
            await new Promise(resolve => setTimeout(resolve, delay));
          }
          
          const result = await this.sendEmail(emailData);
          return { success: true, email: emailData.to, result };
        } catch (error) {
          return { success: false, email: emailData.to, error: error.message };
        }
      });

      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);
      
      // Delay between batches
      if (i + concurrency < emailList.length) {
        await new Promise(resolve => setTimeout(resolve, delay * 2));
      }
    }

    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;

    console.log(`📧 Bulk email completed: ${successful} successful, ${failed} failed`);

    return {
      total: emailList.length,
      successful,
      failed,
      results
    };
  }

  /**
   * Create email template with dynamic content
   * @param {string} subject - Email subject
   * @param {string} content - HTML content
   * @param {Object} variables - Template variables
   * @returns {Object} Template object
   */
  createTemplate(subject, content, variables = {}) {
    // Replace template variables
    let processedSubject = subject;
    let processedContent = content;

    Object.keys(variables).forEach(key => {
      const placeholder = `{{${key}}}`;
      processedSubject = processedSubject.replace(new RegExp(placeholder, 'g'), variables[key]);
      processedContent = processedContent.replace(new RegExp(placeholder, 'g'), variables[key]);
    });

    return {
      subject: processedSubject,
      html: this.wrapInBaseTemplate(processedContent)
    };
  }

  /**
   * Wrap content in base email template
   * @param {string} content - Email content
   * @returns {string} Wrapped HTML
   */
  wrapInBaseTemplate(content) {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Eways</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .logo { color: #007bff; font-size: 24px; font-weight: bold; }
          .content { background: #f9f9f9; padding: 20px; border-radius: 5px; }
          .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }
          .btn { display: inline-block; padding: 12px 24px; background: #007bff; color: white; text-decoration: none; border-radius: 5px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">Eways</div>
          </div>
          <div class="content">
            ${content}
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Eways. All rights reserved.</p>
            <p>Visit us at <a href="${process.env.FRONTEND_URL}">eways.in</a></p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Validate email address
   * @param {string} email - Email address to validate
   * @returns {boolean} Validation result
   */
  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Get email service status
   * @returns {Object} Service status
   */
  getStatus() {
    return {
      configured: this.isConfigured,
      service: process.env.EMAIL_SERVICE,
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      user: process.env.EMAIL_USER ? '***configured***' : 'not configured',
      timestamp: new Date().toISOString()
    };
  }
}

// Create singleton instance
const emailService = new EmailService();

module.exports = emailService;
