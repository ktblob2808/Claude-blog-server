const blogDao = require("../dao/blogDao");
const BlogType = require("../models/blogTypeModel");
const { ServiceError } = require("../errors/index");

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
  
  // Set current date in ISO format
  newBlog.createDate = new Date().toISOString();
  
  // If toc is not provided, set it to empty string
  if (!newBlog.toc) {
    newBlog.toc = "";
  }
  
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
