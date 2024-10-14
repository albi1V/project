const Cart = require('../models/cart');
const Product = require('../models/product');

// Add product to cart
const addToCart = async (req, res) => {
  const userId = req.user._id; // Ensure userId is coming from the authenticated user

  const { productId, quantity = 1 } = req.body;

  try {
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if the cart for the user already exists
    let cart = await Cart.findOne({ user: userId });

    if (cart) {
      // If the cart exists, check if the product is already in the cart
      const productIndex = cart.products.findIndex((p) => p.product.toString() === productId);

      if (productIndex !== -1) {
        // If product is already in the cart, update the quantity
        cart.products[productIndex].quantity += quantity;
      } else {
        // Otherwise, add the new product to the cart
        cart.products.push({ product: productId, quantity });
      }
    } else {
      // If no cart exists for the user, create a new one
      cart = new Cart({
        user: userId,
        products: [{ product: productId, quantity }],
      });
    }

    await cart.save(); // Save the cart
    return res.status(201).json({ message: 'Product added to cart', cart });
  } catch (error) {
    console.error('Error adding to cart:', error);
    return res.status(500).json({ message: 'Server error', error });
  }
};


const getCart = async (req, res) => {
  const userId = req.user._id;

  try {
    // Fetch the cart for the user and populate the products
    const cart = await Cart.findOne({ user: userId }).populate('products.product');

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    return res.status(200).json(cart);
  } catch (error) {
    console.error('Error fetching cart:', error);
    return res.status(500).json({ message: 'Server error', error });
  }
};


// Remove product from cart
const removeFromCart = async (req, res) => {
  const userId = req.user._id;
  const { productId } = req.params;

  try {
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Filter out the product that needs to be removed
    cart.products = cart.products.filter(
      (p) => p.product.toString() !== productId
    );

    await cart.save();
    return res.status(200).json({ message: 'Product removed from cart', cart });
  } catch (error) {
    console.error('Error removing from cart:', error);
    return res.status(500).json({ message: 'Server error', error });
  }
};





module.exports = {
  addToCart,
  getCart,
  removeFromCart
};
