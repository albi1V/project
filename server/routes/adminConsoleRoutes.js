const express = require('express');
const router = express.Router();
const {
  getSellersCount,
  getFarmersCount,
  getProductsCount,
  getPostsCount,
} = require('../controllers/adminConsleController');

// Get the count of sellers
router.get('/scount', getSellersCount);

// Get the count of farmers
router.get('/fcount', getFarmersCount);

// Get the count of products
router.get('/prcount', getProductsCount);

// Get the count of posts
router.get('/pcount', getPostsCount);

module.exports = router;
