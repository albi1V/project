import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../header/header';
import styles from './frmrp.module.css'; // Import the styles as CSS module

const FarmerProfile = () => {
  const [userData, setUserData] = useState(null); // Store user data
  const [loading, setLoading] = useState(true);   // Loading state
  const [error, setError] = useState('');         // Error state

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      const email = localStorage.getItem('email'); // Get the email stored during login

      console.log(localStorage.getItem('token'));
      console.log(localStorage.getItem('email'));


      if (!token || !email) {
        setError('Unauthorized');
        setLoading(false);
        return;
      }
  
      try {
        const response = await axios.get(`http://localhost:5000/api/auth/user/${email}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token for authorization
          },
        });
        
        setUserData(response.data);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch user data');
        setLoading(false);
      }
    };
  
    fetchUserData();
  }, []);
  

  if (loading) {
    return <p className={styles.loading}>Loading...</p>;
  }

  if (error) {
    return <p className={styles.error}>{error}</p>;
  }

  return (
    <div>
     <Header/>
          <div className={styles.container}>
      <h1 className={styles.title}>Welcome, {userData.username}!</h1> {/* Display user's name */}
      <p className={styles.message}>
        We're glad to have you here. Explore the platform to manage your crops and connect with buyers.
      </p>

      <div className={styles.userInfo}>
        <p><strong>Role:</strong> {userData.role}</p>
        <p><strong>Address:</strong> {userData.address}</p>
        <p><strong>Phone:</strong> {userData.phone}</p>
        <p><strong>Email:</strong> {userData.email}</p>
        <p><strong>Account Created:</strong> {new Date(userData.createdAt).toLocaleString()}</p>
      </div>
      
    </div>
    </div>
  );
};

export default FarmerProfile;
