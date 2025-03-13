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




// Controller for removing an item from the cart
const removeFromCart = async (req, res) => {
  const userId = req.user.id; // Assuming the user ID is obtained from the authenticated user
  const { productId } = req.params; // Get productId from the request parameters

  try {
    // Find the user's cart
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Check if the product exists in the cart
    const itemIndex = cart.products.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Product not found in cart' });
    }

    // Remove the product from the cart
    cart.products.splice(itemIndex, 1);

    // Save the updated cart
    await cart.save();

    res.status(200).json({ message: 'Product removed from cart successfully' });
  } catch (error) {
    console.error('Error removing product from cart:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



// Increase quantity in cart
const increaseQuantity = async (req, res) => {
  const userId = req.user.id;  // Assuming `req.user` is populated by `authMiddleware`
  const { productId } = req.params;

  try {
    // Find the user's cart
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Find the product in the cart
    const productItem = cart.products.find(item => item.product.toString() === productId);
    if (!productItem) {
      return res.status(404).json({ message: 'Product not found in cart' });
    }

    // Increase the quantity
    productItem.quantity += 1;
    await cart.save();

    res.status(200).json({ message: 'Quantity increased successfully' });
  } catch (error) {
    console.error('Error increasing quantity:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Decrease quantity in cart
const decreaseQuantity = async (req, res) => {
  const userId = req.user.id;
  const { productId } = req.params;

  try {
    // Find the user's cart
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Find the product in the cart
    const productItem = cart.products.find(item => item.product.toString() === productId);
    if (!productItem) {
      return res.status(404).json({ message: 'Product not found in cart' });
    }

    // Decrease the quantity, but don't allow it to go below 1
    if (productItem.quantity > 1) {
      productItem.quantity -= 1;
      await cart.save();
      res.status(200).json({ message: 'Quantity decreased successfully' });
    } else {
      res.status(400).json({ message: 'Quantity cannot be less than 1' });
    }
  } catch (error) {
    console.error('Error decreasing quantity:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  addToCart,
  getCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
};
