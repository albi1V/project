const express = require('express');
const router = express.Router();
const { createOrder, verifyPayment, saveOrder } = require('../controllers/paymentController');

// Define the route to create a Razorpay order
router.post('/order', createOrder);
router.post('/verify', verifyPayment); // Add this line to handle payment verification
router.post('/save-order', saveOrder); 

module.exports = router;
