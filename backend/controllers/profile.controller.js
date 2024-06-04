const userModel = require('../models/usermodel.js'); 
const cloudinary= require('../utilts/cloudenary.js');
const path = require('path');
const fs = require('fs');


async function getProfile(req, res) {
    try {
        const {id} = req.user
        const user = await userModel.findById(id);
        return res.json({ message: "Success", user });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error fetching profile" });
    }
}
const editProfile = async (req, res, next) => {
    try {
        const imgData = req.file; 
        const { username, address, email } = req.body;
        const { id } = req.user;
        console.log(imgData)


        const user = await userModel.findById(id);
        const serverUrl = req.protocol + '://' + req.get('host')


        user.username = username;
        user.address = address;
        user.email = email;
        if(imgData){

            user.image = {secure_url: `${serverUrl}/${imgData.filename}`}
        }

        await user.save();


        res.status(200).json({ message: 'Profile updated successfully',data:user });
    } catch (error) {

        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
const getUserPoints = async (req, res) => {
    try {
      const userId = req.user.id; // Assuming user ID is attached to the request object by auth middleware
      const user = await userModel.findById(userId);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const { total, availablePoints, tasks, log } = user.points;
  
      // Calculate percentage change in total points, available points, and tasks for the past week
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  
      const weeklyLogs = log.filter(entry => new Date(entry.date) >= oneWeekAgo);
  
      const initialTotalPoints = total - weeklyLogs.reduce((acc, entry) => acc + entry.pointsAdded, 0);
      const initialAvailablePoints = availablePoints - weeklyLogs.reduce((acc, entry) => acc + entry.pointsAdded, 0); // Assuming tasks affect available points similarly
      const initialTasks = tasks - weeklyLogs.reduce((acc, entry) => acc + entry.pointsAdded, 0); // Adjust this if tasks affect log differently
  
      const totalPointsChange = total - initialTotalPoints;
      const availablePointsChange = availablePoints - initialAvailablePoints;
      const tasksChange = tasks - initialTasks;
  
      // Calculate average change as a percentage
      const averageTotalPointsChange = initialTotalPoints > 0 ? (totalPointsChange / initialTotalPoints) * 100 : 0;
      const averageAvailablePointsChange = initialAvailablePoints > 0 ? (availablePointsChange / initialAvailablePoints) * 100 : 0;
      const averageTasksChange = initialTasks > 0 ? (tasksChange / initialTasks) * 100 : 0;
  
      res.status(200).json({
        total,
        availablePoints,
        tasks,
        log,
        averageTotalPointsChange,
        averageAvailablePointsChange,
        averageTasksChange,
      });
    } catch (error) {
      console.error('Error fetching user points:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };




module.exports = { getProfile,editProfile,getUserPoints};