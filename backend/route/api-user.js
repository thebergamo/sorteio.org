var User = require('mongoose').model('user');
var Joi = require('joi');
var server  = require(__dirname + '/../lib/http');
var crypt  = require(__dirname + '/../lib/crypt');
var log  = require(__dirname + '/../lib/log');
var proto = require(__dirname + '/../lib/proto');
var crypto  = require(__dirname + '/../lib/crypto');
var moment = require('moment');
var Boom = require('boom');


server.route({
  method: 'POST',
  path: '/api/v1/login',
  handler: function(request, reply){
    User.findOne({username: request.params.username}, function(err, doc){
      if(err){
        log.error('Check user error: '+err);
        return reply(Boom.notFound('Invalid user'));
      }
      delete doc.password;
      return reply(doc);

    });
    User.findOne({username: request.payload.username}, function(err, doc){
      if(err){
        log.error('Check user error: '+err);
        return reply(Boom.unauthorized('Invalid user or password'));
      }

      crypt.compare(request.payload.password, doc.password, function(err, check){
        if(err){
          log.error('Error on compare password: '+err);
          return reply(Boom.unauthorized('Invalid user or password'));
        }

        if(!check){
          return reply(Boom.unauthorized('Invalid user or password'));
        }

        var expires = moment().add('year', 1).unix();
        var token = new proto.Token({
          _id : doc._id,
          username: doc.username,
          expires: expires,
          created: moment().unix()
        });

        var encrypted = crypto.encrypt(token.toBuffer());

        return reply({
          token: encrypted.toString('base64')
        });

      });

    });

    crypt.encrypt(request.payload.password, function(err, hash){
      if(err){
        log.error('Encrypt error: '+err);
        return reply(Boom.badRequest('Try again later...'));
      }
      request.payload.password = hash;
      var user = new User(request.payload);
      user.save(function(err, doc){
        if(err){
          log.error('Save user error: '+err);
          return reply(Boom.badRequest('Try again later...'));
        }

        var expires = moment().add('year', 1).unix();
        var token = new proto.Token({
          _id : doc._id,
          username: doc.username,
          expires: expires,
          created: moment().unix()
        });

        var encrypted = crypto.encrypt(token.toBuffer());

        return reply({
          token: encrypted.toString('base64')
        });

      });
    });
  },
  config: {
    validate: {
      payload: {
        username: Joi.string().required().min(2).max(25),
        password: Joi.string().required().min(8).max(50)
      }
    }
  }
});



//Registrar usuário
server.route({
  method: 'POST',
  path: '/api/v1/user/register',
  handler: function(request, reply){
    crypt.encrypt(request.payload.password, function(err, hash){
      if(err){
        log.error('Encrypt error: '+err);
        return reply(Boom.badRequest('Try again later...'));
      }
      request.payload.password = hash;
      var user = new User(request.payload);
      user.save(function(err, doc){
        if(err){
          log.error('Save user error: '+err);
          if(err.name === 'ValidationError'){
            if(!!err.errors.email){
              return reply(Boom.badRequest('Email already in use'));
            }

            if(!!err.errors.username){
              return reply(Boom.badRequest('Username already in use'));
            }
          }
          return reply(Boom.badRequest('Try again later...'));
        }

        var expires = moment().add(1, 'year').unix();
        var token = new proto.Token({
          _id : doc._id.toString(),
          username: doc.username,
          expires: expires,
          created: moment().unix()
        });

        var encrypted = crypto.encrypt(token.toBuffer());

        return reply({
          token: encrypted.toString('base64')
        });

      });
    });
  },
  config: {
    validate: {
      payload: {
        name: Joi.string().min(2).max(100).default(''),
        username: Joi.string().required().min(2).max(25),
        email: Joi.string().required().email(),
        password: Joi.string().required().min(8).max(50)
      }
    }
  }
});

server.route({
  method: ['POST', 'PUT'],
  path: '/api/v1/user',
  handler: function(request, reply){
    //validando token
    var token = request.headers['x-token'] || '';

    if(token === ''){
      return reply(Boom.unauthorized('Sorry you can\'t access here'));
    }

    try{
      var buff = crypto.decrypt(new Buffer(token, 'base64'));
      var obj = proto.Token.decode(buff, false);

      if(obj.expires.low < (new Date().getTime() / 1000))
        return reply(Boom.forbidden('Expired authentication token.'));

      User.findById(obj._id, function(err, doc){
        if(err){
          log.error('Validate user error: '+err);
          return reply(Boom.badRequest('Invalid user'));
        }

        if(doc.username != obj.username){
          log.error('Token is not valid for this user');
          return reply(Boom.unauthorized('Token is not valid for this user'));
        }

        User.findByIdAndUpdate(obj._id, {$set: request.payload}, function(err, doc){
          if(err){
            log.error('Updating user error: '+err);
            return reply(Boom.badRequest('Update is failed'));
          }
          delete doc.password;
          return reply(doc);
        });
      });
    }catch(err){
      log.error('Validate token error: '+err);
      return reply(Boom.badRequest('Try again later...'));
    }
  },
  config: {
    validate: {
      payload: {
        name: Joi.string().min(2).max(100).optional(),
        username: Joi.string().min(2).max(25).required(),
        email: Joi.string().email().optional(),
        password: Joi.string().min(8).max(50).optional()
      }
    }
  }
});

server.route({
  method: 'GET',
  path: '/api/v1/user',
  handler: function(request, reply){
    //validando token
    var token = request.headers['x-token'] || '';

    if(token === ''){
      return reply(Boom.unauthorized('Sorry you can\'t access here'));
    }

    try{
      var buff = crypto.decrypt(new Buffer(token, 'base64'));
      var obj = proto.Token.decode(buff, false);
      if(obj.expires.low < (new Date().getTime() / 1000))
        return reply(Boom.forbidden('Expired authentication token.'));

      User.findById(obj._id, function(err, doc){
        if(err){
          log.error('Validate user error: '+err);
          return reply(Boom.badRequest('Invalid user'));
        }

        if(doc.username != obj.username){
          log.error('Token is not valid for this user');
          return reply(Boom.unauthorized('Token is not valid for this user'));
        }
        delete doc.password;
        return reply(doc);
      });
    }catch(err){
      log.error('Validate token error: '+err);
      return reply(Boom.badRequest('Try again later...'));
    }
  }
});


server.route({
  method: 'GET',
  path: '/api/v1/user/{username}',
  handler: function(request, reply){
    //validando token
    var token = request.headers['x-token'] || '';

    if(token === ''){
      return reply(Boom.unauthorized('Sorry you can\'t access here'));
    }

    try{
      var buff = crypto.decrypt(new Buffer(token, 'base64'));
      var obj = proto.Token.decode(buff, false);
      if(obj.expires.low < (new Date().getTime() / 1000))
        return reply(Boom.forbidden('Expired authentication token.'));


      User.findOne({username: request.params.username}, function(err, doc){
        if(err){
          log.error('Check user error: '+err);
          return reply(Boom.notFound('Invalid user'));
        }
        delete doc.password;
        return reply(doc);

      });
    }catch(err){
      log.error('Validate token error: '+err);
      return reply(Boom.badRequest('Try again later...'));
    }
  },
  config: {
    validate: {
      params: {
        username: Joi.string().required().min(2).max(25)
      }
    }
  }
});
