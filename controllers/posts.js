const express = require('express');
const router = express.Router();

const Post = require('../models/post');
const User = require('../models/user');

// index
router.get('/', async(req, res) => {
    const posts = await Post.find({}).populate('owner');
    res.render('home.ejs', {
        posts: posts,
    });
});

// new
router.get('/new', (req, res) => {
    res.render('posts/new.ejs');
});

// show


// create
router.post('/', async (req, res) => {
    req.body.owner = req.session.user._id;
    await Post.create(req.body);
    res.redirect('/');
});

// edit


// update


// delete


// post like


// post comment




module.exports = router;