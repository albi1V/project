import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from './fsidebar'; // Import Sidebar component
import Navbar from './fnavbar';   // Import Navbar component
import styles from './cart.module.css'; // Ensure to create a CSS module for styling

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stockError, setStockError] = useState(''); // To store stock error message

  useEffect(() => {
    const fetchCart = async () => {
      const token = localStorage.getItem('token');

      try {
        const response = await axios.get('https://project-9jg7.onrender.com/api/cart/getcart', {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Fetched Cart Items:', response.data);
        
        setCartItems(response.data.products); // Assuming 'products' is the array of cart items
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch cart items');
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const handleRemoveFromCart = async (productId) => {
    const token = localStorage.getItem('token');
  
    try {
      console.log('Attempting to remove product:', productId); // Log productId for debugging
      if (!productId) {
        console.error('Product ID is null or undefined.');
        return;
      }

      await axios.delete(`https://project-9jg7.onrender.com/api/cart/remove/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      setCartItems(cartItems.filter((item) => item.product && item.product._id !== productId));
    } catch (error) {
      console.error('Error removing product:', error);
    }
  };
  
  const handleIncreaseQuantity = async (productId) => {
    const token = localStorage.getItem('token');
  
    try {
      await axios.put(`https://project-9jg7.onrender.com/api/cart/increase/${productId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      setCartItems(
        cartItems.map((item) => 
          item.product?._id === productId ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } catch (error) {
      console.error('Error increasing quantity:', error);
    }
  };
  
  const handleDecreaseQuantity = async (productId) => {
    const token = localStorage.getItem('token');
  
    try {
      await axios.put(`https://project-9jg7.onrender.com/api/cart/decrease/${productId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      setCartItems(
        cartItems.map((item) => 
          item.product?._id === productId && item.quantity > 1 
            ? { ...item, quantity: item.quantity - 1 } 
            : item
        )
      );
    } catch (error) {
      console.error('Error decreasing quantity:', error);
    }
  };

  const handleCheckout = async () => {
    const token = localStorage.getItem('token');
  
    try {
      // Loop through all cart items to check stock
      for (const item of cartItems) {
        const productId = item.product?._id;
        const requestedQuantity = item.quantity;
  
        // Check if productId is valid
        if (!productId) {
          console.error('Product ID is undefined for item:', item);
          setStockError('Some items in your cart have invalid product IDs.');
          return; // Stop checkout process if product ID is invalid
        }
  
        // Call the stock check API for each product
        const stockResponse = await axios.get(`https://project-9jg7.onrender.com/api/products/check-stock/${productId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        const availableStock = stockResponse.data.stock;
  
        // If requested quantity exceeds available stock, show error and stop checkout process
        if (requestedQuantity > availableStock) {
          setStockError(`Sorry, only ${availableStock} units of ${item.product?.name} are available. You have ${requestedQuantity} in your cart.`);
          return; // Stop checkout process if stock is insufficient
        }
      }
  
      // If all products have sufficient stock, proceed to checkout
      localStorage.setItem('cartItems', JSON.stringify(cartItems)); // Store items temporarily
      window.location.href = '/checkout'; // Redirect to the checkout page
    } catch (error) {
      console.error('Error during checkout:', error);
      setStockError('Failed to verify product stock. Please try again.');
    }
  };
  
  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className={styles.mainContent}>
      <Navbar />
      <div className={styles.adminLayout}>
        <Sidebar />

        <div className={styles.cartContainer}>
          <h1>Your Cart</h1>
          {stockError && <p className={styles.error}>{stockError}</p>} {/* Display stock error if any */}
          {cartItems.length === 0 ? (
            <p>Your cart is empty</p>
          ) : (
            <div>
              {cartItems.map((item) => {
                const product = item.product; // Ensure product is accessed correctly
                if (!product) {
                  return null; // Skip rendering if product data is missing
                }
  
                return (
                  <div key={product._id} className={styles.cartItem}>
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={`https://project-9jg7.onrender.com/api/products/get-product-images/${product.images[0]}`}
                        alt={product.name || 'Product Image'}
                        className={styles.productImage}
                      />
                    ) : (
                      <p>No image available</p>
                    )}
  
                    <h3>{product.name || 'No name available'}</h3>
                    <p className={styles.price}>Price: {product.price ? `₹${product.price.toFixed(2)}` : 'Price not available'}</p>
  
                    <div className={styles.quantityControl}>
                      <button onClick={() => handleDecreaseQuantity(product._id)}>-</button>
                      <p>Quantity: {item.quantity}</p>
                      <button onClick={() => handleIncreaseQuantity(product._id)}>+</button>
                    </div>
  
                    <button className={styles.removeButton} onClick={() => handleRemoveFromCart(product._id)}>Remove</button>
                  </div>
                );
              })}
            </div>
          )}
          <button className={styles.checkoutButton} onClick={handleCheckout}>Checkout</button> {/* Checkout button */}
        </div>
      </div>
    </div>
  );
};

export default Cart;
