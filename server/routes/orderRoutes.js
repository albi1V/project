const express = require('express');
const router = express.Router();

const { getBuyerOrders, getSellerOrders,approveOrder, declineOrder, } = require('../controllers/orderController'); // Importing the controller functions
const authMiddleware = require('../middleware/authMiddleware'); // Importing the authentication middleware

// Route to get buyer's orders
router.get('/buyer-orders', authMiddleware, getBuyerOrders);

// Route to get seller's orders
router.get('/seller-orders', authMiddleware, getSellerOrders);

router.put('/approve-order/:orderId', authMiddleware, approveOrder);
router.put('/decline-order/:orderId', authMiddleware, declineOrder);

module.exports = router;
