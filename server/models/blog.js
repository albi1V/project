const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
  },
  image: {
    type: String, // Path to the uploaded image file
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Correctly references the User model
    required: true,
  },
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

module.exports = mongoose.model('Blog', blogSchema);
