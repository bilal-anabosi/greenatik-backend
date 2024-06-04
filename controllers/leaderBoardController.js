const userModel = require('../models/usermodel');

// Controller function to get top 15 users by total points
const getTopUsers = async (req, res) => {
  try {
    const topUsers = await userModel
      .find({}, 'username points.total points.tasks address image') // specify the fields you want to return
      .sort({ 'points.total': -1 }) // sort by total points in descending order
      .limit(15); // limit the results to 15

    res.json(topUsers);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
const getUserPosition = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming the user ID is available in req.user

    // Find the target user
    const targetUser = await userModel.findById(userId);

    // Fetch all users and sort them by total points
    const allUsers = await userModel.find().sort({ 'points.total': -1 });

    // Find the position of the target user
    const userPosition = allUsers.findIndex(user => user._id.toString() === userId) + 1;

    res.json({ position: userPosition, user: targetUser });
  } catch (error) {
    console.error('Error fetching user position:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getFilteredPoints = async (req, res) => {
  try {
    const { filter } = req.query;

    const dateFilter = {};
    const currentDate = new Date();

    if (filter === 'weekly') {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(currentDate.getDate() - 7);
      dateFilter['points.log.date'] = { $gte: oneWeekAgo };
    } else if (filter === 'monthly') {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(currentDate.getMonth() - 1);
      dateFilter['points.log.date'] = { $gte: oneMonthAgo };
    } else if (filter === 'yearly') {
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(currentDate.getFullYear() - 1);
      dateFilter['points.log.date'] = { $gte: oneYearAgo };
    }

    // Fetch users and filter based on the dateFilter
    const filteredUsers = await userModel.find(dateFilter).sort({ 'points.total': -1 });

    res.json(filteredUsers);
  } catch (error) {
    console.error('Error fetching filtered points:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { getTopUsers,getUserPosition,getFilteredPoints};
