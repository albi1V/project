import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './adminlan.module.css'; // Import CSS module

import add from '../../assets/slrfun/add.png';
import view from '../../assets/admin/view.png';
import trend from '../../assets/farln/trend.png';
import addn from '../../assets/admin/addn.png';
import mp from '../../assets/admin/mp.png';
import purrchr from '../../assets/admin/purrchr.png';
import user from '../../assets/admin/user.png';
import sug from '../../assets/admin/sug.png';
import wst from '../../assets/admin/wst.png';
import admin from '../../assets/admin/adminn.png';

const AdminConsole = () => {
  const navigate = useNavigate();

  // Handle navigation to different pages
  const handleNavigation = (path) => {
    navigate(path);
  };

  // Handle logout action
  const handleLogout = () => {
    // Clear any authentication data (for example, removing tokens or user data from local storage)
    localStorage.removeItem('token'); // Clear the token
    localStorage.removeItem('email'); // Clear the email

    // Redirect to the login page and replace history
    navigate('/login', { replace: true });

    // After logout, block the back button
    window.history.pushState(null, '', window.location.href);
    window.onpopstate = function () {
      window.history.go(1);
    };
  };

  useEffect(() => {
    // Ensure the back button doesn't take the user to the previous authenticated state
    window.history.pushState(null, '', window.location.href);
    window.onpopstate = function () {
      window.history.go(1); // Prevent back navigation after logout
    };
  }, []);

  return (
    <div className={styles.adminContainer}>
      <div className={styles.header}>
        <div className={styles.profile}>
          <img src={admin} alt="Profile" className={styles.profileImage} />
          <span className={styles.adminTitle}>Admin Console</span>
        </div>
        {/* Add the Logout button */}
        <button onClick={handleLogout} className={styles.logoutButton}>
          Logout
        </button>
      </div>

      <div className={styles.gridContainer}>
        <div className={styles.gridItem} onClick={() => handleNavigation('/addscheme')}>
          <img src={add} alt="Scheme" className={styles.icon} />
          <p>Scheme</p>
        </div>
        <div className={styles.gridItem} onClick={() => handleNavigation('/adviewscheme')}>
          <img src={view} alt="Scheme" className={styles.icon} />
          <p>View Added Schemes</p>
        </div>
        <div className={styles.gridItem} onClick={() => handleNavigation('/trendadd')}>
          <img src={trend} alt="Market Trend" className={styles.icon} />
          <p>Add Market Trend</p>
        </div>
        <div className={styles.gridItem} onClick={() => handleNavigation('/add-notification')}>
          <img src={addn} alt="Add Notification" className={styles.icon} />
          <p>Add Notification</p>
        </div>
        <div className={styles.gridItem} onClick={() => handleNavigation('/manage-post')}>
          <img src={mp} alt="Manage Post" className={styles.icon} />
          <p>Manage Post</p>
        </div>
        <div className={styles.gridItem} onClick={() => handleNavigation('/tendpurch')}>
          <img src={purrchr} alt="View Purchase Request" className={styles.icon} />
          <p>View Purchase Request</p>
        </div>
        <div className={styles.gridItem} onClick={() => handleNavigation('/user-controle')}>
          <img src={user} alt="User Management" className={styles.icon} />
          <p>User Management</p>
        </div>
        <div className={styles.gridItem} onClick={() => handleNavigation('/suggestions')}>
          <img src={sug} alt="Suggestions" className={styles.icon} />
          <p>Suggestions</p>
        </div>
        <div className={styles.gridItem} onClick={() => handleNavigation('/WasteRequest')}>
          <img src={wst} alt="Waste Request" className={styles.icon} />
          <p>Waste Request</p>
        </div>
      </div>
    </div>
  );
};

export default AdminConsole;
