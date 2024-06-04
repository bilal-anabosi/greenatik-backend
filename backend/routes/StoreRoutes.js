const express = require('express');
const router = express.Router();
const { getLatestProducts, getLatestProductsWithSale, getTopSellingProducts, getProductsByCategory } = require('../controllers/StoreController');

router.get('/latest-products', getLatestProducts);
router.get('/sale-products',  getLatestProductsWithSale);
router.get('/top-products',  getTopSellingProducts);
router.get('/by-category',  getProductsByCategory);

module.exports = router;
