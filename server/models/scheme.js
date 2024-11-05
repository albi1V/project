const mongoose = require('mongoose');

const schemeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    file: { type: String, required: true }, // Store file path or URL
    link: { type: String, required: false }, // New field to store an external link (optional)
});

const Scheme = mongoose.model('Scheme', schemeSchema);
module.exports = Scheme;

