const express = require('express');
const { body, validationResult } = require('express-validator');
const { supabase } = require('../config/database');

const router = express.Router();

// Middleware to verify JWT token and get user
const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    console.log('Service booking token verification - Token:', token.substring(0, 20) + '...');

    // Verify JWT token and get user from mobile_users table
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

    console.log('Service booking token verification - Decoded:', decoded);

    // Get user from mobile_users table
    const { data: user, error } = await supabase
      .from('mobile_users')
      .select('id, email, first_name, last_name, phone, address, city, state, postal_code, country, date_of_birth, gender, profile_completion_percentage, is_active')
      .eq('id', decoded.id)
      .eq('is_active', true)
      .single();

    console.log('Service booking token verification - User query result:', { user, error });

    if (error || !user) {
      console.error('Service booking token verification - User not found:', error);
      return res.status(401).json({ error: 'Invalid token or user not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Service booking token verification error:', error);
    res.status(401).json({ error: 'Token verification failed' });
  }
};

// @desc    Get user's service bookings
// @route   GET /api/service-bookings
// @access  Private
router.get('/', verifyToken, async (req, res) => {
  try {
    const { data: bookings, error } = await supabase
      .from('service_bookings')
      .select(`
        *,
        services (
          id,
          title,
          description,
          category,
          duration
        )
      `)
      .eq('user_id', req.user.id)
      .order('booking_date', { ascending: false });

    if (error) {
      console.error('Error fetching bookings:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch bookings'
      });
    }

    res.json({
      success: true,
      data: bookings
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get single service booking
// @route   GET /api/service-bookings/:id
// @access  Private
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const { data: booking, error } = await supabase
      .from('service_bookings')
      .select(`
        *,
        services (
          id,
          title,
          description,
          category,
          duration
        )
      `)
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .single();

    if (error || !booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }

    res.json({
      success: true,
      data: booking
    });
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Create new service booking
// @route   POST /api/service-bookings
// @access  Private
router.post('/', [
  verifyToken,
  [
    body('service_id').notEmpty().withMessage('Service ID is required'),
    body('booking_date').isISO8601().withMessage('Valid booking date is required'),
    body('booking_time').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Valid booking time is required (HH:MM format)'),
    body('duration_minutes').isInt({ min: 1 }).withMessage('Duration must be a positive integer'),
    body('customer_name').notEmpty().withMessage('Customer name is required'),
    body('customer_email').isEmail().withMessage('Valid email is required'),
    body('service_address').notEmpty().withMessage('Service address is required'),
    body('total_amount').isFloat({ min: 0 }).withMessage('Total amount must be a positive number')
  ]
], async (req, res) => {
  console.log('Service booking create - Request body:', req.body);
  console.log('Service booking create - User:', req.user);
  
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('Service booking create - Validation errors:', errors.array());
    return res.status(400).json({
      success: false,
      error: errors.array()[0].msg
    });
  }

  try {
    const {
      service_id,
      booking_date,
      booking_time,
      duration_minutes,
      customer_name,
      customer_email,
      customer_phone,
      service_address,
      special_instructions,
      total_amount,
      payment_method = 'pending'
    } = req.body;

    console.log('Service booking create - Extracted data:', {
      service_id,
      booking_date,
      booking_time,
      duration_minutes,
      customer_name,
      customer_email,
      customer_phone,
      service_address,
      special_instructions,
      total_amount,
      payment_method
    });

    // Check if service exists
    const { data: service, error: serviceError } = await supabase
      .from('services')
      .select('id, title, duration')
      .eq('id', service_id)
      .eq('is_active', true)
      .single();

    if (serviceError || !service) {
      return res.status(400).json({
        success: false,
        error: 'Service not found or inactive'
      });
    }

    // Create booking
    const bookingData = {
      user_id: req.user.id,
      service_id,
      booking_date,
      booking_time,
      duration_minutes,
      status: 'scheduled',
      customer_name,
      customer_email,
      customer_phone: customer_phone || req.user.phone,
      service_address,
      special_instructions: special_instructions || null,
      total_amount,
      payment_status: 'pending',
      payment_method,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data: booking, error: bookingError } = await supabase
      .from('service_bookings')
      .insert([bookingData])
      .select(`
        *,
        services (
          id,
          title,
          description,
          category,
          duration
        )
      `)
      .single();

    if (bookingError) {
      console.error('Error creating booking:', bookingError);
      return res.status(500).json({
        success: false,
        error: 'Failed to create booking'
      });
    }

    res.status(201).json({
      success: true,
      data: booking,
      message: 'Service booking created successfully'
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Update service booking
// @route   PUT /api/service-bookings/:id
// @access  Private
router.put('/:id', [
  verifyToken,
  [
    body('booking_date').optional().isISO8601().withMessage('Valid booking date is required'),
    body('booking_time').optional().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Valid booking time is required (HH:MM format)'),
    body('duration_minutes').optional().isInt({ min: 1 }).withMessage('Duration must be a positive integer'),
    body('customer_name').optional().notEmpty().withMessage('Customer name cannot be empty'),
    body('customer_email').optional().isEmail().withMessage('Valid email is required'),
    body('service_address').optional().notEmpty().withMessage('Service address cannot be empty'),
    body('special_instructions').optional().isString().withMessage('Special instructions must be a string'),
    body('status').optional().isIn(['scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled']).withMessage('Invalid status')
  ]
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: errors.array()[0].msg
    });
  }

  try {
    // Check if booking exists and belongs to user
    const { data: existingBooking, error: fetchError } = await supabase
      .from('service_bookings')
      .select('id, status')
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .single();

    if (fetchError || !existingBooking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }

    // Only allow updates if booking is not completed or cancelled
    if (['completed', 'cancelled'].includes(existingBooking.status)) {
      return res.status(400).json({
        success: false,
        error: 'Cannot update completed or cancelled booking'
      });
    }

    const updateData = {
      ...req.body,
      updated_at: new Date().toISOString()
    };

    const { data: booking, error: updateError } = await supabase
      .from('service_bookings')
      .update(updateData)
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .select(`
        *,
        services (
          id,
          title,
          description,
          category,
          duration
        )
      `)
      .single();

    if (updateError) {
      console.error('Error updating booking:', updateError);
      return res.status(500).json({
        success: false,
        error: 'Failed to update booking'
      });
    }

    res.json({
      success: true,
      data: booking,
      message: 'Booking updated successfully'
    });
  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Cancel service booking
// @route   DELETE /api/service-bookings/:id
// @access  Private
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    // Check if booking exists and belongs to user
    const { data: existingBooking, error: fetchError } = await supabase
      .from('service_bookings')
      .select('id, status')
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .single();

    if (fetchError || !existingBooking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }

    // Only allow cancellation if booking is not completed
    if (existingBooking.status === 'completed') {
      return res.status(400).json({
        success: false,
        error: 'Cannot cancel completed booking'
      });
    }

    // Update status to cancelled instead of deleting
    const { data: booking, error: updateError } = await supabase
      .from('service_bookings')
      .update({
        status: 'cancelled',
        updated_at: new Date().toISOString()
      })
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .select()
      .single();

    if (updateError) {
      console.error('Error cancelling booking:', updateError);
      return res.status(500).json({
        success: false,
        error: 'Failed to cancel booking'
      });
    }

    res.json({
      success: true,
      message: 'Booking cancelled successfully'
    });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

module.exports = router;
