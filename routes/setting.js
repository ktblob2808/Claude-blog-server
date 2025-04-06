const express = require("express");
const router = express.Router();
const settingService = require("../services/settingService");
const { formatResponse } = require("../utils/tool");

/**
 * @route GET /api/setting
 * @desc Get site settings
 * @access Public
 */
router.get("/", async (req, res, next) => {
  try {
    const result = await settingService.getSetting();
    res.json(formatResponse(result));
  } catch (error) {
    res.status(500).json(formatResponse(null, error.message, 1));
  }
});

/**
 * @route PUT /api/setting
 * @desc Update site settings
 * @access Private
 */
router.put("/", async (req, res, next) => {
  try {
    const updateData = req.body;
    const result = await settingService.updateSetting(updateData);
    res.json(formatResponse(result, ""));
  } catch (error) {
    res.status(500).json(formatResponse(null, error.message, 1));
  }
});

module.exports = router;
