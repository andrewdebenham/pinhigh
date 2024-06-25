// setup the environment
require('dotenv').config();

// imports
const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const morgan = require('morgan');
const session = require('express-session');

const ensureLoggedIn = require('./middleware/ensureLoggedIn');
const passGlobalDataToViews = require('./middleware/passGlobalDataToViews');

const authenticationController = require('./controllers/authentication.js');
const postsController = require('./controllers/posts')

// create server
const server = express();

// connect to the database
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB ' + mongoose.connection.name);
});

// middleware
// server.use(express.json());
server.use(express.urlencoded({extended: false}));
server.use(methodOverride('_method'));
server.use(morgan('dev'));
server.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
}));
server.use(passGlobalDataToViews);

// start the server
const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log('The server is listening at https://localhost:' + port);
});

// ROUTES
server.get('/', (req, res) => {
    res.render('home.ejs');
});

// attach authentication router
server.use('/auth', authenticationController);
server.use('/posts', ensureLoggedIn, postsController);