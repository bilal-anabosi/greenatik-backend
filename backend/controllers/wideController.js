const Product = require('../models/Product');


const allProducts= async (req, res) => {
  try {
    const LasstProductsWithSale = await Product.find()
      .sort({ createdAt: -1 })
      ;

      // Send all products in the response
      res.status(200).json({ LasstProductsWithSale });
  } catch (error) {
      // Handle errors
      console.error('Error fetching products:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
};
// Fetch latest products with sale 



module.exports = {
    allProducts 
};
