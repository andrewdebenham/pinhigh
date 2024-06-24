const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user.js');
const router = express.Router();

// configure the router i.e attach routes
router.get('/sign-up', (req, res) => {
    res.render('authentication/sign-up.ejs', {error: ''});
});

router.post('/sign-up', async (req, res) => {
    // check if user exists
    const existingUser = await User.findOne({username: req.body.username});
    if (existingUser) {
        res.render('authentication/sign-up.ejs', {
            error: 'Username is not available. Please try again.'
        });
        return;
    }

    // check passwords match
    if (req.body.password !== req.body.confirmPassword) {
        res.render('authentication/sign-up.ejs', {
            error: 'Passwords do not match.'
        });
        return;
    }

    // bcrypt password and create user
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    req.body.password = hashedPassword;
    const user = await User.create(req.body);

    // sign the user in and redirect
    req.session.user = {
        username: user.username,
        _id: user._id,
    }
    res.redirect('/');
});

router.get('/sign-in', (req, res) => {
    res.render('authentication/sign-in.ejs', {error: ''});
});

router.post('/sign-in', async (req, res) => {
    // check if user exists
    const user = await User.findOne({username: req.body.username});

    if (!user) {
        res.render('authentication/sign-in.ejs', {
            error: 'Username not found.'
        });
        return;
    }

    // validate password
    const validPassword = bcrypt.compareSync(
        req.body.password,
        user.password
    );

    if (!validPassword) {
        res.render('authentication.ejs', {
            error: 'Invalid Password. Please try again.'
        });
        return;
    }

    // add user to session and redirect
    req.session.user = {
        username: user.username,
        _id: user._id
    }
    res.redirect('/');
});

router.get('/sign-out', (req, res) => {
    req.session.destroy();
    res.redirect('/');
})


// export the router
module.exports = router;