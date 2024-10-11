

const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const authMiddleware = async (req, res, next) => {
  
  try {
    // Check if the authorization header is present
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'Authorization header is required.' });
    }

    // Extract the token from the header (assumes "Bearer <token>")
    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Bearer token is required.' });
    }

    // Verify the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch the user from the database using the decoded ID
    const user = await User.findById(decoded.id);
    
    // Check if user exists
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Attach the user and userId to the request object
    req.user = user; // Attach full user object
    req.userId = user._id; // Attach just the user ID

    // Continue to the next middleware or route
    next();
  } catch (error) {
    // Handle token-related errors
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Your session has expired. Please log in again.' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token. Please provide a valid token.' });
    }

    // Handle other errors (e.g., DB or server issues)
    console.error('Authentication error:', error.message);
    return res.status(500).json({ message: 'An error occurred during authentication. Please try again later.' });
  }
};

module.exports = authMiddleware;
