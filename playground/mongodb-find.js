// const MongoClient = require('mongodb').MongoClient;
const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');

  /* db.collection('Todos').find({
    _id: new ObjectID('58b5dde49f70c1139dc5f1b6')
  }).toArray()
    .then((docs) => {
      console.log('Todos');
      console.log(JSON.stringify(docs, undefined, 2));
  })
    .catch((err) => {
      console.log('Unable to get the todos', err);
    });*/

  db.collection('Users').find({name: 'Evan Alves'}).toArray()
    .then((users) => {
    console.log('Users');
    console.log(JSON.stringify(users, undefined, 2));
    })
    .catch((err) => {
      console.log('Unable to find the user', err);
    });
  // db.close();
});

