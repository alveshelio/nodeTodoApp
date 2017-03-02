const { ObjectID } = require('mongodb');
const { mongoose } = require('../server/db/mongoose');
const { Todo } = require('../server/models/todo');
const { User } = require('../server/models/user');

const id = '58b77e633ce35a3d5899c219';
const userId = '58b64466c544f0272395b779';

if (!ObjectID.isValid(userId)) {
  console.log('ID not valid');
}

/*
Todo.find({ _id: id })
  .then((todos) => {
    if (!todos) {
      return console.log('No Todos returned');
    }
    console.log('Todos', todos);
  });

Todo.findOne({ _id: id })
.then((todo) => {
  if (!todo) {
    return console.log('Id not found');
  }
  console.log('Todo', todo);
});

Todo.findById(id)
  .then((todo) => {
    if (!todo) {
      return console.log('Id not found');
    }
    console.log('Todo', todo);
  })
  .catch((err) => {
  console.log(err);
  });*/

User.findById(userId)
  .then((user) => {
    if(!user) {
      return console.log('User not found');
    }
    console.log('User', JSON.stringify(user, undefined, 2));
  })
  .catch((err) => {
  console.log(err);
  });
