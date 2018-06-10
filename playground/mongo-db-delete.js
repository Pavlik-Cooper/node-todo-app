// var MongoClient = require('mongodb').MongoClient;
var {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB server');


    //deleteMany
    // db.collection('Todos').deleteMany({text: 'text'}).then((res)=>{
    //     console.log(`${res.deletedCount} todos have been deleted`);
    // },(error)=>{
    //     console.log(error)
    // });

    // deleteOne
    // db.collection('Todos').deleteOne({text: 'Something to do'}).then((res)=>{
    //     console.log(res);
    // },(error)=>{
    //     console.log(error)
    // });

    //findOneAndDelete
    db.collection('Users').findOneAndDelete({_id: new ObjectID('5b1c2fcf31930f23f8abad78')}).then((res)=>{
        console.log(res, res.value);
    },(error)=>{
        console.log(error)
    });

// db.close();

});