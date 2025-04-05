const blogDao = require("../dao/blogDao");
const BlogType = require("../models/blogTypeModel");
const { ServiceError } = require("../errors/index");
const jwt = require('jsonwebtoken');
const blogTypeDao = require('../dao/blogTypeDao');

/**
 * Blog Service
 * Handles business logic for blog operations
 */

/**
 * Add a new blog
 * Validates inputs and handles default values
 * @param {Object} newBlog - Blog data to add
 * @returns {Promise<Object>} - The newly created blog
 * @throws {ServiceError} - If validation fails
 */
exports.addBlog = async function (newBlog) {
  // Validate required fields
  if (!newBlog.title) {
    throw new ServiceError("Blog title is required");
  }
  
  if (!newBlog.description) {
    throw new ServiceError("Blog description is required");
  }
  
  if (!newBlog.htmlContent) {
    throw new ServiceError("Blog content is required");
  }
  
  if (!newBlog.thumb) {
    throw new ServiceError("Blog thumbnail is required");
  }
  
  // Set default values for counter fields
  newBlog.scanNumber = 0;
  newBlog.commentNumber = 0;
  
  
  // If toc is not provided, set it to empty string
  newBlog.toc = JSON.stringify('[]');
  
  // Validate that categoryId exists in blogType if provided
  if (newBlog.categoryId) {
    const blogType = await BlogType.findByPk(newBlog.categoryId);
    if (!blogType) {
      throw new ServiceError(`Blog category with ID ${newBlog.categoryId} does not exist`);
    }
  }
  
  // Add the blog through DAO layer
  return await blogDao.addBlog(newBlog);
};

/**
 * Get blogs with pagination and optional category filtering
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number for pagination
 * @param {number} params.limit - Number of items per page
 * @param {number|string} params.categoryId - Optional category filter
 * @returns {Promise<Object>} - Object containing blogs data and pagination info
 * @throws {ServiceError} - If validation fails
 */
exports.getBlogs = async function (params) {
  // Validate and parse pagination parameters
  const page = parseInt(params.page) || 1;
  const limit = parseInt(params.limit) || 10;
  
  if (page < 1) {
    throw new ServiceError("Page must be greater than 0");
  }
  
  if (limit < 1) {
    throw new ServiceError("Limit must be greater than 0");
  }
  
  // Process categoryId parameter
  let categoryId = null;
  
  if (params.categoryId) {
    // Skip category validation for -1 (all categories)
    if (params.categoryId === "-1") {
      categoryId = -1;
    } else {
      // Parse and validate categoryId
      categoryId = parseInt(params.categoryId);
      
      if (isNaN(categoryId)) {
        throw new ServiceError("CategoryId must be a number");
      }
      
      // Verify categoryId exists
      const blogType = await BlogType.findByPk(categoryId);
      if (!blogType) {
        throw new ServiceError(`Blog category with ID ${categoryId} does not exist`);
      }
    }
  }
  
  // Get blogs through DAO layer
  return await blogDao.getBlogs({
    page,
    limit,
    categoryId
  });
};

/**
 * Get a single blog by ID
 * @param {number} id - Blog ID
 * @param {string} token - JWT token
 * @returns {Promise<Object>} - The blog data
 * @throws {Error} - If blog is not found
 */
exports.getBlogById = async (id, token) => {
  // Check if token exists to determine if it's admin or client side
  let isAdmin = false;
  
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded) {
        isAdmin = true;
      }
    } catch (err) {
      // Invalid token, treat as client side
      isAdmin = false;
    }
  }
  
  // Get the blog with associated blog type information
  const blog = await blogDao.getBlogById(id);
  
  if (!blog) {
    throw new Error('Blog not found');
  }
  
  // Only increase the scan number if it's from client side
  if (!isAdmin) {
    await blogDao.increaseScanNumber(id);
    blog.scanNumber += 1; // Update the returned object as well
  }
  
  // Get blog type information
  const blogType = await blogTypeDao.getBlogTypeById(blog.blogTypeId);
  blog.blogType = blogType;
  
  return blog;
};

/**
 * Edit a blog
 * @param {number} id - Blog ID
 * @param {Object} blogData - Blog data to update
 * @returns {Promise<Object>} - The updated blog
 * @throws {Error} - If blog is not found
 */
exports.editBlog = async (id, blogData) => {
  // Check if blog exists
  const blog = await blogDao.getBlogById(id);
  if (!blog) {
    throw new Error('Blog not found');
  }
  
  // Update the blog
  const updatedBlog = await blogDao.updateBlog(id, blogData);
  return updatedBlog;
};

/**
 * Delete a blog
 * @param {number} id - Blog ID
 * @returns {Promise<Object>} - The result of the deletion
 * @throws {Error} - If blog is not found
 */
exports.deleteBlog = async (id) => {
  // Check if blog exists
  const blog = await blogDao.getBlogById(id);
  if (!blog) {
    throw new Error('Blog not found');
  }
  
  // Delete the blog
  const result = await blogDao.deleteBlog(id);
  
  // Reduce article count in blogType table
  await blogTypeDao.decrementArticleCount(blog.blogTypeId);
  
  return result;
};
