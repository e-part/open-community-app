var path = require('path');
var bcrypt = require('bcryptjs');
var _ = require("lodash");
var loopback = require('loopback');

var config = require('../../server/config.json');
var USER_ROLES = require("./../../server/services/enums").USER_ROLES;
var ActionsHelpers = require('../../server/services/actions-helpers');
var ERROR_CODES = require('../../server/services/enums').ERROR_CODES;
var NewsLetterService = require('./../../server/services/newsletter-service');
var appConfiguration = require('./../../server/services/app-configs');
var NOTIFICATION_METHODS = require("./../../server/services/enums").NOTIFICATION_METHODS;
var rawQueries = require('./../../server/services/mysql-queries-provider');
var errorsProvider = require('./../../server/services/errors-provider');
var EmailService = require('./../../server/services/email-service');
var CloudinaryService = require('./../../server/services/cloudinary-service');
var CustomersConfigProvider = require('./../../server/services/customers-config-provider');
var Utils = require('./../../server/services/utils');

function updateUserImageToCloudinary(user, userId, imageUrl) {
  if (imageUrl && imageUrl !== appConfiguration.defaultImageUrl) {
    CloudinaryService.uploadByUrl(imageUrl).then(function (result) {
      // update user
      console.log(result);
      var cloudinaryImageUrl = result.secure_url;
      user.update({id: userId}, {imageUrl: cloudinaryImageUrl}, function (err, result) {
        if (err) {
          console.error("Error: user image update to cloudinary failed");
        } else {
          console.log("user image updated");
        }

      });

    });
  }
}
function sendEmail(mailOptions, next) {
  var loopback = require('loopback');
  loopback.Email.send(mailOptions, function (err, response) {
    if (err || response[0].status !== 'sent' || response[0].reject_reason) {
      if (!err) {
        err = {error: response[0]};
      }
      console.error(" email couldn't be sent: " + JSON.stringify(err));
      return next(err);
    }
    console.log('email sent, response' + JSON.stringify(response));
    next();
  });
}
/**
 * Adds the default email subscriptions for the given userId.
 * @param userId
 */
function addDefaultUserSubscriptions(userId) {
  var defaultEvents = appConfiguration.defaultSubscriptions.EMAIL;
  var subscriptionsToAdd = [];
  var Subscription = loopback.getModel('Subscription');
  for (var i = 0; i < defaultEvents.length; i++) {
    subscriptionsToAdd.push({
      eventType: defaultEvents[i],
      method: NOTIFICATION_METHODS.EMAIL,
      userId: userId
    });
  }
  // add the subscriptions.
  Subscription.create(subscriptionsToAdd, function (err, results) {
    if (err) {
      console.error('Error : Failed to add subscriptions ', err);
    }
    // role added.
    console.log('Subscriptions added for user');
  });
}

function addRoleToNewUser(context, userInstance, next) {
  var RoleMapping = loopback.getModel('RoleMapping');
  var userRoleMapping = {
    principalType: "USER",
    principalId: userInstance.id,
    roleId: USER_ROLES.USER.id
  };
  // add the new role.
  RoleMapping.create(userRoleMapping, function (err, roleMapping) {
    if (err) {
      return next(err);
    }
    // role added.
    console.log('New user assigned with role.');
    next();
  });
}

function _createPromiseCallback() {
  var cb;

  if (!global.Promise) {
    cb = function () {
    };
    cb.promise = {};
    Object.defineProperty(cb.promise, 'then', {get: throwPromiseNotDefined});
    Object.defineProperty(cb.promise, 'catch', {get: throwPromiseNotDefined});
    return cb;
  }

  var promise = new Promise(function (resolve, reject) {
    cb = function (err, data) {
      if (err) return reject(err);
      return resolve(data);
    };
  });
  cb.promise = promise;
  return cb;
}

module.exports = function (user) {

  // Override of original implementation
  user.prototype.hasPassword = function (plain, fn) {
    if (this.password && plain) {
      if (this.isPassMigrated) { // Wordpress pass
        var hasher = require('wordpress-hash-node');
        var checked = hasher.CheckPassword(plain, this.password);
        if (checked) {
          fn(null, true);
        } else {
          return fn("Password didn't match");
        }
      } else { // Loopback pass
        bcrypt.compare(plain, this.password, function (err, isMatch) {
          if (err) return fn(err);
          fn(null, isMatch);
        });
      }

    } else {
      fn(null, false);
    }
    return fn.promise;
  };

  // Override of original implementation - I am using it until the following pull request is merged:
  // https://github.com/strongloop/loopback/pull/2523
  user.resetPasswordForInvitation = function (options, cb) {
    var DEFAULT_RESET_PW_TTL = 14 * 24 * 60 * 60; // 14 days in seconds -- NOTE: Changed by yotam

    cb = cb || _createPromiseCallback();
    var UserModel = user;
    var ttl = UserModel.settings.resetPasswordTokenTTL || DEFAULT_RESET_PW_TTL;

    options = options || {};
    if (typeof options.email !== 'string') {
      var err = new Error('Email is required');
      err.statusCode = 400;
      err.code = 'EMAIL_REQUIRED';
      cb(err);
      return cb.promise;
    }

    UserModel.findOne({where: {email: options.email}}, function (err, user) {
      if (err) {
        return cb(err);
      }
      if (!user) {
        err = new Error('Email not found');
        err.statusCode = 404;
        err.code = 'EMAIL_NOT_FOUND';
        return cb(err);
      }
      // create a short lived access token for temp login to change password
      // TODO(ritch) - eventually this should only allow password change
      user.accessTokens.create({ttl: ttl}, function (err, accessToken) {
        if (err) {
          return cb(err);
        }
        cb();
        options.fullName = user.firstName + " " + user.lastName;
        UserModel.emit('resetPasswordRequest', {
          email: options.email,
          accessToken: accessToken,
          user: user,

          options: options //  NOTE: Changed by yotam
        });
      });
    });

    return cb.promise;
  };
  // ----------- ACTION HOOKS ------------ //

  /**
   * send verification email after registration. (only for email+password users)
   */
  user.afterRemote('create', function (context, userInstance, next) {
    function buildOptions(user, userModel, mailOptions) {
      var options = {};
      options.protocol = options.protocol || 'http';
      var app = userModel.app;
      options.host = options.host || (app && Utils.getHostFromRequest(context.req)) || 'localhost';
      options.port = options.port || (app && app.get('apiPort')) || 3000;
      options.restApiRoot = options.restApiRoot || (app && app.get('restApiRoot')) || '/api';

      var displayPort = (
        (options.protocol === 'http' && options.port == '80') ||
        (options.protocol === 'https' && options.port == '443')
      ) ? '' : ':' + options.port;

      options.verifyHref = options.verifyHref ||
        options.protocol +
        '://' +
        options.host +
        displayPort +
        options.restApiRoot +
        userModel.http.path +
        userModel.sharedClass.find('confirm', true).http.path +
        '?uid=' +
        user.id +
        '&redirect=' +
        mailOptions.redirect + '&token=' + user.verificationToken;
      return options;

    }

    console.log('> user.afterRemote triggered');

    var options = {
      to: userInstance.email,
      from: 'hello@epart.co.il',
      merge: true,
      merge_language: "handlebars",
      global_merge_vars: [
        {
          "name": "userEmail", // example variable
          "content": userInstance.email
        }
      ],
      template: {
        name: "signup-confirm",
      },
      redirect: Utils.getClientPrefixFromRequest(user.app, context.req)
    };
    // Set a default token generation function if one is not provided
    var tokenGenerator = user.generateVerificationToken;

    tokenGenerator(user, function (err, token) {
      if (err) {
        return fn(err);
      }

      userInstance.verificationToken = token;
      userInstance.save(function (err) { // save token for the confirmation email verification.
        if (err) {
          fn(err);
        } else {
          var mailVariables = buildOptions(userInstance, user, options);
          options.global_merge_vars.push({name: 'confirm_url', content: mailVariables.verifyHref}); //
          sendEmail(options, next);
        }
      });
    });
  });

  user.afterRemote('login', function (context, userInstance, next) {
    user.update({id: userInstance.userId}, {lastLogin: new Date()}, function (err, result) {
      if (err) {
        console.log("Error: Could not save lastLogin: " + JSON.stringify(err));
      }
    });


    next();
  });

  user.beforeRemote('findById',function updateDeviceToken(context, userInstance, next) {
    var loopback = require('loopback');
    var lbCtx = require('loopback-context').getCurrentContext();
    var currentUser = lbCtx && lbCtx.get('currentUser');
    if (currentUser && context.req.query && context.req.query.deviceToken ){
      ActionsHelpers.createDeviceToken(currentUser.id, context.req.query.deviceToken, context.req.query.deviceType);
    }
    next();
  });
    /**
   * Include extra relations when getting only a certain user.
   */
  user.beforeRemote('findById', function includeModels(ctx, userInstance, next) {
    var filters;
    try {
      filters = JSON.parse(ctx.args.filter);
    } catch (err) {
      filters = {};
    }
    if (!filters) {
      filters = {};
    }
    if (!filters.include) {
      filters.include = [
        "roles",
        "categories",
        "committees",
        "dashboardSettings"
      ];
    }
    ctx.args.filter = JSON.stringify(filters);
    next();
  });

  /**
   * Set the username to the users email address by default.
   */
  user.observe('before save', function setDefaultUsername(ctx, next) {
    if (ctx.instance) {
      if (ctx.isNewInstance) {
        ctx.instance.username = ctx.instance.email;
      }
      ctx.instance.status = 'created';
      ctx.instance.created = Date.now();
    }
    next();
  });
  /**
   * Add user roles if specified
   */
  user.observe('after save', function (ctx, next) {
    var loopback = require('loopback');
    var lbCtx = require('loopback-context').getCurrentContext();
    var currentUser = lbCtx && lbCtx.get('currentUser');
    var Role = loopback.getModel('Role');
    var RoleMapping = loopback.getModel('RoleMapping');
    // Add role if specified.
    if (ctx.instance && ctx.instance.rolesToAssign && ctx.instance.rolesToAssign.length &&
      currentUser && _.find(currentUser.__data.roles, {name: USER_ROLES.ADMIN.value})) { // verify that user is session user is an admin.

      Role.find({where: {or: ctx.instance.rolesToAssign}}, function (err, roles) {
        if (err) {
          return next(err);
        }
        // remove existing roles for the user.
        RoleMapping.destroyAll({principalType: "USER", principalId: ctx.instance.id}, function (err, data) {
          if (err) {
            return next(err);
          }
          var createObjects = _.map(roles, function (obj) {
            return {
              principalType: "USER",
              principalId: ctx.instance.id,
              roleId: obj.id
            };
          });
          // add the new role.
          RoleMapping.create(createObjects, function (err, roleMapping) {
            if (err) {
              return next(err);
            }
            // role added.
            console.log('User assigned RoleID ' + roles[0].id + ' (' + ctx.instance.roleToAssign + ')');
            next();
          })
        });

      });
    } else {
      next();
    }

  });

  /**
   *  Subscribe new user to the newsletter.
   *  Add Default user notifications subscriptions.
   *  add default role
   */
  user.observe('after save', function registerToNotifications(ctx, next) {
    if (ctx.isNewInstance && ctx.instance){
      // subscribe to newsletter
      NewsLetterService.subscribe(user.app, ctx.instance.email, ctx.instance.firstName, ctx.instance.lastName);
      // update image url to cloudinary.
      updateUserImageToCloudinary(user, ctx.instance.id, ctx.instance.imageUrl);
      // subscribe to email notifications
      ActionsHelpers.addDefaultUserSubscriptions(ctx.instance.id,NOTIFICATION_METHODS.EMAIL);
      if (ctx.instance.rolesToAssign) { // roles are specified, no need for default role.
        return next();
      } else {
        addRoleToNewUser(ctx, ctx.instance, next);
      }
    } else {
      next();
    }
    // next();
  });
  /**
   * Handles update of related models links.
   */
  user.observe('after save', ActionsHelpers.handleLinksUpdate);

/*  user.observe('access', function filterFields(ctx, next) {
    // allow user to see only his own fields, the rest should see only whitelisted fields.

    var lbCtx = require('loopback-context').getCurrentContext();
    var currentUser = lbCtx && lbCtx.get('currentUser');
    if (!currentUser || // no session
      ( !_.find(currentUser.__data.roles, {name: USER_ROLES.ADMIN.value})) // requesting user is an admin
    ) {
      if (!ctx.query) {
        ctx.query = {};
      }
      ctx.query.fields = {
        id: true,
        firstName: true,
        lastName: true,
        imageUrl: true,
        city: true,
        occupation: true,
        email: true,
        password: true // only shown on internal queries
      };
      if (currentUser && ctx.query && ctx.query.where && ctx.query.where.id === currentUser.id) { // if a user requests it's own data he will get additional fields
        ctx.query.fields.emailVerified = true;
        ctx.query.fields.selectedCategories = true;
      }
    }

    next();
  });*/

  // ----------- REMOTE METHODS CONFIGURATION ------------ //

  user.remoteMethod('getUsersByRole', {
    accepts: [
      {arg: 'role', type: 'string', required: true},
    ],
    returns: {root: true, type: 'array'},
    http: {
      verb: 'get',
      path: '/byrole/:role'
    }
  });

  user.remoteMethod('getCurrentUser', {
    accepts: [
      {arg: 'req', type: 'object', 'http': {source: 'req'}},
      {arg: 'res', type: 'object', 'http': {source: 'res'}}

    ],
    returns: {root: true, type: 'object'},
    http: {
      verb: 'get',
      path: '/me'
    }
  });

  user.remoteMethod('unsubscribe', {
    accepts: [
      {arg: 'req', type: 'object', 'http': {source: 'req'}},
      {arg: 'res', type: 'object', 'http': {source: 'res'}},

    ],
    returns: {root: true, type: 'object'},
    http: {
      verb: 'get',
      path: '/unsubscribe'
    }
  });

  user.remoteMethod('getTopCommentingByCategoryByRole', {
    accepts: [
      {arg: 'role', type: 'string', required: true},
      {arg: 'categoryId', type: 'number', required: true}
    ],
    returns: {root: true, type: 'array'},
    http: {
      verb: 'get',
      path: '/topCommentingbyCategorybyRole'
    }
  });

  user.remoteMethod('getTopCommentingByRole', {
    accepts: [
      {arg: "options", type: "object", http: "optionsFromRequest"},
      {arg: 'role', type: 'string', required: true}
    ],
    returns: {root: true, type: 'array'},
    http: {
      verb: 'get',
      path: '/topCommentingByRole'
    }
  });

  user.remoteMethod('mostUpvotedByCategory', {
    accepts: [
      {arg: "options", type: "object", http: "optionsFromRequest"},
      {arg: 'categoryId', type: 'number', required: true}
    ],
    returns: {root: true, type: 'array'},
    http: {
      verb: 'get',
      path: '/mostUpvotedByCategory'
    }
  });

  user.remoteMethod('isFollowingUser', {
    accepts: [
      {arg: 'userId', type: 'number', required: true}
    ],
    returns: {root: true, type: 'boolean'},
    http: {
      verb: 'get',
      path: '/isFollowingUser'
    }
  });

  user.remoteMethod('votedOnePoll', {
    accepts: [
      {arg: 'userId', type: 'number', required: true}
    ],
    returns: {root: true, type: 'boolean'},
    http: {
      verb: 'get',
      path: '/votedOnePoll'
    }
  });

  user.remoteMethod('sentOneComment', {
    accepts: [
      {arg: 'userId', type: 'number', required: true}
    ],
    returns: {root: true, type: 'boolean'},
    http: {
      verb: 'get',
      path: '/sentOneComment'
    }
  });

  user.remoteMethod('requestPasswordReset', {
    accepts: [
      {arg: 'req', type: 'object', 'http': {source: 'req'}},
      {arg: 'res', type: 'object', 'http': {source: 'res'}},
      {arg: 'email', type: 'string', required: true}

    ],
    returns: {root: true, type: 'string'},
    http: {
      verb: 'post',
      path: '/requestPasswordReset'
    }
  });

  user.remoteMethod('passwordResetRedirect', {
    accepts: [
      {arg: 'req', type: 'object', 'http': {source: 'req'}},
      {arg: 'res', type: 'object', 'http': {source: 'res'}},
      {arg: 'access_token', type: 'string', required: true}
    ],
    returns: {root: true, type: 'string'},
    http: {
      verb: 'get',
      path: '/passwordResetRedirect'
    }
  });

  user.remoteMethod('passwordReset', {
    accepts: [
      {arg: 'req', type: 'object', 'http': {source: 'req'}},
      {arg: 'res', type: 'object', 'http': {source: 'res'}},
      {arg: 'password', type: 'string', required: true},
      {arg: 'confirmation', type: 'string', required: true}

    ],
    returns: {root: true, type: 'string'},
    http: {
      verb: 'post',
      path: '/passwordReset'
    }
  });

  user.remoteMethod('requestUserInvitation', {
    accepts: [
      {arg: 'req', type: 'object', 'http': {source: 'req'}},
      {arg: 'res', type: 'object', 'http': {source: 'res'}},
      {arg: 'email', type: 'string', required: true}

    ],
    returns: {root: true, type: 'string'},
    http: {
      verb: 'post',
      path: '/requestUserInvitation'
    }
  });

  user.remoteMethod('sendInvitationsToMks', {
    accepts: [
      {arg: 'req', type: 'object', 'http': {source: 'req'}},
      {arg: 'res', type: 'object', 'http': {source: 'res'}}

    ],
    returns: {root: true, type: 'string'},
    http: {
      verb: 'post',
      path: '/sendInvitationsToMks'
    }
  });


  /*
   user.remoteMethod('getUserNotifications', {
   accepts: [
   {arg: 'userId', type: 'number', required: true}
   ],
   returns: {root: true, type: 'array'},
   http: {
   verb: 'get',
   path: '/getUserNotifications'
   }
   });
   */


  // ----------- REMOTE METHODS HANDLERS ------------ //

  user.getCurrentUser =  function (req, res, cb) {
    var app = user.app;
    var AccessToken = app.models.AccessToken;
    AccessToken.findForRequest(req, {}, function (aux, accesstoken) {
      console.log(aux, accesstoken);
      if (accesstoken == undefined) {
        res.status(401);
        res.send({
          'Error': 'Unauthorized',
          'Message': 'You need to be authenticated to access this endpoint'
        });
      } else {
        var UserModel = app.models.user;
        UserModel.findById(accesstoken.userId,function (err, user) {
          res.json(user);
        });
      }
    });
  };

  user.unsubscribe = function (req, res, cb) {
    var Subscription = loopback.getModel('Subscription');

    if (bcrypt.compareSync(req.query.id, req.query.hashedId)) {
      Subscription.destroyById(req.query.subscriptionId, function (err, response) {
        if (err || !response.count) {
          return res.redirect(user.app.get('clientUrl') + "subscriptions-edit?error=true");
        } else {
          return res.redirect(user.app.get('clientUrl') + "subscriptions-edit");

        }
      });
    } else {
      return res.redirect(user.app.get('clientUrl') + "subscriptions-edit?error=true");
    }
  };


  user.passwordReset = function (req, res, password, confirmation, cb) {
    if (!req.accessToken) {
      return res.sendStatus(401);
    }

    //verify passwords match
    if (!password || !confirmation ||
      password !== confirmation) {
      return res.sendStatus(400, new Error('Passwords do not match'));
    }

    user.findById(req.accessToken.userId, function (err, user) {
      if (err) {
        return res.sendStatus(404);
      }
      // isPassMigrated is set to false to make sure that after the reset process the password hashing is no longer
      // refering to the Wordpress method.
      user.updateAttributes({password: password, isPassMigrated: false}, function (err, user) {
        if (err) {
          return res.sendStatus(404);
        }
        console.log('> password reset processed successfully');
        return res.sendStatus(200);
      });
    });
  };
  /**
   * Sends a reset password e-mail to the given e-mail.
   * @param req
   * @param res
   * @param email
   * @param cb
   */
  user.requestPasswordReset = function (req, res, email, cb) {

    console.log("in requestPasswordReset: ", email);
    user.resetPassword({
      email: email,
      options: { req: req }
    }, function (err) {
      if (err) {
        var error = new Error();
        error.status = 400;
        error.message = 'Could not reset password for given email address';
        error.code = ERROR_CODES.BAD_INPUT_EMAIL;
        return cb(error);
      }
      res.sendStatus(200);
    });

  };

  user.requestUserInvitation = function (req, res, email, cb) {

    console.log("in requestUserInvitation: ", email);
    user.resetPasswordForInvitation({
      email: email,
      template: "committee-member-invitation",
      isInvitation: true
    }, function (err) {
      if (err) {
        var error = new Error();
        error.status = 400;
        error.message = 'Could not reset password for given email address';
        error.code = ERROR_CODES.BAD_INPUT_EMAIL;
        return cb(error);
      } else {
        res.sendStatus(200);

      }
    });

  };

  /**
   * Redirects to the reset password url if access token is verified.
   * @param req
   * @param res
   * @param accessToken
   * @param cb
   * @returns {*}
   */
  user.passwordResetRedirect = function (req, res, accessToken, cb) {

    console.log("in passwordResetRedirect: ", accessToken);
    if (!req.accessToken) {
      return res.sendStatus(401);
    }
    res.redirect(Utils.getClientPrefixFromRequest(user.app, req) + "resetPassword?invitation=" + (req.query.invitation || 'false') + "&email=" + encodeURIComponent(req.query.email) + "&at=" + accessToken);

  };
  /**
   * send app invitation to every user with mk role in the DB.
   * @param req
   * @param res
   * @param cb
   */
  user.sendInvitationsToMks = function (req, res, cb) {

    // get all mks from the db.
    var ds = user.app.dataSources.db;
    ds.connector.execute(rawQueries.getAllMKsForInvitations, ['mk'], function (err, users) {
      if (err) {
        return cb(err, null);
      }
      var promises = [];
      for (var i = 0; i < users.length; i++) {     // for each mk, create an invitation promise

        var curUser = users[i];
        var email = curUser.email;
        promises.push(user.resetPasswordForInvitation({
          email: email,
          template: "mk-invitation",
          isInvitation: true
        }));
      }
      // dispatch all invitation
      Promise.all(promises).then(function (results) {
        console.log("All mk invitations sent!");
        cb(null, {});
      }, function (error) {
        console.error("Could not send all invitations, Error: " + JSON.stringify(error));
        cb(error);
      });
    });


  };

  user.getUsersByRole = function (role, cb) {
    var loopback = require('loopback');
    var Role = loopback.getModel('Role');
    var userIdList = [];
    Role.findOne({include: 'principals', where: {name: role}}, function (err, role) {
      if (!role) {
        return cb({}, false);
      }
      role.principals(function (err, principals) {
        for (var i = 0; i < principals.length; i++) {
          userIdList.push(parseInt(principals[i].principalId));
        }
        if (userIdList.length > 0) {
          user.find({where: {id: {inq: userIdList}}}, function (err, users) {
            cb(err, users);
          });
        } else {
          cb(err, false);
        }
      });
    });
  };

  user.getTopCommentingByCategoryByRole = function (role, categoryId, cb) {
    var ds = user.app.dataSources.db;
    var RESULTS_LIMIT = 10;
    ds.connector.execute(rawQueries.topCommentingMKByCategory, [role, categoryId, RESULTS_LIMIT], function (err, data) {
      if (err) {
        cb(err, null);
      }
      cb(null, data);
    });

  };

  user.mostUpvotedByCategory = function (options, categoryId, cb) {
    var ds = user.app.dataSources.db;
    var RESULTS_LIMIT = 10;

    ds.connector.execute(rawQueries.mostUpvotedByCategory, [options.customerId, categoryId, options.customerId, categoryId, RESULTS_LIMIT], function (err, data) {
      if (err) {
        cb(err, null);
      }
      cb(null, data);
    });

  };

  user.getTopCommentingByRole = function (options,role, cb) {
    var ds = user.app.dataSources.db;
    var RESULTS_LIMIT = 10;
    ds.connector.execute(rawQueries.topCommentingUserByRole, [role, options.customerId, RESULTS_LIMIT], function (err, data) {
      if (err) {
        cb(err, null);
      }
      cb(null, data);
    });

  };

  /**
   * test if userIdToCheck is followed by currentUser.
   * @param userIdToCheck
   * @param cb
   * @returns {*}
   */
  user.isFollowingUser = function (userIdToCheck, cb) {
    function getUserFollowees(userId, cb) {
      user.findById(userId, {include: 'followees'}, function (err, user) {
        if (err) {
          return cb(err, null);
        } else {
          return cb(null, user.__data.followees);
        }
      });
    }

    var loopback = require('loopback');
    var lbCtx = require('loopback-context').getCurrentContext();
    var currentUser = lbCtx && lbCtx.get('currentUser');
    if (currentUser) {
      getUserFollowees(currentUser.id, function (err, followers) {
        if (err) {
          return cb(err, null);
        }
        if (_.find(followers, {id: userIdToCheck})) {
          return cb(null, {follows: true});
        } else {
          return cb(null, {follows: false});

        }
      });
    } else {
      var authError = new Error();
      authError.status = 401;
      authError.message = 'Authorization Required';
      authError.code = 'AUTHORIZATION_REQUIRED';
      return cb(authError, null);
    }

  };

  user.votedOnePoll = function (userIdToCheck, cb) {
    var loopback = require('loopback');
    var PollVote = loopback.getModel('PollVote');
    PollVote.findOne({where: {userId: userIdToCheck}}, function (err, res) {
      if (err) {
        console.error(err);
        return cb(errorsProvider.generateError(errorsProvider.errorsMap.INTERNAL_ERROR));
      }
      if (!res) {
        return cb(null, {voted: false});
      }
      return cb(null, {voted: true});
    });
  };

  user.sentOneComment = function (userIdToCheck, cb) {
    var loopback = require('loopback');
    var Comment = loopback.getModel('Comment');
    Comment.findOne({where: {creatorId: userIdToCheck}}, function (err, res) {
      if (err) {
        console.error(err);
        return cb(errorsProvider.generateError(errorsProvider.errorsMap.INTERNAL_ERROR));
      }
      if (!res) {
        return cb(null, {commented: false});
      }
      return cb(null, {commented: true});
    });
  };


  // ----------- EVENT HOOKS ------------ //

  //send password reset link when requested
/*  user.on('resetPasswordRequest', function (info) {
    var resetOptions = info.options || {};
    var url = config.url + config.restApiRoot + '/users/passwordResetRedirect';
    var options = {
      to: info.email,
      vars: {
        resetUrl: url + '?invitation=' + (resetOptions.isInvitation || 'false') + '&email=' + encodeURIComponent(info.email) + '&access_token=' + info.accessToken.id,
        fullName: resetOptions.fullName
      },
      name : resetOptions.template || "reset"
    };
    console.log("senging reset password email for: " + info.email);
    EmailService.sendFromEpartServer(options);
  });*/

  user.on('resetPasswordRequest', function(info) {
    var resetOptions = info.options || {};
    var app = user.app;
    var url = Utils.getApiPrefixFromRequest(app, resetOptions.options.req) + app.get('restApiRoot') + '/users/passwordResetRedirect';
    var options = {
      to: info.email,
      from: resetOptions.isInvitation ? 'yossi@epart.co.il' : 'hello@epart.co.il',
      merge: true,
      merge_language: "handlebars",
      global_merge_vars: [
        {
          "name": "resetUrl", // example variable
          "content":  url + '?invitation='+ (resetOptions.isInvitation || 'false') +'&email=' + encodeURIComponent(info.email) +'&access_token=' + info.accessToken.id
        },
        {
          "name" : "fullName",
          "content" : resetOptions.fullName
        }
      ],
      template: {
        name : resetOptions.template || "reset-password"
      }
    };
    sendEmail(options, function(err){});
  });


};
