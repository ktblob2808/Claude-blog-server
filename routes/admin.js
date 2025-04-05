const express = require('express');
const router = express.Router();
const adminService = require('../services/adminService');
const { formatResponse } = require('../utils/tool');
const jwt = require('jsonwebtoken');
const { ValidationError } = require('../errors');

/**
 * Admin login
 * POST /api/admin/login
 */
router.post('/login', async (req, res) => {
  try {
    const { loginId, loginPwd, remember } = req.body;
    const result = await adminService.login(loginId, loginPwd, remember);
    
    // Set session data if you want to keep the user logged in
    if (req.session) {
      req.session.adminInfo = result.data;
    }
    
    // Add token to headers
    if (result.token) {
      res.setHeader('authentication', result.token);
    }
    
    res.json(formatResponse(result.data, "Login success"));
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
 * Get current admin info from token
 * GET /api/admin/whoami
 */
router.get('/whoami', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      throw new ValidationError('No token provided');
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-jwt-secret-key');
    
    res.json(formatResponse({
      id: decoded.id,
      loginId: decoded.loginId,
      name: decoded.name
    }, "Token valid"));
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json(formatResponse(null, "Invalid or expired token", 401));
    }
    
    if (typeof error.response === 'function') {
      return res.status(error.code || 500).json(error.response());
    }
    
    res.status(500).json(formatResponse(null, error.message || 'Server error', 500));
  }
});

module.exports = router;
