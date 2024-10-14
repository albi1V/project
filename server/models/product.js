const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  count: { type: Number, required: true }, // New field for product count
  images: [{ type: String, required: true }], // Change to an array for multiple images
  sellerEmail: { type: String, required: true }, // Seller's email
  createdAt: { type: Date, default: Date.now },
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
