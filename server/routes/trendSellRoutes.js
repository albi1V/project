const express = require('express');
const router = express.Router();
const { submitSellRequest, acceptRequest, rejectRequest, getAllRequests } = require('../controllers/trendSellController');
const authMiddleware = require('../middleware/authMiddleware');

// Route for submitting a sell request (User)
router.post('/register', authMiddleware, submitSellRequest);

// Route for admin to accept a sell request
router.put('/accept/:id', acceptRequest); // Changed to PUT for state change

// Route for admin to reject a sell request
router.put('/reject/:id', rejectRequest); // Changed to PUT for state change

// Route for admin to get all sell requests
router.get('/',  getAllRequests);

module.exports = router;

