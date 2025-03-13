const mongoose = require('mongoose');

const wasteRequestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  wasteType: { type: String, required: true },
  wasteDetails: { type: String },
  file: { type: String }, // File name
  status: { type: String, default: 'Pending' },
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

const WasteRequest = mongoose.model('WasteRequest', wasteRequestSchema);
module.exports = WasteRequest;
