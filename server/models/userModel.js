const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
  },
  role: {
    type: String,
    enum: ['farmer', 'seller', 'admin'], // Add 'admin' here
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
  },
  resetPasswordToken: {
    type: String,
  },
  resetPasswordExpires: {
    type: Date,
  },
  isBlocked: {
    type: Boolean,
    default: false,  // Add this field for block/unblock status
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
