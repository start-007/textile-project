const mongoose = require('mongoose');
const Review = require('../../schemas/review');
const { STATUS_CREATED, STATUS_NOT_FOUND, STATUS_INTERNAL_SERVER_ERROR } = require('../utils/constants');
const express = require("express");
const router = express.Router();

router.put("/update/review", async (req, res) => {
    try {
        const { reviewItemId, title,rating, comment, images, videos } = req.body;

        let reviewDoc = await Review.findOne(reviewItemId);
       
        if (!reviewDoc) {
            res.status(STATUS_NOT_FOUND).json({ error: "Review document not found for the given ID" });
            return;
        }

        reviewDoc.review.push({
            title:title , // you can replace with actual clothing title if available
            description: comment,
            rating,
            images: images || [],
            videos: videos || []
        });

        await reviewDoc.save();
        res.status(STATUS_CREATED).json({ message: reviewItemId ? "Review updated" : "Review added" });

    } catch (error) {
        console.error(error);
        res.status(STATUS_INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
});

module.exports = router;