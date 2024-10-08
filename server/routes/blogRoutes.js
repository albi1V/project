const express = require('express');
const router = express.Router();
const { addBlog, deleteBlog, getBlogById,getUserBlogs, getBlogImages,getAllBlogs, editBlog } = require('../controllers/blogController.js');
const authMiddleware = require('../middleware/authMiddleware.js');


router.post('/addblog', authMiddleware, addBlog);

router.delete('/delete/:blogId', authMiddleware, deleteBlog);

router.put('/edit-by-id/:blogId', authMiddleware, editBlog); // Use PUT method for editing

router.get('/get-by-id/:blogId', authMiddleware, getBlogById); // each blog num

router.get('/view/user/:userId', authMiddleware, getUserBlogs);

router.get('/get-blog-images/:filename', getBlogImages)

router.get("/all", getAllBlogs);


module.exports = router;
