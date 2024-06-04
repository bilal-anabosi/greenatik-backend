const express = require("express");
const router = express.Router();
const { authenticateToken, authorizeRoles } = require('../middelware/auth');
const User = require("../models/usermodel");
const Post = require("../models/Post");

router.get("/", async (req, res) => {
  try {
    const posts = await Post.find({ postStatus: "Active" }).populate({
      path: "owner",
      match: { role: "admin" },
      select: "username image",
    });

    // Filter posts to ensure only those with an 'admin' owner are included
    const filteredPosts = posts.filter((post) => post.owner);

    const formattedPosts = filteredPosts.map((post) => ({
      id: post._id,
      city: post.address.city,
      ownerUsername: post.owner.username,
      ownerImage: post.owner.image,
      title: post.title,
      requesting: post.requesting,
      pickUpDetails: post.pickUpDetails,
      quantity: post.quantity,
      details: post.moreDetails,
      date: post.createdAt,
      status: post.postStatus,
      provided:post.provided,
      
    }));

    res.json(formattedPosts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});


router.get('/admin', authenticateToken, async (req, res) => {
  try {
    const posts = await Post.find({ postStatus: "Active", owner: req.user.id }).populate({
      path: "owner",
      match: { role: "admin" },
      select: "username image",
    });

    // Filter posts to ensure only those with an 'admin' owner are included
    const filteredPosts = posts.filter((post) => post.owner);

    const formattedPosts = filteredPosts.map((post) => ({
      id: post._id,
      city: post.address.city,
      ownerUsername: post.owner.username,
      ownerImage: post.owner.image,
      title: post.title,
      requesting: post.requesting,
      pickUpDetails: post.pickUpDetails,
      percentage: post.percentage,
      quantity: post.quantity,
      details: post.moreDetails,
      date: post.createdAt,
      status: post.postStatus,

    }));

    res.json(formattedPosts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate({
      path: "owner",
      select: "username image",
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post('/', authenticateToken, authorizeRoles(['admin']), async (req, res) => {
  const { title, requesting, quantity, condition, pickUpDetails, postStatus, address, moreDetails } = req.body;

  try {
    const newPost = new Post({
      owner: req.user.id,
      title,
      requesting,
      quantity,
      condition,
      pickUpDetails,
      postStatus,
      address,
      moreDetails
    });

    const post = await newPost.save();

    res.json({ success: true, post });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
})

router.put('/:id', authenticateToken, authorizeRoles(['admin']), async (req, res) => {
  const { title, requesting, quantity, condition, pickUpDetails, postStatus, address } = req.body;

  try {
    let post = await Post.findById(req.params.id)

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    post.title = title;
    post.requesting = requesting;
    post.quantity = quantity;
    post.condition = condition;
    post.pickUpDetails = pickUpDetails;
    post.postStatus = postStatus;
    post.address = address;

    post = await post.save();

    res.json({ success: true, post });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "Server error" });
  }
})


module.exports = router;
