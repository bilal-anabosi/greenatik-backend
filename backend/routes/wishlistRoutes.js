const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRoles } = require('../middelware/auth');
const { getWishlist, addItem, deleteItem } = require('../controllers/wishlistController');

router.get('/', authenticateToken, authorizeRoles(['user']), getWishlist);

router.post('/', authenticateToken, authorizeRoles(['user']), addItem);

router.delete('/:productId', authenticateToken, authorizeRoles(['user']), deleteItem);

module.exports = router;