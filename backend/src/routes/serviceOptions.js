const express = require('express');
const { body, validationResult } = require('express-validator');
const { supabase } = require('../config/database');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all service options
// @route   GET /api/service-options
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, service_id } = req.query;
    
    let query = supabase
      .from('service_options')
      .select(`
        *,
        services (
          id,
          title,
          category
        )
      `)
      .eq('is_active', true);

    // Filter by service_id (category)
    if (service_id) {
      query = query.eq('service_id', service_id);
    }

    // Filter by category
    if (category) {
      query = query.eq('services.category', category);
    }

    const { data: serviceOptions, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching service options:', error);
      return res.status(500).json({
        success: false,
        error: 'Error fetching service options'
      });
    }

    res.json({
      success: true,
      count: serviceOptions?.length || 0,
      data: serviceOptions || []
    });
  } catch (error) {
    console.error('Error in get service options:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get service option by ID
// @route   GET /api/service-options/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data: serviceOption, error } = await supabase
      .from('service_options')
      .select(`
        *,
        services (
          id,
          title,
          category,
          description
        )
      `)
      .eq('id', id)
      .eq('is_active', true)
      .single();

    if (error || !serviceOption) {
      return res.status(404).json({
        success: false,
        error: 'Service option not found'
      });
    }

    res.json({
      success: true,
      data: serviceOption
    });
  } catch (error) {
    console.error('Error in get service option:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Create new service option (Admin only)
// @route   POST /api/service-options
// @access  Private/Admin
router.post('/', [
  protect,
  admin,
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('service_id').notEmpty().withMessage('Service ID is required'),
    body('price').isNumeric().withMessage('Price must be a number'),
    body('duration').notEmpty().withMessage('Duration is required')
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
    // Check if service exists
    const { data: service, error: serviceError } = await supabase
      .from('services')
      .select('id, title, category')
      .eq('id', req.body.service_id)
      .eq('is_active', true)
      .single();

    if (serviceError || !service) {
      return res.status(400).json({
        success: false,
        error: 'Service not found or inactive'
      });
    }

    const serviceOptionData = {
      ...req.body,
      features: req.body.features || [],
      is_active: req.body.is_active !== undefined ? req.body.is_active : true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data: serviceOption, error } = await supabase
      .from('service_options')
      .insert([serviceOptionData])
      .select(`
        *,
        services (
          id,
          title,
          category
        )
      `)
      .single();

    if (error) {
      console.error('Error creating service option:', error);
      return res.status(500).json({
        success: false,
        error: 'Error creating service option'
      });
    }

    res.status(201).json({
      success: true,
      data: serviceOption
    });
  } catch (error) {
    console.error('Error in create service option:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Update service option (Admin only)
// @route   PUT /api/service-options/:id
// @access  Private/Admin
router.put('/:id', [protect, admin], async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = {
      ...req.body,
      updated_at: new Date().toISOString()
    };

    const { data: serviceOption, error } = await supabase
      .from('service_options')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        services (
          id,
          title,
          category
        )
      `)
      .single();

    if (error || !serviceOption) {
      return res.status(404).json({
        success: false,
        error: 'Service option not found'
      });
    }

    res.json({
      success: true,
      data: serviceOption
    });
  } catch (error) {
    console.error('Error in update service option:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Delete service option (Admin only)
// @route   DELETE /api/service-options/:id
// @access  Private/Admin
router.delete('/:id', [protect, admin], async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('service_options')
      .delete()
      .eq('id', id);

    if (error) {
      return res.status(500).json({
        success: false,
        error: 'Error deleting service option'
      });
    }

    res.json({
      success: true,
      message: 'Service option deleted successfully'
    });
  } catch (error) {
    console.error('Error in delete service option:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

module.exports = router;
