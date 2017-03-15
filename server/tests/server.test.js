const { ObjectID, toHexString } = require('mongodb');
const expect = require('expect');
const request = require('supertest');

const { app } = require('./../server');
const { Todo } = require('./../models/todo');
const { User } = require('./../models/user');
const { todos, populateTodos, users, populateUsers } = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    const text = 'Test todo text';

    request(app)
      .post('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .send({ text })
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find({ text })
          .then((todos) => {
            expect(todos.length).toBe(1);
            expect(todos[0].text).toBe(text);
            done();
          })
          .catch((err) => done(err));
      })
  });

  it('should not create todo with invalid body data', (done) => {
    request(app)
      .post('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find()
          .then((todos) => {
            expect(todos.length).toBe(3);
            done();
          })
          .catch((err) => done(err));
      });
  });
});

describe('GET /todos', () => {
  it('should get all todos', (done) => {
    request(app)
      .get('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(1);
      })
      .end(done);
  });
});

describe('GET /todos/:id', () => {
  it('should get one todo', (done) => {
    request(app)
      .get(`/todos/${todos[1]._id.toHexString()}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[1].text);
      })
      .end(done);
  });

  it('should should not return a todo owned by another user', (done) => {
    request(app)
      .get(`/todos/${todos[1]._id.toHexString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('should return a 404 if todo not found', (done) => {
    const id = new ObjectID().toHexString();
    request(app)
      .get(`/todos/${id}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('should return a 404 for non-object ids', (done) => {
    request(app)
      .get('/todos/123abc')
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });

});

describe('DELETE /todos/:id', () => {
  it('should remove a todo from the db', (done) => {
    const id = todos[0]._id;
    request(app)
      .delete(`/todos/${id}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text)
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.findById(id)
          .then((todo) => {
            expect(todo).toNotExist();
            done();
          })
          .catch((err) => done(err));
      })
  });

  it('should not remove a todo from the db created from another user', (done) => {
    const id = todos[0]._id;
    request(app)
      .delete(`/todos/${id}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.findById(id)
          .then((todo) => {
            expect(todo).toExist();
            done();
          })
          .catch((err) => done(err));
      })
  });

  it('should return a 404 if todo not found', (done) => {
    const id = new ObjectID().toHexString();
    request(app)
      .delete(`/todos/${id}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('should return a 404 for non-object ids', (done) => {
    request(app)
      .delete('/todos/123abc')
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });
});

describe('PATCH /todos/:id', () => {
  it('should update a todo', (done) => {
    const id = todos[0]._id;
    const text = 'Updated todo from unit test';

    request(app)
      .patch(`/todos/${id}`)
      .send({ text, completed: true })
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(true);
        expect(res.body.todo.completedAt).toNotBe(null);
        expect(res.body.todo.completedAt).toBeA('number');
      })
      .end(done);
  });

  it('should not update a todo that does not belong to the user', (done) => {
    const id = todos[0]._id;
    const text = 'Updated todo from unit test';

    request(app)
      .patch(`/todos/${id}`)
      .send({ text, completed: true })
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('should clear completeAt when todo is not completed', (done) => {
    const id = todos[1]._id.toHexString();
    const text = 'Text updated again';

    request(app)
      .patch(`/todos/${id}`)
      .send({ text, completed: false })
      .set('x-auth', users[1].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(false);
        expect(res.body.todo.completedAt).toBe(null);
      })
      .end(done);
  });

  it('should return a 404 if todo not found', (done) => {
    const id = new ObjectID().toHexString();
    request(app)
      .patch(`/todos/${id}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('should return a 404 for non-object ids', (done) => {
    request(app)
      .patch('/todos/123abc')
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });
});

// GET users/me/
describe('GET /users/me', () => {
  it('it should return user if authenticated', (done) => {
    request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      })
      .end(done);

  });
  it('should return 404 if user is not authenticated', (done) => {
    request(app)
      .get('/users/me')
      .expect(401)
      .expect((res) => {
        expect(res.body).toEqual({});
      })
      .end(done);
  })
});

describe('POST /users', () => {
  it('should create a user', (done) => {
    const email = 'test44@test44.com';
    const password = '123mba$';

    request(app)
      .post('/users')
      .send({ email, password })
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toExist()
        expect(res.body._id).toExist();
        expect(res.body.email).toBe(email);
      })
      .end((err) => {
        if (err) {
          return done(err);
        }

        User.findOne({ email })
          .then((user) => {
            expect(user).toExist();
            expect(user.password).toNotBe(password);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
  });

  it('should return validation errors if request invalid', (done) => {
    const email = users[0].email;
    const password = 'abcd';

    request(app)
      .post('/users')
      .send({ email, password })
      .expect(400)
      .expect((res) => {
        expect(res.body.errors).toExist();
      })
      .end(done);
  });

  it('should not create user if email in use', (done) => {
    const email = users[0].email;
    const password = users[0].password;

    request(app)
      .post('/users')
      .send({ email, password })
      .expect(400)
      .expect((res) => {
        expect(res.body.errmsg).toExist();
      })
      .end(done);
  });
});

describe('POST /users/login', () => {
  it('should login user and return auth token', (done) => {
    const email = users[1].email;
    const password = users[1].password;
    request(app)
      .post('/users/login')
      .send({ email, password })
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toExist()
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        User.findById(users[1]._id)
          .then((user) => {
            expect(user.tokens[1]).toInclude({
              access: 'auth',
              token: res.headers['x-auth']
            });
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
  });

  it('should reject invalid login', (done) => {
    request(app)
      .post('/users/login')
      .send({ email: 'abc@abc.com', password: 'abc' })
      .expect(400)
      .expect((res) => {
        expect(res.headers['x-auth']).toNotExist()
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        User.findById(users[1]._id)
          .then((user) => {
            expect(user.tokens[1]).toNotExist();
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
  }); // /it
});

// DELETE /users/me/token
describe('DELETE /users/me/token', () => {
  it('should remove off token when logging out', (done) => {
    const token = users[0].tokens.token;
    request(app)
      .delete('/users/me/token')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toNotExist()
      })
      .end((err, res) => {
        if (err) {
          done(err);
        }

        User.findById(users[0]._id)
          .then((user) => {
            expect(user.tokens.length).toBe(0);
            done();
          })
          .catch((err) => {
            done(err);
          });
      })
  });
});