import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './scheme.module.css'; // Use your existing styles

const AddScheme = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [file, setFile] = useState(null);
  const [link, setLink] = useState(''); // New state for the link
  const [uploadedFileUrl, setUploadedFileUrl] = useState(''); // New state to store file URL
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Get tomorrow's date in YYYY-MM-DD format
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    if (!token) {
      setError('User is not authenticated');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('startDate', startDate);
    formData.append('endDate', endDate);
    formData.append('link', link); // Append the link to form data
    if (file) {
      formData.append('document', file); // Ensure this matches the backend 'document' field
    }

    try {
      const response = await axios.post(
        'http://localhost:5000/api/schemes/add-scheme', // Adjust the URL as needed
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Assuming response includes the uploaded file URL
      const fileUrl = response.data.fileUrl; // Make sure the backend sends this
      setUploadedFileUrl(fileUrl);

      alert('Scheme added successfully!');
      setName('');
      setDescription('');
      setStartDate('');
      setEndDate('');
      setLink(''); // Reset the link field
      setFile(null);
      navigate('/adminlan'); // Adjust the redirect as needed
    } catch (error) {
      setError('Failed to add scheme');
      console.error('Error adding scheme:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className={styles.formContainer}>
      <h1>Add Scheme</h1>
      {error && <p className={styles.error}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <label>
          Description:
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </label>
        <label>
          Start Date:
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
            min={minDate} // Set minimum date to tomorrow
          />
        </label>
        <label>
          End Date:
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
            min={startDate || minDate} // Set minimum date to the selected start date or tomorrow
          />
        </label>
        <label>
          Link (Optional):
          <input
            type="url"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="https://example.com"
          />
        </label>
        <label>
          Upload Document (jpg, png, pdf):
          <input
            type="file"
            accept=".jpg,.png,.pdf"
            onChange={handleFileChange}
            required
          />
        </label>
        <button type="submit">Submit</button>
      </form>

      {/* Display link to the uploaded file after submission */}
      {/* {uploadedFileUrl && (
        <div className={styles.fileLink}>
          <h3>Uploaded Document:</h3>
          <a href={uploadedFileUrl} target="_blank" rel="noopener noreferrer">
            View Document
          </a>
        </div>
      )} */}
    </div>
  );
};

export default AddScheme;
