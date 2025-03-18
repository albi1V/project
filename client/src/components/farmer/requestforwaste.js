import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../farmer/fsidebar';
import Navbar from '../farmer/fnavbar';
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
    otherWasteType: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);

  useEffect(() => {
    const isValid =
      !errors.userName &&
      !errors.address &&
      !errors.phone &&
      formData.userName &&
      formData.address &&
      formData.phone &&
      formData.wasteType &&
      formData.wasteDetails &&
      (formData.wasteType !== 'plastic' || (formData.plasticType && formData.plasticCount >= 0)) &&
      (formData.wasteType !== 'metal' || (formData.metalType && formData.metalWeight >= 0)) &&
      (formData.wasteType !== 'pesticide' || formData.pesticideAmount) &&
      (formData.wasteType !== 'other' || formData.otherWasteType);

    setIsSubmitEnabled(isValid);
  }, [errors, formData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const isValidFile = file.type.startsWith('image/');
      if (!isValidFile) {
        setErrors((prev) => ({ ...prev, file: 'Only image files are allowed (jpg, png, etc.)' }));
      } else {
        setFormData({ ...formData, file });
        setErrors((prev) => ({ ...prev, file: '' }));
      }
    }
  };

  const validateField = (name, value) => {
    switch (name) {
      case 'userName':
        if (!/^[a-zA-Z]+(?: [a-zA-Z]+)*$/.test(value) || value.length > 50) {
          setErrors((prev) => ({ ...prev, userName: 'Name must be alphabetic and max 50 characters. No double spaces.' }));
        } else {
          setErrors((prev) => ({ ...prev, userName: '' }));
        }
        break;
      case 'address':
        if (/[^a-zA-Z0-9\s.,-]/.test(value) || /\s{2,}/.test(value)) {
          setErrors((prev) => ({ ...prev, address: 'Invalid characters or double spaces in address.' }));
        } else {
          setErrors((prev) => ({ ...prev, address: '' }));
        }
        break;
      case 'phone':
        if (!/^[6-9]\d{9}$/.test(value)) {
          setErrors((prev) => ({ ...prev, phone: 'Phone number must be 10 digits and start with 6, 7, 8, or 9.' }));
        } else {
          setErrors((prev) => ({ ...prev, phone: '' }));
        }
        break;
      case 'plasticCount':
      case 'metalWeight':
        if (value < 0) {
          setErrors((prev) => ({ ...prev, [name]: 'Value cannot be negative.' }));
        } else {
          setErrors((prev) => ({ ...prev, [name]: '' }));
        }
        break;
      default:
        break;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSubmit = new FormData();
    formDataToSubmit.append('userName', formData.userName);
    formDataToSubmit.append('address', formData.address);
    formDataToSubmit.append('phone', formData.phone);
    formDataToSubmit.append('wasteType', formData.wasteType);
    formDataToSubmit.append('wasteDetails', formData.wasteDetails);

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

    if (formData.file) {
      formDataToSubmit.append('file', formData.file);
    }

    try {
      const token = localStorage.getItem('token');

      const response = await axios.post('http://localhost:5000/api/waste/request', formDataToSubmit, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 201) {
        alert('Request submitted successfully!');
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
          otherWasteType: '',
        });
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('An error occurred during submission.');
    }
  };

  return (
    <div className={styles.mainContent}>
      <Navbar />
      <div className={styles.adminLayout}>
        <Sidebar />
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
              {errors.userName && <p className={styles.error}>{errors.userName}</p>}
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
              {errors.address && <p className={styles.error}>{errors.address}</p>}
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
              {errors.phone && <p className={styles.error}>{errors.phone}</p>}
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

            {formData.wasteType === 'plastic' && (
              <div>
                <div className={styles.formGroup}>
                  <label htmlFor="plasticType">Plastic Type:</label>
                  <input
                    type="text"
                    id="plasticType"
                    name="plasticType"
                    value={formData.plasticType}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="plasticCount">Plastic Count:</label>
                  <input
                    type="number"
                    id="plasticCount"
                    name="plasticCount"
                    value={formData.plasticCount}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            )}

            {formData.wasteType === 'metal' && (
              <div>
                <div className={styles.formGroup}>
                  <label htmlFor="metalType">Metal Type:</label>
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
                  <label htmlFor="metalWeight">Metal Weight (kg):</label>
                  <input
                    type="number"
                    id="metalWeight"
                    name="metalWeight"
                    value={formData.metalWeight}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            )}

            {formData.wasteType === 'pesticide' && (
              <div className={styles.formGroup}>
                <label htmlFor="pesticideAmount">Pesticide Amount (liters):</label>
                <input
                  type="number"
                  id="pesticideAmount"
                  name="pesticideAmount"
                  value={formData.pesticideAmount}
                  onChange={handleInputChange}
                  required
                />
              </div>
            )}

            {formData.wasteType === 'other' && (
              <div className={styles.formGroup}>
                <label htmlFor="otherWasteType">Specify Waste Type:</label>
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
              <label htmlFor="wasteDetails">Request Details:</label>
              <textarea
                id="wasteDetails"
                name="wasteDetails"
                value={formData.wasteDetails}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="file">Upload File (optional):</label>
              <input type="file" id="file" name="file" onChange={handleFileChange} />
              {errors.file && <p className={styles.error}>{errors.file}</p>}
            </div>

            <button type="submit" disabled={!isSubmitEnabled} className={styles.submitButton}>
              Submit Request
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default WasteManagementRequest;
