const mongoose = require('mongoose');
const Scheme = require('../models/scheme');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Directory for storing scheme files
const schemeFileDir = path.join(__dirname, "../uploads/scheme_files");
if (!fs.existsSync(schemeFileDir)) {
    fs.mkdirSync(schemeFileDir, { recursive: true });
}

// Multer setup for handling file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, schemeFileDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});
const upload = multer({ storage: storage }).single("document"); // Updated to match your file input name

// Add Scheme Controller
const addScheme = async (req, res) => {
    // console.log("Received request at /api/schemes/add");

    upload(req, res, async (err) => {
        if (err) {
            console.error("File upload failed:", err);
            return res.status(400).json({ message: "File upload failed", error: err });
        }

        try {
            // Log the data received from req.body and req.file
            // console.log("Request body:", req.body);
            // console.log("Uploaded file:", req.file);

            const { name, description, startDate, endDate, link } = req.body;
            const userId = req.user ? req.user._id : null;
            const file = req.file ? req.file.filename : null;

            if (!userId) {
                console.error("User ID missing");
                return res.status(400).json({ message: "User ID is required" });
            }

            const newScheme = new Scheme({
                userId,
                name,
                description,
                startDate,
                endDate,
                file,
                link,
            });

            await newScheme.save();
            // console.log("New scheme saved:", newScheme); // Log new scheme data

            return res.status(201).json({ message: "Scheme added successfully!", scheme: newScheme });
        } catch (error) {
            console.error("Server error:", error);
            return res.status(500).json({ message: "Server error", error });
        }
    });
};

// Get All Schemes Controller
const getAllSchemes = async (req, res) => {
    try {
        const schemes = await Scheme.find();
        if (!schemes || schemes.length === 0) {
            return res.status(404).json({ message: "No schemes available" });
        }
        res.status(200).json(schemes);
    } catch (error) {
        console.error("Error fetching schemes:", error);
        return res.status(500).json({ message: "Failed to retrieve schemes", error });
    }
};

// Get Scheme By ID Controller
const getSchemeById = async (req, res) => {
    const { schemeId } = req.params;
    console.log('Received Scheme ID:', schemeId); // Log the received ID

    try {
        if (!mongoose.Types.ObjectId.isValid(schemeId)) {
            console.log('Invalid Scheme ID');
            return res.status(400).json({ message: 'Invalid Scheme ID' });
        }

        const scheme = await Scheme.findById(schemeId);
        console.log('Fetched Scheme:', scheme); // Log the fetched scheme

        if (!scheme) {
            return res.status(404).json({ message: 'Scheme not found' });
        }

        return res.status(200).json(scheme);
    } catch (error) {
        console.error('Error fetching scheme by ID:', error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get Scheme File Controller
const getSchemeFile = async (req, res) => {
    const { filename } = req.params;
    const filePath = path.join(__dirname, "../uploads/scheme_files", filename);

    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.status(404).json({ message: "File not found" });
    }
};

// Edit Scheme Controller
const editScheme = async (req, res) => {
    const { schemeId } = req.params;

    upload(req, res, async (err) => {
        if (err) {
            console.error("File upload failed:", err);
            return res.status(400).json({ message: "File upload failed", error: err });
        }

        try {
            if (!mongoose.Types.ObjectId.isValid(schemeId)) {
                return res.status(400).json({ message: 'Invalid Scheme ID' });
            }

            const scheme = await Scheme.findById(schemeId);
            if (!scheme) {
                return res.status(404).json({ message: 'Scheme not found' });
            }

            // Update scheme fields
            const { name, description, startDate, endDate, link } = req.body; // Added `link`
            scheme.name = name;
            scheme.description = description;
            scheme.startDate = startDate;
            scheme.endDate = endDate;
            scheme.link = link; // Update `link`

            // Handle document update
            if (req.file) {
                // If a new document is uploaded, update the document URL
                scheme.file = req.file.filename; // Store the new filename
            }

            await scheme.save(); // Save updated scheme
            return res.status(200).json({ message: 'Scheme updated successfully', scheme });
        } catch (error) {
            console.error('Error updating scheme:', error);
            return res.status(500).json({ message: 'Server error', error: error.message });
        }
    });
};

// Delete Scheme Controller
const deleteScheme = async (req, res) => {
  const { schemeId } = req.params;

  try {
      // Validate schemeId
      if (!mongoose.Types.ObjectId.isValid(schemeId)) {
          return res.status(400).json({ message: 'Invalid Scheme ID' });
      }

      // Find and delete the scheme
      const deletedScheme = await Scheme.findByIdAndDelete(schemeId);
      if (!deletedScheme) {
          return res.status(404).json({ message: 'Scheme not found' });
      }

      // Check and delete associated file from the file system if it exists
      const filePath = path.join(schemeFileDir, deletedScheme.file);
      if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
      }

      return res.status(200).json({ message: 'Scheme deleted successfully' });
  } catch (error) {
      console.error('Error deleting scheme:', error);
      return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Export all the controller functions together
module.exports = { addScheme, getAllSchemes, getSchemeFile, getSchemeById, editScheme, deleteScheme };
