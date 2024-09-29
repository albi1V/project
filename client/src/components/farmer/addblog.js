import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './adp.module.css';

const AddBlog = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
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
  
    console.log('Submitting blog:', { title, content, image });

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

      alert('Post added successfully!');
      setTitle(''); 
      setContent(''); 
      setImage(null); 
      navigate('/farmer-landing');
    } catch (error) {
      setError('Failed to add post');
      console.error('Error adding post:', error.response ? error.response.data : error.message);
    }
  };

  return (
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
            required
          />
        </label>
        <label>
          Content:
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </label>
        <label>
          Upload Picture:
          <input
            type="file"
            accept="image/*" 
            onChange={handleImageChange}
            required
          />
        </label>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default AddBlog;
