// routes/contributionRoutes.js
const express = require('express');
const router = express.Router();
const { getContributions ,getPostDetailsById,updateContributionStatus} = require('../controllers/contributionController');
const { authenticateToken,authorizeRoles } = require('../middelware/auth');


// Get all contributions with user and post details for 'delivery' role
router.get('/contributions', authenticateToken, authorizeRoles(['delivery']), getContributions);
router.get('/post/:postId', authenticateToken, authorizeRoles(['delivery']),getPostDetailsById);
router.put('/status/:id/',authenticateToken, authorizeRoles(['delivery']),updateContributionStatus);


module.exports = router;
