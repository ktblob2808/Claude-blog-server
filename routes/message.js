const express = require("express");
const router = express.Router();
const messageService = require("../services/messageService");
const { formatResponse } = require("../utils/tool");

/**
 * @route GET /api/message
 * @desc Get all messages (blogId is null)
 * @access Public
 */
router.get("/message", async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const result = await messageService.getMessages(null, page, limit);
    res.json(formatResponse(result));
  } catch (error) {
    res.status(500).json(formatResponse(null, error.message, 1));
  }
});

/**
 * @route GET /api/comment
 * @desc Get all comments (blogId is not null)
 * @access Public
 */
router.get("/comment", async (req, res, next) => {
  try {
    const { page = 1, limit = 10, blogId = "all" } = req.query;
    const result = await messageService.getMessages(blogId, page, limit);
    res.json(formatResponse(result));
  } catch (error) {
    res.status(500).json(formatResponse(null, error.message, 1));
  }
});

/**
 * @route POST /api/message
 * @desc Add a new message
 * @access Public
 */
router.post("/message", async (req, res, next) => {
  try {
    const messageInfo = req.body;
    const result = await messageService.addMessage(messageInfo);
    res.json(formatResponse(result, ""));
  } catch (error) {
    res.status(500).json(formatResponse(null, error.message, 1));
  }
});

/**
 * @route POST /api/comment
 * @desc Add a new comment
 * @access Public
 */
router.post("/comment", async (req, res, next) => {
  try {
    const commentInfo = req.body;
    const result = await messageService.addComment(commentInfo);
    res.json(formatResponse(result, ""));
  } catch (error) {
    res.status(500).json(formatResponse(null, error.message, 1));
  }
});

/**
 * @route DELETE /api/message/:id
 * @desc Delete a message by ID
 * @access Private
 */
router.delete("/message/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await messageService.deleteMessage(id);
    res.json(formatResponse(true, ""));
  } catch (error) {
    res.status(500).json(formatResponse(null, error.message, 1));
  }
});

/**
 * @route DELETE /api/comment/:id
 * @desc Delete a comment by ID
 * @access Private
 */
router.delete("/comment/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await messageService.deleteMessage(id);
    res.json(formatResponse(true, ""));
  } catch (error) {
    res.status(500).json(formatResponse(null, error.message, 1));
  }
});

module.exports = router;
