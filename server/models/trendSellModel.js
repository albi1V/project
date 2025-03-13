const mongoose = require('mongoose');

const sellRequestSchema = new mongoose.Schema({
    productName: String,
    quantity: Number,
    price: Number,
    phone: String,
    address: String,
    comments: String,
    pickupDate: Date,
    status: { type: String, default: 'pending' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to User model
    farmerEmail: { type: String } // Add this line to store farmer's email
}, { timestamps: true });

module.exports = mongoose.model('SellRequest', sellRequestSchema);
