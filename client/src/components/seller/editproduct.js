import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './editProduct.module.css'; // CSS module for styling

const EditProduct = () => {
  const { productId } = useParams(); // Extract productId from the URL
  const [productData, setProductData] = useState(null); // State for product data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(''); // Error state
  const [name, setName] = useState(''); // State for product name
  const [description, setDescription] = useState(''); // State for description
  const [price, setPrice] = useState(''); // State for price
  const [image, setImage] = useState(null); // State for image
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const token = localStorage.getItem('token');

        console.log(`Fetching product with ID: ${productId}`);

        const response = await axios.get(`https://project-9jg7.onrender.com/api/products/get-by-id/${productId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setProductData(response.data);
        setName(response.data.name);
        setDescription(response.data.description);
        setPrice(response.data.price);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch product');
        setLoading(false);
      }
    };

    fetchProductData();
  }, [productId]);

  const handleUpdate = async (e) => {
    e.preventDefault();
  
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('price', price);
  
      if (image) {
        formData.append('image', image); // Only include image if a new one is uploaded
      }
  
      const token = localStorage.getItem('token');
  
      // Send the form data to the server
      await axios.put(`https://project-9jg7.onrender.com/api/products/edit/${productId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
  
      navigate('/seller-profile'); // Redirect to the seller profile page after successful update
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update product');
    }
  };
  

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className={styles.editProductContainer}>
      <h1>Edit Product</h1>
      <form onSubmit={handleUpdate} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="name">Product Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="price">Price:</label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="image">Update Image (optional):</label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>
        {productData.image && (
          <div className={styles.currentImage}>
            <p>Current Image:</p>
            <img
              src={`https://project-9jg7.onrender.com/api/products/get-product-images/${productData.image}`}
              alt="Current Product"
            />
          </div>
        )}
        <button type="submit" className={styles.updateButton}>
          Update Product
        </button>
      </form>
    </div>
  );
};

export default EditProduct;
