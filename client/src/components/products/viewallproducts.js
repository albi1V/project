import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './valp.module.css'; // Import your CSS module for styling

const ViewAllProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cart, setCart] = useState([]); // Track cart items
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products/all');
        setProducts(response.data);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch products');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = async (productId) => {
    const token = localStorage.getItem('token');
    const quantity = 1; // Default quantity
  
    try {
      const response = await axios.post(
        'http://localhost:5000/api/cart/addcart',
        { productId, quantity },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      console.log(response.data.message); // Display success message or notification
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };
  
  

  const handleBuyNow = (product) => {
    // Directly navigate to the checkout page with product details
    navigate('/checkout', { state: { product } });
  };

  if (loading) {
    return <p className={styles.loading}>Loading products...</p>;
  }

  if (error) {
    return <p className={styles.error}>{error}</p>;
  }

  return (
    <div className={styles.productsContainer}>
      <h1 className={styles.title}>All Products</h1>

      <div className={styles.productGrid}>
        {products.map((product) => (
          <div key={product._id} className={styles.productItem}>
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            {product.image && (
              <img
                src={`http://localhost:5000/api/products/get-product-images/${product.image}`}
                alt={product.name}
                className={styles.productImage}
              />
            )}
            <p><strong>Price:</strong> ${product.price}</p>
            <p><strong>Posted on:</strong> {new Date(product.createdAt).toLocaleDateString()}</p>

            {/* Add to Cart Button */}
            <button
              className={styles.cartButton}
              onClick={() => handleAddToCart(product)}
            >
              Add to Cart
            </button>

            {/* Buy Now Button */}
            <button
              className={styles.buyButton}
              onClick={() => handleBuyNow(product)}
            >
              Buy Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewAllProducts;
