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
  owner : { type: Schema.Types.ObjectId, ref: 'user', required: true },
  participants : [{ type: Schema.Types.ObjectId, ref: 'user' }]
});

schema.plugin(paginate);

module.exports = mongoose.model('event', schema);
