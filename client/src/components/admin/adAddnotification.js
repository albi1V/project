import React from 'react';
import Sidebar from './Asidebar';
import Navbar from './Anavbar';
import styles from './viewsuggesions.module.css'; // Assuming styles are in this file

const SuggestionPage = () => {
    return (
        <div className={styles.mainContent}>
            <Navbar />
            <div className={styles.adminLayout}>
                <Sidebar />
                <div 
                    className={styles.contentContainer} 
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}
                >
                    <h1>Notifications</h1>
                    <p style={{ fontSize: '18px', color: 'gray' }}>This page is in progress</p>
                </div>
            </div>
        </div>
    );
};

export default SuggestionPage;
