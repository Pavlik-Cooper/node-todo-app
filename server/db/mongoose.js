var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI);
// mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoAppMongoose');
module.exports = {mongoose};
