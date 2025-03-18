import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Sidebar from './fsidebar'; // Import the Sidebar component
import Navbar from './fnavbar'; // Import the Navbar component
import styles from './adp.module.css'; // Use your existing styles

const AddBlog = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const [formValid, setFormValid] = useState(false);
  const [touched, setTouched] = useState({
    title: false,
    content: false,
    image: false,
  });
  const navigate = useNavigate();

  const titleRegex = /^[A-Za-z\s]+$/;
  const doubleSpaceRegex = /\s\s+/;

  useEffect(() => {
    validateForm();
  }, [title, content, image]);

  const validateForm = () => {
    if (
      title &&
      titleRegex.test(title) &&
      !doubleSpaceRegex.test(title) &&
      title.length <= 50 &&
      content &&
      !doubleSpaceRegex.test(content) &&
      image && image.type.startsWith('image/')
    ) {
      setFormValid(true);
    } else {
      setFormValid(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setImage(file);
      setError('');
    } else {
      setImage(null);
      setError('Please upload a valid image file.');
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    if (!token) {
      setError('User is not authenticated');
      console.log('Token missing');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    if (image) {
      formData.append('image', image);
    }

    try {
      await axios.post(
        'http://localhost:5000/api/blog/addblog',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Swal.fire({
        icon: 'success',
        title: 'Post added successfully!',
        showConfirmButton: false,
        timer: 1500,
      });

      setTitle('');
      setContent('');
      setImage(null);
      setError('');
      navigate('/farmer-landing');
    } catch (error) {
      setError('Failed to add post');
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Failed to add post!',
      });
      console.error('Error adding post:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className={styles.mainContent}>
      <Navbar />

      <div className={styles.adminLayout}>
        <Sidebar />

        <div className={styles.formContainer}>
          <h1>Add Post</h1>
          {error && <p className={styles.error}>{error}</p>}
          <form onSubmit={handleSubmit}>
            <label>
              Title:
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={() => handleBlur('title')}
                required
              />
              {touched.title && (!titleRegex.test(title) || doubleSpaceRegex.test(title)) && (
                <p className={styles.error}>Title should only contain letters, no double spaces, and be a maximum of 50 characters.</p>
              )}
              {touched.title && title.length > 50 && (
                <p className={styles.error}>Title should not exceed 50 characters.</p>
              )}
            </label>

            <label>
              Content:
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onBlur={() => handleBlur('content')}
                required
              />
              {touched.content && doubleSpaceRegex.test(content) && (
                <p className={styles.error}>Content should not contain double spaces.</p>
              )}
            </label>

            <label>
              Upload Picture:
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                onBlur={() => handleBlur('image')}
                required
              />
              {touched.image && !image && (
                <p className={styles.error}>Please upload a valid image file (jpg, png, etc.).</p>
              )}
            </label>

            <button type="submit" disabled={!formValid}>
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddBlog;
