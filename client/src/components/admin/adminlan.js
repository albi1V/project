import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './adminlan.module.css'; // Import CSS module

const AdminConsole = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path); // Navigate to the corresponding page
  };

  return (
    <div className={styles.adminContainer}>
      <div className={styles.header}>
        <div className={styles.profile}>
          <img src="path_to_profile_image" alt="Profile" className={styles.profileImage} />
          <span className={styles.adminTitle}>Admin Console</span>
        </div>
      </div>

      <div className={styles.gridContainer}>
        <div className={styles.gridItem} onClick={() => handleNavigation('/addscheme')}>
          <img src="path_to_scheme_icon" alt="Scheme" className={styles.icon} />
          <p>Scheme</p>
        </div>
        <div className={styles.gridItem} onClick={() => handleNavigation('/adviewscheme')}>
          <img src="path_to_scheme_icon" alt="Scheme" className={styles.icon} />
          <p>view added Schemes</p>
        </div>
        <div className={styles.gridItem} onClick={() => handleNavigation('/market-trend')}>
          <img src="path_to_market_trend_icon" alt="Market Trend" className={styles.icon} />
          <p>Market Trend</p>
        </div>
        <div className={styles.gridItem} onClick={() => handleNavigation('/add-notification')}>
          <img src="path_to_notification_icon" alt="Add Notification" className={styles.icon} />
          <p>Add Notification</p>
        </div>
        <div className={styles.gridItem} onClick={() => handleNavigation('/manage-post')}>
          <img src="path_to_manage_post_icon" alt="Manage Post" className={styles.icon} />
          <p>Manage Post</p>
        </div>
        <div className={styles.gridItem} onClick={() => handleNavigation('/purchase-request')}>
          <img src="path_to_purchase_request_icon" alt="View Purchase Request" className={styles.icon} />
          <p>View Purchase Request</p>
        </div>
        <div className={styles.gridItem} onClick={() => handleNavigation('/user-management')}>
          <img src="path_to_user_management_icon" alt="User Management" className={styles.icon} />
          <p>User Management</p>
        </div>
        <div className={styles.gridItem} onClick={() => handleNavigation('/suggestions')}>
          <img src="path_to_suggestions_icon" alt="Suggestions" className={styles.icon} />
          <p>Suggestions</p>
        </div>
      </div>
    </div>
  );
};

export default AdminConsole;
