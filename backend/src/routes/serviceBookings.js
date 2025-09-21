const express = require('express');
const { body, validationResult } = require('express-validator');
const { supabase } = require('../config/database');

const router = express.Router();

// @desc    Test database connection
// @route   GET /api/service-bookings/test
// @access  Public
router.get('/test', async (req, res) => {
  try {
    // Test if service_bookings table exists
    const { data: testData, error: testError } = await supabase
      .from('service_bookings')
      .select('count')
      .limit(1);
    
    console.log('Service bookings table test:', { testData, testError });
    
    res.json({
      success: true,
      message: 'Database connection test',
      data: { testData, testError }
    });
  } catch (error) {
    console.error('Database test error:', error);
    res.status(500).json({
      success: false,
      error: 'Database test failed',
      details: error.message
    });
  }
});

// Middleware to verify JWT token and get user
const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    // Verify JWT token and get user from mobile_users table
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

    // Get user from mobile_users table
    const { data: user, error } = await supabase
      .from('mobile_users')
      .select('id, email, first_name, last_name, phone, address, city, state, postal_code, country, date_of_birth, gender, profile_completion_percentage, is_active')
      .eq('id', decoded.id)
      .eq('is_active', true)
      .single();

    if (error || !user) {
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
          category
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

// @desc    Get user's scheduled service bookings
// @route   GET /api/service-bookings/scheduled
// @access  Private
router.get('/scheduled', verifyToken, async (req, res) => {
  try {
    const { data: bookings, error } = await supabase
      .from('service_bookings')
      .select(`
        *,
        services (
          id,
          title,
          description,
          category
        ),
        service_variants (
          id,
          title,
          duration,
          price
        )
      `)
      .eq('user_id', req.user.id)
      .eq('status', 'scheduled')
      .order('booking_date', { ascending: true });

    if (error) {
      console.error('Error fetching scheduled bookings:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch scheduled bookings'
      });
    }

    res.json({
      success: true,
      data: bookings
    });
  } catch (error) {
    console.error('Error fetching scheduled bookings:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get user's completed service bookings
// @route   GET /api/service-bookings/completed
// @access  Private
router.get('/completed', verifyToken, async (req, res) => {
  try {
    const { data: bookings, error } = await supabase
      .from('service_bookings')
      .select(`
        *,
        services (
          id,
          title,
          description,
          category
        ),
        service_variants (
          id,
          title,
          duration,
          price
        )
      `)
      .eq('user_id', req.user.id)
      .eq('status', 'completed')
      .order('booking_date', { ascending: false });

    if (error) {
      console.error('Error fetching completed bookings:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch completed bookings'
      });
    }

    res.json({
      success: true,
      data: bookings
    });
  } catch (error) {
    console.error('Error fetching completed bookings:', error);
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
          category
        ),
        service_variants (
          id,
          title,
          duration,
          price
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
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
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

    // Check if service variant exists
    console.log('🔍 DEBUG: Looking for service variant with ID:', service_id);
    const { data: serviceVariant, error: serviceError } = await supabase
      .from('service_variants')
      .select(`
        id, title, duration, price,
        services (
          id,
          title,
          category
        )
      `)
      .eq('id', service_id)
      .eq('is_active', true)
      .single();

    console.log('Service variant query result:', { serviceVariant, serviceError });

    if (serviceError || !serviceVariant) {
      console.log('Service variant not found or inactive. Error:', serviceError);
      return res.status(400).json({
        success: false,
        error: 'Service variant not found or inactive'
      });
    }

    // Create booking
    const bookingData = {
      user_id: req.user.id,
      service_id: serviceVariant.services.id, // Use the main service ID
      service_variant_id: service_id, // Use the service variant ID
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

    console.log('Creating booking with data:', bookingData);

    const { data: booking, error: bookingError } = await supabase
      .from('service_bookings')
      .insert([bookingData])
      .select('*')
      .single();

    console.log('Booking creation result:', { booking, bookingError });

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
    body('status').optional().isIn(['scheduled', 'completed']).withMessage('Invalid status')
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

    // Only allow updates if booking is not completed
    if (existingBooking.status === 'completed') {
      return res.status(400).json({
        success: false,
        error: 'Cannot update completed booking'
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
          category
        ),
        service_variants (
          id,
          title,
          duration,
          price
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
    const { reason } = req.body;

    // Check if booking exists and belongs to user
    const { data: existingBooking, error: fetchError } = await supabase
      .from('service_bookings')
      .select(`
        *,
        services (
          name,
          price
        )
      `)
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
        cancellation_reason: reason || 'Cancelled by user',
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

    // Send cancellation notifications (async, don't wait for response)
    setImmediate(async () => {
      try {
        const emailService = require('../services/emailService');
        
        // Prepare booking data for notifications
        const bookingData = {
          customerName: req.user.name || req.user.email,
          customerEmail: req.user.email,
          customerPhone: req.user.phone || 'Not provided',
          orderId: `BOOKING-${booking.id}`,
          orderDate: new Date(existingBooking.created_at).toLocaleDateString(),
          serviceDate: new Date(existingBooking.service_date).toLocaleDateString(),
          serviceTime: existingBooking.service_time || 'Not specified',
          totalAmount: existingBooking.total_amount || 0,
          services: [{
            name: existingBooking.services?.name || 'Service Booking',
            price: `€${existingBooking.services?.price || existingBooking.total_amount || 0}`
          }],
          address: existingBooking.service_address || {
            street_address: 'Not provided',
            city: 'Not provided',
            postal_code: 'Not provided',
            country: 'Not provided'
          },
          cancellationReason: reason || 'Cancelled by user',
          cancelledBy: 'Customer'
        };

        // Send cancellation notifications
        await emailService.sendCancellationEmails(bookingData);
        console.log('✅ Booking cancellation notifications sent successfully');
      } catch (notificationError) {
        console.error('❌ Error sending booking cancellation notifications:', notificationError);
        // Don't fail the cancellation if notifications fail
      }
    });

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
