import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './wasterequest.module.css';
import Sidebar from './Asidebar';  // Ensure the correct path to Sidebar
import Navbar from './Anavbar';     // Ensure the correct path to Navbar

const AdminDashboard = () => {
  const [wasteRequests, setWasteRequests] = useState([]);

  useEffect(() => {
    // Fetch all waste requests
    const fetchWasteRequests = async () => {
      try {
        const response = await axios.get('https://project-9jg7.onrender.com/api/waste/get-request');
        console.log('Fetched Waste Requests:', response.data); // Debugging line
        setWasteRequests(response.data);
      } catch (error) {
        console.error('Error fetching waste requests:', error);
      }
    };

    fetchWasteRequests();
  }, []);

  const handleAccept = async (id) => {
    try {
      await axios.post(`https://project-9jg7.onrender.com/api/waste/accept/${id}`);
      alert('Waste request accepted');
      // Update UI after accepting
      setWasteRequests(wasteRequests.map(req => req._id === id ? { ...req, status: 'accepted' } : req));
    } catch (error) {
      console.error('Error accepting waste request:', error);
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.post(`https://project-9jg7.onrender.com/api/waste/reject/${id}`);
      alert('Waste request rejected');
      // Update UI after rejecting
      setWasteRequests(wasteRequests.map(req => req._id === id ? { ...req, status: 'rejected' } : req));
    } catch (error) {
      console.error('Error rejecting waste request:', error);
    }
  };

  return (
    <div className={styles.dashboardContainer}>
      <Navbar /> {/* Include the Navbar */}
      <div className={styles.adminLayout}>
        <Sidebar /> {/* Include the Sidebar */}
        <div className={styles.contentContainer}>
          <h2>Admin Dashboard - Waste Requests</h2>
          {wasteRequests.length > 0 ? (
            <table className={styles.requestsTable}>
              <thead>
                <tr>
                  <th>User Name</th>
                  <th>Address</th>
                  <th>Phone</th>
                  <th>Waste Type</th>
                  <th>Date of Request</th>
                  <th>Status</th>
                  <th>Image</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {wasteRequests.map((request) => (
                  <tr key={request._id}>
                    <td>{request.userName}</td>
                    <td>{request.address}</td>
                    <td>{request.phone}</td>
                    <td>{request.wasteType}</td>
                    <td>{new Date(request.createdAt).toLocaleDateString()}</td>
                    <td>{request.status}</td>
                    <td>
                      {request.file ? (
                        <a
                          href={`https://project-9jg7.onrender.com/api/waste/get-waste-images/${request.file}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View Image
                        </a>
                      ) : (
                        'No image'
                      )}
                    </td>
                    <td>
                      {request.status.toLowerCase() === 'pending' ? (
                        <>
                          <button
                            className={styles.acceptBtn}
                            onClick={() => handleAccept(request._id)}
                          >
                            Accept
                          </button>
                          <button
                            className={styles.rejectBtn}
                            onClick={() => handleReject(request._id)}
                          >
                            Reject
                          </button>
                        </>
                      ) : (
                        <span className={styles.statusLabel}>{request.status}</span>
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
      </div>
    </div>
  );
};

export default AdminDashboard;
