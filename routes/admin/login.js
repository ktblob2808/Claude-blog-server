const express = require('express');
const router = express.Router();
const { ValidationError } = require('../../utils/errors');
// ...existing code...

router.post('/', async (req, res, next) => {
  try {
    const { username, password, captcha } = req.body;

    // Check if all required fields are provided
    if (!username || !password || !captcha) {
      throw new ValidationError('Username, password and captcha are required');
    }

    // Validate captcha
    if (!req.session.captcha || req.session.captcha.toLowerCase() !== captcha.toLowerCase()) {
      throw new ValidationError('Invalid captcha');
    }

    // Clear the captcha from session after validation
    req.session.captcha = null;

    // Continue with existing login logic
    // ...existing code...
  } catch (error) {
    next(error);
  }
});

module.exports = router;
