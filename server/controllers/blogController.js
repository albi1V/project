const mongoose = require('mongoose');
const Blog = require("../models/blog");
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

      // Log the userId and blog.userId to verify ownership
      console.log("User ID from token:", userId);
      console.log("User ID of the blog:", blog.userId.toString());

      // Check if the user is the owner of the blog
      if (blog.userId.toString() !== userId.toString()) {
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
      const userId = req.user._id; // Correctly access the user ID from req.user

      console.log("User ID:", userId); // Check if `userId` is correctly set

      const image = req.file ? req.file.filename : null;

      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }

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
    const userId = req.params.userId; // Extract userId from URL parameters

    // Find blogs by userId, but exclude blogs with status 'blocked'
    const blogs = await Blog.find({ userId, status: { $ne: 'blocked' } }).populate('userId', 'username email'); // Populate user details if necessary
  // 
    if (blogs.length === 0) {
      return res.status(404).json({ message: "No blogs found for this user" });
    }

    res.status(200).json(blogs);
  } catch (error) {
    console.error("Failed to retrieve blogs:", error);
    res.status(500).json({ message: "Failed to retrieve blogs", error: error.message });
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
    // Fetch all blogs from the database excluding those with status 'blocked'
    const blogs = await Blog.find({ status: { $ne: 'blocked' } })
                            .sort({createdAt:-1});

    if (!blogs || blogs.length === 0) {
      return res.status(404).json({ message: "No blogs available" });
    }

    res.status(200).json(blogs); // Return the blogs
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return res.status(500).json({ message: "Failed to retrieve blogs", error: error.message });
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

// Delete Blog Controller


const deleteBlog = async (req, res) => {
  const { blogId } = req.params;
  const userId = req.user._id; // Ensure `userId` is passed from authMiddleware

  try {
    // Ensure the blogId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(blogId)) {
      return res.status(400).json({ message: 'Invalid Blog ID' });
    }

    // Find the blog by ID and ensure it belongs to the authenticated user
    const blog = await Blog.findOne({ _id: blogId, userId: userId });

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found or unauthorized' });
    }

    // Use deleteOne to remove the blog
    await Blog.deleteOne({ _id: blogId, userId: userId });
    return res.status(200).json({ message: 'Blog deleted successfully' });
  } catch (error) {
    console.error(`Error deleting blog: ${error.message}`); // Log for better debugging
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};



// Export all the controller functions together
module.exports = { addBlog, getUserBlogs, getBlogImages, getAllBlogs, editBlog, getBlogById, deleteBlog };
