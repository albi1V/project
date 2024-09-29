import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './profile.module.css'; // Importing CSS module

const Profile = () => {
  const [userData, setUserData] = useState(null); // Store user data
  const [userBlogs, setUserBlogs] = useState([]); // Store blogs
  const [loading, setLoading] = useState(true);   // Loading state
  const [error, setError] = useState('');         // Error state
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      const email = localStorage.getItem('email'); // Get the email stored during login

      if (!token || !email) {
        setError('Unauthorized');
        setLoading(false);
        return;
      }

      try {
        // Fetch user data
        const userResponse = await axios.get(`http://localhost:5000/api/auth/user/${email}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token for authorization
          },
        });

        setUserData(userResponse.data);

        // Fetch user's blogs using the userId from the fetched user data
        const userId = userResponse.data._id; // Assuming the userId is stored as _id
        const blogsResponse = await axios.get(`http://localhost:5000/api/blog/view/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token for authorization
          },
        });

        setUserBlogs(blogsResponse.data); // Store the user's blogs
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch data');
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return <p className={styles.loading}>Loading...</p>;
  }

  if (error) {
    return <p className={styles.error}>{error}</p>;
  }

  return (
    <div className={styles.profileContainer}>
      <h1 className={styles.title}>User Profile</h1>
      <div className={styles.userInfo}>
        <p><strong>Full Name:</strong> {userData.username}</p>
        <p><strong>Email:</strong> {userData.email}</p>
        <p><strong>Address:</strong> {userData.address}</p>
        <p><strong>Phone:</strong> {userData.phone}</p>
        <p><strong>Role:</strong> {userData.role}</p>
        <p><strong>Account Created:</strong> {new Date(userData.createdAt).toLocaleDateString()}</p>
      </div>

      <h2 className={styles.blogTitle}>Your Blogs</h2>
      {userBlogs.length === 0 ? (
        <p>No blogs found</p>
      ) : (
        <div className={styles.blogList}>
          {userBlogs.map((blog) => (
            <div key={blog._id} className={styles.blogItem}>
              <h3>{blog.title}</h3>
              <p>{blog.content}</p>
              {blog.image && <img src={`http://localhost:5000/api/blog/get-blog-images/${blog.image}`} alt={blog.title} />}
              <p><strong>Posted on:</strong> {new Date(blog.createdAt).toLocaleDateString()}</p>

              {/* Edit Button for Navigating to EditBlog Page */}
              <button
                className={styles.editButton}
                onClick={() => navigate(`/edit-blog/${blog._id}`)} // Navigate to EditBlog with blog._id
              >
                Edit
              </button>
            </div>
          ))}
        </div>
      )}
      
      <button className={styles.editButton} onClick={() => navigate('/edit-profile')}>
        Edit Profile
      </button>
    </div>
  );
};

export default Profile;
