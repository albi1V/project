import React, { useEffect, useState } from 'react';
import Sidebar from './Asidebar';
import Navbar from './Anavbar';
import styles from './adminlan.module.css'; 
import axios from 'axios'; // Make sure to import axios

const AdminConsole = () => {
  const [sellersCount, setSellersCount] = useState(0);
  const [farmersCount, setFarmersCount] = useState(0);
  const [productsCount, setProductsCount] = useState(0);
  const [postsCount, setPostsCount] = useState(0);

  useEffect(() => {
    // Prevent back navigation
    window.history.pushState(null, '', window.location.href);
    window.onpopstate = function () {
      window.history.go(1);
    };

    // Fetch counts
    const fetchCounts = async () => {
      try {
        const sellersResponse = await axios.get('http://localhost:5000/api/adminconsole/scount');
        const farmersResponse = await axios.get('http://localhost:5000/api/adminconsole/fcount');
        const productsResponse = await axios.get('http://localhost:5000/api/adminconsole/prcount');
        const postsResponse = await axios.get('http://localhost:5000/api/adminconsole/pcount');

        setSellersCount(sellersResponse.data.count);
        setFarmersCount(farmersResponse.data.count);
        setProductsCount(productsResponse.data.count);
        setPostsCount(postsResponse.data.count);
      } catch (error) {
        console.error('Error fetching counts:', error);
      }
    };

    fetchCounts();
  }, []);

  return (
    <div className={styles.mainContent}>
      <Navbar />
      <div className={styles.adminLayout}>
        <Sidebar />
        
        {/* Dashboard Content */}
        <div className={styles.dashboardContent}>
          <h1>Admin Dashboard</h1>
          <div className={styles.cardContainer}>
            <div className={styles.card}>
              <h2>Sellers</h2>
              <p>{sellersCount}</p>
            </div>
            <div className={styles.card}>
              <h2>Farmers</h2>
              <p>{farmersCount}</p>
            </div>
            <div className={styles.card}>
              <h2>Products</h2>
              <p>{productsCount}</p>
            </div>
            <div className={styles.card}>
              <h2>Posts</h2>
              <p>{postsCount}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminConsole;
