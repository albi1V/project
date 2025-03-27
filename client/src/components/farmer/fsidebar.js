import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEdit, FaPlus, FaSeedling, FaNewspaper,FaProductHunt, FaBlog, FaRegLightbulb, FaRecycle, FaEnvelopeOpenText, FaChartLine,FaClipboardList  } from 'react-icons/fa'; // Example icons
import axios from 'axios'; // Add axios for API calls
import styles from './fsidebar.module.css'; // Ensure this CSS file exists for styling

const Sidebar = ({ farmerName }) => {
  return (
    <aside className={styles.sidebar}>
      <h2>{farmerName}</h2> {/* Display farmer's name here */}
      <ul className={styles.navList}>
        <li>
          <Link to="/edit-profile">
            <FaEdit className={styles.icon} /> {/* Add icon */}
            Edit Profile
          </Link>
        </li>
        <li>
          <Link to="/add-blog">
            <FaPlus className={styles.icon} /> {/* Add icon */}
            Add Post
          </Link>
        </li>
        <li>
          <Link to="/view-all-products">
            <FaProductHunt className={styles.icon} /> {/* Add icon */}
            Check Products
          </Link>
        </li>
        <li>
          <Link to="/view-all-blogs">
            <FaBlog className={styles.icon} /> {/* Add icon */}
            View Blogs
          </Link>
        </li>
        <li>
          <Link to="/FarmerViewSchemes">
            <FaRegLightbulb className={styles.icon} /> {/* Add icon */}
            New Schemes
          </Link>
        </li>
        <li>
          <Link to="/request-for-waste">
            <FaRecycle className={styles.icon} /> {/* Add icon */}
            Manage Waste
          </Link>
        </li>
        <li>
          <Link to="/requestHemade">
            <FaEnvelopeOpenText className={styles.icon} /> {/* Add icon */}
            Request Made
          </Link>
        </li>
        <li>
          <Link to="/trendview">
            <FaChartLine className={styles.icon} /> {/* Add icon */}
            Current Trend
          </Link>
        </li>
        <li>
      <Link to="/fmrViewOrder">
        <FaClipboardList className={styles.icon} /> {/* Add icon */}
        Order View
      </Link>
    </li>
    <li>
  <Link to="/plantLocation">
    <FaSeedling className={styles.icon} /> {/* Plant Icon */}
    Plant Analysis
  </Link>
</li>
<li>
  <Link to="/viewnews">
    <FaNewspaper className={styles.icon} /> {/* News Icon */}
    News feeds 
  </Link>
</li>

      </ul>
    </aside>
  );
};

const FarmerDashboard = () => {
  const [farmerName, setFarmerName] = useState('');
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState('');

  // Fetch the farmer's name from API
  useEffect(() => {
    const fetchFarmerName = async () => {
      const token = localStorage.getItem('token');
      const email = localStorage.getItem('email'); // Get the email stored during login

      if (!token || !email) {
        setError('Unauthorized');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`https://project-9jg7.onrender.com/api/auth/user/${email}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setFarmerName(response.data.username); // Set the username from API response
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch user data');
        setLoading(false);
      }
    };

    fetchFarmerName();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="dashboard">
      <Sidebar farmerName={farmerName} /> {/* Pass farmerName as a prop */}
      {/* Other components or content for the dashboard */}
    </div>
  );
};

export default FarmerDashboard;
