require('./config/config');

const port = process.env.PORT;

var express= require('express');
var bodyParser = require('body-parser');
const _ = require('lodash');

var {ObjectID} = require('mongodb');
var {mongoose} = require('./db/mongoose');
var {User} = require('./models/user');
var {Todo} = require('./models/todo');
var {authenticate} = require('./middleware/authenticate');
var app = express();

app.use(bodyParser.json());

// create user
app.post('/users',(req,res)=>{
    var body = _.pick(req.body,['email','password']);
    var user = new User(body);
    user.save().then(()=>{
        return user.generateAuthToken();
    }).then((token)=>{
        res.header('x-auth', token).send(user);
    }).catch((e)=>{
        res.status(400).send(e);
    });
});
///           middleware
app.get('/users/me',authenticate,(req,res)=>{
   res.send(req.user);
});
// generates token and sends user back
app.post('/users/login',(req,res)=>{
    var body = _.pick(req.body,['email','password']);

    User.findByCredentials(body.email, body.password).then((user)=>{
       return user.generateAuthToken().then((token)=>{
           res.header('x-auth', token).send(user);
       });
    }).catch((e)=>{
        res.status(400).send();
    });
});
// removes specified token
app.delete('/users/me/token', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(() => {
        res.status(200).send();
    }, () => {
        res.status(400).send();
    });
});

// create todo
app.post('/todos',authenticate,(req,res)=>{
    var newTodo = new Todo({
        'text': req.body.text,
        _creator: req.user._id
    });

newTodo.save().then((doc)=>{
    res.send(doc);
},(e)=>{
    res.status(400).send(e);
});

});

app.get('/',(req,res)=>{
    console.log('hi');
    res.send({hi:'there'});
});
// get all todos
app.get('/todos',authenticate, (req,res)=>{
    Todo.find({_creator: req.user._id}).then((todos)=>{
        res.send({todos});
    },(e)=>{
       res.status(404).send(e);
    });
});
// get todo by id
app.get('/todos/:id',authenticate,(req,res)=>{
    var id = req.params.id;
    if (!ObjectID.isValid(id)) return res.status(404).send({error:'Invalid id specified'});

    Todo.findOne({ _id: id, _creator: req.user._id}).then((todo)=>{
        if (!todo) return res.status(404).send({error: 'Not found'});

        res.send({todo});
    },(e)=>{
        res.status(400).send(e);
    });
});
// delete todo
app.delete('/todos/:id',authenticate,(req,res)=>{
    var id = req.params.id;
    if (!ObjectID.isValid(id)) return res.status(404).send({error:'Invalid id specified'});

    Todo.findOneAndRemove({ _id: id, _creator: req.user._id}).then((todo)=>{
        if (!todo) return res.status(404).send({error: 'Not found'});
        res.send({message:'todo deleted',todo});
    },(e)=>{
        res.status(400).send(e);
    });
});

//update todo
app.patch('/todos/:id',authenticate,(req, res)=>{
    var id = req.params.id;
    if (!ObjectID.isValid(id)) return res.status(404).send({error:'Invalid id specified'});

    // if any of properties isn't specified, they won't be updated in DB
    var body = _.pick(req.body,['completed','text']);

    if(_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }
    Todo.findOneAndUpdate({ _id: id, _creator: req.user._id},{$set: body}, {new: true}).then((todo)=>{
        if (!todo) return res.status(404).send({error: 'Not found'});
        res.send({todo});
    },(e)=>{
        res.status(400).send(e);
    });
});

app.listen(port,()=>{
    console.log(`server up on ${port}`)
});

module.exports = {app};