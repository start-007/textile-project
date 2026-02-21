const express = require("express");
const router = express.Router();
const Clothing = require('../../schemas/clothing');


router.get("/health", (req, res) => {
  res.json({ status: "ok", message: "GET route is working" });
});
router.get("/:id", async (req, res) => {
  try {
    const clothing = await Clothing.findById(req.params.id);
    if (!clothing) {
      return res.status(404).json({ error: "Clothing not found" });
    }
    res.json(clothing);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;