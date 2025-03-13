import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import axios from 'axios'; 
import Swal from 'sweetalert2';  // Import SweetAlert
import styles from './login.module.css'; 
import { auth, provider, signInWithPopup } from '../../firebase';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); 

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://project-9jg7.onrender.com/api/auth/login', { email, password });
      console.log(response);
      const { token, role: userRole, email: userEmail, userId } = response.data;
  
      localStorage.setItem('token', token);
      localStorage.setItem('email', userEmail);
      localStorage.setItem('userId', userId);
      
      if (userRole === 'farmer') {
        navigate('/farmer-landing');
      } else if (userRole === 'seller') {
        navigate('/seller-landing');
      } else if (userRole === 'admin') {
        navigate('/adminlan');  
      }
    } catch (error) {
      // Use SweetAlert for error notification
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: error.response?.data?.message || "Login failed. Please try again.",
        confirmButtonText: 'OK',
      });
    }
  };
  

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const idToken = await user.getIdToken();

      const response = await axios.post('https://project-9jg7.onrender.com/api/auth/google-login', {
        token: idToken,
        email: user.email,
      });

      const { token, role: userRole, email: userEmail, isBlocked } = response.data;

      if (isBlocked) {
        Swal.fire({
          icon: 'warning',
          title: 'Account Blocked',
          text: "Your account is blocked. Please contact the administrator.",
          confirmButtonText: 'OK',
        });
        return;
      }

      localStorage.setItem('token', token);
      localStorage.setItem('email', userEmail);

      switch (userRole) {
        case 'farmer':
          navigate('/farmer-landing');
          break;
        case 'seller':
          navigate('/seller-landing');
          break;
        case 'admin':
          navigate('/admin-landing');
          break;
        default:
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: "User role is not recognized.",
            confirmButtonText: 'OK',
          });
      }
    } catch (error) {
      // SweetAlert for Google sign-in errors
      Swal.fire({
        icon: 'error',
        title: 'Google Sign-In Failed',
        text: error.response?.data?.message || "Google sign-in failed. Please try again.",
        confirmButtonText: 'OK',
      });
      console.error("Error during Google sign-in:", error);
    }
  };
  
  return (
    <div className={styles.loginPage}>
      <div className={styles.formCard}>
        <h2 className={styles.formTitle}>Login</h2>
        <form onSubmit={handleLogin} className={styles.loginForm}>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button id ="login" type="submit" className={styles.registerBtn}>Login</button>
        </form>
        <div>
          <button onClick={handleGoogleSignIn} className={styles.googleBtn}>
            Sign in with Google
          </button>
        </div>
        <p className={styles.loginLink}>
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
        <p className={styles.resetLink}>
          Forgot your password? <Link to="/forgot-password">Reset it here</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
