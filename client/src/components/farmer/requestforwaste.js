import React, { useState } from 'react';
import axios from 'axios';
import styles from './requestforwaste.module.css';

const WasteManagementRequest = () => {
  const [formData, setFormData] = useState({
    userName: '',
    address: '',
    phone: '',
    wasteType: '',
    wasteDetails: '',
    file: null,
    plasticType: '',
    plasticCount: '',
    metalWeight: '',
    metalType: '',
    pesticideAmount: '',
    otherWasteType: '', // Added for 'other' waste type
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, file: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.userName || !formData.address || !formData.phone || !formData.wasteType || !formData.wasteDetails) {
      alert('Please fill in all required fields.');
      return;
    }

    if (formData.wasteType === 'plastic' && (!formData.plasticType || formData.plasticCount < 0)) {
      alert('Please specify plastic type and count.');
      return;
    }

    if (formData.wasteType === 'metal' && (!formData.metalType || formData.metalWeight < 0)) {
      alert('Please specify metal type and weight.');
      return;
    }

    if (formData.wasteType === 'pesticide' && !formData.pesticideAmount) {
      alert('Please specify the amount of pesticide.');
      return;
    }

    if (formData.wasteType === 'other' && !formData.otherWasteType) {
      alert('Please specify the other waste type.');
      return;
    }

    // Prepare form data for submission
    const formDataToSubmit = new FormData();
    formDataToSubmit.append('userName', formData.userName);
    formDataToSubmit.append('address', formData.address);
    formDataToSubmit.append('phone', formData.phone);
    formDataToSubmit.append('wasteType', formData.wasteType);
    formDataToSubmit.append('wasteDetails', formData.wasteDetails);

    // Append additional fields based on waste type
    if (formData.wasteType === 'plastic') {
      formDataToSubmit.append('plasticType', formData.plasticType);
      formDataToSubmit.append('plasticCount', formData.plasticCount);
    }

    if (formData.wasteType === 'metal') {
      formDataToSubmit.append('metalType', formData.metalType);
      formDataToSubmit.append('metalWeight', formData.metalWeight);
    }

    if (formData.wasteType === 'pesticide') {
      formDataToSubmit.append('pesticideAmount', formData.pesticideAmount);
    }

    if (formData.wasteType === 'other') {
      formDataToSubmit.append('otherWasteType', formData.otherWasteType);
    }

    // Append file if uploaded
    if (formData.file) {
      formDataToSubmit.append('file', formData.file);
    }

    try {
      const token = localStorage.getItem('token'); // Ensure you're retrieving the token correctly

      // Send the form data to the backend API using axios
      const response = await axios.post('http://localhost:5000/api/waste/request', formDataToSubmit, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`, // Add the authorization header
        },
      });

      // Check if the response is successful
      if (response.status === 201) {
        console.log(response.data);
        alert('Request submitted successfully!');

        // Clear the form after successful submission
        setFormData({
          userName: '',
          address: '',
          phone: '',
          wasteType: '',
          wasteDetails: '',
          file: null,
          plasticType: '',
          plasticCount: '',
          metalWeight: '',
          metalType: '',
          pesticideAmount: '',
          otherWasteType: '', // Reset this field too
        });
      }
    } catch (error) {
      console.error('Submission error:', error);
      if (error.response) {
        // Server responded with a status other than 2xx
        alert(`Error: ${error.response.data.message || 'Failed to submit request'}`);
      } else if (error.request) {
        // Request was made but no response received
        alert('No response from server. Please check your network connection.');
      } else {
        // Something else caused the error
        alert('An unexpected error occurred. Please try again later.');
      }
    }
  };

  return (
    <div className={styles.formContainer}>
      <h2>Waste Management Request</h2>
      <form onSubmit={handleSubmit} className={styles.wasteForm}>
        <div className={styles.formGroup}>
          <label htmlFor="userName">Your Name:</label>
          <input
            type="text"
            id="userName"
            name="userName"
            value={formData.userName}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="address">Address:</label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="phone">Phone Number:</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="wasteType">Waste Type:</label>
          <select
            id="wasteType"
            name="wasteType"
            value={formData.wasteType}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Waste Type</option>
            <option value="plastic">Plastic</option>
            <option value="metal">Metal</option>
            <option value="pesticide">Pesticide</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Additional fields for plastic */}
        {formData.wasteType === 'plastic' && (
          <>
            <div className={styles.formGroup}>
              <label htmlFor="plasticType">Choose Plastic Type:</label>
              <select
                id="plasticType"
                name="plasticType"
                value={formData.plasticType}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Plastic Type</option>
                <option value="bottle">Bottle</option>
                <option value="cover">Cover</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="plasticCount">
                {formData.plasticType === 'bottle'
                  ? 'Count of Bottles'
                  : 'Count of Covers'}:
              </label>
              <input
                type="number"
                id="plasticCount"
                name="plasticCount"
                value={formData.plasticCount}
                onChange={handleInputChange}
                required
                min="0" // Ensure non-negative count
              />
            </div>
          </>
        )}

        {/* Additional fields for metal */}
        {formData.wasteType === 'metal' && (
          <>
            <div className={styles.formGroup}>
              <label htmlFor="metalType">Specify Metal Type (Iron, Aluminum, etc.):</label>
              <input
                type="text"
                id="metalType"
                name="metalType"
                value={formData.metalType}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="metalWeight">Estimated Weight (in kg):</label>
              <input
                type="number"
                id="metalWeight"
                name="metalWeight"
                value={formData.metalWeight}
                onChange={handleInputChange}
                required
                min="0" // Ensure non-negative weight
              />
            </div>
          </>
        )}

        {/* Additional fields for pesticide */}
        {formData.wasteType === 'pesticide' && (
          <div className={styles.formGroup}>
            <label htmlFor="pesticideAmount">Amount of Pesticide (Liters or Kilograms):</label>
            <input
              type="text"
              id="pesticideAmount"
              name="pesticideAmount"
              value={formData.pesticideAmount}
              onChange={handleInputChange}
              required
            />
          </div>
        )}

        {/* Additional fields for other waste type */}
        {formData.wasteType === 'other' && (
          <div className={styles.formGroup}>
            <label htmlFor="otherWasteType">Specify Other Waste Type:</label>
            <input
              type="text"
              id="otherWasteType"
              name="otherWasteType"
              value={formData.otherWasteType}
              onChange={handleInputChange}
              required
            />
          </div>
        )}

        <div className={styles.formGroup}>
          <label htmlFor="wasteDetails">Additional Details:</label>
          <textarea
            id="wasteDetails"
            name="wasteDetails"
            value={formData.wasteDetails}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="file">Upload Supporting Document (optional):</label>
          <input type="file" id="file" onChange={handleFileChange} />
        </div>

        <button type="submit" className={styles.submitButton}>Submit Request</button>
      </form>
    </div>
  );
};

export default WasteManagementRequest;
