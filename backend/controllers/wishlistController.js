const Wishlist = require('../models/WishlistModel');
const Product = require('../models/Product');

const addItem = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const userId = req.user.id;
    const { productId, size } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const productSize = product.sizes.find(item => item.size === size);
    if (!productSize) {
      return res.status(400).json({ message: 'Size not found in product' });
    }

    const existingWishItem = await Wishlist.findOne({ user: userId, product: productId, size });
    if (existingWishItem) {
      return res.status(200).json({ message: 'Item already in wishlist', wishItem: existingWishItem });
    }

    const wishItem = new Wishlist({
      user: userId,
      product: productId,
      size,
      images: product.images
    });

    await wishItem.save();
  
  } catch (error) {
    console.error('Error adding item to wishlist:', error);
    res.status(500).json({ message: 'An error occurred while adding the item to the wishlist.' });
  }
};

const getWishlist = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'user') {
      return res.status(403).json({ message: "Not authorized" });
    }

    const wishlistItems = await Wishlist.find({ user: req.user.id }).populate('product');

    if (!wishlistItems || wishlistItems.length === 0) {
      return res.status(404).json({ message: 'Wishlist is empty' });
    }

    const products = wishlistItems.map(item => {
      const productSize = item.product.sizes.find(s => s.size === item.size);
      return {
        _id: item._id,
        product: {
          _id: item.product._id,
          title: item.product.title,
          size: item.size,
          amount: productSize ? productSize.quantity : null,
          status: item.product.inStock,
          price: productSize ? productSize.regularPrice : null,
          salePrice: productSize ? productSize.salePrice : null,
          images: item.product.images
        }
      };
    });

    res.status(200).json({ products });
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    res.status( 500).json({ message: 'Internal server error' });
  }
};

const deleteItem = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const userId = req.user.id;
    const { productId } = req.params;

    const wishlistItem = await Wishlist.findOneAndDelete({ user: userId, _id: productId });

    if (!wishlistItem) {
      return res.status(404).json({ message: 'Item not found in wishlist.' });
    }

    
  } catch (error) {
    console.error('Error deleting item from wishlist:', error);
    res.status(500).json({ message: 'An error occurred while deleting the item from the wishlist.' });
  }
};

module.exports = {
  addItem,
  getWishlist,
  deleteItem
};
