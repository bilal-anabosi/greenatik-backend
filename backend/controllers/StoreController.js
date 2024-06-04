const Product = require('../models/Product');

// Fetch latest products
const getLatestProducts = async (req, res) => {
  try {
    const latestProducts = await Product.find({  salePrice: { $exists: false },'sizes.0.regularPrice': { $exists: true } })
                                        .sort({ createdAt: -1 })
                                        .limit(5);
                                  
    // Send the latest products in the response
    res.status(200).json({ latestProducts });
  } catch (error) {
    // Handle errors
    console.error('Error fetching latest products:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Fetch latest products with sale 
const getLatestProductsWithSale = async (req, res) => {
  try {

    const latestProductsWithSale = await Product.find({
      sizes: { $elemMatch: { salePrice: { $gt: 0 } }}})
                                        .sort({ createdAt: -1 })
                                        .limit(5);

    // Send the latest products with sale in the response
    res.status(200).json({ latestProductsWithSale });
  } catch (error) {
    // Handle errors
    console.error('Error fetching latest products with sale:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Fetch top selling products controller
const getTopSellingProducts = async (req, res) => {
  try {
    // Search for top selling products
    const topSellingProducts = await Product.find({ 'sizes.0.salePrice': { $gt: 0 } })
                                            .sort({ salesCount: -1 }); // Sort by sales count in descending order

    // Send the top selling products in the response
    res.status(200).json({ topSellingProducts });
  } catch (error) {
    // Handle errors
    console.error('Error fetching top selling products:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getProductsByCategory = async (req, res) => {
  try {
    const category = req.query.category;
    const products = await Product.find({ category }).limit(5);

    res.status(200).json({ products });

  } catch (error) {
    console.error('Error fetching products by category:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}


module.exports = {
  getLatestProducts, getLatestProductsWithSale, getTopSellingProducts, getProductsByCategory
};