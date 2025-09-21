// Comprehensive input validation utilities
import { z } from 'zod';

// Common validation patterns
export const validationPatterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[\+]?[1-9][\d]{0,15}$/,
  name: /^[a-zA-Z\s'-]+$/,
  alphanumeric: /^[a-zA-Z0-9]+$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
  postalCode: /^[A-Za-z0-9\s-]{3,10}$/,
  url: /^https?:\/\/.+/,
};

// Sanitization functions
export const sanitizeInput = {
  // Remove potentially dangerous characters
  sanitize: (input: string): string => {
    return input
      .replace(/[<>]/g, '') // Remove < and >
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
      .trim();
  },

  // Sanitize HTML content
  sanitizeHtml: (input: string): string => {
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '') // Remove iframe tags
      .replace(/on\w+\s*=/gi, '') // Remove event handlers
      .trim();
  },

  // Sanitize for database storage
  sanitizeForDb: (input: string): string => {
    return input
      .replace(/['"]/g, '') // Remove quotes
      .replace(/[;]/g, '') // Remove semicolons
      .replace(/--/g, '') // Remove SQL comment markers
      .replace(/\/\*/g, '') // Remove SQL comment start
      .replace(/\*\//g, '') // Remove SQL comment end
      .trim();
  },
};

// Validation schemas using Zod
export const validationSchemas = {
  // User registration schema
  userRegistration: z.object({
    firstName: z
      .string()
      .min(2, 'First name must be at least 2 characters')
      .max(50, 'First name must be less than 50 characters')
      .regex(validationPatterns.name, 'First name can only contain letters, spaces, hyphens, and apostrophes')
      .transform(sanitizeInput.sanitize),
    
    lastName: z
      .string()
      .min(2, 'Last name must be at least 2 characters')
      .max(50, 'Last name must be less than 50 characters')
      .regex(validationPatterns.name, 'Last name can only contain letters, spaces, hyphens, and apostrophes')
      .transform(sanitizeInput.sanitize),
    
    email: z
      .string()
      .email('Please enter a valid email address')
      .max(100, 'Email must be less than 100 characters')
      .transform(sanitizeInput.sanitize),
    
    phone: z
      .string()
      .min(10, 'Phone number must be at least 10 digits')
      .max(15, 'Phone number must be less than 15 digits')
      .regex(validationPatterns.phone, 'Please enter a valid phone number')
      .transform(sanitizeInput.sanitize),
    
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(128, 'Password must be less than 128 characters')
      .regex(
        validationPatterns.password,
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
      ),
    
    confirmPassword: z.string(),
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  }),

  // User login schema
  userLogin: z.object({
    email: z
      .string()
      .email('Please enter a valid email address')
      .transform(sanitizeInput.sanitize),
    
    password: z
      .string()
      .min(1, 'Password is required'),
  }),

  // Profile update schema
  profileUpdate: z.object({
    firstName: z
      .string()
      .min(2, 'First name must be at least 2 characters')
      .max(50, 'First name must be less than 50 characters')
      .regex(validationPatterns.name, 'First name can only contain letters, spaces, hyphens, and apostrophes')
      .transform(sanitizeInput.sanitize)
      .optional(),
    
    lastName: z
      .string()
      .min(2, 'Last name must be at least 2 characters')
      .max(50, 'Last name must be less than 50 characters')
      .regex(validationPatterns.name, 'Last name can only contain letters, spaces, hyphens, and apostrophes')
      .transform(sanitizeInput.sanitize)
      .optional(),
    
    email: z
      .string()
      .email('Please enter a valid email address')
      .max(100, 'Email must be less than 100 characters')
      .transform(sanitizeInput.sanitize)
      .optional(),
    
    phone: z
      .string()
      .min(10, 'Phone number must be at least 10 digits')
      .max(15, 'Phone number must be less than 15 digits')
      .regex(validationPatterns.phone, 'Please enter a valid phone number')
      .transform(sanitizeInput.sanitize)
      .optional(),
    
    address: z
      .string()
      .min(5, 'Address must be at least 5 characters')
      .max(200, 'Address must be less than 200 characters')
      .transform(sanitizeInput.sanitizeForDb)
      .optional(),
    
    city: z
      .string()
      .min(2, 'City must be at least 2 characters')
      .max(50, 'City must be less than 50 characters')
      .regex(validationPatterns.name, 'City can only contain letters, spaces, hyphens, and apostrophes')
      .transform(sanitizeInput.sanitize)
      .optional(),
    
    postalCode: z
      .string()
      .min(3, 'Postal code must be at least 3 characters')
      .max(10, 'Postal code must be less than 10 characters')
      .regex(validationPatterns.postalCode, 'Please enter a valid postal code')
      .transform(sanitizeInput.sanitize)
      .optional(),
  }),

  // Contact form schema
  contactForm: z.object({
    name: z
      .string()
      .min(2, 'Name must be at least 2 characters')
      .max(100, 'Name must be less than 100 characters')
      .regex(validationPatterns.name, 'Name can only contain letters, spaces, hyphens, and apostrophes')
      .transform(sanitizeInput.sanitize),
    
    email: z
      .string()
      .email('Please enter a valid email address')
      .max(100, 'Email must be less than 100 characters')
      .transform(sanitizeInput.sanitize),
    
    phone: z
      .string()
      .min(10, 'Phone number must be at least 10 digits')
      .max(15, 'Phone number must be less than 15 digits')
      .regex(validationPatterns.phone, 'Please enter a valid phone number')
      .transform(sanitizeInput.sanitize),
    
    service: z
      .string()
      .min(1, 'Please select a service')
      .max(100, 'Service name must be less than 100 characters')
      .transform(sanitizeInput.sanitize),
    
    message: z
      .string()
      .min(10, 'Message must be at least 10 characters')
      .max(1000, 'Message must be less than 1000 characters')
      .transform(sanitizeInput.sanitizeHtml),
  }),

  // Service booking schema
  serviceBooking: z.object({
    serviceId: z
      .string()
      .min(1, 'Service ID is required')
      .regex(validationPatterns.alphanumeric, 'Invalid service ID format'),
    
    serviceVariantId: z
      .string()
      .min(1, 'Service variant ID is required')
      .regex(validationPatterns.alphanumeric, 'Invalid service variant ID format')
      .optional(),
    
    bookingDate: z
      .string()
      .min(1, 'Booking date is required')
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
    
    bookingTime: z
      .string()
      .min(1, 'Booking time is required')
      .regex(/^\d{2}:\d{2}$/, 'Time must be in HH:MM format'),
    
    duration: z
      .number()
      .min(30, 'Duration must be at least 30 minutes')
      .max(480, 'Duration must be less than 8 hours'),
    
    address: z
      .string()
      .min(10, 'Address must be at least 10 characters')
      .max(200, 'Address must be less than 200 characters')
      .transform(sanitizeInput.sanitizeForDb),
    
    specialInstructions: z
      .string()
      .max(500, 'Special instructions must be less than 500 characters')
      .transform(sanitizeInput.sanitizeHtml)
      .optional(),
  }),
};

// Validation helper functions
export const validateInput = {
  // Validate single field
  field: <T>(schema: z.ZodSchema<T>, data: unknown): { success: boolean; data?: T; error?: string } => {
    try {
      const result = schema.parse(data);
      return { success: true, data: result };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return { success: false, error: error.errors[0]?.message || 'Validation failed' };
      }
      return { success: false, error: 'Unknown validation error' };
    }
  },

  // Validate form data
  form: <T>(schema: z.ZodSchema<T>, data: unknown): { success: boolean; data?: T; errors?: Record<string, string> } => {
    try {
      const result = schema.parse(data);
      return { success: true, data: result };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        error.errors.forEach((err) => {
          const path = err.path.join('.');
          errors[path] = err.message;
        });
        return { success: false, errors };
      }
      return { success: false, errors: { general: 'Unknown validation error' } };
    }
  },

  // Sanitize and validate
  sanitizeAndValidate: <T>(schema: z.ZodSchema<T>, data: unknown): { success: boolean; data?: T; error?: string } => {
    try {
      // First sanitize the data
      const sanitizedData = sanitizeInput.sanitize(JSON.stringify(data));
      const parsedData = JSON.parse(sanitizedData);
      
      // Then validate
      const result = schema.parse(parsedData);
      return { success: true, data: result };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return { success: false, error: error.errors[0]?.message || 'Validation failed' };
      }
      return { success: false, error: 'Sanitization or validation failed' };
    }
  },
};

// Rate limiting helper
export const rateLimiter = {
  // Simple in-memory rate limiter (in production, use Redis or similar)
  requests: new Map<string, { count: number; resetTime: number }>(),
  
  check: (key: string, maxRequests: number = 10, windowMs: number = 60000): boolean => {
    const now = Date.now();
    const record = rateLimiter.requests.get(key);
    
    if (!record || now > record.resetTime) {
      rateLimiter.requests.set(key, { count: 1, resetTime: now + windowMs });
      return true;
    }
    
    if (record.count >= maxRequests) {
      return false;
    }
    
    record.count++;
    return true;
  },
  
  reset: (key: string): void => {
    rateLimiter.requests.delete(key);
  },
};

export default {
  patterns: validationPatterns,
  sanitize: sanitizeInput,
  schemas: validationSchemas,
  validate: validateInput,
  rateLimit: rateLimiter,
};
