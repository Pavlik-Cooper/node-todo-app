var request = require('supertest');
var expect = require('expect');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {ObjectID} = require('mongodb');

var todos = [{_id: new ObjectID(),
    text:'some testy text'},
    {_id: new ObjectID(),
    text:'some testy text'}];

beforeEach((done)=> {

    // remove all and insert 2 mostly for GET /todos route testing
    Todo.remove({}).then(()=> {
       return Todo.insertMany(todos);

    }).then(()=> done());

});

describe('POST /todos',()=>{
    it('should create a new todo',(done)=>{
        var text = "todo test text";
       request(app)
           .post('/todos')
           .send({text})
           .expect(200)
           .expect((res)=>{
               expect(res.body.text).toBe(text);
           })
           .end((err,res)=>{
              if (err) return done(err);

               Todo.find({text}).then((todos)=>{
                   expect(todos.length).toBe(1);
                   expect(todos[0].text).toBe(text);
                   done();
               }).catch((e)=> done(e));
           });
    });

    it('should not create todo with invalid body data',(done)=>{

        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err,res)=>{
                if (err) return done(err);

                Todo.find().then((todos)=>{
                    expect(todos.length).toBe(2);
                    done();
                }).catch((e)=> done(e));
            });
    });

    describe('GET /todos',()=>{
        it('should list all todos',(done)=>{
            request(app)
                .get('/todos')
                .expect(200)
                .expect((res)=>{
                    expect(res.body.todos.length).toBe(2);
                })
                .end(done)
        });

        it('should get todo',(done)=>{
            request(app)
                .get(`/todos/${todos[0]._id.toHexString()}`)
                .expect(200)
                .expect((res)=>{
                    expect(res.body.todo._id).toBe(todos[0]._id.toHexString());
                })
                .end(done)
        });

        it('should return 404 if todo not found', (done) => {
            var hexId = new ObjectID().toHexString();

            request(app)
                .get(`/todos/${hexId}`)
                .expect(404)
                .end(done);
        });

        it('should return 404 for non-object ids', (done) => {
            request(app)
                .get('/todos/123abc')
                .expect(404)
                .end(done);
        });


    });


});