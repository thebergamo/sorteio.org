var bcrypt = require('bcrypt');
var config = require(__dirname + '/config');
var log = require(__dirname + '/log');
var crypt = {};

crypt.encrypt = function(pass, cb){
  bcrypt.hash(pass, config.get('salt'), function(err, hash){
    if(err){
      log.error('Error on encrypt password');
      return cb(err);
    }

    return cb(null, hash);
  });
};

crypt.compare = function(pass, hash, cb){
  bcrypt.compare(pass, hash, function(err, res){
    if(err){
      log.error('Error on compare password');
      return cb(err);
    }

    return cb(null, res);
  });
};

module.exports = crypt;
