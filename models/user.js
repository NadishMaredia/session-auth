let mongoose = require('mongoose');

let Schema = new mongoose.Schema({
    username: {
        type: String,
        required:[true,'Username is required']
    },
    password: {
        type: String,
        required:[true,'Password is required']
    }
});

let User = mongoose.model('User',Schema);
module.exports = User;