const Message = require("../models/messageModel");
const Blog = require("../models/blogModel");
const { Op } = require("sequelize");

// Add a new message or comment
exports.addMessage = async function (messageInfo) {
  const result = await Message.create(messageInfo);
  return result.toJSON();
};

// Get messages or comments with pagination
exports.getMessages = async function (blogId, page = 1, limit = 10) {
  const offset = (page - 1) * limit;
  
  let whereCondition = {};
  
  // Handle different query conditions based on blogId
  if (blogId === "all") {
    // Get all comments (where blogId is not null)
    whereCondition = {
      blogId: {
        [Op.ne]: null
      }
    };
  } else if (blogId) {
    // Get comments for a specific blog
    whereCondition = {
      blogId: blogId
    };
  } else {
    // Get all messages (where blogId is null)
    whereCondition = {
      blogId: null
    };
  }
  
  const { count, rows } = await Message.findAndCountAll({
    where: whereCondition,
    include: 
    blogId === 'all' || blogId ? [{ model: Blog, as: 'blog'}] : [],
    order: [["createDate", "DESC"]],
    offset,
    limit: parseInt(limit)
  });
  
  return {
    total: count,
    rows: rows.map(item => item.toJSON())
  };
};

// Delete a message or comment by ID
exports.deleteMessage = async function (id) {
  const message = await Message.findByPk(id);
  if (message) {
    const messageData = message.toJSON();
    await message.destroy();
    return messageData;
  }
  return null;
};

// Increment comment count for a blog
exports.incrementBlogCommentCount = async function (blogId) {
  if (!blogId) return null;
  
  const blog = await Blog.findByPk(blogId);
  if (blog) {
    blog.commentNumber = (blog.commentNumber || 0) + 1;
    await blog.save();
    return blog.toJSON();
  }
  return null;
};

// Decrement comment count for a blog
exports.decrementBlogCommentCount = async function (blogId) {
  if (!blogId) return null;
  
  const blog = await Blog.findByPk(blogId);
  if (blog) {
    blog.commentNumber = Math.max(0, (blog.commentNumber || 0) - 1);
    await blog.save();
    return blog.toJSON();
  }
  return null;
};
