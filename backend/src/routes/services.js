const express = require('express');
const { body, validationResult } = require('express-validator');
const { supabase } = require('../config/database');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all services
// @route   GET /api/services
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { data: services, error } = await supabase
      .from('services')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({
        success: false,
        error: 'Error fetching services'
      });
    }

    res.json({
      success: true,
      count: services.length,
      data: services
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get single service
// @route   GET /api/services/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const { data: service, error } = await supabase
      .from('services')
      .select('*')
      .eq('id', req.params.id)
      .eq('is_active', true)
      .single();

    if (error || !service) {
      return res.status(404).json({
        success: false,
        error: 'Service not found'
      });
    }

    res.json({
      success: true,
      data: service
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get services by category
// @route   GET /api/services/category/:category
// @access  Public
router.get('/category/:category', async (req, res) => {
  try {
    const { data: services, error } = await supabase
      .from('services')
      .select('*')
      .eq('category', req.params.category)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({
        success: false,
        error: 'Error fetching services'
      });
    }

    res.json({
      success: true,
      count: services.length,
      data: services
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Create new service (Admin only)
// @route   POST /api/services
// @access  Private/Admin
router.post('/', [
  protect,
  admin,
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('category').notEmpty().withMessage('Category is required'),
    body('price').notEmpty().withMessage('Price is required'),
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
    const serviceData = {
      ...req.body,
      features: req.body.features || [],
      is_active: req.body.is_active !== undefined ? req.body.is_active : true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data: service, error } = await supabase
      .from('services')
      .insert([serviceData])
      .select()
      .single();

    if (error) {
      return res.status(500).json({
        success: false,
        error: 'Error creating service'
      });
    }

    res.status(201).json({
      success: true,
      data: service
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Update service (Admin only)
// @route   PUT /api/services/:id
// @access  Private/Admin
router.put('/:id', [
  protect,
  admin,
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('category').notEmpty().withMessage('Category is required'),
    body('price').notEmpty().withMessage('Price is required'),
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
    const updateData = {
      ...req.body,
      updated_at: new Date().toISOString()
    };

    const { data: service, error } = await supabase
      .from('services')
      .update(updateData)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error || !service) {
      return res.status(404).json({
        success: false,
        error: 'Service not found'
      });
    }

    res.json({
      success: true,
      data: service
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Delete service (Admin only)
// @route   DELETE /api/services/:id
// @access  Private/Admin
router.delete('/:id', [protect, admin], async (req, res) => {
  try {
    // Soft delete - just mark as inactive
    const { data: service, error } = await supabase
      .from('services')
      .update({ 
        is_active: false, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error || !service) {
      return res.status(404).json({
        success: false,
        error: 'Service not found'
      });
    }

    res.json({
      success: true,
      message: 'Service deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get all services (including inactive) - Admin only
// @route   GET /api/services/admin/all
// @access  Private/Admin
router.get('/admin/all', [protect, admin], async (req, res) => {
  try {
    const { data: services, error } = await supabase
      .from('services')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({
        success: false,
        error: 'Error fetching services'
      });
    }

    res.json({
      success: true,
      count: services.length,
      data: services
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

module.exports = router;
