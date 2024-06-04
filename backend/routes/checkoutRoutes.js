const express = require('express');
const router = express.Router();
const { authenticateToken,authorizeRoles } = require('../middelware/auth');
const { createCheckout, getCheckoutDetails,getAllCheckouts ,getCheckoutByOrderNumber,markOrderAsDelivered,getUserPoints} = require('../controllers/checkoutController');

router.post('/', authenticateToken,authorizeRoles(['user']) ,createCheckout);
router.get('/details', authenticateToken, authorizeRoles(['user']),  getCheckoutDetails);
router.get('/all', authenticateToken, authorizeRoles(['delivery']), getAllCheckouts);
router.get('/checkout/:numOrder', authenticateToken, authorizeRoles(['delivery']), getCheckoutByOrderNumber);
router.put('/:numOrder/delivered',authenticateToken, authorizeRoles(['delivery']),markOrderAsDelivered);
router.get('/points', authenticateToken, getUserPoints);

module.exports = router;
