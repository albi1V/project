import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import styles from './productdetails.module.css';

const ProductDetails = () => {
  const { id } = useParams(); // Get product ID from the URL params
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        // Get the token from localStorage (or wherever you store it)
        const token = localStorage.getItem('token');

        // Add the token to the Authorization header
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await axios.get(`https://project-9jg7.onrender.com/api/products/get-by-id/${id}`, config);
        setProduct(response.data);
        setLoading(false);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          setError('Unauthorized. Please login again.');
        } else {
          setError('Error fetching product details');
        }
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  if (loading) {
    return <p className={styles.loading}>Loading product details...</p>;
  }

  if (error) {
    return <p className={styles.error}>{error}</p>;
  }

  if (!product) {
    return <p className={styles.error}>Product details not available.</p>;
  }

  return (
    <div className={styles.detailsContainer}>
      <h1>{product.name}</h1>
      <p><strong>Description:</strong> {product.description || 'No description available.'}</p>

      <div className={styles.imageContainer}>
        {product.images && product.images.length > 0 ? (
          product.images.map((image, index) => (
            <img
              key={index}
              src={`https://project-9jg7.onrender.com/api/products/get-product-images/${image}`}
              alt={product.name}
              className={styles.productImage}
            />
          ))
        ) : (
          <p>No images available</p>
        )}
      </div>

      <p><strong>Price:</strong> ₹{product.price || 'N/A'}</p>
      <p><strong>Posted on:</strong> {new Date(product.createdAt).toLocaleDateString()}</p>
      <p><strong>Seller Name:</strong> {product.seller?.name || 'Albin Varghese'}</p>
      <p><strong>Seller Email:</strong> {product.seller?.email || 'albinvarghese086@gmail.com'}</p>

      <button className={styles.backButton} onClick={() => window.history.back()}>
        Go Back
      </button>
    </div>
  );
};

export default ProductDetails;
