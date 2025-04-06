const express = require("express");
const router = express.Router();
const demoService = require("../services/demoService");
const { formatResponse } = require("../utils/tool");

/**
 * @route POST /api/project
 * @desc Add a new demo project
 * @access Private
 */
router.post("/", async (req, res, next) => {
  try {
    const result = await demoService.addDemo(req.body);
    res.json(formatResponse(result, ""));
  } catch (error) {
    res.status(500).json(formatResponse(null, error.message, 1));
  }
});

/**
 * @route GET /api/project/:id
 * @desc Get a demo project by ID
 * @access Public
 */
router.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await demoService.getDemoById(id);
    res.json(formatResponse(result));
  } catch (error) {
    res.status(500).json(formatResponse(null, error.message, 1));
  }
});

/**
 * @route GET /api/project
 * @desc Get all demo projects
 * @access Public
 */
router.get("/", async (req, res, next) => {
  try {
    const result = await demoService.getAllDemos();
    res.json(formatResponse(result));
  } catch (error) {
    res.status(500).json(formatResponse(null, error.message, 1));
  }
});

/**
 * @route PUT /api/project/:id
 * @desc Update a demo project by ID
 * @access Private
 */
router.put("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const updateData = req.body;
    const result = await demoService.updateDemo(id, updateData);
    res.json(formatResponse(result, ""));
  } catch (error) {
    res.status(500).json(formatResponse(null, error.message, 1));
  }
});

/**
 * @route DELETE /api/project/:id
 * @desc Delete a demo project by ID
 * @access Private
 */
router.delete("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await demoService.deleteDemo(id);
    res.json(formatResponse(result, ""));
  } catch (error) {
    res.status(500).json(formatResponse(null, error.message, 1));
  }
});

module.exports = router;
