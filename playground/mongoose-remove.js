const { ObjectID } = require('mongodb');
const { mongoose } = require('../server/db/mongoose');
const { Todo } = require('../server/models/todo');
const { User } = require('../server/models/user');

const id = '58b77e633ce35a3d5899c219';
const userId = '58b64466c544f0272395b779';

if (!ObjectID.isValid(userId)) {
  console.log('ID not valid');
}

/*Todo.remove({ _id: id })
  .then((todos) => {
    if (!todos) {
      return console.log('Todo not found');
    }
    console.log('Todo removed', todos);
  });

Todo.findOneAndRemove({ _id: id })
.then((todo) => {
  if (!todo) {
    return console.log('Todo not found');
  }
  console.log('Todo', todo);
});*/

Todo.findByIdAndRemove('58b826aebea1afb9fccc1114')
  .then((todo) => {
    if(!todo) {
      return console.log('Todo not found');
    }
    console.log('Todo', JSON.stringify(todo, undefined, 2));
  })
  .catch((err) => {
  console.log(err);
  });
