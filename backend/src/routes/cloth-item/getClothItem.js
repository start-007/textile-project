const express = require("express");
const router = express.Router();
const Clothing = require('../../schemas/clothing');
const { STATUS_NOT_FOUND, STATUS_INTERNAL_SERVER_ERROR } = require('../utils/constants');

router.get("/health", (req, res) => {
  res.json({ status: "ok", message: "GET route is working" });
});


router.get("/:id", async (req, res) => {
  try {
    const clothing = await Clothing.findById(req.params.id).lean();
    if (!clothing) {
      return res.status(STATUS_NOT_FOUND).json({ error: "Clothing not found" });
    }
    res.json(clothing);
  } catch (error) {
    res.status(STATUS_INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
});


module.exports = router;