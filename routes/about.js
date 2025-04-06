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
    const { url } = await aboutService.getAbout();
    res.json(formatResponse(url));
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
    const { url } = await aboutService.updateAbout(updateData);
    res.json(formatResponse(url, ""));
  } catch (error) {
    res.status(500).json(formatResponse(null, error.message, 1));
  }
});

module.exports = router;
