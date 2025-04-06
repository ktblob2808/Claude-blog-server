const express = require("express");
const router = express.Router();
const aboutService = require("../services/aboutService");
const { formatResponse } = require("../utils/tool");

/**
 * @route GET /api/about
 * @desc Get the about information
 * @access Public
 */
router.get("/", async (req, res, next) => {
  try {
    const result = await aboutService.getAbout();
    res.json(formatResponse(result));
  } catch (error) {
    res.status(500).json(formatResponse(null, error.message, 1));
  }
});

/**
 * @route POST /api/about
 * @desc Update the about information
 * @access Private
 */
router.post("/", async (req, res, next) => {
  try {
    const updateData = req.body;
    const result = await aboutService.updateAbout(updateData);
    res.json(formatResponse(result, ""));
  } catch (error) {
    res.status(500).json(formatResponse(null, error.message, 1));
  }
});

module.exports = router;
