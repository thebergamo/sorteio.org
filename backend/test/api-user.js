var Lab = require('lab'),
    code = require('code'),
    server = require('../app'),
    lab = exports.lab = Lab.script();

lab.experiment('User API', function(){
  var token = '';
  lab.before(function(done){
    var mongoose = require('mongoose');
    mongoose.connection.on('connected', function(){
      mongoose.connection.db.dropDatabase(function(){
        done();
      });
    });

  });

  lab.test('/api/v1/user/register - create user', function(done){
    var options = {
      method: 'POST',
      url: '/api/v1/user/register',
      payload: {
        name: 'Marcos Vinicius',
        username: 'mbergamo',
        email: 'fakebergamo@gmail.com',
        password: 'mkmkmkmkmkmk'
      }
    };

    server.inject(options, function(response){
      var result = response.result,
          payload = options.payload;

      code.expect(response.statusCode).to.equal(200);
      code.expect(result.token).to.not.be.empty();

      token = result.token;

      done();
    });
  });

  lab.test('/api/v1/user/register - Error - Email already in use', function(done){
    var options = {
      method: 'POST',
      url: '/api/v1/user/register',
      payload: {
        name: 'Marcos Vinicius',
        username: 'mbergamo',
        email: 'fakebergamo@gmail.com',
        password: 'mkmkmkmkmkmk'
      }
    };

    server.inject(options, function(response){
      var result = response.result,
          payload = options.payload;

      code.expect(response.statusCode).to.equal(400);
      code.expect(result.message).to.equal('Email already in use');

      done();
    });
  });

  lab.test('/api/v1/user/register - Error - Username already in use', function(done){
    var options = {
      method: 'POST',
      url: '/api/v1/user/register',
      payload: {
        name: 'Marcos Vinicius',
        username: 'mbergamo',
        email: 'fakebergamo2@gmail.com',
        password: 'mkmkmkmkmkmk'
      }
    };

    server.inject(options, function(response){
      var result = response.result,
          payload = options.payload;

      code.expect(response.statusCode).to.equal(400);
      code.expect(result.message).to.equal('Username already in use');

      done();
    });
  });

  lab.test('/api/v1/user - Update User(POST)', function(done){
    var options = {
      method: 'POST',
      url: '/api/v1/user',
      payload: {
        name: 'Marcos Boss',
        username: 'mbergamo',
        /*email: 'fakebergamo@gmail.com',*/
      },
      headers: {
        'x-token': token
      }
    };

    server.inject(options, function(response){
      var result = response.result,
          payload = options.payload;

      code.expect(response.statusCode).to.equal(200);
      code.expect(result.name).to.equal(payload.name);
      code.expect(result.username).to.equal(payload.username);

      done();
    });
  });

  lab.test('/api/v1/user - Error - Update User(POST) - Token not send', function(done){
    var options = {
      method: 'POST',
      url: '/api/v1/user',
      payload: {
        name: 'Marcos Boss',
        username: 'mbergamo',
        /*email: 'fakebergamo@gmail.com',*/
      },
    };

    server.inject(options, function(response){
      var result = response.result,
          payload = options.payload;

      code.expect(response.statusCode).to.equal(401);
      code.expect(result.message).to.equal('Sorry you can\'t access here');

      done();
    });
  });

  lab.test('/api/v1/user - Error - Update User(POST) - Invalid Token', function(done){
    var options = {
      method: 'POST',
      url: '/api/v1/user',
      payload: {
        name: 'Marcos Boss',
        username: 'mbergamo',
        /*email: 'fakebergamo@gmail.com',*/
      },
      headers: {
        'x-token': 'invalid token'
      }
    };

    server.inject(options, function(response){
      var result = response.result,
          payload = options.payload;

      code.expect(response.statusCode).to.equal(403);
      code.expect(result.message).to.equal('Invalid token');

      done();
    });
  });

  lab.test('/api/v1/user - Error - Update User(POST) - User not valid for token', function(done){
    var options = {
      method: 'POST',
      url: '/api/v1/user',
      payload: {
        name: 'Marcos Boss',
        username: 'mbergamoX',
        /*email: 'fakebergamo@gmail.com',*/
      },
      headers: {
        'x-token': token
      }
    };

    server.inject(options, function(response){
      var result = response.result,
          payload = options.payload;

      code.expect(response.statusCode).to.equal(401);
      code.expect(result.message).to.equal('Token is not valid for this user');

      done();
    });
  });

  lab.test('/api/v1/user - Update User(PUT)', function(done){
    var options = {
      method: 'PUT',
      url: '/api/v1/user',
      payload: {
        name: 'Marcos Boss',
        username: 'mbergamo',
        /*email: 'fakebergamo@gmail.com',*/
      },
      headers: {
        'x-token': token
      }
    };

    server.inject(options, function(response){
      var result = response.result,
          payload = options.payload;

      code.expect(response.statusCode).to.equal(200);
      code.expect(result.name).to.equal(payload.name);
      code.expect(result.username).to.equal(payload.username);

      done();
    });
  });

  lab.test('/api/v1/user - Error - Update User(PUT) - Token not send', function(done){
    var options = {
      method: 'PUT',
      url: '/api/v1/user',
      payload: {
        name: 'Marcos Boss',
        username: 'mbergamo',
        /*email: 'fakebergamo@gmail.com',*/
      },
    };

    server.inject(options, function(response){
      var result = response.result,
          payload = options.payload;

      code.expect(response.statusCode).to.equal(401);
      code.expect(result.message).to.equal('Sorry you can\'t access here');

      done();
    });
  });

  lab.test('/api/v1/user - Error - Update User(PUT) - Invalid Token', function(done){
    var options = {
      method: 'PUT',
      url: '/api/v1/user',
      payload: {
        name: 'Marcos Boss',
        username: 'mbergamo',
        /*email: 'fakebergamo@gmail.com',*/
      },
      headers: {
        'x-token': 'invalid token'
      }
    };

    server.inject(options, function(response){
      var result = response.result,
          payload = options.payload;

      code.expect(response.statusCode).to.equal(403);
      code.expect(result.message).to.equal('Invalid token');

      done();
    });
  });

  lab.test('/api/v1/user - Error - Update User(PUT) - User not valid for token', function(done){
    var options = {
      method: 'PUT',
      url: '/api/v1/user',
      payload: {
        name: 'Marcos Boss',
        username: 'mbergamoX',
        /*email: 'fakebergamo@gmail.com',*/
      },
      headers: {
        'x-token': token
      }
    };

    server.inject(options, function(response){
      var result = response.result,
          payload = options.payload;

      code.expect(response.statusCode).to.equal(401);
      code.expect(result.message).to.equal('Token is not valid for this user');

      done();
    });
  });

  lab.test('/api/v1/user - User information', function(done){
    var options = {
      method: 'GET',
      url: '/api/v1/user',
      headers: {
        'x-token': token
      }
    };

    server.inject(options, function(response){
      var result = response.result;

      code.expect(response.statusCode).to.equal(200);
      code.expect(result.name).to.equal('Marcos Boss');
      code.expect(result.username).to.equal('mbergamo');
      code.expect(result.email).to.equal('fakebergamo@gmail.com');

      done();
    });
  });

  lab.test('/api/v1/user - Error - Token not send', function(done){
    var options = {
      method: 'GET',
      url: '/api/v1/user',
      /*headers: {
        'x-token': token
      }*/
    };

    server.inject(options, function(response){
      var result = response.result;

      code.expect(response.statusCode).to.equal(401);
      code.expect(result.message).to.equal('Sorry you can\'t access here');

      done();
    });
  });

  lab.test('/api/v1/user - Error - Token invalid', function(done){
    var options = {
      method: 'GET',
      url: '/api/v1/user',
      headers: {
        'x-token': 'invalid token'
      }
    };

    server.inject(options, function(response){
      var result = response.result;

      code.expect(response.statusCode).to.equal(403);
      code.expect(result.message).to.equal('Invalid token');

      done();
    });
  });


  lab.test('/api/v1/user/{username} - Specific user information', function(done){
    var options = {
      method: 'GET',
      url: '/api/v1/user/mbergamo',
      headers: {
        'x-token': token
      }
    };

    server.inject(options, function(response){
      var result = response.result;

      code.expect(response.statusCode).to.equal(200);
      code.expect(result.name).to.equal('Marcos Boss');
      code.expect(result.username).to.equal('mbergamo');
      code.expect(result.email).to.equal('fakebergamo@gmail.com');

      done();
    });
  });

  lab.test('/api/v1/user/{username} - Error - Token not send', function(done){
    var options = {
      method: 'GET',
      url: '/api/v1/user/mbergamo',
      /*headers: {
        'x-token': token
      }*/
    };

  server.inject(options, function(response){
      var result = response.result;

      code.expect(response.statusCode).to.equal(401);
      code.expect(result.message).to.equal('Sorry you can\'t access here');

      done();
    });
  });

  lab.test('/api/v1/user - Error - Token invalid', function(done){
    var options = {
      method: 'GET',
      url: '/api/v1/user/mbergamo',
      headers: {
        'x-token': 'invalid token'
      }
    };

    server.inject(options, function(response){
      var result = response.result;

      code.expect(response.statusCode).to.equal(403);
      code.expect(result.message).to.equal('Invalid token');

      done();
    });
  });

  lab.test('/api/v1/login - Login', function(done){
    var options = {
      method: 'POST',
      url: '/api/v1/login',
      payload: {
        username: 'mbergamo',
        password: 'mkmkmkmkmkmk'
      }
    };

    server.inject(options, function(response){
      var result = response.result,
          payload = options.payload;

      code.expect(response.statusCode).to.equal(200);
      code.expect(result.token).to.not.be.empty();

      done();
    });
  });

  lab.test('/api/v1/login - Error - Login Invalid(username)', function(done){
    var options = {
      method: 'POST',
      url: '/api/v1/login',
      payload: {
        username: 'mbergamoX',
        password: 'mkmkmkmkmkmk'
      }
    };

    server.inject(options, function(response){
      var result = response.result,
          payload = options.payload;

      code.expect(response.statusCode).to.equal(401);
      code.expect(result.message).to.equal('Invalid user or password');

      done();
    });
  });

  lab.test('/api/v1/login - Error - Login Invalid(password)', function(done){
    var options = {
      method: 'POST',
      url: '/api/v1/login',
      payload: {
        username: 'mbergamo',
        password: 'mkmkmkmkmkmkmk'
      }
    };

    server.inject(options, function(response){
      var result = response.result,
          payload = options.payload;

      code.expect(response.statusCode).to.equal(401);
      code.expect(result.message).to.equal('Invalid user or password');

      done();
    });
  });

  lab.test('/api/v1/login - Error - Login Invalid(not username send)', function(done){
    var options = {
      method: 'POST',
      url: '/api/v1/login',
      payload: {
        username: '',
        password: 'mkmkmkmkmkmkmk'
      }
    };

    server.inject(options, function(response){
      var result = response.result,
          payload = options.payload;

      code.expect(response.statusCode).to.equal(400);
      code.expect(result.message).to.equal('username is not allowed to be empty');

      done();
    });
  });

  lab.test('/api/v1/login - Error - Login Invalid(not password send)', function(done){
    var options = {
      method: 'POST',
      url: '/api/v1/login',
      payload: {
        username: 'mbergamo',
        password: ''
      }
    };

    server.inject(options, function(response){
      var result = response.result,
          payload = options.payload;

      code.expect(response.statusCode).to.equal(400);
      code.expect(result.message).to.equal('password is not allowed to be empty');

      done();
    });
  });











});
