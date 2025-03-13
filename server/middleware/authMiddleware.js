const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const STATUS_CODES = {
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

const authMiddleware = async (req, res, next) => {
  try {
    // Check if the authorization header exists
    const authHeader = req.headers.authorization;

    //console.log('Authorization Header:', authHeader);

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(STATUS_CODES.UNAUTHORIZED).json({ message: 'Authorization header is missing or improperly formatted. Please provide a Bearer token.' });
    }

    // Extract token from "Bearer <token>"
    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(STATUS_CODES.UNAUTHORIZED).json({ message: 'Authorization token is missing.' });
    }

    // Verify the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user by decoded ID, excluding password
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(STATUS_CODES.NOT_FOUND).json({ message: 'User not found.' });
    }

    // Check if the user is blocked
    if (user.isBlocked) {
      return res.status(STATUS_CODES.FORBIDDEN).json({ message: 'Your account is blocked. Please contact the administrator.' });
    }

    // Attach user data to request object for further use
    req.user = user;
    req.userId = user._id;

    next(); // Proceed to the next middleware or route
  } catch (error) {
    // Handle token-related errors with specific messages
    if (error.name === 'TokenExpiredError') {
      return res.status(STATUS_CODES.UNAUTHORIZED).json({ message: 'Token expired. Please log in again.' });
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(STATUS_CODES.UNAUTHORIZED).json({ message: 'Invalid token. Please provide a valid token.' });
    } else {
      // Log any unexpected errors and respond
      console.error('Authentication error:', error.message);
      return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: 'Authentication failed. Please try again later.' });
    }
  }
};

module.exports = authMiddleware;
