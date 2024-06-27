const Post = require('../models/post')

const passGlobalDataToViews = async (req, res, next) => {
    res.locals.user = req.session.user || null;
    res.locals.title = 'PinHigh';
    res.locals.posts = await Post.find({author: req.session.user});
    res.locals.error = '';
    next();
}

module.exports = passGlobalDataToViews;