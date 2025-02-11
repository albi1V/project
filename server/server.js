const express = require("express");
const app = express();
const cors = require("cors");
const redis = require("redis"); // Added Redis
const indexRoutes = require("./routes/indexRoutes");
const connectDB = require("./config/database");
const path = require("path");
require("dotenv").config();

// Connect MongoDB
connectDB();

// 🔹 Initialize Redis Client (NEW)
const redisClient = redis.createClient({
  url: "redis://localhost:6379",
});

redisClient.on("error", (err) => console.error("Redis Error:", err));

(async () => {
  await redisClient.connect(); // Connect Redis
  console.log("Redis connected successfully!");
})();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔹 Pass Redis client to all routes (NEW)
app.use((req, res, next) => {
  req.redisClient = redisClient; // Attach Redis to request object
  next();
});

// Use routes
app.use("/api", indexRoutes);

// Handle 404 errors
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
