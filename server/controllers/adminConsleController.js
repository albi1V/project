const User = require('../models/userModel'); // Adjust the path based on your project structure
const Product = require('../models/product'); // Adjust the path based on your project structure
const Post = require('../models/blog'); // Adjust the path based on your project structure

// Get the count of sellers
const getSellersCount = async (req, res) => {
  try {
    const count = await User.countDocuments({ role: 'seller' }); // Adjust based on your User model
    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sellers count', error });
  }
};

// Get the count of farmers
const getFarmersCount = async (req, res) => {
  try {
    const count = await User.countDocuments({ role: 'farmer' }); // Adjust based on your User model
    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching farmers count', error });
  }
};

// Get the count of products
const getProductsCount = async (req, res) => {
  try {
    const count = await Product.countDocuments(); // Adjust based on your Product model
    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products count', error });
  }
};

// Get the count of posts
const getPostsCount = async (req, res) => {
  try {
    const count = await Post.countDocuments(); // Adjust based on your Post model
    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching posts count', error });
  }
};

module.exports = {
  getSellersCount,
  getFarmersCount,
  getProductsCount,
  getPostsCount,
};
