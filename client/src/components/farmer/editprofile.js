import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import styles from './edf.module.css';



const EditProfile = () => {
  const [userData, setUserData] = useState({
    username: '',
    email: '',      // Include email in userData
    address: '',
    phone: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch user data when component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      const email = localStorage.getItem('email');
      
      if (!token || !email) {
        setError('Unauthorized access');
        setLoading(false);
        return;
      }

      try {
        // Fetch user data from API
        const response = await axios.get(`http://localhost:5000/api/auth/user/${email}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        // Populate the form with user data
        setUserData(response.data);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch user data');
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  // Handle form submission for updating profile
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      // Update the user profile via the backend API
      await axios.put(`http://localhost:5000/api/auth/user/${userData.email}`, userData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Profile updated successfully!');
      

    } catch (error) {
      setError('Failed to update profile');
    }
  };

  // Display loading and error states
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  // Render the form
  return (
    <div>
      <h1 className={styles.heading}>Edit Your Profile</h1>
      <div className={styles.formContainer}>
        <form onSubmit={handleSubmit}>
          <label>Full Name:
            <input
              type="text"
              name="username"
              value={userData.username}
              onChange={handleInputChange}
              required  // Make the field required
            />
          </label>
          <label>Email:
            <input
              type="email"
              name="email"
              value={userData.email}
              onChange={handleInputChange}
              disabled  // Disable email to prevent editing
            />
          </label>
          <label>Address:
            <input
              type="text"
              name="address"
              value={userData.address}
              onChange={handleInputChange}
              required  // Make the field required
            />
          </label>
          <label>Phone:
            <input
              type="text"
              name="phone"
              value={userData.phone}
              onChange={handleInputChange}
              required  // Make the field required
            />
          </label>
          <button type="submit">Update Profile</button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
