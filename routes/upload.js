const express = require('express');
const router = express.Router();
const { upload, formatResponse } = require('../utils/tool');
const path = require('path');
const multer = require("multer");
const { UploadError } = require('../errors/index');
/**
 * @route POST /api/upload
 * @desc Upload an image file
 * @access Public
 */
// Fix: Change route path from '/upload' to '/' since the full path will be '/api/upload'
router.post('/upload', (req, res, next) => {
  // Use multer upload instance with single file upload
  // Make sure 'image' matches the field name used in the client form
  upload.single('file')(req, res, function(err){
        if (err instanceof multer.MulterError) {
            next(new UploadError("Failed to upload the file. Please check the file size and make sure it is within 2MB."));
        } else {
            const filePath = `/static/uploads/${req.file.filename}`;
            res.json(formatResponse(filePath, ''));
        }
    });
});


module.exports = router;
