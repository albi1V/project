const User = require('../models/userModel');
const admin= require('firebase-admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
require('dotenv').config();

admin.initializeApp({
  credential: admin.credential.cert(require('../agrispot-cd94f-firebase-adminsdk-oqhvo-b17daec49e.json')), // Add path to your Firebase service account key
});

let otpStore = {};  

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,  
    pass: process.env.EMAIL_PASS,  
  },
}); 

exports.sendOtp = async (req, res) => {
  const { email } = req.body;
  console.log(email)
  const normalizedEmail = email.toLowerCase(); 


  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  //console.log("ALBIN OTP", otp);
  otpStore[normalizedEmail] = otp;
   //console.log("STORE OTP", otpStore[normalizedEmail]);

  const mailOptions = {
    from: process.env.EMAIL_USER,  
    to: normalizedEmail,
    subject: 'Agrispot Verification Code ',
    text: `Your OTP code is: ${otp}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "OTP sent to your email." });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ message: "Failed to send OTP.", error: error.message });
  }
};

exports.validateOtp = async (req, res) => {
  const { email, otp } = req.body;
  const normalizedEmail = email.toLowerCase(); 

 console.log(email, otp)
 console.log(otpStore[normalizedEmail]);

  if (otpStore[normalizedEmail] !== otp) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  res.status(200).json({ message: "OTP validated successfully" });
};

exports.register = async (req, res) => {
  const { username, role, address, phone, email, password, otp } = req.body;

  if (otpStore[email] !== otp) {
    return res.status(400).json({  status : 1,message: "Invalid OTP" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ status : 1 ,message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
  
    const newUser = new User({
      username,
      email,
      address,
      password: hashedPassword,
      role,
      phone,
    });

    await newUser.save();
    delete otpStore[email];  

    res.status(201).json({ status : 1, message: "User registered successfully" });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: "Server error" });
  }
};

// User Login
exports.login = async (req, res) => {
  const { email, password, role } = req.body;
  
  //console.log(email, password, role)

  try {
    if (!email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (user.role !== role) {
      return res.status(400).json({ message: "Incorrect role" });
    }

    // Generate a token and send email along with it
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    console.log('Login successful, user role:', user.role);
    // Include email in the response
    res.json({ token, role: user.role, email: user.email }); // Send email back to frontend
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: "Server error" });
  }
};

// backend for sign in with google

exports.googleLogin = async (req, res) => {
  const { token, email } = req.body;  // Get Firebase token and user email from frontend

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    if (!decodedToken) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    let user = await User.findOne({ email });
    if (!user) {
      user = new User({
        email,
        username: decodedToken.name || "Google User",
        role: 'farmer', // Assign default role, modify as needed
        phone: decodedToken.phone_number || null,
      });
      await user.save();
    }

    const appToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({ token: appToken, role: user.role, email: user.email });
  } catch (error) {
    console.error("Error during Google login:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// code for forgot password

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  
  console.log("Forgot password request received for email:", email);  // Debug log

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found for email:', email);  // Debug log
      return res.status(400).json({ message: 'User not found' });
    }

    // Generate reset token
    const token = crypto.randomBytes(32).toString('hex');
    console.log("Generated token:", token);  // Debug log
    
    const resetToken = await bcrypt.hash(token, 10); // Store hashed token in DB for security
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // Token valid for 1 hour
    await user.save();

    const resetUrl = `http://localhost:3000/reset-password/${token}`;
    console.log("Reset URL:", resetUrl);  // Debug log

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Password Reset Request',
      text: `You are receiving this email because you (or someone else) requested the reset of a password. Click the link to reset: ${resetUrl}`,
    };

    await transporter.sendMail(mailOptions);
    console.log('Reset link sent to:', user.email);  // Debug log

    res.status(200).json({ message: 'Reset link sent to your email.' });
  } catch (error) {
    console.error('Error sending reset link:', error);  // Debug log
    res.status(500).json({ message: 'Error sending reset link' });
  }
};




exports.resetPassword = async (req, res) => {
  const { password } = req.body;
  const { token } = req.params;

  console.log('Reset password request received');
  console.log('Token received:', token);
  console.log('New password received:', password);

  try {
    // Find user with a valid (non-expired) token
    const user = await User.findOne({
      resetPasswordExpires: { $gt: Date.now() }, // Token not expired
    });

    if (!user) {
      console.log('User not found or token expired');
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // Compare the raw token from the URL with the hashed token in the database
    const isTokenValid = await bcrypt.compare(token, user.resetPasswordToken);
    if (!isTokenValid) {
      console.log('Invalid token');
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    console.log('Token received from URL:', token);
    console.log('Hashed token in DB:', user.resetPasswordToken);

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Password hashed successfully');

    // Update user's password and clear reset token and expiration
    user.password = hashedPassword;
    user.resetPasswordToken = undefined; // Clear the token after use
    user.resetPasswordExpires = undefined; // Clear expiration
    await user.save();

    console.log('Password reset successfully for user:', user.email);
    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ message: 'Error resetting password' });
  }
};







