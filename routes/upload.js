const express = require('express');
const router = express.Router();
const { upload, formatResponse, UploadError } = require('../utils/tool');
const path = require('path');

/**
 * @route POST /api/upload
 * @desc Upload an image file
 * @access Public
 */
router.post('/', (req, res, next) => {
  // Use multer upload instance with single file upload
  upload.single('image')(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return next(new UploadError('File size cannot exceed 2MB', 400));
      }
      if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        return next(new UploadError('Only one file can be uploaded at a time', 400));
      }
      return next(new UploadError(err.message, 400));
    }

    // Check if file exists
    if (!req.file) {
      return next(new UploadError('Please upload an image file', 400));
    }

    // Generate relative path for client use
    const relativePath = `/static/uploads/${path.basename(req.file.path)}`;
    
    // Return success response with file path
    return res.json(formatResponse({
      path: relativePath
    }, 'File uploaded successfully'));
  });
});

module.exports = router;
