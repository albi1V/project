const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  shippingAddress: {
    street: { type: String, required: true, minlength: 5 },
    city: { type: String, required: true, minlength: 2 },
    state: { type: String, required: true, minlength: 2 },
    postalCode: { type: String, required: true, minlength: 5, maxlength: 10 },
    country: { type: String, required: true, minlength: 2 },
  },
  cartItems: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
    }
  ],
  totalPrice: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['Pending', 'Shipped', 'Delivered', 'Cancelled'], 
    default: 'Pending', 
    index: true 
  },
}, { timestamps: true });

// Check if the model is already compiled and reuse it if available
module.exports = mongoose.models.Order || mongoose.model('Order', orderSchema);
