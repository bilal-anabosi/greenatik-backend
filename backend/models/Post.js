const mongoose = require('mongoose');
const { Schema } = mongoose;

const AddressSchema = new Schema({
  city: { type: String, required: true },
  street: { type: String, required: true },
  zip: { type: String, required: true }
});

const PostSchema = new Schema({
  owner: { type: Schema.Types.ObjectId, ref: 'user', required: true },
  title: { type: String, required: true },
  requesting: { 
    type: String, 
    enum: ['Plastic', 'Metal', 'Paper', 'Others'], 
    required: true 
  },
  moreDetails: { type: String, default: '' },
  quantity: { type: Number, required: true },
  condition: { type: String, required: true },
  postStatus: { 
    type: String, 
    enum: ['Active', 'Disabled'], 
    default: 'Active' 
  },
  pickUpDetails: { 
    type: String, 
    enum: ['Pick Up', 'Drop Off'], 
    required: true 
  },
  address: AddressSchema,
  provided: { type: Number, default: 0 },
  percentage: { 
    type: Number, 
    default: function() {
      return this.quantity ? (this.provided / this.quantity) * 100 : 0;
    }
  }
}, { timestamps: true });

const Post = mongoose.model('Post', PostSchema);
module.exports = Post;
