const express = require("express");
const router = express.Router();
const Clothing = require('../../schemas/clothing');
const statusCodes = require('../utils/constants');


router.post("/save-item", async (req, res) => {
    try {
        const {
            title,
            product_type,
            mp_sizes_to_count,
            product_image,
            product_video,
            product_options // should be an object keyed by color
        } = req.body;

        // Convert plain object to Mongoose Map
        const optionsMap = new Map();
        if (product_options && typeof product_options === "object") {
            for (const [color, optionData] of Object.entries(product_options)) {
                optionsMap.set(color, optionData);
            }
        }

        const newClothing = new Clothing({
            title,
            product_type,
            mp_sizes_to_count,
            product_image,
            product_video,
            product_options: optionsMap
        });

        const savedClothing = await newClothing.save();
        res.status(statusCodes.STATUS_CREATED).json(savedClothing);

    } catch (error) {
        console.error(error);
        res.status(statusCodes.STATUS_BAD_REQUEST).json({ error: error.message });
    }
}); 

module.exports = router;