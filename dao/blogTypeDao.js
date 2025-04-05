const BlogType = require("../models/blogTypeModel");

// Add a new blog type
exports.addBlogType = async function (blogTypeInfo) {
  const result = await BlogType.create(blogTypeInfo);
  return result.toJSON();
};

// Get a blog type by ID
exports.getBlogTypeById = async function (id) {
  const result = await BlogType.findByPk(id);
  if (result) {
    return result.toJSON();
  }
  return null;
};

// Get all blog types sorted by order
exports.getAllBlogTypes = async function () {
  const result = await BlogType.findAll({
    order: [["order", "ASC"]]
  });
  return result.map(item => item.toJSON());
};

// Update a blog type by ID
exports.updateBlogType = async function (id, blogTypeInfo) {
  await BlogType.update(blogTypeInfo, {
    where: {
      id
    }
  });
  const updatedBlogType = await BlogType.findByPk(id);
  return updatedBlogType ? updatedBlogType.toJSON() : null;
};

// Delete a blog type by ID
exports.deleteBlogType = async function (id) {
  const blogType = await BlogType.findByPk(id);
  if (blogType) {
    const articleCount = blogType.articleCount;
    await blogType.destroy();
    return { articleCount };
  }
  return null;
};
exports.decrementArticleCount = async (id) => {
  const blogType = await BlogType.findByPk(id);
  if (blogType) {
    blogType.articleCount = Math.max(0, blogType.articleCount - 1); // Ensure articleCount doesn't go below 0
    await blogType.save();
    return blogType.toJSON();
  }
  return null;
};