import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../farmer/fsidebar'; // Import Sidebar component
import Navbar from '../farmer/fnavbar';   // Import Navbar component
import styles from './valp.module.css'; // Import your CSS module for styling

const ViewAllProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products/all');
        setProducts(response.data);

        const initialIndexes = response.data.reduce((acc, product) => {
          acc[product._id] = 0;
          return acc;
        }, {});
        setCurrentImageIndex(initialIndexes);

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

      console.log(response.data.message);
      window.alert("Product added to your cart"); // Alert for successful addition
    } catch (error) {
      console.error('Error adding to cart:', error);
      window.alert("Failed to add product to your cart"); // Alert for failure
    }
  };

  const handleBuyNow = (product) => {
    navigate('/checkout', { state: { product } });
  };

  const handleViewMore = (product) => {
    navigate(`/productDetails/${product._id}`, { state: { product } });
  };

  const handleNextImage = (productId) => {
    setCurrentImageIndex((prevIndex) => {
      const product = products.find((product) => product._id === productId);
      const nextIndex = (prevIndex[productId] + 1) % (product.images.length || 1);
      return { ...prevIndex, [productId]: nextIndex };
    });
  };

  if (loading) {
    return <p className={styles.loading}>Loading products...</p>;
  }

  if (error) {
    return <p className={styles.error}>{error}</p>;
  }

  return (
    <div className={styles.mainContent}>
      <Navbar /> {/* Navbar component */}

      <div className={styles.adminLayout}>
        <Sidebar /> {/* Sidebar component */}

        <div className={styles.productsContainer}>
          <h1 className={styles.title}>All Products</h1>

          <div className={styles.productGrid}>
            {products.map((product) => (
              <div key={product._id} className={styles.productItem}>
                <h3>{product.name}</h3>

                <div className={styles.imageContainer}>
                  {product.images && product.images.length > 0 && (
                    <>
                      <img
                        src={`http://localhost:5000/api/products/get-product-images/${product.images[currentImageIndex[product._id]] || 0}`}
                        alt={product.name}
                        className={styles.productImage}
                      />
                      <button
                        className={styles.nextButton}
                        onClick={() => handleNextImage(product._id)}
                      >
                        Next Image
                      </button>
                    </>
                  )}
                </div>

                <p><strong>Price:</strong> ₹{product.price}</p>

                <button className={styles.cartButton} onClick={() => handleAddToCart(product._id)}>
                  Add to Cart
                </button>

                <button className={styles.buyButton} onClick={() => handleBuyNow(product)}>
                  Buy Now
                </button>

                <button className={styles.viewMoreButton} onClick={() => handleViewMore(product)}>
                  View More
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewAllProducts;
