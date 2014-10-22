var mongoose = require('mongoose');
var paginate = require('mongoose-paginate');
var schema = new mongoose.Schema({
  username : {
    type: String,
    required: true
  },
  name: {
    type: String,
    default: ''
  }
  email : {
    type: String,
    required: true
  },
  password : {
    type: String,
    required: true,
  }
  created_at : {
    type: Date,
    default: Date.now
  }
});

schema.plugin(paginate);

module.exports = mongoose.model('user', schema);
