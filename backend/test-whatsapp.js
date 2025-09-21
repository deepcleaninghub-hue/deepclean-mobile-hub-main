require('dotenv').config();
const whatsappService = require('./src/services/whatsappService');

console.log('Testing WhatsApp Service...\n');

// Test order data
const testOrderData = {
  customerName: 'John Doe',
  customerEmail: 'john.doe@example.com',
  customerPhone: '+49-1234567890',
  orderId: 'TEST-001',
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
  specialInstructions: 'Please use eco-friendly products'
};

async function testWhatsAppService() {
  try {
    // 1. Check service status
    console.log('1. Checking WhatsApp service status...');
    const status = whatsappService.getStatus();
    console.log('Status:', JSON.stringify(status, null, 2));
    console.log('');

    // 2. Test connection (if configured)
    if (status.configured) {
      console.log('2. Testing WhatsApp connection...');
      const connectionTest = await whatsappService.testConnection();
      console.log('Connection test result:', JSON.stringify(connectionTest, null, 2));
      console.log('');
    } else {
      console.log('2. WhatsApp service not configured - skipping connection test');
      console.log('Required credentials:');
      console.log('- WHATSAPP_ACCOUNT_SID: Your Twilio Account SID');
      console.log('- WHATSAPP_AUTH_TOKEN: Your Twilio Auth Token');
      console.log('- WHATSAPP_FROM_NUMBER: Your WhatsApp Business Number');
      console.log('- ADMIN_WHATSAPP_NUMBER: Admin WhatsApp Number');
      console.log('');
    }

    // 3. Test order confirmation message formatting
    console.log('3. Testing order confirmation message formatting...');
    const formattedMessage = whatsappService.formatOrderConfirmationMessage(testOrderData);
    console.log('Formatted WhatsApp message:');
    console.log('─'.repeat(50));
    console.log(formattedMessage);
    console.log('─'.repeat(50));
    console.log('');

    // 4. Test sending order confirmation (if configured)
    if (status.configured) {
      console.log('4. Testing order confirmation WhatsApp...');
      const orderResult = await whatsappService.sendOrderConfirmationWhatsApp(testOrderData);
      console.log('Order confirmation result:', JSON.stringify(orderResult, null, 2));
    } else {
      console.log('4. WhatsApp service not configured - skipping order confirmation test');
    }

    console.log('\n✅ WhatsApp service test completed!');

  } catch (error) {
    console.error('❌ Error testing WhatsApp service:', error);
  }
}

// Run the test
testWhatsAppService();