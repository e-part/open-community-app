'use strict';
var status = require('http-status');
var ActionsHelper = require('./../../server/services/actions-helpers');

module.exports = function (TimePledge) {
  TimePledge.validatesPresenceOf('userId');
  TimePledge.validatesPresenceOf('postId');

  // verify that session user is admin or userId is same as current user
  TimePledge.observe('before save', function validateUserId(ctx, next) {
    var currentUserId = ActionsHelper.getCurrentUserId(ctx);
    ActionsHelper.isAdmin(TimePledge.app, currentUserId).then(function (isAdmin) {
      if (isAdmin) {
        return next();
      }
      ActionsHelper.verifyDataValue(ctx, 'userId', currentUserId, next, true);

    });

  });
};
