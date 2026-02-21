
const express = require("express");

const router = express.Router();

router.get("/health", (req, res) => {
  res.json({ status: "ok", message: "GET route is working 🚀" });
});



module.exports = router;