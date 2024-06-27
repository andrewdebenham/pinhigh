const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
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
    par: {
        type: Number,
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
    scoreToPar: {
        type: Number,
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
    comments: [{
        text: String,
        username: String,
        timestamp: {
            type: Date,
            default: Date.now,
        },
    }],
});

module.exports = mongoose.model('Post', postSchema);