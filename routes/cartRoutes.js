const express = require("express");
const router = express.Router();
const User = require("../models/usermodel");
const { authenticateToken } = require("../middelware/auth");
const Product = require("../models/Product");
const { ObjectId } = require("mongoose").Types;

// Get user's cart
router.get("/", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    const products = await Product.find({});
    const userInCartProducts = user.cart?.map((cartProduct) => {
      const matchProduct = products.find((product) => {
        return product?._id.equals(cartProduct.productId);
      });

      const priceObject = matchProduct.sizes.find(
        (item) =>
          item.size.toLocaleLowerCase() === cartProduct.size.toLocaleLowerCase()
      );

      return {
        id: matchProduct._id,
        title: matchProduct.title,
        sizes: cartProduct.size,
        images: matchProduct.images[0],
        quantity: cartProduct.quantity,
        salePrice: priceObject?.salePrice,
        regularPrice: priceObject?.regularPrice,
        availableQuantity: priceObject?.quantity,
      };
    });
    if (user.role !== "user") {
      return res
        .status(403)
        .json({ message: "Unauthorized: Only users can access carts" });
    }

    if (!Array.isArray(userInCartProducts)) {
      return res.status(404).json({ message: "Cart not found" });
    }
    if (userInCartProducts.lenght === 0) {
      return res.status(404).strictContentLength({ meassage: "Cart is empty" });
    }
    const cartExceedsStock = userInCartProducts.some(
      (cartProduct) => cartProduct.quantity > cartProduct.availableQuantity
    );

    if (cartExceedsStock) {
      return res.status(400).json({
        message: "One or more items in your cart exceed available stock",
      });
    }

    res.json(userInCartProducts);
  } catch (err) {
    console.error("err", err);
    res.status(500).send("Server Error");
  }
});
router.post("/add", authenticateToken, async (req, res) => {
  try {
    const { productId, quantity = 1, size } = req.body;
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Validate input
    if (!productId || !size) {
      return res.status(400).json({ message: "Invalid input" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    const sizeDetails = product.sizes.find(
      (item) => item.size.toLocaleLowerCase() === size.toLocaleLowerCase()
    );

    if (!sizeDetails) {
      return res.status(404).json({ message: "Size not found" });
    }

    const existingCartItem = user.cart.find(
      (item) => item.productId.equals(productId) && item.size === size
    );

    if (existingCartItem) {
      // If product with the same size exists then check the new total quantity
      const newQuantity = existingCartItem.quantity + quantity;
      if (newQuantity > sizeDetails.quantity) {
        return res
          .status(400)
          .json({ message: "Quantity exceeds available stock" });
      }
      existingCartItem.quantity = newQuantity;
    } else {
      if (quantity > sizeDetails.quantity) {
        return res
          .status(400)
          .json({ message: "Quantity exceeds available stock" });
      }
      user.cart.push({ productId, size, quantity });
    }
    await user.save();

    res.json({ message: "Product added to cart successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});
router.delete("/delete", authenticateToken, async (req, res) => {
  try {
    const { productId, size } = req.body;
    const userId = req.user.id;

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!Array.isArray(user.cart)) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const productIdObj = new ObjectId(productId);

    const productIndex = user.cart.findIndex(
      (item) => item.productId.equals(productIdObj) && item.size === size
    );

    if (productIndex === -1) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    user.cart.splice(productIndex, 1);
    await user.save();

    res.json({ message: "Product removed from cart successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

router.put("/update", authenticateToken, async (req, res) => {
  try {
    const { productId, size, quantity } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!productId || !size || !quantity || quantity <= 0) {
      return res.status(400).json({ message: "Invalid input" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    // New: Find the size details of the product
    const sizeDetails = product.sizes.find(
      (item) => item.size.toLocaleLowerCase() === size.toLocaleLowerCase()
    );

    if (!sizeDetails) {
      return res.status(404).json({ message: "Size not found" });
    }

    // New: Check if the updated quantity exceeds available stock
    if (quantity > sizeDetails.quantity) {
      return res
        .status(400)
        .json({ message: "Quantity exceeds available stock" });
    }

    const existingCartItem = user.cart.find(
      (item) => item.productId.equals(productId) && item.size === size
    );
    if (existingCartItem) {
      existingCartItem.quantity = quantity;
    } else {
      user.cart.push({ productId, size, quantity });
    }

    await user.save();

    res.json({ message: "Product quantity updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
