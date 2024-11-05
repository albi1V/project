// AdminLayout.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../Anavbar'; 
import Sidebar from '../Asidebar'; // Import the Sidebar component
import styles from './AdminLayout.module.css'; // CSS module for layout styling

const AdminLayout = () => {
  return (
    <div className={styles.adminLayout}>
     
      <Navbar />
      
      <div className={styles.content}>
     
        <Sidebar />
        
        <main className={styles.mainContent}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
