/**
 * Email Routes
 * 
 * Handles email sending endpoints for order confirmations
 */

const express = require('express');
const { body, validationResult } = require('express-validator');
const emailService = require('../services/emailService');

const router = express.Router();

// @desc    Send order confirmation emails
// @route   POST /api/email/send-order-confirmation
// @access  Public (in production, should be protected)
router.post('/send-order-confirmation', [
  body('customerName').notEmpty().withMessage('Customer name is required'),
  body('customerEmail').isEmail().withMessage('Valid email is required'),
  body('customerPhone').notEmpty().withMessage('Phone number is required'),
  body('orderId').notEmpty().withMessage('Order ID is required'),
  body('orderDate').notEmpty().withMessage('Order date is required'),
  body('serviceDate').notEmpty().withMessage('Service date is required'),
  body('serviceTime').notEmpty().withMessage('Service time is required'),
  body('totalAmount').isNumeric().withMessage('Total amount must be a number'),
  body('services').isArray().withMessage('Services must be an array'),
  body('services.*.name').notEmpty().withMessage('Service name is required'),
  body('services.*.price').notEmpty().withMessage('Service price is required'),
  body('address').isObject().withMessage('Address must be an object'),
  body('address.street_address').notEmpty().withMessage('Street address is required'),
  body('address.city').notEmpty().withMessage('City is required'),
  body('address.postal_code').notEmpty().withMessage('Postal code is required'),
  body('address.country').notEmpty().withMessage('Country is required'),
  body('specialInstructions').optional().isString()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: errors.array()[0].msg
    });
  }

  try {
    const orderData = req.body;
    
    // Validate required fields
    if (!orderData.customerName || !orderData.customerEmail) {
      return res.status(400).json({
        success: false,
        error: 'Missing required customer information'
      });
    }
    
    // Check if email service is configured
    const emailStatus = emailService.getStatus();
    if (!emailStatus.configured) {
      return res.json({
        success: true,
        message: 'Email service not configured - emails not sent',
        results: {
          customer: { success: false, message: 'Email service not configured' },
          admin: { success: false, message: 'Email service not configured' }
        }
      });
    }
    
    // Send both customer and admin emails
    const results = await emailService.sendOrderConfirmationEmails(orderData);
    
    res.json({
      success: true,
      message: 'Order confirmation notifications processed',
      results: {
        customer: results.customer,
        admin: results.admin,
        whatsapp: results.whatsapp
      }
    });
  } catch (error) {
    console.error('Error sending order confirmation emails:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send emails',
      details: error.message
    });
  }
});

// @desc    Send customer order confirmation only
// @route   POST /api/email/send-customer-confirmation
// @access  Public
router.post('/send-customer-confirmation', [
  body('customerName').notEmpty().withMessage('Customer name is required'),
  body('customerEmail').isEmail().withMessage('Valid email is required'),
  body('orderId').notEmpty().withMessage('Order ID is required'),
  body('orderDate').notEmpty().withMessage('Order date is required'),
  body('serviceDate').notEmpty().withMessage('Service date is required'),
  body('serviceTime').notEmpty().withMessage('Service time is required'),
  body('totalAmount').isNumeric().withMessage('Total amount must be a number'),
  body('services').isArray().withMessage('Services must be an array'),
  body('address').isObject().withMessage('Address must be an object'),
  body('specialInstructions').optional().isString()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: errors.array()[0].msg
    });
  }

  try {
    const orderData = req.body;
    
    const result = await emailService.sendCustomerOrderConfirmation(orderData);
    
    res.json({
      success: result.success,
      message: result.message,
      messageId: result.messageId
    });
  } catch (error) {
    console.error('Error sending customer confirmation email:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send customer email'
    });
  }
});

// @desc    Send admin order notification only
// @route   POST /api/email/send-admin-notification
// @access  Public
router.post('/send-admin-notification', [
  body('customerName').notEmpty().withMessage('Customer name is required'),
  body('customerEmail').isEmail().withMessage('Valid email is required'),
  body('customerPhone').notEmpty().withMessage('Phone number is required'),
  body('orderId').notEmpty().withMessage('Order ID is required'),
  body('orderDate').notEmpty().withMessage('Order date is required'),
  body('serviceDate').notEmpty().withMessage('Service date is required'),
  body('serviceTime').notEmpty().withMessage('Service time is required'),
  body('totalAmount').isNumeric().withMessage('Total amount must be a number'),
  body('services').isArray().withMessage('Services must be an array'),
  body('address').isObject().withMessage('Address must be an object'),
  body('specialInstructions').optional().isString()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: errors.array()[0].msg
    });
  }

  try {
    const orderData = req.body;
    
    const result = await emailService.sendAdminOrderNotification(orderData);
    
    res.json({
      success: result.success,
      message: result.message,
      messageId: result.messageId
    });
  } catch (error) {
    console.error('Error sending admin notification email:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send admin email'
    });
  }
});

// @desc    Test email service configuration
// @route   GET /api/email/test
// @access  Public
router.get('/test', async (req, res) => {
  try {
    const status = emailService.getStatus();
    
    if (!status.configured) {
      return res.json({
        success: false,
        message: 'Email service not configured',
        status: status
      });
    }

    // Test SMTP connection
    await emailService.testConnection();
    
    res.json({
      success: true,
      message: 'Email service is working correctly',
      status: status
    });
  } catch (error) {
    console.error('Email service test failed:', error);
    res.status(500).json({
      success: false,
      error: 'Email service test failed',
      message: error.message
    });
  }
});

// @desc    Send test email
// @route   POST /api/email/send-test
// @access  Public
router.post('/send-test', [
  body('to').isEmail().withMessage('Valid email address is required'),
  body('type').isIn(['customer', 'admin']).withMessage('Type must be customer or admin')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: errors.array()[0].msg
    });
  }

  try {
    const { to, type } = req.body;
    
    // Sample order data for testing
    const testOrderData = {
      customerName: 'John Doe',
      customerEmail: to,
      customerPhone: '+49-1234567890',
      orderId: 'TEST-001',
      orderDate: new Date().toLocaleDateString(),
      serviceDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      serviceTime: '10:00 AM',
      totalAmount: 150.00,
      services: [
        { name: 'Deep House Cleaning', price: 'From €120' },
        { name: 'Kitchen Deep Clean', price: 'From €80' }
      ],
      address: {
        street_address: '123 Test Street',
        city: 'Berlin',
        postal_code: '10115',
        country: 'Germany'
      },
      specialInstructions: 'Please use eco-friendly products only'
    };

    let result;
    if (type === 'customer') {
      result = await emailService.sendCustomerOrderConfirmation(testOrderData);
    } else {
      result = await emailService.sendAdminOrderNotification(testOrderData);
    }
    
    res.json({
      success: result.success,
      message: result.message,
      messageId: result.messageId
    });
  } catch (error) {
    console.error('Error sending test email:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send test email',
      message: error.message
    });
  }
});

// @desc    Send order cancellation emails and WhatsApp
// @route   POST /api/email/send-cancellation-notifications
// @access  Public (in production, should be protected)
router.post('/send-cancellation-notifications', [
  body('customerName').notEmpty().withMessage('Customer name is required'),
  body('customerEmail').isEmail().withMessage('Valid email is required'),
  body('customerPhone').notEmpty().withMessage('Phone number is required'),
  body('orderId').notEmpty().withMessage('Order ID is required'),
  body('orderDate').notEmpty().withMessage('Order date is required'),
  body('serviceDate').notEmpty().withMessage('Service date is required'),
  body('serviceTime').notEmpty().withMessage('Service time is required'),
  body('totalAmount').isNumeric().withMessage('Total amount must be a number'),
  body('services').isArray().withMessage('Services must be an array'),
  body('services.*.name').notEmpty().withMessage('Service name is required'),
  body('services.*.price').notEmpty().withMessage('Service price is required'),
  body('address').isObject().withMessage('Address must be an object'),
  body('address.street_address').notEmpty().withMessage('Street address is required'),
  body('address.city').notEmpty().withMessage('City is required'),
  body('address.postal_code').notEmpty().withMessage('Postal code is required'),
  body('address.country').notEmpty().withMessage('Country is required'),
  body('cancellationReason').optional().isString(),
  body('cancelledBy').optional().isString()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: errors.array()[0].msg
    });
  }

  try {
    const orderData = req.body;
    
    // Validate required fields
    if (!orderData.customerName || !orderData.customerEmail) {
      return res.status(400).json({
        success: false,
        error: 'Missing required customer information'
      });
    }
    
    // Check if email service is configured
    const emailStatus = emailService.getStatus();
    if (!emailStatus.configured) {
      return res.json({
        success: true,
        message: 'Email service not configured - notifications not sent',
        results: {
          customer: { success: false, message: 'Email service not configured' },
          admin: { success: false, message: 'Email service not configured' },
          whatsapp: { success: false, message: 'Email service not configured' }
        }
      });
    }
    
    // Send both customer and admin cancellation notifications
    const results = await emailService.sendCancellationEmails(orderData);
    
    res.json({
      success: true,
      message: 'Cancellation notifications processed',
      results: {
        customer: results.customer,
        admin: results.admin,
        whatsapp: results.whatsapp
      }
    });
  } catch (error) {
    console.error('Error sending cancellation notifications:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send cancellation notifications',
      details: error.message
    });
  }
});

module.exports = router;
