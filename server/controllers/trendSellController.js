const SellRequest = require('../models/trendSellModel');
const User = require('../models/userModel'); // Import User model
const nodemailer = require('nodemailer');
require('dotenv').config();

// Function to submit a sell request
// Assuming req.user is set in authMiddleware
exports.submitSellRequest = async (req, res) => {
    const { productName, quantity, price, phone, address, comments, pickupDate } = req.body;
    const farmerEmail = req.user.email; // Retrieve user email from authenticated user
    
    try {
      // Validate that the pickupDate is not in the past
      const currentDate = new Date();
      if (new Date(pickupDate) < currentDate.setHours(0, 0, 0, 0)) {
        return res.status(400).json({ error: 'Pickup date cannot be in the past' });
      }

      const sellRequest = new SellRequest({
        productName,
        quantity,
        price,
        phone,
        address,
        comments,
        pickupDate,
        farmerEmail, // Store the farmer's email in the sell request
        userId: req.userId // Store user ID if needed
      });
  
      await sellRequest.save();
      res.status(201).json({ message: 'Sell request submitted successfully' });
    } catch (error) {
      console.error(error); // Log the error for debugging
      res.status(500).json({ error: 'Failed to submit sell request', details: error.message });
    }
};

  
// Function to accept a sell request (Admin)
exports.acceptRequest = async (req, res) => {
  try {
    const requestId = req.params.id;
    const sellRequest = await SellRequest.findById(requestId);

    if (!sellRequest) {
      return res.status(404).json({ message: 'Sell request not found' });
    }

    sellRequest.status = 'accepted';
    await sellRequest.save();

    // Send acceptance email
    await sendEmail(sellRequest.farmerEmail, 'Request Accepted', 'Your request has been accepted. Our agent will contact you soon.');
    
    res.json({ message: 'Sell request accepted' });
  } catch (error) {
    console.error('Error accepting sell request:', error);
    res.status(500).json({ error: 'Failed to accept sell request' });
  }
};

// Function to reject a sell request (Admin)
exports.rejectRequest = async (req, res) => {
  try {
    const requestId = req.params.id;
    const sellRequest = await SellRequest.findById(requestId);

    if (!sellRequest) {
      return res.status(404).json({ message: 'Sell request not found' });
    }

    sellRequest.status = 'rejected';
    await sellRequest.save();

    // Send rejection email
    await sendEmail(sellRequest.farmerEmail, 'Request Rejected', "Sorry, we can't process your request right now.");
    
    res.json({ message: 'Sell request rejected' });
  } catch (error) {
    console.error('Error rejecting sell request:', error);
    res.status(500).json({ error: 'Failed to reject sell request' });
  }
};

// Function to send email notifications using Nodemailer
const sendEmail = async (recipient, subject, message) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: recipient,
    subject: subject,
    text: message
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${recipient} with subject: ${subject}`);
  } catch (error) {
    console.error(`Failed to send email to ${recipient}:`, error);
  }
};


exports.getAllRequests = async (req, res) => {
    try {
      const sellRequests = await SellRequest.find().populate('userId', 'username email'); // Populating user details if necessary
      res.status(200).json(sellRequests);
    } catch (error) {
      console.error('Error fetching sell requests:', error);
      res.status(500).json({ error: 'Failed to fetch sell requests' });
    }
  };