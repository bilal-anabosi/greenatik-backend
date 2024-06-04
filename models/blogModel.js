const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blogSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    readingTime: {
        type: Number,
        required: true
    },
    coverPicture: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    summary: {
        type: String,
        required: true
    },
    category: {
        type: [String],
        enum: ['lifestyle', 'family', 'recycling', 'eco-friendly', 'climate change'],
        required: true
    },
    status: {
        type: String,
        enum: ['Draft', 'Published'],
        default: 'Draft'
    }
});

module.exports = mongoose.model('Blog', blogSchema);
