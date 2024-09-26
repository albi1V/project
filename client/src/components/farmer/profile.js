import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './profile.module.css'; // Importing CSS module

const Profile = () => {
  const [userData, setUserData] = useState(null); // Store user data
  const [loading, setLoading] = useState(true);   // Loading state
  const [error, setError] = useState('');         // Error state
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      const email = localStorage.getItem('email'); // Get the email stored during login

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
    <div className={styles.profileContainer}>
      <h1 className={styles.title}>User Profile</h1>
      <div className={styles.userInfo}>
        <p><strong>Full Name:</strong> {userData.username}</p>
        <p><strong>Email:</strong> {userData.email}</p>
        <p><strong>Address:</strong> {userData.address}</p>
        <p><strong>Phone:</strong> {userData.phone}</p>
        <p><strong>Role:</strong> {userData.role}</p>
        <p><strong>Account Created:</strong> {new Date(userData.createdAt).toLocaleDateString()}</p>
      </div>
      <button className={styles.editButton} onClick={() => navigate('/edit-profile')}>
        Edit Profile
      </button>
    </div>
  );
};

export default Profile;
