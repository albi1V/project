import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from './Asidebar';
import Navbar from './Anavbar';
import styles from './reportedblog.module.css';

const AdminReportPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchReports(); // Fetch reports on initial load
  }, []);

  const fetchReports = async () => {
    try {
      const response = await axios.get('https://project-9jg7.onrender.com/api/report/all-reports');
      setReports(response.data); // Set initial reports data with correct block status
      setLoading(false);
    } catch (err) {
      setError('Failed to load reported blogs');
      setLoading(false);
    }
  };

  const handleBlock = async (blogId) => {
    try {
      await axios.put(`https://project-9jg7.onrender.com/api/report/block-blog/${blogId}`);
      setReports((prevReports) =>
        prevReports.map((report) =>
          report.blogId._id === blogId
            ? { ...report, blogId: { ...report.blogId, isBlocked: true } }
            : report
        )
      );
    } catch (err) {
      console.error('Failed to block blog:', err);
    }
  };

  const handleUnblock = async (blogId) => {
    try {
      await axios.put(`https://project-9jg7.onrender.com/api/report/unblock-blog/${blogId}`);
      setReports((prevReports) =>
        prevReports.map((report) =>
          report.blogId._id === blogId
            ? { ...report, blogId: { ...report.blogId, isBlocked: false } }
            : report
        )
      );
    } catch (err) {
      console.error('Failed to unblock blog:', err);
    }
  };

  if (loading) return <p>Loading reported blogs...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className={styles.mainContent}>
      <Navbar />
      <div className={styles.adminLayout}>
        <Sidebar />
        <div className={styles.reportedBlogs}>
          <h1>Reported Blogs</h1>
          {reports.length === 0 ? (
            <p>No reports available</p>
          ) : (
            reports.map((report) => (
              <div key={report._id} className={styles.reportCard}>
                <h2>{report.blogId.title}</h2>
                <p><strong>Date:</strong> {new Date(report.blogId.createdAt).toLocaleDateString()}</p>
                <p><strong>Report Reason:</strong> {report.reason}</p>
                <p>
                  <strong>Reported By:</strong> {report.reportedBy.username} ({report.reportedBy.email})
                </p>
                <p className={styles.blogContent}>{report.blogId.content}</p>
                {report.blogId.image && (
                  <img
                    src={`https://project-9jg7.onrender.com/api/blog/get-blog-images/${report.blogId.image}`}
                    alt={report.blogId.title}
                    className={styles.blogImage}
                  />
                )}

                {/* Button text changes based on isBlocked status */}
                {report.blogId.isBlocked ? (
                  <button
                    onClick={() => handleUnblock(report.blogId._id)}
                    className={styles.unblockButton}
                  >
                    Unblock Blog
                  </button>
                ) : (
                  <button
                    onClick={() => handleBlock(report.blogId._id)}
                    className={styles.blockButton}
                  >
                    Block Blog
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminReportPage;
