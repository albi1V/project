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


  


  