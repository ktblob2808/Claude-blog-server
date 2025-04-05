const express = require('express');
const router = express.Router();
const adminService = require('../services/adminService');

/**
 * Admin login
 * POST /api/admin/login
 */
router.post('/login', async (req, res) => {
  try {
    const { loginId, loginPwd } = req.body;
    const result = await adminService.login(loginId, loginPwd);
    
    // Set session data if you want to keep the user logged in
    if (req.session) {
      req.session.adminInfo = result.data;
    }
    
    res.json(result);
  } catch (error) {
    // If the error has a response method (our custom errors), use it
    if (typeof error.response === 'function') {
      return res.status(error.code || 500).json(error.response());
    }
    
    // Otherwise return a generic error
    res.status(500).json({
      success: false,
      error: {
        message: error.message || 'Server error',
        code: 500
      }
    });
  }
});

module.exports = router;
