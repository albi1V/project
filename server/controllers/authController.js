const User = require('../models/userModel');
const admin = require('firebase-admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
require('dotenv').config();

// admin.initializeApp({
//   credential: admin.credential.cert(require('../agrispot/agrispot-93d53-firebase-adminsdk-ht8vl-4ff5ed16e6.json')), // Add path to Firebase service account key
// });

let otpStore = {};  // Store OTPs in memory for validation

// Nodemailer configuration for OTP and email sending
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send OTP to the user's email
exports.sendOtp = async (req, res) => {
  const { email } = req.body;
  const normalizedEmail = email.toLowerCase();  // Normalize email for case insensitivity

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore[normalizedEmail] = otp;  // Store OTP in memory

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: normalizedEmail,
    subject: 'Agrispot Verification Code',
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

// Validate OTP entered by the user
exports.validateOtp = async (req, res) => {
  const { email, otp } = req.body;
  const normalizedEmail = email.toLowerCase();  // Normalize email

  if (otpStore[normalizedEmail] !== otp) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  res.status(200).json({ message: "OTP validated successfully" });
};

// User Registration
exports.register = async (req, res) => {
  const { username, role, address, phone, email, password, otp } = req.body;
  const normalizedEmail = email.toLowerCase();

  if (otpStore[normalizedEmail] !== otp) {
    return res.status(400).json({ status: 1, message: "Invalid OTP" });
  }

  try {
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ status: 1, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email: normalizedEmail,
      address,
      password: hashedPassword,
      role,
      phone,
    });

    await newUser.save();
    delete otpStore[normalizedEmail];  // Clear OTP after successful registration

    res.status(201).json({ status: 1, message: "User registered successfully" });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: "Server error" });
  }
};



exports.login = async (req, res) => {
  const { email, password } = req.body;
  const normalizedEmail = email.toLowerCase();

  try {
    // Validate request body
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Find the user by email
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check if the user is blocked
    if (user.isBlocked) {
      return res.status(403).json({ message: "Your account is blocked. Please contact admin." });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate a token and return it with the user's role
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    console.log('Login successful, user role:', user.role);
    res.json({ token, role: user.role, email: user.email, userId:user._id });  // Include email in the response
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: "Server error" });
  }
};


// Forgot Password functionality
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  const normalizedEmail = email.toLowerCase();

  try {
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const resetToken = await bcrypt.hash(token, 10);  // Store hashed token in the database
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // Token valid for 1 hour
    await user.save();

    const resetUrl = `http://localhost:3000/reset-password/${token}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Password Reset Request',
      text: `You are receiving this email because you requested a password reset. Click the link to reset: ${resetUrl}`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Reset link sent to your email.' });
  } catch (error) {
    console.error('Error sending reset link:', error);
    res.status(500).json({ message: 'Error sending reset link' });
  }
};

// Reset Password functionality
exports.resetPassword = async (req, res) => {
  const { password } = req.body;
  const { token } = req.params;

  try {
    const user = await User.findOne({
      resetPasswordExpires: { $gt: Date.now() },  // Ensure token is not expired
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    const isTokenValid = await bcrypt.compare(token, user.resetPasswordToken);
    if (!isTokenValid) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user's password and clear reset token and expiration
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ message: 'Error resetting password' });
  }
};

// Google Login functionality
// exports.googleLogin = async (req, res) => {
//   const { token, email } = req.body;

//   try {
//     // Verify the provided token
//     const decodedToken = await admin.auth().verifyIdToken(token);
//     if (!decodedToken) {
//       return res.status(401).json({ message: "Unauthorized" });
//     }

//     // Find user in the database
//     let user = await User.findOne({ email });
//     if (!user) {
//       // If user does not exist, create a new one
//       user = new User({
//         email,
//         username: decodedToken.name || "Google User",
//         role: 'farmer',  // Default role
//         phone: decodedToken.phone_number || null,
//       });
//       await user.save();
//     }

//     // Check if the user is blocked
//     if (user.isBlocked) {
//       return res.status(403).json({ message: "Your account is blocked. Please contact the administrator." });
//     }

//     // Generate a token for the application
//     const appToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
//       expiresIn: '1h',
//     });

//     // Respond with the token and user details
//     res.json({ token: appToken, role: user.role, email: user.email, isBlocked: user.isBlocked });
//   } catch (error) {
//     console.error("Error during Google login:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };




