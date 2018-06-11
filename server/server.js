var express= require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {User} = require('./models/user');
var {Todo} = require('./models/todo');

var app = express();

app.use(bodyParser.json());

app.post('/todos',(req,res)=>{

    // console.log(req.body);
    var newTodo = new Todo({
        'text': req.body.text
    });

newTodo.save().then((doc)=>{
    // console.log(doc);
    res.send(doc);
},(e)=>{
    res.status(400).send(e);
});

});


var newUser = new User({
    'email': 'sfbadfbdf@gmail.com',
    'username': 'username'
});
// newUser.save().then((doc)=>{
//     console.log(doc);
// },(e)=>{
//     console.log('Unable to save todo', e)
// });

app.listen(3000,()=>{
    console.log('server up on3000')
});

module.exports = {app};