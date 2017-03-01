// const MongoClient = require('mongodb').MongoClient;
const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');

  /*db.collection('Todos').findOneAndUpdate({
    _id: new ObjectID('58b5dde49f70c1139dc5f1b6')
  }, {
    $set: {
      completed: true
    }
  }, {
    returnOriginal: false
  })
    .then((results) => {
      console.log(results);
    })
    .catch((err) => {
      console.log(err);
    });*/

  db.collection('Users').findOneAndUpdate(
    {
      _id: new ObjectID('58b5e18dfee88c13ec4e98ad')
    }, {
      $set: {
        name: 'Evan Langlois Alves'
      },
      $inc: {
        age: 1
      }
    }, {
      returnOriginal: false
    })
    .then((results) => {
      console.log(results);
    })
    .catch((err) => {
      console.log(err);
    });
  // db.close();
});

