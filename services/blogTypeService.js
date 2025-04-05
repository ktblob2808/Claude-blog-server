const blogTypeDao = require("../dao/blogTypeDao");

// Add a new blog type
exports.addBlogType = async function (newBlogType) {
  // Validate blog type data
  if (!newBlogType.name || !newBlogType.order) {
    throw new Error("Name and order are required");
  }
  
  
  // Set articleCount to 0 by default
  newBlogType.articleCount = 0;
  
  return await blogTypeDao.addBlogType(newBlogType);
};

// Get a blog type by ID
exports.getBlogTypeById = async function (id) {
  if (!id) {
    throw new Error("Blog type ID is required");
  }
  
  const blogType = await blogTypeDao.getBlogTypeById(id);
  if (!blogType) {
    throw new Error("Blog type not found");
  }
  
  return blogType;
};

// Get all blog types
exports.getAllBlogTypes = async function () {
  return await blogTypeDao.getAllBlogTypes();
};

// Update a blog type by ID
exports.updateBlogType = async function (id, blogTypeInfo) {
  if (!id) {
    throw new Error("Blog type ID is required");
  }
  
  // Check if blog type exists
  const exists = await blogTypeDao.getBlogTypeById(id);
  if (!exists) {
    throw new Error("Blog type not found");
  }
  
  // Validate update data
//   if (blogTypeInfo.name === "") {
//     throw new Error("Blog type name cannot be empty");
//   }
  
//   if (blogTypeInfo.order !== undefined && typeof blogTypeInfo.order !== "number") {
//     throw new Error("Blog type order must be a number");
//   }
  
  
  // Don't allow articleCount to be modified from this endpoint
//   if (blogTypeInfo.articleCount !== undefined) {
//     delete blogTypeInfo.articleCount;
//   }
  
  return await blogTypeDao.updateBlogType(id, blogTypeInfo);
};

// Delete a blog type by ID
exports.deleteBlogType = async function (id) {
  if (!id) {
    throw new Error("Blog type ID is required");
  }
  
  // Check if blog type exists
  const exists = await blogTypeDao.getBlogTypeById(id);
  if (!exists) {
    throw new Error("Blog type not found");
  }
  
  // Check if blog type has articles
  if (exists.articleCount > 0) {
    throw new Error("Cannot delete blog type with associated articles");
  }
  
  return await blogTypeDao.deleteBlogType(id);
};
