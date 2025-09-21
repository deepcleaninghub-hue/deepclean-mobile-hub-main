const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// Send inquiry notification email
const sendInquiryEmail = async (inquiryData) => {
  try {
    const transporter = createTransporter();

    const servicesList = inquiryData.services.map(service => 
      `- ${service.name}: ${service.price}`
    ).join('\n');

    const emailContent = `
      <h2>New Customer Inquiry Received</h2>
      
      <h3>Inquiry Details:</h3>
      <p><strong>Inquiry ID:</strong> ${inquiryData.inquiryId}</p>
      <p><strong>Customer Name:</strong> ${inquiryData.customerName}</p>
      <p><strong>Customer Email:</strong> ${inquiryData.customerEmail}</p>
      <p><strong>Customer Phone:</strong> ${inquiryData.customerPhone}</p>
      
      <h3>Services Requested:</h3>
      <ul>
        ${servicesList}
      </ul>
      
      <p><strong>Total Amount:</strong> €${inquiryData.totalAmount}</p>
      
      ${inquiryData.message ? `<h3>Customer Message:</h3><p>${inquiryData.message}</p>` : ''}
      
      ${inquiryData.preferredDate ? `<p><strong>Preferred Date:</strong> ${inquiryData.preferredDate}</p>` : ''}
      ${inquiryData.serviceArea ? `<p><strong>Service Area:</strong> ${inquiryData.serviceArea}</p>` : ''}
      
      <p><strong>Received:</strong> ${new Date().toLocaleString()}</p>
      
      <hr>
      <p><em>This is an automated notification from Deep Cleaning Hub.</em></p>
    `;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Send to admin email
      subject: `New Inquiry: ${inquiryData.customerName} - ${inquiryData.services.length} service(s)`,
      html: emailContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Inquiry email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('❌ Error sending inquiry email:', error);
    throw error;
  }
};

// Send customer confirmation email
const sendCustomerConfirmation = async (customerEmail, customerName, inquiryId) => {
  try {
    const transporter = createTransporter();

    const emailContent = `
      <h2>Thank you for your inquiry!</h2>
      
      <p>Dear ${customerName},</p>
      
      <p>We have received your inquiry and our team will contact you within 2-4 hours to discuss your cleaning needs.</p>
      
      <p><strong>Your inquiry reference:</strong> ${inquiryId}</p>
      
      <h3>What happens next?</h3>
      <ul>
        <li>Our team will review your requirements</li>
        <li>We'll contact you to confirm details and provide a quote</li>
        <li>Once confirmed, we'll schedule your service</li>
      </ul>
      
      <p>If you have any urgent questions, please call us at +49-16097044182</p>
      
      <p>Best regards,<br>The Deep Cleaning Hub Team</p>
      
      <hr>
      <p><em>This is an automated confirmation email.</em></p>
    `;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: customerEmail,
      subject: 'Inquiry Confirmation - Deep Cleaning Hub',
      html: emailContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Customer confirmation email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('❌ Error sending customer confirmation:', error);
    throw error;
  }
};

// Send password reset email
const sendPasswordResetEmail = async (adminEmail, resetToken) => {
  try {
    const transporter = createTransporter();

    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;

    const emailContent = `
      <h2>Password Reset Request</h2>
      
      <p>You have requested to reset your password for Deep Cleaning Hub Admin.</p>
      
      <p>Click the link below to reset your password:</p>
      
      <p><a href="${resetUrl}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a></p>
      
      <p>If the button doesn't work, copy and paste this link into your browser:</p>
      <p>${resetUrl}</p>
      
      <p><strong>This link will expire in 1 hour.</strong></p>
      
      <p>If you didn't request this password reset, please ignore this email.</p>
      
      <hr>
      <p><em>This is an automated email from Deep Cleaning Hub.</em></p>
    `;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: adminEmail,
      subject: 'Password Reset - Deep Cleaning Hub Admin',
      html: emailContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Password reset email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('❌ Error sending password reset email:', error);
    throw error;
  }
};

// Send general notification email
const sendNotificationEmail = async (to, subject, content) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html: content,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Notification email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('❌ Error sending notification email:', error);
    throw error;
  }
};

module.exports = {
  sendInquiryEmail,
  sendCustomerConfirmation,
  sendPasswordResetEmail,
  sendNotificationEmail
};
