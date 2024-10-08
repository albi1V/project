const express = require('express');
const { addToCart, getCart, removeFromCart } = require('../controllers/cartConrtoller');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware'); // Middleware for authentication

// Add product to cart
router.post('/addcart', authMiddleware, addToCart);

// Get user's cart
router.get('/getcart', authMiddleware, getCart);

// // Remove product from cart
// router.delete('/deletecart/:productId', authMiddleware, removeFromCart);

module.exports = router;
