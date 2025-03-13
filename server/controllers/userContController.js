const User = require('../models/userModel');

// Get all users
exports.getUsers = async (req, res) => {
  try {
    // Fetch all users except those with the 'admin' role and exclude passwords
    const users = await User.find({ role: { $ne: 'admin' } }).select('-password');
    res.status(200).json(users); // Return users with a 200 status
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching users.' });
  }
};


// Block a user
exports.blockUser = async (req, res) => {
    try {
      // Check if the user has admin privileges (add your authentication middleware logic here)
      if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Forbidden: Insufficient permissions.' });
      }
  
      // Find the user by their ID
      const user = await User.findById(req.params.id);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found.' }); // Return 404 if user not found
      }
      
      // Check if the user is already blocked
      if (user.isBlocked) {
        return res.status(400).json({ message: 'User is already blocked.' }); // Prevent blocking twice
      }
  
      user.isBlocked = true; // Set user as blocked
      await user.save(); // Save the updated user
      
      res.status(200).json({ message: 'User blocked successfully.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error blocking user.' });
    }
  };
  
  // Unblock a user
  exports.unblockUser = async (req, res) => {
    try {
      // Check if the user has admin privileges (add your authentication middleware logic here)
      if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Forbidden: Insufficient permissions.' });
      }
  
      // Find the user by their ID
      const user = await User.findById(req.params.id);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found.' }); // Return 404 if user not found
      }
  
      // Check if the user is already unblocked
      if (!user.isBlocked) {
        return res.status(400).json({ message: 'User is already unblocked.' }); // Prevent unblocking twice
      }
  
      user.isBlocked = false; // Set user as unblocked
      await user.save(); // Save the updated user
      
      res.status(200).json({ message: 'User unblocked successfully.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error unblocking user.' });
    }
  };
  