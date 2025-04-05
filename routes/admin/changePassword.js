const express = require('express');
const router = express.Router();
const md5 = require('md5');
const { Admin } = require('../../models');
const { ValidationError } = require('../../utils/errors');

router.post('/', async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;
    
    if (!oldPassword || !newPassword) {
      throw new ValidationError('Old password and new password are required');
    }
    
    // Find admin account
    const admin = await Admin.findOne();
    
    if (!admin) {
      throw new ValidationError('Admin account not found');
    }
    
    // Validate old password
    if (admin.password !== md5(oldPassword)) {
      throw new ValidationError('Old password is incorrect');
    }
    
    // Update with new password
    admin.password = md5(newPassword);
    await admin.save();
    
    // Return same object as login route
    res.json({
      id: admin._id,
      username: admin.username,
      token: admin.token
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
