const mongoose = require('mongoose');
require('dotenv').config();  // Load environment variables

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);  // Using MONGO_URI from .env
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;