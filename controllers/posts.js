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
router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate('author');
        const alreadyLiked = post.likedByUsers.some((userId) => userId.equals(req.session.user._id));
        res.render('posts/show.ejs', {
            post: post,
            alreadyLiked: alreadyLiked,
        });
    } catch (error) {
        console.log(error);
        res.redirect('/posts');
    }
});

// create
router.post('/', upload.single('image'), async (req, res) => {
    if (req.file) {
        const imageResult = await cloudinary.uploader.upload(req.file.path);
        req.body.images = imageResult.secure_url;
        req.body.cloudinaryId = imageResult.public_id;
    }

    req.body.author = req.session.user._id;
    req.body.scoreToPar = req.body.score - req.body.par;
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
router.put('/:id', upload.single('image'), async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (req.file) {
            const imageResult = await cloudinary.uploader.upload(req.file.path);
            req.body.images = imageResult.secure_url;
            req.body.cloudinaryId = imageResult.public_id;
        }

        console.log('req.body: ', req.body)
        console.log('req.body.caption: ', req.body.caption)

        req.body.scoreToPar = req.body.score - req.body.par;

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
router.post('/:id/like', async (req, res) => {
    try {
        await Post.findByIdAndUpdate(req.params.id, {
            $push: {likedByUsers: req.session.user._id},
        });
    } catch (error) {
        console.log(error);
    }
    res.redirect('/posts/' + req.params.id);
});

// delete like
router.delete('/:id/like', async (req, res) => {
    try {
        await Post.findByIdAndUpdate(req.params.id, {
            $pull: {likedByUsers: req.session.user._id},
        });
    } catch (error) {
        console.log(error);
    }
    res.redirect('/posts/' + req.params.id);
});

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