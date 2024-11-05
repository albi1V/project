const express = require('express');
const { addToCart, getCart, removeFromCart,increaseQuantity,decreaseQuantity } = require('../controllers/cartConrtoller');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware'); // Middleware for authentication

// Route for adding an item to the cart
router.post('/addcart', authMiddleware, addToCart);

// Route for getting the cart items
router.get('/getcart', authMiddleware, getCart);

// Route for removing an item from the cart
router.delete('/remove/:productId', authMiddleware, removeFromCart);


router.put('/increase/:productId', authMiddleware, increaseQuantity);
router.put('/decrease/:productId', authMiddleware, decreaseQuantity);


module.exports = router;

