// Sidebar.js
import React from "react";
import styles from "./Asidebar.module.css"; // CSS module for Sidebar
import { useNavigate } from "react-router-dom";

import {
  FaPlus,
  FaEye,
  FaChartLine,
  FaBell,
  FaFileAlt,
  FaShoppingCart,
  FaUsers,
  FaLightbulb,
  FaTrashAlt,
} from "react-icons/fa"; // Importing necessary icons from Font Awesome

const Sidebar = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <FaUsers className={styles.adminImage} /> {/* Admin icon */}
        <span className={styles.sidebarTitle}>Admin</span>
      </div>
      <ul className={styles.sidebarMenu}>
        <li onClick={() => handleNavigation("/addscheme")}>
          <FaPlus className={styles.icon} /> {/* Scheme icon */}
          <span>Scheme</span>
        </li>
        <li onClick={() => handleNavigation("/adviewscheme")}>
          <FaEye className={styles.icon} /> {/* View Schemes icon */}
          <span>View Added Schemes</span>
        </li>
        <li onClick={() => handleNavigation("/trendadd")}>
          <FaChartLine className={styles.icon} /> {/* Market Trend icon */}
          <span>Add Market Trend</span>
        </li>
        <li onClick={() => handleNavigation("/admin-add-notifications")}>
          <FaBell className={styles.icon} /> {/* Add Notification icon */}
          <span>Add Notification</span>
        </li>
        <li onClick={() => handleNavigation("/reported-blogs")}>
          <FaFileAlt className={styles.icon} /> {/* Manage Post icon */}
          <span>Manage Post</span>
        </li>
        <li onClick={() => handleNavigation("/tendpurch")}>
          <FaShoppingCart className={styles.icon} /> {/* Purchase Request icon */}
          <span>View Purchase Request</span>
        </li>
        <li onClick={() => handleNavigation("/user-controle")}>
          <FaUsers className={styles.icon} /> {/* User Management icon */}
          <span>User Management</span>
        </li>
        <li onClick={() => handleNavigation("/admin-view-suggesion")}>
          <FaLightbulb className={styles.icon} /> {/* Suggestions icon */}
          <span>Suggestions</span>
        </li>
        <li onClick={() => handleNavigation("/WasteRequest")}>
          <FaTrashAlt className={styles.icon} /> {/* Waste Request icon */}
          <span>Waste Request</span>
        </li>
        <li onClick={() => handleNavigation("/admin-trend-view")}>
          <FaChartLine className={styles.icon} /> {/* View Trend icon */}
          <span>View Trend</span>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
