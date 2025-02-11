const Order = require("../models/order");
const Product = require("../models/product");
const User = require("../models/userModel"); // Assuming user details are stored in this model

const getOrderAnalysis = async (req, res) => {
  try {
    const { sellerId } = req.params; // Seller email from frontend
    let { startDate, endDate } = req.query;

    // Convert startDate and endDate to Date objects if provided
    let filter = {};
    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    // Fetch orders
    const orders = await Order.find(filter);

    // Fetch product details to check seller email
    let sellerOrders = [];
    let totalRevenue = 0;

    for (const order of orders) {
      for (const item of order.cartItems) {
        const product = await Product.findById(item.productId);

        if (product && product.sellerEmail === sellerId) {
          // Fetch buyer details
          const buyer = await User.findById(order.user);

          sellerOrders.push({
            _id: order._id,
            buyerId: buyer ? { username: buyer.username, email: buyer.email } : {},
            productId: { name: product.name, price: product.price },
            quantity: item.quantity,
            totalPrice: item.price * item.quantity,
            status: order.status,
          });

          totalRevenue += item.price * item.quantity;
        }
      }
    }

    const totalOrders = sellerOrders.length;
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    res.json({
      totalOrders,
      totalRevenue,
      avgOrderValue,
      orders: sellerOrders,
    });
  } catch (error) {
    console.error("Error fetching order analysis:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getOrderAnalysis };
