import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './requestHemade.module.css';

const UserDashboard = () => {
  const [wasteRequests, setWasteRequests] = useState([]);

  useEffect(() => {
    // Fetch the logged-in user's waste requests
    const fetchUserWasteRequests = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/waste/my-requests', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}` // Assuming JWT token is stored in localStorage
          }
        });
        setWasteRequests(response.data);
      } catch (error) {
        console.error('Error fetching user waste requests:', error);
      }
    };

    fetchUserWasteRequests();
  }, []);

  return (
    <div className={styles.dashboardContainer}>
      <h2>Your Waste Management Requests</h2>
      {wasteRequests.length > 0 ? (
        <table className={styles.requestsTable}>
          <thead>
            <tr>
              <th>Address</th>
              <th>Phone</th>
              <th>Waste Type</th>
              <th>Status</th>
              <th>Date</th>
              <th>Image</th>
            </tr>
          </thead>
          <tbody>
            {wasteRequests.map((request) => (
              <tr key={request._id}>
                <td>{request.address}</td>
                <td>{request.phone}</td>
                <td>{request.wasteType}</td>
                <td>{request.status}</td>
                <td>{new Date(request.createdAt).toLocaleDateString()}</td>
                <td>
                  {request.file ? (
                    <a href={`http://localhost:5000/api/waste/get-waste-images/${request.file}`} target="_blank" rel="noopener noreferrer">
                      View Image
                    </a>
                  ) : (
                    'No image'
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No waste requests found.</p>
      )}
    </div>
  );
};

export default UserDashboard;
