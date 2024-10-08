const Product = require('../models/product'); // Product model
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Directory for storing product images
const productImageDir = path.join(__dirname, '../uploads/product_images');
if (!fs.existsSync(productImageDir)) {
  fs.mkdirSync(productImageDir, { recursive: true });
}

// Multer setup for handling image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, productImageDir); // Save in product_images folder
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename with timestamp
  },
});
const upload = multer({ storage: storage }).single('image');

// Controller to add a product
const addProduct = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error('Image upload failed:', err);
      return res.status(400).json({ message: 'Image upload failed', error: err });
    }

    try {
      const { name, description, price } = req.body;
      const sellerEmail = req.body.sellerEmail; // Pulled from request body or JWT token
      const image = req.file ? req.file.filename : null; // Check if an image file was uploaded

      // Create a new product document
      const newProduct = new Product({
        sellerEmail,
        name,
        description,
        price,
        image,
      });

      // Save the product in the database
      await newProduct.save();

      return res.status(201).json({ message: 'Product added successfully!', product: newProduct });
    } catch (error) {
      console.error('Server error:', error);
      return res.status(500).json({ message: 'Server error', error });
    }
  });
};

// Controller to get products posted by a specific user (seller)
const getUserProducts = async (req, res) => {
  try {
    const userId = req.params.userId; // Extract userId (or sellerEmail) from the request params
    
    if (!userId) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    // Find all products where the seller's userId (or email) matches the given userId
    const products = await Product.find({ sellerEmail: userId }).sort({ createdAt: -1 }); // Sort by latest

    if (products.length === 0) {
      return res.status(404).json({ message: 'No products found for this user.' });
    }

    return res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return res.status(500).json({ message: 'Server error', error });
  }
};

// Controller to fetch product images by filename
const getProductImages = async (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, "../uploads/product_images", filename);

  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).json({ message: "File not found" });
  }
};

// Controller to edit a product by ID
const editProductById = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ message: 'Error uploading file' });
    }

    const { productId } = req.params;

    try {
      // Extract form fields
      const { name, description, price } = req.body;
      let image = req.file ? req.file.filename : undefined;

      console.log('Received data:', { name, description, price, image });

      // Find and update the product
      const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        { name, description, price, image },
        { new: true } // Return the updated document
      );

      if (!updatedProduct) {
        return res.status(404).json({ message: 'Product not found' });
      }

      return res.status(200).json({ message: 'Product updated successfully', product: updatedProduct });
    } catch (error) {
      console.error('Error updating product:', error);
      return res.status(500).json({ message: 'Server error', error });
    }
  });
};


//Controller to delete a product by ID
const deleteProductById = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Define the path to the product image
    const imageFilePath = path.join(__dirname, '../uploads/product_images/', product.image);
    
    // Check if the image file exists and delete it
    if (fs.existsSync(imageFilePath)) {
      fs.unlinkSync(imageFilePath); // Delete the product image
    }

    // Delete the product from the database
    await Product.findByIdAndDelete(productId);

    return res.status(200).json({ message: 'Product deleted successfully!' });
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ message: 'Failed to delete product', error });
  }
};

// Controller to get a product by ID

const getProductById = async (req, res) => {
  try {
    const { productId } = req.params;

    // Find the product by its ID
    const product = await Product.findById(productId);

    // Check if the product exists
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Return the product details
    return res.status(200).json(product);
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    return res.status(500).json({ message: 'Server error', error });
  }
};


const getAllProducts = async (req, res) => {
  try {
    // Fetch all products from the database
    const products = await Product.find().sort({ createdAt: -1 }); // Sort by latest
    
    // Check if there are any products
    if (products.length === 0) {
      return res.status(404).json({ message: 'No products found.' });
    }

    // Return the products
    return res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching all products:', error);
    return res.status(500).json({ message: 'Server error', error });
  }
};

module.exports = {
  addProduct,
  getUserProducts,
  getProductImages,
  editProductById,
  deleteProductById,
  getProductById,
  getAllProducts
};
