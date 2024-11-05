const MarketTrend = require('../models/trendModel');

// Add new market trend (Admin)
const addMarketTrend = async (req, res) => {
  try {
    const { productName, marketValue, date, ourPrice} = req.body;

    // Validate required fields
    if (!productName || !marketValue || !date || !ourPrice) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Create a new market trend document
    const marketTrend = new MarketTrend({ productName, marketValue, date, ourPrice });

    // Save it to the database
    await marketTrend.save();

    res.status(201).json({ message: 'Market trend added successfully!', marketTrend });
  } catch (error) {
    console.error('Error adding market trend:', error); // Log the error
    res.status(500).json({ message: 'Failed to add market trend', error });
  }
};

// Get all market trends (Farmers)
const getMarketTrends = async (req, res) => {
  try {
    const trends = await MarketTrend.find();
    res.status(200).json(trends);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch market trends', error });
  }
};
module.exports = { addMarketTrend, getMarketTrends };
