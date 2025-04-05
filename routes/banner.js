const express = require('express');
const router = express.Router();
const bannerService = require('../services/bannerService');
const { formatResponse } = require('../utils/tool');

/**
 * Get all banners
 * GET /api/banner
 */
router.get('/', async (req, res) => {
  try {
    const banners = await bannerService.getAllBanners();
    res.json(formatResponse(banners, ""));
  } catch (error) {
    // If the error has a response method (our custom errors), use it
    if (typeof error.response === 'function') {
      return res.status(error.code || 500).json(error.response());
    }
    
    // Otherwise return a generic error
    res.status(500).json({
      code: 500,
      msg: error.message || 'Server error',
      data: null
    });
  }
});

/**
 * Replace all banners
 * POST /api/banner
 */
router.post('/', async (req, res) => {
  try {
    const bannerData = req.body;
    const result = await bannerService.replaceBanners(bannerData);
    res.json(formatResponse(result, ""));
  } catch (error) {
    // If the error has a response method (our custom errors), use it
    if (typeof error.response === 'function') {
      return res.status(error.code || 500).json(error.response());
    }
    
    // Otherwise return a generic error
    res.status(500).json({
      code: 500,
      msg: error.message || 'Server error',
      data: null
    });
  }
});

module.exports = router;
