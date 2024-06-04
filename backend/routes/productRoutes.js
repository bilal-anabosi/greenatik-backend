const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRoles } = require('../middelware/auth');
const { getProducts,createProduct ,getProductById, updateProduct, } = require('../controllers/productController');
const upload = require('../middelware/upload');

// Route to fetch products
router.get('/', authenticateToken, authorizeRoles(['admin']), getProducts);
router.post('/', authenticateToken,authorizeRoles(['admin']), upload.array('images', 10), createProduct);
// Route to fetch a specific product by ID
router.get('/:productId', getProductById);

router.put('/:productId', authenticateToken, authorizeRoles(['admin']), upload.array('images', 10), updateProduct);


module.exports = router;

