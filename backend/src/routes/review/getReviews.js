
const express = require("express");
const Review = require('../../schemas/review');
const router = express.Router();
const { STATUS_NOT_FOUND, STATUS_INTERNAL_SERVER_ERROR } = require('../utils/constants');

router.get("/health", (req, res) => {
  res.json({ status: "ok", message: "GET route is working 🚀" });
});

router.get("/:clothingId", async (req, res) => {
  try {
    const clothingId = req.params.clothingId;
    const reviewDoc = await Review.findOne({ clothing_Id: clothingId });
    if (!reviewDoc) {
      res.json({ rating: 0, reviewCount: 0, review: [] });
      return;
    }
    res.json(reviewDoc);
  } catch (error) {
    res.status(STATUS_INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
});

router.get("/:clothingId/rating", async (req, res) => {
  try {
    const clothingId = req.params.clothingId;
    const reviewDoc = await Review.findOne({ clothing_Id: clothingId });
    if (!reviewDoc) {
      return res.status(STATUS_NOT_FOUND).json({ error: "No reviews found for this clothing item" });
    }
    res.json({ rating: reviewDoc.rating, reviewCount: reviewDoc.reviewCount });
  } catch (error) {
    res.status(STATUS_INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
});

module.exports = router;