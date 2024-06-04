const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middelware/auth');
const reviewsModel = require('../models/reviewsModel');
const productModel = require('../models/Product')

router.get('/:productId', async (req, res) => {
    try {
        const reviews = await reviewsModel.find({ product: req.params.productId }).populate('user');
        res.send(reviews ? reviews : []);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

router.post('/:productId', authenticateToken, async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const review = new reviewsModel({
            product: req.params.productId,
            user: req.user.id,
            rating,
            comment
        });
        await review.save();
        res.json(review);

        let reviewsCount = await reviewsModel.find({ product: req.params.productId }).countDocuments();

        let product = await productModel.findById(req.params.productId);
        product.reviews = (product.reviews * (reviewsCount - 1) + rating) / reviewsCount;
        await product.save();
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;

