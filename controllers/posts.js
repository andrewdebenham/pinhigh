const express = require('express');
const router = express.Router();
const cloudinary = require('../middleware/cloudinary');
const upload = require('../middleware/multer');

const Post = require('../models/post');
const User = require('../models/user');

// index
router.get('/', async (req, res) => {
    const posts = await Post.find({}).populate('author');
    res.render('posts/feed.ejs', {
        posts: posts,
    });
});

// new
router.get('/new', (req, res) => {
    res.render('posts/new.ejs');
});

// show


// create
router.post('/', upload.single('image'), async (req, res) => {
    // const imageResult = await cloudinary.uploader.upload(req.file.path);
    // req.body.images = imageResult.secure_url;
    // req.body.cloudinaryId = imageResult.public_id;

    req.body.author = req.session.user._id;
    console.log(req.body);
    await Post.create(req.body);
    res.redirect('/posts');
});


// edit
router.get('/:id/edit', async (req, res) => {
    const post = await Post.findById(req.params.id);
    res.render('posts/edit.ejs', {
        post: post,
    });
});

// update
router.put('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        console.log('Req.Body: ' + req.body)
        if (post.author.equals(req.session.user._id)) {
            await post.updateOne(req.body);
        }
        res.redirect('/posts');
    } catch (error) {
        console.log(error);
        res.send('error');
    }
});

// delete
router.delete('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.author.equals(req.session.user._id)) {
            await post.deleteOne();
        }
        res.redirect('/posts');
    } catch (error) {
        console.log(error);
        res.send('error');
    } 
});

// post like


// post comment




module.exports = router;



// create new image (multiple image upload)
// router.post('/:id/images', upload.array('image', 6), async (req, res) => {
//     try {
//         const post = await Post.findById(req.params.id);
//         const imagesUrls = [];
//         const cloudinaryIds = [];

//         for (const file of req.files) {
//             const imageResult = await cloudinary.uploader.upload(file.path);
//             imagesUrls.push(imageResult.secure_url);
//             cloudinaryIds.push(imageResult.public_id);
//         }

//         if (post) {
//             await Post.findByIdAndUpdate(req.params.id, {
//                 $push: {
//                     images: { $each: imagesUrls },
//                     cloudinaryId: { $each: cloudinaryIds }
//                 },
//             });
//         };

//     } catch (error) {
//         console.log(error);
//     }
//     res.redirect('/posts/' + req.params.id);
// });