const express = require("express");
const router = express.Router();
const Clothing = require("../../schemas/clothing");
const statusCodes = require("../utils/constants");
const Review = require("../../schemas/review");

router.post("/save-item", async (req, res) => {
  try {
    let {
      title,
      title_image,
      product_type,
      mp_des_title_to_description,
      gender, //men, women, unisex
      product_options, 
      mp_delivery_type_to_fee,
      product_reviews_id,
      product_image,
      product_video
    } = req.body;

    /* -----------------------------
       Convert mp_des_title_to_description → Map
    ----------------------------- */
    const descriptionMap = new Map();
    if (mp_des_title_to_description && typeof mp_des_title_to_description === "object") {
      for (const [key, value] of Object.entries(mp_des_title_to_description)) {
        descriptionMap.set(key, value);
      }
    }

    /* -----------------------------
       Convert product_options → Map
    ----------------------------- */
    const optionsMap = new Map();

    if (product_options && typeof product_options === "object") {
      for (const [color, optionData] of Object.entries(product_options)) {

        const sizeStockMap = new Map();
        if (optionData.mp_sizes_to_stock) {
          for (const [size, stock] of Object.entries(optionData.mp_sizes_to_stock)) {
            sizeStockMap.set(size, stock);
          }
        }

        optionsMap.set(color, {
          mp_sizes_to_stock: sizeStockMap,
          price: optionData.price,
          priceAdjustment: optionData.price || 0,
          tax: optionData.tax || 0,
          images: optionData.images || [],
          videos: optionData.videos || []
        });
      }
    }

    /* -----------------------------
       Convert mp_delivery_type_to_fee → Map
    ----------------------------- */
    const deliveryMap = new Map();

    if (mp_delivery_type_to_fee && typeof mp_delivery_type_to_fee === "object") {
      for (const [deliveryType, feeData] of Object.entries(mp_delivery_type_to_fee)) {
        deliveryMap.set(deliveryType, {
          base_fee: feeData.base_fee,
          price_per_km: feeData.price_per_km,
          min_km: feeData.min_km ?? 0,
          max_km: feeData.max_km ?? null
        });
      }
    }
    
    if (!product_reviews_id) {
      // Create an empty review document and get its ID
      const newReviewDoc = new Review({
        review: [],
        rating: 0,
        reviewCount: 0,
        clothing_Id: null // will update this after creating the clothing item
      });
      const savedReviewDoc = await newReviewDoc.save();
      product_reviews_id = savedReviewDoc._id;
    }

    /* -----------------------------
  
       Create Document
    ----------------------------- */
    const newClothing = new Clothing({
      title,
      title_image,
      product_type,
      mp_des_title_to_description: descriptionMap,
      gender,
      product_options: optionsMap,
      mp_delivery_type_to_fee: deliveryMap,
      product_reviews_id: product_reviews_id || null,
      product_image: product_image || [],
      product_video: product_video || []
    });

    // Update the review document with the clothing item's ID
    if (product_reviews_id) {
      await Review.findByIdAndUpdate(product_reviews_id, { clothing_Id: newClothing._id });
    }
    const savedClothing = await newClothing.save();

    res.status(statusCodes.STATUS_CREATED).json(savedClothing);

  } catch (error) {
    console.error(error);
    res.status(statusCodes.STATUS_BAD_REQUEST).json({
      error: error.message
    });
  }
});

module.exports = router;