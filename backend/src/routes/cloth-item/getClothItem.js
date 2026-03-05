const express = require("express");
const router = express.Router();
const Clothing = require('../../schemas/clothing');
const { STATUS_NOT_FOUND, STATUS_INTERNAL_SERVER_ERROR } = require('../utils/constants');




router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { fields } = req.query;

    // Convert comma-separated fields into space-separated string for Mongoose
    const projection = fields
      ? fields.split(",").join(" ")
      : null;

    const clothing = await Clothing.findById(id)
      .select(projection)
      .lean();

    if (!clothing) {
      return res
        .status(STATUS_NOT_FOUND)
        .json({ error: "Clothing not found" });
    }

    res.json(clothing);
  } catch (error) {
    res
      .status(STATUS_INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
});

module.exports = router;