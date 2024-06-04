const { authenticateToken } = require('../middelware/auth'); // Importing authenticateToken middleware
const mongoose = require('mongoose');
const Post = require('../models/Post');
const Contribution = require('../models/Contribution');
const Like = require('../models/Like');
const { } = require('querystring');

const getPostDetailsById = async (req, res) => {
    const { postId } = req.params;

    try {
    const post = await Post.findById(postId).populate('owner');
    
    if (!post) {
    return res.status(404).json({ error: 'Post not found' });
    }
    
    // Extracting required information
    const { requesting, quantity, condition, createdAt, percentage, owner, pickUpDetails,provided } = post;

    // Formatting date
    const formattedDate = createdAt ? createdAt.toISOString().split('T')[0] : ''; // Check if createdAt is defined

    // Constructing the response object
    const postDetails = {
        requesting,
        quantity,
        condition,
        pickUpDetails,
        date: formattedDate,
        percentage,
        provided,
        owner: {
            username: owner.username,
            address: owner.address,
            image: owner.image.secure_url
        }
    };

    // Generate the location URL based on the owner's address
    const encodedAddress = encodeURIComponent(owner.address);
    const locationUrl = `https://www.google.com/maps/embed?pb=${encodedAddress}`;

    // Add the locationUrl to the postDetails object
    postDetails.locationUrl = locationUrl;

    // Sending the response
    res.status(200).json(postDetails);
    } catch (error) {
    console.error('Error fetching post details:', error);
    res.status(500).json({ error: 'Internal server error' });
}};

//___________________________________________________________________________
// Controller function to handle POST request for creating a new contribution
const createContribution = async (req, res) => {
    try {
      // Call authenticateToken middleware to verify the token
        await new Promise((resolve, reject) => {
            authenticateToken(req, res, (error) => {
                if (error) {
                    reject(error);
                } else {
            resolve();
        }
    });
});

    const userId = req.user.id;

    // Extracting data from the request body
    const { material, quantity, condition, notes, address, date, time } = req.body;
    const { postId } = req.params;
    const points = quantity ;

    // Creating a new Contribution document
    const newContribution = new Contribution({
        postId,
        userId,
        material,
        quantity,
        condition,
        notes,
        address,
        date,
        time,
        points
    });

    // Saving the new Contribution document to the database
    await newContribution.save();

    // Sending a success response
    res.status(201).json({ message: 'Contribution created successfully', contribution: newContribution });
    } catch (error) {
      // Handling errors
    console.error('Error creating contribution:', error);
    res.status(500).json({ error: 'Failed to create contribution' });
    }
};

//_______________________________________________________________________
// Controller function to handle POST request for creating a like and removing it

const likePost = async (req, res, next) => {
    try {
        // Call authenticateToken middleware to verify the token
        await new Promise((resolve, reject) => {
            authenticateToken(req, res, (error) => {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            });
        });

        const userId = req.user.id;
        const { postId } = req.params;

        // Check if the user has already liked
        const existingLike = await Like.findOne({ userId, postId });

        if (existingLike) {
            return res.status(400).json({ message: "You have already liked this post" });
        }

        // Add like
        const newLike = new Like({ userId, postId });
        await newLike.save();

        return res.status(201).json({ message: "Post liked", like: newLike });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error });
    }
};

//_________________________________________________________________________________
// Controller function to get posts liked by the user
const getLikedPosts = async (req, res) => {
    try {
        // Call authenticateToken middleware to verify the token
        await new Promise((resolve, reject) => {
            authenticateToken(req, res, (error) => {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            });
        });

        const userId = req.user.id;

        // Find likes made by the user
        const likes = await Like.find({ userId }).populate({
            path: 'postId',
            populate: {
                path: 'owner',
                select: 'username image'
            }
        });

        // Check if there are any likes
        if (!likes.length) {
            return res.status(404).json({ message: "No liked posts found" });
        }

        // Extract the post details
        const likedPosts = likes.map(like => ({
            postId: like.postId._id, // Assuming postId is the ID of the post
            dateLiked: like.createdAt.toISOString().split('T')[0],
            username: like.postId.owner.username,
            quantity: like.postId.quantity,
            image: like.postId.owner.image.secure_url
        }));

        // Sending the response
        res.status(200).json(likedPosts);
    } catch (error) {
        console.error('Error fetching liked posts:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    getPostDetailsById,createContribution,likePost,getLikedPosts
};