# WhatsApp Integration Setup Guide

## Overview
This guide explains how to set up WhatsApp Business API integration for sending order confirmation messages to the admin.

## Features
- ✅ Send WhatsApp messages to admin on order confirmation
- ✅ Beautiful formatted order details in WhatsApp
- ✅ Integration with existing email system
- ✅ Graceful fallback when not configured
- ✅ Real-time status display in mobile app

## Setup Requirements

### 1. Twilio Account Setup
1. Create a [Twilio account](https://www.twilio.com/try-twilio)
2. Get your **Account SID** and **Auth Token** from the Twilio Console
3. Purchase a **WhatsApp Business Number** from Twilio
4. Enable WhatsApp messaging for your number

### 2. Environment Configuration
Update your `.env` file with the following credentials:

```env
# WhatsApp Configuration
WHATSAPP_PROVIDER=twilio
WHATSAPP_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
WHATSAPP_AUTH_TOKEN=your_twilio_auth_token
WHATSAPP_FROM_NUMBER=+1234567890
ADMIN_WHATSAPP_NUMBER=+4916097044182
```

### 3. Phone Number Format
- **WhatsApp Business Number**: Must be in E.164 format (e.g., `+1234567890`)
- **Admin Number**: Must be in E.164 format (e.g., `+4916097044182`)
- The system automatically formats numbers if needed

## API Endpoints

### Test WhatsApp Service
```bash
GET /api/whatsapp/status
```

### Send Order Confirmation
```bash
POST /api/whatsapp/send-order-confirmation
Content-Type: application/json

{
  "customerName": "John Doe",
  "customerEmail": "john@example.com",
  "customerPhone": "+49-1234567890",
  "orderId": "ORDER-001",
  "orderDate": "2024-01-15",
  "serviceDate": "2024-01-20",
  "serviceTime": "10:00 AM",
  "totalAmount": 150,
  "services": [
    {"name": "Kitchen Cleaning", "price": "€80"},
    {"name": "Bathroom Cleaning", "price": "€70"}
  ],
  "address": {
    "street_address": "123 Test Street",
    "city": "Berlin",
    "postal_code": "10115",
    "country": "Germany"
  },
  "specialInstructions": "Please use eco-friendly products"
}
```

### Send Custom Message
```bash
POST /api/whatsapp/send-message
Content-Type: application/json

{
  "to": "+4916097044182",
  "message": "Hello from Deep Cleaning Hub!"
}
```

## WhatsApp Message Format

The system sends beautifully formatted messages like this:

```
🎉 *NEW ORDER CONFIRMATION* 🎉

📋 *Order Details:*
• Order ID: ORDER-001
• Order Date: 2024-01-15
• Service Date: 2024-01-20
• Service Time: 10:00 AM
• Total Amount: €150

👤 *Customer Information:*
• Name: John Doe
• Email: john@example.com
• Phone: +49-1234567890

🏠 *Service Address:*
123 Test Street
Berlin, 10115
Germany

🛠️ *Services Requested:*
• Kitchen Cleaning: €80
• Bathroom Cleaning: €70

📝 *Special Instructions:*
Please use eco-friendly products

⏰ *Order Received:* 1/15/2024, 10:30:00 AM

---
🤖 *Automated notification from Deep Cleaning Hub*
```

## Testing

### 1. Test Service Status
```bash
curl -X GET http://localhost:5001/api/whatsapp/status
```

### 2. Test Order Confirmation
```bash
curl -X POST http://localhost:5001/api/email/send-order-confirmation \
  -H "Content-Type: application/json" \
  -d '{"customerName":"Test User","customerEmail":"test@example.com","customerPhone":"+49-1234567890","orderId":"TEST-001","orderDate":"2024-01-15","serviceDate":"2024-01-20","serviceTime":"10:00 AM","totalAmount":150,"services":[{"name":"Test Service","price":"€150"}],"address":{"street_address":"123 Test St","city":"Berlin","postal_code":"10115","country":"Germany"}}'
```

### 3. Run Test Script
```bash
cd backend
node test-whatsapp.js
```

## Mobile App Integration

The mobile app automatically:
- ✅ Shows WhatsApp status in order confirmation screen
- ✅ Displays "WhatsApp notification sent" when successful
- ✅ Shows "WhatsApp not configured" when credentials are missing
- ✅ Integrates seamlessly with existing email notifications

## Troubleshooting

### Common Issues

1. **"WhatsApp service not configured"**
   - Check that all required environment variables are set
   - Verify credentials are correct

2. **"Invalid phone number format"**
   - Ensure phone numbers are in E.164 format
   - Include country code (e.g., +49 for Germany)

3. **"Authentication failed"**
   - Verify Twilio Account SID and Auth Token
   - Check that WhatsApp is enabled for your Twilio number

4. **"Message not delivered"**
   - Ensure the admin number is a valid WhatsApp number
   - Check that the recipient has WhatsApp installed

### Debug Mode
Check server logs for detailed error messages:
```bash
cd backend
npm start
```

## Cost Considerations

- **Twilio WhatsApp**: ~$0.005 per message
- **WhatsApp Business API**: Free for first 1,000 messages/month
- **Setup**: One-time cost for Twilio number

## Security Notes

- Store credentials securely in environment variables
- Never commit credentials to version control
- Use different credentials for development/production
- Regularly rotate authentication tokens

## Support

For issues with:
- **Twilio Setup**: Contact Twilio Support
- **WhatsApp Business**: Check WhatsApp Business API documentation
- **Integration Issues**: Check server logs and API responses
