const express = require("express");
const { upload, predictImage } = require("../controllers/mlController");

const router = express.Router();

// Add multer middleware **inside the route**
router.post("/predict", upload, predictImage);

module.exports = router;
