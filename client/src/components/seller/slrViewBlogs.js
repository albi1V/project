import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './slrSbar'; 
import Navbar from './slrNbar'; 
import styles from './slrViewBlogs.module.css';

const ViewBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedBlogId, setSelectedBlogId] = useState(null);
  const [selectedReason, setSelectedReason] = useState('');
  const [reportSubmitted, setReportSubmitted] = useState(false);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/blog/all');
        setBlogs(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load blogs');
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const handleReportClick = (blogId) => {
    setSelectedBlogId(blogId);  // Set the selected blog ID for reporting
    setShowReportModal(true);    // Show the report modal
    setSelectedReason('');        // Reset the selected reason
    setReportSubmitted(false);    // Reset the report submission state
  };

  const handleReportSubmit = async () => {
    const userId = localStorage.getItem('userId');
    console.log("user id",userId)

    if (!userId) {
      alert('Please log in to submit a report.');
      return;
    }

    if (selectedReason) {
      try {
        await axios.post('http://localhost:5000/api/report/submit', {
          blogId: selectedBlogId,
          reason: selectedReason,
          userId: userId,
        });

        setReportSubmitted(true);
        setShowReportModal(false);
        alert('Report submitted successfully');
      } catch (err) {
        alert('Failed to submit report');
      }
    } else {
      alert('Please select a reason for reporting');
    }
  };

  return (
    <div className={styles.mainContent}>
      <Navbar />
      <div className={styles.adminLayout}>
        <Sidebar />
        <div className={styles.blogList}>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>{error}</p>
          ) : (
            blogs.map((blog) => (
              <div key={blog._id} className={styles.blogItem}>
                <p className={styles.blogContent}>
                  <strong>Date:</strong> {new Date(blog.createdAt).toLocaleDateString()}
                </p>
                <h2>{blog.title}</h2>
                <p className={styles.blogContent}>{blog.content}</p>
                {blog.image && (
                  <img src={`http://localhost:5000/api/blog/get-blog-images/${blog.image}`} alt={blog.title} />
                )}
                <button onClick={() => handleReportClick(blog._id)} className={styles.reportButton}>Report</button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Report Blog</h2>
            <p>Select a reason for reporting this blog:</p>
            <form>
              <label>
                <input type="radio" value="Violence Content" checked={selectedReason === 'Violence Content'} onChange={(e) => setSelectedReason(e.target.value)} />
                Violence Content
              </label>
              <label>
                <input type="radio" value="False Information" checked={selectedReason === 'False Information'} onChange={(e) => setSelectedReason(e.target.value)} />
                False Information
              </label>
              <label>
                <input type="radio" value="Nudity or Sexual Content" checked={selectedReason === 'Nudity or Sexual Content'} onChange={(e) => setSelectedReason(e.target.value)} />
                Nudity or Sexual Content
              </label>
              <label>
                <input type="radio" value="Promoting Unwanted Content" checked={selectedReason === 'Promoting Unwanted Content'} onChange={(e) => setSelectedReason(e.target.value)} />
                Promoting Unwanted Content
              </label>
              <label>
                <input type="radio" value="I Just Don’t Like the Post" checked={selectedReason === 'I Just Don’t Like the Post'} onChange={(e) => setSelectedReason(e.target.value)} />
                I Just Don’t Like the Post
              </label>
            </form>
            <button onClick={handleReportSubmit} className={styles.submitReport}>Submit Report</button>
            <button onClick={() => setShowReportModal(false)} className={styles.closeModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewBlogs;
