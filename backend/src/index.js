const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Import routes
const getClothItemRoutes = require('./routes/get-routes/getClothItem');
const reviewRoutes = require('./routes/get-routes/getReviews');
const postClothItemRoutes = require('./routes/post-routes/postClothItem');
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/get/clothing", getClothItemRoutes); // retrive clothing data..
app.use("/api/post/clothing", postClothItemRoutes); // save clothing data..
app.use("/api/get/reviews", reviewRoutes); // retrive reviews data..

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