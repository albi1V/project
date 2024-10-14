import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import axios from 'axios'; 
import styles from './login.module.css'; 
import { auth, provider, signInWithPopup } from '../../firebase';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); 

  const navigate = useNavigate(); 

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
  
      // Destructure role from the backend response
      const { token, role: userRole, email: userEmail } = response.data;
  
      localStorage.setItem('token', token);
      localStorage.setItem('email', userEmail);

      if (userRole === 'farmer') {
        navigate('/farmer-landing');
      } else if (userRole === 'seller') {
        navigate('/seller-landing');
      }else if (userRole === 'admin') {
        navigate('/adminlan');  
      }

    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Login failed. Please try again.");
    }
  };
  


 // Function to handle sign-in with Google
const handleGoogleSignIn = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    const idToken = await user.getIdToken(); // Get Firebase ID token

    // Send token and email to your backend
    const response = await axios.post('http://localhost:5000/api/auth/google-login', {
      token: idToken,
      email: user.email,
    });

    const { token, role: userRole, email: userEmail, isBlocked } = response.data;

    if (isBlocked) {
      setErrorMessage("Your account is blocked. Please contact the administrator.");
      return; // Stop further execution
    }

    localStorage.setItem('token', token);
    localStorage.setItem('email', userEmail);

    // Navigate based on user role
    switch (userRole) {
      case 'farmer':
        navigate('/farmer-landing');
        break;
      case 'seller':
        navigate('/seller-landing');
        break;
      case 'admin':
        navigate('/admin-landing'); // Example for admin role
        break;
      default:
        setErrorMessage("User role is not recognized.");
    }
  } catch (error) {
    // Enhance error handling
    if (error.response) {
      // Server responded with a status other than 200 range
      setErrorMessage(`Error: ${error.response.data.message || "Google sign-in failed. Please try again."}`);
    } else if (error.request) {
      // The request was made but no response was received
      setErrorMessage("No response from server. Please check your connection.");
    } else {
      // Something happened in setting up the request
      setErrorMessage(`Error: ${error.message}`);
    }
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
          {/* <div className={styles.formGroup}>
            <label htmlFor="role">Role</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required>
              <option value="">Select Role</option>
              <option value="farmer">Farmer</option>
              <option value="seller">Seller</option>
            </select>
          </div> */}
          {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>} {/* Display error message */}
          <button type="submit" className={styles.registerBtn}>Login</button>
          </form>
           <div><button onClick={handleGoogleSignIn} className={styles.googleBtn}>Sign in with Google</button> </div>
          
          
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
