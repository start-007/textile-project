const mongoose = require('mongoose');
const { Schema } = mongoose;


const clothingSchema = new Schema({
  title: { type: String, required: true }, // clothing title
  title_image: { type: String, required: true }, // front image displayed With all others..
  product_type: { type: String, required: true }, // e.g., shirt, pants, etc.
  mp_des_title_to_description: { type: Map, of: String }, // Something like {"Material": "100% Cotton", "Care": "Machine wash cold"}
  gender: {
    type: String,
    required: true,
    enum: ["men", "women", "unisex"],
    lowercase: true, // optional: ensures stored value is lowercase
  },
  product_options: { // Map of color to its options like sizes, price, images, videos
    type: Map,
    of: new Schema({
      mp_sizes_to_stock: { type: Map, of: Number },
      price: { type: Number, required: true },
      priceAdjustment: { type: Number, default: 0 },
      tax: { type: Number, default: 0 }, // tax percentage for this option
      images: [{ type: String }], // S3 URLs
      videos: [{ type: String }]  // S3 URLs
    }, { _id: false }) // prevent auto _id for nested schema
  },
  mp_delivery_type_to_fee: {  // only 2 delivery types: standard and express
    type: Map,
    of: new Schema({
      base_fee: {
        type: Number,
        required: true,
        min: 0
      },
      price_per_km: {
        type: Number,
        required: true,
        min: 0
      },
      min_km: {
        type: Number,
        default: 0
      },
      max_km: {
        type: Number,
        default: null
      }
    }, { _id: false }),
    default: {}
  },
  product_reviews_id: { type: Schema.Types.ObjectId, ref: 'Review' }, // single review reference
  product_image: [{ type: String, required: true }], // s3 urls
  product_video: [{ type: String, required: true }], // s3 urls

});

module.exports = mongoose.model('Clothing', clothingSchema);