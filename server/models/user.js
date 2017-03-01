const mongoose = require('mongoose');

const User = mongoose.model('User', {
  firstname: {
    type: String,
    required: true,
    minlength: 2,
    trim: true
  },
  lastname: {
    type: String,
    required: true,
    minlength: 2,
    trim: true
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    trim: true
  }
});

module.exports = { User };
