const express = require('express');
const router = express.Router();
const captchaService = require('../services/captchaService');

router.get('/captcha', (req, res) => {
  const captcha = captchaService.generateCaptcha();
  
  // Store captcha text in session
  req.session.captcha = captcha.text;
  
  // Set response headers
  res.setHeader('Content-Type', 'image/svg+xml');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  
  // Send SVG image as response
  res.send(captcha.svg);
});

module.exports = router;
