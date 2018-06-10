// var MongoClient = require('mongodb').MongoClient;
var {MongoClient, ObjectID} = require('mongodb');

// object destructuring
var id = new ObjectID();
console.log(id);

var user = {name:'Paul',age:18};
var {name, age} = user;
// console.log(name, age);


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB server');

// Inserting
// db.collection('Todos').insertOne({
//   text: 'Something to do',
//   completed: false
// }, (err, result) => {
//   if (err) {
//     return console.log('Unable to insert todo', err);
//   }
//
//   console.log(JSON.stringify(result.ops, undefined, 2));
// });


// db.collection('Users').insertOne({
//     name: 'Paul',
//     age: 15,
//     location: 'but'
// }, (err, result) => {
//     if (err) {
//         return console.log('Unable to insert user', err);
//     }
//
//     console.log(JSON.stringify(result.ops, undefined, 2));
// });

    // fetching

    // db.collection('Todos').find({completed: true}).toArray().then((docs)=>{
    //     console.log(JSON.stringify(docs, undefined, 2));
    // },(err)=>{
    //     console.log(err);
    // });

    // fetching by id
    db.collection('Todos')
        .find({_id: new ObjectID('5b1c322c95940927c4d80765')}).toArray().then((docs)=>{
        console.log(JSON.stringify(docs, undefined, 2));
    },(err)=>{
        console.log(err);
    });
    // count
    db.collection('Todos')
        .find().count().then((count)=>{
        console.log(`Todos count: ${count}`);
    },(err)=>{
        console.log(err);
    });


});