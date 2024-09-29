import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './viewBlogs.module.css';

const ViewBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/blog/all'); // API call to get all blogs
        setBlogs(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load blogs');
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className={styles.blogList}>
      <h1>All Blogs</h1>
      {blogs.length === 0 ? (
        <p>No blogs available</p>
      ) : (
        blogs.map((blog) => (
          <div key={blog._id} className={styles.blogItem}>
            <h2>{blog.title}</h2>
            <p>{blog.content}</p>
            {blog.image && <img src={`http://localhost:5000/api/blog/get-blog-images/${blog.image}`} alt={blog.title} />}
            <p><strong>Posted by:</strong> {blog.userId} {/* You can display the user or fetch more user details */}</p>
            <p><strong>Date:</strong> {new Date(blog.createdAt).toLocaleDateString()}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default ViewBlogs;
