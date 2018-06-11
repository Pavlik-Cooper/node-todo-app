var mongoose = require('mongoose');

var Todo = mongoose.model('Todo',{
    text: {
        type: String,
        minlength: 5
    },
    completed: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Number,
        default: null
    }
});
module.exports = {Todo};