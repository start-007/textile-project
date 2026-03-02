
const mongoose = require('mongoose');   

const { Schema } = mongoose;

const reviewSchema = new Schema({
    review: [{
        title: { type: String, required: true },
        description: { type: String, required: true },
        rating: { type: Number, required: true },
        images: [{ type: String  }], // array of s3 urls
        videos: [{ type: String  }],// array of s3 urls
        date: { type: Date, default: Date.now }
    }],
    rating: { type: Number, default: 0 }, // average rating for the clothing item
    reviewCount: { type: Number, default: 0 }, // total number of reviews for the clothing item
    clothing_Id: { type: Schema.Types.ObjectId, ref: 'Clothing' }
});

module.exports = mongoose.model('Review', reviewSchema);