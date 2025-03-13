const express = require('express');
const router = express.Router();
const { getUsers, blockUser, unblockUser } = require('../controllers/userContController');
const authMiddleware = require('../middleware/authMiddleware'); // For protecting routes

// Route to get all users
router.get('/users',  getUsers);

// Route to block a user
router.put('/block/:id', authMiddleware, blockUser);

// Route to unblock a user
router.put('/unblock/:id', authMiddleware, unblockUser);

module.exports = router;
