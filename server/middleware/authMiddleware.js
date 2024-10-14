const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const authMiddleware = async (req, res, next) => {
  try {
    // Check if the authorization header exists
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'Authorization header is missing. Please provide a token.' });
    }

    // Ensure the token is in the format "Bearer <token>"
    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Authorization token is missing.' });
    }

    // Verify the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user by decoded ID
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Check if the user is blocked
    if (user.isBlocked) {
      return res.status(403).json({ message: 'Your account is blocked. Please contact the administrator.' });
    }

    // Attach user and user ID to request object
    req.user = user;
    req.userId = user._id;

    next(); // Proceed to next middleware or route
  } catch (error) {
    // Handle token-related errors
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired. Please log in again.' });
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token. Please provide a valid token.' });
    } else {
      // Handle other errors
      console.error('Authentication error:', error.message);
      return res.status(500).json({ message: 'Authentication failed. Please try again later.' });
    }
  }
};

module.exports = authMiddleware;
