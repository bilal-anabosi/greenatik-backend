const Checkout = require('../models/CheckoutModel');
const User = require('../models/usermodel');
const Product = require('../models/Product');

const generateOrderNumber = () => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const digits = "0123456789";
  let orderNumber = "";
  for (let i = 0; i < 2; i++) {
    orderNumber += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  for (let i = 0; i < 2; i++) {
    orderNumber += digits.charAt(Math.floor(Math.random() * digits.length));
  }
  return orderNumber;
};

async function getCheckoutDetails(req, res) {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  const userId = req.user.id;
  try {
    const checkouts = await Checkout.find({ user: userId }).populate('items.productId');

    const checkoutDetails = checkouts.map(checkout => {
      const itemsDetails = checkout.items.map(item => ({
        name: item.name,
        price: item.price,
        image: item.image,
        quantity: item.quantity,
        size: item.size,
      }));

      return {
        status: checkout.status,
        checkoutDate: checkout.createdAt,
        items: itemsDetails,
        numOrder: checkout.numOrder,
        totalAmount: checkout.total
      };
    });

    res.status(200).json(checkoutDetails);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Could not retrieve checkout details", error: error.message });
  }
}

async function createCheckout(req, res) {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: "User not authenticated" });
  }
  const { address, deliveryInstructions, paymentMethod, items, totalAfterDiscount, pointsUsed } = req.body;

  const userId = req.user.id;

  try {
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Items are required" });
    }

    const productDetails = await Promise.all(items.map(async (item) => {
      if (!item.productId || !item.size || !item.quantity) {
        throw new Error('Product ID, size, and quantity are required for each item');
      }

      const product = await Product.findById(item.productId);
      if (!product) {
        throw new Error(`Product with ID ${item.productId} not found`);
      }

      const sizeDetails = product.sizes.find(size => size.size === item.size);
      if (!sizeDetails) {
        throw new Error(`Size ${item.size} not found for product with ID ${item.productId}`);
      }

      if (sizeDetails.quantity < item.quantity) {
        throw new Error(`Insufficient quantity for size ${item.size} of product with ID ${item.productId}`);
      }

      sizeDetails.quantity -= item.quantity; // Decrement the quantity

      await product.save(); // Save the updated product

      return {
        productId: product._id,
        name: product.title,
        size: item.size,
        quantity: item.quantity,
        price: sizeDetails.regularPrice,
        image: product.images[0],
      };
    }));

    const user = await User.findById(userId);
console.log(user.points.availablePoints);
    // Ensure the total after discount is not negative
    const calculatedTotal = Math.max(0, totalAfterDiscount);

    // Deduct the used points from the user's available points
    if (pointsUsed > user.points.availablePoints) {
      return res.status(400).json({ message: "Insufficient available points" });
    }
    user.points.availablePoints -= pointsUsed;

    const checkout = await Checkout.create({
      user: userId,
      address: address,
      deliveryInstructions: deliveryInstructions,
      paymentMethod: paymentMethod,
      items: productDetails,
      numOrder: generateOrderNumber(),
      total: calculatedTotal,
    });

    user.cart = [];
    await user.save();

    res.status(201).json(checkout);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Could not create checkout", error: error.message });
  }
}









async function getAllCheckouts(req, res) {
  try {
    const checkouts = await Checkout.find()
      .populate('user', 'username email') //only taking the stuff i want
      .populate({
        path: 'items.productId',
        select: 'title category salesCount'
      });

    const checkoutDetails = checkouts.map(checkout => {
      const itemsDetails = checkout.items.map(item => ({
        productId: item.productId._id,
        name: item.productId.title,
        category: item.productId.category,
        salesCount: item.productId.salesCount,
        quantity: item.quantity,
        price: item.price,
        size: item.size,
        image: item.image,
      }));

      return {
        user: {
          id: checkout.user._id,
          name: checkout.user.username, 
          email: checkout.user.email
        },
        address: checkout.address,
        deliveryInstructions: checkout.deliveryInstructions,
        paymentMethod: checkout.paymentMethod,
        items: itemsDetails,
        numOrder: checkout.numOrder,
        status: checkout.status,
        totalAmount: checkout.total,
        checkoutDate: checkout.createdAt,
        updatedDate: checkout.updatedAt
      };
    });

    res.status(200).json(checkoutDetails);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Could not retrieve checkout details", error: error.message });
  }
}
getCheckoutByOrderNumber = async (req, res) => {
  try {
    const numOrder = req.params.numOrder;
    const checkout = await Checkout.findOne({ numOrder }).populate('user');
    if (!checkout) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json(checkout);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
markOrderAsDelivered = async (req, res) => {
  try {
    const { numOrder } = req.params;


    const order = await Checkout.findOne({ numOrder });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.status === 'delivered') {
      return res.status(400).json({ message: 'Order is already delivered' });
    }

//status update
    order.status = 'delivered';
    await order.save();

///sales count update
    for (const item of order.items) {
      const product = await Product.findById(item.productId);
      if (product) {
        product.salesCount += item.quantity;
        await product.save();
      }
    }

    res.json({ message: 'Order marked as delivered successfully' });
  } catch (error) {
    console.error('Error marking order as delivered:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
const getUserPoints = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming you have the user ID in the request object after authentication
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const availablePoints = user.points.availablePoints;
    res.json({ availablePoints });
  } catch (error) {
    console.error('Error fetching user points:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createCheckout, getCheckoutDetails ,getAllCheckouts,getCheckoutByOrderNumber,markOrderAsDelivered,getUserPoints};
