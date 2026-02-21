const mongoose = require('mongoose');
const { Schema } = mongoose;

const clothingSchema = new Schema({
  title: { type: String, required: true }, // fixed typo 'tile' -> 'title'
  product_type: { type: String, required: true },
  mp_des_title_to_description: { type: Map, of: String }, // Map<String, String>
  product_options: {
    type: Map,
    of: new Schema({
      mp_sizes_to_stock: { type: Map, of: Number },
      price: { type: Number, required: true },
      priceAdjustment: { type: Number, default: 0 },
      images: [{ type: String }], // S3 URLs
      videos: [{ type: String }]  // S3 URLs
    }, { _id: false }) // prevent auto _id for nested schema
  },
  product_reviews_id: { type: Schema.Types.ObjectId, ref: 'Review' }, // single review reference
  product_image: [{ type: String, required: true }], // s3 urls
  product_video: [{ type: String, required: true }], // s3 urls

});

module.exports = mongoose.model('Clothing', clothingSchema);