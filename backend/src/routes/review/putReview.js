const mongoose = require('mongoose');
const Review = require('../../schemas/review');
const { STATUS_CREATED, STATUS_NOT_FOUND, STATUS_INTERNAL_SERVER_ERROR } = require('../utils/constants');
const express = require("express");
const router = express.Router();

router.put("/update", async (req, res) => {
    try {
        const { reviewItemId, title,rating, comment, images, videos } = req.body;

        let reviewDoc = await Review.findById(reviewItemId);
       
        if (!reviewDoc) {
            res.status(STATUS_NOT_FOUND).json({ error: "Review document not found for the given ID" });
            return;
        }
        // will handle image and video psh to s3 in future, for now just storing the urls sent from frontend
        reviewDoc.review.push({
            title:title , // you can replace with actual clothing title if available
            description: comment,
            rating,
            images: images || [],
            videos: videos || []
        });
        reviewDoc.rating = reviewDoc.review.reduce((acc, item) => acc + item.rating, 0) / reviewDoc.review.length;
        reviewDoc.reviewCount = reviewDoc.review.length;

        await reviewDoc.save();
        res.status(STATUS_CREATED).json({ message: reviewItemId ? "Review updated" : "Review added" });

    } catch (error) {
        console.error(error);
        res.status(STATUS_INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
});

module.exports = router;