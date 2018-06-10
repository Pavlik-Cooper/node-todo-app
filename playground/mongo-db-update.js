// var MongoClient = require('mongodb').MongoClient;
var {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB server');


    //findOneAndDelete
    db.collection('Users')
        .findOneAndUpdate({
            _id: new ObjectID('5b1c2b9acf584b1a684070a9')},
            {
                $set: {
                    name: 'Lol'
                },
                $inc: {
                    age: 1
                }
            },
            // optional
            {
                // by def is true (will be the original object returned)
                returnOriginal: false
            }
            ).then((res)=>{
        console.log(res);
    },(error)=>{
        console.log(error)
    });

// db.close();

});