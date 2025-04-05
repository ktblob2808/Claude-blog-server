const express = require('express');
const router = express.Router();
// ...existing code...

router.use('/login', require('./login'));
router.use('/changePassword', require('./changePassword'));
// ...existing code...

module.exports = router;
