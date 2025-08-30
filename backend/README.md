# Deep Cleaning Hub Backend API

A comprehensive Node.js + Express + Supabase backend for the Deep Cleaning Hub mobile application, providing all necessary APIs for services, inquiries, blogs, and admin management.

## 🚀 Features

- **RESTful API** with Express.js
- **Supabase Integration** for PostgreSQL database
- **JWT Authentication** for admin users
- **File Upload System** with image processing
- **Email Notifications** for inquiries
- **Rate Limiting** and security middleware
- **Comprehensive Admin Dashboard** APIs
- **Blog Management** system
- **Service Management** with CRUD operations
- **Customer Inquiry** handling
- **Analytics and Reporting**

## 🛠️ Tech Stack

- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Database**: Supabase (PostgreSQL)
- **Authentication**: JWT + bcryptjs
- **File Processing**: Multer + Sharp
- **Email**: Nodemailer
- **Validation**: Express-validator
- **Security**: Helmet, CORS, Rate Limiting

## 📋 Prerequisites

- Node.js 18+ installed
- Supabase account and project
- Gmail account for email notifications (optional)
- Firebase project for push notifications (optional)

## 🚀 Quick Start

### 1. Clone and Install Dependencies

```bash
cd backend
npm install
```

### 2. Environment Configuration

Copy the environment file and configure your settings:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# JWT Configuration
JWT_SECRET=your_secure_jwt_secret_key_here
JWT_EXPIRES_IN=7d

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

### 3. Database Setup

1. Create a new Supabase project
2. Run the SQL schema from `supabase-schema.sql` in your Supabase SQL editor
3. Update your `.env` file with Supabase credentials

### 4. Start the Server

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000`

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Admin Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "admin@deepcleaninghub.com",
  "password": "admin123"
}
```

#### Admin Registration (Protected)
```http
POST /auth/register
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "New Admin",
  "email": "newadmin@example.com",
  "password": "securepassword",
  "role": "admin"
}
```

### Services Endpoints

#### Get All Services
```http
GET /services
```

#### Get Service by ID
```http
GET /services/:id
```

#### Create Service (Admin)
```http
POST /services
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Kitchen Deep Cleaning",
  "description": "Thorough kitchen cleaning service",
  "category": "Cleaning",
  "price": "From €80",
  "duration": "2-4 hours",
  "features": ["Appliance cleaning", "Cabinet cleaning"]
}
```

### Inquiries Endpoints

#### Submit Customer Inquiry
```http
POST /inquiries
Content-Type: application/json

{
  "customerName": "John Doe",
  "customerEmail": "john@example.com",
  "customerPhone": "+1234567890",
  "services": [
    {
      "id": "kitchen-cleaning",
      "name": "Kitchen Deep Cleaning",
      "price": "From €80"
    }
  ],
  "message": "Need cleaning service for next week",
  "preferredDate": "2024-01-15"
}
```

#### Get All Inquiries (Admin)
```http
GET /inquiries
Authorization: Bearer <token>
```

### Blogs Endpoints

#### Get Published Blogs
```http
GET /blogs
```

#### Get Blog by Category
```http
GET /blogs/category/cleaning_tips
```

#### Create Blog Post (Admin)
```http
POST /blogs
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "10 Essential Cleaning Tips",
  "content": "Here are 10 essential cleaning tips...",
  "category": "cleaning_tips",
  "tags": ["cleaning", "tips", "home"]
}
```

### Admin Dashboard Endpoints

#### Get Dashboard Overview
```http
GET /admin/dashboard
Authorization: Bearer <token>
```

#### Get System Statistics
```http
GET /admin/stats?period=30
Authorization: Bearer <token>
```

#### Get Admin Users
```http
GET /admin/users
Authorization: Bearer <token>
```

### File Upload Endpoints

#### Upload Service Image
```http
POST /upload/service-image
Authorization: Bearer <token>
Content-Type: multipart/form-data

serviceImage: [file]
```

#### Upload Multiple Images
```http
POST /upload/images
Authorization: Bearer <token>
Content-Type: multipart/form-data

images: [files]
```

## 🔐 Authentication

The API uses JWT tokens for authentication. Include the token in the Authorization header:

```http
Authorization: Bearer <your_jwt_token>
```

### Default Admin Account
- **Email**: admin@deepcleaninghub.com
- **Password**: admin123

⚠️ **Important**: Change this password immediately in production!

## 📊 Database Schema

The backend includes a comprehensive database schema with:

- **Services**: Cleaning services with features and pricing
- **Inquiries**: Customer service requests
- **Blogs**: Content management for tips and insights
- **Admin Users**: Administrative access control
- **Company Settings**: Configurable business information
- **System Logs**: Activity tracking and debugging

## 🚀 Development

### Project Structure
```
backend/
├── src/
│   ├── config/          # Database and configuration
│   ├── middleware/      # Custom middleware
│   ├── routes/          # API route handlers
│   ├── utils/           # Utility functions
│   └── server.js        # Main server file
├── supabase-schema.sql  # Database schema
├── package.json
└── README.md
```

### Available Scripts

```bash
# Start development server
npm run dev

# Start production server
npm start

# Run tests
npm test

# Lint code
npm run lint

# Format code
npm run format
```

### Adding New Routes

1. Create a new route file in `src/routes/`
2. Import and register the route in `src/server.js`
3. Add any necessary middleware and validation

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 5000 |
| `NODE_ENV` | Environment mode | development |
| `SUPABASE_URL` | Supabase project URL | - |
| `SUPABASE_ANON_KEY` | Supabase anonymous key | - |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | - |
| `JWT_SECRET` | JWT signing secret | - |
| `JWT_EXPIRES_IN` | JWT expiration time | 7d |
| `EMAIL_HOST` | SMTP host | smtp.gmail.com |
| `EMAIL_PORT` | SMTP port | 587 |
| `EMAIL_USER` | SMTP username | - |
| `EMAIL_PASS` | SMTP password | - |

## 🔒 Security Features

- **Helmet.js** for security headers
- **CORS** configuration for cross-origin requests
- **Rate limiting** to prevent abuse
- **Input validation** with express-validator
- **JWT authentication** for protected routes
- **Password hashing** with bcryptjs
- **File upload validation** and processing

## 📧 Email Integration

The backend includes email functionality for:

- Customer inquiry notifications
- Admin alerts
- Password reset emails
- General notifications

Configure your email settings in the `.env` file.

## 🗄️ File Management

- **Image processing** with Sharp
- **Multiple file uploads** support
- **File type validation**
- **Automatic resizing** and optimization
- **Organized storage** by file type

## 📱 Mobile App Integration

The backend is designed to work seamlessly with the React Native mobile app:

- **CORS** configured for mobile app origins
- **JSON responses** optimized for mobile consumption
- **File uploads** for service images
- **Real-time notifications** support

## 🚀 Deployment

### Production Considerations

1. **Environment Variables**: Set production values
2. **Database**: Use production Supabase instance
3. **SSL**: Enable HTTPS in production
4. **Monitoring**: Add logging and monitoring
5. **Backup**: Implement database backups
6. **Security**: Review and update security settings

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- --grep "auth"
```

## 📝 API Response Format

All API responses follow a consistent format:

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message"
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:

- **Email**: malhotra2103@gmail.com
- **Phone**: +91 8437700396
- **Documentation**: Check this README and inline code comments

## 🔄 Updates and Maintenance

- **Regular Updates**: Keep dependencies updated
- **Security Patches**: Monitor for security vulnerabilities
- **Performance**: Monitor API response times
- **Backup**: Regular database backups
- **Monitoring**: Implement health checks and logging

---

**Deep Cleaning Hub Backend** - Professional cleaning services API backend
