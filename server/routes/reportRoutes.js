const express = require('express');
const router = express.Router();
const { 
  submitReport, 
  getAllReports, 
  deleteBlog, 
  blockBlog,   // Added blockBlog
  unblockBlog  // Added unblockBlog
} = require('../controllers/reportcontroller'); // Import report controller

const isAdmin = require('../middleware/authMiddleware'); // Admin middleware (if implemented)

// Route to submit a report
router.post('/submit', submitReport);

// Route to get all reports
router.get('/all-reports', getAllReports);

// Route to delete a blog
router.delete('/delete-blog/:blogId', deleteBlog);

// Route to block a blog
router.put('/block-blog/:blogId', blockBlog);  // Using PUT for updating the blog status

// Route to unblock a blog
router.put('/unblock-blog/:blogId', unblockBlog);  // Using PUT for updating the blog status

module.exports = router;
