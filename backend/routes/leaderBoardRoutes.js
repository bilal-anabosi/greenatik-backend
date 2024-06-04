const express = require('express');
const router = express.Router();
const { getTopUsers,getUserPosition,getFilteredPoints} = require('../controllers/leaderBoardController');
const { authenticateToken } = require('../middelware/auth');

// Define the route to get top 15 users by total points
router.get('/top-users', getTopUsers);
router.get('/position', authenticateToken, getUserPosition);
router.get('/points/filter', getFilteredPoints);
module.exports = router;
