const express = require('express');
const router = express.Router();
const {
  addProduct,
  deleteProductById,
  editProductById,
  getProductById,
  getUserProducts,
  getProductImages,
  getAllProducts,
} = require('../controllers/productController.js');
const authMiddleware = require('../middleware/authMiddleware.js');


router.post('/add', authMiddleware, addProduct);

 router.delete('/delete/:productId', authMiddleware, deleteProductById);

 router.put('/edit/:productId', authMiddleware, editProductById);

router.get('/get-by-id/:productId', authMiddleware, getProductById);

router.get('/user/:userId', authMiddleware, getUserProducts);

 router.get('/get-product-images/:filename', getProductImages);

 router.get('/all', getAllProducts);

module.exports = router;
