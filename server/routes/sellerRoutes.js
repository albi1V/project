const express = require("express");
const router = express.Router();
const { getOrderAnalysis } = require("../controllers/analysysController");
const authMiddleware = require('../middleware/authMiddleware'); 

router.get("/order-analysis/:sellerId", getOrderAnalysis,authMiddleware);

module.exports = router;
