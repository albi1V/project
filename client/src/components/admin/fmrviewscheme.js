import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './farmerViewSchemes.module.css'; // CSS module for styling
import Sidebar from '../farmer/fsidebar'; // Import Sidebar component
import Navbar from '../farmer/fnavbar'; // Import Navbar component

const FarmerViewSchemes = () => {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token'); // Assume farmer has logged in and token is stored

  useEffect(() => {
    const fetchSchemes = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/schemes/viewall', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSchemes(response.data);
      } catch (error) {
        console.error('Error fetching schemes:', error);
        alert('Failed to load schemes. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchSchemes();
  }, [token]);

  // Show loading message if data is being fetched
  if (loading) {
    return <div>Loading schemes...</div>;
  }

  return (
    <div className={styles.mainContent}>
      <Navbar /> {/* Navbar component */}
      <div className={styles.adminLayout}>
        <Sidebar /> {/* Sidebar component */}
        <div className={styles.schemeListContainer}>
          <h2>Available Schemes</h2>
          {schemes.length > 0 ? (
            <ul className={styles.schemeList}>
              {schemes.map((scheme) => (
                <li key={scheme._id} className={styles.schemeItem}>
                  <div className={styles.schemeDetails}>
                    <h3>{scheme.name}</h3>
                    <p>{scheme.description}</p>
                    <p><strong>Start Date:</strong> {new Date(scheme.startDate).toLocaleDateString()}</p>
                    <p><strong>End Date:</strong> {new Date(scheme.endDate).toLocaleDateString()}</p>
                    <p>
                      {scheme.file && (
                        scheme.file.endsWith('.pdf') ? (
                          <a href={`http://localhost:5000/api/schemes/get-scheme-files/${scheme.file}`} target="_blank" rel="noopener noreferrer">
                            Download {scheme.name} document
                          </a>
                        ) : (
                          <img src={`http://localhost:5000/api/schemes/get-scheme-files/${scheme.file}`} alt={scheme.name} />
                        )
                      )}
                    </p>
                  </div>

                  {/* Button to open scheme link */}
                  {scheme.link && (
                    <button
                      className={styles.schemeLinkBtn}
                      onClick={() => window.open(scheme.link, '_blank')} // Open link in new tab
                    >
                      View More Details
                    </button>
                  )}

                  {/* Display scheme document if available */}
                  {scheme.documentUrl && (
                    <div className={styles.schemeDocument}>
                      {scheme.documentUrl.endsWith('.pdf') ? (
                        <a href={`http://localhost:5000/api/schemes/get-scheme-files/${scheme.documentUrl}`} target="_blank" rel="noopener noreferrer">
                          View Scheme PDF
                        </a>
                      ) : (
                        <img
                          src={`http://localhost:5000/api/schemes/get-scheme-files/${scheme.documentUrl}`}
                          alt={scheme.name}
                          className={styles.schemeImage}
                        />
                      )}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p>No schemes available at the moment.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FarmerViewSchemes;
