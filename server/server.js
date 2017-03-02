const { ObjectID } = require('mongodb');
const app = require('express')();
const bodyParser = require('body-parser');

const { mongoose } = require('./db/mongoose');
const { Todo } = require('./models/todo');
const { User } = require('./models/user');

const port = process.env.PORT || 3000;

app.use(bodyParser.json());

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


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = { app };