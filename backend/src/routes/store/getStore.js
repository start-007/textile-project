const express = require("express");
const router = express.Router();
const Clothing = require('../../schemas/clothing');
const Review = require('../../schemas/review');
const { STATUS_NOT_FOUND, GENDER_TYPES, STATUS_INTERNAL_SERVER_ERROR } = require('../utils/constants');

router.get("/health", (req, res) => {
  res.json({ status: "ok", message: "GET Store Clothing route is working" });
});

router.get("/:gender", async (req, res) => {
  try {
    const { gender } = req.params;

    const retrieveFields = { title: 1, product_options: 1, product_type: 1, _id: 1, gender: 1, product_reviews_id: 1 };

    // Use lean() to get plain JS objects directly
    const clothingQuery = (GENDER_TYPES.ALL === gender) 
      ? Clothing.find({}, retrieveFields).lean()
      : Clothing.find({ gender }, retrieveFields).lean();

    const clothingItems = await clothingQuery;

    if (!clothingItems || clothingItems.length === 0) {
       res.json([]); // Return empty array if no items found
        return;
    }

    const reviewIds = clothingItems
      .map(item => item.product_reviews_id)
      .filter(id => id); // remove nulls

    const ratings = await Review.find(
      { _id: { $in: reviewIds } },
      { rating: 1, reviewCount: 1 }
    ).lean();

    const ratingMap = {};
    ratings.forEach(r => {
      ratingMap[r._id.toString()] = r;
    });

    // Map over clothing items and attach ratings
    const updatedItems = clothingItems.map(item => {
      const ratingData = ratingMap[item.product_reviews_id?.toString()];
      return {
        ...item,
        rating: ratingData ? ratingData.rating : 0,
        reviewCount: ratingData ? ratingData.reviewCount : 0
      };
    });

    res.json(updatedItems);

  } catch (error) {
    res.status(STATUS_INTERNAL_SERVER_ERROR).json({
      error: error.message
    });
  }
});

module.exports = router;