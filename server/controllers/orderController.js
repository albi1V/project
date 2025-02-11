const Order = require('../models/order'); // Import the Order model
const Product = require('../models/product'); // Import the Product model

// Controller to fetch orders for the authenticated buyer
const getBuyerOrders = async (req, res) => {
  try {
    // console.log("Fetching orders for user:", req.user._id); // Log the user ID

    // Fetch orders associated with the authenticated user
    const orders = await Order.find({ user: req.user._id })
      .populate('cartItems.productId', 'name price') // Populate product details
      .exec();

    console.log("Fetched orders:", orders); // Log the fetched orders

    if (!orders.length) {
      console.log("No orders found for user:", req.user._id);
      return res.status(404).json({ message: 'No orders found' });
    }

    // Respond with the found orders
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error); // Log the error
    res.status(500).json({ message: 'Server error' });
  }
};


// Controller to fetch orders for the authenticated seller
const getSellerOrders = async (req, res) => {
  try {
    // Find orders where products belong to the authenticated seller
    const orders = await Order.find({ 'cartItems.productId': { $exists: true } })
      .populate({
        path: 'cartItems.productId',
        match: { sellerEmail: req.user.email }, // Match the products where the seller's email matches the logged-in user
        select: 'name price', // Select only name and price
      })
      .exec();

    // Filter out orders that don't have any products for the seller
    const sellerOrders = orders.filter(order => order.cartItems.some(item => item.productId));

    if (!sellerOrders.length) {
      return res.status(404).json({ message: 'No orders found for your products.' });
    }

    // Respond with the seller orders
    res.json(sellerOrders);
  } catch (error) {
    console.error('Error fetching seller orders:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


// Controller to approve an order
const approveOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    // Find the order and update its approvalStatus to "Approved"
    const order = await Order.findByIdAndUpdate(orderId, {status: 'Approved' }, { new: true });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ message: 'Order approved successfully', order });
  } catch (error) {
    console.error('Error approving order:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Controller to decline an order
const declineOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    // Find the order and update its approvalStatus to "Declined"
    const order = await Order.findByIdAndUpdate(orderId, {status: 'Declined' }, { new: true });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ message: 'Order declined successfully', order });
  } catch (error) {
    console.error('Error declining order:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  approveOrder,
  declineOrder,
  getBuyerOrders,
  getSellerOrders,
};
