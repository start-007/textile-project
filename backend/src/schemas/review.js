
const mongoose = require('mongoose');   

const { Schema } = mongoose;

const reviewSchema = new Schema({
    review: [{
        title: { type: String, required: true },
        description: { type: String, required: true },
        rating: { type: Number, required: true },
        images: [{ type: String  }], // array of s3 urls
        videos: [{ type: String  }] // array of s3 urls

    }],
    clothing_Id: { type: Schema.Types.ObjectId, ref: 'Clothing' }
});

module.exports = mongoose.model('Review', reviewSchema);