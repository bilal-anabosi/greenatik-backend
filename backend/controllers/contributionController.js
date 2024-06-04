// controllers/contributionController.js
const Contribution = require('../models/Contribution');
const Post = require('../models/Post');
const User = require('../models/usermodel')

const getContributions = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "User not authenticated" });
          }
        const contributions = await Contribution.find()
            .populate({
                path: 'postId',
                populate: { path: 'owner', select: '-password' } // Populate post owner details excluding password
            })
            .populate({
                path: 'userId',
                select: '-password' // Exclude password field from user details
            });

        res.status(200).json(contributions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};
const getPostDetailsById = async (req, res) => {
    try {
      const postId = req.params.postId;
      // Fetch the post details
      const post = await Contribution.findById(postId) .populate({
        path: 'postId',
        populate: { path: 'owner', select: '-password' } // Populate post owner details excluding password
    })
    .populate({
        path: 'userId',
        select: '-password' // Exclude password field from user details
    });
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
      // Return the post details
      res.status(200).json({ post });
    } catch (error) {
      console.error('Error fetching post details:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  updateContributionStatus = async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
  
      const contribution = await Contribution.findById(id);
  
      if (!contribution) {
        return res.status(404).json({ error: 'Contribution not found' });
      }
  
      if (status === 'delivered') {
        const post = await Post.findById(contribution.postId);
  
        if (!post) {
          return res.status(404).json({ error: 'Post not found' });
        }
  

        post.provided += contribution.quantity;
  

        const percentage = (post.provided / post.quantity) * 100;
  
        await post.save();
  
        const user = await User.findById(contribution.userId);
  
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }

        user.points.total += contribution.points;

        user.points.tasks += 1;
  

        user.points.availablePoints += contribution.points;
        user.points.log.push({ pointsAdded: contribution.points, date: new Date() });
  

        await user.save();
  

        await Contribution.findByIdAndUpdate(id, { status });
  
        res.json({ message: 'Contribution status updated successfully', contribution });
      } else {

        await Contribution.findByIdAndUpdate(id, { status });
        res.json({ message: 'Contribution status updated successfully', contribution });
      }
    } catch (error) {
      console.error('Error updating contribution status:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

module.exports = {
    getContributions,
    getPostDetailsById,
    updateContributionStatus
};
