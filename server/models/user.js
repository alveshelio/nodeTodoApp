const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    minlength: 5,
    trim: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email'
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
});

/*
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *                              Model Methods                                  *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */

//Overwriting what the server sends in the response
// we only wan to send the _id and email
UserSchema.methods.toJSON = function() {
  const user = this;
  const userObject = user.toObject();

  return _.pick(userObject, ['_id', 'email']);
};

// We are generating the token that will be used to access some sections of the site
UserSchema.methods.generateAuthToken = function() {
  const user = this;
  const access = 'auth';
  const token = jwt.sign({ _id: user._id.toHexString(), access }, 'abc123').toString();

  user.tokens.push({ access, token });

  return user.save()
    .then(() => {
      return token;
    });
};

/*
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *                             Instance Methods                                *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */

UserSchema.statics.findByToken = function(token) {
  let User = this;
  let decoded = undefined;

  try {
    decoded = jwt.verify(token, 'abc123');
  } catch( err) {
    return Promise.reject();
    /*return new Promise((resolve, reject) => {
      reject();
    });*/
  }

  return User.findOne({
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  });
};

const User = mongoose.model('User', UserSchema);

module.exports = { User };
