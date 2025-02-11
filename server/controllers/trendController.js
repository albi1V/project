const MarketTrend = require("../models/trendModel");

// Add new market trend (Admin)
const addMarketTrend = async (req, res) => {
  try {
    const { productName, marketValue, date, ourPrice } = req.body;

    if (!productName || !marketValue || !date || !ourPrice) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const marketTrend = new MarketTrend({ productName, marketValue, date, ourPrice });
    await marketTrend.save();

    // 🔹 Clear cache when new trend is added
    await req.redisClient.del("market_trends");

    console.log("🗑 Cache cleared: market_trends");
    res.status(201).json({ message: "Market trend added successfully!", marketTrend });
  } catch (error) {
    console.error("❌ Error adding market trend:", error);
    res.status(500).json({ message: "Failed to add market trend", error });
  }
};

// Get all market trends (Farmers)
const getMarketTrends = async (req, res) => {
  try {
    const cacheKey = "market_trends";
    console.time("⏳ Redis Cache Lookup");
    // 🔹 Check Redis cache
    const cachedData = await req.redisClient.get(cacheKey);

    console.timeEnd("⏳ Redis Cache Lookup");

    if (cachedData) {
      console.log("✅ Serving data from cache!");
      return res.status(200).json(JSON.parse(cachedData)); // Return cached data
    }
    console.time("⏳ MongoDB Query Execution");
    // Fetch from MongoDB if cache is empty
    const trends = await MarketTrend.find().sort({ date: -1 });

    console.timeEnd("⏳ MongoDB Query Execution");

    // 🔹 Store data in Redis for 10 minutes
    await req.redisClient.setEx(cacheKey, 600, JSON.stringify(trends));

    // console.log("🛑 Cache Updated:", trends);
    res.status(200).json(trends);
  } catch (error) {
    console.error("❌ Redis/MongoDB Error:", error);
    res.status(500).json({ message: "Failed to fetch market trends", error });
  }
};

module.exports = { addMarketTrend, getMarketTrends };
