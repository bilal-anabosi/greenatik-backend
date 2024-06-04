const mongoose = require('mongoose');
const { Schema } = mongoose;

const LikeSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'user', required: true },
  postId: { type: Schema.Types.ObjectId, ref: 'Post', required: true }
}, { timestamps: true });

const Like = mongoose.model('Like', LikeSchema);
module.exports = Like;
