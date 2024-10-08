import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './editScheme.module.css'; // CSS module for the form

const EditScheme = () => {
  const { schemeId } = useParams(); // Get scheme ID from the URL
  const [schemeData, setSchemeData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    documentUrl: '',
    link: '', // Add link to schemeData
  });
  const [newDocument, setNewDocument] = useState(null); // State for the new file
  const [loading, setLoading] = useState(true); // Loading state
  const token = localStorage.getItem('token'); // Get token from local storage
  const navigate = useNavigate();

  // Fetch scheme details when the component loads
  useEffect(() => {
    const fetchScheme = async () => {
      try {
        console.log('Scheme ID:', schemeId); // Log the schemeId
        const response = await axios.get(`http://localhost:5000/api/schemes/get-scheme-by-id/${schemeId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSchemeData(response.data);
      } catch (error) {
        console.error('Error fetching scheme details:', error);
        alert('Failed to load scheme details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchScheme();
  }, [schemeId, token]);

  // Handle input change for form fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSchemeData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle file input change
  const handleFileChange = (e) => {
    setNewDocument(e.target.files[0]); // Store the new file
  };

  // Handle form submission to update the scheme
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', schemeData.name);
    formData.append('description', schemeData.description);
    formData.append('startDate', schemeData.startDate);
    formData.append('endDate', schemeData.endDate);
    formData.append('link', schemeData.link); // Append link to form data
    
    if (newDocument) {
      formData.append('document', newDocument); // Attach new document only if provided
    }

    try {
      await axios.put(`http://localhost:5000/api/schemes/edit/${schemeId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data', // Important for file upload
        }
      });
      alert('Scheme updated successfully!');
      navigate('/adviewscheme'); // Navigate back to the scheme list after successful update
    } catch (error) {
      console.error('Error updating scheme:', error);
      alert('Failed to update scheme. Please try again.');
    }
  };

  // Show loading message if data is being fetched
  if (loading) {
    return <div>Loading scheme details...</div>;
  }

  return (
    <div className={styles.editFormContainer}>
      <h2>Edit Scheme</h2>
      <form onSubmit={handleSubmit} className={styles.editForm}>
        <div className={styles.formGroup}>
          <label htmlFor="name">Scheme Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={schemeData.name}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={schemeData.description}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="startDate">Start Date:</label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={schemeData.startDate ? schemeData.startDate.split('T')[0] : ''} // Extract date part
            onChange={handleInputChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="endDate">End Date:</label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={schemeData.endDate ? schemeData.endDate.split('T')[0] : ''} // Extract date part
            onChange={handleInputChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="link">Scheme Link:</label>
          <input
            type="url"
            id="link"
            name="link"
            value={schemeData.link}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="documentUrl">Uploaded Document:</label>
          {schemeData.documentUrl ? (
            <div>
              {/* Check the file type and display accordingly */}
              {schemeData.documentUrl.endsWith('.pdf') ? (
                <a href={`http://localhost:5000/api/schemes/get-scheme-files/${schemeData.documentUrl}`} target="_blank" rel="noopener noreferrer">
                  View Current PDF Document
                </a>
              ) : (
                <img
                  src={`http://localhost:5000/api/schemes/get-scheme-files/${schemeData.documentUrl}`}
                  alt={schemeData.name}
                  className={styles.documentImage}
                />
              )}
              <p>Current Document: {schemeData.documentUrl.split('/').pop()}</p> {/* Show the file name */}
            </div>
          ) : (
            <p>No document available</p>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="newDocument">Upload New Document (PDF, JPG, PNG):</label>
          <input
            type="file"
            id="newDocument"
            name="newDocument"
            accept=".pdf, .jpg, .png"
            onChange={handleFileChange}
          />
          {newDocument && <p>Selected File: {newDocument.name}</p>} {/* Show selected file name */}
        </div>

        <button type="submit" className={styles.submitBtn}>Update Scheme</button>
      </form>
    </div>
  );
};

export default EditScheme;
