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
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password, role });
      
      const { token, role: userRole, email: userEmail } = response.data; // Destructure email from response
      console.log('User role:', userRole);
  
      // Store token and email in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('email', userEmail); // Store email to fetch user-specific data later
  
      // Redirect based on role
      if (userRole === 'farmer') {
        console.log('Redirecting to farmer-landing');
        navigate('/farmer-landing');
      } else if (userRole === 'seller') {
        console.log('Redirecting to seller-landing');
        navigate('/seller-landing');
      } else {
        console.error('Unhandled role:', userRole);
      }
    } catch (error) {
      console.error('Error during login:', error);
      setErrorMessage(error.response?.data?.message || "Login failed. Please try again.");
    }
  };


 // Function to handle sign-in with Google
 const handleGoogleSignIn = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    const idToken = await user.getIdToken();  // Get Firebase ID token

    // Send token and email to your backend
    const response = await axios.post('http://localhost:5000/api/auth/google-login', {
      token: idToken,
      email: user.email,
    });

    const { token, role: userRole, email: userEmail } = response.data;
    localStorage.setItem('token', token);
    localStorage.setItem('email', userEmail);

    if (userRole === 'farmer') {
      navigate('/farmer-landing');
    } else if (userRole === 'seller') {
      navigate('/seller-landing');
    }
  } catch (error) {
    setErrorMessage("Google sign-in failed. Please try again.");
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
          <div className={styles.formGroup}>
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
          </div>
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
