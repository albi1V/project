import React, { useState } from 'react';
import axios from 'axios';
import { useParams ,useNavigate } from 'react-router-dom'; // for accessing token from URL

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();  // Access the token from the URL
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post(`https://project-9jg7.onrender.com/api/auth/reset-password/${token}`, {
        password,
      });
      setMessage('Password reset successful. You can now log in.');
      setTimeout(() => {
        navigate('/login');
      }, 1000);
    } catch (error) {
      setMessage('Error resetting password. Please try again.');
    }
  };

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#f0f2f5',
    fontFamily: 'Arial, sans-serif',
  };

  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    width: '300px',
    padding: '20px',
    backgroundColor: '#fff',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    borderRadius: '10px',
  };

  const inputStyle = {
    marginBottom: '10px',
    padding: '10px',
    fontSize: '16px',
    borderRadius: '5px',
    border: '1px solid #ccc',
  };

  const buttonStyle = {
    padding: '10px',
    fontSize: '16px',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  };

  const messageStyle = {
    marginTop: '10px',
    color: message.includes('Error') ? 'red' : 'green',
  };

  return (
    <div style={containerStyle}>
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit} style={formStyle}>
        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={inputStyle}
        />
        <input
          type="password"
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          style={inputStyle}
        />
        <button type="submit" style={buttonStyle}>Reset Password</button>
      </form>
      {message && <p style={messageStyle}>{message}</p>}
    </div>
  );
};

export default ResetPasswordPage;
