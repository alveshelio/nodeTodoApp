const { ObjectID } = require('mongodb');
const jwt = require('jsonwebtoken');

const { Todo } = require('../../models/todo');
const { User } = require('../../models/user');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const todos = [
  {
    _id: new ObjectID('58b78a9f225eb442977d72d7'),
    text: 'first test todo',
    _creator: userOneId
  },
  {
    _id: new ObjectID('58b78a9f225eb442977d72b8'),
    text: 'second test todo',
    _creator: userTwoId
  },
  {
    _id: new ObjectID('58b78a9f225eb442977d72c9'),
    text: 'third test todo'
  }
];

const users = [
  {
    _id: userOneId,
    email: 'test22@test22.com',
    password: 'userOnePass!',
    tokens: [{
      access: 'auth',
      token: jwt.sign({ _id: userOneId, access: 'auth' }, 'abc123').toString()
    }]
  },
  {
    _id: userTwoId,
    email: 'test33@test33.com',
    password: 'userTwoPass!',
    tokens: [{
      access: 'auth',
      token: jwt.sign({ _id: userTwoId, access: 'auth' }, 'abc123').toString()
    }]
  }
];

const populateTodos = (done) => {
  Todo.remove({})
    .then(() => {
      return Todo.insertMany(todos);
    }).then(() => done());
};

const populateUsers = (done) => {
  User.remove({})
    .then(() => {
      // We are saving each user individually in order for our
      // mongoose middleware to hash the password to run
      let userOne = new User(users[0]).save();
      let userTwo = new User(users[1]).save();

      // Since each new user returns a promise, we wait for both of them to
      // finish
      return Promise.all([userOne, userTwo]);
    })
    .then(() => done());
};

module.exports = { todos, populateTodos, users, populateUsers };