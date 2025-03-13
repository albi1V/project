const User=require('../models/userModel')
const bcrypt = require('bcryptjs');



exports.getUserData = async (req, res) => {
  const { email } = req.params;  // Get email from URL params
  
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Include the _id field in the response
    res.json({
      _id: user._id,               // Include the user ID here
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
  


// Admin creation function with default credentials
exports.createAdmin = async (req, res) => {
  try {
    const existingAdmin = await User.findOne({ email: 'admin@gmail.com' });

    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Create the new admin user
    const newAdmin = new User({
      username: 'admin',
      email: 'admin@gmail.com',
      password: hashedPassword,
      role: 'admin', // Set the role to admin
      phone: '0000000000', // Add default phone number if required by schema
      address: 'Admin Office', // Add default address if required by schema
    });

    await newAdmin.save();

    res.status(201).json({ message: "Admin created successfully" });
  } catch (error) {
    console.error('Error creating admin:', error);
    res.status(500).json({ message: "Server error" });
  }
};

  


  