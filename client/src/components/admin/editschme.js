import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2'; // Import SweetAlert2
import { useParams, useNavigate } from 'react-router-dom';
import styles from './editScheme.module.css';

const EditScheme = () => {
  const { schemeId } = useParams();
  const [schemeData, setSchemeData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    documentUrl: '',
    link: '',
  });
  const [newDocument, setNewDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchScheme = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/schemes/get-scheme-by-id/${schemeId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSchemeData(response.data);
      } catch (error) {
        Swal.fire('Error', 'Failed to load scheme details. Please try again.', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchScheme();
  }, [schemeId, token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSchemeData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e) => {
    setNewDocument(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', schemeData.name);
    formData.append('description', schemeData.description);
    formData.append('startDate', schemeData.startDate);
    formData.append('endDate', schemeData.endDate);
    formData.append('link', schemeData.link);
    
    if (newDocument) {
      formData.append('document', newDocument);
    }

    try {
      await axios.put(`http://localhost:5000/api/schemes/edit/${schemeId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        }
      });
      
      // SweetAlert notification on successful edit
      Swal.fire({
        title: 'Success!',
        text: 'Scheme updated successfully!',
        icon: 'success',
        confirmButtonText: 'OK'
      }).then(() => {
        navigate('/adviewscheme'); // Navigate after alert
      });
    } catch (error) {
      Swal.fire('Error', 'Failed to update scheme. Please try again.', 'error');
    }
  };

  if (loading) {
    return <div>Loading scheme details...</div>;
  }

  return (
    <div className={styles.editFormContainer}>
      <h2>Edit Scheme</h2>
      <form onSubmit={handleSubmit} className={styles.editForm}>
        {/* Form fields */}
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

        {/* Description field */}
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

        {/* Start and End Dates */}
        <div className={styles.formGroup}>
          <label htmlFor="startDate">Start Date:</label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={schemeData.startDate ? schemeData.startDate.split('T')[0] : ''}
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
            value={schemeData.endDate ? schemeData.endDate.split('T')[0] : ''}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Link and Document Upload */}
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
            <a href={`http://localhost:5000/api/schemes/get-scheme-files/${schemeData.documentUrl}`} target="_blank" rel="noopener noreferrer">
              View Current Document
            </a>
          ) : <p>No document available</p>}
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
          {newDocument && <p>Selected File: {newDocument.name}</p>}
        </div>

        <button type="submit" className={styles.submitBtn}>Update Scheme</button>
      </form>
    </div>
  );
};

export default EditScheme;
