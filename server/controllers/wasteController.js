const mongoose = require('mongoose');
const WasteRequest = require('../models/WasteModel'); 
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Directory for storing waste images
const wasteImageDir = path.join(__dirname, "../uploads/waste_images");
if (!fs.existsSync(wasteImageDir)) {
  fs.mkdirSync(wasteImageDir, { recursive: true });
}

// Multer setup for file uploads
const wasteStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, wasteImageDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const wasteUpload = multer({ storage: wasteStorage }).single("file");

// Submit Waste Management Request
const submitWasteRequest = async (req, res) => {
  wasteUpload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: "File upload failed", error: err });
    }

    try {
      const {
        userName,
        address,
        phone,
        wasteType,
        wasteDetails,
        plasticType,
        plasticCount,
        metalType,
        metalWeight,
        pesticideAmount,
        otherWasteType,
      } = req.body;

      const userId = req.userId; 

      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }

      const wasteRequest = new WasteRequest({
        userId, 
        userName,
        address,
        phone,
        wasteType,
        wasteDetails,
        plasticType,
        plasticCount,
        metalType,
        metalWeight,
        pesticideAmount,
        otherWasteType,
        file: req.file ? req.file.filename : null, 
      });

      await wasteRequest.save();
      return res.status(201).json({ message: 'Waste management request submitted successfully!', wasteRequest });
    } catch (error) {
      return res.status(500).json({ message: "Failed to submit waste management request", error });
    }
  });
};

// Get all Waste Requests (Admin only)
const getWasteRequests = async (req, res) => {
  try {
    const wasteRequests = await WasteRequest.find();
    return res.status(200).json(wasteRequests);
  } catch (error) {
    return res.status(500).json({ message: "Failed to retrieve waste requests", error });
  }
};

// Accept a Waste Request (Admin only)
const acceptWasteRequest = async (req, res) => {
  try {
    const requestId = req.params.id;
    const request = await WasteRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    request.status = 'accepted';
    await request.save();
    return res.status(200).json({ message: 'Request accepted successfully!' });
  } catch (error) {
    return res.status(500).json({ message: "Failed to accept request", error });
  }
};

// Reject a Waste Request (Admin only)
const rejectWasteRequest = async (req, res) => {
  try {
    const requestId = req.params.id;
    const request = await WasteRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    request.status = 'rejected';
    await request.save();
    return res.status(200).json({ message: 'Request rejected successfully!' });
  } catch (error) {
    return res.status(500).json({ message: "Failed to reject request", error });
  }
};

const getUserWasteRequests = async (req, res) => {
  try {
    const userId = req.userId; // Retrieved from auth middleware
    const wasteRequests = await WasteRequest.find({ userId });
    if (!wasteRequests || wasteRequests.length === 0) {
      return res.status(404).json({ message: "No waste requests found for this user." });
    }
    res.status(200).json(wasteRequests);
  } catch (error) {
    console.error("Error fetching user waste requests:", error);
    return res.status(500).json({ message: "Error fetching user waste requests", error });
  }
};


const getBlogImages = async (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, "../uploads/waste_images", filename);

  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).json({ message: "File not found" });
  }
};

module.exports = {
  submitWasteRequest,
  getWasteRequests,
  acceptWasteRequest,
  rejectWasteRequest,
  getUserWasteRequests,
  getBlogImages
};
