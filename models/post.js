const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    caption: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
        required: true,
    },
    course: {
        type: String,
        required: true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    score: {
        type: Number,
        required: true,
    },
    images: [{
        type: String,
    }],
    cloudinaryId: [{
        type: String,
    }],
    // scorecard: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Scorecard',
    // },
    likedByUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    // comments - embed?
});

module.exports = mongoose.model('Post', postSchema);