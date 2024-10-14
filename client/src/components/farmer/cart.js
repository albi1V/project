import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './cart.module.css'; // Ensure to create a CSS module for styling

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCart = async () => {
      const token = localStorage.getItem('token');

      try {
        const response = await axios.get('http://localhost:5000/api/cart/getcart', {
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
      await axios.delete(`http://localhost:5000/api/cart/remove/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Update cart items state after removing product
      setCartItems(cartItems.filter((item) => item.product._id !== productId));
    } catch (error) {
      console.error('Error removing product:', error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className={styles.cartContainer}>
      <h1>Your Cart</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <div>
          {cartItems.map((item) => {
            const product = item.product; // Ensure product is accessed correctly
  
            // Check if product data is available
            if (!product) {
              return null; // Skip rendering if product data is missing
            }
  
            return (
              <div key={product._id} className={styles.cartItem}>
                {/* Display first image if available */}
                {product.images && product.images.length > 0 ? (
                  <img
                    src={`http://localhost:5000/api/products/get-product-images/${product.images[0]}`}
                    alt={product.name || 'Product Image'}
                    className={styles.productImage}
                  />
                ) : (
                  <p>No image available</p>
                )}
  
                {/* Product name with fallback */}
                <h3>{product.name || 'No name available'}</h3>
  
                {/* Price with fallback */}
                <p>Price: {product.price ? `₹${product.price.toFixed(2)}` : 'Price not available'}</p>
  
                {/* Quantity */}
                <p>Quantity: {item.quantity}</p>
  
                {/* Remove button */}
                <button onClick={() => handleRemoveFromCart(product._id)}>Remove</button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
  
};

export default Cart;
