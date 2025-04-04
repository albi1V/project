import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './fsidebar'; 
import Navbar from './fnavbar';   
import styles from './edp.module.css';   

const EditProfile = () => {
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    address: '',
    phone: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      const email = localStorage.getItem('email');

      if (!token || !email) {
        setError('Unauthorized access');
        setLoading(false);
        return;
      }



      //ddfff
      try {
        const response = await axios.get(`https://project-9jg7.onrender.com/api/auth/user/${email}`, {
          headers: {
            Authorization: `Bearer ${token}`,
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

  const handleInputChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      await axios.put(`https://project-9jg7.onrender.com/api/auth/user/${userData.email}`, userData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Profile updated successfully!');
    } catch (error) {
      setError('Failed to update profile');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className={styles.mainContent}>
      <Navbar /> 
      <div className={styles.adminLayout}>
        <Sidebar /> 

        <div className={styles.formContainer}>
          <h1 className={styles.heading}>Edit Your Profile</h1>
          <form onSubmit={handleSubmit}>
            <label>Full Name:
              <input
                type="text"
                name="username"
                value={userData.username}
                onChange={handleInputChange}
                required
              />
            </label>
            <label>Email:
              <input
                type="email"
                name="email"
                value={userData.email}
                onChange={handleInputChange}
                disabled
              />
            </label>
            <label>Address:
              <input
                type="text"
                name="address"
                value={userData.address}
                onChange={handleInputChange}
                required
              />
            </label>
            <label>Phone:
              <input
                type="text"
                name="phone"
                value={userData.phone}
                onChange={handleInputChange}
                required
              />
            </label>
            <button type="submit" className={styles.submitButton}>Update Profile</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
