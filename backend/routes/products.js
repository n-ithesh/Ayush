// routes/products.js
const express = require('express');
const router = express.Router();
const {
  createProduct,
  getAllProducts,
  updateProduct,
  updateStock,
  deleteProduct,
} = require('../controllers/productController');

router.post('/', createProduct);
router.get('/', getAllProducts);
router.put('/:id', updateProduct);
router.put('/stock/:id', updateStock);
router.delete('/:id', deleteProduct);

module.exports = router;