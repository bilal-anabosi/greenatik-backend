const mongoose = require('mongoose');
const { Schema } = mongoose;

const AddressSchema = new Schema({
  city: { type: String, required: true },
  street: { type: String, required: true },
  zip: { type: String, required: true }
});

const ContributionSchema = new Schema({
  postId: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'user', required: true },
  material: { type: String, required: true },
  quantity: { type: Number, required: true },
  condition: { type: String, required: true },
  notes: { type: String, default: '' },
  address: AddressSchema,
  date: { type: Date },
  time: {type: String },
  points: {type: Number},
  status: {
    type: String,
    enum: ['not delivered', 'delivered','canceled'],
    default: 'not delivered'
  },
  createdAt: {
    type: Date,
    default: Date.now // Set default value to current date/time
  }
}, { timestamps: true });

const Contribution = mongoose.model('Contribution', ContributionSchema);
module.exports = Contribution;
