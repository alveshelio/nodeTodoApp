require('./config/config');

const { ObjectID } = require('mongodb');
const app = require('express')();
const bodyParser = require('body-parser');
const _ = require('lodash');
const jwt = require('jsonwebtoken');

const { mongoose } = require('./db/mongoose');
const { Todo } = require('./models/todo');
const { User } = require('./models/user');
const { authenticate } = require('./middleware/authenticate');

app.use(bodyParser.json());


/*
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *                               Todos routes                                  *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */

// POST /todos
app.post('/todos', (req, res) => {
  const todo = new Todo({
    text: req.body.text
  });

  todo.save()
    .then((todo) => {
      res.send(todo);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

// GET /todos
app.get('/todos', (req, res) => {
  Todo.find()
    .then((todos) => {
    res.send({ todos });
    })
    .catch((err) => res.status(400).send(err));
});

// GET /todos/:id
app.get('/todos/:id', (req, res) => {
  const id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send('The ID you provided is not valid');
  }

  Todo.findById({_id: id})
    .then((todo) => {

      if (!todo) {
        return res.status(404).send('ID not found');
      }
      res.send({ todo });
    })
    .catch((err) => {
      res.status(404).send('Id not valid');
    });
});

// DELETE /todos/:id
app.delete('/todos/:id', (req, res) => {
  const id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send('The ID you provided is not valid');
  }

  Todo.findByIdAndRemove(id)
    .then((todo) => {
      if (!todo) {
        return res.status(404).send('Todo not found');
      }
      res.status(200).send({ todo });
    })
    .catch((err) => {
      res.status(404).send(err);
    });
});

// UPDATE /todos/:id
app.patch('/todos/:id', (req, res) => {
  const id = req.params.id;
  const body = _.pick(req.body, ['text', 'completed']);

  if (!ObjectID.isValid(id)) {
    return res.status(404).send('The ID you provided is not valid');
  }

  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findByIdAndUpdate(id, { $set: body }, { new: true })
    .then((todo) => {
      if (!todo) {
        res.status(404).send('ID not found');
      }
      res.send({ todo });
    })
    .catch((err) => res.status(404).send());
});

/*
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
*                               User routes                                   *
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
*/

// POST /users
app.post('/users', (req, res) => {
  const body = _.pick(req.body, ['email', 'password']);
  const user = new User(body);

  user.save()
    .then(() =>{
      // generateAuthToken() is a method created in the user model
      return user.generateAuthToken()
    })
    .then((token) => {
      res.header('x-auth', token).send(user);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

// GET /users/me
app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});

// POST /users/login
app.post('/users/login', (req, res) => {
  const body = _.pick(req.body, ['email', 'password']);
  const email = body.email;
  const plainPassword = body.password;

  User.findByCredentials(email, plainPassword)
    .then((user) => {
      user.generateAuthToken()
        .then((token) => {
          res.header('x-auth', token).send(user);
        });
    })
    .catch((err) => {
      res.status(400).send(err);
    })
});

// POST /users/logout
app.delete('/users/me/token', authenticate, (req, res) => {
  req.user.removeToken(req.token)
    .then(() => {
      res.status(200).send();
    })
    .catch(() => {
      res.status(400).send();
    });
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

module.exports = { app };