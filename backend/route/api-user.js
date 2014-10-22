var User = require('mongoose').model('user');
var Joi = require('joi');
var server  = require(__dirname + '/../lib/http');

//Registrar usuário
server.route({
  method: 'POST',
  path: '/api/v1/user/register',
  handler: function(req, res){
    var user = new User(req.payload);
    user.save(function(err, doc){
      if(err)
        throw err;

      //res(doc);
    });
  },
  config: {
    validate: {
      payload: {
        name: Joi.string().min(2).max(100).default(''),
        username: Joi.string().required().min(2).max(25),
        email: Joi.string().required().email(),
        password: Joi.string().required().min(6).max(50)
      }
    }
  }
});
