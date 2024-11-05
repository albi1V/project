import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUserEdit, FaPlusCircle, FaClipboardList, FaExclamationCircle ,FaBlog,FaChartLine} from 'react-icons/fa';
import axios from 'axios'; // Add axios for API calls
import styles from './slrSbar.module.css'; // Ensure this CSS file exists for styling

const Sidebar = ({ farmerName }) => {
  
    
    return (
        <aside className={styles.sidebar}>
          <h2>{farmerName}</h2> {/* Display farmer's name here */}
          <ul className={styles.navList}>
            <li>
              <Link to="/slr-edit-profile">
                <FaUserEdit className={styles.icon} /> {/* Add appropriate icon */}
                Edit Profile
              </Link>
            </li>
            <li>
              <Link to="/add-products">
                <FaPlusCircle className={styles.icon} /> {/* Add appropriate icon */}
                Add Product
              </Link>
            </li>
            <li>
              <Link to="/slr-view-orderes">
                <FaClipboardList className={styles.icon} /> {/* Add appropriate icon */}
                Check Orders
              </Link>
            </li>
            <li>
              <Link to="/slr-complaints">
                <FaExclamationCircle className={styles.icon} /> {/* Add appropriate icon */}
                Complaints
              </Link>
            </li>
            <li>
          <Link to="/slr-view-blogs">
            <FaBlog className={styles.icon} /> {/* Add icon */}
            View Blogs
          </Link>
        </li>
        
        <li>
          <Link to="/slr-view-trend">
            <FaChartLine className={styles.icon} /> {/* Add icon */}
            Current Trend
          </Link>
        </li>
            <li>
              <Link to="/SlrAbout">
                <FaExclamationCircle className={styles.icon} /> {/* Add appropriate icon */}
                About
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
        const response = await axios.get(`http://localhost:5000/api/auth/user/${email}`, {
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
