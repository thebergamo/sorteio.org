var mongoose = require('mongoose');
var paginate = require('mongoose-paginate');
var schema = new mongoose.Schema({
  title : {
    type: String,
    required: true
  },
  begin : {
    type: Date,
    default: Date.now
  },
  end : {
    type: Date,
    default: Date.now
  },
  owner : mongoose.Schema.Types.ObjectId,
  participants : [mongoose.Schema.Types.ObjectId]
});

schema.plugin(paginate);

module.exports = mongoose.model('event', schema);
