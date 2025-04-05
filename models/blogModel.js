const { DataTypes } = require("sequelize");
const sequelize = require("../utils/dbConnect");
const BlogType = require("./blogTypeModel");

/**
 * Blog Model
 * Represents a blog post in the system
 * Has relationship with BlogType model (Many blogs to One category)
 */
const Blog = sequelize.define(
  "blog",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      comment: "Primary key for blog"
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "Blog post title"
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: "Brief description of the blog post"
    },
    toc: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: "Table of contents (JSON structure)"
    },
    htmlContent: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: "Main content of the blog in HTML format"
    },
    thumb: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "Thumbnail image path"
    },
    scanNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: "Number of times this blog has been viewed"
    },
    commentNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: "Number of comments on this blog"
    },
    createDate: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "Date when the blog was created"
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "Foreign key to blogtype table",
      references: {
        model: "blogtype",
        key: "id"
      }
    }
  },
  {
    freezeTableName: true, // Use exact table name, no pluralization
    timestamps: false, // Don't add createdAt/updatedAt timestamp fields
    comment: "Blog posts table"
  }
);

/**
 * Define association with BlogType - Each blog belongs to one category
 * This creates the relationship where:
 * 1. One category in blogType table can have many blogs
 * 2. Each blog must have a valid category (if categoryId is provided)
 */
Blog.belongsTo(BlogType, { 
  foreignKey: "categoryId", 
  as: "category",
  onDelete: "SET NULL", // If category is deleted, set categoryId to NULL
  onUpdate: "CASCADE"   // If category id changes, update the reference
});

// Define reverse association (one-to-many)
BlogType.hasMany(Blog, { 
  foreignKey: "categoryId", 
  as: "blogs"
});

module.exports = Blog;
