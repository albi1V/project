import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './adviewscheme.module.css'; // Your CSS module

const AdminSchemes = () => {
  const [schemes, setSchemes] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('token'); // Ensure token exists

  // Fetch schemes from the backend
  useEffect(() => {
    const fetchSchemes = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/schemes/viewall', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSchemes(response.data);
      } catch (error) {
        console.error('Error fetching schemes:', error);
      }
    };

    fetchSchemes();
  }, [token]);

  // Handle scheme deletion
  const handleDelete = async (schemeId) => {
    if (window.confirm('Are you sure you want to delete this scheme?')) {
      try {
        await axios.delete(`http://localhost:5000/api/schemes/delete/${schemeId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        alert('Scheme deleted successfully!');
        setSchemes(schemes.filter((scheme) => scheme._id !== schemeId)); // Update the list locally
      } catch (error) {
        console.error('Error deleting scheme:', error);
        alert('Failed to delete scheme.');
      }
    }
  };

  // Handle scheme edit
  const handleEdit = (schemeId) => {
    navigate(`/editscheme/${schemeId}`); // Navigate to the edit page
  };

  // Format dates to show only the date part (no time)
  const formatDate = (date) => new Date(date).toLocaleDateString();

  return (
    <div className={styles.schemeList}>
      <h1>Manage Schemes</h1>
      {schemes.length === 0 ? (
        <p>No schemes available</p>
      ) : (
        schemes.map((scheme) => (
          <div key={scheme._id} className={styles.schemeItem}>
            <h3>{scheme.name}</h3>
            <p>{scheme.description}</p>
            <p>
              Start Date: {formatDate(scheme.startDate)} | End Date: {formatDate(scheme.endDate)}
            </p>
            <p>
              {/* Display the clickable link */}
              <a href={scheme.link} target="_blank" rel="noopener noreferrer">
                Scheme Link
              </a>
            </p>
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
            <div className={styles.buttons}>
              <button onClick={() => handleEdit(scheme._id)} className={styles.editBtn}>Edit</button>
              <button onClick={() => handleDelete(scheme._id)} className={styles.deleteBtn}>Delete</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default AdminSchemes;
