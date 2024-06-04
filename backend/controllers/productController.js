const Product = require('../models/Product');

//to get all products that belong to the admin
const getProducts = async (req, res) => {
  try {
    //role ? admin ?
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: "Not authorized" });
    }
    
    const products = await Product.find({ owner: req.user.id });
//send products 
    res.status(200).json({ products });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
const createProduct = async (req, res) => {
  try {
    console.log('Request Body:', req.body);
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const sizes = JSON.parse(req.body.sizes);
    const images = req.files.map(file => file.path);
    const productData = { ...req.body, owner: req.user.id, sizes, images };
    const newProduct = new Product(productData);

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error('Error creating product:',error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
const getProductById = async (req, res) => {
  try {
    const productId = req.params.productId;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ product });
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


const updateProduct = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: "Not authorized" });
    }
    const productId = req.params.productId;
    const updatedData = { ...req.body };

    // here we see if we update images
    if (req.files && req.files.length > 0) {
      updatedData.images = req.files.map(file => file.path);
    } else {
      //if images are the same return them
      if (req.body.keepExistingImages) {
        const product = await Product.findById(productId);
        if (product) {
          updatedData.images = product.images;
        }
      }
    }
//size changed ?
    if (req.body.sizes) {
      try {
        updatedData.sizes = JSON.parse(req.body.sizes);
      } catch (error) {
        return res.status(400).json({ message: 'Invalid sizes format' });
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(productId, updatedData, { new: true });
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ updatedProduct });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
module.exports = {
  getProducts,
  createProduct,
  getProductById,
  updateProduct,
};

