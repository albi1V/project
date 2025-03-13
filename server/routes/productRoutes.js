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
  checkStock,
  updateStock,
  getProductBySearch

} = require('../controllers/productController.js');
const authMiddleware = require('../middleware/authMiddleware.js');


 router.post('/add', authMiddleware, addProduct);

 router.delete('/delete/:productId', authMiddleware, deleteProductById);

 router.put('/edit/:productId', authMiddleware, editProductById);

 router.get('/get-by-id/:productId', authMiddleware, getProductById);

 router.get('/user/:userId', authMiddleware, getUserProducts);

 router.get('/get-product-images/:filename', getProductImages);

 router.get('/all', getAllProducts);

 router.get('/search', getProductBySearch);

 router.get('/check-stock/:productId',  checkStock);

 router.put('/update-stock/:productId',  updateStock);

 router.get('/check-stock/:productId',  checkStock);

module.exports = router;
