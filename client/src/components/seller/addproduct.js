import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './addProduct.module.css'; // Your CSS module for styling

const AddProduct = () => {
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [productCount, setProductCount] = useState(''); // New state for product count
  const [images, setImages] = useState([]); // For multiple file uploads
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files); // Update state with selected files
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email'); // User email

    if (!token || !email) {
      setError('Unauthorized');
      setLoading(false);
      return;
    }

    try {
      // Prepare form data for the request
      const formData = new FormData();
      formData.append('name', productName);
      formData.append('description', description);
      formData.append('price', price);
      formData.append('count', productCount); // Include product count
      images.forEach((image) => {
        formData.append('images', image); // Append each image file
      });
      formData.append('sellerEmail', email); // Attach the seller's email

      // API call to add the product
      await axios.post('http://localhost:5000/api/products/add', formData, {
        headers: {
          Authorization: `Bearer ${token}`, // Ensure token is present
          'Content-Type': 'multipart/form-data',
        },
      });

      setLoading(false);
      navigate('/seller-landing'); // Redirect to Seller Landing after product addition
    } catch (error) {
      setError('Failed to add product');
      setLoading(false);
    }
  };

  return (
    <div className={styles.addProductContainer}>
      <h1 className={styles.title}>Add New Product</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label>Product Name</label>
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>Price</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>Product Count</label>
          <input
            type="number"
            value={productCount}
            onChange={(e) => setProductCount(e.target.value)}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>Product Images (max 3)</label>
          <input
            type="file"
            multiple
            onChange={handleImageChange}
            accept="image/*"
            required
          />
        </div>

        {error && <p className={styles.error}>{error}</p>}
        {loading ? (
          <p>Loading...</p>
        ) : (
          <button type="submit" className={styles.submitButton}>
            Add Product
          </button>
        )}
      </form>
    </div>
  );
};

export default AddProduct;
