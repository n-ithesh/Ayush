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

const upload = require('../middleware/upload'); // multer setup

// 🌟 Image Upload Route

router.post('/', createProduct);
router.get('/', getAllProducts);
router.put('/:id', updateProduct);
router.put('/stock/:id', updateStock);
router.delete('/:id', deleteProduct);


router.post('/upload', upload.array('images'), (req, res) => {
  try {
    const urls = req.files.map(file => `${req.protocol}://${req.get('host')}/uploads/${file.filename}`);
    res.json({ success: true, urls });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});


module.exports = router;