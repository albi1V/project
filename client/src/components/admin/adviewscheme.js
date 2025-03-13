import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import Navbar from './Anavbar';     // Ensure the correct path to Navbar
import Sidebar from './Asidebar';   // Ensure the correct path to Sidebar
import styles from './adviewscheme.module.css'; // Your CSS module

const AdminSchemes = () => {
  const [schemes, setSchemes] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('token'); // Ensure token exists

  // Fetch schemes from the backend
  useEffect(() => {
    const fetchSchemes = async () => {
      try {
        const response = await axios.get('https://project-9jg7.onrender.com/api/schemes/viewall', {
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
  const handleDelete = (schemeId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`https://project-9jg7.onrender.com/api/schemes/delete/${schemeId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          setSchemes(schemes.filter((scheme) => scheme._id !== schemeId)); // Update the list locally
  
          Swal.fire(
            'Deleted!',
            'The scheme has been deleted successfully.',
            'success'
          );
        } catch (error) {
          console.error('Error deleting scheme:', error);
          Swal.fire('Failed', 'Failed to delete scheme. Please try again.', 'error');
        }
      }
    });
  };
  
  // Handle scheme edit
  const handleEdit = (schemeId) => {
    navigate(`/editscheme/${schemeId}`); // Navigate to the edit page
  };

  // Format dates to show only the date part (no time)
  const formatDate = (date) => new Date(date).toLocaleDateString();

  return (
    <div className={styles.adminContainer}>
      <Navbar /> {/* Include the Navbar */}
      <div className={styles.adminLayout}>
        <Sidebar /> {/* Include the Sidebar */}
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
                  <a href={scheme.link} target="_blank" rel="noopener noreferrer">
                    Scheme Link
                  </a>
                </p>
                <p>
                  {scheme.file && (
                    scheme.file.endsWith('.pdf') ? (
                      <a href={`https://project-9jg7.onrender.com/api/schemes/get-scheme-files/${scheme.file}`} target="_blank" rel="noopener noreferrer">
                        Download {scheme.name} document
                      </a>
                    ) : (
                      <img src={`https://project-9jg7.onrender.com/api/schemes/get-scheme-files/${scheme.file}`} alt={scheme.name} />
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
      </div>
    </div>
  );
};

export default AdminSchemes;
