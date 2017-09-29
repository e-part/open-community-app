'use strict';
var crypto = require('crypto');
var assert = require('assert');
var request = require('request');
var Utils = require('../services/utils');
var CustomersConfigProvider = require('../services/customers-config-provider');

module.exports = function (app) {
  
  var bodyParser = require('body-parser');
  var loopback = require('loopback');
  var passport = require('passport');

  function hasEnglishLetters(str) {
    var matchedPosition = str.search(/[a-zA-Z]/i);
    if (matchedPosition !== -1) {
      return true;
    }
    return false;
  }

  function generateKey(hmacKey, algorithm, encoding) {
    assert(hmacKey, 'HMAC key is required');
    algorithm = algorithm || 'sha1';
    encoding = encoding || 'hex';
    var hmac = crypto.createHmac(algorithm, hmacKey);
    var buf = crypto.randomBytes(32);
    hmac.update(buf);
    var key = hmac.digest(encoding);
    return key;
  }

  function profileToUser(provider, profile, options) {
    var userObj = {};
    var generatedEmail = (profile.username || profile.id) + '@loopback.' +
      (profile.provider || provider) + '.com';
    var profileEmail = (profile.emails && profile.emails[0] && profile.emails[0].value) || profile.email;
    var email = profileEmail || generatedEmail;
    var password = generateKey('password');
    var username = provider + '.' + (profile.username || profile.id);
    var photo;
    // Get user photo with error handling
    try {
      photo = profile.photos[0].value;
    }
    catch (err) {
      photo = '';
    }
    switch (provider) {
      case  'digitalTown':
        userObj.firstName = profile.first_name;
        userObj.lastName = profile.last_name;
        break;
      case  'facebook':
        userObj.firstName = profile.name.givenName;
        userObj.lastName = profile.name.familyName;
        userObj.city = profile._json.location ? profile._json.location.name : "";
        break;
      case  'facebook-mobile':
        userObj.firstName = profile.name.givenName;
        userObj.lastName = profile.name.familyName;
        userObj.city = profile._json.location ? profile._json.location.name : "";

        break;
      case  'twitter':
        if (hasEnglishLetters(profile.displayName)) {
          userObj.firstName = profile.displayName.split(" ")[0] || "";
          userObj.lastName = profile.displayName.split(" ")[1] || "";
        } else {
          userObj.firstName = profile.displayName.split(" ")[1] || "";
          userObj.lastName = profile.displayName.split(" ")[0] || "";
        }
        break;
      default:
        break;
    }
    userObj.username = username;
    userObj.password = password;
    userObj.imageUrl = photo;
    userObj.emailVerified = true;
    if (email) {
      userObj.email = email;
    }
    return userObj;
  }

  function setupProvidersConfigs(AuthProvider, passportConfigurator) {
    for (var s in config) {
      var c = config[s];

      if (c.provider != 'local') {

        var providerClass = c.provider;
        if (c.provider === 'google') {
          var providerClass = 'google-plus';
        }
        if (c.provider === 'digitalTown'){
          c.userProfile = function(token, done){
            request({
              method: 'GET',
              uri: app.get('digitalTownApi') + 'users',
              headers: {
                'Authorization': 'Bearer ' + token
              }
            }, function (error, response, body) {
              if (error || response.statusCode !== 200) {
                console.error("Error:" + JSON.stringify(error));
                done(error);
              } else {
                var data = JSON.parse(body);
                done(null, data);
              }
            });
          }
        }
        c.profileToUser = profileToUser;

        var entry = {
          name: s,
          link: c.link,
          authPath: c.authPath,
          provider: c.provider,
          class: providerClass
        };

        AuthProvider.create(entry, function (err, data) {
          console.log("provider created:" + JSON.stringify(data));
          if (err) {
            console.log(err);
          }
        });

        c.session = c.session !== false;
        passportConfigurator.configureProvider(s, c);
      }

    }
  }

  function setupAuthProviders(dtAuthProviders){
    for (var dtProvider in dtAuthProviders){
      config[dtProvider] = dtAuthProviders[dtProvider];
    }
    if (config) {

      var AuthProvider = app.models.AuthProvider;
      var loopbackPassport = require('loopback-component-passport');
      var PassportConfigurator = loopbackPassport.PassportConfigurator;
      var passportConfigurator = new PassportConfigurator(app);


      // Initialize passport
      passportConfigurator.init();

      // Set up related models
      passportConfigurator.setupModels({
        userModel: app.models.user,
        userIdentityModel: app.models.userIdentity,
        userCredentialModel: app.models.userCredential
      });

      // Configure passport strategies for third party auth providers and add them to the API
      AuthProvider.destroyAll(function (err, data) {
        if (err) {
          console.log(err);
        } else {
          setupProvidersConfigs(AuthProvider, passportConfigurator);
        }
      });


    }
  }


  function setupAuthRoutes(){
    // Third-party login success, redirect the app with the created access token.
    app.get(app.get('restApiRoot') + '/auth/account', ensureLoggedIn('/'), function (req, res, next) {
      app.models.user.update({id : req.user.id },{ lastLogin : new Date()}, function(err, result){
        if (err){
          console.log("Error: Could not save lastLogin: " + JSON.stringify(err));
        }
      });
      //Copy the cookie over for our AppAuth service that looks for accessToken cookie.
      res.cookie('accessToken', req.signedCookies['access_token'], {signed: true});
      var accessToken = req.signedCookies['access_token'];
      console.log("accessToken: " + accessToken);
      res.redirect(Utils.getClientPrefixFromRequest(app, req) + 'auth/success?userId=' + req.user.id + '&accessToken=' + accessToken);
    });

    app.get(app.get('restApiRoot') + '/auth/error', function (req, res, next) {
      console.log('Error authenticating to 3rd party')
      res.redirect(Utils.getClientPrefixFromRequest(app, req) + + 'auth/error');
    });

    app.get(app.get('restApiRoot') + '/auth/current', function (req, res, next) {
      if (!req.isAuthenticated || !req.isAuthenticated()) {
        return res.status(200).json({});
      }
      //poor man's copy
      var ret = JSON.parse(JSON.stringify(req.user));
      delete ret.password;
      res.status(200).json(ret);
    });

    app.post(app.get('restApiRoot') + '/auth/logout', function (req, res, next) {
      req.session.destroy(function (err) {
        res.sendStatus(200);
      });
    });
  }

  // to support JSON-encoded bodies
  app.use(bodyParser.json());
  // to support URL-encoded bodies
  app.use(bodyParser.urlencoded({
    extended: true
  }));

  //// The access token is only available after boot
  app.use(app.loopback.token({
    model: app.models.accessToken
  }));

  app.use(require('cookie-parser')(app.get('cookieSecret')));

  var session = require('express-session');
  var MySQLStore = require('express-mysql-session')(session);
  var options = {
    host: app.dataSources.db.connector.settings.host,
    port: app.dataSources.db.connector.settings.port,
    user: app.dataSources.db.connector.settings.user,
    password: app.dataSources.db.connector.settings.password || null,
    database: app.dataSources.db.connector.settings.database
  };
  var sessionStore = new MySQLStore(options);

  app.middleware('session', require('express-session')({
    store : sessionStore,
    secret: app.get('cookieSecret'),
    saveUninitialized: true,
    resave: true
  }));

  var config = false;
  try {
    var env = process.env.NODE_ENV || 'dev';
    config = require('../providers.' + env + '.json');
    CustomersConfigProvider.getAuthProviders(app).then(function(dtAuthProviders){
      setupAuthProviders(dtAuthProviders);
    });

  } catch (err) {
    console.error('Please configure your passport strategy in `providers.json`.');
    console.error('Copy `providers.json.template` to `providers.json` and replace the clientID/clientSecret values with your own.');
  }



  var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;

  setupAuthRoutes();


};
