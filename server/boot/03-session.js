/**
 * Created by yotam on 25/07/2016.
 */
var loopback = require('loopback');
var LoopBackContext = require('loopback-context');
var CustomersConfigProvider = require('../services/customers-config-provider');

// Add session middleware so that it is exposed in operations hooks.
module.exports = function (app) {

  app.use(LoopBackContext.perRequest());
  app.use(loopback.token(
    {model: app.models.accessToken}
  ));
  app.use(function(req, res, next) {
    var token = req.accessToken;
    if (!token) {
      return next();
    }
    var now = new Date();
    if ( now.getTime() - token.created.getTime() < 1000 ) {
      return next();
    }
    req.accessToken.created = now;
    req.accessToken.ttl     = 4 * 604800; // extend by four weeks
    req.accessToken.save(next);
  });

  app.use(function setCurrentUser(req, res, next) {
    if (!req.accessToken) {
      return next();
    }

    app.models.User.findById(req.accessToken.userId,{include : 'roles'}, function (err, user) {
      if (err) {
        return next(err);
      }
      if (!user) {
        console.log('No user with this access token was found.');
        return next();
      }
      var loopbackContext = LoopBackContext.getCurrentContext();
      if (loopbackContext) {
        loopbackContext.set('currentUser', user);
      }
      next();
    });
  });

  CustomersConfigProvider.init(app);

};
