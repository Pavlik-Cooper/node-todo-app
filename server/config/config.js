var env = process.env.NODE_ENV || 'development';
// on heroku this code doesn't get executed, since there is NODE_ENV variable
// if (env === 'development') {
//   process.env.PORT = 3000;
//   process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
// }
// // this code will be executed when working locally and in test mode (npm run test-watch) --
// // inside of package.json we set NODE_ENV=test (export NODE_ENV=test || SET \"NODE_ENV=test\")
// else if (env === 'test') {
//   process.env.PORT = 3000;
//   process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
// }

if (env === 'development' || env === 'test') {
    var config = require('./config.json');
    var envConfig = config[env];

    Object.keys(envConfig).forEach((key) => {
        process.env[key] = envConfig[key];
    });
}
