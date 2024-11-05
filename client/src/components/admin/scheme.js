import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Sidebar from './Asidebar';
import Navbar from './Anavbar';
import styles from './scheme.module.css';

const AddScheme = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [link, setLink] = useState('');
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [formValid, setFormValid] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    setFormValid(
      name && description && startDate && endDate && (endDate >= startDate) && file
    );
  }, [name, description, startDate, endDate, file]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formValid) {
      setError("Please fill in all required fields and ensure dates are valid.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('startDate', startDate);
      formData.append('endDate', endDate);
      formData.append('link', link);
      formData.append('document', file);

      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/schemes/add-schemes', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        },
      });

      // Show success alert
      Swal.fire({
        icon: 'success',
        title: 'Scheme Added',
        text: 'The new scheme was successfully added.',
        confirmButtonText: 'OK'
      }).then(() => {
        navigate('/adviewscheme'); // Navigate after alert is confirmed
      });
      
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while adding the scheme.');
    }
  };

  return (
    <div className={styles.mainContent}>
      <Navbar />

      <div className={styles.adminLayout}>
        <Sidebar />

        <div className={styles.formContainer}>
          <h1 className={styles.formTitle}>Add Scheme</h1>
          {error && <p className={styles.error}>{error}</p>}
          <form onSubmit={handleSubmit} className={styles.schemeForm}>
            <div className={styles.formRow}>
              <label className={styles.label}>
                Name:
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className={styles.input}
                />
              </label>
              <label className={styles.label}>
                Start Date:
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                  className={styles.input}
                  min={new Date().toISOString().split('T')[0]}
                />
              </label>
            </div>

            <div className={styles.formRow}>
              <label className={styles.label}>
                Description:
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  className={styles.textarea}
                />
              </label>
              <label className={styles.label}>
                End Date:
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                  className={styles.input}
                  min={startDate}
                />
              </label>
            </div>

            <div className={styles.formRow}>
              <label className={styles.label}>
                Link (Optional):
                <input
                  type="url"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder="https://example.com"
                  className={styles.input}
                />
              </label>
              <label className={styles.label}>
                Upload Document (PDF only):
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setFile(e.target.files[0])}
                  required
                  className={styles.input}
                />
              </label>
            </div>

            <button type="submit" disabled={!formValid} className={styles.submitButton}>
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddScheme;
