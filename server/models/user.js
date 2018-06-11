var mongoose = require('mongoose');

var User = mongoose.model('User',{
    email: {
        type: String,
        minlength: 6,
        required: true,
        trim: true
    },
    username: {
        type: String,
        minlength: 6,
        trim: true,
        default: 'New user'
    },
    sex: {
        default: null,
        type: String,
    }
});
module.exports = {User};