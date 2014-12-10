var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var schema = new mongoose.Schema({
  username : {
    type: String,
    required: true,
    index: true,
    unique: true
  },
  name: {
    type: String,
    default: ''
  },
  email : {
    type: String,
    required: true,
    index: true,
    unique: true
  },
  password : {
    type: String,
    required: true,
  },
  created_at : {
    type: Date,
    default: Date.now
  }
});

schema.plugin(uniqueValidator);

module.exports = mongoose.model('user', schema);
