import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Asidebar';  // Assuming you have Sidebar and Navbar components
import Navbar from './Anavbar';  // Import Navbar component
import styles from '../seller/slrViewTend.module.css'; // Ensure this is imported

const MarketTrends = () => {
  const [marketTrends, setMarketTrends] = useState([]);
  const navigate = useNavigate();

  // Fetch all market trends on component load
  useEffect(() => {
    const fetchMarketTrends = async () => {
      try {
        const response = await axios.get('https://project-9jg7.onrender.com/api/trend/all');
        const sortedTrends = sortTrendsByDate(response.data); // Sort the trends by date
        setMarketTrends(sortedTrends);
      } catch (error) {
        console.error('Error fetching market trends', error);
      }
    };
    fetchMarketTrends();
  }, []);

  // Utility function to remove the time part of a date (set time to 00:00:00)
  const normalizeDate = (date) => {
    const normalized = new Date(date);
    normalized.setHours(0, 0, 0, 0); // Set the time to midnight
    return normalized;
  };

  // Sort trends by date (today and future dates at the top, past dates at the bottom)
  const sortTrendsByDate = (trends) => {
    const currentDate = normalizeDate(new Date());
    
    return trends.sort((a, b) => {
      const dateA = normalizeDate(new Date(a.date));
      const dateB = normalizeDate(new Date(b.date));
      
      // If both dates are in the past or both are in the future, sort by date (earlier dates first)
      if ((dateA >= currentDate && dateB >= currentDate) || (dateA < currentDate && dateB < currentDate)) {
        return dateA - dateB;
      }
      
      // If one date is in the future and the other in the past, put future dates first
      if (dateA >= currentDate && dateB < currentDate) {
        return -1; // a (future) comes before b (past)
      }
      if (dateA < currentDate && dateB >= currentDate) {
        return 1;  // b (future) comes before a (past)
      }
    });
  };

  // Handle when the farmer clicks on "Sell" button
  const handleSellClick = (product) => {
    navigate(`/trendReqForsell?product=${product}`);
  };

  return (
    <div className={styles.mainContent}>
      <Navbar /> {/* Navbar component */}
      <div className={styles.adminLayout}>
        <Sidebar /> {/* Sidebar component */}
        
        <div className={styles.trendList}>
          <h1>Current Market Trends</h1>
          <table>
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Market Value</th>
                <th>Our Price</th>
                <th>Date</th>
                {/* <th>Action</th> */}
              </tr>
            </thead>
            <tbody>
              {marketTrends.map((trend) => {
                const trendDate = normalizeDate(new Date(trend.date));
                const currentDate = normalizeDate(new Date()); // Normalize current date
                const isFutureOrTodayDate = trendDate >= currentDate; // Check for today or future

                return (
                  <tr key={trend._id}>
                    <td>{trend.productName}</td>
                    <td>₹{trend.marketValue}</td>
                    <td>₹{trend.ourPrice}</td>
                    <td>{trendDate.toLocaleDateString()}</td> {/* Formatting date */}
                    {/* <td>
                      <button 
                        onClick={() => handleSellClick(trend.productName)}
                        disabled={!isFutureOrTodayDate} // Disable button for past dates, enable for today or future
                      >
                        Sell
                      </button>
                    </td> */}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MarketTrends;
