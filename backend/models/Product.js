const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['FoodWare', 'Gardening', 'Pets', 'Shopping bags', 'Office', 'Skin care', 'Electronics', 'Clothing', 'Home'],
    required: true
  },
  longDescription: {
    type: String,
    required: true
  },
  sizes: [{
    size: String,
    quantity: Number,
    unit: {
      type: String,
      enum: ['clothing', 'kg', 'g', 'mL', 'L', 'number']
    },
    regularPrice: Number,
    salePrice: Number,
  }],
  images: [String],

  inStock: {
    type: Boolean,
    default: true
  },
  status: {
    type: String,
    enum: ['Active', 'Disabled'],
    default: 'Active'
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  salesCount: {
    type: Number,
    default: 0
  },
  reviews: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now // Set default value to current date/time
  }
}, {
  timestamps: true
});


const Product = mongoose.model('Product', productSchema);

module.exports = Product;
