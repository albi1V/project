const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  count: { type: Number, required: true }, // Renamed 'count' to 'stock'
  images: [{ type: String, required: true }], // Array of image URLs or filenames
  sellerEmail: { type: String, required: true }, // Seller's email or user reference
  createdAt: { type: Date, default: Date.now }, // Auto-created timestamp
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
