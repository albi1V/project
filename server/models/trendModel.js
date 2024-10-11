// models/MarketTrend.js
const mongoose = require('mongoose');

const marketTrendSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
  },
  marketValue: {
    type: Number,
    required: true,
  },
  ourPrice: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
});

const MarketTrend = mongoose.model('MarketTrend', marketTrendSchema);

module.exports = MarketTrend;
