import React from 'react';
import styles from './Anavbar.module.css'; // CSS module for Navbar
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  // Function to handle navigation to different pages
  const handleNavigation = (path) => {
    navigate(path);
  };

  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    navigate('/login', { replace: true });

    // Prevent the user from going back to the previous page after logging out
    window.history.pushState(null, '', window.location.href);
    window.onpopstate = function () {
      window.history.go(1);
    };
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarContent}>
        {/* Home navigation */}
        <span 
          className={styles.adminTitle} 
          onClick={() => handleNavigation('/adminlan')} // Navigate to the home page or schemes view
        >
          HOME
        </span>
        {/* Logout button */}
        <button onClick={handleLogout} className={styles.logoutButton}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
