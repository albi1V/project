import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import styles from './fnavbar.module.css'; // Ensure you have this CSS file for styling

const Navbar = ({ farmerName }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

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
    <header className={styles.navbar}>
      <div className={styles.logo}>
        <a href="/farmer-landing">AGRISPOT</a>
      </div>
      <div className={styles.profile} onClick={toggleDropdown}>
        <img
          src="https://img.icons8.com/?size=100&id=98957&format=png&color=000000"
          alt="User Profile"
          className={styles.avatar}
        />
        <span className={styles.username}>{farmerName}</span> {/* Display farmer's name */}
        <div className={styles.dropdown}>
          {dropdownOpen && (
            <div className={styles.dropdownMenu}>
              <Link to="/profile" className={styles.dropdownItem}>Profile</Link>
              <Link to="/cart" className={styles.dropdownItem}>Cart</Link>
              <span 
                onClick={handleLogout} 
                className={styles.dropdownItem} 
                style={{ cursor: 'pointer' }} // Add cursor pointer for better UX
              >
                Logout
              </span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
