/**
 * Cancellation Notifications Test Script
 * 
 * This script helps test the cancellation email and WhatsApp functionality
 * Run with: node test-cancellation.js
 */

require('dotenv').config();
const emailService = require('./src/services/emailService');
const whatsappService = require('./src/services/whatsappService');

console.log('Testing Cancellation Notifications...\n');

// Test cancellation data
const testCancellationData = {
  customerName: 'John Doe',
  customerEmail: 'john.doe@example.com',
  customerPhone: '+49-1234567890',
  orderId: 'CANCEL-TEST-001',
  orderDate: '2024-01-15',
  serviceDate: '2024-01-20',
  serviceTime: '10:00 AM',
  totalAmount: 150,
  services: [
    { name: 'Kitchen Cleaning', price: '€80' },
    { name: 'Bathroom Cleaning', price: '€70' }
  ],
  address: {
    street_address: '123 Test Street',
    city: 'Berlin',
    postal_code: '10115',
    country: 'Germany'
  },
  cancellationReason: 'Customer requested cancellation due to schedule change',
  cancelledBy: 'Customer'
};

async function testCancellationNotifications() {
  try {
    // 1. Check service statuses
    console.log('1. Checking service statuses...');
    const emailStatus = emailService.getStatus();
    const whatsappStatus = whatsappService.getStatus();
    
    console.log('Email Service:', JSON.stringify(emailStatus, null, 2));
    console.log('WhatsApp Service:', JSON.stringify(whatsappStatus, null, 2));
    console.log('');

    // 2. Test email cancellation templates
    console.log('2. Testing email cancellation templates...');
    const { getCustomerCancellationTemplate, getAdminCancellationTemplate } = require('./src/templates/emailTemplates');
    
    const customerTemplate = getCustomerCancellationTemplate(testCancellationData);
    const adminTemplate = getAdminCancellationTemplate(testCancellationData);
    
    console.log('✅ Customer cancellation template generated');
    console.log('✅ Admin cancellation template generated');
    console.log('');

    // 3. Test WhatsApp cancellation message formatting
    console.log('3. Testing WhatsApp cancellation message formatting...');
    const whatsappMessage = whatsappService.formatCancellationMessage(testCancellationData);
    console.log('Formatted WhatsApp cancellation message:');
    console.log('─'.repeat(50));
    console.log(whatsappMessage);
    console.log('─'.repeat(50));
    console.log('');

    // 4. Test email cancellation (if configured)
    if (emailStatus.configured) {
      console.log('4. Testing email cancellation notifications...');
      try {
        const emailResults = await emailService.sendCancellationEmails(testCancellationData);
        console.log('Email cancellation results:', JSON.stringify(emailResults, null, 2));
      } catch (error) {
        console.log('❌ Email cancellation test failed:', error.message);
      }
    } else {
      console.log('4. Email service not configured - skipping email cancellation test');
    }
    console.log('');

    // 5. Test WhatsApp cancellation (if configured)
    if (whatsappStatus.configured) {
      console.log('5. Testing WhatsApp cancellation notification...');
      try {
        const whatsappResult = await whatsappService.sendCancellationWhatsApp(testCancellationData);
        console.log('WhatsApp cancellation result:', JSON.stringify(whatsappResult, null, 2));
      } catch (error) {
        console.log('❌ WhatsApp cancellation test failed:', error.message);
      }
    } else {
      console.log('5. WhatsApp service not configured - skipping WhatsApp cancellation test');
    }
    console.log('');

    // 6. Test API endpoints (simulation)
    console.log('6. Testing API endpoint simulation...');
    console.log('📡 Available cancellation endpoints:');
    console.log('   POST /api/email/send-cancellation-notifications');
    console.log('   POST /api/whatsapp/send-cancellation');
    console.log('   PUT /api/orders/:orderId/cancel');
    console.log('   DELETE /api/service-bookings/:id');
    console.log('');

    console.log('✅ Cancellation notifications test completed!');

  } catch (error) {
    console.error('❌ Error testing cancellation notifications:', error);
  }
}

// Run the test
testCancellationNotifications();
