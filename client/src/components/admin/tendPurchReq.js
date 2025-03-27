import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from './Asidebar';  // Ensure correct path to Sidebar
import Navbar from './Anavbar';  // Ensure correct path to Navbar
import styles from './tendPurchReq.module.css';

const TendPurchReq = () => {
  const [requests, setRequests] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get('https://project-9jg7.onrender.com/api/trendsell');
        setRequests(response.data);
      } catch (error) {
        console.error('Error fetching requests:', error);
        setMessage('Error fetching requests. Please try again later.');
      }
    };

    fetchRequests();
  }, []);

  const handleAccept = async (id) => {
    try {
      const response = await axios.put(`https://project-9jg7.onrender.com/api/trendsell/accept/${id}`);
      setRequests((prevRequests) =>
        prevRequests.map((request) => (request._id === id ? { ...request, status: 'accepted' } : request))
      );
      setMessage(response.data.message);
    } catch (error) {
      console.error('Error accepting request:', error);
      setMessage('Error accepting request. Please try again later.');
    }
  };

  const handleReject = async (id) => {
    try {
      const response = await axios.put(`https://project-9jg7.onrender.com/api/trendsell/reject/${id}`);
      setRequests((prevRequests) =>
        prevRequests.map((request) => (request._id === id ? { ...request, status: 'rejected' } : request))
      );
      setMessage(response.data.message);
    } catch (error) {
      console.error('Error rejecting request:', error);
      setMessage('Error rejecting request. Please try again later.');
    }
  };

  return (
    <div className={styles.mainContent}>
      <Navbar /> {/* Include the Navbar */}

      <div className={styles.adminLayout}>
        <Sidebar /> {/* Include the Sidebar */}

        <div className={styles.contentContainer}>
          <h1>Purchase Requests</h1>
          {message && <p>{message}</p>}
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Comments</th>
                <th>Pickup Date</th>
                <th>Status</th>
                <th>Farmer Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr key={request._id}>
                  <td>{request.productName}</td>
                  <td>{request.quantity}</td>
                  <td>{request.price}</td>
                  <td>{request.phone}</td>
                  <td>{request.address}</td>
                  <td>{request.comments}</td>
                  <td>{new Date(request.pickupDate).toLocaleDateString()}</td>
                  <td>{request.status}</td>
                  <td>{request.farmerEmail}</td>
                  <td>
                    <button
                      onClick={() => handleAccept(request._id)}
                      disabled={request.status === 'accepted' || request.status === 'rejected'}
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleReject(request._id)}
                      disabled={request.status === 'accepted' || request.status === 'rejected'}
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TendPurchReq;
