// routes/marketTrendRoutes.js
const express = require('express');
const router = express.Router();
const { addMarketTrend,getMarketTrends } = require('../controllers/trendController');

// Route to add a market trend
router.post('/add', addMarketTrend);

router.get('/all', getMarketTrends);

module.exports = router;
