import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './cart.module.css'; // Create a CSS module for styling

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
        setCartItems(response.data.products);
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
      setCartItems(cartItems.filter((item) => item.product._id !== productId)); // Update cart items locally
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
          {cartItems.map((item) => (
            <div key={item.product._id} className={styles.cartItem}>
              {/* Display the product image */}
              <img src={`http://localhost:5000/api/products/get-product-images/${item.product.image}`} alt={item.product.name} className={styles.productImage} />
              <h3>{item.product.name}</h3>
              <p>Price: ${item.product.price}</p>
              <p>Quantity: {item.quantity}</p>
              <button onClick={() => handleRemoveFromCart(item.product._id)}>Remove</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Cart;
