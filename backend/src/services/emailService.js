/**
 * Email Service
 * 
 * Handles sending emails using SMTP configuration
 * Supports both customer and admin notifications
 */

const nodemailer = require('nodemailer');
const { 
  getCustomerOrderConfirmationTemplate, 
  getAdminOrderNotificationTemplate,
  getCustomerCancellationTemplate,
  getAdminCancellationTemplate
} = require('../templates/emailTemplates');
const whatsappService = require('./whatsappService');

class EmailService {
  constructor() {
    this.transporter = null;
    this.isConfigured = false;
    this.initializeTransporter();
  }

  /**
   * Initialize SMTP transporter
   * Uses environment variables for configuration
   */
  initializeTransporter() {
    try {
      // SMTP configuration from environment variables
      const smtpConfig = {
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
        auth: {
          user: process.env.SMTP_USER || '',
          pass: process.env.SMTP_PASS || ''
        },
        tls: {
          rejectUnauthorized: false
        }
      };

      // Only create transporter if credentials are provided
      if (smtpConfig.auth.user && smtpConfig.auth.pass) {
        this.transporter = nodemailer.createTransport(smtpConfig);
        this.isConfigured = true;
      } else {
        this.isConfigured = false;
      }
    } catch (error) {
      console.error('Failed to initialize email service:', error);
      this.isConfigured = false;
    }
  }

  /**
   * Test email configuration
   */
  async testConnection() {
    if (!this.isConfigured) {
      throw new Error('Email service not configured');
    }

    try {
      await this.transporter.verify();
      return true;
    } catch (error) {
      console.error('SMTP connection failed:', error);
      throw error;
    }
  }

  /**
   * Send customer order confirmation email
   */
  async sendCustomerOrderConfirmation(orderData) {
    if (!this.isConfigured) {
      return { success: false, message: 'Email service not configured' };
    }

    try {
      const {
        customerName,
        customerEmail,
        orderId,
        orderDate,
        serviceDate,
        serviceTime,
        totalAmount,
        services,
        address,
        specialInstructions
      } = orderData;

      const mailOptions = {
        from: {
          name: 'Deep Clean Hub',
          address: process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER
        },
        to: customerEmail,
        subject: `Order Confirmation #${orderId} - Deep Clean Hub`,
        html: getCustomerOrderConfirmationTemplate(orderData),
        text: this.generateTextVersion(orderData, 'customer')
      };

      const result = await this.transporter.sendMail(mailOptions);
      
      return {
        success: true,
        messageId: result.messageId,
        message: 'Customer email sent successfully'
      };
    } catch (error) {
      console.error('Failed to send customer email:', error);
      throw error;
    }
  }

  /**
   * Send admin order notification email
   */
  async sendAdminOrderNotification(orderData) {
    if (!this.isConfigured) {
      return { success: false, message: 'Email service not configured' };
    }

    try {
      const {
        customerName,
        customerEmail,
        customerPhone = 'Not provided',
        orderId,
        orderDate,
        serviceDate,
        serviceTime,
        totalAmount,
        services,
        address,
        specialInstructions
      } = orderData;

      const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER;

      const mailOptions = {
        from: {
          name: 'Deep Clean Hub System',
          address: process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER
        },
        to: adminEmail,
        subject: `🚨 New Order Alert #${orderId} - ${customerName}`,
        html: getAdminOrderNotificationTemplate(orderData),
        text: this.generateTextVersion(orderData, 'admin')
      };

      const result = await this.transporter.sendMail(mailOptions);
      
      return {
        success: true,
        messageId: result.messageId,
        message: 'Admin email sent successfully'
      };
    } catch (error) {
      console.error('Failed to send admin email:', error);
      throw error;
    }
  }

  /**
   * Send both customer and admin emails
   */
  async sendOrderConfirmationEmails(orderData) {
    const results = {
      customer: { success: false, message: '' },
      admin: { success: false, message: '' },
      whatsapp: { success: false, message: '' }
    };

    try {
      // Send customer email
      try {
        results.customer = await this.sendCustomerOrderConfirmation(orderData);
      } catch (error) {
        results.customer = { success: false, message: error.message };
      }

      // Send admin email
      try {
        results.admin = await this.sendAdminOrderNotification(orderData);
      } catch (error) {
        results.admin = { success: false, message: error.message };
      }

      // Send WhatsApp notification to admin
      try {
        results.whatsapp = await whatsappService.sendOrderConfirmationWhatsApp(orderData);
      } catch (error) {
        results.whatsapp = { success: false, message: error.message };
      }

      return results;
    } catch (error) {
      console.error('Failed to send order confirmation notifications:', error);
      // Return results instead of throwing to prevent 500 errors
      return results;
    }
  }

  /**
   * Generate plain text version of email
   */
  generateTextVersion(orderData, type) {
    const {
      customerName,
      customerEmail,
      orderId,
      orderDate,
      serviceDate,
      serviceTime,
      totalAmount,
      services,
      address,
      specialInstructions
    } = orderData;

    if (type === 'customer') {
      return `
Deep Clean Hub - Order Confirmation

Dear ${customerName},

Thank you for choosing Deep Clean Hub! Your order has been confirmed.

ORDER DETAILS:
- Order ID: #${orderId}
- Order Date: ${orderDate}
- Service Date: ${serviceDate}
- Service Time: ${serviceTime}
- Total Amount: €${totalAmount.toFixed(2)}

SERVICES:
${services.map(service => `- ${service.name}: ${service.price}`).join('\n')}

SERVICE ADDRESS:
${address.street_address}
${address.city}, ${address.postal_code}
${address.country}

${specialInstructions ? `SPECIAL INSTRUCTIONS:\n${specialInstructions}\n` : ''}

WHAT HAPPENS NEXT:
- Our team will contact you within 24 hours
- You'll receive a reminder 24 hours before service
- Our cleaners will arrive at the scheduled time
- Payment will be collected after service completion

Need help? Contact us:
- Phone: +49-16097044182
- Email: info@deepcleaninghub.com
- WhatsApp: https://wa.me/4916097044182

Thank you for choosing Deep Clean Hub!
      `;
    } else {
      return `
NEW ORDER ALERT - Deep Clean Hub Admin

A new order has been placed and requires immediate attention!

ORDER INFORMATION:
- Order ID: #${orderId}
- Order Date: ${orderDate}
- Service Date: ${serviceDate}
- Service Time: ${serviceTime}
- Total Amount: €${totalAmount.toFixed(2)}

CUSTOMER INFORMATION:
- Name: ${customerName}
- Email: ${customerEmail}
- Phone: ${customerPhone}

SERVICES REQUESTED:
${services.map(service => `- ${service.name}: ${service.price}`).join('\n')}

SERVICE ADDRESS:
${address.street_address}
${address.city}, ${address.postal_code}
${address.country}

${specialInstructions ? `SPECIAL INSTRUCTIONS:\n${specialInstructions}\n` : ''}

Please respond to this order within 2 hours.

Admin Dashboard
      `;
    }
  }

  /**
   * Send customer cancellation email
   */
  async sendCustomerCancellationEmail(orderData) {
    if (!this.isConfigured) {
      return { success: false, message: 'Email service not configured' };
    }

    try {
      const {
        customerName,
        customerEmail,
        orderId,
        orderDate,
        serviceDate,
        serviceTime,
        totalAmount,
        services,
        address,
        cancellationReason,
        cancelledBy
      } = orderData;

      const mailOptions = {
        from: {
          name: 'Deep Clean Hub',
          address: process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER
        },
        to: customerEmail,
        subject: `Order Cancellation #${orderId} - Deep Clean Hub`,
        html: getCustomerCancellationTemplate(orderData),
        text: this.generateCancellationTextVersion(orderData, 'customer')
      };

      const result = await this.transporter.sendMail(mailOptions);
      
      return {
        success: true,
        messageId: result.messageId,
        message: 'Customer cancellation email sent successfully'
      };
    } catch (error) {
      console.error('Failed to send customer cancellation email:', error);
      throw error;
    }
  }

  /**
   * Send admin cancellation notification email
   */
  async sendAdminCancellationNotification(orderData) {
    if (!this.isConfigured) {
      return { success: false, message: 'Email service not configured' };
    }

    try {
      const {
        customerName,
        customerEmail,
        customerPhone = 'Not provided',
        orderId,
        orderDate,
        serviceDate,
        serviceTime,
        totalAmount,
        services,
        address,
        cancellationReason,
        cancelledBy
      } = orderData;

      const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER;

      const mailOptions = {
        from: {
          name: 'Deep Clean Hub System',
          address: process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER
        },
        to: adminEmail,
        subject: `❌ Order Cancelled #${orderId} - ${customerName}`,
        html: getAdminCancellationTemplate(orderData),
        text: this.generateCancellationTextVersion(orderData, 'admin')
      };

      const result = await this.transporter.sendMail(mailOptions);
      
      return {
        success: true,
        messageId: result.messageId,
        message: 'Admin cancellation email sent successfully'
      };
    } catch (error) {
      console.error('Failed to send admin cancellation email:', error);
      throw error;
    }
  }

  /**
   * Send both customer and admin cancellation emails
   */
  async sendCancellationEmails(orderData) {
    const results = {
      customer: { success: false, message: '' },
      admin: { success: false, message: '' },
      whatsapp: { success: false, message: '' }
    };

    try {
      // Send customer email
      try {
        results.customer = await this.sendCustomerCancellationEmail(orderData);
      } catch (error) {
        results.customer = { success: false, message: error.message };
      }

      // Send admin email
      try {
        results.admin = await this.sendAdminCancellationNotification(orderData);
      } catch (error) {
        results.admin = { success: false, message: error.message };
      }

      // Send WhatsApp notification to admin
      try {
        results.whatsapp = await whatsappService.sendCancellationWhatsApp(orderData);
      } catch (error) {
        results.whatsapp = { success: false, message: error.message };
      }

      return results;
    } catch (error) {
      console.error('Failed to send cancellation notifications:', error);
      // Return results instead of throwing to prevent 500 errors
      return results;
    }
  }

  /**
   * Generate plain text version of cancellation email
   */
  generateCancellationTextVersion(orderData, type) {
    const {
      customerName,
      customerEmail,
      customerPhone = 'Not provided',
      orderId,
      orderDate,
      serviceDate,
      serviceTime,
      totalAmount,
      services,
      address,
      cancellationReason,
      cancelledBy
    } = orderData;

    if (type === 'customer') {
      return `
Deep Clean Hub - Order Cancellation

Dear ${customerName},

We're sorry to inform you that your cleaning service order has been cancelled.

CANCELLED ORDER DETAILS:
- Order ID: #${orderId}
- Order Date: ${orderDate}
- Service Date: ${serviceDate}
- Service Time: ${serviceTime}
- Total Amount: €${totalAmount.toFixed(2)}
- Status: Cancelled
- Cancelled By: ${cancelledBy || 'Customer'}

SERVICES THAT WERE BOOKED:
${services.map(service => `- ${service.name}: ${service.price}`).join('\n')}

SERVICE ADDRESS:
${address.street_address}
${address.city}, ${address.postal_code}
${address.country}

${cancellationReason ? `CANCELLATION REASON:\n${cancellationReason}\n` : ''}

WHAT HAPPENS NEXT:
- No charges will be applied to your account
- If you paid in advance, a full refund will be processed within 3-5 business days
- You can book a new service anytime through our website or app
- If you have any questions, please contact our support team

Need help? Contact us:
- Phone: +49-16097044182
- Email: info@deepcleaninghub.com
- WhatsApp: https://wa.me/4916097044182

We apologize for any inconvenience caused.

Thank you for choosing Deep Clean Hub!
      `;
    } else {
      return `
ORDER CANCELLATION ALERT - Deep Clean Hub Admin

An order has been cancelled and requires your attention!

CANCELLED ORDER INFORMATION:
- Order ID: #${orderId}
- Order Date: ${orderDate}
- Service Date: ${serviceDate}
- Service Time: ${serviceTime}
- Total Amount: €${totalAmount.toFixed(2)}
- Status: Cancelled
- Cancelled By: ${cancelledBy || 'Customer'}

CUSTOMER INFORMATION:
- Name: ${customerName}
- Email: ${customerEmail}
- Phone: ${customerPhone}

SERVICES THAT WERE BOOKED:
${services.map(service => `- ${service.name}: ${service.price}`).join('\n')}

SERVICE ADDRESS:
${address.street_address}
${address.city}, ${address.postal_code}
${address.country}

${cancellationReason ? `CANCELLATION REASON:\n${cancellationReason}\n` : ''}

Please review the cancellation and take appropriate action if needed.

Admin Dashboard
      `;
    }
  }

  /**
   * Get email service status
   */
  getStatus() {
    return {
      configured: this.isConfigured,
      transporter: this.transporter ? 'initialized' : 'not initialized'
    };
  }
}

// Create singleton instance
const emailService = new EmailService();

module.exports = emailService;
