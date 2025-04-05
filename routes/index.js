var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// Add captcha route - excluded from token validation
router.use('/res', require('./captcha'));

module.exports = router;
