const express = require("express");
const router = express.Router();
const blogTypeService = require("../services/blogTypeService");
const { formatResponse } = require("../utils/tool");

/**
 * @route POST /api/blogtype
 * @desc Add a new blog type
 * @access Private
 */
router.post("/", async (req, res, next) => {
  try {
    const { name, order } = req.body;
    const result = await blogTypeService.addBlogType({ name, order });
    res.json(formatResponse(result, ""));
  } catch (error) {
    res.status(500).json(formatResponse(null, error.message, 1));
  }
});

/**
 * @route GET /api/blogtype/:id
 * @desc Get a blog type by ID
 * @access Public
 */
router.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await blogTypeService.getBlogTypeById(id);
    res.json(formatResponse(result));
  } catch (error) {
    res.status(500).json(formatResponse(null, error.message, 1));
  }
});

/**
 * @route GET /api/blogtype
 * @desc Get all blog types
 * @access Public
 */
router.get("/", async (req, res, next) => {
  try {
    const result = await blogTypeService.getAllBlogTypes();
    res.json(formatResponse(result));
  } catch (error) {
    res.status(500).json(formatResponse(null, error.message, 1));
  }
});

/**
 * @route PUT /api/blogtype/:id
 * @desc Update a blog type by ID
 * @access Private
 */
router.put("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const updateData = req.body;
    const result = await blogTypeService.updateBlogType(id, updateData);
    res.json(formatResponse(result, ""));
  } catch (error) {
    res.status(500).json(formatResponse(null, error.message, 1));
  }
});

/**
 * @route DELETE /api/blogtype/:id
 * @desc Delete a blog type by ID
 * @access Private
 */
router.delete("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await blogTypeService.deleteBlogType(id);
    res.json(formatResponse(result.articleCount, ""));
  } catch (error) {
    res.status(500).json(formatResponse(null, error.message, 1));
  }
});

module.exports = router;
