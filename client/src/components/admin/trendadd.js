import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddMarketTrend = () => {
  const [productName, setProductName] = useState('');
  const [marketValue, setMarketValue] = useState('');
  const [date, setDate] = useState('');
  const [ourPrice, setOurPrice] = useState('');
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
      alert(response.data.message);
      setTimeout(() => {
        window.location.reload()
      }, 100);
    } catch (error) {
      console.error('Error adding market trend', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={productName}
        onChange={(e) => setProductName(e.target.value)}
        placeholder="Product Name"
        required
      />
      <input
        type="number"
        value={marketValue}
        onChange={(e) => setMarketValue(e.target.value)}
        placeholder="Market Value"
        required
      />
      <input
        type="number"
        value={ourPrice}  // Input for Our Price
        onChange={(e) => setOurPrice(e.target.value)}
        placeholder="Our Price"
        required
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        min={minDate}  // This restricts the selection of past dates
        required
      />
      <button type="submit">Add Market Trend</button>
    </form>
  );
};

export default AddMarketTrend;
