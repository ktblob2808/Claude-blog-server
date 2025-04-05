const Blog = require("../models/blogModel");
const BlogType = require("../models/blogTypeModel");
const sequelize = require("../utils/dbConnect");

/**
 * Data Access Object for Blog
 * Handles all database operations for blogs
 */

/**
 * Add a new blog to the database
 * @param {Object} blogInfo - Blog information to add
 * @returns {Promise<Object>} - The newly created blog
 */
exports.addBlog = async function (blogInfo) {
  // Start a transaction to ensure data consistency between blog and blogType
  const t = await sequelize.transaction();
  
  try {
    // Create the blog within the transaction
    const result = await Blog.create(blogInfo, { transaction: t });
    
    // Increment the articleCount in the related blogType
    if (blogInfo.categoryId) {
      await BlogType.increment('articleCount', { 
        by: 1, 
        where: { id: blogInfo.categoryId },
        transaction: t
      });
    }
    
    // Commit the transaction if everything succeeded
    await t.commit();
    
    return result.toJSON();
  } catch (error) {
    // Rollback the transaction in case of error
    await t.rollback();
    throw error;
  }
};

/**
 * Get blogs with pagination and optional category filtering
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number for pagination
 * @param {number} params.limit - Number of items per page
 * @param {number|null} params.categoryId - Optional category filter
 * @returns {Promise<Object>} - Object containing total count and blog rows
 */
exports.getBlogs = async function ({ page = 1, limit = 10, categoryId }) {
  // Calculate offset for pagination
  const offset = (page - 1) * limit;
  
  // Prepare where condition for filtering
  const whereCondition = {};
  
  // Add categoryId filter if provided and not -1
  if (categoryId && categoryId !== -1) {
    whereCondition.categoryId = categoryId;
  }
  
  // Fetch blogs with pagination and include category information
  const result = await Blog.findAndCountAll({
    where: whereCondition,
    include: [
      {
        model: BlogType,
        as: "category",
        attributes: ["id", "name"] // Only fetch the name of the category
      }
    ],
    offset: parseInt(offset),
    limit: parseInt(limit),
    order: [["createDate", "DESC"]] // Most recent blogs first
  });
  
  // Return formatted result with total count and blog rows
  return {
    count: result.count,
    rows: result.rows.map(row => row.toJSON())
  };
};

// Get a single blog by ID
exports.getBlogById = async (id) => {
  const blog = await Blog.findByPk(id);
  return blog ? blog.toJSON() : null;
};

// Increase scan number for a blog
exports.increaseScanNumber = async (id) => {
  const blog = await Blog.findByPk(id);
  if (blog) {
    blog.scanNumber += 1;
    await blog.save();
    return true;
  }
  return false;
};

// Update a blog
exports.updateBlog = async (id, blogData) => {
  const blog = await Blog.findByPk(id);
  if (blog) {
    await blog.update(blogData);
    return blog.toJSON();
  }
  return null;
};

// Delete a blog
exports.deleteBlog = async (id) => {
  const blog = await Blog.findByPk(id);
  if (blog) {
    await blog.destroy();
    return true;
  }
  return false;
};
