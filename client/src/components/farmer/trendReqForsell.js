import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import Sidebar from './fsidebar'; // Import Sidebar component
import Navbar from './fnavbar';   // Import Navbar component
import styles from './trendReqForsell.module.css'; // Create a CSS module for styling

const SellProduct = () => {
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [comments, setComments] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [message, setMessage] = useState('');
  const [product, setProduct] = useState('');
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(false); // Loading state

  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const productFromQuery = queryParams.get('product'); // Get product name from query param
    setProduct(productFromQuery); // Set product name

    // Retrieve user ID from local storage or context
    const storedUserId = localStorage.getItem('userId');
    setUserId(storedUserId); // Set the user ID state
  }, [location.search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading state to true

    if (quantity <= 0 || price <= 0) {
      setMessage('Quantity and price must be positive numbers.');
      setLoading(false);
      return;
    }

    // Basic phone number validation (10 digits)
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
      setMessage('Please enter a valid 10-digit phone number.');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token'); // Retrieve the token from local storage

      const response = await axios.post('https://project-9jg7.onrender.com/api/trendsell/register', {
        productName: product,
        quantity,
        price,
        phone,
        address,
        comments,
        pickupDate,
        userId, // Include userId in the request payload
      }, {
        headers: {
          Authorization: `Bearer ${token}`, // Set the Authorization header with the token
        },
      });

      setMessage(response.data.message); // Set the success message

      // Clear the form fields
      setQuantity('');
      setPrice('');
      setPhone('');
      setAddress('');
      setComments('');
      setPickupDate('');
    } catch (error) {
      console.error('Error submitting sell request', error);
      // Set the error message based on the response
      if (error.response) {
        setMessage(error.response.data.message || 'There was an error processing your request.');
      } else {
        setMessage('There was an error processing your request.');
      }
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className={styles.mainContent}>
      <Navbar /> {/* Navbar component */}
      <div className={styles.adminLayout}>
        <Sidebar /> {/* Sidebar component */}

        <div className={styles.formContainer}>
          <h1>Sell {product}</h1>
          <form onSubmit={handleSubmit}>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Quantity"
              required
            />
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Your Price"
              required
            />
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone Number"
              required
            />
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Address"
              required
            />
            <input
              type="text"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Comments (optional)"
            />
            <input
              type="date"
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]} // Prevent past date selection
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Request'}
            </button>
          </form>
          {message && <p>{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default SellProduct;
