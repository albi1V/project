import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './editBlog.module.css'; // CSS module for styling

const EditBlog = () => {
  const { blogId } = useParams(); // Extract blogId from the URL
  const [blogData, setBlogData] = useState(null); // State for blog data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(''); // Error state
  const [title, setTitle] = useState(''); // State for title
  const [content, setContent] = useState(''); // State for content
  const [image, setImage] = useState(null); // State for image
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogData = async () => {
        try {
            const token = localStorage.getItem('token');
            console.log('Token:', token); // Log the token for debugging
            
            const response = await axios.get(`http://localhost:5000/api/blog/get-by-id/${blogId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setBlogData(response.data);
            setTitle(response.data.title);
            setContent(response.data.content);
            setLoading(false);
        } catch (error) {
            if (error.response) {
                console.error('Error fetching blog data:', error.response.data); // Log detailed error response
            } else {
                console.error('Error fetching blog data:', error.message); // Log general error message
            }
            setError('Failed to fetch blog');
            setLoading(false);
        }
    };

    fetchBlogData();
}, [blogId]);


  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      if (image) {
        formData.append('image', image); // Only include image if a new one is uploaded
      }

      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/blog/edit-by-id/${blogId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      navigate('/profile'); // Redirect to the profile page after successful update
    } catch (error) {
      setError('Failed to update blog');
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className={styles.editBlogContainer}>
      <h1>Edit Blog</h1>
      <form onSubmit={handleUpdate} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="content">Content:</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          ></textarea>
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="image">Update Image (optional):</label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>
        {blogData.image && (
          <div className={styles.currentImage}>
            <p>Current Image:</p>
            <img
              src={`http://localhost:5000/api/blog/get-blog-images/${blogData.image}`}
              alt="Current Blog"
            />
          </div>
        )}
        <button type="submit" className={styles.updateButton}>
          Update Blog
        </button>
      </form>
    </div>
  );
};

export default EditBlog;
