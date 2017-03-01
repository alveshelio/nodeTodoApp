const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server');
  }

  console.log('Connected to MongoDB Server');

  // delete Many
  /*db.collection('Todos').deleteMany({text: 'Todo to be deleted'})
    .then((result) => {
      console.log(result);
    })
    .catch((err) => {
      console.log(err);
    });*/

  // delete One
  /*db.collection('Todos').deleteOne({text: 'Another Todo that will be deleted for sure'})
    .then((result) => {
      console.log(result);
    })
    .catch((err) => {
      console.log(err);
    });*/

  /*find one and delete
  db.collection('Todos').findOneAndDelete({_id: ObjectID('58b5e328bea1afb9fccbde6a')})
    .then((result) => {
      console.log(result);
    })
    .catch((err) => {
      console.log(err);
    });*/

  // db.collection('Users').deleteMany({location: 'Laval'})
  //   .then((results) => {
  //     console.log(results);
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
});
