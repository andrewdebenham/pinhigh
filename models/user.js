const mongoose = require('mongoose');

// define the schema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
});

// compile and export the model
module.exports = mongoose.model('User', userSchema);