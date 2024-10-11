import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import './trendview.module.css';
 // Ensure this is imported

const MarketTrends = () => {
  const [marketTrends, setMarketTrends] = useState([]);
  const navigate = useNavigate();

  // Fetch all market trends on component load
  useEffect(() => {
    const fetchMarketTrends = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/trend/all');
        setMarketTrends(response.data);
      } catch (error) {
        console.error('Error fetching market trends', error);
      }
    };
    fetchMarketTrends();
  }, []);

  // Handle when the farmer clicks on "Sell" button
  const handleSellClick = (product) => {
    navigate(`/trendReqForsell?product=${product}`);
  };

  return (
    <div>
      <h1>Current Market Trends</h1>
      <table>
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Market Value</th>
            <th>Our Price</th>
            <th>Date Added</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {marketTrends.map((trend) => (
            <tr key={trend._id}>
              <td>{trend.productName}</td>
              <td>₹{trend.marketValue}</td>
              <td>₹{trend.ourPrice}</td>
              <td>{new Date(trend.date).toLocaleDateString()}</td> {/* Formatting date */}
              <td>
                <button onClick={() => handleSellClick(trend.productName)}>Sell</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MarketTrends;
