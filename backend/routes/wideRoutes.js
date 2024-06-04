const express = require ('express');
const router = express.Router();
const { allProducts } = require('../controllers/wideController');

router.get('/wide-products',  allProducts);


module.exports = router;