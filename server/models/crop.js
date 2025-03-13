const mongoose = require('mongoose');

const cropSchema = new mongoose.Schema({
  name: { type: String, required: true },
  minTemp: { type: Number, required: true },
  maxTemp: { type: Number, required: true },
  idealConditions: { type: [String], required: true }, // Array of conditions (e.g., ['Clear', 'Rain'])
});

const Crop = mongoose.model('Crop', cropSchema);
module.exports = Crop;
