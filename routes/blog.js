const express = require("express");
const router = express.Router();
const blogService = require("../services/blogService");
const { formatResponse } = require("../utils/tool");

/**
 * Blog Routes
 * Handles HTTP requests for blog operations
 */

/**
 * @route POST /api/blog
 * @desc Add a new blog
 * @access Private
 */
router.post("/", async (req, res, next) => {
  try {
    // Extract blog data from request body
    const blogData = req.body;
    
    // Add the blog through service layer
    const result = await blogService.addBlog(blogData);
    
    // Return success response with the created blog
    res.json(formatResponse(result, ""));
  } catch (error) {
    // Pass error to error handling middleware
    next(error);
  }
});

/**
 * @route GET /api/blog
 * @desc Get blogs with pagination and optional category filter
 * @access Public
 * @param {number} page - Page number (default: 1)
 * @param {number} limit - Number of items per page (default: 10)
 * @param {number} categoryId - Category ID filter, -1 for all (optional)
 */
router.get("/", async (req, res, next) => {
  try {
    // Extract query parameters
    const { page, limit, categoryId } = req.query;
    
    // Get blogs through service layer
    const result = await blogService.getBlogs({ page, limit, categoryId });
    
    // Return success response with blogs data
    res.json(formatResponse(result));
  } catch (error) {
    // Pass error to error handling middleware
    next(error);
  }
});

// Get a single blog by id
router.get("/:id", async (req, res) => {
  try {
    // Extract token if available to determine if admin or client
    const token = req.headers.authorization ? req.headers.authorization.split(" ")[1] : null;
    const blogId = req.params.id;
    const result = await blogService.getBlogById(blogId, token);
    res.send(formatResponse(true, result));
  } catch (err) {
    res.send(formatResponse(false, null, err.message));
  }
});

// Edit a blog post
router.put("/:id", async (req, res) => {
  try {
    const blogId = req.params.id;
    const blogData = req.body;
    const result = await blogService.editBlog(blogId, blogData);
    res.send(formatResponse(true, result));
  } catch (err) {
    res.send(formatResponse(false, null, err.message));
  }
});

// Delete a blog post
router.delete("/:id", async (req, res) => {
  try {
    const blogId = req.params.id;
    const result = await blogService.deleteBlog(blogId);
    res.send(formatResponse(true, result));
  } catch (err) {
    res.send(formatResponse(false, null, err.message));
  }
});

module.exports = router;
