const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/order'); // Import your Order model
require('dotenv').config();

// Create an instance of Razorpay
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Controller method to create a Razorpay order
exports.createOrder = async (req, res) => {
  const { amount, currency } = req.body;

  const options = {
    amount: amount * 100, // Convert amount to paise
    currency,
    receipt: crypto.randomBytes(10).toString('hex'), // Random unique receipt ID
  };

  try {
    const order = await razorpayInstance.orders.create(options);
    res.json({ orderId: order.id, amount: order.amount });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({ error: 'Failed to create Razorpay order' });
  }
};

// Controller method to verify payment and save order
// paymentController.js
exports.verifyPayment = async (req, res) => {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;
  
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(razorpayOrderId + '|' + razorpayPaymentId)
      .digest('hex');
  
    if (generatedSignature === razorpaySignature) {
      // Payment is verified
      res.json({ success: true });
    } else {
      // Payment verification failed
      res.status(400).json({ success: false, message: 'Payment verification failed' });
    }
  };
  
// Controller method to save the order in the database
exports.saveOrder = async (req, res) => {
  const { userId, shippingAddress, cartItems, totalPrice } = req.body;

  try {
    const newOrder = new Order({
      user: userId, // Ensure userId is passed from the front-end
      shippingAddress,
      cartItems,
      totalPrice,
    });

    const savedOrder = await newOrder.save();
    res.status(201).json({ message: 'Order saved successfully', order: savedOrder });
  } catch (error) {
    console.error("Error saving order:", error);
    res.status(500).json({ error: 'Failed to save order' });
  }
};
