import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './Asidebar'; // Ensure correct path to Sidebar
import Navbar from './Anavbar'; // Ensure correct path to Navbar
import styles from './tendPurchReq.module.css'; // Ensure correct path to CSS module

const AdminUserControl = () => {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('https://project-9jg7.onrender.com/api/usercontrole/users');
        setUsers(response.data);
      } catch (error) {
        setMessage('Error fetching users.');
      }
    };
    fetchUsers();
  }, []);

  const handleBlock = async (userId) => {
    const token = localStorage.getItem('token'); // Get the token from localStorage
    
    if (!token) {
      setMessage('No token found, please log in again.'); // Feedback if no token is present
      return; // Prevent further execution
    }
  
    try {
      const response = await axios.put(`https://project-9jg7.onrender.com/api/usercontrole/block/${userId}`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`, // Pass token here
        },
      });
  
      if (response.status === 200) {
        setUsers((prevUsers) =>
          prevUsers.map((user) => (user._id === userId ? { ...user, isBlocked: true } : user)) // Update the user status
        );
        setMessage('User blocked successfully.'); // Success message
      } else {
        const errorData = response.data; // Get error message from the response
        console.log('Error blocking user:', errorData.message);
        setMessage(`Error blocking user: ${errorData.message}`); // Provide specific error feedback
      }
    } catch (error) {
      console.error('Error in handleBlock:', error); // Log error for debugging
      setMessage('Error blocking user. Please try again later.'); // User feedback for unexpected errors
    }
  };

  const handleUnblock = async (userId) => {
    const token = localStorage.getItem('token'); // Get the token from localStorage
    if (!token) {
      setMessage('No token found, please log in again.'); // Feedback if no token is present
      return; // Prevent further execution
    }
  
    try {
      const response = await axios.put(`https://project-9jg7.onrender.com/api/usercontrole/unblock/${userId}`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`, // Include token in headers
        },
      });
  
      if (response.status === 200) {
        setUsers((prevUsers) =>
          prevUsers.map((user) => (user._id === userId ? { ...user, isBlocked: false } : user)) // Update the user status
        );
        setMessage('User unblocked successfully.'); // Success message
      } else {
        const errorData = response.data; // Get error message from the response
        console.log('Error unblocking user:', errorData.message);
        setMessage(`Error unblocking user: ${errorData.message}`); // Provide specific error feedback
      }
    } catch (error) {
      console.error('Error in handleUnblock:', error); // Log error for debugging
      setMessage('Error unblocking user. Please try again later.'); // User feedback for unexpected errors
    }
  };

  return (
    <div className={styles.mainContent}>
      <Navbar /> {/* Include the Navbar */}

      <div className={styles.adminLayout}>
        <Sidebar /> {/* Include the Sidebar */}

        <div className={styles.contentContainer}>
          <h1>User Control</h1>
          {message && <p>{message}</p>}
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{user.isBlocked ? 'Blocked' : 'Active'}</td>
                  <td>
                    {user.isBlocked ? (
                      <button onClick={() => handleUnblock(user._id)}>Unblock</button>
                    ) : (
                      <button onClick={() => handleBlock(user._id)}>Block</button>
                    )}
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

export default AdminUserControl;
