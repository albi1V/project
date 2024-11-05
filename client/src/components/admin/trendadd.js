import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import Sidebar from './Asidebar';  // Assuming you have Sidebar and Navbar components
import Navbar from './Anavbar';
import styles from './trendadd.module.css';  // Your styles here

const AddMarketTrend = () => {
  const [productName, setProductName] = useState('');
  const [marketValue, setMarketValue] = useState('');
  const [ourPrice, setOurPrice] = useState('');
  const [date, setDate] = useState('');
  const [minDate, setMinDate] = useState('');

  // Set the minimum date to today's date in YYYY-MM-DD format
  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    setMinDate(`${year}-${month}-${day}`);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/trend/add', {
        productName,
        marketValue,
        ourPrice,
        date
      });
  
      // Show success message with SweetAlert
      await Swal.fire({
        title: 'Success!',
        text: response.data.message,
        icon: 'success',
        confirmButtonText: 'OK'
      });
  
      // Optionally redirect or reload the page after success
      setTimeout(() => {
        window.location.reload();
      }, 100);
    } catch (error) {
      console.error('Error adding market trend', error);
  
      // Show error message with SweetAlert
      Swal.fire({
        title: 'Error!',
        text: 'Failed to add market trend. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };
  

  return (
    <div className={styles.mainContent}>
      <Navbar /> {/* Include the Navbar */}

      <div className={styles.adminLayout}>
        <Sidebar /> {/* Include the Sidebar */}

        <div className={styles.formContainer}>
          <h1>Add Market Trend</h1>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formRow}>
              <label>
                Product Name:
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="Product Name"
                  required
                />
              </label>
            </div>

            <div className={styles.formRow}>
              <label>
                Market Value:
                <input
                  type="number"
                  value={marketValue}
                  onChange={(e) => setMarketValue(e.target.value)}
                  placeholder="Market Value"
                  required
                />
              </label>
            </div>

            <div className={styles.formRow}>
              <label>
                Our Price:
                <input
                  type="number"
                  value={ourPrice}
                  onChange={(e) => setOurPrice(e.target.value)}
                  placeholder="Our Price"
                  required
                />
              </label>
            </div>

            <div className={styles.formRow}>
              <label>
                Date:
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  min={minDate}  // This restricts the selection of past dates
                  required
                />
              </label>
            </div>

            <button type="submit" className={styles.submitButton}>
              Add Market Trend
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddMarketTrend;
