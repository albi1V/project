import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import Sidebar from './Asidebar';
import Navbar from './Anavbar';
import styles from './trendadd.module.css';

const AddMarketTrend = () => {
  const [productName, setProductName] = useState('');
  const [marketValue, setMarketValue] = useState('');
  const [ourPrice, setOurPrice] = useState('');
  const [date, setDate] = useState('');
  const [minDate, setMinDate] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    setMinDate(`${year}-${month}-${day}`);
  }, []);

  // Validation functions
  const validateProductName = (name) => /^[a-zA-Z ]{1,50}$/.test(name) && !/\s\s+/.test(name);
  const validatePriceField = (value) => /^\d{1,5}$/.test(value);

  // Update form validity based on all field checks
  useEffect(() => {
    const isValid =
      validateProductName(productName) &&
      validatePriceField(marketValue) &&
      validatePriceField(ourPrice) &&
      date >= minDate;
    setIsFormValid(isValid);
  }, [productName, marketValue, ourPrice, date, minDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    try {
      const response = await axios.post('http://localhost:5000/api/trend/add', {
        productName,
        marketValue,
        ourPrice,
        date,
      });

      await Swal.fire({
        title: 'Success!',
        text: response.data.message,
        icon: 'success',
        confirmButtonText: 'OK',
      });

      setTimeout(() => {
        window.location.reload();
      }, 100);
    } catch (error) {
      console.error('Error adding market trend', error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to add market trend. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  };

  return (
    <div className={styles.mainContent}>
      <Navbar />
      <div className={styles.adminLayout}>
        <Sidebar />
        <div className={styles.formContainer}>
          <h1>Add Market Trend</h1>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formRow}>
              <label>
                Product Name:
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => {
                    if (validateProductName(e.target.value)) setProductName(e.target.value);
                  }}
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
                  onChange={(e) => {
                    if (validatePriceField(e.target.value)) setMarketValue(e.target.value);
                  }}
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
                  onChange={(e) => {
                    if (validatePriceField(e.target.value)) setOurPrice(e.target.value);
                  }}
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
                  min={minDate}
                  required
                />
              </label>
            </div>

            <button
              type="submit"
              className={styles.submitButton}
              disabled={!isFormValid} // Only enable when form is valid
            >
              Add Market Trend
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddMarketTrend;
