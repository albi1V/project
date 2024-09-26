const User=require('../models/userModel')
exports.getUserData = async (req, res) => {
    const { email } = req.params;  // Get email from URL params
    
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.json({
        username: user.username,
        role: user.role,
        address: user.address,
        phone: user.phone,
        email: user.email,
        createdAt: user.createdAt,
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
      res.status(500).json({ message: "Server error" });
    }
  };


  exports.updateUserProfile = async (req, res) => {
    const { email } = req.params;
    const { username, address, phone } = req.body;
  
    try {
      // Find the user by email
      const user = await User.findOne({ email });
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Update the user details
      user.username = username || user.username;
      user.address = address || user.address;
      user.phone = phone || user.phone;
  
      // Save the updated user details to the database
      const updatedUser = await user.save();
  
      res.json({
        message: 'Profile updated successfully',
        user: {
          username: updatedUser.username,
          address: updatedUser.address,
          phone: updatedUser.phone,
          email: updatedUser.email,
          role: updatedUser.role,
          updatedAt: updatedUser.updatedAt,
        },
      });
    } catch (error) {
      console.error('Error updating user profile:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  

  


  