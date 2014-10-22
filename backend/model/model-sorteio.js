var mongoose = require('mongoose');
var paginate = require('mongoose-paginate');
var schema = new mongoose.Schema({
  title : {
    type: String,
    required: true
  },
  prizes : [{
    name: String,
    photo: [{src: String}],
    amount: Number
  }],
  max_participants : {
    type: Number,
    default: 100
  },
  event : { type: Schema.Types.ObjectId, ref: 'event', required: true },
  participants : [{ type: Schema.Types.ObjectId, ref: 'user' }],
});

schema.plugin(paginate);

module.exports = mongoose.model('sorteio', schema);
