const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check if the authorization header is present
  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header missing' });
  }

  const token = authHeader.split(' ')[1];

  // Check if token is present after "Bearer"
  if (!token) {
    return res.status(401).json({ message: 'Token missing' });
  }

  try {
    // Verify the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch the user from the database using the decoded user ID
    const user = await User.findById(decoded.id);
    
    // Check if the user exists in the database
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Attach the user and userId to the request object
    req.user = user; // Full user object if you need more details
    req.userId = user._id; // Only user ID, useful in other controllers

    // Proceed to the next middleware
    next();
  } catch (err) {
    console.error('Authentication error:', err.message); // Log for debugging
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = authMiddleware;

