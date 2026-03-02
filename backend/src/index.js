const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Import routes
const getClothItemRoutes = require('./routes/cloth-item/getClothItem');
const postClothItemRoutes = require('./routes/cloth-item/postClothItem');
const getStoreRoutes = require('./routes/store/getStore');
const getReviewRoutes = require('./routes/review/getReviews');
const putReviewRoutes = require('./routes/review/putReview');

const { API_ROUTES } = require('./routes/utils/constants');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use(API_ROUTES.CLOTH_ITEM, getClothItemRoutes, postClothItemRoutes);
app.use(API_ROUTES.REVIEWS, getReviewRoutes, putReviewRoutes);
app.use(API_ROUTES.STORE, getStoreRoutes);

mongoose.connect(process.env.MONGO_URL)
.then(console.log("DB Connected"))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// API route
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Backend is running 🚀" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});