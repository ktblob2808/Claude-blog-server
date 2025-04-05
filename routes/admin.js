const express = require('express');
const router = express.Router();
const adminService = require('../services/adminService');
const { formatResponse } = require('../utils/tool');
const jwt = require('jsonwebtoken');
const adminDao = require('../dao/adminDao');
const { ValidationError } = require('../errors');
const md5 = require('md5');

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

router.put('/', async (req, res, next) => {
  try {
    const { loginId, oldLoginPwd, loginPwd } = req.body;
    
    if (!oldLoginPwd || !loginPwd) {
      throw new ValidationError('Old password and new password are required');
    }
    
    // Find admin account
    const admin = await adminDao.findAdmin(loginId, oldLoginPwd);
    
    
    if (!admin) {
      throw new ValidationError('Admin account not found');
    }
    
    // Validate old password
    if (admin.dataValues.loginPwd !== md5(oldLoginPwd)) {
      throw new ValidationError('Old password is incorrect');
    }
    
    // Update with new password
        await adminDao.updateAdminDao({
            name: req.body.name,
            loginId: req.body.loginId,
            loginPwd: req.body.loginPwd
        })
    

    res.json(formatResponse({
      id: admin.id,
      loginId: admin.loginId,
      name: admin.name
    }, ''
    , 0));
  } catch (error) {
    next(error);
  }
});


module.exports = router;
