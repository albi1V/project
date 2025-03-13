import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Sidebar from './slrSbar'; // Import Sidebar component
import Navbar from './slrNbar';   // Import Navbar component
import styles from './addProduct.module.css'; // Import CSS module for styling

const AddProduct = () => {
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [productCount, setProductCount] = useState('');
  const [images, setImages] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [formValid, setFormValid] = useState(false);
  const [touched, setTouched] = useState({
    productName: false,
    price: false,
    productCount: false,
  });

  const navigate = useNavigate();

  // Regex patterns for validation
  const nameRegex = /^[A-Za-z\s]+$/;
  const doubleSpaceRegex = /\s\s+/;

  // Validate the form whenever inputs change
  useEffect(() => {
    validateForm();
  }, [productName, description, price, productCount, images]);

  const validateForm = () => {
    const isValid =
      productName &&
      nameRegex.test(productName) &&
      !doubleSpaceRegex.test(productName) &&
      productName.length <= 50 &&
      description &&
      price > 1 &&
      productCount > 1 &&
      images.length > 0 &&
      images.length <= 3;
    
    setFormValid(isValid);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
  };

  const handleFieldChange = (field, value) => {
    switch (field) {
      case 'productName':
        setProductName(value);
        break;
      case 'description':
        setDescription(value);
        break;
      case 'price':
        setPrice(value);
        break;
      case 'productCount':
        setProductCount(value);
        break;
      default:
        break;
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email');

    if (!token || !email) {
      setError('Unauthorized');
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', productName);
      formData.append('description', description);
      formData.append('price', price);
      formData.append('count', productCount);
      images.forEach((image) => formData.append('images', image));
      formData.append('sellerEmail', email);

      await axios.post('https://project-9jg7.onrender.com/api/products/add', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setLoading(false);
      navigate('/seller-landing');
    } catch (error) {
      setError('Failed to add product');
      setLoading(false);
    }
  };

  return (
    <div className={styles.mainContent}>
      <Navbar /> {/* Adding the Navbar */}
      <div className={styles.addProductContainer}>
        <Sidebar /> {/* Adding the Sidebar */}

        <form className={styles.form} onSubmit={handleSubmit}>
          {/* Product Name Input */}
          <div className={styles.formGroup}>
            <h1>Add New Product</h1>
            <label>Product Name</label>
            <input
              type="text"
              value={productName}
              onChange={(e) => handleFieldChange('productName', e.target.value)}
              onBlur={() => handleBlur('productName')}
              required
            />
            {touched.productName && (!nameRegex.test(productName) || doubleSpaceRegex.test(productName)) && (
              <p className={styles.error}>
                Product name should contain only alphabetic characters and no double spaces.
              </p>
            )}
            {touched.productName && productName.length > 50 && (
              <p className={styles.error}>Product name should not exceed 50 characters.</p>
            )}
          </div>

          {/* Description Input */}
          <div className={styles.formGroup}>
            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => handleFieldChange('description', e.target.value)}
              required
            />
          </div>

          {/* Price Input */}
          <div className={styles.formGroup}>
            <label>Price</label>
            <input
              type="number"
              value={price}
              onChange={(e) => handleFieldChange('price', e.target.value)}
              onBlur={() => handleBlur('price')}
              required
            />
            {touched.price && price <= 1 && (
              <p className={styles.error}>Price should be greater than 1.</p>
            )}
          </div>

          {/* Product Count Input */}
          <div className={styles.formGroup}>
            <label>Product Count</label>
            <input
              type="number"
              value={productCount}
              onChange={(e) => handleFieldChange('productCount', e.target.value)}
              onBlur={() => handleBlur('productCount')}
              required
            />
            {touched.productCount && productCount <= 1 && (
              <p className={styles.error}>Product count should be greater than 1.</p>
            )}
          </div>

          {/* Product Images Upload */}
          <div className={styles.formGroup}>
            <label>Product Images (max 3)</label>
            <input
              type="file"
              multiple
              onChange={handleImageChange}
              accept="image/*"
              required
            />
            {images.length > 3 && (
              <p className={styles.error}>You can only upload up to 3 images.</p>
            )}
          </div>

          {/* Error Message and Submit Button */}
          {error && <p className={styles.error}>{error}</p>}
          {loading ? (
            <p>Loading...</p>
          ) : (
            <button type="submit" className={styles.submitButton} disabled={!formValid}>
              Add Product
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
