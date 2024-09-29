const mongoose = require('mongoose');
const Blog = require("../models/Blog");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Directory for storing blog images
const blogImageDir = path.join(__dirname, "../uploads/blog_images");
if (!fs.existsSync(blogImageDir)) {
  fs.mkdirSync(blogImageDir, { recursive: true });
}

// Multer setup for handling image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, blogImageDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage }).single("image");

// Edit Blog Controller
const editBlog = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error("Image upload failed:", err);
      return res.status(400).json({ message: "Image upload failed", error: err });
    }

    try {
      const { blogId } = req.params; // Get blogId from request parameters
      const { title, content } = req.body; // Get title and content from request body
      const userId = req.userId; // User ID from verified token in the auth middleware

      // Find the blog by ID
      const blog = await Blog.findById(blogId);
      if (!blog) {
        return res.status(404).json({ message: "Blog not found" });
      }

      // Check if the user is the owner of the blog
      if (blog.userId.toString() !== userId) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      // Update blog fields
      blog.title = title || blog.title; // Update title if provided
      blog.content = content || blog.content; // Update content if provided

      // If a new image is uploaded, update the image field
      if (req.file) {
        // Delete the old image if it exists
        if (blog.image) {
          const oldImagePath = path.join(blogImageDir, blog.image);
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath); // Delete the old image file
          }
        }
        blog.image = req.file.filename; // Update the blog image with the new file
      }

      // Save the updated blog
      const updatedBlog = await blog.save();

      return res.status(200).json({ message: "Blog updated successfully!", blog: updatedBlog });
    } catch (error) {
      console.error("Server error:", error);
      return res.status(500).json({ message: "Server error", error });
    }
  });
};

// Add Blog Controller
const addBlog = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error("Image upload failed:", err);
      return res.status(400).json({ message: "Image upload failed", error: err });
    }

    try {
      const { title, content } = req.body;
      const userId = req.userId;
      const image = req.file ? req.file.filename : null;

      const newBlog = new Blog({
        userId,
        title,
        content,
        image,
      });

      await newBlog.save();
      return res.status(201).json({ message: "Blog added successfully!", blog: newBlog });
    } catch (error) {
      console.error("Server error:", error);
      return res.status(500).json({ message: "Server error", error });
    }
  });
};

// Get User Blogs Controller
const getUserBlogs = async (req, res) => {
  try {
    const userId = req.userId; // Extracted from token in verifyToken middleware
    const blogs = await Blog.find({ userId });

    if (!blogs || blogs.length === 0) {
      return res.status(404).json({ message: "No blogs found for this user" });
    }

    res.status(200).json(blogs); // Return the blogs
  } catch (error) {
    console.error("Failed to retrieve blogs:", error);
    res.status(500).json({ message: "Failed to retrieve blogs", error });
  }
};

// View Blog Image Controller
const getBlogImages = async (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, "../uploads/blog_images", filename);

  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).json({ message: "File not found" });
  }
};

// Get All Blogs Controller
const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find(); // Fetch all blogs from the database

    if (!blogs || blogs.length === 0) {
      return res.status(404).json({ message: "No blogs available" });
    }

    res.status(200).json(blogs); // Return the blogs
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return res.status(500).json({ message: "Failed to retrieve blogs", error });
  }
};

// Get Blog By ID Controller
const getBlogById = async (req, res) => {
  const { blogId } = req.params;
  
  // Optional: Check if userId is present for additional validation
  if (!req.userId) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  try {
    // Check if the ID is valid
    if (!mongoose.Types.ObjectId.isValid(blogId)) {
      return res.status(400).json({ message: 'Invalid Blog ID' });
    }

    // Find the blog by ID
    const blog = await Blog.findById(blogId).populate('userId', 'username'); // Populate user info if needed

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Return the blog data
    return res.status(200).json(blog);
  } catch (error) {
    console.error('Error fetching blog by ID:', error); // Log the error for debugging
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Export all the controller functions together
module.exports = { addBlog, getUserBlogs, getBlogImages, getAllBlogs, editBlog, getBlogById };
