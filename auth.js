var passport = require('passport');

exports.preAuth = function(req, res) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.header('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.header('Access-Control-Allow-Credentials', true);
  res.send({success:true, user: 'username'});
};

// super important that you use "username" in the body.
exports.authenticate = function(req, res, next) {
  req.body.username = req.body.username.toLowerCase();
  var auth = passport.authenticate('local', function(err, user) {
    if(err) {return next(err);}
    if(!user) { res.sendStatus(403); }
    req.logIn(user, function(err) {
      if(err) {return next(err);}
      res.send({success:true, user: user});
    })
  })
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.header('Access-Control-Allow-Credentials', true);
  auth(req, res, next);
};

exports.getCurrentIdentity = function(req, res, next) {
  res.status(200).send(req.user);
  res.end();
}

exports.requiresApiLogin = function(req, res, next) {
  if(!req.isAuthenticated()) {
    res.status(403);
    res.end();
  } else {
    next();
  }
};

exports.requiresRole = function(role) {
  return function(req, res, next) {
    if(!req.isAuthenticated() || req.user.roles.indexOf(role) === -1) {
      res.status(403);
      res.end();
    } else {
      next();
    }
  }
}