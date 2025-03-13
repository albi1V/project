import React, { useState } from "react";
import axios from "axios";
import Sidebar from "./fsidebar";
import Navbar from "./fnavbar";
import styles from "./plt_hlt.module.css";

const UploadImage = () => {
  const [file, setFile] = useState(null);
  const [predictionData, setPredictionData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select an image first");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      setLoading(true);
      const response = await axios.post("https://project-9jg7.onrender.com/api/ml/predict", formData);
      setPredictionData(response.data);
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId) => {
    const token = localStorage.getItem('token');

    try {
      await axios.post(
        'https://project-9jg7.onrender.com/api/cart/addcart',
        { productId, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert('Product added to your cart');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add product to your cart');
    }
  };

  return (
    <div className={styles.mainContent}>
      <Navbar />
      <div className={styles.adminLayout}>
        <Sidebar />
        <div className={styles.profileContainer}>
          <h2 className={styles.title}>Upload an Image for Prediction</h2>

          <input type="file" onChange={handleFileChange} className={styles.fileInput} />
          <button onClick={handleUpload} className={styles.uploadButton} disabled={loading}>
            {loading ? "Predicting..." : "Predict"}
          </button>

          {predictionData && (
            <div className={styles.resultContainer}>
              <h3 className={styles.prediction}>
                <strong>Prediction:</strong> {predictionData.prediction}
              </h3>
              <p><strong>Description:</strong> {predictionData.description}</p>
              <p><strong>Causes:</strong> {predictionData.causes}</p>
              <p><strong>Remedies:</strong> {predictionData.remedies}</p>

              {predictionData.products && predictionData.products.length > 0 && (
  <div>
    <h3>Recommended Products:</h3>
    {predictionData.products.map((product, index) => (
      <div key={index} className={styles.productContainer}>
        <img src={`https://project-9jg7.onrender.com/api/products/get-product-images/${product.images[0] || ''}`} 
             alt={product.name} className={styles.productImage} />
        <p><strong>Name:</strong> {product.name}</p>
        <p><strong>Price:</strong> ₹{product.price}</p>
        <p><strong>Stock:</strong> {product.count} left</p>
        <button onClick={() => handleAddToCart(product._id)} className={styles.cartButton}>
          Add to Cart
        </button>
      </div>
    ))}
  </div>
)}

            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadImage;
